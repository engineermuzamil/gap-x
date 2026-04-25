import { Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { ReactElement, useEffect } from 'react'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const page = usePage()
  const flash = children.props.flash
  const path = page.url.split('?')[0]
  const isGuestAuthPage =
    path === '/login' ||
    path === '/signup' ||
    path === '/projects/auth' ||
    path === '/projects/auth/login' ||
    path === '/projects/auth/signup'
  const shouldShowError =
    !!flash.error && !(isGuestAuthPage && flash.error.toLowerCase().includes('unauthorized'))

  useEffect(() => {
    toast.dismiss()
  }, [page.url])

  useEffect(() => {
    if (shouldShowError) {
      toast.error(flash.error)
    }
    if (flash.success) {
      toast.success(flash.success)
    }
  }, [flash.error, flash.success, shouldShowError])

  return (
    <>
      <main>{children}</main>
      <Toaster position="top-center" richColors />
    </>
  )
}
