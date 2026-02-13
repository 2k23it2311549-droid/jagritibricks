import { Helmet } from 'react-helmet-async'
import { useState } from 'react'

const faqs = [
    {
        category: 'Orders & Payment',
        questions: [
            { q: 'How do I place an order?', a: 'Browse our products, add items to your cart, and proceed to checkout. You can pay via UPI, net banking, debit/credit card, or choose cash on delivery where available.' },
            { q: 'Can I modify or cancel my order?', a: 'You can modify or cancel your order before it is dispatched. Once dispatched, cancellation may not be possible. Contact our support team as soon as possible for assistance.' },
            { q: 'Do you offer cash on delivery (COD)?', a: 'Yes, COD is available for select service areas. The option will appear at checkout if your delivery location is eligible.' },
        ]
    },
    {
        category: 'Delivery & Shipping',
        questions: [
            { q: 'How long does delivery take?', a: 'Local orders typically arrive within 1–2 business days. Nearby districts take 2–4 days, and bulk orders may take 3–7 days. See our Shipping Info page for details.' },
            { q: 'Do you deliver to my area?', a: 'We deliver to multiple cities and surrounding regions. Contact us to confirm delivery availability for your specific location.' },
            { q: 'Is there a minimum order for free delivery?', a: 'Yes, we offer free delivery on orders above ₹10,000 within our primary service areas.' },
        ]
    },
    {
        category: 'Products & Quality',
        questions: [
            { q: 'Are your products factory-direct?', a: 'Yes! We supply directly from the factory, eliminating middlemen and ensuring the best prices along with consistent quality.' },
            { q: 'What quality standards do your materials meet?', a: 'All our products meet or exceed Indian industry-standard quality benchmarks. Our bricks, cement, sariya, and sand undergo regular quality checks.' },
            { q: 'Can I request a sample before bulk ordering?', a: 'Yes, we can arrange samples for bulk order inquiries. Contact our team to arrange this.' },
        ]
    },
    {
        category: 'Returns & Refunds',
        questions: [
            { q: 'What is your return policy?', a: 'If you receive damaged, defective, or incorrect products, you can request a return within 48 hours of delivery. See our Returns & Refunds page for full details.' },
            { q: 'How long do refunds take?', a: 'Approved refunds are processed within 5–7 business days and credited to your original payment method.' },
            { q: 'Can I return materials I no longer need?', a: 'Returns are only accepted for defective, damaged, or incorrectly delivered items. We do not accept returns for change of mind on construction materials.' },
        ]
    }
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null)

    const toggle = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx)
    }

    let globalIndex = 0

    return (
        <>
            <Helmet>
                <title>FAQs | JagritiBricks</title>
                <meta name="description" content="Find answers to frequently asked questions about JagritiBricks' products, ordering, delivery, and returns." />
            </Helmet>

            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-gradient-to-br from-brand-dark to-gray-900 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block px-4 py-1.5 bg-white/10 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase backdrop-blur-sm">Help Center</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
                        <p className="text-gray-300 text-lg">Quick answers to common questions</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="space-y-10">
                        {faqs.map((section) => (
                            <div key={section.category}>
                                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3">
                                    <div className="w-1 h-6 bg-brand-red rounded-full"></div>
                                    {section.category}
                                </h2>
                                <div className="space-y-3">
                                    {section.questions.map((item) => {
                                        const idx = globalIndex++
                                        const isOpen = openIndex === idx
                                        return (
                                            <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                                <button
                                                    onClick={() => toggle(idx)}
                                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
                                                >
                                                    <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                                                    <svg
                                                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                                        {item.a}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Still have questions */}
                    <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Still have questions?</h3>
                        <p className="text-gray-500 mb-6">Our team is happy to help you with anything.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/contact" className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition hover:-translate-y-0.5">
                                Contact Us
                            </a>
                            <button
                                onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white px-6 py-3 rounded-xl font-semibold transition hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                Chat on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
