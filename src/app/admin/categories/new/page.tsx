"use client";

import { useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { CreateCategoryRequestBody } from "@/types/api";

export default function Page() {
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (data: { name: string }) => {
    // カテゴリーを作成します。
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
      body: JSON.stringify({ name: data.name } as CreateCategoryRequestBody),
    });

    // レスポンスから作成したカテゴリーのIDを取得します。
    const { id } = await res.json();

    // 作成したカテゴリーの詳細ページに遷移します。
    router.push(`/admin/categories/${id}`);

    alert("カテゴリーを作成しました。");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー作成</h1>
      </div>

      <CategoryForm
        mode="new"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
