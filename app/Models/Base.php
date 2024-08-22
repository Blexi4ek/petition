<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Base extends Model
{

    public $createUpdateValidation;


    public static $_items;

 
    public static function itemAlias($type = null, $code = null)
    {
        if (isset($type) && isset($code)) {
            return isset(static::$_items[$type][$code]) ? static::$_items[$type][$code] : false;
        } else if (isset($type)) {
            return isset(static::$_items[$type]) ? static::$_items[$type] : false;
        } else {
            return static::$_items;
        }
    }


}
