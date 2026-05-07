import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// supports filters: page, limit, q, brand, category, minPrice, maxPrice, sort
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { page = '1', limit = '12', q = '', brand, category, minPrice, maxPrice, sort } = req.query as any
  const pageNum = Math.max(1, Number(page) || 1)
  const take = Math.min(100, Number(limit) || 12)
  const skip = (pageNum - 1) * take

  const where: any = {}
  if(q) where.OR = [ { title: { contains: q } }, { excerpt: { contains: q } }, { description: { contains: q } } ]
  if(brand) where.brand = brand
  if(category) where.category = category
  if(minPrice) where.price = { gte: Number(minPrice) }
  if(maxPrice) where.price = Object.assign(where.price || {}, { lte: Number(maxPrice) })

  const orderBy = [] as any[]
  if(sort === 'price_asc') orderBy.push({ price: 'asc' })
  else if(sort === 'price_desc') orderBy.push({ price: 'desc' })
  else if(sort === 'newest') orderBy.push({ createdAt: 'desc' })

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take, orderBy }),
    prisma.product.count({ where })
  ])

  res.json({ data: items, meta: { total, page: pageNum, pageSize: take } })
}
