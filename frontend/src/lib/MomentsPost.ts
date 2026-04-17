export interface User {
  id: number;
  name: string;
  email: string;
}

export interface MomentsPost {
  id: string;
  image_path: string;
  title: string | null;
  caption: string | null;
  tags: string | null;
  link_url: string | null;
  user_name: string;
  user_avatar_url: string | null;
  created_at: string;
  user_id: number; //Lavavelから返ってってくる投稿者のID
}
