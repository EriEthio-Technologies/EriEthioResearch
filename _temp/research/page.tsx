import Link from "next/link"
import { FlipCard } from "../../components/ui/FlipCard"

const categories = ["Ethics", "Optimization", "Machine Learning", "Natural Language Processing"]
const highlightedProjects = [
  {
    id: "1",
    title: "Ethical AI in Healthcare",
    category: "Ethics",
    summary: "Exploring the ethical implications of AI in medical diagnosis and treatment.",
  },
  {
    id: "2",
    title: "Advanced Optimization Algorithms",
    category: "Optimization",
    summary: "Developing cutting-edge optimization techniques for large-scale AI systems.",
  },
  // Add more highlighted projects
]

export default function ResearchHub() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Research Hub</h1>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Research Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link href={`/research/${category.toLowerCase()}`} key={index} className="block">
              <div className="border border-gray-700 rounded-lg p-4 text-center hover:bg-gray-800 transition duration-300">
                {category}
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Highlighted Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlightedProjects.map((project) => (
            <FlipCard
              key={project.id}
              frontContent={
                <div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-400">{project.category}</p>
                </div>
              }
              backContent={<p>{project.summary}</p>}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

