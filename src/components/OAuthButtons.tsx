import type React from "react"

export const OAuthButtons: React.FC = () => {
  return (
    <div className="mt-4 space-y-2">
      <button className="w-full py-2 px-4 bg-white text-gray-800 font-bold rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center">
        <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
        Continue with Google
      </button>
      <button className="w-full py-2 px-4 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center border border-gray-600">
        <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5 mr-2" />
        Continue with GitHub
      </button>
    </div>
  )
}

