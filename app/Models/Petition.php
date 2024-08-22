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
    const PAYMENT_ACTIVE = 1;
    const PAYMENT_INACTIVE = 0;

    const STATUS = 'status';
    const STATUS_DRAFT = 1;
    const STATUS_UNMODERATED = 2;
    const STATUS_ACTIVE = 3;
    const STATUS_DECLINED = 4;
    const STATUS_SUPPORTED = 5;
    const STATUS_UNSUPPORTED = 6;
    const STATUS_AWAITING_ANSWER = 7;
    const STATUS_POSITIVE_ANSWER = 8;
    const STATUS_NEGATIVE_ANSWER = 9;


    public static $_items = [
        self::STATUS => [
            self::STATUS_DRAFT => [ 'label' => 'Draft', 'value' => self::STATUS_DRAFT, 'statusClass' => 'style.gray' ],
            self::STATUS_UNMODERATED => [ 'label' => 'Unmoderated', 'value' => self::STATUS_UNMODERATED, 'statusClass' => 'style.yellow' ],
            self::STATUS_ACTIVE => [ 'label' => 'Active', 'value' => self::STATUS_ACTIVE, 'statusClass' => 'style.blue' ],
            self::STATUS_DECLINED => [ 'label' => 'Declined', 'value' => self::STATUS_DECLINED , 'statusClass' => 'style.red' ],
            self::STATUS_SUPPORTED => [ 'label' => 'Supported', 'value' => self::STATUS_SUPPORTED, 'statusClass' => 'style.green' ],
            self::STATUS_UNSUPPORTED => [ 'label' => 'Unsupported', 'value' => self::STATUS_UNSUPPORTED, 'statusClass' => 'style.red' ],
            self::STATUS_AWAITING_ANSWER => [ 'label' => 'Awaiting Answer', 'value' => self::STATUS_AWAITING_ANSWER, 'statusClass' => 'style.yellow' ],
            self::STATUS_POSITIVE_ANSWER => [ 'label' => 'Positive Answer', 'value' => self::STATUS_POSITIVE_ANSWER, 'statusClass' => 'style.green' ],
            self::STATUS_NEGATIVE_ANSWER => [ 'label' => 'Negative Answer', 'value' => self::STATUS_NEGATIVE_ANSWER, 'statusClass' => 'style.red' ],
        ],
        self::PAYMENT => [
            self::PAYMENT_ACTIVE => [ 'label' => 'Active', 'value' => self::PAYMENT_ACTIVE ],
            self::PAYMENT_INACTIVE => [ 'label' => 'Inactive', 'value' => self::PAYMENT_INACTIVE ],
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
