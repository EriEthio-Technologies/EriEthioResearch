import type React from "react"
import { motion } from "framer-motion"

interface BlogPost {
  title: string
  date: string
  tags: string[]
  excerpt: string
}

interface BlogGridProps {
  searchQuery: string
  category: string
}

const blogPosts: BlogPost[] = [
  {
    title: "Advancements in AI Security",
    date: "2023-05-15",
    tags: ["AI", "Security"],
    excerpt: "Exploring the latest developments in AI-powered security systems...",
  },
  {
    title: "Optimizing Large Language Models",
    date: "2023-05-10",
    tags: ["AI", "NLP"],
    excerpt: "Techniques for improving the performance of large language models...",
  },
  {
    title: "The Future of Automation",
    date: "2023-05-05",
    tags: ["Automation", "AI"],
    excerpt: "Predicting the impact of automation on various industries...",
  },
  // Add more blog posts here
]

export const BlogGrid: React.FC<BlogGridProps> = ({ searchQuery, category }) => {
  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (category === "All" || post.tags.includes(category)),
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {filteredPosts.map((post, index) => (
        <motion.div
          key={index}
          className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-400 text-sm mb-2">{post.date}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, tagIndex) => (
              <span key={tagIndex} className="bg-cyan-400 text-black text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-300">{post.excerpt}</p>
        </motion.div>
      ))}
    </div>
  )
}

