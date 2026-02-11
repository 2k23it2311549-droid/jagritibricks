import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const heroSlides = [
    {
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1920',
        title: 'Build Stronger.',
        subtitle: 'Build Smarter.',
        description: 'Premium construction materials delivered directly from factory to your site — at unbeatable prices.'
    },
    {
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920',
        title: 'Quality You Can',
        subtitle: 'Trust.',
        description: 'Lab-tested bricks, cement, TMT steel & sand. Every product meets the highest industry standards.'
    },
    {
        image: 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=1920',
        title: 'From Factory',
        subtitle: 'To Foundation.',
        description: 'Cut out the middlemen. Save up to 30% on every order with our direct-from-manufacturer pricing.'
    }
]

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
                setIsTransitioning(false)
            }, 500)
        }, 6000)

        return () => clearInterval(timer)
    }, [])

    const slide = heroSlides[currentSlide]

    return (
        <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
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

            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-20 w-72 h-72 border border-white/10 rounded-full"></div>
                <div className="absolute bottom-20 right-40 w-48 h-48 border border-white/5 rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-accent-orange rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        {/* Badge */}
                        <div
                            className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-white/90 text-sm font-medium">Factory-Direct Pricing • Save up to 30%</span>
                        </div>

                        {/* Title */}
                        <h1
                            className={`text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
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
                            className={`text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed transition-all duration-500 delay-100 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
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
                                className="group px-8 py-4 bg-gradient-to-r from-brand-red to-red-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Shop Now
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/contact"
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 text-center"
                            >
                                Get a Quote
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex items-center gap-6 mt-12 text-white/50 text-sm">
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
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
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
