import { Filters } from "./components/Filters"
import { ProjectCard } from "./components/ProjectCard"

const projects = [
  { id: "1", title: "Project 1", year: 2023, topic: "AI Ethics" },
  { id: "2", title: "Project 2", year: 2022, topic: "Machine Learning" },
  // Add more projects
]

export default function ResearchCategoryPage({ params }: { params: { category: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">{params.category} Research</h1>
      <Filters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

