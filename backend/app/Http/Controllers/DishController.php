<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dish;

class DishController extends Controller
{
    public function index()
    {
        $dishes = Dish::with('category')->get();
        return response()->json($dishes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'available'   => 'boolean',
        ]);

        $dish = Dish::create($validated);

        return response()->json($dish->load('category'), 201);
    }

    public function show(string $id)
    {
        $dish = Dish::with('category')->findOrFail($id);
        return response()->json($dish);
    }

    public function update(Request $request, string $id)
    {
        $dish = Dish::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'sometimes|required|numeric|min:0',
            'available'   => 'sometimes|boolean',
        ]);

        $dish->update($validated);

        return response()->json([
            'message' => 'Dish updated successfully',
            'dish'    => $dish->load('category')
        ]);
    }

    public function destroy(string $id)
    {
        $dish = Dish::findOrFail($id);
        $dish->delete();

        return response()->json([
            'message' => 'Dish deleted successfully'
        ]);
    }
}