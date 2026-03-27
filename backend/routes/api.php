<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\TableController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ReservationController;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function(Request $request)
{
    return response()->json($request->user());
});

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);


Route::middleware(['auth:sanctum', 'role:admin'])->get('/users', function() {
    return response()->json(['message' => 'Admin only']);
});

Route::middleware(['auth:sanctum', 'role:admin,receptionniste'])->group(function () {
    //routes for tables
    Route::get('/tables', [TableController::class, 'index']);
    Route::post('/tables', [TableController::class, 'store']);
    Route::get('/tables/{id}', [TableController::class, 'show']);
    Route::put('/tables/{id}', [TableController::class, 'update']);
    Route::delete('/tables/{id}', [TableController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:admin,receptionniste'])->group(function() {
    //routes for clients
    Route::get('/clients', [ClientController::class, 'index']);
    Route::post('/clients', [ClientController::class, 'store']);
    Route::get('/clients/{id}', [ClientController::class, 'show']);
    Route::put('/clients/{id}', [ClientController::class, 'update']);
    Route::delete('/clients/{id}', [ClientController::class, 'destroy']);
});


Route::middleware(['auth:sanctum', 'role:admin,receptionniste'])->group(function () {
    //routes for reservations
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);

    //routes for categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    //routes for dishes
    Route::get('/dishes', [DishController::class, 'index']);
    Route::post('/dishes', [DishController::class, 'store']);
    Route::get('/dishes/{id}', [DishController::class, 'show']);
    Route::put('/dishes/{id}', [DishController::class, 'update']);
    Route::delete('/dishes/{id}', [DishController::class, 'destroy']);
});