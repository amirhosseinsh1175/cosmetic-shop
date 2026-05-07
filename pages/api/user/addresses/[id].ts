import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'

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
  const { id } = req.query
  const aid = Number(id)

  if(req.method === 'PUT'){
    const { title, fullname, phone, postalCode, address } = req.body || {}
    const updated = await prisma.address.update({ where: { id: aid }, data: { title, fullname, phone, postalCode, address } })
    res.json(updated)
    return
  }

  if(req.method === 'DELETE'){
    await prisma.address.delete({ where: { id: aid } })
    res.json({ ok: true })
    return
  }

  res.status(405).end()
}
