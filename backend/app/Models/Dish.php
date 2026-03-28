<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dish extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'available'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function ingredients()
    {
        return $this->hasMany(DishIngredient::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

}
