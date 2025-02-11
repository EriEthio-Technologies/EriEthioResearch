import Link from "next/link"

const products = [
  { id: "1", name: "AI Optimizer", description: "Advanced AI optimization tool" },
  { id: "2", name: "EthicsGuard", description: "AI ethics compliance system" },
  // Add more products as needed
]

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="block">
            <div className="border border-gray-700 rounded-lg p-6 hover:bg-gray-800 transition duration-300">
              <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-400">{product.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

