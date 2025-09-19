import {SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className=" mt-10 w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="w-full max-w-md p-6">
        <SignUp 
          // redirectUrl="/"
          // afterSignUpUrl="/"
          // signInUrl="/sign-in"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-gray-100",
              headerTitle: "text-purple-600",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border-gray-200 hover:border-purple-500 transition-colors",
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-sm normal-case",
              footerActionLink: "text-purple-600 hover:text-purple-700",
            },
          }}
        />
      </div>
    </div>
  )
}