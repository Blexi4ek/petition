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

class DashboardController extends Controller
{
    
    public function create(Request $request) {
    
        $user = User::where(['id' => Auth::id()])->first();
        $check = $user->customer_id;
        $stripe = new \Stripe\StripeClient('sk_test_51PuW7VGTLFfQp8wwI4SSBaehDymDomYGhujNif21tYqBALy6gebB6Fxo1oNQof0c1VbuPnvPrmVSULsDEceAbqaX00z10KsoSN');
        \Stripe\Stripe::setApiKey('sk_test_51PuW7VGTLFfQp8wwI4SSBaehDymDomYGhujNif21tYqBALy6gebB6Fxo1oNQof0c1VbuPnvPrmVSULsDEceAbqaX00z10KsoSN');
        if (empty($user->customer_id)) {
            
            $customer = $stripe->customers->create([
                'name' => $user['name'],
                'email' => $user['email'],
            ]);
    
            if ($customer) {
                $user->customer_id = $customer->id;
                $user->save();
            }
            return response()->json($customer);
        } 

        $paymentMethod = \Stripe\PaymentMethod::retrieve($request->get('card'));
        $paymentMethod->attach(['customer' => $user->customer_id]);

        \Stripe\Customer::update($user->customer_id, [
            'invoice_settings' => [
                'default_payment_method' => $request->get('card'),
            ],
        ]);
        

        return response()->json($request->get('card'));

    }

}
