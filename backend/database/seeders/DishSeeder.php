<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Dish;

class DishSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dishes = [
            // Starters (category_id: 1)
            ['name' => 'Bruschetta', 'description' => 'Toasted bread with tomatoes and garlic', 'price' => 4.99, 'category_id' => 1, 'available' => true],
            ['name' => 'Spring Rolls', 'description' => 'Crispy vegetable spring rolls', 'price' => 5.99, 'category_id' => 1, 'available' => true],

            // Soups (category_id: 2)
            ['name' => 'Tomato Soup', 'description' => 'Classic creamy tomato soup', 'price' => 5.49, 'category_id' => 2, 'available' => true],
            ['name' => 'Onion Soup', 'description' => 'French onion soup with cheese', 'price' => 6.49, 'category_id' => 2, 'available' => true],

            // Salads (category_id: 3)
            ['name' => 'Caesar Salad', 'description' => 'Romaine lettuce with caesar dressing', 'price' => 7.99, 'category_id' => 3, 'available' => true],
            ['name' => 'Greek Salad', 'description' => 'Fresh vegetables with feta cheese', 'price' => 7.49, 'category_id' => 3, 'available' => true],

            // Main Course (category_id: 4)
            ['name' => 'Grilled Chicken', 'description' => 'Juicy grilled chicken breast', 'price' => 12.99, 'category_id' => 4, 'available' => true],
            ['name' => 'Beef Steak', 'description' => 'Prime beef steak with sauce', 'price' => 18.99, 'category_id' => 4, 'available' => true],
            ['name' => 'Grilled Salmon', 'description' => 'Fresh salmon fillet with herbs', 'price' => 15.99, 'category_id' => 4, 'available' => true],

            // Pasta & Rice (category_id: 5)
            ['name' => 'Spaghetti Bolognese', 'description' => 'Classic pasta with meat sauce', 'price' => 10.99, 'category_id' => 5, 'available' => true],
            ['name' => 'Chicken Risotto', 'description' => 'Creamy risotto with chicken', 'price' => 11.99, 'category_id' => 5, 'available' => true],

            // Grills (category_id: 6)
            ['name' => 'Mixed Grill', 'description' => 'Assorted grilled meats', 'price' => 22.99, 'category_id' => 6, 'available' => true],

            // Desserts (category_id: 7)
            ['name' => 'Chocolate Cake', 'description' => 'Rich chocolate layer cake', 'price' => 5.99, 'category_id' => 7, 'available' => true],
            ['name' => 'Creme Brulee', 'description' => 'Classic French dessert', 'price' => 6.49, 'category_id' => 7, 'available' => true],

            // Drinks (category_id: 8)
            ['name' => 'Fresh Orange Juice', 'description' => 'Freshly squeezed orange juice', 'price' => 3.99, 'category_id' => 8, 'available' => true],
            ['name' => 'Mineral Water', 'description' => 'Still or sparkling', 'price' => 1.99, 'category_id' => 8,'available' => true],
        ];

        foreach($dishes as $dish) {
            Dish::create($dish);
        }

    }
}
