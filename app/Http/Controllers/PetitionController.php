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
       
        if (!empty($request->get('selectedStatus'))) {
            $query->whereIn('status', $request->get('selectedStatus'));
        }

        if (!empty($request->get('inputTitle'))) {
            $query->where('petitions.name', 'like', "%{$request->get('inputTitle')}%");
        }


        $petitions = $query->paginate(10);  
        


        return response()-> json($petitions);
    }


}
