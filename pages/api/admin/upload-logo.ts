import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const { image } = req.body || {}
  if(!image) return res.status(400).json({ error: 'تصویری ارسال نشده' })

  // image is expected as data URL (data:image/png;base64,....)
  const matches = image.match(/^data:(.+);base64,(.+)$/)
  if(!matches) return res.status(400).json({ error: 'فرمت تصویر نامعتبر است' })

  const ext = matches[1].split('/')[1]
  const data = matches[2]
  const buffer = Buffer.from(data, 'base64')

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, `logo.${ext}`)
  fs.writeFileSync(filePath, buffer)

  // also write a generic logo.png for convenience (overwrite)
  const genericPath = path.join(uploadDir, 'logo.png')
  fs.writeFileSync(genericPath, buffer)

  res.json({ ok: true, url: `/uploads/logo.${ext}` })
}
