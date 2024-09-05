<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    const ROLE_GUEST = 0;   
    const ROLE_USER = 1;
    const ROLE_ADMIN = 2;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'timestamp',
            'created_at' => 'timestamp',
            'updated_at' => 'timestamp',
            'password' => 'hashed',
        ];
    }


    public function createdPetitions(): HasMany
    {
        return $this->hasMany(Petition::class, 'created_by', 'id');
    }

    public function moderatedPetitions(): HasMany
    {
        return $this->hasMany(Petition::class, 'moderated_by', 'id');
    }

    public function answeredPetitions(): HasMany
    {
        return $this->hasMany(Petition::class, 'answered_by', 'id');
    }

    public function userPetitions()
    {
        return $this->hasMany(UserPetition::class, 'user_id', 'id');
    }

}
