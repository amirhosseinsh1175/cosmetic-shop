import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'change-me'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' })

function requireAuth(req: NextApiRequest){
  const cookies = req.headers.cookie
  if(!cookies) return null
  const parsed = cookie.parse(cookies)
  const token = parsed['cosmetic_token']
  if(!token) return null
  try{ const data = jwt.verify(token, JWT_SECRET) as any; return data } catch(e){ return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).end()
  const user = requireAuth(req)
  if(!user) return res.status(401).json({ error: 'not authenticated' })

  const { items, addressId } = req.body || {}
  if(!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items لازم است' })

  // Build line_items for Stripe and calculate amount
  const line_items: any[] = []
  let totalAmount = 0

  for(const it of items){
    const pid = Number(it.productId)
    const product = await prisma.product.findUnique({ where: { id: pid } })
    if(!product) return res.status(400).json({ error: `محصول ${pid} یافت نشد` })
    const qty = Number(it.quantity) || 1
    // handle variant price override
    const variant = (product.variants || []).find((v:any)=> v.name === it.variant)
    const unitPrice = variant ? Number(variant.price) : Number(product.price)
    totalAmount += unitPrice * qty
    // convert Toman (IRR) to USD cents roughly for Stripe (example conversion: 1 USD ~ 42000 IRR)
    const usdCents = Math.max(50, Math.round((unitPrice / 42000) * 100))
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: { name: product.title },
        unit_amount: usdCents
      },
      quantity: qty
    })
  }

  // create a pending order in DB
  const order = await prisma.order.create({ data: { items: JSON.stringify(items), amount: totalAmount, status: 'pending', userId: Number(user.userId) } })

  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers.host
  const success_url = `${protocol}://${host}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
  const cancel_url = `${protocol}://${host}/checkout/cancel`

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items,
    success_url,
    cancel_url,
    metadata: { orderId: String(order.id), userId: String(user.userId) }
  })

  // store stripe session id in order
  await prisma.order.update({ where: { id: order.id }, data: { status: 'pending', } })

  res.json({ url: session.url })
}
