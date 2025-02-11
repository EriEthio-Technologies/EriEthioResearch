"use client"

import { useState } from "react"
import { NavigationBar } from "../../components/NavigationBar"
import { BlogGrid } from "../../components/BlogGrid"
import { SearchBar } from "../../components/SearchBar"
import { CategoryFilters } from "../../components/CategoryFilters"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <main className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <div className="flex-grow p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-magenta-400">
            EriEthio Research Blog
          </span>
        </h1>

        <SearchBar onSearch={setSearchQuery} />
        <CategoryFilters onCategoryChange={setSelectedCategory} />
        <BlogGrid searchQuery={searchQuery} category={selectedCategory} />
      </div>

      <NavigationBar />
    </main>
  )
}

