import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'change-me'

function requireAuth(req: NextApiRequest){
  const cookies = req.headers.cookie
  if(!cookies) return null
  const parsed = cookie.parse(cookies)
  const token = parsed['cosmetic_token']
  if(!token) return null
  try{ const data = jwt.verify(token, JWT_SECRET) as any; return data } catch(e){ return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const user = requireAuth(req)
  if(!user) return res.status(401).json({ error: 'not authenticated' })

  if(req.method === 'GET'){
    const u = await prisma.user.findUnique({ where: { id: Number(user.userId) }, select: { id: true, email: true, name: true } })
    res.json({ user: u })
    return
  }

  if(req.method === 'PUT'){
    const { name, password } = req.body || {}
    const data:any = {}
    if(name) data.name = name
    if(password) data.password = require('bcryptjs').hashSync(password, 10)
    const updated = await prisma.user.update({ where: { id: Number(user.userId) }, data })
    res.json({ ok: true, user: { id: updated.id, email: updated.email, name: updated.name } })
    return
  }

  res.status(405).end()
}
