import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabaseClient'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function Contact() {
    const { settings } = useSiteSettings()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null) // 'success' | 'error'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setStatus(null)

        try {
            // Generate dummy email for DB constraint
            const submissionData = {
                ...formData,
                email: `${formData.phone}@jagritibricks.com`
            }

            const { error } = await supabase
                .from('contact_messages')
                .insert([submissionData])

            if (error) throw error

            setStatus('success')
            setFormData({ name: '', email: '', phone: '', message: '' })
        } catch (error) {
            console.error('Error submitting form:', error)
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>Contact Us - JagritiBricks</title>
                <meta name="description" content="Get in touch with JagritiBricks for inquiries, orders, and support. We are here to help you build." />
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-600">We'd love to hear from you. Let's build something great together.</p>
                </div>

                <div className="max-w-4xl mx-auto mb-16">
                    {/* Contact Info & Map */}
                    <div className="space-y-8">
                        {/* Info Cards */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h3 className="text-2xl font-serif font-bold mb-6 text-gray-800 text-center">Contact for any details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Phone</p>
                                            <a href={`tel:${settings.phone}`} className="text-brand-red hover:underline block text-lg">{settings.phone}</a>
                                            <p className="text-sm text-gray-500 mt-1">Mon-Sat 9am to 7pm</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Email</p>
                                            <a href="mailto:info@jagritibricks.com" className="text-brand-red hover:underline">info@jagritibricks.com</a>
                                            <p className="text-sm text-gray-500 mt-1">Online support 24/7</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Office Address</p>
                                            <p className="text-gray-600">{settings.address}</p>
                                        </div>
                                    </div>

                                    <div>
                                        {settings.whatsapp_number && (
                                            <button
                                                onClick={() => window.open(`https://wa.me/${settings.whatsapp_number}`, '_blank')}
                                                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition font-medium flex items-center justify-center space-x-2"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                <span>Chat on WhatsApp</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden h-80">
                            <iframe
                                title="Jagriti Bricks Location"
                                src="https://maps.google.com/maps?q=Bandimata+bypass+chaubepur+kanpur&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
