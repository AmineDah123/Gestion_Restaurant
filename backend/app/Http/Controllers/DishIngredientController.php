<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DishIngredient;
use App\Models\Dish;

class DishIngredientController extends Controller
{
    
    // GET for all ingredients in a dish
    public function index(string $dish_id)
    {
        $dish = Dish::with('ingredients')->findOrFail($dish_id);
        return response()->json($dish->ingredients);
    }

    // POST add an ingredient to a dish
    public function store(Request $request)
    {
        $validated = $request->validate([
            'dish_id' => 'required|exists:dishes,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity' => 'required|numeric|min:0.01',
        ]);

        $existing = DishIngredient::where('dish_id', $validated['dish_id'])
            ->where('ingredient_id', $validated['ingredient_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Ingredient already exists for this dish'], 409);
        }

        $dishIngredient = DishIngredient::create($validated);
        return response()->json($dishIngredient, 201);
    }


    //PUT update quantity of an ingredient in a dish
    public function update(Request $request, string $id)
    {
        $dishIngredient = DishIngredient::findOrFail($id);

        $validated = $request->validate([
            'quantity' => 'sometimes|required|numeric|min:0.01',
        ]);

        $dishIngredient->update($validated);

        return response()->json([
            'message' => 'Dish ingredient updated successfully',
            'dish_ingredient' => $dishIngredient
        ]);
    }

    // DELETE remove an ingredient from a dish
    public function destroy(string $id)
    {
        $dishIngredient = DishIngredient::findOrFail($id);
        $dishIngredient->delete();
        return response()->json([
            'message' => 'Dish ingredient deleted successfully'
        ]);
    }
}
