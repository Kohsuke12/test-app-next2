//SWR導入確認用

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { UpdateCategoryRequestBody } from "@/types/api";
import { useSWRWithAuth } from "@/lib/swr";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (data: { name: string }) => {
    // カテゴリーを作成します。
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
      body: JSON.stringify({ name: data.name } as UpdateCategoryRequestBody),
    });

    alert("カテゴリーを更新しました。");
  };

  const handleDeletePost = async () => {
    if (!confirm("カテゴリーを削除しますか？")) return;

    await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
    });

    alert("カテゴリーを削除しました。");

    router.push("/admin/categories");
  };

  // SWRを使用してデータを取得
  const { data, error, isLoading } = useSWRWithAuth(
    id ? `/api/admin/categories/${id}` : null,
    token
  );

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
