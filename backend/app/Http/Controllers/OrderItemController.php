<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderItem;
use App\Models\Dish;

class OrderItemController extends Controller
{
    public function index()
    {
        $items = OrderItem::with(['order', 'dish'])->get();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'dish_id'  => 'required|exists:dishes,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Auto-calculate unit_price and subtotal from the Dish
        $dish = Dish::findOrFail($validated['dish_id']);
        $validated['unit_price'] = $dish->price;
        $validated['subtotal']   = $dish->price * $validated['quantity'];

        $item = OrderItem::create($validated);

        return response()->json($item->load(['order', 'dish']), 201);
    }

    public function show(string $id)
    {
        $item = OrderItem::with(['order', 'dish'])->findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, string $id)
    {
        $item = OrderItem::findOrFail($id);

        $validated = $request->validate([
            'quantity' => 'sometimes|required|integer|min:1',
            'dish_id'  => 'sometimes|required|exists:dishes,id',
        ]);

        // Recalculate if dish or quantity changed
        $dish                    = Dish::findOrFail($validated['dish_id'] ?? $item->dish_id);
        $quantity                = $validated['quantity'] ?? $item->quantity;
        $validated['unit_price'] = $dish->price;
        $validated['subtotal']   = $dish->price * $quantity;

        $item->update($validated);

        return response()->json([
            'message' => 'Order item updated successfully',
            'item'    => $item->load(['order', 'dish'])
        ]);
    }

    public function destroy(string $id)
    {
        $item = OrderItem::findOrFail($id);
        $item->delete();

        return response()->json([
            'message' => 'Order item deleted successfully'
        ]);
    }
}