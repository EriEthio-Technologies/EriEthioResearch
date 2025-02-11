import Link from "next/link"

interface NewsItem {
  id: string
  slug: string
  title: string
  date: string
  excerpt: string
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    slug: "erietheio-secures-series-b-funding",
    title: "EriEthio Research Secures $50M in Series B Funding",
    date: "2023-11-15",
    excerpt:
      "EriEthio Research announces a successful Series B funding round, securing $50 million to accelerate AI research and product development.",
  },
  {
    id: "2",
    slug: "new-ai-ethics-board",
    title: "EriEthio Establishes AI Ethics Advisory Board",
    date: "2023-10-01",
    excerpt:
      "In a move to ensure responsible AI development, EriEthio Research forms a diverse AI Ethics Advisory Board comprising leading experts in the field.",
  },
  {
    id: "3",
    slug: "partnership-with-tech-giant",
    title: "EriEthio Partners with Global Tech Giant for AI Integration",
    date: "2023-09-12",
    excerpt:
      "EriEthio Research announces a strategic partnership with a leading tech company to integrate its AI solutions into widely-used consumer products.",
  },
]

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-neon-blue">Latest News</h1>
      <div className="space-y-8">
        {newsItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-neon-blue transition-shadow duration-300"
          >
            <Link href={`/news/${item.slug}`} className="block">
              <h2 className="text-2xl font-semibold mb-2 text-neon-green hover:text-neon-green-bright transition-colors">
                {item.title}
              </h2>
              <p className="text-gray-400 mb-4">{item.date}</p>
              <p className="text-gray-300">{item.excerpt}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

