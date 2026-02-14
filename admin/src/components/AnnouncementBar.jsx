import { useSiteSettings } from '../context/SiteSettingsContext'

export default function AnnouncementBar() {
    const { settings } = useSiteSettings()

    if (settings.loading || !settings.show_announcement || !settings.announcement_text) {
        return null
    }

    return (
        <div className="bg-brand-red w-full py-2 px-4 shadow-sm relative z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
                <p className="text-white text-sm font-medium tracking-wide animate-pulse-slow">
                    {settings.announcement_text}
                </p>
            </div>
        </div>
    )
}
