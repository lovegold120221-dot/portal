import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/react'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: () => (
    <div className='grid min-h-svh place-items-center p-4'>
      <SignUp />
    </div>
  ),
})
