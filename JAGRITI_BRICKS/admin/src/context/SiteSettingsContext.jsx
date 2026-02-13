import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

const SiteSettingsContext = createContext({});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        phone: '+91 9876543210',
        email: 'info@jagritibricks.com',
        address: 'Jagriti Vihar, Meerut, Uttar Pradesh',
        facebook_url: 'https://facebook.com',
        instagram_url: 'https://instagram.com',
        twitter_url: 'https://twitter.com',
        whatsapp_number: '919876543210',
        delivery_fee: 50,
        free_shipping_threshold: 5000,
        announcement_text: '',
        show_announcement: false,
        maintenance_mode: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/site');
            setSettings(data.settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            const { data } = await api.put('/site', newSettings);
            setSettings(data.settings);
            return { error: null };
        } catch (error) {
            console.error('Error updating settings:', error);
            return { error: error.response?.data || error };
        }
    };

    return (
        <SiteSettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings: fetchSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};
