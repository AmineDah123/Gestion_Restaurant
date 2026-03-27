<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Table::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'number' => 'required|integer|unique:tables,number',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:free,reserved,occupied,cleaning'
        ]);

        $table = Table::create($request->all());

        return response()->json([
            'message' => 'Table created successfully',
            'table' => $table
        ], 201);


    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $table = Table::findOrFail($id);
        
        return response()->json($table);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Table $table)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $table = Table::findOrFail($id);

        $request->validate([
            'number' => 'required|integer|unique:tables,number,' . $table->id,
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:free,reserved,occupied,cleaning',
        ]);

        $table->update($request->all());

        return response()->json([
            'message' => 'Table updated successfully',
            'table' => $table
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $table = Table::findOrFail($id);
        $table->delete();

        return response()->json([
            'message' => 'Table deleted successfully'
        ]);

    }
}
