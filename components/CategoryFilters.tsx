import type React from "react"

interface CategoryFiltersProps {
  onCategoryChange: (category: string) => void
}

const categories = ["All", "AI", "Security", "NLP", "Automation"]

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({ onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => onCategoryChange(category)}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-cyan-400 hover:text-black transition-colors"
        >
          {category}
        </button>
      ))}
    </div>
  )
}

