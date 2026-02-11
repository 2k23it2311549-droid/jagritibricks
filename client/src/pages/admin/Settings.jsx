import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabaseClient'

export default function Settings() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        phone: '',
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

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <AdminLayout title="Site Settings">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                <input
                                    type="text"
                                    name="whatsapp_number"
                                    value={formData.whatsapp_number}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                                    placeholder="919876543210 (No spaces/symbols)"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
                                <textarea
                                    name="address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-red outline-none resize-none"
                                    placeholder="Full Address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Social Media Links</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">facebook.com/</span>
                                    <input
                                        type="text"
                                        name="facebook_url"
                                        value={formData.facebook_url.replace('https://facebook.com/', '')}
                                        onChange={(e) => setFormData({ ...formData, facebook_url: `https://facebook.com/${e.target.value}` })}
                                        className="flex-1 w-full border rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">instagram.com/</span>
                                    <input
                                        type="text"
                                        name="instagram_url"
                                        value={formData.instagram_url.replace('https://instagram.com/', '')}
                                        onChange={(e) => setFormData({ ...formData, instagram_url: `https://instagram.com/${e.target.value}` })}
                                        className="flex-1 w-full border rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">X (Twitter) URL</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">twitter.com/</span>
                                    <input
                                        type="text"
                                        name="twitter_url"
                                        value={formData.twitter_url.replace('https://twitter.com/', '')}
                                        onChange={(e) => setFormData({ ...formData, twitter_url: `https://twitter.com/${e.target.value}` })}
                                        className="flex-1 w-full border rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Configuration */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Shipping Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
                                <input
                                    type="number"
                                    name="delivery_fee"
                                    value={formData.delivery_fee}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold (₹)</label>
                                <input
                                    type="number"
                                    name="free_shipping_threshold"
                                    value={formData.free_shipping_threshold}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Store Announcement */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Store Announcement</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="show_announcement"
                                    name="show_announcement"
                                    checked={formData.show_announcement}
                                    onChange={(e) => setFormData({ ...formData, show_announcement: e.target.checked })}
                                    className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                                />
                                <label htmlFor="show_announcement" className="ml-2 block text-sm text-gray-900">
                                    Show Announcement Bar
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Text</label>
                                <input
                                    type="text"
                                    name="announcement_text"
                                    value={formData.announcement_text}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-red outline-none"
                                    placeholder="e.g., Summer Sale - Flat 50% Off!"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Store Status */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Store Status</h3>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="maintenance_mode"
                                name="maintenance_mode"
                                checked={formData.maintenance_mode}
                                onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.checked })}
                                className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                            />
                            <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-900">
                                Enable Maintenance Mode (Hide site from customers)
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-brand-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-70 flex items-center"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    )
}
