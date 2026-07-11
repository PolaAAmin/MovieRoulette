import React from 'react'
import NavBar from '@components/layout/NavBar'
import Footer from '@components/layout/Footer'
import { ScrollToTop } from '@components/layout'

type Props = {
  children?: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
