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
        //投稿を新しい順に取得して、15件ずつページネーションする
        $posts = Post::orderBy('created_at', 'desc')->simplePaginate(15);
        return response()->json($posts);
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
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'title' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:255',
            'tags' => 'nullable|string',
        ]);

        // 2. 画像をR2に保存
        $path = $request->file('image')->store('posts', 's3');

        //3. データベースに保存
        $post = \App\Models\Post::create([
            'image_path' => $path,
            'title' => $request->title,
            'caption' => $request->caption,
            'tags' => $request->tags,
            'user_name' => 'anonymous',
            'user_avatar_url' => null,
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
