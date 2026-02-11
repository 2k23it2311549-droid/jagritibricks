import { Helmet } from 'react-helmet-async'

export default function Terms() {
    return (
        <>
            <Helmet>
                <title>Terms of Service | JagritiBricks</title>
                <meta name="description" content="Read the terms and conditions for using JagritiBricks' website and services." />
            </Helmet>

            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-gradient-to-br from-brand-dark to-gray-900 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block px-4 py-1.5 bg-white/10 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase backdrop-blur-sm">Legal</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Terms of Service</h1>
                        <p className="text-gray-300 text-lg">Last updated: February 2026</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">

                        <Section title="1. Acceptance of Terms">
                            <p>By accessing and using JagritiBricks' website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
                        </Section>

                        <Section title="2. Products & Pricing">
                            <ul className="list-disc ml-6 space-y-2">
                                <li>All product prices are listed in Indian Rupees (₹) and include applicable taxes unless stated otherwise</li>
                                <li>Prices are subject to change without prior notice</li>
                                <li>Product images are for illustration purposes; actual products may vary slightly</li>
                                <li>We reserve the right to limit order quantities</li>
                            </ul>
                        </Section>

                        <Section title="3. Orders & Payment">
                            <ul className="list-disc ml-6 space-y-2">
                                <li>An order is confirmed only after successful payment processing</li>
                                <li>We accept UPI, net banking, debit/credit cards, and cash on delivery (for select areas)</li>
                                <li>We reserve the right to cancel orders due to pricing errors or stock unavailability</li>
                            </ul>
                        </Section>

                        <Section title="4. Delivery">
                            <p>Delivery timelines are estimates and may vary based on location, weather, and stock availability. We will notify you of any significant delays. Please refer to our <a href="/shipping" className="text-brand-red hover:underline">Shipping Info</a> page for more details.</p>
                        </Section>

                        <Section title="5. Quality Guarantee">
                            <p>All materials supplied by JagritiBricks meet industry-standard quality benchmarks. If you receive defective or damaged goods, please contact us within 48 hours of delivery with photos for resolution.</p>
                        </Section>

                        <Section title="6. Limitation of Liability">
                            <p>JagritiBricks shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid for the specific order in question.</p>
                        </Section>

                        <Section title="7. Governing Law">
                            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in our operating region.</p>
                        </Section>

                        <Section title="8. Contact">
                            <p>Questions about these terms? Email us at <a href="mailto:info@jagritibricks.com" className="text-brand-red hover:underline">info@jagritibricks.com</a>.</p>
                        </Section>
                    </div>
                </div>
            </div>
        </>
    )
}

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-1 h-6 bg-brand-red rounded-full"></div>
                {title}
            </h2>
            <div className="text-gray-600 leading-relaxed">{children}</div>
        </div>
    )
}
