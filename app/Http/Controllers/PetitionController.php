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

    
    public function index(Request $request)
    { 
        $query = Petition::with(['userCreator']);
       
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
        if($request->get('id')) {
            $petition = Petition::where(['id' => $request->get('id')])->get()->first();

            if ($request->isMethod('GET')) return response()->json($petition);
                
            if(!$petition) return abort(404);

        } else return abort(404);

        if ($request->isMethod('POST')) {

            Petition::where(['id' => $request->get('id')])
                ->update(['name' => $request->get('name'), 'description' => $request->get('description')]);

        } 
    }

}
