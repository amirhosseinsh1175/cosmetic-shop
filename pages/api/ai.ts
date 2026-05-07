import type { NextApiRequest, NextApiResponse } from 'next'

const canned = {
  default: 'سلام! این یک دستیار نمونه است. می‌تونم مشخصات، نکات استفاده و پیشنهادات مکمل برای محصولات آرایشی بهتون بدم.',
  'کرم مرطوب‌کننده': 'کرم مرطوب‌کننده پیشنهادی ما حاوی هیالورونیک اسید است و برای پوست‌های خشک عالی‌ست.'
}

export default function handler(req: NextApiRequest, res: NextApiResponse){
  const { prompt } = req.body || {}
  if(!prompt) return res.json({reply: canned.default})
  for(const key of Object.keys(canned)){
    if(prompt.includes(key)) return res.json({reply: canned[key]})
  }
  res.json({reply: canned.default})
}
