<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\IngredientsSeeder;
use Database\Seeders\DishSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\TableSeeder;
use Database\Seeders\DishIngredientSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
        $this->call(IngredientsSeeder::class);
        $this->call(CategorySeeder::class);
        $this->call(DishSeeder::class);
        $this->call(TableSeeder::class);
        $this->call(DishIngredientSeeder::class);
    }
}
