<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController; //PostControllerが使えるように加筆

//1. 誰でも閲覧可能なルート（投稿一覧）
Route::get('/posts', [PostController::class, 'index']);

//2. ログインが必要なルートをグループ化する
Route::middleware('auth:sanctum')->group(function () {
    // ログイン中の自分の情報を返す
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');

    // 投稿する（スパム防止のthrottleもここに入れるよ）
    Route::post('/posts', [PostController::class, 'store'])->middleware('throttle:10,1'); //1分間に10回までのリクエストを許可する（スパム投稿防止）


    // 削除する
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
});

//3. ログアウト
Route::post('/logout', function (Request $request) {
    if ($request->user()) {
        $request->user()->currentAccessToken()->delete(); // ✅ トークンをDBから削除
    }
    return response()->json(['message' => 'ログアウト成功']);
})->middleware('auth:sanctum'); // ✅ 認証済みユーザーのみ
