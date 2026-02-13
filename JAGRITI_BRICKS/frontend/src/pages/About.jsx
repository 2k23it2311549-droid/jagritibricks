import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function About() {
    const values = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            ),
            title: 'Quality Assured',
            description: 'Every product is lab-tested and certified. We never compromise on the strength and durability of our materials.',
            color: 'emerald'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
            ),
            title: 'Factory-Direct Pricing',
            description: 'No middlemen, no hidden charges. We connect you directly to manufacturers so you save up to 30% on every order.',
            color: 'orange'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
            ),
            title: 'Fast Local Delivery',
            description: 'Reliable delivery straight to your construction site. We serve 15+ cities and ensure your materials arrive on time.',
            color: 'blue'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
            ),
            title: 'Customer First',
            description: 'From expert guidance to post-delivery support, we\'re with you at every step of your construction journey.',
            color: 'red'
        }
    ]

    const colorMap = {
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', hover: 'group-hover:bg-emerald-100' },
        orange: { bg: 'bg-orange-50', text: 'text-accent-orange', border: 'border-orange-200', hover: 'group-hover:bg-orange-100' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hover: 'group-hover:bg-blue-100' },
        red: { bg: 'bg-red-50', text: 'text-brand-red', border: 'border-red-200', hover: 'group-hover:bg-red-100' }
    }

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>About Us - JagritiBricks</title>
                <meta name="description" content="Learn about JagritiBricks, your trusted partner for factory-direct construction materials in India. Quality assured, affordable, and delivered to your doorstep." />
            </Helmet>

            {/* Hero Banner */}
            <section className="relative py-20 md:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-brand-dark overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-10 left-10 w-40 h-40 border border-white/20 rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-60 h-60 border border-white/10 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/5 rounded-full"></div>
                </div>
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-accent-orange/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold rounded-full mb-6 tracking-wide uppercase">
                        Our Story
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                        Building Dreams with{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-yellow-400">
                            Strength & Quality
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                        JagritiBricks connects builders, contractors, and homeowners directly with manufacturers — delivering premium construction materials at unbeatable prices.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Image Side */}
                        <div className="relative" data-aos="fade-right">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800"
                                    alt="Construction site with quality materials"
                                    className="w-full h-80 md:h-[420px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>
                            {/* Floating stats card */}
                            <div className="absolute -bottom-6 -right-4 md:right-6 bg-white rounded-xl shadow-xl p-5 border border-gray-100">
                                <div className="text-3xl font-bold text-brand-red font-serif">10+</div>
                                <p className="text-sm text-gray-500 font-medium">Years of Trust</p>
                            </div>
                        </div>

                        {/* Text Side */}
                        <div data-aos="fade-left">
                            <span className="inline-block px-4 py-1.5 bg-brand-red/10 text-brand-red text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
                                Who We Are
                            </span>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                                From Factory Floor to Your Foundation
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    JagritiBricks was born from a simple idea — construction materials should be <strong className="text-gray-900">affordable, high-quality, and easily accessible</strong> to everyone. We saw how middlemen inflated prices and decided to change the game.
                                </p>
                                <p>
                                    Today, we partner directly with certified manufacturers across India to bring you lab-tested cement, bricks, TMT steel, and sand at prices that are <strong className="text-gray-900">up to 30% lower</strong> than traditional suppliers.
                                </p>
                                <p>
                                    Whether you're building your first home or managing a large construction project, we're here to ensure you get the best materials — delivered on time, every time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-500" data-aos="fade-up">
                            <div className="w-14 h-14 bg-brand-red/10 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To make construction materials accessible and affordable for everyone by eliminating middlemen and providing transparent, factory-direct pricing with reliable local delivery across India.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-500" data-aos="fade-up" data-aos-delay="100">
                            <div className="w-14 h-14 bg-accent-orange/10 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-7 h-7 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To become India's most trusted online destination for construction materials — empowering every homeowner and builder to create durable, beautiful structures without breaking the bank.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14" data-aos="fade-up">
                        <span className="inline-block px-4 py-1.5 bg-accent-orange/10 text-accent-orange text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
                            What Drives Us
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            These principles guide every decision we make, from sourcing to delivery.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-accent-orange to-brand-red mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const colors = colorMap[value.color]
                            return (
                                <div
                                    key={value.title}
                                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className={`w-14 h-14 ${colors.bg} ${colors.hover} rounded-xl flex items-center justify-center mb-5 transition-colors duration-300`}>
                                        <div className={colors.text}>{value.icon}</div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center"
                        data-aos="fade-up"
                    >
                        <div>
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-red mb-1 font-serif">500+</div>
                            <p className="text-gray-500 text-sm">Homes Built</p>
                        </div>
                        <div>
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-accent-orange mb-1 font-serif">15+</div>
                            <p className="text-gray-500 text-sm">Cities Served</p>
                        </div>
                        <div>
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-600 mb-1 font-serif">98%</div>
                            <p className="text-gray-500 text-sm">Happy Customers</p>
                        </div>
                        <div>
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-1 font-serif">10+</div>
                            <p className="text-gray-500 text-sm">Years Experience</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-brand-red to-red-800 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-4 text-white" data-aos="fade-up">
                        Ready to Build with Us?
                    </h2>
                    <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                        Browse our premium construction materials and experience factory-direct quality at unbeatable prices.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
                        <Link
                            to="/products"
                            className="px-8 py-4 bg-white text-brand-red rounded-full font-bold text-lg hover:bg-gray-100 hover:shadow-xl transition-all hover:scale-105"
                        >
                            Browse Products
                        </Link>
                        <Link
                            to="/contact"
                            className="px-8 py-4 bg-transparent border-2 border-white/40 text-white rounded-full font-bold text-lg hover:bg-white/10 hover:border-white transition-all hover:scale-105"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
