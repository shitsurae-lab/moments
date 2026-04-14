<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    //保存可能な属性を指定する
    protected $fillable = ['user_id', 'image_path', 'title', 'caption', 'tags', 'user_name', 'user_avatar_url'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
