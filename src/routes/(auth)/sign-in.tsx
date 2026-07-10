import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/react'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: () => (
    <div className='grid min-h-svh place-items-center p-4'>
      <SignIn />
    </div>
  ),
})
