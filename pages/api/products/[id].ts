import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const { id } = req.query
  const pid = Number(id)

  if(req.method === 'GET'){
    const p = await prisma.product.findUnique({ where: { id: pid }})
    if(!p) return res.status(404).json({ error: 'پیدا نشد' })
    res.json(p)
    return
  }

  if(req.method === 'PUT'){
    const body = req.body
    // if images is data URLs, save them
    if(body.images && Array.isArray(body.images)){
      const saved: string[] = []
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
      if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
      for(const img of body.images){
        if(typeof img === 'string' && img.startsWith('data:')){
          const matches = img.match(/^data:(.+);base64,(.+)$/)
          if(!matches) continue
          const ext = matches[1].split('/')[1]
          const data = matches[2]
          const buffer = Buffer.from(data, 'base64')
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const filePath = path.join(uploadDir, fileName)
          fs.writeFileSync(filePath, buffer)
          saved.push(`/uploads/products/${fileName}`)
        } else if(typeof img === 'string'){
          saved.push(img)
        }
      }
      body.images = saved
    }

    const updated = await prisma.product.update({ where: { id: pid }, data: body })
    res.json(updated)
    return
  }

  if(req.method === 'DELETE'){
    await prisma.product.delete({ where: { id: pid }})
    res.json({ ok: true })
    return
  }

  res.status(405).end()
}
