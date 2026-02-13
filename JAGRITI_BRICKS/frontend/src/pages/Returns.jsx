import { Helmet } from 'react-helmet-async'

export default function Returns() {
    return (
        <>
            <Helmet>
                <title>Returns & Refunds | JagritiBricks</title>
                <meta name="description" content="Learn about JagritiBricks' returns and refund policies for construction materials." />
            </Helmet>

            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-gradient-to-br from-brand-dark to-gray-900 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block px-4 py-1.5 bg-white/10 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase backdrop-blur-sm">Policies</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Returns & Refunds</h1>
                        <p className="text-gray-300 text-lg">Your satisfaction is our priority</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">

                        <Section title="Return Policy">
                            <p>We stand behind the quality of our materials. If you receive defective, damaged, or incorrect products, you can request a return or replacement within <strong>48 hours of delivery</strong>.</p>
                        </Section>

                        <Section title="Eligible for Returns">
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Damaged or broken materials upon delivery</li>
                                <li>Wrong product delivered (different from what was ordered)</li>
                                <li>Significant quality discrepancies from the listed specification</li>
                            </ul>
                        </Section>

                        <Section title="Not Eligible for Returns">
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Products damaged after delivery due to improper handling or storage</li>
                                <li>Minor cosmetic variations that do not affect structural quality</li>
                                <li>Custom or made-to-order items</li>
                                <li>Returns requested after 48 hours of delivery</li>
                            </ul>
                        </Section>

                        <Section title="How to Request a Return">
                            <ol className="list-decimal ml-6 space-y-3">
                                <li>Take clear photos of the damaged/incorrect products</li>
                                <li>Contact us via WhatsApp, email, or phone within 48 hours</li>
                                <li>Our team will review and verify the claim</li>
                                <li>If approved, we will arrange pickup or replacement delivery</li>
                            </ol>
                        </Section>

                        <Section title="Refund Process">
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Approved refunds are processed within <strong>5–7 business days</strong></li>
                                <li>Refunds will be credited to the original payment method</li>
                                <li>For COD orders, refunds will be processed via bank transfer</li>
                                <li>Shipping charges are non-refundable unless the error is on our end</li>
                            </ul>
                        </Section>

                        <Section title="Contact Us">
                            <p>For return or refund requests, reach out to us at <a href="mailto:info@jagritibricks.com" className="text-brand-red hover:underline">info@jagritibricks.com</a> or chat with us on WhatsApp for quick assistance.</p>
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
