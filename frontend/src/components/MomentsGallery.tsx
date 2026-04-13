'use client';
import { MomentsPost } from '@/lib/MomentsPost';
import { UnifiedPost } from '@/lib/UnifiedPost';
import { useEffect, useState } from 'react';

export const useMomentsGallery = () => {
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
  // useEffectの外にfetchPostsとして定義: （変更理由）外から呼べる
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/posts`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const json = await response.json();
      console.log('fetchPosts実行、取得件数:', json.data.length);
      const unified = json.data.map((post: MomentsPost) => ({
        id: String(post.id),
        imageUrl: `${r2Url}/${post.image_path}`,
        title: post.title ?? '',
        description: post.caption,
        authorName: 'Guest',
        avatarIcon: '',
        createdAt: post.created_at,
        source: 'moments' as const,
        postId: post.id,
      }));
      setPosts(unified);
    } catch (error) {
      setError('投稿の取得に失敗しました。');
      console.error('Error fetching Moments posts:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refetch: fetchPosts }; //投稿を再取得という意味でrefetchは'慣習的な名前'
};
