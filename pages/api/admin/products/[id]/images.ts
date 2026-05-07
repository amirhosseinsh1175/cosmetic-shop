import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

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

  const { id } = req.query
  const pid = Number(id)
  if(req.method === 'DELETE'){
    const { url } = req.body || {}
    if(!url) return res.status(400).json({ error: 'url لازم است' })

    const p = await prisma.product.findUnique({ where: { id: pid }})
    if(!p) return res.status(404).json({ error: 'محصول پیدا نشد' })

    const images = (p.images as string[]) || []
    const updated = images.filter(i => i !== url)

    // if local file, delete it
    if(url.startsWith('/uploads/')){
      const filePath = path.join(process.cwd(), 'public', url.replace(/^\//, ''))
      try{ if(fs.existsSync(filePath)) fs.unlinkSync(filePath) } catch(e){ console.error('delete image error', e) }
    }

    await prisma.product.update({ where: { id: pid }, data: { images: updated } })
    res.json({ ok: true })
    return
  }

  if(req.method === 'PUT'){
    const { images } = req.body || {}
    if(!Array.isArray(images)) return res.status(400).json({ error: 'images باید آرایه باشد' })
    await prisma.product.update({ where: { id: pid }, data: { images } })
    res.json({ ok: true })
    return
  }

  res.status(405).end()
}
