<?php

namespace App\Http\Controllers;

use App\Models\Petition;
use App\Models\UserPetition;
use App\Models\User;
use Auth;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PetitionController extends Controller 
{
    public function my() {
        $results = Petition::where(['created_by' => Auth::id()])
        ->select(['petitions.*', 'users.name as userName'])
        ->join('users', 'users.id', '=', 'petitions.created_by')
        
            ->limit(10)->offset(0)->get()->all();

        return response()-> json([
            'status' => Response::HTTP_OK,
            'data' => $results]);
    }
    public function signed() {
        $user_id = 1; //to change
        //$user = User::query()->with(['signedPetitions'])->where('id', $user_id)->first();
        return response()-> json([
            'status' => Response::HTTP_OK,
            'data' => '$signs']);
    }

    
    public function index(Request $request)
    { 
        $query = Petition::select(['petitions.*', 'users.name as userName'])->join('users', 'users.id', '=', 'petitions.created_by');
       
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

        $petitions = $query->paginate(10);  
        


        return response()-> json($petitions);
    }

    public function view(Request $request)
    { 
        $query = Petition::where(['id' => $request->get('id')])
        
            ->get()->first();

        
        


        return response()->json($query);
    }

    public function delete(Request $request)
    {
        $result = Petition::where(['id' => $request->get('id')])->delete();
        if ($result) $message = true;
        else $message = false;

        return response()->json($message);
    }
}
