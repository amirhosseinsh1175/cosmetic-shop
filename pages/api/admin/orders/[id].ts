import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query
  const oid = Number(id)
  if(req.method !== 'GET') return res.status(405).end()
  const o = await prisma.order.findUnique({ where: { id: oid }})
  if(!o) return res.status(404).json({ error: 'سفارش پیدا نشد' })
  res.json(o)
}
