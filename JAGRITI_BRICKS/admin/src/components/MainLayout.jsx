import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import CartDrawer from './CartDrawer'
import LoginModal from './LoginModal'
import AnnouncementBar from './AnnouncementBar'
import { useCart } from '../context/CartContext'

export default function MainLayout() {
    const { isLoginModalOpen, closeLoginModal } = useCart()

    return (
        <div className="flex flex-col min-h-screen">
            <AnnouncementBar />
            <Navbar />
            <CartDrawer />
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    )
}
