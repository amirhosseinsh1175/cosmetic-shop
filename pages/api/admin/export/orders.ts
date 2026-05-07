import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'GET') return res.status(405).end()
  const items = await prisma.order.findMany({})
  const header = 'id,amount,status,createdAt,items\n'
  const body = items.map(o => `${o.id},${o.amount},${o.status},${o.createdAt.toISOString()},"${o.items.replace(/"/g,'""')}"`).join('\n')
  res.setHeader('Content-Type','text/csv')
  res.setHeader('Content-Disposition','attachment; filename="orders.csv"')
  res.send(header + body)
}
