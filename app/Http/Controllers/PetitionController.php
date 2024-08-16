<?php

namespace App\Http\Controllers;

use App\Models\Petition;
use App\Models\UserPetition;
use App\Models\User;
use Auth;
use Illuminate\Http\Response;
use Inertia\Inertia;

class PetitionController extends Controller 
{
    public function indexAll() {
        $results = Petition::where([])

        ->limit(10)->offset(0)->get()->all();

        $totalCount = Petition::where([])->get()->all();

        return response()-> json([
            'status' => Response::HTTP_OK,
            'data' => $results,
            'count' => ceil(count($totalCount)/10)
        ]);
    }
    public function indexMy() {
        $results = Petition::where(['created_by' => Auth::id()])
        ->select(['petitions.*', 'users.name as userName'])
        ->join('users', 'users.id', '=', 'petitions.created_by')
        
            ->limit(10)->offset(0)->get()->all();

        return response()-> json([
            'status' => Response::HTTP_OK,
            'data' => $results]);
    }
    public function indexSigned() {
        $user_id = 1; //to change
        //$user = User::query()->with(['signedPetitions'])->where('id', $user_id)->first();
        return response()-> json([
            'status' => Response::HTTP_OK,
            'data' => '$signs']);
    }

    
    public function index(PetitionController $request)
    {
        $query = Petition::query();
        
      //  $filtered = $query->where(['status' => $request->selectedStatus[]]);

        $petitions = Petition::select(['petitions.*', 'users.name as userName'])
        ->join('users', 'users.id', '=', 'petitions.created_by')
        ->paginate(10);
        return response()-> json($petitions);
    }


}
