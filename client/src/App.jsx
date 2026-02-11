import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
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
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ProductManagement from './pages/admin/ProductManagement'
import OrderManagement from './pages/admin/OrderManagement'
import CreateOrder from './pages/admin/CreateOrder'
import CustomerManagement from './pages/admin/CustomerManagement'
import Settings from './pages/admin/Settings'

// Components
import MainLayout from './components/MainLayout'

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
                            <ScrollToTop />
                            <Routes>
                                {/* Public Customer Routes with MainLayout */}
                                <Route element={<MainLayout />}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/products/:id" element={<ProductDetails />} />
                                    <Route path="/cart" element={<CartPage />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<Signup />} />
                                    <Route path="/orders" element={<Orders />} />
                                    <Route path="/privacy" element={<Privacy />} />
                                    <Route path="/terms" element={<Terms />} />
                                    <Route path="/shipping" element={<Shipping />} />
                                    <Route path="/returns" element={<Returns />} />
                                    <Route path="/faq" element={<FAQ />} />
                                </Route>

                                {/* Admin Routes - Standalone */}
                                <Route path="/admin/login" element={<AdminLogin />} />
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                <Route path="/admin/products" element={<ProductManagement />} />
                                <Route path="/admin/orders" element={<OrderManagement />} />
                                <Route path="/admin/orders/create" element={<CreateOrder />} />
                                <Route path="/admin/customers" element={<CustomerManagement />} />
                                <Route path="/admin/settings" element={<Settings />} />
                            </Routes>
                        </Router>
                    </SiteSettingsProvider>
                </CartProvider>
            </AuthProvider>
        </HelmetProvider>
    )
}

export default App
