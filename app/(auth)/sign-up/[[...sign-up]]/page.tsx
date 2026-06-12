import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid w-full place-items-center px-4">
      <SignUp />
    </div>
  )
}
