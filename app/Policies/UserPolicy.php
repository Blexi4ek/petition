<?php

namespace App\Policies;

use App\Models\Petition;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserPolicy
{
    public function view(User $user, $id): bool
    {
        if (!User::where(['id' => $id])->first()) {
            return false;
        }
        if ($user->id == $id) {
            return true;
        }
        if ($user->can('view statistics')) { //view statistics
            return true;
        }
        return false;
    }

}
