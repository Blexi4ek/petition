<?php

use App\Models\Petition;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote')->hourly();



Schedule::call(function () {
    
    $petitions = Petition::with(['userPetitions', 'users'])->whereIn('status', [Petition::STATUS_ACTIVE, Petition::STATUS_SUPPORTED])->cursor();
    \Stripe\Stripe::setApiKey('sk_test_51PuW7VGTLFfQp8wwI4SSBaehDymDomYGhujNif21tYqBALy6gebB6Fxo1oNQof0c1VbuPnvPrmVSULsDEceAbqaX00z10KsoSN');

    chargeCustomer('cus_Qm9czjyY5i1ff4', 10);
    chargeCustomer('cus_Qm9czjyY5i1ff4', 10);
    chargeCustomer('cus_Qm9czjyY5i1ff4', 5);
    chargeCustomer('cus_Qm9czjyY5i1ff4', 100);

    foreach ($petitions as $petition) {
        if (Carbon::parse($petition->created_at)->diffInDays(date('Y-m-d H:i:s')) >= Petition::DAYS) {
            $oldStatus = $petition->status;

            if (count($petition->userPetitions) >= Petition::MINIMUM_SIGNS) {
                $petition->status = Petition::STATUS_WAITING_ANSWER;
                foreach ($petition->users as $user) {
                    if (!empty($user->customer_id)) {
                        chargeCustomer($user->customer_id, 10);
                    }
                }
            } else {
                $petition->status = Petition::STATUS_UNSUPPORTED;
                foreach ($petition->users as $user) {
                    if (!empty($user->customer_id)) {
                        chargeCustomer($user->customer_id, 10);
                    }
                }
            }

            echo $petition->id . ' ' . count($petition->userPetitions) . ' ' . Petition::itemAlias(Petition::STATUS, $oldStatus, 'label') . ' ' . Petition::itemAlias(Petition::STATUS, $petition->status, 'label') . ' ' . date('Y-m-d H:i:s', $petition->created_at) . '  ' . Carbon::parse($petition->created_at)->diffInDays(date('Y-m-d H:i:s')) .  "\n";

            $petition->save();

        }
    }

    $users = User::where('id', '<=', '100')->get();
    

    // foreach ($users as $user) {
    //     if (empty($user->customer_id)) {
    //     $customer = $stripe->customers->create([
    //         'name' => $user['name'],
    //         'email' => $user['email'],
    //     ]);

    //     if ($customer) {
    //         $user->customer_id = $customer->id;
    //         $user->save();
    //     }
    // }}

})->everyMinute();

function chargeCustomer($customerId, $amount) {

    $paymentMethod = \Stripe\PaymentMethod::retrieve([
        'customer' => $customerId,
        'type' => 'card',
    ]);

    // Создаем намерение платежа
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => $amount,
        'currency' => 'usd',
        'customer' => $customerId,
        'payment_method' => $paymentMethod, // ID платежного метода
        'off_session' => true,
        'confirm' => true,
    ]); 

    
}