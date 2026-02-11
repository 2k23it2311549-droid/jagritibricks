import Hero from '../components/Hero'
import Testimonials from '../components/Testimonials'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Home() {
    const navigate = useNavigate()

    const categories = [
        {
            name: 'Cement',
            image: 'https://images.unsplash.com/photo-1590937276225-10597839ebe7?auto=format&fit=crop&q=80&w=600',
            description: 'Premium quality cement bags',
            link: '/products?category=cement'
        },
        {
            name: 'Bricks',
            image: 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=600',
            description: 'Factory-direct clay and fly ash bricks',
            link: '/products?category=bricks'
        },
        {
            name: 'Sariya (TMT Steel)',
            image: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&q=80&w=600',
            description: 'High-strength TMT steel bars',
            link: '/products?category=sariya'
        },
        {
            name: 'Sand',
            image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600',
            description: 'M-Sand and river sand for construction',
            link: '/products?category=sand'
        }
    ]

    const whyChooseUs = [
        {
            title: 'Factory-Direct Pricing',
            description: 'No middlemen, no markup. Get the best prices directly from manufacturers and save up to 30% on every order.',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600',
            accent: 'brand-red'
        },
        {
            title: 'Fast Local Delivery',
            description: 'Reliable delivery straight to your construction site. Track your order in real-time and get materials when you need them.',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
            accent: 'accent-orange'
        },
        {
            title: 'Quality Assured',
            description: 'Every product is lab-tested and certified for strength and durability. Build with confidence knowing you have the best.',
            image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
            accent: 'emerald-600'
        }
    ]

    const steps = [
        {
            number: 1,
            title: 'Choose Ideal Land',
            description: 'Location, accessibility, and other factors that matter!',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600'
        },
        {
            number: 2,
            title: 'Planning & Design',
            description: 'Work with architects to create a functional blueprint.',
            image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600'
        },
        {
            number: 3,
            title: 'Budgeting & Materials',
            description: 'Estimate costs accurately and select the right materials.',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600'
        },
        {
            number: 4,
            title: 'Construction Techniques',
            description: 'Understand best practices for foundation and masonry.',
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600'
        }
    ]

    const customerHomes = [
        {
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
            name: 'Rajesh Sharma',
            location: 'Jaipur, Rajasthan',
            size: 'large'
        },
        {
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
            name: 'Sunita Devi',
            location: 'Lucknow, UP',
            size: 'small'
        },
        {
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
            name: 'Vikram Singh',
            location: 'Bhopal, MP',
            size: 'small'
        },
        {
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
            name: 'Anita Gupta',
            location: 'Indore, MP',
            size: 'small'
        },
        {
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
            name: 'Manoj Patel',
            location: 'Ahmedabad, Gujarat',
            size: 'large'
        },
        {
            image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
            name: 'Kavita Joshi',
            location: 'Udaipur, Rajasthan',
            size: 'small'
        }
    ]

    return (
        <div>
            <Hero />

            {/* Why Choose JagritiBricks */}
            <section className="why-choose-section py-20 relative overflow-hidden bg-white">
                {/* Background decorative elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-brand-red/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-orange/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <span className="inline-block px-4 py-1.5 bg-brand-red/10 text-brand-red text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
                            Our Promise
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Why Choose <span className="text-brand-red">JagritiBricks</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            We're committed to delivering excellence at every step — from sourcing to your doorstep.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-brand-red to-accent-orange mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {whyChooseUs.map((item, index) => (
                            <div
                                key={item.title}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                {/* Image */}
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className={`text-xl font-bold mb-3 text-gray-900 group-hover:text-${item.accent} transition-colors`}>
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Browse by Category */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14" data-aos="fade-up">
                        <span className="inline-block px-4 py-1.5 bg-accent-orange/10 text-accent-orange text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
                            Our Products
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Browse by Category
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Explore our wide range of premium construction materials.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-accent-orange to-brand-red mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <Link
                                key={category.name}
                                to={category.link}
                                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Dark overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                    {/* Text overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent-orange transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-300 text-sm">{category.description}</p>
                                    </div>

                                    {/* Hover arrow indicator */}
                                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Home Building Guide */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14" data-aos="fade-up">
                        <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
                            Step by Step
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Home Building Guide
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            From the first plot of land to the final coat of paint, follow our step-by-step guide to
                            build your dream home with confidence.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-accent-orange mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, index) => (
                            <div
                                key={step.number}
                                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={step.image}
                                        alt={step.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                    {/* Step number badge */}
                                    <div className="absolute top-4 left-4 w-10 h-10 bg-accent-orange rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {step.number}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="bg-white p-5">
                                    <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-accent-orange transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Built with JagritiBricks - Customer Homes Gallery */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14" data-aos="fade-up">
                        <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full mb-4 tracking-wide uppercase">
                            Real Results
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                            Built with <span className="text-brand-red">JagritiBricks</span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            See the beautiful homes our customers have built using our premium construction materials.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-brand-red mx-auto mt-6 rounded-full"></div>
                    </div>

                    {/* Masonry-style gallery grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {customerHomes.map((home, index) => (
                            <div
                                key={index}
                                className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer ${home.size === 'large' ? 'sm:row-span-2' : ''
                                    }`}
                                data-aos="fade-up"
                                data-aos-delay={index * 80}
                            >
                                <div className={`relative overflow-hidden ${home.size === 'large' ? 'h-full min-h-[420px]' : 'h-64'}`}>
                                    <img
                                        src={home.image}
                                        alt={`Home by ${home.name}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />

                                    {/* Default subtle overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Info overlay on hover */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold text-sm border border-white/30">
                                                {home.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm">{home.name}</h4>
                                                <p className="text-white/70 text-xs flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    {home.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verified badge */}
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20">
                                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-white text-xs font-medium">Verified</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats bar */}
                    <div
                        className="mt-14 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
                        data-aos="fade-up"
                    >
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-brand-red mb-1">500+</div>
                            <p className="text-gray-500 text-sm">Homes Built</p>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-accent-orange mb-1">15+</div>
                            <p className="text-gray-500 text-sm">Cities Served</p>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">98%</div>
                            <p className="text-gray-500 text-sm">Happy Customers</p>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">10+</div>
                            <p className="text-gray-500 text-sm">Years Experience</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <Testimonials />

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-brand-red to-red-800 relative overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-white" data-aos="fade-up">
                        Ready to Build Your Dream Home?
                    </h2>
                    <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                        Order quality construction materials today and get them delivered directly to your site.
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
