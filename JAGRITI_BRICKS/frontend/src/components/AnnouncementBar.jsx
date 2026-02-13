import { useSiteSettings } from '../context/SiteSettingsContext'
import { useState, useEffect } from 'react'
import api from '../lib/api'

export default function AnnouncementBar() {
    const { settings } = useSiteSettings()
    const [cmsText, setCmsText] = useState(null)
    const [promotionEnd, setPromotionEnd] = useState(null)
    const [timeLeft, setTimeLeft] = useState('')

    useEffect(() => {
        const fetchCmsData = async () => {
            try {
                const { data } = await api.get('/site/content?section=announcement')

                if (data && data.content) {
                    data.content.forEach(item => {
                        if (item.key === 'text') setCmsText(item.value)
                        if (item.key === 'promotion_ends_at') setPromotionEnd(item.value)
                    })
                }
            } catch (error) {
                console.error('Error fetching announcement:', error)
            }
        }
        fetchCmsData()
    }, [])

    useEffect(() => {
        if (!promotionEnd) return

        const timer = setInterval(() => {
            const now = new Date().getTime()
            const distance = new Date(promotionEnd).getTime() - now

            if (isNaN(distance) || distance < 0) {
                setTimeLeft('')
                return
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        }, 1000)

        return () => clearInterval(timer)
    }, [promotionEnd])

    // Priority: CMS > Settings > Default
    const textToShow = cmsText || settings.announcement_text

    if (settings.loading) return null
    if (!settings.show_announcement && !cmsText) return null

    return (
        <div className="bg-brand-red w-full py-2 px-4 shadow-sm relative z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-3">
                <p className="text-white text-sm font-medium tracking-wide animate-pulse-slow">
                    {textToShow}
                </p>
                {timeLeft && (
                    <span className="bg-white/20 px-2 py-0.5 rounded text-white text-xs font-bold animate-pulse">
                        Ends in: {timeLeft}
                    </span>
                )}
            </div>
        </div>
    )
}
