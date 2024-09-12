<?php

namespace App\Policies;

use App\Models\Petition;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PetitionPolicy
{
    public function view(User $user, Petition $petition): bool
    {
        if ($petition->status === Petition::STATUS_DRAFT && $petition->created_by !== $user->id ) {
            return false;
        }
        if ($petition->status === Petition::STATUS_UNMODERATED || $petition->status === Petition::STATUS_DECLINED) {
            if (!$user->can('view petitions')) {
                return false; 
            }
        }     
        return true;
    }

    public function edit(User $user, Petition $petition): bool
    {
        if (!$user) {
            return false;
        }
        if ($petition->created_by !== $user->id && !$user->hasAnyPermission(['edit petitions', 'answer petitions'])) {
            return false;
        } 
        return true;
    }

 
    public function delete(User $user, Petition $petition): bool
    {
        if (!$user) {
            return false;
        } 
        if (!$petition) {
            return false;
        } 
        if ($petition->created_by !== $user->id && !$user->hasPermissionTo('delete petitions')) {
            return false;
        } 
        return true;
    }


}
