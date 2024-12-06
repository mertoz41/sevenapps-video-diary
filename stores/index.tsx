import { create } from "zustand";
import { Post, PostStore } from "@/types";
import { type SQLiteDatabase } from "expo-sqlite";

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  loading: false,
  error: null,
  fetchPosts: async (db: SQLiteDatabase) => {
    set({ loading: true });
    try {
      const response = await db.getAllAsync(
        "SELECT id, video_uri FROM post ORDER BY id DESC"
      );
      set({ posts: response, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch posts", loading: false });
    }
  },
  addPost: async (postData: Post) => {
    set({ loading: true });
    try {
      set((state) => ({
        posts: [postData, ...state.posts],
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to add post", loading: false });
    }
  },
}));
