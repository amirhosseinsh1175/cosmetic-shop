import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import Image from 'next/image'

export default function ProductGallery({ images }: { images: string[] }){
  const slides = (images && images.length) ? images : ['/uploads/logo.png']
  return (
    <div>
      <Swiper modules={[Navigation]} navigation spaceBetween={10} slidesPerView={1} className="h-96">
        {slides.map((s, idx)=> (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-96">
              <Image src={s} alt={`image-${idx}`} layout="fill" objectFit="contain" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
