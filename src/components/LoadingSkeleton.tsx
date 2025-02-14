export const UserLoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-12 bg-neon-cyan/20 rounded-lg" />
    <div className="h-24 bg-neon-cyan/10 rounded-lg" />
    <div className="h-8 bg-neon-cyan/20 rounded-lg w-1/3" />
  </div>
);

// Usage in pages
{isLoading ? <UserLoadingSkeleton /> : <UserContent />} 