import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'change-me'

export default function handler(req: NextApiRequest, res: NextApiResponse){
  const cookies = req.headers.cookie
  if(!cookies) return res.status(401).json({error: 'not authenticated'})
  const parsed = cookie.parse(cookies)
  const token = parsed['cosmetic_token']
  if(!token) return res.status(401).json({error: 'not authenticated'})
  try{
    const data = jwt.verify(token, JWT_SECRET) as any
    res.json({ user: data })
  } catch(e){
    res.status(401).json({error: 'invalid token'})
  }
}
