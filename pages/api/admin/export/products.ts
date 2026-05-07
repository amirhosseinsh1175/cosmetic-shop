import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'GET') return res.status(405).end()
  const items = await prisma.product.findMany({})
  const rows = items.map(i => ({ id: i.id, title: i.title.replace(/\n/g,' '), price: i.price, stock: i.stock }))
  const header = 'id,title,price,stock\n'
  const body = rows.map(r => `${r.id},"${r.title}",${r.price},${r.stock}`).join('\n')
  res.setHeader('Content-Type','text/csv')
  res.setHeader('Content-Disposition','attachment; filename="products.csv"')
  res.send(header + body)
}
