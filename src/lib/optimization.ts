// Add performance monitoring
export const trackPerf = (metric: string, duration: number) => {
  if (typeof window !== 'undefined' && window.performance) {
    window.performance.mark(`${metric}-end`);
    window.performance.measure(metric, `${metric}-start`, `${metric}-end`);
  }
  
  console.log(`[Perf] ${metric}: ${duration}ms`);
};

// Implement lazy loading
export const lazyLoad = (component: () => Promise<any>) =>
  typeof window !== 'undefined' 
    ? import('@loadable/component').then(({ default: loadable }) => loadable(component))
    : component; 