import Link from "next/link"
import type React from "react"

export const NavigationBar: React.FC = () => {
  return (
    <nav className="sticky bottom-0 w-full bg-black bg-opacity-80 backdrop-blur-md py-4 z-50">
      <ul className="flex justify-around">
        <li>
          <Link href="/products" className="text-cyan-400 hover:text-magenta-400">
            Products
          </Link>
        </li>
        <li>
          <Link href="/pricing" className="text-cyan-400 hover:text-magenta-400">
            Pricing
          </Link>
        </li>
        <li>
          <Link href="/investors" className="text-cyan-400 hover:text-magenta-400">
            Investors
          </Link>
        </li>
        <li>
          <Link href="/blog" className="text-cyan-400 hover:text-magenta-400">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/login" className="text-cyan-400 hover:text-magenta-400">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  )
}

