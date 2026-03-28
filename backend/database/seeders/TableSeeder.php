<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Table;

class TableSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [
            // Small tables (2 people)
            ['number' => 1, 'capacity' => 2, 'status' => 'free'],
            ['number' => 2, 'capacity' => 2, 'status' => 'free'],
            ['number' => 3, 'capacity' => 2, 'status' => 'free'],

            // Medium tables (4 people)
            ['number' => 4, 'capacity' => 4, 'status' => 'free'],
            ['number' => 5, 'capacity' => 4, 'status' => 'free'],
            ['number' => 6, 'capacity' => 4, 'status' => 'free'],
            ['number' => 7, 'capacity' => 4, 'status' => 'free'],

            // Large tables (6 people)
            ['number' => 8, 'capacity' => 6, 'status' => 'free'],
            ['number' => 9, 'capacity' => 6, 'status' => 'free'],
            ['number' => 10, 'capacity' => 6, 'status' => 'free'],

            // Extra large tables (8 people)
            ['number' => 11, 'capacity' => 8, 'status' => 'free'],
            ['number' => 12, 'capacity' => 8, 'status' => 'free'],
        ];

        foreach ($tables as $table) {
            Table::create($table);
        }
    }
}