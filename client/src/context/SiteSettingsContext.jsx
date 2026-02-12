import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const SiteSettingsContext = createContext()

export function useSiteSettings() {
    return useContext(SiteSettingsContext)
}

export function SiteSettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        phone: '+91 9876543210',
        email: 'info@jagritibricks.com',
        address: '123 Construction Avenue, Industrial Area, City - 123456',
        facebook_url: 'https://facebook.com',
        instagram_url: 'https://instagram.com',
        twitter_url: 'https://twitter.com',
        whatsapp_number: '919876543210',
        maintenance_mode: false,
        loading: true
    })

    useEffect(() => {
        fetchSettings()

        // Subscribe to changes
        const subscription = supabase
            .channel('site_settings_changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_settings' }, payload => {
                setSettings(prev => ({ ...prev, ...payload.new }))
            })
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single()

            if (error) {
                // If error (e.g., no row), keep defaults but log it
                console.error('Error fetching site settings:', error)
                setSettings(prev => ({ ...prev, loading: false }))
                return
            }

            if (data) {
                setSettings({ ...data, loading: false })
            }
        } catch (error) {
            console.error('Unexpected error fetching settings:', error)
            setSettings(prev => ({ ...prev, loading: false }))
        }
    }

    const value = {
        settings,
        refreshSettings: fetchSettings
    }

    return (
        <SiteSettingsContext.Provider value={value}>
            {children}
        </SiteSettingsContext.Provider>
    )
}
