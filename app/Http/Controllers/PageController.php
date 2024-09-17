<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\UserPetition;
use Gate;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Petition;
use App\Models\Image;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PageController extends Controller
{
    public function view (Request $request) {
        $petition = Petition::with(['userCreator', 'userModerator', 'userPolitician', 'userPetitions.user'])
        ->where(['petitions.id' => $request->get('id')])->get()->first();
        if(!Gate::allows('view-petition', $petition)) {
            return response()->json(['message' => 'User can not view this petition', 'errors' => []]);
        }
        $properties = Petition::itemAlias();
        return Inertia::render('PetitionView', [
            'petitionSSR' => $petition,
            'properties' => $properties,
        ]);
    } 



}
