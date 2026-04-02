<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('image_path'); //画像の保存場所
            $table->string('title')->nullable(); //タイトル
            $table->string('caption')->nullable(); //説明文
            $table->string('tags')->nullable(); //タグ（カンマ区切りで保存）
            $table->string('user_name')->default('anonymous'); //投稿者名
            $table->string('user_avatar_url')->nullable(); //投稿者のアバター画像URL
            $table->timestamps(); //投稿日時
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
