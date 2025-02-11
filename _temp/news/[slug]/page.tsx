import { notFound } from "next/navigation"

interface NewsItem {
  id: string
  slug: string
  title: string
  date: string
  content: string
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    slug: "erietheio-secures-series-b-funding",
    title: "EriEthio Research Secures $50M in Series B Funding",
    date: "2023-11-15",
    content: `
      <p>EriEthio Research, a leading AI research and development company, today announced the successful closure of its Series B funding round, raising $50 million. The round was led by Quantum Ventures, with participation from existing investors Nexus Capital and Future Tech Fund.</p>
      
      <p>This significant investment will accelerate EriEthio's groundbreaking work in artificial intelligence, particularly in the areas of ethical AI development and advanced machine learning algorithms. The funds will be allocated towards expanding the company's research team, enhancing its AI infrastructure, and accelerating the development of its flagship products.</p>
      
      <p>Dr. Ayana Tekle, CEO and Co-founder of EriEthio Research, expressed her excitement about the funding: "This investment is a testament to the hard work of our team and the potential of our technology. With these resources, we're poised to make significant advancements in AI that will benefit industries worldwide while maintaining our commitment to ethical and responsible development."</p>
      
      <p>The funding comes at a crucial time as EriEthio Research prepares to launch its next-generation AI platform, designed to revolutionize data analysis and decision-making processes across various sectors, including healthcare, finance, and environmental science.</p>
      
      <p>As part of this funding round, Sarah Chen, Managing Partner at Quantum Ventures, will join EriEthio's board of directors. "We're thrilled to support EriEthio Research in their mission to push the boundaries of AI technology," said Chen. "Their approach to combining cutting-edge research with a strong ethical framework sets them apart in the industry."</p>
      
      <p>This latest funding round brings EriEthio Research's total funding to $75 million, positioning the company as a major player in the global AI landscape. The company plans to use the capital to expand its operations globally and forge new partnerships with leading academic institutions and industry players.</p>
    `,
  },
  {
    id: "2",
    slug: "new-ai-ethics-board",
    title: "EriEthio Establishes AI Ethics Advisory Board",
    date: "2023-10-01",
    content: `
      <p>EriEthio Research, at the forefront of AI innovation, has announced the formation of a dedicated AI Ethics Advisory Board. This move underscores the company's commitment to responsible AI development and deployment.</p>
      
      <p>The board comprises a diverse group of experts from various fields, including philosophy, law, social sciences, and technology. Their collective expertise will guide EriEthio's AI initiatives, ensuring that ethical considerations are at the forefront of all research and product development efforts.</p>
      
      <p>Key members of the advisory board include:</p>
      <ul>
        <li>Dr. Elena Rodriguez, Professor of AI Ethics at Stanford University</li>
        <li>Judge Michael Chang, retired Supreme Court Justice and expert in technology law</li>
        <li>Dr. Kwame Osei, renowned philosopher and author on the societal impacts of AI</li>
        <li>Sarah Nkrumah, human rights advocate and expert in AI's impact on developing nations</li>
      </ul>
      
      <p>Ezra Haile, CTO and Co-founder of EriEthio Research, emphasized the importance of this initiative: "As we push the boundaries of AI capabilities, it's crucial that we also lead in establishing ethical guidelines. This advisory board will help ensure that our innovations benefit humanity while minimizing potential risks."</p>
      
      <p>The AI Ethics Advisory Board will meet quarterly to review EriEthio's ongoing projects, propose ethical guidelines, and address emerging ethical challenges in the field of AI. Their recommendations will be integrated into the company's research methodologies and product development processes.</p>
      
      <p>This initiative has been widely praised by industry observers and ethicists. Dr. Amanda Lee, a prominent AI ethicist not affiliated with the board, commented: "EriEthio's establishment of this advisory board sets a new standard for ethical considerations in AI development. It's a model that other companies in the field should emulate."</p>
      
      <p>The formation of this board comes at a critical time when the ethical implications of AI are under increasing scrutiny worldwide. By taking this proactive step, EriEthio Research aims to build trust with its stakeholders and contribute to the broader conversation about responsible AI development.</p>
    `,
  },
  {
    id: "3",
    slug: "partnership-with-tech-giant",
    title: "EriEthio Partners with Global Tech Giant for AI Integration",
    date: "2023-09-12",
    content: `
      <p>EriEthio Research, a pioneer in ethical AI solutions, has announced a groundbreaking partnership with TechCorp, one of the world's leading technology companies. This collaboration aims to integrate EriEthio's advanced AI technologies into TechCorp's widely-used consumer products and services.</p>
      
      <p>The partnership will focus on enhancing user experiences across TechCorp's product line, including smartphones, smart home devices, and cloud services. EriEthio's AI algorithms will be leveraged to improve voice recognition, predictive text, and personalized recommendations, all while adhering to strict privacy and ethical guidelines.</p>
      
      <p>Key aspects of the partnership include:</p>
      <ul>
        <li>Integration of EriEthio's natural language processing technology into TechCorp's virtual assistant</li>
        <li>Enhancement of TechCorp's smart home ecosystem with EriEthio's machine learning algorithms for improved energy efficiency and user comfort</li>
        <li>Implementation of EriEthio's ethical AI framework across TechCorp's AI-driven features to ensure responsible and transparent use of user data</li>
      </ul>
      
      <p>Dr. Ayana Tekle, CEO of EriEthio Research, expressed enthusiasm about the partnership: "This collaboration with TechCorp represents a significant milestone in bringing ethical AI to mainstream consumer technology. We're excited to see our research and innovations benefit millions of users worldwide."</p>
      
      <p>John Smith, CEO of TechCorp, added, "Partnering with EriEthio Research aligns perfectly with our commitment to innovation and user privacy. Their expertise in ethical AI will help us deliver smarter, more responsible products to our customers."</p>
      
      <p>The integration process is set to begin immediately, with the first AI-enhanced products expected to hit the market in Q2 of next year. Both companies have committed to regular transparency reports detailing the implementation and impact of the AI technologies.</p>
      
      <p>Industry analysts have reacted positively to the news, with many seeing it as a significant step towards more ethical and user-centric AI in consumer technology. The partnership is expected to set new standards for AI integration in everyday devices and could potentially influence future regulations in the tech industry.</p>
      
      <p>As part of the agreement, EriEthio Research and TechCorp will also establish a joint AI research lab, focusing on developing next-generation AI technologies that balance innovation with ethical considerations. This initiative is expected to create numerous high-skilled jobs and further cement both companies' positions as leaders in responsible AI development.</p>
    `,
  },
]

export default function NewsArticle({ params }: { params: { slug: string } }) {
  const article = newsItems.find((item) => item.slug === params.slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-neon-blue">{article.title}</h1>
      <p className="text-gray-400 mb-8">{article.date}</p>
      <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  )
}

