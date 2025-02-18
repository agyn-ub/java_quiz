export function ResultsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className="bg-gray-50 p-4 rounded-xl animate-pulse"
          style={{
            animationDelay: `${i * 0.15}s`,
            opacity: 1 - (i * 0.2)
          }}
        >
          <div className="space-y-2">
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3" 
                 style={{ animationDuration: '1.5s' }} />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"
                 style={{ animationDuration: '1.5s' }} />
          </div>
        </div>
      ))}
    </div>
  )
} 