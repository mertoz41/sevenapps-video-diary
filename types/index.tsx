import { type SQLiteDatabase } from "expo-sqlite";

export interface Post {
  id: string;
  video_uri: string;
  name: string;
  thumbnail: string;
  description: string;
}

export interface PostStore {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: (db: SQLiteDatabase) => Promise<void>;
  addPost: (postData: any) => Promise<void>;
}
