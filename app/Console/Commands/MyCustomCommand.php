<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Petition;
use App\Models\UserPetition;
use App\Models\User;
use Carbon\Carbon;


class MyCustomCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:my-custom-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $petitions = Petition::with(['userPetitions'])->whereIn('status', [Petition::STATUS_ACTIVE, Petition::STATUS_SUPPORTED])->cursor();



        foreach ($petitions as $petition) {
            if(Carbon::now()->diffInDays($petition->created_at) >= Petition::DAYS) {
                echo $petition->id . " " . count($petition->userPetitions) .  "\n";

                

                
            }
        }
    }
}
