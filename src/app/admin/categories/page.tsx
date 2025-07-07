"use client";

//SWRWithAuth導入確認用

import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/Category";

export default function Page() {
  const { categories, error, isLoading } = useCategories();

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">カテゴリー一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/admin/categories/new">新規作成</Link>
        </button>
      </div>

      <div className="">
        {isLoading && <div>読み込み中...</div>}
        {!isLoading && categories.length === 0 && <div>カテゴリがありません</div>}
        {!isLoading &&
          categories.map((category: Category) => {
            return (
              <Link href={`/admin/categories/${category.id}`} key={category.id}>
                <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                  <div className="text-xl font-bold">{category.name}</div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
