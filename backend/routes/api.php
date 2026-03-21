<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function(Request $request)
{
    return response()->json($request->user());
});

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);


Route::middleware(['auth:sanctum', 'role:admin'])->get('/users', function() {
    return response()->json(['message' => 'Admin only']);
});