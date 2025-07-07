//SWR導入確認用

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { UpdateCategoryRequestBody } from "@/types/api";
import { useSWRWithAuth } from "@/lib/swr";
import { useCategories } from "@/hooks/useCategories";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();
  const { mutate: mutateCategories } = useCategories();

  const handleSubmit = async (data: { name: string }) => {
    try {
      // カテゴリーを更新します。
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({ name: data.name } as UpdateCategoryRequestBody),
      });

      if (!res.ok) {
        throw new Error('カテゴリーの更新に失敗しました');
      }

      // SWRのキャッシュを更新
      mutateCategories();

      alert("カテゴリーを更新しました。");
      
      // カテゴリー一覧ページに戻ります。
      router.push("/admin/categories");
    } catch (error) {
      console.error('カテゴリー更新エラー:', error);
      alert('カテゴリーの更新に失敗しました。');
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("カテゴリーを削除しますか？")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      });

      if (!res.ok) {
        throw new Error('カテゴリーの削除に失敗しました');
      }

      // SWRのキャッシュを更新
      mutateCategories();

      alert("カテゴリーを削除しました。");
      router.push("/admin/categories");
    } catch (error) {
      console.error('カテゴリー削除エラー:', error);
      alert('カテゴリーの削除に失敗しました。');
    }
  };

  // SWRを使用してデータを取得
  const { data, error, isLoading } = useSWRWithAuth(
    id ? `/api/admin/categories/${id}` : null
  );

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
        </div>
        <p>読み込み中...</p>
      </div>
    );
  }

  // エラー状態の表示
  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
        </div>
        <p>エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  // データが取得できたらフォームに設定
  const defaultValues = data?.category ? { name: data.category.name } : undefined;

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>

      <CategoryForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
      />
    </div>
  );
}
