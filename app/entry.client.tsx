/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from '@remix-run/react'
import { startTransition, StrictMode, useEffect } from 'react'
import { hydrateRoot } from 'react-dom/client'
import posthog from 'posthog-js'

function PosthogInit() {
  useEffect(() => {
    posthog.init(import.meta.env.VITE_PH_API_KEY, {
      api_host: import.meta.env.VITE_PH_API_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
    })
  }, [])

  return null
}
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
      <PosthogInit />
    </StrictMode>
  )
})
