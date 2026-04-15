<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        /** @var \App\Models\User $user */ // エディタに型を教える
        $user = Auth::user();
        $token = $user->createToken('auth-token')->plainTextToken;
        return response()->json(['token' => $token]);
    }

    return response()->json(['message' => '認証失敗'], 401);
});


Route::get('/', function () {
    return view('welcome');
});
