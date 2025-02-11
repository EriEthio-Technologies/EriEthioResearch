import { ProductHero } from "../components/ProductHero"
import { UseCases } from "../components/UseCases"

export default function ProductPage({ params }: { params: { productId: string } }) {
  // In a real application, you would fetch the product data based on the productId
  const product = {
    name: "AI Optimizer",
    description: "Advanced AI optimization tool for enterprise-level applications.",
    features: ["Real-time optimization", "Ethical AI compliance", "Scalable architecture"],
    useCases: ["Finance", "Healthcare", "Manufacturing"],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductHero name={product.name} description={product.description} />
      <section className="my-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside">
          {product.features.map((feature, index) => (
            <li key={index} className="mb-2">
              {feature}
            </li>
          ))}
        </ul>
      </section>
      <UseCases useCases={product.useCases} />
    </div>
  )
}

