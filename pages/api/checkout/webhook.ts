export const config = { api: { bodyParser: false } }

import { buffer } from 'micro'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' })

export default async function handler(req:any, res:any){
  if(req.method !== 'POST') return res.status(405).end()
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

  let event
  try{
    const buf = await buffer(req)
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  }catch(err:any){
    console.error('Webhook signature verification failed.', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if(event.type === 'checkout.session.completed'){
    const session = event.data.object as any
    const metadata = session.metadata || {}
    const orderId = Number(metadata.orderId) || null
    if(orderId){
      await prisma.order.update({ where: { id: orderId }, data: { status: 'paid' } })
      console.log(`Order ${orderId} marked as paid`)
    }
  }

  res.json({ received: true })
}
