import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const defaultSlides = [
    {
        image: '/img/heroimage1.jpeg',
        title: 'Authentic JAGRITI',
        subtitle: 'Bricks.',
        description: 'The mark of quality you can trust. High-strength, lab-tested red bricks delivered directly to your site from our Kanpur kiln.'
    },
    {
        image: '/img/hero-house.jpg',
        title: 'Build Your',
        subtitle: 'Dream Home.',
        description: 'From foundation to finishing, we provide the premium materials you need to build a home that lasts for generations.'
    },
    {
        image: '/img/brickimage.jpg',
        title: 'Expert',
        subtitle: 'Craftsmanship.',
        description: 'Building is an art. We supply the perfect canvas with uniform, high-quality bricks that make construction easier and faster.'
    }
]

export default function Hero() {
    const [heroSlides, setHeroSlides] = useState(defaultSlides)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    // useEffect(() => {
    //     fetchHeroContent()
    // }, [])

    // const fetchHeroContent = async () => {
    //     try {
    //         const { data } = await supabase
    //             .from('site_content')
    //             .select('*')
    //             .eq('section', 'hero')

    //         if (data && data.length > 0) {
    //             // Map CMS key-value pairs to slide structure
    //             // Assuming we want to override the first slide with CMS data for now
    //             // Or if we structured the CMS keys as 'title_1', 'image_1', etc.

    //             const slide1 = { ...defaultSlides[0] }
    //             data.forEach(item => {
    //                 if (item.key === 'title_1') slide1.title = item.value
    //                 if (item.key === 'subtitle_1') slide1.subtitle = item.value
    //                 if (item.key === 'description_1') slide1.description = item.value
    //                 if (item.key === 'image_1') slide1.image = item.value
    //             })

    //             // For this demo, we'll just update the first slide with dynamic content
    //             setHeroSlides([slide1, ...defaultSlides.slice(1)])
    //         }
    //     } catch (error) {
    //         console.error('Error fetching hero content:', error)
    //     }
    // }

    useEffect(() => {
        const timer = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
                setIsTransitioning(false)
            }, 500)
        }, 6000)

        return () => clearInterval(timer)
    }, [heroSlides.length])

    const slide = heroSlides[currentSlide]

    return (
        <section className="relative h-[75vh] md:h-[90vh] min-h-[500px] md:min-h-[600px] overflow-hidden">
            {/* Background Images */}
            {heroSlides.map((s, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={s.image}
                        alt=""
                        className="w-full h-full object-cover scale-105"
                        style={{
                            animation: index === currentSlide ? 'heroZoom 8s ease-out forwards' : 'none'
                        }}
                    />
                </div>
            ))}

            {/* Dark overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>

            {/* Decorative elements & Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Geometric shapes */}
                <div className="absolute top-20 right-20 w-72 h-72 border border-white/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
                <div className="absolute bottom-20 right-40 w-48 h-48 border border-white/5 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>

                {/* Glowing dots */}
                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-accent-orange rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Floating particles */}
                <div className="absolute top-[15%] left-[10%] w-1 h-1 bg-brand-red/50 rounded-full animate-particle" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-[25%] right-[15%] w-1.5 h-1.5 bg-accent-orange/40 rounded-full animate-particle" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[60%] left-[20%] w-1 h-1 bg-white/30 rounded-full animate-particle" style={{ animationDelay: '4s' }}></div>
                <div className="absolute top-[45%] right-[30%] w-2 h-2 bg-emerald-400/30 rounded-full animate-particle" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-[70%] left-[40%] w-1 h-1 bg-yellow-400/30 rounded-full animate-particle" style={{ animationDelay: '3s' }}></div>
                <div className="absolute top-[35%] left-[60%] w-1.5 h-1.5 bg-white/20 rounded-full animate-particle" style={{ animationDelay: '5s' }}></div>
                <div className="absolute bottom-[25%] right-[10%] w-1 h-1 bg-brand-red/40 rounded-full animate-particle" style={{ animationDelay: '6s' }}></div>
                <div className="absolute top-[80%] left-[70%] w-1 h-1 bg-accent-orange/30 rounded-full animate-particle" style={{ animationDelay: '7s' }}></div>

                {/* Animated gradient orbs */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-accent-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        {/* Badge */}
                        <div
                            className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-6 md:mb-8 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-white/90 text-xs md:text-sm font-medium">Serving Only in Kanpur • Factory-Direct Pricing</span>
                        </div>

                        {/* Title */}
                        <h1
                            className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            {slide.title}
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-yellow-400">
                                {slide.subtitle}
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className={`text-base md:text-lg lg:text-xl text-white/70 mb-8 md:mb-10 max-w-xl leading-relaxed transition-all duration-500 delay-100 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            {slide.description}
                        </p>

                        {/* CTA Buttons */}
                        <div
                            className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 delay-200 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            <Link
                                to="/products"
                                className="group px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-brand-red to-red-600 text-white rounded-full font-bold text-base md:text-lg hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 dora-spring-btn active:scale-95"
                            >
                                Shop Now
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/contact"
                                className="px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-bold text-base md:text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 text-center dora-spring-btn active:scale-95"
                            >
                                Get a Quote
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-8 md:mt-12 text-white/50 text-xs md:text-sm">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Free Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Lab Tested</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>500+ Homes Built</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setIsTransitioning(true)
                            setTimeout(() => {
                                setCurrentSlide(index)
                                setIsTransitioning(false)
                            }, 500)
                        }}
                        className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide
                            ? 'w-10 bg-accent-orange'
                            : 'w-4 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>

            {/* CSS animation for zoom */}
            <style>{`
                @keyframes heroZoom {
                    from { transform: scale(1.05); }
                    to { transform: scale(1); }
                }
            `}</style>
        </section>
    )
}
