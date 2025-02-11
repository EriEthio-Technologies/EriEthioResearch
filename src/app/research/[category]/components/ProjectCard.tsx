import { FlipCard } from "../../../../components/ui/FlipCard"

interface Project {
  id: string
  title: string
  year: number
  topic: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="border border-gray-700 rounded-lg p-6 hover:bg-gray-800 transition duration-300">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <div className="flex justify-between text-sm text-gray-400">
        <span>{project.year}</span>
        <span>{project.topic}</span>
      </div>
    </div>
  )
}

