import './css/app.css'
import { ReactElement } from 'react'
import { client } from './client'
import Layout from '~/layouts/default'
import { Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
// ── React Query ───────────────────────────────────────────────────────────────
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '~/lib/query-client'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    const shouldUseDefaultLayout = name !== 'home'

    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
      (page: ReactElement<Data.SharedProps>) =>
        shouldUseDefaultLayout ? <Layout children={page} /> : page
    )
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      // QueryClientProvider wraps everything so any component can use React Query
      <QueryClientProvider client={queryClient}>
        <TuyauProvider client={client}>
          <App {...props} />
        </TuyauProvider>
      </QueryClientProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
})
