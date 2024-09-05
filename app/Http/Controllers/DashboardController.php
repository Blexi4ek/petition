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
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;


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
        $user->payment_method_id = $request->get('card');
        $user->save();

        $paymentMethod = \Stripe\PaymentMethod::retrieve($request->get('card'));
        $paymentMethod->attach(['customer' => $user->customer_id]);

        \Stripe\Customer::update($user->customer_id, [
            'invoice_settings' => [
                'default_payment_method' => $request->get('card'),
            ],
        ]);
        

        return response()->json($request->get('card'));

    }

    public function test(){
        // app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Permission::create(['name' => 'edit petitions']);
        // Permission::create(['name' => 'delete petitions']);
        // Permission::create(['name' => 'answer petitions']);
        // Permission::create(['name' => 'change status']);

        // $role1 = Role::create(['name' => 'admin']);
        // $role1->givePermissionTo('edit petitions');
        // $role1->givePermissionTo('delete petitions');
        // $role1->givePermissionTo('change status');

        // $role2 = Role::create(['name' => 'politician']);
        // $role2->givePermissionTo('answer petitions');
        $user = User::find(28);
        // $user->assignRole('admin');
        // $user2 = User::find(29);
        // $user2->assignRole('politician');

        return response()->json($user->getAllPermissions());
    }

}
