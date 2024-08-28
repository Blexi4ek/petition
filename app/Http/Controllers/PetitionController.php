<?php

namespace App\Http\Controllers;

use App\Models\Petition;
use App\Models\UserPetition;
use App\Models\User;
use Auth;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Database\Eloquent\Builder;     

class PetitionController extends Controller 
{

    private function base($request, $query) 
    {
        if (!empty($request->get('petitionStatus'))) {
            $query->whereIn('status', $request->get('petitionStatus'));
        }
        if (!empty($request->get('petitionQ'))) {
            #(
                        $query->where('petitions.name', 'like', "%{$request->get('petitionQ')}%");
            #OR
                       # $query->where('petitions.name', 'like', "%{$request->get('petition.q')}%");
            #)
            
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
        $user = $request->user()->getAttributes();
        $query = Petition::with(['userCreator']);
    
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
        $query = Petition::with(['userCreator']);
        $query->where(['created_by' => Auth::id()])
        ->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_MY));

        $query = $this->base($request, $query);
        $petitions = $query->paginate(Petition::PER_PAGE);  
        return response()->json($petitions);
    }

    public function signs(Request $request)
    { 
        $user = $request->user()->getAttributes();
        $query = Petition::with(['userCreator']);
        $query->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_SIGNS));
        $query = $this->base($request, $query);
        $query->where(['user_petition.user_id' => Auth::id()]);
        $petitions = $query->paginate(Petition::PER_PAGE);  
        return response()->json($petitions);
    }


    public function moderated(Request $request)
    { 
        $user = $request->user()->getAttributes();
        $query = Petition::with(['userCreator']);

        $query->where(function(Builder $sub_query) use ($user) {
            $sub_query->where(['status' => 2])
            ->orWhere(['status' => 3])
            ->orwhere(['moderated_by' => Auth::id()] )
            ->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_MODERATED));
        });

        $query = $this->base($request, $query);
        $petitions = $query->paginate(Petition::PER_PAGE);  
        return response()->json($petitions);
    }

    public function response(Request $request)
    { 
        $user = $request->user()->getAttributes();
        $query = Petition::with(['userCreator']);
        $query->where(['answered_by' => Auth::id()]);
        $query->whereIn('status', Petition::itemAlias('pages_dropdown', $user['role_id'], Petition::PAGE_RESPONSE));

        $query = $this->base($request, $query);
        $petitions = $query->paginate(Petition::PER_PAGE);  
        return response()->json($petitions);
    }

    public function view(Request $request)
    { 
        $query = Petition::with(['userCreator', 'userModerator', 'userPolitician', 'userPetitions.user']) ->where(['petitions.id' => $request->get('id')])->get()->first();
        return response()->json(['data' => $query]);
    }

    public function delete(Request $request)
    {   
        $result = Petition::where(['id' => $request->get('id')])->delete();
        return response()->json($result);
    }

    public function edit(Request $request) 
    {     
        $petition = new Petition();
        if ($id = $request->get('id')) {
            $petition = Petition::where(['id' => $id])->get()->first();
        }
        if ($request->isMethod('POST')) {
            $data = $request->all();
            $request->validate($petition->createUpdateValidation);
            if($id && $petition) {
                $petition->update($data);
            } else if (empty($id)) {
                $petition = $petition->create($data + ['created_by' => Auth::id(), 'status' => Petition::STATUS_DRAFT]);
            }
        } 

        return response()->json($petition);
    }

    public function sign(Request $request)
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
        Petition::where(['id' => $request->get('petition_id')])->update(['status' => $request->get('status')]);
    }

    public function staticProperties()
    {
        return response()->json(Petition::itemAlias());
        //return response()->json(Petition::itemAlias(Petition::STATUS));
       //return response()->json(Petition::itemAlias(Petition::STATUS, Petition::STATUS_DRAFT));
        //return response()->json(Petition::itemAlias(Petition::STATUS, Petition::STATUS_DRAFT, 'children'));
    }

}
