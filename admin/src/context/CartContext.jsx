import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
    const { user } = useAuth()
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage on init
        const savedCart = localStorage.getItem('jagritibuild_cart')
        return savedCart ? JSON.parse(savedCart) : []
    })

    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [pendingItem, setPendingItem] = useState(null)

    const openCart = () => setIsCartOpen(true)
    const closeCart = () => setIsCartOpen(false)

    const openLoginModal = () => setIsLoginModalOpen(true)
    const closeLoginModal = () => setIsLoginModalOpen(false)

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('jagritibuild_cart', JSON.stringify(cart))
    }, [cart])

    // Handle pending item after login
    useEffect(() => {
        if (user && pendingItem) {
            addToCart(pendingItem.product, pendingItem.quantity)
            setPendingItem(null)
            // Optional: Show a toast notification here
        }
    }, [user, pendingItem])

    const addToCart = (product, quantity = 1) => {
        if (!user) {
            setPendingItem({ product, quantity })
            setIsLoginModalOpen(true)
            return
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id)
            let newCart

            if (existingItem) {
                newCart = prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                newCart = [...prevCart, { ...product, quantity }]
            }
            return newCart
        })
        setIsCartOpen(true)
    }

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId))
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setCart([])
    }

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0)
    }

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        openCart,
        closeCart,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}
