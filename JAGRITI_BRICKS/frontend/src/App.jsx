import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import { HelmetProvider } from 'react-helmet-async'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'
import { SiteSettingsProvider } from './context/SiteSettingsContext'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Orders from './pages/Orders'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Shipping from './pages/Shipping'
import Returns from './pages/Returns'

import FAQ from './pages/FAQ'
import MaintenancePage from './pages/MaintenancePage'
import { useSiteSettings } from './context/SiteSettingsContext'

// Components
import MainLayout from './components/MainLayout'
import DoraEffects from './components/DoraEffects'
import WelcomePopup from './components/WelcomePopup'

function MaintenanceCheck({ children }) {
    const { settings } = useSiteSettings()

    if (settings.loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>
    }

    if (settings.maintenance_mode) {
        return <MaintenancePage />
    }

    return children
}

function App() {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        })
    }, [])

    return (
        <HelmetProvider>
            <AuthProvider>
                <CartProvider>
                    <SiteSettingsProvider>
                        <Router>
                            <WelcomePopup />
                            <DoraEffects />
                            <ScrollToTop />

                            <MaintenanceCheck>
                                <Routes>
                                    {/* Fullscreen Auth Routes (no Navbar/Footer) */}
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<Signup />} />

                                    {/* Public Customer Routes with MainLayout */}
                                    <Route element={<MainLayout />}>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/products" element={<Products />} />
                                        <Route path="/products/:id" element={<ProductDetails />} />
                                        <Route path="/cart" element={<CartPage />} />
                                        <Route path="/checkout" element={<Checkout />} />
                                        <Route path="/about" element={<About />} />
                                        <Route path="/contact" element={<Contact />} />
                                        <Route path="/orders" element={<Orders />} />
                                        <Route path="/privacy" element={<Privacy />} />
                                        <Route path="/terms" element={<Terms />} />
                                        <Route path="/shipping" element={<Shipping />} />
                                        <Route path="/returns" element={<Returns />} />
                                        <Route path="/faq" element={<FAQ />} />
                                    </Route>
                                </Routes>
                            </MaintenanceCheck>
                        </Router>
                    </SiteSettingsProvider>
                </CartProvider>
            </AuthProvider>
        </HelmetProvider>
    )
}

export default App
