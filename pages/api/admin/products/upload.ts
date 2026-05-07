export const config = {
  api: {
    bodyParser: false
  }
}

import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()

  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if(err) return res.status(500).json({ error: 'خطا در خواندن فایل' })
    const file = files.file || files.image || Object.values(files)[0]
    if(!file) return res.status(400).json({ error: 'فایلی ارسال نشده' })

    const data = fs.readFileSync(file.filepath)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

    const original = file.originalFilename || file.newFilename || 'upload'
    const ext = original.split('.').pop() || 'png'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = path.join(uploadDir, fileName)
    fs.writeFileSync(filePath, data)

    return res.json({ url: `/uploads/products/${fileName}` })
  })
}
