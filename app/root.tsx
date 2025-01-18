import { LinksFunction } from '@remix-run/node'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from '@remix-run/react'
import stylesheet from '~/tailwind.css?url'
import { PropsWithChildren, useEffect } from 'react'

export const ErrorBoundary = () => {
  const error = useRouteError()


  return <div>Something went wrong. Please try again later.</div>
}
export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }]

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="antialiased dark:bg-gray-950 dark:text-slate-50 h-full dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={'h-full'}>
        <header className={'p-4 px-10 bg-gray-50 dark:bg-gray-900 fixed w-full z-10'}>
          <nav>
            <ul className={'flex gap-4'}>
              <li>
                <Link to={'/'} className={'text-xl hover:underline'}>
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <div className={'h-full p-10 pt-20'}>{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function App() {
  return (
      <Outlet />
  )
}

export default App
