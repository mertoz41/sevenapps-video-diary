import { type SQLiteDatabase } from "expo-sqlite";
import { z } from "zod";

// export const PostSchema = z.object({
//   video_uri: z.string(),
//   name: z.string(),
//   description: z.string(),
// });

// type Post = z.infer<typeof PostSchema>;
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
