import { Helmet } from 'react-helmet-async'

export default function Shipping() {
    return (
        <>
            <Helmet>
                <title>Shipping Info | JagritiBricks</title>
                <meta name="description" content="Learn about JagritiBricks' shipping policies, delivery times, and service areas." />
            </Helmet>

            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-gradient-to-br from-brand-dark to-gray-900 text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <span className="inline-block px-4 py-1.5 bg-white/10 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase backdrop-blur-sm">Delivery</span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Shipping Information</h1>
                        <p className="text-gray-300 text-lg">Fast and reliable delivery to your construction site</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">

                        <Section title="Delivery Areas">
                            <p>We currently deliver construction materials across multiple cities and surrounding regions. Contact us to confirm if we deliver to your specific location.</p>
                        </Section>

                        <Section title="Delivery Timelines">
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Order Type</th>
                                            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Estimated Delivery</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <tr className="border-b"><td className="px-4 py-3">Local orders (within city)</td><td className="px-4 py-3">1 – 2 business days</td></tr>
                                        <tr className="border-b"><td className="px-4 py-3">Nearby districts</td><td className="px-4 py-3">2 – 4 business days</td></tr>
                                        <tr className="border-b"><td className="px-4 py-3">Bulk / wholesale orders</td><td className="px-4 py-3">3 – 7 business days</td></tr>
                                        <tr><td className="px-4 py-3">Custom / special orders</td><td className="px-4 py-3">Timeline shared upon confirmation</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section title="Shipping Charges">
                            <ul className="list-disc ml-6 space-y-2">
                                <li><strong>Free delivery</strong> on orders above ₹10,000 within service areas</li>
                                <li>For smaller orders or distant locations, shipping charges are calculated at checkout based on weight and distance</li>
                                <li>Bulk orders may qualify for additional discounts on delivery</li>
                            </ul>
                        </Section>

                        <Section title="Order Tracking">
                            <p>Once your order is dispatched, you will receive a notification via SMS/WhatsApp with delivery details. You can also check your order status from the <a href="/orders" className="text-brand-red hover:underline">My Orders</a> page.</p>
                        </Section>

                        <Section title="Important Notes">
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Delivery timelines may be affected by weather, road conditions, or unforeseen circumstances</li>
                                <li>Please ensure someone is available at the delivery address to receive the materials</li>
                                <li>Unloading assistance may or may not be included; please confirm at the time of order</li>
                            </ul>
                        </Section>

                        <Section title="Need Help?">
                            <p>For any shipping-related queries, contact us at <a href="mailto:info@jagritibricks.com" className="text-brand-red hover:underline">info@jagritibricks.com</a> or chat with us on WhatsApp.</p>
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
                <div className="w-1 h-6 bg-accent-orange rounded-full"></div>
                {title}
            </h2>
            <div className="text-gray-600 leading-relaxed">{children}</div>
        </div>
    )
}
