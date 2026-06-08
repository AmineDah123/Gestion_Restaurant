<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = [
        'name',
        'unit',
        'quantity_available',
        'alert_threshold'
    ];

    public function stock_movements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function dishIngredients()
    {
        return $this->hasMany(DishIngredient::class);
    }
}
