
import { useState, useEffect } from 'react'

import { supabase } from '../lib/supabaseClient'

export default function Settings() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        address: '',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        whatsapp_number: '',
        delivery_fee: 40,
        free_shipping_threshold: 500,
        announcement_text: '',
        show_announcement: true,
        maintenance_mode: false
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single()

            if (data) {
                setFormData({
                    phone: data.phone || '',
                    email: data.email || '',
                    address: data.address || '',
                    facebook_url: data.facebook_url || '',
                    instagram_url: data.instagram_url || '',
                    twitter_url: data.twitter_url || '',
                    whatsapp_number: data.whatsapp_number || '',
                    delivery_fee: data.delivery_fee || 40,
                    free_shipping_threshold: data.free_shipping_threshold || 500,
                    announcement_text: data.announcement_text || '',
                    show_announcement: data.show_announcement ?? true,
                    maintenance_mode: data.maintenance_mode ?? false
                })
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            // Upsert with ID 1 to ensure singleton
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    id: 1,
                    ...formData,
                    updated_at: new Date()
                })

            if (error) throw error
            alert('Settings updated successfully!')
        } catch (error) {
            console.error('Error updating settings:', error)
            alert('Failed to update settings')
        } finally {
            setSaving(false)
        }
    }



    if (loading) return (
        <div className="dora-fade-in">
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
            </div>
        </div>
    )

    return (
        <div className="dora-fade-in">
            <div className="max-w-5xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Contact Information */}
                    <div className="clay-card p-8 dora-reveal">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">📞</span> Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none bg-gray-50 focus:bg-white"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
                                <input
                                    type="text"
                                    name="whatsapp_number"
                                    value={formData.whatsapp_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#25D366] focus:ring-4 focus:ring-[#25D366]/10 transition-all outline-none bg-gray-50 focus:bg-white"
                                    placeholder="919876543210 (No spaces/symbols)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none bg-gray-50 focus:bg-white"
                                    placeholder="info@jagritibricks.com"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Office Address</label>
                                <textarea
                                    name="address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none bg-gray-50 focus:bg-white resize-none"
                                    placeholder="Full Address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="clay-card p-8 dora-reveal" style={{ animationDelay: '0.1s' }}>
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="p-2 bg-pink-100 text-pink-600 rounded-lg">🌐</span> Social Media
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            <SocialInput
                                label="Facebook"
                                prefix="facebook.com/"
                                name="facebook_url"
                                value={formData.facebook_url}
                                onChange={(val) => setFormData({ ...formData, facebook_url: `https://facebook.com/${val}` })}
                                color="blue"
                            />
                            <SocialInput
                                label="Instagram"
                                prefix="instagram.com/"
                                name="instagram_url"
                                value={formData.instagram_url}
                                onChange={(val) => setFormData({ ...formData, instagram_url: `https://instagram.com/${val}` })}
                                color="pink"
                            />
                            <SocialInput
                                label="X (Twitter)"
                                prefix="twitter.com/"
                                name="twitter_url"
                                value={formData.twitter_url}
                                onChange={(val) => setFormData({ ...formData, twitter_url: `https://twitter.com/${val}` })}
                                color="gray"
                            />
                        </div>
                    </div>

                    {/* Store Announcement & Status */}
                    <div className="clay-card p-8 dora-reveal" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="p-2 bg-purple-100 text-purple-600 rounded-lg">🛍️</span> Store Configuration
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Fee (₹)</label>
                                <input
                                    type="number"
                                    name="delivery_fee"
                                    value={formData.delivery_fee}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none bg-gray-50 focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Free Shipping Threshold (₹)</label>
                                <input
                                    type="number"
                                    name="free_shipping_threshold"
                                    value={formData.free_shipping_threshold}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-6 border-t border-gray-100 pt-6">
                            {/* Announcement */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-bold text-gray-700">Announcement Bar</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.show_announcement}
                                            onChange={(e) => setFormData({ ...formData, show_announcement: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-vibrant"></div>
                                    </label>
                                </div>
                                {formData.show_announcement && (
                                    <input
                                        type="text"
                                        name="announcement_text"
                                        value={formData.announcement_text}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none bg-gray-50 focus:bg-white animate-fadeIn"
                                        placeholder="e.g., Summer Sale - Flat 50% Off!"
                                    />
                                )}
                            </div>

                            {/* Maintenance Mode */}
                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                                <div>
                                    <label className="text-sm font-bold text-red-800 block">Maintenance Mode</label>
                                    <p className="text-xs text-red-600 mt-1">Hide website from customers</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.maintenance_mode}
                                        onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 sticky bottom-8 z-10">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`btn-clay px-8 py-3 rounded-full font-bold text-white flex items-center gap-3 ${saving ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {saving ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                    Saving...
                                </>
                            ) : (
                                <>💾 Save Changes</>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

function SocialInput({ label, prefix, value, onChange, color }) {
    const rawValue = value.replace(`https://${prefix}`, '').replace('https://', '')

    return (
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
            <div className="flex rounded-xl shadow-sm">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium">
                    {prefix}
                </span>
                <input
                    type="text"
                    value={rawValue}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-xl border border-gray-200 focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange outline-none transition-all"
                    placeholder="username"
                />
            </div>
        </div>
    )
}
