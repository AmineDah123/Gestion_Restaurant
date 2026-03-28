<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StockMovement;
use App\Models\Ingredient;

class StockMovementController extends Controller
{
    public function index()
    {
        $movements = StockMovement::with('ingredient', 'user', 'order')->get();
        return response()->json($movements);
    }

    public function show(string $id)
    {
        $movement = StockMovement::with('ingredient', 'user', 'order')->findOrFail($id);
        return response()->json($movement);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ingredient_id' => 'required|exists:ingredients,id',
            'user_id' => 'required|exists:users,id',
            'order_id' => 'nullable|exists:orders,id',
            'type' => 'required|in:in,out',
            'quantity' => 'required|numeric|min:0.01',
            'reason' => 'nullable|string|max:255'
        ]);

        $movement = StockMovement::create($validated);

        $ingredient = Ingredient::findOrFail($validated['ingredient_id']);

        if ($validated['type'] === 'in') {
            $ingredient->increment('quantity_available', $validated['quantity']);
        } else if ($validated['type'] === 'out') {
            $ingredient->decrement('quantity_available', $validated['quantity']);
        }

        return response()->json($movement, 201);
    }

    public function destroy(string $id)
    {
        $movement = StockMovement::findOrFail($id);

        $ingredient = Ingredient::findOrFail($movement->ingredient_id);

        if ($movement->type === 'in') {
            $ingredient->decrement('quantity_available', $movement->quantity);
        } else {
            $ingredient->increment('quantity_available', $movement->quantity);
        }

        $movement->delete();

        return response()->json([
            'message' => 'Stock movement deleted successfully'
        ]);
    }
}
