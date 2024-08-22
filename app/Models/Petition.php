<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Petition extends Base
{
    use HasFactory, Notifiable;

    public $createUpdateValidation = [
        'name' => 'required|min:3|max:100',
        'description' => 'required|min:3|max:500'
    ];

    const PAYMENT = 'payment';

    const STATUS = 'status';
    const STATUS_DRAFT = 1;
    



    public $_items = [
        self::STATUS => [
            self::STATUS_DRAFT => [ 'label' => 'Draft', 'value' => self::STATUS_DRAFT, 'statusClass' => 'style.gray' ],
            [ 'label' => 'Unmoderated', 'value' => 2, 'statusClass' => 'style.yellow' ],
            [ 'label' => 'Active', 'value' => 3, 'statusClass' => 'style.blue'  ],
            [ 'label' => 'Declined', 'value' => 4 , 'statusClass' => 'style.red' ],
            [ 'label' => 'Supported', 'value' => 5, 'statusClass' => 'style.green' ],
            [ 'label' => 'Unsupported', 'value' => 6, 'statusClass' => 'style.red' ],
            [ 'label' => 'Awaiting Answer', 'value' => 7, 'statusClass' => 'style.yellow' ],
            [ 'label' => 'Positive Answer', 'value' => 8, 'statusClass' => 'style.green' ],
            [ 'label' => 'Negative Answer', 'value' => 9, 'statusClass' => 'style.red' ],
        ],
        self::PAYMENT => [


        ],

    ];





    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
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

    public function userModerator(): BelongsTo
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


}
