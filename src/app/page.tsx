import Link from "next/link"
import { NeonLogo } from "../components/NeonLogo.tsx"
import { NavigationBar } from "../components/NavigationBar"
import { AnimatedCard } from "../components/AnimatedCard"
import { LatestResearch } from "../components/LatestResearch"
import { TestimonialSlider } from "../components/TestimonialSlider"
import { NewsletterSignup } from "../components/NewsletterSignup"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* CRT screen overlay */}
        <div className="fixed inset-0 pointer-events-none z-10 bg-[url('/crt-overlay.png')] opacity-10"></div>

        {/* Neon text logo */}
        <NeonLogo />

        {/* Brutalist grid of animated cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <AnimatedCard title="AI Security" />
          <AnimatedCard title="Model Optimization" />
          <AnimatedCard title="Automation" />
        </div>

        {/* Latest Research section */}
        <LatestResearch />

        {/* Testimonials section */}
        <TestimonialSlider />

        {/* Newsletter signup */}
        <NewsletterSignup />

        {/* Footer */}
        <footer className="w-full bg-black py-8">
          <NeonLogo className="transform rotate-180" />
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="#" className="text-cyan-400 hover:text-magenta-400">
              Twitter
            </Link>
            <Link href="#" className="text-cyan-400 hover:text-magenta-400">
              LinkedIn
            </Link>
            <Link href="#" className="text-cyan-400 hover:text-magenta-400">
              GitHub
            </Link>
          </div>
        </footer>
      </div>

      {/* Sticky bottom navigation bar */}
      <NavigationBar />
    </main>
  )
}

