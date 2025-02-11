import Link from "next/link"
import { NavigationBar } from "../../../components/NavigationBar"
import { TerminalAnimation } from "../../../components/TerminalAnimation"
import { FeatureList } from "../../../components/FeatureList"
import { Globe3D } from "../../../components/Globe3D"

export default function SecuredAIPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* Full-width neon header */}
        <header className="w-full bg-black py-8">
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-magenta-400 animate-pulse">
              SECUREDAI v1.0
            </span>
          </h1>
          <TerminalAnimation />
        </header>

        {/* Split layout */}
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8">
            <FeatureList />
          </div>
          <div className="md:w-1/2 p-8">
            <Globe3D />
          </div>
        </div>

        {/* Subscribe Now button */}
        <div className="text-center py-8">
          <Link
            href="https://stripe.com"
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-magenta-400 text-black font-semibold text-lg hover:from-cyan-500 hover:to-magenta-500 transition-colors"
          >
            Subscribe Now
          </Link>
        </div>
      </div>

      <NavigationBar />
    </main>
  )
}

