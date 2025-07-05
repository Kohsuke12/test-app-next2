import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/utils/supabase'
import { UpdateCategoryRequestBody } from '@/types/api'

const prisma = new PrismaClient()

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { currentUser, error } = await getCurrentUser(request)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  const { id } = params

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    })

    await prisma.$disconnect()

    return NextResponse.json({ status: 'OK', category }, { status: 200 })
  } catch (error) {
    await prisma.$disconnect()
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
    return NextResponse.json({ status: 'Unknown error' }, { status: 400 })
  }
}



export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }, // ここでリクエストパラメータを受け取る
) => {
  const { currentUser, error } = await getCurrentUser(request)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  // paramsの中にidが入っているので、それを取り出す
  const { id } = params

  // リクエストのbodyを取得
  const { name }: UpdateCategoryRequestBody = await request.json()

  try {
    // idを指定して、Categoryを更新
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    })

    await prisma.$disconnect()

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', category }, { status: 200 })
  } catch (error) {
    await prisma.$disconnect()
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
    return NextResponse.json({ status: 'Unknown error' }, { status: 400 })
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }, // ここでリクエストパラメータを受け取る
) => {
  const { currentUser, error } = await getCurrentUser(request)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  // paramsの中にidが入っているので、それを取り出す
  const { id } = params

  try {
    // idを指定して、Categoryを削除
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    })

    await prisma.$disconnect()

    // レスポンスを返す
    return NextResponse.json({ status: 'OK' }, { status: 200 })
  } catch (error) {
    await prisma.$disconnect()
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
    return NextResponse.json({ status: 'Unknown error' }, { status: 400 })
  }
}
