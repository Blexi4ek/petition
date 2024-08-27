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
    const STATUS_DECLINED = 3;
    const STATUS_ACTIVE = 4;
    const STATUS_SUPPORTED = 5;
    const STATUS_UNSUPPORTED = 6;
    const STATUS_WAITING_ANSWER = 7;
    const STATUS_ANSWER_YES = 8;
    const STATUS_ANSWER_NO = 9;


    const PAGE = 'page';
    const PAGE_ALL = 'status_all';
    const PAGE_MY = 'status_my';
    const PAGE_SIGNS = 'status_signs';
    const PAGE_MODERATED = 'status_moderated';
    const PAGE_RESPONSE = 'status_response';

    const PER_PAGE = 10;


    public static $_items = [
        self::STATUS => [
            self::STATUS_DRAFT => [ 
                'label' => 'Draft', 
                'button' => 'Save as draft', 
                'value' => self::STATUS_DRAFT, 
                'statusClass' => 'style.gray',
                'children' => [self::STATUS_UNMODERATED], 
                'childrenAdmin' => [self::STATUS_UNMODERATED, self::STATUS_ACTIVE],
            ],
            self::STATUS_UNMODERATED => [ 
                'label' => 'Unmoderated', 
                'button' => 'Send to moderator',
                'value' => self::STATUS_UNMODERATED, 
                'statusClass' => 'style.yellow',
                'children' => [self::STATUS_DRAFT], 
                'childrenAdmin' => [self::STATUS_DRAFT, self::STATUS_DECLINED, self::STATUS_ACTIVE],
            ],
            self::STATUS_DECLINED => [
                'label' => 'Declined', 
                'value' => self::STATUS_DECLINED, 
                'statusClass' => 'style.red',
                'children' => [self::STATUS_DRAFT], 
                'childrenAdmin' => [self::STATUS_DRAFT, self::STATUS_ACTIVE],
            ],

            self::STATUS_ACTIVE => [ 
                'label' => 'Active', 
                'value' => self::STATUS_ACTIVE, 
                'statusClass' => 'style.blue',
                'childrenCron' => [self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER],
            ],

            self::STATUS_SUPPORTED => [ 
                'label' => 'Supported', 
                'value' => self::STATUS_SUPPORTED, 
                'statusClass' => 'style.green',
                'childrenAdmin' => [self::STATUS_WAITING_ANSWER],
            ],

            self::STATUS_UNSUPPORTED => [ 
                'label' => 'Unsupported', 
                'value' => self::STATUS_UNSUPPORTED, 
                'statusClass' => 'style.red'
            ],

            self::STATUS_WAITING_ANSWER => [ 
                'label' => 'Awaiting Answer', 
                'value' => self::STATUS_WAITING_ANSWER, 
                'statusClass' => 'style.yellow',
                'childrenAdmin' => [self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO],
            ],

            self::STATUS_ANSWER_YES => [ 
                'label' => 'Positive Answer', 
                'value' => self::STATUS_ANSWER_YES, 
                'statusClass' => 'style.green'
            ],

            self::STATUS_ANSWER_NO => [ 
                'label' => 'Negative Answer', 
                'value' => self::STATUS_ANSWER_NO, 
                'statusClass' => 'style.red'
            ],
        ],
        'signButton' => [self::STATUS_ACTIVE, self::STATUS_SUPPORTED],
        'answer' => [self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO],

        'pages_dropdown' => [
            User::ROLE_GUEST => [
                self::PAGE_ALL => [self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            ],
            User::ROLE_USER => [
                self::PAGE_ALL => [self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
                self::PAGE_MY => [self::STATUS_DRAFT, self::STATUS_UNMODERATED, self::STATUS_DECLINED, self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
                self::PAGE_SIGNS => [self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            ],
            User::ROLE_ADMIN => [
                self::PAGE_ALL => [self::STATUS_UNMODERATED, self::STATUS_DECLINED, self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
                self::PAGE_MY => [self::STATUS_DRAFT, self::STATUS_UNMODERATED, self::STATUS_DECLINED, self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
                self::PAGE_SIGNS => [self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
                self::PAGE_MODERATED => [self::STATUS_UNMODERATED, self::STATUS_DECLINED, self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
                self::PAGE_RESPONSE => [self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            ],

            // self::PAGE_ALL => [
            //     User::ROLE_GUEST => [self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            //     User::ROLE_USER => [self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            //     User::ROLE_ADMIN => [self::STATUS_UNMODERATED, self::STATUS_DECLINED, self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            // ],    
            // self::PAGE_MY => [
            //     User::ROLE_USER => [self::STATUS_DRAFT, self::STATUS_UNMODERATED, self::STATUS_DECLINED, self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            //     User::ROLE_ADMIN => [self::STATUS_DRAFT, self::STATUS_UNMODERATED, self::STATUS_DECLINED, self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            // ],    
            // self::PAGE_SIGNS => [
            //     User::ROLE_USER => [self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            //     User::ROLE_ADMIN => [self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            // ],
            // self::PAGE_MOD => [
            //     User::ROLE_ADMIN => [self::STATUS_UNMODERATED, self::STATUS_DECLINED, self::STATUS_ACTIVE, self::STATUS_SUPPORTED, self::STATUS_UNSUPPORTED, self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            // ],
            // self::PAGE_RESPONSE => [
            //     User::ROLE_ADMIN => [self::STATUS_WAITING_ANSWER, self::STATUS_ANSWER_YES, self::STATUS_ANSWER_NO ],
            // ],
        ], 
        self::PAGE => [
            self::PAGE_ALL => [ 
                'label' => 'Petitions', 
                'value' => self::PAGE_ALL, 
                'url' => '/',
            ],
            self::PAGE_MY => [ 
                'label' => 'My petitions', 
                'value' => self::PAGE_MY, 
                'url' => '/my',
            ],
            self::PAGE_SIGNS => [ 
                'label' => 'Signed petitions', 
                'value' => self::PAGE_SIGNS, 
                'url' => '/signs',
            ],
            self::PAGE_MODERATED => [ 
                'label' => 'Moderated petitions', 
                'value' => self::PAGE_MODERATED, 
                'url' => '/moderated',
            ],
            self::PAGE_RESPONSE => [ 
                'label' => 'Responded petitions', 
                'value' => self::PAGE_RESPONSE, 
                'url' => '/response',
            ],
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
