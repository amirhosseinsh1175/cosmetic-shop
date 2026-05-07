export default function Loading(){
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="space-y-2 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 animate-pulse"></div>
        <p className="text-gray-500">در حال بارگذاری...</p>
      </div>
    </div>
  )
}
