import { startTransition, StrictMode, useEffect } from 'react'
import { hydrateRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import { useLocation, useMatches, RemixBrowser } from '@remix-run/react'
import * as Sentry from '@sentry/remix'

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
Sentry.init({
  dsn: import.meta.env.VITE_ENV_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
    // Replay is only available in the client
    Sentry.replayIntegration(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
      <PosthogInit />
    </StrictMode>
  )
})
