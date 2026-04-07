//アプリ独自の統一の型
export interface UnifiedPost {
  id: string;
  avatarIcon: string;
  avatarLink?: string;
  authorName: string;
  tag?: string | string[]; // タグはオプショナルで、文字列または文字列の配列
  title: string;
  description: string | null;
  imageUrl: string;
  source: 'unsplash' | 'moments';
  createdAt: string; // ソート用
  postId?: number; // DELETE /api/posts/{id} 用（momentsのみ）
}
