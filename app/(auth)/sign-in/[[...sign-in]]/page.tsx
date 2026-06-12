import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen grid w-full place-items-center px-4">
      <SignIn />
    </div>
  )
}
