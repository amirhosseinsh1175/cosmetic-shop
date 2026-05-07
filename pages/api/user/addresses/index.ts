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

  if(req.method === 'GET'){
    const addresses = await prisma.address.findMany({ where: { userId: Number(user.userId) } })
    res.json(addresses)
    return
  }

  if(req.method === 'POST'){
    const { title, fullname, phone, postalCode, address } = req.body || {}
    if(!fullname || !phone || !address) return res.status(400).json({ error: 'fullname, phone and address required' })
    const a = await prisma.address.create({ data: { userId: Number(user.userId), title, fullname, phone, postalCode, address } })
    res.json(a)
    return
  }

  res.status(405).end()
}
