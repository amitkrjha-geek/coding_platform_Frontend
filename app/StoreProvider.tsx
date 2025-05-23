'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { AppStore, store } from '@/redux/store'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    // Initialize store on first render
    storeRef.current = store()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}