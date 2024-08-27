<?php

use App\Http\Controllers\PetitionController;
use App\Http\Controllers\PetitionIdController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('/api/v1/petitions/my', [PetitionController::class,'my'])->name('petition.list.my');
Route::get('/api/v1/petitions/signs', [PetitionController::class, 'signs'])->name('petition.list.signs');
Route::get('/api/v1/petitions/moderated', [PetitionController::class, 'moderated'])->name('petition.list.moderated');
Route::get('/api/v1/petitions/response', [PetitionController::class, 'response'])->name('petition.list.response');
Route::get('/api/v1/petitions', [PetitionController::class, 'index'])->name('petition.list');
Route::get('/api/v1/petitions/view', [PetitionController::class, 'view'])->name('petition.view');
Route::delete('/api/v1/petitions/delete', [PetitionController::class, 'delete'])->name('petition.delete');
Route::get('/api/v1/petitions/edit', [PetitionController::class, 'edit'])->name('petition.edit');
Route::post('/api/v1/petitions/edit', [PetitionController::class, 'edit'])->name('petition.edit');
Route::get('/api/v1/petitions/staticProperties', [PetitionController::class, 'staticProperties'])->name('petition.staticProperties');
Route::post('/api/v1/petitions/sign', [PetitionController::class, 'sign'])->name('petition.sign');

Route::get('/petitions', function () {
    return Inertia::render('Petitions');
})->middleware(['auth', 'verified'])->name('petitions');

Route::get('/petitions/my', function () {
    return Inertia::render('Petitions');
})->middleware(['auth', 'verified'])->name('petitions/my');

Route::get('/petitions/signs', function () {
    return Inertia::render('Petitions');
})->middleware(['auth', 'verified'])->name('petitions/signs');

Route::get('/petitions/moderated', function () {
    return Inertia::render('Petitions');
})->middleware(['auth', 'verified'])->name('petitions/moderated');

Route::get('/petitions/response', function () {
    return Inertia::render('Petitions');
})->middleware(['auth', 'verified'])->name('petitions/response');

Route::get('/petitions/view', function () {
    return Inertia::render('PetitionView');
})->middleware(['auth', 'verified'])->name('petition/view');

Route::get('/petitions/edit', function () {
    return Inertia::render('PetitionEdit');
})->middleware(['auth', 'verified'])->name('petition/edit');
