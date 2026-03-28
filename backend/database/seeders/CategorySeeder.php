<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //categories : starters, soups, salads, main course, pasta & rice, grills, desserts, drinks
        $categories = [
            ['name' => 'Starters', 'description' => 'Appetizers and starters'],
            ['name' => 'Soups', 'description' => 'Hot and cold soups'],
            ['name' => 'Salads', 'description' => 'Fresh salads'],
            ['name' => 'Main Course', 'description' => 'Main dishes'],
            ['name' => 'Pasta & Rice', 'description' => 'Pasta and rice dishes'],
            ['name' => 'Grills', 'description' => 'Grilled meat and fish'],
            ['name' => 'Desserts', 'description' => 'Sweet desserts'],
            ['name' => 'Drinks', 'description' => 'Hot and cold beverages'],
        ];

        foreach($categories as $category) {
            Category::create($category);
        }
    }
}
