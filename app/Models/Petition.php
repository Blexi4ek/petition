<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Petition extends Model
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'decription',
        'status',
        'created_by',
        'moderated_by',
        'answered_by',
        'deleted_at',
        'moderating_started_at',
        'activated_at',
        'declined_at',
        'supported_at',
        'answering_started_at',
        'answered_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
    //  * @var array<int, string>
    //  */
    // protected $hidden = [
    //     'password',
    //     'remember_token',
    // ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'timestamp',
            'updated_at' => 'timestamp',
            'moderating_started_at' => 'timestamp',
            'activated_at' => 'timestamp',
            'declined_at' => 'timestamp',
            'supported_at' => 'timestamp',
            'answering_started_at' => 'timestamp',
            'answered_at' => 'timestamp',
        ];
    }

    public function userCreator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function userAdministrator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderated_by');
    }

    public function userPolitician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'answered_by');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_petition', 'petition_id', 'user_id');
    }


    public function userPetitions()
    {
        return $this->hasMany(UserPetition::class, 'petition_id', 'id');
    }




    //hasManyThrough($related, $through,      $firstKey = null,        $secondKey = null,       $localKey = null, $secondLocalKey = null                  )
    //belongsToMany ($related, $table = null, $foreignPivotKey = null, $relatedPivotKey = null, $parentKey = null, $relatedKey = null,    $relation = null)

}
