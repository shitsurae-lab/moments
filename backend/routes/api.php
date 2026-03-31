<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// 1. これを追記（コントローラーを使えるようにする）
use App\Http\Controllers\PostController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//2. これを追記（POSTリクエストを受け取るルートを定義する）
Route::post('/posts', [PostController::class, 'store']);
