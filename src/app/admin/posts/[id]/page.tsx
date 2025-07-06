//SWR導入確認用

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostForm } from "../_components/PostForm";
import { Category } from "@/types/Category";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { Post } from "@/types/post";
import { UpdatePostRequestBody } from "@/types/api";
import { useSWRWithAuth } from "@/lib/swr";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (data: { title: string; content: string; thumbnailImageKey: string; categories: Category[] }) => {
    // 記事を作成します。
    await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: {
        Authorization: token!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        title: data.title, 
        content: data.content, 
        thumbnailImageKey: data.thumbnailImageKey, 
        categories: data.categories 
      } as UpdatePostRequestBody),
    });

    alert("記事を更新しました。");
  };

  const handleDeletePost = async () => {
    if (!confirm("記事を削除しますか？")) return;

    await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token!,
        "Content-Type": "application/json",
      },
    });

    alert("記事を削除しました。");

    router.push("/admin/posts");
  };

  // SWRを使用してデータを取得
  const { data, error, isLoading } = useSWRWithAuth(
    id ? `/api/admin/posts/${id}` : null,
    token
  );

  // データが取得できたらフォームに設定
  const defaultValues = data?.post ? {
    title: data.post.title,
    content: data.post.content,
    thumbnailImageKey: data.post.thumbnailImageKey,
    categories: data.post.postCategories.map((pc: any) => pc.category),
  } : undefined;

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
      />
    </div>
  );
}
