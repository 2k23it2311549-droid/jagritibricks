import { Helmet } from 'react-helmet-async'

export default function Privacy() {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | JagritiBricks</title>
                <meta name="description" content="Read JagritiBricks' privacy policy to understand how we collect, use, and protect your personal information." />
            </Helmet>

            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-gradient-to-br from-brand-dark to-gray-900 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block px-4 py-1.5 bg-white/10 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase backdrop-blur-sm">Legal</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Privacy Policy</h1>
                        <p className="text-gray-300 text-lg">Last updated: February 2026</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">

                        <Section title="1. Information We Collect">
                            <p>We collect information you provide directly, including:</p>
                            <ul className="list-disc ml-6 mt-3 space-y-2">
                                <li>Name, email address, phone number, and delivery address when you place an order</li>
                                <li>Payment information (processed securely through our payment partners)</li>
                                <li>Communication records when you contact our support team</li>
                                <li>Account details if you create a JagritiBricks account</li>
                            </ul>
                        </Section>

                        <Section title="2. How We Use Your Information">
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Process and deliver your orders</li>
                                <li>Communicate regarding order status, delivery updates, and support</li>
                                <li>Improve our products, services, and website experience</li>
                                <li>Send promotional offers (only with your consent)</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </Section>

                        <Section title="3. Information Sharing">
                            <p>We do not sell your personal information. We may share data with:</p>
                            <ul className="list-disc ml-6 mt-3 space-y-2">
                                <li>Delivery partners to fulfill your orders</li>
                                <li>Payment processors for secure transactions</li>
                                <li>Legal authorities when required by law</li>
                            </ul>
                        </Section>

                        <Section title="4. Data Security">
                            <p>We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.</p>
                        </Section>

                        <Section title="5. Your Rights">
                            <p>You have the right to access, update, or delete your personal data at any time. Contact us at <a href="mailto:info@jagritibricks.com" className="text-brand-red hover:underline">info@jagritibricks.com</a> for any privacy-related requests.</p>
                        </Section>

                        <Section title="6. Cookies">
                            <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.</p>
                        </Section>

                        <Section title="7. Contact Us">
                            <p>For any questions about this Privacy Policy, please reach out to us at <a href="mailto:info@jagritibricks.com" className="text-brand-red hover:underline">info@jagritibricks.com</a> or call our support team.</p>
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
