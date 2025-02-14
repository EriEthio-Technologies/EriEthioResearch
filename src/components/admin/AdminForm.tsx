const StandardFormLayout = ({ children, title }) => (
  <div className="space-y-8">
    <header className="flex items-center justify-between">
      <h1 className="text-4xl font-bold text-neon-cyan">{title}</h1>
    </header>
    
    <section className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-neon-cyan/20">
      {children}
    </section>
  </div>
); 