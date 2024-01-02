'use client'

import { API_BASE_URL } from '@/constants'
import { useEffect, useState } from 'react'
import classes from '../../../styles/Detail.module.scss'
import { MicroCmsPost, Post } from '@/types/post'
import Image from 'next/image'
import { useParams } from 'next/navigation'

export default function Page() {
  // react-routerのuseParamsを使うと、URLのパラメータを取得できます。
  const { id } = useParams()
  const [post, setPost] = useState<MicroCmsPost | null>(null)
  const [loading, setLoading] = useState(false)

  // APIでpostsを取得する処理をuseEffectで実行します。
  useEffect(() => {
    const fetcher = async () => {
      setLoading(true)
      const res = await fetch(
        `https://2gzszlwapo.microcms.io/api/v1/posts/${id}`,
        {
          headers: {
            'X-MICROCMS-API-KEY': process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
          },
        },
      )
      const data = await res.json()
      setPost(data)
      setLoading(false)
    }

    fetcher()
  }, [id])

  // 記事取得中は、読み込み中であることを表示します。
  if (loading) {
    return <div>読み込み中...</div>
  }

  // 記事が見つからなかった場合は、記事が見つからないことを表示します。
  if (!post) {
    return <div>記事が見つかりません</div>
  }

  return (
    <div className={classes.container}>
      <div className={classes.post}>
        <div className={classes.postImage}>
          <Image src={post.thumbnail.url} alt="" height={1000} width={1000} />
        </div>
        <div className={classes.postContent}>
          <div className={classes.postInfo}>
            <div className={classes.postDate}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className={classes.postCategories}>
              {post.categories.map((category) => {
                return (
                  <div key={category.id} className={classes.postCategory}>
                    {category.name}
                  </div>
                )
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
  )
}
