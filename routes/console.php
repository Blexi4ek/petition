<?php

use App\Models\Petition;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();



Schedule::call(function () {
    
    $petitions = Petition::with(['userPetitions'])->whereIn('status', [Petition::STATUS_ACTIVE, Petition::STATUS_SUPPORTED])->cursor();



    foreach ($petitions as $petition) {
         if (Carbon::parse($petition->created_at)->diffInDays(date('Y-m-d H:i:s')) >= Petition::DAYS) {
            $oldStatus = $petition->status;
            if (count($petition->userPetitions) >= Petition::MINIMUM_SIGNS) {
                $petition->status = Petition::STATUS_WAITING_ANSWER;
            } else {
                $petition->status = Petition::STATUS_UNSUPPORTED;
            }


            echo $petition->id . ' ' . count($petition->userPetitions) . ' ' . Petition::itemAlias(Petition::STATUS, $oldStatus, 'label') . ' ' . Petition::itemAlias(Petition::STATUS, $petition->status, 'label') . ' ' . date('Y-m-d H:i:s', $petition->created_at) . '  ' . Carbon::parse($petition->created_at)->diffInDays(date('Y-m-d H:i:s')) .  "\n";

            $petition->save();

         }
    }
})->daily();
