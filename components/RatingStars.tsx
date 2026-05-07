export default function RatingStars({ value = 0, count = 0 }: { value?: number, count?: number }){
  const stars = new Array(5).fill(0).map((_,i)=> i+1)
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center text-yellow-400">
        {stars.map(s => (
          <svg key={s} className={`w-4 h-4 ${s <= Math.round(value) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z"/></svg>
        ))}
      </div>
      <div className="text-xs text-gray-500">({count})</div>
    </div>
  )
}
