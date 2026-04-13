<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// 1. これを追記（コントローラーを使えるようにする）
use App\Http\Controllers\PostController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// 2. これを追記（POSTリクエストを受け取るルートを定義する）
// throttle:10,1 = 1分間に10回までのリクエストを許可する（スパム投稿防止）
Route::post('/posts', [PostController::class, 'store'])->middleware('throttle:10,1');


//3. これを追記（GETリクエストを受け取るルートを定義する）
Route::get('/posts', [PostController::class, 'index']);

// 4. DELETEリクエストを受け取るルートを定義する（投稿削除）
Route::delete('/posts/{post}', [PostController::class, 'destroy']);
