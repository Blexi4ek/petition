<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
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

class UserController extends Controller
{
    public function index (Request $request) {
        if(!Auth::user()->can('change role')) {
            return response()->json(['message' => 'Has no permission to view user list']);
        }
        $users = User::with('userRoles')->paginate(50);
        return response()->json($users);
    } 

    public function roles() {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function roleChange(Request $request) {
        if(!Auth::user()->can('change role')) {
            return response()->json(['message' => 'Has no permission to change role']);
        }
        $user = User::where(['id' => $request->get('id')])->first();
        $role = $request->get('role');
        if ($user->hasRole($role)) {
            $user->removeRole($role);
            return response()->json(['message' => "$user->name's role '$role' was successfully removed"]);
        } else {
            $user->assignRole($role);
            return response()->json(['message' => "$user->name's role '$role' was successfully added"]);
        }
    }

}
