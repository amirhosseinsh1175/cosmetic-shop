import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'change-me'

function requireAdmin(req: NextApiRequest){
  const cookies = req.headers.cookie
  if(!cookies) return null
  const parsed = cookie.parse(cookies)
  const token = parsed['cosmetic_token']
  if(!token) return null
  try{ const data = jwt.verify(token, JWT_SECRET) as any; return data } catch(e){ return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const user = requireAdmin(req)
  if(!user || !user.admin) return res.status(403).json({ error: 'دسترسی ندارید' })

  if(req.method === 'GET'){
    const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } })
    res.json(cats)
    return
  }

  if(req.method === 'POST'){
    const { name } = req.body
    if(!name) return res.status(400).json({ error: 'نام لازم است' })
    const c = await prisma.category.create({ data: { name } })
    res.json(c)
    return
  }

  res.status(405).end()
}
