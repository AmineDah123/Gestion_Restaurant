<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DishIngredient;

class DishIngredientSeeder extends Seeder
{
    public function run(): void
    {
        $dishIngredients = [
            // Bruschetta (dish_id: 1) - needs tomatoes, garlic, olive oil
            ['dish_id' => 1, 'ingredient_id' => 5, 'quantity' => 0.1],  // tomatoes
            ['dish_id' => 1, 'ingredient_id' => 7, 'quantity' => 0.02], // garlic
            ['dish_id' => 1, 'ingredient_id' => 15, 'quantity' => 0.03],// olive oil

            // Tomato Soup (dish_id: 3) - needs tomatoes, onions, cream
            ['dish_id' => 3, 'ingredient_id' => 5, 'quantity' => 0.3],  // tomatoes
            ['dish_id' => 3, 'ingredient_id' => 6, 'quantity' => 0.1],  // onions
            ['dish_id' => 3, 'ingredient_id' => 10, 'quantity' => 0.1], // cream

            // Caesar Salad (dish_id: 5) - needs lettuce, cheese
            ['dish_id' => 5, 'ingredient_id' => 8, 'quantity' => 0.2],  // lettuce
            ['dish_id' => 5, 'ingredient_id' => 11, 'quantity' => 0.05],// cheese

            // Grilled Chicken (dish_id: 7) - needs chicken, garlic, olive oil
            ['dish_id' => 7, 'ingredient_id' => 1, 'quantity' => 0.3],  // chicken breast
            ['dish_id' => 7, 'ingredient_id' => 7, 'quantity' => 0.02], // garlic
            ['dish_id' => 7, 'ingredient_id' => 15, 'quantity' => 0.03],// olive oil

            // Beef Steak (dish_id: 8) - needs beef, butter, black pepper
            ['dish_id' => 8, 'ingredient_id' => 2, 'quantity' => 0.35], // beef
            ['dish_id' => 8, 'ingredient_id' => 9, 'quantity' => 0.02], // butter
            ['dish_id' => 8, 'ingredient_id' => 17, 'quantity' => 0.01],// black pepper

            // Grilled Salmon (dish_id: 9) - needs salmon, butter, garlic
            ['dish_id' => 9, 'ingredient_id' => 3, 'quantity' => 0.3],  // salmon
            ['dish_id' => 9, 'ingredient_id' => 9, 'quantity' => 0.02], // butter
            ['dish_id' => 9, 'ingredient_id' => 7, 'quantity' => 0.01], // garlic

            // Spaghetti Bolognese (dish_id: 10) - needs pasta, beef, tomatoes, onions
            ['dish_id' => 10, 'ingredient_id' => 14, 'quantity' => 0.2], // pasta
            ['dish_id' => 10, 'ingredient_id' => 2, 'quantity' => 0.2],  // beef
            ['dish_id' => 10, 'ingredient_id' => 5, 'quantity' => 0.2],  // tomatoes
            ['dish_id' => 10, 'ingredient_id' => 6, 'quantity' => 0.05], // onions

            // Chicken Risotto (dish_id: 11) - needs rice, chicken, cream, cheese
            ['dish_id' => 11, 'ingredient_id' => 13, 'quantity' => 0.2], // rice
            ['dish_id' => 11, 'ingredient_id' => 1, 'quantity' => 0.2],  // chicken
            ['dish_id' => 11, 'ingredient_id' => 10, 'quantity' => 0.1], // cream
            ['dish_id' => 11, 'ingredient_id' => 11, 'quantity' => 0.05],// cheese

            // Chocolate Cake (dish_id: 13) - needs flour, eggs, butter
            ['dish_id' => 13, 'ingredient_id' => 12, 'quantity' => 0.2], // flour
            ['dish_id' => 13, 'ingredient_id' => 4, 'quantity' => 2],    // eggs
            ['dish_id' => 13, 'ingredient_id' => 9, 'quantity' => 0.1],  // butter
        ];

        foreach ($dishIngredients as $dishIngredient) {
            DishIngredient::create($dishIngredient);
        }
    }
}