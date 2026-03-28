<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ingredient;

class IngredientsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredients = [
            // Proteins
            ['name' => 'Chicken Breast', 'unit' => 'kg', 'quantity_available' => 20, 'alert_threshold' => 5],
            ['name' => 'Beef', 'unit' => 'kg', 'quantity_available' => 15, 'alert_threshold' => 4],
            ['name' => 'Salmon', 'unit' => 'kg', 'quantity_available' => 10, 'alert_threshold' => 3],
            ['name' => 'Eggs', 'unit' => 'pieces', 'quantity_available' => 100, 'alert_threshold' => 20],

            // Vegetables
            ['name' => 'Tomatoes', 'unit' => 'kg', 'quantity_available' => 15, 'alert_threshold' => 3],
            ['name' => 'Onions', 'unit' => 'kg', 'quantity_available' => 10, 'alert_threshold' => 2],
            ['name' => 'Garlic', 'unit' => 'kg', 'quantity_available' => 5, 'alert_threshold' => 1],
            ['name' => 'Lettuce', 'unit' => 'kg', 'quantity_available' => 8, 'alert_threshold' => 2],

            // Dairy
            ['name' => 'Butter', 'unit' => 'kg', 'quantity_available' => 5, 'alert_threshold' => 1],
            ['name' => 'Cream', 'unit' => 'liters', 'quantity_available' => 10, 'alert_threshold' => 2],
            ['name' => 'Cheese', 'unit' => 'kg', 'quantity_available' => 8, 'alert_threshold' => 2],

            // Dry goods
            ['name' => 'Flour', 'unit' => 'kg', 'quantity_available' => 25, 'alert_threshold' => 5],
            ['name' => 'Rice', 'unit' => 'kg', 'quantity_available' => 20, 'alert_threshold' => 5],
            ['name' => 'Pasta', 'unit' => 'kg', 'quantity_available' => 15, 'alert_threshold' => 3],

            // Condiments
            ['name' => 'Olive Oil', 'unit' => 'liters', 'quantity_available' => 10, 'alert_threshold' => 2],
            ['name' => 'Salt', 'unit' => 'kg', 'quantity_available' => 5, 'alert_threshold' => 1],
            ['name' => 'Black Pepper', 'unit' => 'kg', 'quantity_available' => 3, 'alert_threshold' => 0.5],
        ];

        foreach($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }
    }
}
