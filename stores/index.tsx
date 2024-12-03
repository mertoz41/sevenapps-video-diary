import { create } from "zustand";
import { type SQLiteDatabase } from "expo-sqlite";
interface Post {
  id: string;
  video_uri: string;
  name: string;
  description: string;
}

interface PostStore {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: (db: SQLiteDatabase) => Promise<void>;
  addPost: (postData: any) => Promise<void>;
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  loading: false,
  error: null,
  fetchPosts: async (db: any) => {
    set({ loading: true });
    try {
      const response = await db.getAllAsync<Post>(
        "SELECT * FROM post ORDER BY id DESC"
      );
      set({ posts: response, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch posts", loading: false });
    }
  },
  addPost: async (postData: any) => {
    set({ loading: true });
    try {
      // const response = await db.runAsync(
      //   "INSERT INTO post (video_uri, name, description) VALUES (?, ?,?)",
      //   postData.videoUri,
      //   postData.name,
      //   postData.description
      // );
      set((state) => ({
        posts: [postData, ...state.posts],
        loading: false,
      }));

      // console.log(response);
    } catch (error) {
      set({ error: "Failed to add post", loading: false });
    }
  },
}));
