import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'change-me'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body || {}
  if(!email || !password) return res.status(400).json({error: 'ایمیل و رمز لازم است'})

  const user = await prisma.user.findUnique({ where: { email }})
  if(!user) return res.status(401).json({error: 'نام کاربری یا رمز نادرست'})

  const ok = bcrypt.compareSync(password, user.password)
  if(!ok) return res.status(401).json({error: 'نام کاربری یا رمز نادرست'})

  const token = jwt.sign({ userId: user.id, email: user.email, admin: user.admin }, JWT_SECRET, { expiresIn: '7d' })

  res.setHeader('Set-Cookie', cookie.serialize('cosmetic_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  }))

  res.json({ ok: true })
}
