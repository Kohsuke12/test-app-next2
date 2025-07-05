"use client";

import { useEffect, useState } from "react";
import classes from "../../../styles/Detail.module.scss";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Post } from "@/types/post";
import useSWR from "@/lib/swr";

export default function Page() {
  // next/navigationのuseParamsを使うと、URLのパラメータを取得できます。
  const { id } = useParams();
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  // SWRを使用してデータを取得
  const { data, error, isLoading } = useSWR(
    id ? `/api/posts/${id}` : null
  );
  
  const post = data?.post;

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post-thumbnail")
        .getPublicUrl(post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [post?.thumbnailImageKey]);

  // 記事取得中は、読み込み中であることを表示します。
  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  // 記事が見つからなかった場合は、記事が見つからないことを表示します。
  if (!post) {
    return <div>記事が見つかりません</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.post}>
        {thumbnailImageUrl && (
          <div className={classes.postImage}>
            <Image src={thumbnailImageUrl} alt="" height={800} width={800} />
          </div>
        )}
        <div className={classes.postContent}>
          <div className={classes.postInfo}>
            <div className={classes.postDate}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className={classes.postCategories}>
              {post.postCategories.map((postCategory: any) => {
                return (
                  <div
                    key={postCategory.category.id}
                    className={classes.postCategory}
                  >
                    {postCategory.category.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={classes.postTitle}>{post.title}</div>
          <div
            className={classes.postBody}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  );
}
