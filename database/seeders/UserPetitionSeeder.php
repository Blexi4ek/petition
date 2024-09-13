<?php

namespace Database\Seeders;

use App\Models\Petition;
use App\Models\User;
use App\Models\UserPetition;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class UserPetitionSeeder extends Seeder 
{
    public function run(): void
    {
        $user_ids = User::role('user')->pluck('id')->toArray();
        $petition_ids = Petition::orderBy('id', 'asc')->pluck('id')->toArray();
        foreach ($user_ids as $user_id) {
            foreach ($petition_ids as $petition_id) {
                $aaa = $petition_id;
                $petition = Petition::where(['id' => $petition_id])->first();
                if ($petition->status >= Petition::STATUS_ACTIVE ) {
                    if (fake()->numberBetween(0,100) > 50) {
                        $check = UserPetition::insert([
                            'user_id' => $user_id,
                            'petition_id' => $petition_id,
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]);
                        $casd = $check;
                    }
                }
                
            }
        }
    }
}