<?php

namespace App\Http\Controllers;

use App\Models\Petition;
use App\Models\UserPetition;
use App\Models\User;

use Auth;
use Gate;
use Http;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Database\Eloquent\Builder; 
use \Laracsv\Export;
use Barryvdh\DomPDF\Facade\Pdf;
use Storage;
use ZipArchive;

class PetitionController extends Controller 
{

    private function base($request, $query) 
    {
        $query->with(['userPetitions']);
        if (!empty($request->get('petitionStatus'))) {
            $query->whereIn('status', $request->get('petitionStatus'));
        }
        if (!empty($request->get('petitionQ'))) {
            $query->where(function($query1) use ($request) {
                $query1->where('petitions.name', 'like', "%{$request->get('petitionQ')}%")
                    ->orWhereRaw("MATCH(petitions.description) AGAINST ('{$request->get('petitionQ')}' IN BOOLEAN MODE)")
                    ->orWhereRaw("MATCH(petitions.answer) AGAINST ('{$request->get('petitionQ')}' IN BOOLEAN MODE)");
                }
            );            
        }         
        if (!empty($request->get('petitionCreatedAtFrom'))) {
            $query->where('petitions.created_at',  '>=' , $request->get('petitionCreatedAtFrom'));
        }
        if (!empty($request->get('petitionCreatedAtTo'))) {
            $query->where('petitions.created_at',  '<=' , $request->get('petitionCreatedAtTo'));
        }
        if (!empty($request->get('petitionActivatedAtFrom'))) {
            $query->where('petitions.activated_at',  '>=' , $request->get('petitionActivatedAtFrom'));
        }
        if (!empty($request->get('petitionActivatedAtTo'))) {
            $query->where('petitions.activated_at',  '<=' , $request->get('petitionActivatedAtTo'));
        }
        if (!empty($request->get('petitionAnsweredAtFrom'))) {
            $query->where('petitions.answered_at',  '>=' , $request->get('petitionAnsweredAtFrom'));
        }
        if (!empty($request->get('petitionAnsweredAtTo'))) {
            $query->where('petitions.answered_at',  '<=' , $request->get('petitionAnsweredAtTo'));
        }
        if(!empty($request->get('petitionUserIds'))) {

            if ($request->get('petitionUserSearchAnd') == 'true') {
                if (!empty($request->get('petitionUserSearchRole'))) {
                    if (in_array('created_by', $request->get('petitionUserSearchRole'))) {
                        $query->whereIn('created_by', $request->get('petitionUserIds'));
                    }
                    if (in_array('moderated_by', $request->get('petitionUserSearchRole'))) {
                        $query->whereIn('moderated_by', $request->get('petitionUserIds'));
                    }
                    if (in_array('answered_by', $request->get('petitionUserSearchRole'))) {
                        $query->whereIn('answered_by', $request->get('petitionUserIds'));
                    }
                }
                
            } else {
                if (!empty($request->get('petitionUserSearchRole'))) {
                    $query->where(function($query1) use ($request) {
                        if (in_array('created_by', $request->get('petitionUserSearchRole'))) {
                            $query1->orWhereIn('created_by', $request->get('petitionUserIds'));
                        }
                        if (in_array('moderated_by', $request->get('petitionUserSearchRole'))) {
                            $query1->orWhereIn('moderated_by', $request->get('petitionUserIds'));
                        }
                        if (in_array('answered_by', $request->get('petitionUserSearchRole'))) {
                            $query1->orWhereIn('answered_by', $request->get('petitionUserIds'));
                        }
                    });
                }  
            }
        }

        if (Auth::id()) {
            $query->select('petitions.*', 'user_petition.id as signId')->leftJoin('user_petition', function (JoinClause $join) {
                $join->on('petitions.id', '=' , 'user_petition.petition_id')->where('user_id', '=', Auth::id());
            });
        }

        $query->orderBy('id', 'asc');

        
        return $query;
    }

    
    public function index(Request $request)
    { 
        \Stripe\Stripe::setApiKey('sk_test_51PuW7VGTLFfQp8wwI4SSBaehDymDomYGhujNif21tYqBALy6gebB6Fxo1oNQof0c1VbuPnvPrmVSULsDEceAbqaX00z10KsoSN');

        $user = $request->user()->getAttributes();
        $query = Petition::with(['userCreator', 'userModerator', 'userPolitician']);

        if (Auth::id()) {
            $query->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_ALL));
        } else {
            $query->whereIn('status', Petition::itemAlias('pages_dropdown', User::ROLE_GUEST, Petition::PAGE_ALL));
        }

        $query = $this->base($request, $query);
        $petitions = $query->paginate(Petition::PER_PAGE);  
        return response()->json($petitions);

    }

    public function my(Request $request)
    { 
        $user = $request->user()->getAttributes();
        $query = Petition::with(['userCreator', 'userModerator', 'userPolitician']);
        $query->where(['created_by' => Auth::id()])
        ->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_MY));

        $query = $this->base($request, $query);
        $petitions = $query->paginate(Petition::PER_PAGE);  
        return response()->json($petitions);
    }

    public function signs(Request $request)
    { 
        $user = $request->user()->getAttributes();
        $query = Petition::with(['userCreator', 'userModerator', 'userPolitician']);
        $query->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_SIGNS));
        $query->where(['user_petition.user_id' => Auth::id()]);
        $query = $this->base($request, $query);
        
        $petitions = $query->paginate(Petition::PER_PAGE);  
        return response()->json($petitions);
    }


    public function moderated(Request $request)
    { 
        
        $user = $request->user();
        if (!$user->hasAnyPermission(['unmoderated2active petitions', 'unmoderated2declined petitions'])) {
            return response()->json(['message' => 'User has no this permission']);
        }
        $query = Petition::with(['userCreator', 'userModerator', 'userPolitician']);

        $query->where(function(Builder $sub_query) use ($user) {
            $sub_query->where(['status' => 2])
            ->orwhere(['moderated_by' => Auth::id()] )
            ->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_MODERATED));
        });

        $query = $this->base($request, $query);
        $petitions = $query->paginate(Petition::PER_PAGE);  
        return response()->json($petitions);
    }

    public function response(Request $request)
    {
        $user = $request->user();
        if (!$user->can('answer petitions')) {
            return response()->json(['message' => 'User does not have this permission']);
        }
        $query = Petition::with(['userCreator', 'userModerator', 'userPolitician']);
        $query->where(['answered_by' => Auth::id()])->orWhere(['status' => Petition::STATUS_WAITING_ANSWER]);
        $query->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_RESPONSE));

        $query = $this->base($request, $query);

        $petitions = $query->paginate(Petition::PER_PAGE);  

        return response()->json($petitions);
    }

    public function view(Request $request)
    { 
        $petition = Petition::with(['userCreator', 'userModerator', 'userPolitician', 'userPetitions.user'])->where(['petitions.id' => $request->get('id')])->get()->first();
        if(!Gate::allows('view-petition', $petition)) {
            return response()->json(['message' => 'User can not view this petition', 'errors' => []]);
        }
        return response()->json(['data' => $petition]);
    }

    public function delete(Request $request)
    {   
        $petition = Petition::where(['id' => $request->get('id')])->get()->first();
        if(!Gate::allows('delete-petition', $petition)) {
            return response()->json(['message' => 'User can not delete this petition', 'errors' => []]);
        }
        $result = $petition->delete();
        return response()->json($result);
    }

    public function edit(Request $request) 
    {     
        $user = Auth::user();
        $petition = new Petition();
        if ($id = $request->get('id')) {
            $petition = Petition::where(['id' => $id])->get()->first();
            if (!Gate::allows('edit-petition', $petition)) {
                return response()->json(['message' => 'User can not edit this petition', 'errors' => []]);
            }
        }
        if ($request->isMethod('POST')) {
            $data = $request->all();
            if ($request->get('status') == Petition::STATUS_ANSWER_YES || $request->get('status') == Petition::STATUS_ANSWER_NO) {
                $request->validate($petition->validationScenarios['answerValidation']);
                if ($id) {
                    if ($user->can('answer petitions')) {
                        $response = $this->status($request);
                        return response()->json($response);
                    } else {
                        return response()->json(['message' => 'No permission', 'errors' => ['User can not answer petitions']]);
                    }
                } else return response()->json(['message' => 'Petition not found']);

            } else {
                $request->validate($petition->validationScenarios['createUpdateValidation']);
            }

            if($id && $petition) {
                $petition->update($data);
            } else if (empty($id)) {
                $petition = $petition->create($data + ['created_by' => Auth::id(), 'status' => Petition::STATUS_DRAFT]);
            }
        } 

        return response()->json($petition);
    }

    public function sign($request)
    {
        $validation = UserPetition::where(['user_id' => Auth::id(), 'petition_id' => $request->get('petition_id')])->get()->first();

        $sign = new UserPetition();

        if (empty($validation->id)) {
            $sign = $sign->create(['user_id' => Auth::id(), 'petition_id' => $request->get('petition_id')]);
        }

        return response()->json($request);
    }

    public function status(Request $request)
    {
        $petition = Petition::where(['id' => $request->get('id')])->get()->first();
        
        if ($request->get('status') == Petition::STATUS_UNMODERATED) {
            $petition->update(['status' => $request->get('status')]);
            $petition->update(['moderating_started_at' => Carbon::now()]);
            return response()->json(['message' => 'Status changed successfully']);
        }

        if ($request->get('status') == Petition::STATUS_DECLINED) {
            if (Auth::user()->can('unmoderated2declined petitions')) {
                $petition->update(['status' => $request->get('status')]);
                $petition->update(['moderated_by' => Auth::id(), 'declined_at' => Carbon::now()]);
                return response()->json(['message' => 'Status changed successfully: "Declined"']);
            } else return response()->json(['message' => 'No permission to change status: "Declined"' ]);
        }

        if ($request->get('status') == Petition::STATUS_ACTIVE) {
            if (Auth::user()->can('unmoderated2active petitions')) {
                $petition->update(['status' => $request->get('status')]);
                $petition->update(['moderated_by' => Auth::id(), 'activated_at' => Carbon::now()]);
                return response()->json(['message' => 'Status changed successfully: "Active"']);
            } else return response()->json(['message' => 'No permission to change status: "Active"' ]);
        }

        if ($request->get('status') == Petition::STATUS_ANSWER_YES) {
            if (Auth::user()->can('answer_required2answer_yes petitions')) {
                $petition->update(['status' => $request->get('status')]);
                $petition->update(['answered_by' => Auth::id(), 'answered_at' => Carbon::now(), 'answer' => $request->get('answer')]);
                return response()->json(['message' => 'Status changed successfully: "Answer_yes"']);
            } else return response()->json(['message' => 'No permission to change status: "Answer_yes"' ]);
        }

        if ($request->get('status') == Petition::STATUS_ANSWER_NO) {
            if (Auth::user()->can('answer_required2answer_no petitions')) {
                $petition->update(['status' => $request->get('status')]);
                $petition->update(['answered_by' => Auth::id(), 'answered_at' => Carbon::now(), 'answer' => $request->get('answer')]);
                return response()->json(['message' => 'Status changed successfully: "Answer_no"']);
            } else return response()->json(['message' => 'No permission to change status: "Answer_no"' ]);
        }

        return response()->json(['message' => 'Wrong status provided']);
    }

    public function staticProperties()
    {
        return response()->json(Petition::itemAlias());
        //return response()->json(Petition::itemAlias(Petition::STATUS));
       //return response()->json(Petition::itemAlias(Petition::STATUS, Petition::STATUS_DRAFT));
        //return response()->json(Petition::itemAlias(Petition::STATUS, Petition::STATUS_DRAFT, 'children'));
    }

    public function searchUser(Request $request)
    {
        $query = User::where('users.name', 'like', "{$request->get('input')}%")->limit(100)->get();
        return response()->json($query);
    }

    public function handle() {
        $petitions = Petition::with(['userPetitions'])->whereIn('status', [Petition::STATUS_ACTIVE, Petition::STATUS_SUPPORTED])->cursor();

        foreach ($petitions as $petition) {
            if(Carbon::now()->diffInDays($petition->created_at) >= Petition::DAYS) {
                echo $petition->id . " " . count($petition->userPetitions) .  "\n";

            }
        }
    }

    public function pay(Request $request) {

        \Stripe\Stripe::setApiKey('sk_test_51PuW7VGTLFfQp8wwI4SSBaehDymDomYGhujNif21tYqBALy6gebB6Fxo1oNQof0c1VbuPnvPrmVSULsDEceAbqaX00z10KsoSN');

        $petition = Petition::where(['id' => $request->get('id')])->get()->first();
        if($petition->is_paid == 0) {  
            
            $id = $request->get('id');

            $paymentLink = \Stripe\PaymentLink::create([
                'line_items' => [
                    [
                        'price' => 'price_1PurtcGTLFfQp8wwkim1y4En', 
                        'quantity' => 1,
                    ],
                ],
                'customer_creation' => 'always',
                'metadata' => [
                    'item_id' => $id,
        ],
            ]);

            $paymentLinkUrl = $paymentLink->url;
        
            return response()->json($paymentLinkUrl);
        }    
    }   

    public function csvDownload(Request $request) {
        $user = $request->user()->getAttributes();
        $query = Petition::with(['userCreator', 'userModerator', 'userPolitician']);

        $pool = $request->get('pool');
        switch ($pool) {
            case 'status_my': 
                $query->where(['created_by' => Auth::id()])
                ->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_MY)); 
                break;
            case 'status_signs': 
                $query->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_SIGNS));
                $query->where(['user_petition.user_id' => Auth::id()]); 
                break;
            case 'status_moderated':
                if (!$user->hasAnyPermission(['unmoderated2active petitions', 'unmoderated2declined petitions'])) {
                    return response()->json(['message' => 'User has no this permission']);
                }
                $query->where(function(Builder $sub_query) use ($user) {
                    $sub_query->where(['status' => 2])
                    ->orWhere(['status' => 3])
                    ->orwhere(['moderated_by' => Auth::id()] )
                    ->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_MODERATED));
                }); 
                break;
            case 'status_response':
                if (!$user->can('answer petitions')) {
                    return response()->json(['message' => 'User has no this permission']);
                }
                $query->where(['answered_by' => Auth::id()]);
                $query->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_RESPONSE)); 
                break;
        }

        if (Auth::id()) {
            $query->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_ALL));
        } else {
            $query->whereIn('status', Petition::itemAlias('pages_dropdown', User::ROLE_GUEST, Petition::PAGE_ALL));
        }

        $query = $this->base($request, $query);
        $query = $query->get();
        $csvExporter = new Export();
        $csvExporter->build($query, Petition::itemAlias('csvFields'));
        

        if ($request->get('zip') === 'true') {
            $csvWriter = $csvExporter->getWriter();
            Storage::disk('local')->put('csv.csv', $csvWriter);

            $zip = new ZipArchive;
            $zipFileName = 'petitions.zip';

            if ($zip->open(public_path($zipFileName), ZipArchive::CREATE) === TRUE) {

                $zip->addFile(storage_path().'/app/csv.csv', 'petitions');
                $zip->close();

                return response()->download(public_path($zipFileName))->deleteFileAfterSend();
            } else {
                return "Failed to create the zip file.";
            }
        } else {
            $csvExporter->download('petitions.csv');
        }
        
        
    }

    public function pdf(Request $request) {

        $petition = Petition::with(['userCreator'])->where(['id' => $request->get('id')])->get()->first();
        $status = Petition::itemAlias('status', $petition->status, 'label');

        $pdf = Pdf::loadView('pdf', ['petition' => $petition, 'status' => $status, 'date' => Carbon::parse($petition->created_at)->format('d.m.Y h:i')],);
        $pdf->setOption(['defaultFont' => 'Open Sans Condensed Light']);
        return response()->download($pdf->download('invoice.pdf'));
    }

    public function curl(Request $request) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.airport.happydmitry.com/airports/locationsPrice/OZH,WRO/2250/1');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $headers = array();
        $headers[] = 'Content-Type: application/x-www-form-urlencoded';
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        }
        curl_close($ch);
        return $result;
    }
    public function curlLaravel (Request $request) {
        $response = Http::get('https://api.airport.happydmitry.com/airports/locationsPrice/OZH,WRO/2250/1');
        return response()->json($response->json());
    }
}   
