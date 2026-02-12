import { useSiteSettings } from '../context/SiteSettingsContext'

export default function MaintenancePage() {
    const { settings } = useSiteSettings()

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-8 animate-pulse text-6xl">
                🚧
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Under Maintenance
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto mb-8">
                {settings?.announcement_text || "We're currently upgrading our site to serve you better. We'll be back shortly!"}
            </p>

            {settings?.phone && (
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-sm w-full">
                    <p className="text-gray-400 text-sm mb-2">Need urgent assistance?</p>
                    <p className="text-xl font-bold text-white">{settings.phone}</p>
                    {settings.whatsapp_number && (
                        <a
                            href={`https://wa.me/${settings.whatsapp_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block bg-[#25D366] text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition"
                        >
                            Chat on WhatsApp
                        </a>
                    )}
                </div>
            )}
        </div>
    )
}
