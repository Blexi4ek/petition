<?php

namespace App\Providers;

use App\Policies\PetitionPolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('view-petition', [PetitionPolicy::class, 'view']);
        Gate::define('edit-petition', [PetitionPolicy::class, 'edit']);
        Gate::define('delete-petition', [PetitionPolicy::class, 'delete']);
        Gate::define('view-statistics', [UserPolicy::class, 'view']);
    }
}
