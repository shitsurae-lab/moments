<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //1. バリデーション
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048', //画像は必須で、画像ファイルであること、最大2MB
            'caption' => 'nullable|string|max:255', //説明文は任意で、文字列で最大255文字
            'tags' => 'nullable|string', //タグは任意で、文字列で最大255文字
        ]);

        //2. 画像の保存(第一引数は保存するファイル、第二引数は保存先のディレクトリ、第三引数はストレージのディスク)
        $path = $request->file('image')->store('posts', 'public');

        //3. データベースに保存
        $post = \App\Models\Post::create([
            'image_path' => $path,
            'caption' => $request->caption,
            'tags' => $request->tags,
        ]);
        //4. Next.js（フロント端）に「成功したよ！」と返事をする
        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
