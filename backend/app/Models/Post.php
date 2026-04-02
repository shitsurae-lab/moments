<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    //保存可能な属性を指定する
    protected $fillable = ['image_path', 'title', 'caption', 'tags', 'user_name', 'user_avatar_url'];
}
