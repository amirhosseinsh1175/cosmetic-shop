import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'change-me'

function requireAdmin(req: NextApiRequest, res: NextApiResponse){
  const cookies = req.headers.cookie
  if(!cookies) return null
  const parsed = cookie.parse(cookies)
  const token = parsed['cosmetic_token']
  if(!token) return null
  try{ const data = jwt.verify(token, JWT_SECRET) as any; return data } catch(e){ return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const user = requireAdmin(req,res)
  if(!user || !user.admin) return res.status(403).json({ error: 'دسترسی ندارید' })
  if(req.method === 'GET'){
    const items = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(items)
    return
  }
  if(req.method === 'POST'){
    const body = req.body
    const insert: any = { ...body }
    const p = await prisma.product.create({ data: insert })
    res.json(p)
    return
  }
  res.status(405).end()
}
