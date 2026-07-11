import { useUser } from '@clerk/react'

/** Check if an email address belongs to the ebrun domain. */
export function isEbrunEmail(email: string): boolean {
  return (
    email.toLowerCase().endsWith('@ebrun.com') ||
    email.toLowerCase().endsWith('@ebrun.ai')
   )
}

/** React hook that determines whether the current Clerk user has mail access. */
export function useUserMailAccess(): boolean {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? ''
  return isEbrunEmail(email)
}
