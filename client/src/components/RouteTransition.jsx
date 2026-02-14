import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageLoader from './PageLoader'

export default function RouteTransition({ children }) {
    const location = useLocation()
    const [loading, setLoading] = useState(false)
    const [displayChildren, setDisplayChildren] = useState(true)

    useEffect(() => {
        // Trigger loading on route change
        setLoading(true)
        // Hide children immediately to show only loader? 
        // Or keep children visible underneath?
        // Let's keep children visible but likely covered by z-index of loader.
        // Actually, for a "splash" feel, we might want to unmount/remount or just cover.
        // Covering is smoother.

        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000) // 1 second splash

        return () => clearTimeout(timer)
    }, [location.pathname]) // Trigger on path change only

    return (
        <>
            {loading && <PageLoader />}
            {children}
        </>
    )
}
