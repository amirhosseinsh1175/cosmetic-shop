import Image from 'next/image'
import Link from 'next/link'
import RatingStars from './RatingStars'

export default function ProductCard({ product }: { product: any }){
  const img = (product.images && product.images[0]) || '/uploads/logo.png'
  return (
    <div className="bg-white rounded shadow overflow-hidden card-hover">
      <Link href={`/products/${product.id}`}>
        <a className="block">
          <div className="relative w-full h-44">
            <Image src={img} alt={product.title} layout="fill" objectFit="cover" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm">{product.title}</div>
              {product.oldPrice && <div className="text-xs text-red-500">% تخفیف</div>}
            </div>

            <div className="text-sm text-gray-500 mt-2 h-12 overflow-hidden">{product.excerpt}</div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-pink-600 font-bold">{product.price} تومان</div>
                {product.oldPrice && <div className="text-xs text-gray-400 line-through">{product.oldPrice} تومان</div>}
              </div>
              <div>
                <RatingStars value={product.rating || 0} count={product.ratingCount || 0} />
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}
