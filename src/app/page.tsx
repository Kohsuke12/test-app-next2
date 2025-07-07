//SWR導入確認用

"use client";

import Link from "next/link";
import classes from "../styles/Home.module.scss";
import { usePosts } from "@/hooks/usePosts";

export default function Home() {
  const { posts, error, isLoading, mutate } = usePosts();

  if (isLoading) {
    return (
      <div className="">
        <div className={classes.container}>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <div className={classes.container}>
          <p>エラーが発生しました: {error.message}</p>
          <button 
            onClick={() => mutate()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className={classes.container}>
        <ul>
          {/* 記事の一覧をmap処理で繰り返し表示します。*/}
          {posts.map((post) => {
            return (
              <li key={post.id} className={classes.list}>
                <Link href={`/posts/${post.id}`} className={classes.link}>
                  <div className={classes.post}>
                    <div className={classes.postContent}>
                      <div className={classes.postInfo}>
                        <div className={classes.postDate}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className={classes.postCategories}>
                          {post.postCategories.map((pc) => {
                            return (
                              <div
                                key={pc.category.id}
                                className={classes.postCategory}
                              >
                                {pc.category.name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <p className={classes.postTitle}>{post.title}</p>
                      <div
                        className={classes.postBody}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
