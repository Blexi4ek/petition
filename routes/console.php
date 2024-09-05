<?php

use App\Models\Petition;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Stripe\PaymentMethod;


// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();

function createPaymentIntent($customerId, $amount, $metadata) {
    Stripe::setApiKey('sk_test_51PuW7VGTLFfQp8wwI4SSBaehDymDomYGhujNif21tYqBALy6gebB6Fxo1oNQof0c1VbuPnvPrmVSULsDEceAbqaX00z10KsoSN');

    $cards = PaymentMethod::all([
        'customer' => $customerId, 'type' => 'card'
    ]);

    $paymentIntent = PaymentIntent::create([
        'amount' => $amount,
        'currency' => 'usd',
        'customer' => $customerId,
        'payment_method' => $cards->data[0],
        'off_session' => true,
        'confirm' => true,
        'metadata' => $metadata,
    ]);
    return $paymentIntent;
}


Schedule::call(function () {
    Stripe::setApiKey('sk_test_51PuW7VGTLFfQp8wwI4SSBaehDymDomYGhujNif21tYqBALy6gebB6Fxo1oNQof0c1VbuPnvPrmVSULsDEceAbqaX00z10KsoSN');

    $petitions = Petition::join('users', 'users.id', '=', 'petitions.created_by')
        ->select('users.*', 'petitions.*', 'users.id AS usersId')
        ->where('petitions.status', '!=', Petition::STATUS_DRAFT)
        ->where(['is_paid' => 0])
        ->whereRaw('users.customer_id IS NOT NULL')
        ->whereRaw('users.payment_method_id IS NOT NULL')->get()->all();
    
    foreach($petitions as $petition) {  
        $paymentIntent = createPaymentIntent($petition->userCreator->customer_id, 1000, ['type' => 'petition_charge', 'petition_id' => strval($petition->id), 'creator_id' => strval($petition->id)]);
        $petition->is_paid = Petition::PAYMENT_ACTIVE;
        $petition->paid_at = date('Y-m-d H:i:s');
        $petition->payment_intent_id = $paymentIntent->id;
        $petition->save();
    }

    $petitions = Petition::with(['userPetitions', 'users'])->whereIn('status', [Petition::STATUS_ACTIVE, Petition::STATUS_SUPPORTED])->cursor();

    foreach ($petitions as $petition) {
        if (Carbon::parse($petition->created_at)->diffInDays(date('Y-m-d H:i:s')) >= Petition::DAYS) {
            $oldStatus = $petition->status;
            $amount = 50;
            $petition->status = Petition::STATUS_UNSUPPORTED;
            if (count($petition->userPetitions) >= Petition::MINIMUM_SIGNS) {
                $amount = 100;
                $petition->status = Petition::STATUS_WAITING_ANSWER;
            }
            foreach ($petition->userPetitions as $userPetition) {
                if (!empty($userPetition->user->customer_id) && !empty($userPetition->user->payment_method_id)) {
                    $paymentIntent = createPaymentIntent($userPetition->user->customer_id, $amount, ['type' => 'sign_charge', 'petition_id' => strval($petition->id), 'user_id' => strval($userPetition->user_id)]);
                    $userPetition->paid_at = date('Y-m-d H:i:s');
                    $userPetition->payment_intent_id = $paymentIntent->id;
                    $userPetition->save();
                }
            }
            echo $petition->id . ' ' . count($petition->userPetitions) . ' ' . Petition::itemAlias(Petition::STATUS, $oldStatus, 'label') . ' ' . Petition::itemAlias(Petition::STATUS, $petition->status, 'label') . ' ' . date('Y-m-d H:i:s', $petition->created_at) . '  ' . Carbon::parse($petition->created_at)->diffInDays(date('Y-m-d H:i:s')) .  "\n";
            $petition->save();
        }
    }
})->name('charge')->withoutOverlapping(5)->everyMinute();

