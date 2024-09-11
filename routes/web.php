<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PetitionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ImageController;
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

Route::post('/api/v1/dashboard/create', [DashboardController::class,'create'])->name('dashboard.create');
Route::get('/api/v1/dashboard/test', [DashboardController::class,'test'])->name('dashboard.test');

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
Route::post('/api/v1/petitions/statusChange', [PetitionController::class, 'status'])->name('petition.status');
Route::get('/api/v1/petitions/searchUser', [PetitionController::class, 'searchUser'])->name('petition.searchUser');
Route::post('/api/v1/petitions/edit/pay', [PetitionController::class,'pay'])->name('petition.pay');
Route::get('/api/v1/petitions/csvDownload', [PetitionController::class, 'csvDownload'])->name('petition.csvDownload');
Route::get('/api/v1/petitions/pdf', [PetitionController::class, 'pdf'])->name('petition.pdf');

Route::get('/api/v1/petitions/image', [ImageController::class, 'image'])->name('petition.image');
Route::post('/api/v1/petitions/imageSave', [ImageController::class,'imageSave'])->name('petition.imageSave');
Route::delete('/api/v1/petition/imageClear', [ImageController::class, 'imageClear'])->name('petition.imageClear');

Route::get('/api/v1/profile/me', [ProfileController::class, 'me'])->name('profile.me');

Route::get('/api/v1/petitions/users', [UserController::class, 'index'])->name('petition.users');
Route::get('/api/v1/petitions/users/roles', [UserController::class, 'roles'])->name('petition.roles');
Route::get('/api/v1/petitions/users/roleChange', [UserController::class, 'roleChange'])->name('petition.roleChange');


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

Route::get('/petitions/edit', function (Request $request) {
    return Inertia::render('PetitionEdit');
})->middleware(['auth', 'verified'])->name('petition/edit');

Route::get('/petitions/answer', function () {
    return Inertia::render('PetitionAnswer');
})->middleware(['auth', 'verified'])->name('petition/answer');

Route::get('/petitions/users', function () {
    return Inertia::render('UserList');
})->middleware(['auth', 'verified'])->name('petitions/users');





