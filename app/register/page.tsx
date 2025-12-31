export const dynamic = 'force-dynamic'

import RegisterForm from './RegisterForm'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
