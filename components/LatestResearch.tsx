import Link from "next/link"
import type React from "react"

export const LatestResearch: React.FC = () => {
  const blogPosts = [
    { title: "Advancements in AI Security", date: "2023-05-15" },
    { title: "Optimizing Large Language Models", date: "2023-05-10" },
    { title: "The Future of Automation", date: "2023-05-05" },
  ]

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Latest Research</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {blogPosts.map((post, index) => (
          <Link
            href="/blog"
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-400">{post.date}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

