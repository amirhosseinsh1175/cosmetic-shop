import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query
  const pid = Number(id)
  const p = await prisma.product.findUnique({ where: { id: pid }})
  if(!p) return res.status(404).json({error: 'پیدا نشد'})
  res.json(p)
}
