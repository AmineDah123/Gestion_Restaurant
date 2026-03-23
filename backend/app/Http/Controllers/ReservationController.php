<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Models\Table;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservations = Reservation::with(['client', 'table'])->get();

        return response()->json($reservations);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'table_id' => 'nullable|exists:tables,id',
            'reservation_date' => 'required|date',
            'reservation_time' => 'required',
            'guests_count' => 'required|integer|min:1',
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        if ($request->table_id) {
            $existingReservation = Reservation::where('table_id', $request->table_id)
                ->where('reservation_date', $request->reservation_date)
                ->where('reservation_time', $request->reservation_time)
                ->whereIn('status', ['pending', 'confirmed'])
                ->first();

            if ($existingReservation) {
                return response()->json([
                    'message' => 'This table is already reserved for this date and time'
                ], 422);
            }

            $table = Table::findOrFail($request->table_id);

            if ($request->guests_count > $table->capacity) {
                return response()->json([
                    'message' => 'The number of guests exceeds the table capacity'
                ], 422);
            }
        }

        $reservation = Reservation::create($request->all());

        return response()->json([
            'message' => 'Reservation created successfully',
            'reservation' => $reservation
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $reservation = Reservation::with(['client', 'table'])->findOrFail($id);

        return response()->json($reservation);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id) 
    {
        $reservation = Reservation::findOrFail($id);

        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'table_id' => 'nullable|exists:tables,id',
            'reservation_date' => 'required|date',
            'reservation_time' => 'required',
            'guests_count' => 'required|integer|min:1',
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        if ($request->table_id)
        {
            $existingReservation = Reservation::where('table_id', $request->table_id)
                ->where('reservation_date', $request->reservation_date)
                ->where('reservation_time', $request->reservation_time)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('id', '!=', $reservation->id)
                ->first();
        
            if ($existingReservation) {
                return response()->json([
                    'message' => 'This table is already reserved for this time and date'
                ], 422);
            }

            $table = Table::findOrFail($request->table_id);

            if ($request->guests_count > $table->capacity) {
                return response()->json([
                    'message' => 'The number of guests exceeds the table capacity'
                ], 422);
            }
        }

        $reservation->update($request->all());

        return response()->json([
            'message' => 'Reservation updated successfully',
            'reservation' => $reservation
        ]);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();

        return response()->json([
            'message' => 'Reservation deleted successfully'
        ]);
    }
}
