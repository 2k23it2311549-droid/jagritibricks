import { Helmet } from 'react-helmet-async'

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>About Us - JagritiBricks</title>
                <meta name="description" content="Learn about JagritiBricks, your trusted partner for factory-direct construction materials in India." />
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-serif font-bold mb-8 text-center">About JagritiBuild</h1>

                <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                    <p className="text-lg text-gray-700">
                        JagritiBuild is your trusted partner for quality construction materials. We connect builders,
                        contractors, and homeowners directly with manufacturers to provide the best prices on cement,
                        bricks, sariya, and sand.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
                    <p className="text-gray-700">
                        To make construction materials accessible and affordable for everyone by eliminating middlemen
                        and providing transparent pricing with local delivery.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us</h2>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <span className="text-brand-red font-bold mr-2">✓</span>
                            <span>Factory-direct pricing with no hidden costs</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-brand-red font-bold mr-2">✓</span>
                            <span>Quality-tested materials from trusted manufacturers</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-brand-red font-bold mr-2">✓</span>
                            <span>Fast local delivery to your construction site</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-brand-red font-bold mr-2">✓</span>
                            <span>Expert guidance for your construction needs</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
