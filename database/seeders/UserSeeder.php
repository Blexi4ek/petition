<?php

namespace Database\Seeders;

use App\Models\Petition;
use App\Models\User;
use Carbon\Carbon;
use Hash;
use Illuminate\Database\Seeder;
use Str;

class UserSeeder extends Seeder 
{
    protected static ?string $password;
    public function run(): void
    {   
        for ($i = 0; $i<200; $i++) {
            $email = fake()->unique()->email();

        User::insert([
            'name' => fake()->name(),
            'email' => $email,
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $user = User::where(['email' => $email])->first();
        $random = fake()->numberBetween(1,100);
        $user->assignRole('user');
        if ($random > 80 && $random < 90) {
            $user->assignRole('admin');
        }
        if ($random >= 90 ) {
            $user->assignRole('politician');
        }
        }
        
    }
}