import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse){
  res.setHeader('Set-Cookie', cookie.serialize('cosmetic_token', '', { path: '/', maxAge: -1 }))
  res.json({ ok: true })
}
