<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use App\Http\Controllers\TableController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DishController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\DishIngredientController;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function(Request $request)
{
    return response()->json($request->user());
});

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);


Route::middleware(['auth:sanctum', 'role:admin'])->get('/users', function() {
    return response()->json(['message' => 'Admin only']);
});

// Admin only
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    
    // categories - admin only
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // dishes - admin only
    Route::post('/dishes', [DishController::class, 'store']);
    Route::put('/dishes/{id}', [DishController::class, 'update']);
    Route::delete('/dishes/{id}', [DishController::class, 'destroy']);

    // dish ingredients - admin only
    Route::get('/dishes/{dish_id}/ingredients', [DishIngredientController::class, 'index']);
    Route::post('/dish-ingredients', [DishIngredientController::class, 'store']);
    Route::put('/dish-ingredients/{id}', [DishIngredientController::class, 'update']);
    Route::delete('/dish-ingredients/{id}', [DishIngredientController::class, 'destroy']);

    // delete stock movement - admin only
    Route::delete('/stock-movements/{id}', [StockMovementController::class, 'destroy']);
});

// Admin + Receptionniste
Route::middleware(['auth:sanctum', 'role:admin,receptionniste'])->group(function () {
    Route::apiResource('tables', TableController::class);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('reservations', ReservationController::class);
});

// Admin + Serveur (waiter)
Route::middleware(['auth:sanctum', 'role:admin,serveur'])->group(function () {
    Route::get('/tables', [TableController::class, 'index']);
    Route::get('/tables/{id}', [TableController::class, 'show']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);

    Route::get('/order-items', [OrderItemController::class, 'index']);
    Route::post('/order-items', [OrderItemController::class, 'store']);
    Route::put('/order-items/{id}', [OrderItemController::class, 'update']);
    Route::delete('/order-items/{id}', [OrderItemController::class, 'destroy']);
});

// Kitchen - read and update orders only
Route::middleware(['auth:sanctum', 'role:admin,cuisine'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']); // to update status
    Route::get('/order-items', [OrderItemController::class, 'index']);
});

// Stock manager
Route::middleware(['auth:sanctum', 'role:admin,stock_manager'])->group(function () {
    Route::get('/ingredients', [IngredientController::class, 'index']);
    Route::post('/ingredients', [IngredientController::class, 'store']);
    Route::get('/ingredients/{id}', [IngredientController::class, 'show']);
    Route::put('/ingredients/{id}', [IngredientController::class, 'update']);
    Route::delete('/ingredients/{id}', [IngredientController::class, 'destroy']);

    Route::get('/stock-movements', [StockMovementController::class, 'index']);
    Route::post('/stock-movements', [StockMovementController::class, 'store']);
    Route::get('/stock-movements/{id}', [StockMovementController::class, 'show']);
});

// Everyone authenticated can read categories and dishes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::get('/dishes', [DishController::class, 'index']);
    Route::get('/dishes/{id}', [DishController::class, 'show']);
});