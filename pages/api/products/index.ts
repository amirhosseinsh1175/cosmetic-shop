import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method==='GET'){
    const products = await prisma.product.findMany({})
    res.json(products)
  } else if(req.method==='POST'){
    const { title, price, image, description, excerpt } = req.body
    const p = await prisma.product.create({ data: { title, price: Number(price), image, description, excerpt }})
    res.json(p)
  } else res.status(405).end()
}
