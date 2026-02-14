import { useEffect, useState } from 'react'

export default function PageLoader() {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-300">
            <div className="relative flex flex-col items-center">
                <img
                    src="/img/logo.png"
                    alt="JagritiBricks"
                    className="w-40 h-40 md:w-56 md:h-56 object-contain animate-pulse drop-shadow-xl"
                />
                <div className="mt-4 text-2xl font-serif font-bold text-gray-900 tracking-wide animate-fade-in-up">
                    Jagriti<span className="text-brand-red">Bricks</span>
                </div>
                {/* Optional loading bar */}
                <div className="mt-6 w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red animate-[loading_1.5s_ease-in-out_infinite]"></div>
                </div>
            </div>

            <style>{`
                @keyframes loading {
                    0% { width: 0%; margin-left: 0; }
                    50% { width: 100%; margin-left: 0; }
                    100% { width: 0%; margin-left: 100%; }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
