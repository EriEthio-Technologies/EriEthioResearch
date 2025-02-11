interface UseCasesProps {
  useCases: string[]
}

export function UseCases({ useCases }: UseCasesProps) {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-semibold mb-4">Industry Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {useCases.map((useCase, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{useCase}</h3>
            <p className="text-gray-400">
              Discover how our product revolutionizes {useCase.toLowerCase()} industry practices.
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

