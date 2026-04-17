<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Storage;
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
            'title' => 'required|string|max:255',
            'caption' => 'required|string|max:255',
            'tags' => 'nullable|string',
            'link_url' => 'nullable|url|max:255'
        ]);

        // 2. 画像をR2に保存
        $path = $request->file('image')->store('posts', 's3');

        //3. データベースに保存（$request->user() は、ログイン中のユーザー（Userモデル）を指すよ）
        //posts()->create()の理由: Laravelが 「今ログインしているユーザーのID」を、新しい投稿のuser_idカラムにあてはめる。
        $post = $request->user()->posts()->create([
            'image_path' => $path,
            'title' => $request->title,
            'caption' => $request->caption,
            'tags' => $request->tags ?? null,
            'link_url' => $request->link_url ?? null,
            'user_name' => $request->user()->name,
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
    public function destroy(Request $request, Post $post) //Requestを受け取れるように引数に追加
    {
        //1. 投稿者本人以外は削除できない
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        // 2. image_pathがある場合のみR2から画像を削除
        if ($post->image_path) {
            Storage::disk('s3')->delete($post->image_path);
        }

        // 3. DBから投稿を削除
        $post->delete();

        // 4. フロントに「成功したよ！」と返事をする
        return response()->json([
            'message' => 'Post deleted successfully',
        ], 200);
    }
}
