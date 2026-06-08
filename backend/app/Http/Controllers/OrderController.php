<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Table;


class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['table', 'user', 'orderItems.dish'])->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:pending,preparing,ready,served,paid,cancelled',
            'total_price' => 'required|numeric|min:0',
        ]);

        $order = Order::create($validated);
        Table::whereKey($validated['table_id'])->update(['status' => 'occupied']);

        return response()->json($order->load(['table', 'user', 'orderItems.dish']), 201);
    }

    public function show(string $id)
    {
        $order = Order::with(['table', 'user', 'orderItems.dish'])->findOrFail($id);
        return response()->json($order);
    }

    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);

        if ($order->status === 'paid') {
            return response()->json([
                'message' => 'A paid order can no longer be modified'
            ], 422);
        }

        $validated = $request->validate([
            'table_id' => 'sometimes|required|exists:tables,id',
            'user_id' => 'sometimes|required|exists:users,id',
            'status' => 'sometimes|required|in:pending,preparing,ready,served,paid,cancelled',
            'total_price' => 'sometimes|required|numeric|min:0',
        ]);

        $order->update($validated);

        if (isset($validated['status']) && in_array($validated['status'], ['paid', 'cancelled'])) {
            Table::whereKey($order->table_id)->update(['status' => 'free']);
        }

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order->load(['table', 'user', 'orderItems.dish'])
        ]);
    }

    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json([
            'message' => 'Order deleted successfully'
        ]);
    }
}
