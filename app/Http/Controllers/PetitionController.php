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
        $results = Petition::where([])->limit(10)->offset(0)->get()->all();
        return response()-> json([
            'status' => Response::HTTP_OK,
            'data' => $results]);
    }
    public function indexMy() {
        $results = Petition::where(['created_by' => Auth::id()])->limit(10)->offset(0)->get()->all();

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
}