interface Category {
  id: number
  name: string
  nameRu: string
  slug: string
}

interface CategorySelectorProps {
  categories: Category[]
  onSelect: (categoryId: number) => void
}

export function CategorySelector({ categories, onSelect }: CategorySelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">
        Выберите категорию
      </h1>
      
      <div className="grid gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors duration-200 text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">
                  {category.nameRu}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.name}
                </p>
              </div>
              <svg 
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 