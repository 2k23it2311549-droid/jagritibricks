import { useEffect, useRef, useCallback } from 'react'

/**
 * DoraEffects - Provides scroll-driven reveal, parallax, and cursor glow effects.
 * Drop this component anywhere inside <Router> to enable Dora-style animations globally.
 */
export default function DoraEffects() {
    const rafRef = useRef(null)

    // Scroll Reveal Observer
    useEffect(() => {
        const revealElements = document.querySelectorAll(
            '.dora-reveal, .dora-reveal-left, .dora-reveal-right, .dora-stagger, .dora-img-reveal, .dora-line-expand'
        )

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                    }
                })
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            }
        )

        revealElements.forEach((el) => observer.observe(el))

        // Re-observe on route changes (MutationObserver)
        const mutationObserver = new MutationObserver(() => {
            const newElements = document.querySelectorAll(
                '.dora-reveal:not(.visible), .dora-reveal-left:not(.visible), .dora-reveal-right:not(.visible), .dora-stagger:not(.visible), .dora-img-reveal:not(.visible), .dora-line-expand:not(.visible)'
            )
            newElements.forEach((el) => observer.observe(el))
        })

        mutationObserver.observe(document.body, { childList: true, subtree: true })

        return () => {
            observer.disconnect()
            mutationObserver.disconnect()
        }
    }, [])

    // Cursor Glow Follower
    useEffect(() => {
        const handleMouseMove = (e) => {
            const glowElements = document.querySelectorAll('.dora-glow-cursor, .dora-morph')
            glowElements.forEach((el) => {
                const rect = el.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                el.style.setProperty('--cursor-x', `${x}px`)
                el.style.setProperty('--cursor-y', `${y}px`)
                el.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`)
                el.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`)
            })
        }

        document.addEventListener('mousemove', handleMouseMove)
        return () => document.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Parallax on Scroll
    const handleScroll = useCallback(() => {
        const scrollY = window.scrollY
        const slowElements = document.querySelectorAll('.dora-parallax-slow')
        const fastElements = document.querySelectorAll('.dora-parallax-fast')

        slowElements.forEach((el) => {
            el.style.transform = `translateY(${scrollY * 0.05}px)`
        })

        fastElements.forEach((el) => {
            el.style.transform = `translateY(${scrollY * -0.1}px)`
        })
    }, [])

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(handleScroll)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [handleScroll])

    return null // This component only handles side effects
}
