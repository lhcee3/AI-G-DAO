'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAnalytics } from '@/hooks/use-analytics'

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { trackEvent } = useAnalytics()
  const pathname = usePathname()

  useEffect(() => {
    // Track page view on route change
    trackEvent('page_view', { 
      page: pathname,
      timestamp: Date.now()
    })

    // Track page load performance
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = window.performance.now();
      trackEvent('performance', {
        loadTime: loadTime,
        page: pathname,
        timestamp: Date.now()
      });
    }
  }, [pathname, trackEvent])

  useEffect(() => {
    // Track initial session start
    trackEvent('session_start', { 
      timestamp: Date.now(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      referrer: typeof window !== 'undefined' ? document.referrer : ''
    })

    // Track session end on page unload
    const handleBeforeUnload = () => {
      trackEvent('session_end', { 
        timestamp: Date.now(),
        sessionDuration: Date.now() - (Date.now() - 1000) // Approximate
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [trackEvent])

  return <>{children}</>
}