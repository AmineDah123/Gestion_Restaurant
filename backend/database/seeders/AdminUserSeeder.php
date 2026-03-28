<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;


class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //roles : admin, receptionniste, serveur, cuisine, stock_manager each 1 account
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@restaurant.com',
                'password' => '12345678',
                'role' => 'admin',
            ],
            [
                'name' => 'Receptionniste User',
                'email' => 'receptionniste@restaurant.com',
                'password' => '12345678',
                'role' => 'receptionniste',
            ],
            [
                'name' => 'Serveur User',
                'email' => 'serveur@restaurant.com',
                'password' => '12345678',
                'role' => 'serveur',
            ],
            [
                'name' => 'Cuisine User',
                'email' => 'cuisine@restaurant.com',
                'password' => '12345678',
                'role' => 'cuisine',
            ],
            [
                'name' => 'Stock Manager User',
                'email' => 'stock@restaurant.com',
                'password' => '12345678',
                'role' => 'stock_manager',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        };
    }
}
