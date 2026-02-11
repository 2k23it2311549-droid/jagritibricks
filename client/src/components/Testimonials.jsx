import { useState, useEffect, useRef } from 'react'

const testimonials = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        location: 'Jaipur, Rajasthan',
        role: 'Homeowner',
        image: 'https://i.pravatar.cc/150?img=12',
        rating: 5,
        text: 'JagritiBricks made building my dream home so easy! The quality of materials is top-notch, and the factory-direct pricing saved me lakhs. Highly recommended!'
    },
    {
        id: 2,
        name: 'Priya Sharma',
        location: 'Lucknow, UP',
        role: 'Builder',
        image: 'https://i.pravatar.cc/150?img=45',
        rating: 5,
        text: 'Fast delivery and excellent customer service. We used their TMT steel and bricks for our housing project. The team was very professional and helped us meet our deadlines.'
    },
    {
        id: 3,
        name: 'Vikram Singh',
        location: 'Bhopal, MP',
        role: 'Contractor',
        image: 'https://i.pravatar.cc/150?img=33',
        rating: 5,
        text: 'Best prices in the market without compromising on quality. The lab-tested materials give complete peace of mind. Been using JagritiBricks for all my projects now.'
    },
    {
        id: 4,
        name: 'Sunita Devi',
        location: 'Delhi NCR',
        role: 'Homeowner',
        image: 'https://i.pravatar.cc/150?img=47',
        rating: 5,
        text: 'Transparent pricing, quality materials, and on-time delivery. The entire experience was hassle-free. Thank you JagritiBricks for making our construction journey smooth!'
    }
]

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlay, setIsAutoPlay] = useState(true)
    const autoPlayRef = useRef(null)

    // Auto-slide functionality
    useEffect(() => {
        if (isAutoPlay) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % testimonials.length)
            }, 5000) // Change slide every 5 seconds
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current)
            }
        }
    }, [isAutoPlay])

    const goToSlide = (index) => {
        setCurrentIndex(index)
        // Pause auto-play temporarily when user manually navigates
        setIsAutoPlay(false)
        setTimeout(() => setIsAutoPlay(true), 10000) // Resume after 10 seconds
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        setIsAutoPlay(false)
        setTimeout(() => setIsAutoPlay(true), 10000)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
        setIsAutoPlay(false)
        setTimeout(() => setIsAutoPlay(true), 10000)
    }

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                        What Our <span className="text-brand-red">Clients Say</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Don't just take our word for it — hear from our satisfied customers who built their dreams with JagritiBricks
                    </p>
                </div>

                {/* Testimonials Carousel */}
                <div className="relative max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                    {/* Testimonial Cards Container */}
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="w-full flex-shrink-0 px-8 py-12 md:px-16 md:py-16"
                                >
                                    {/* Quote Icon */}
                                    <div className="flex justify-center mb-6">
                                        <svg className="w-12 h-12 text-brand-red/20" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                        </svg>
                                    </div>

                                    {/* Stars */}
                                    <div className="flex justify-center gap-1 mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-lg md:text-xl text-gray-700 text-center leading-relaxed mb-8 font-medium italic">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Client Info */}
                                    <div className="flex items-center justify-center gap-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-16 h-16 rounded-full object-cover border-4 border-brand-red/10"
                                        />
                                        <div className="text-left">
                                            <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                                            <p className="text-xs text-gray-500">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white hover:bg-brand-red text-gray-700 hover:text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
                        aria-label="Previous testimonial"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white hover:bg-brand-red text-gray-700 hover:text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
                        aria-label="Next testimonial"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dot Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 rounded-full ${index === currentIndex
                                        ? 'w-10 h-3 bg-brand-red'
                                        : 'w-3 h-3 bg-gray-300 hover:bg-brand-red/50'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Auto-play indicator */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setIsAutoPlay(!isAutoPlay)}
                            className="text-sm text-gray-500 hover:text-brand-red transition-colors flex items-center gap-2"
                        >
                            {isAutoPlay ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Auto-playing
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Paused
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
