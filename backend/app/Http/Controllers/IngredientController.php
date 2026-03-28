<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ingredient;


//  api/ingredients
class IngredientController extends Controller
{

    public function index()
    {
        $ingredients = Ingredient::all();
        return response()->json($ingredients);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'quantity_available' => 'required|numeric|min:0',
            'alert_threshold' => 'required|numeric|min:0',
        ]);

        $ingredient = Ingredient::create($validated);

        return response()->json([
            'message' => 'Ingredient created successfully',
            'ingredient' => $ingredient
        ], 201);

    }

    public function show(string $id)
    {
        $ingredient = Ingredient::findOrFail($id);
        return response()->json($ingredient);
    }

    public function update(Request $request, string $id)
    {
        $ingredient = Ingredient::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'unit' => 'sometimes|required|string|max:50',
            'quantity_available' => 'sometimes|required|numeric|min:0',
            'alert_threshold' => 'sometimes|required|numeric|min:0',
        ]);

        $ingredient->update($validated);

        return response()->json([
            'message' => 'Ingredient updated successfully',
            'ingredient' => $ingredient
        ]);
    }

    public function destroy(string $id)
    {
        $ingredient = Ingredient::findOrFail($id);
        $ingredient->delete();

        return response()->json([
            'message' => 'Ingredient deleted successfully'
        ]);
    }
}
