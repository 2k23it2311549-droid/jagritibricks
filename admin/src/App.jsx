import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { HelmetProvider } from 'react-helmet-async'
import { SiteSettingsProvider } from './context/SiteSettingsContext'

// Admin Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProductManagement from './pages/ProductManagement'
import OrderManagement from './pages/OrderManagement'
import CreateOrder from './pages/CreateOrder'
import CustomerManagement from './pages/CustomerManagement'
import SiteContent from './pages/SiteContent'
import Settings from './pages/Settings'
import DoraEffects from './components/DoraEffects'

// Admin Layout Component (ensure this exists or create it, previously it was likely used in pages or separate)
// If MainLayout was used, we might need an AdminLayout.
// Checking previous file list, there was 'src/components/admin/AdminLayout.jsx'.
// Since we copied everything, it should be in 'src/components/admin/AdminLayout.jsx'.
import AdminLayout from './components/AdminLayout'

function App() {
    return (
        <HelmetProvider>
            <AuthProvider>
                <SiteSettingsProvider>
                    <Router>
                        <DoraEffects />
                        <Routes>
                            {/* Public Admin Route */}
                            <Route path="/login" element={<Login />} />

                            {/* Protected Admin Routes */}
                            {/* We should wrap these in AdminLayout if possible, or they might already have it included */}
                            {/* The previous App.jsx didn't wrap them in a layout route, so they likely include the layout themselves or it's raw. */}
                            {/* However, standard practice is to wrap. Let's stick to previous behavior but adjust paths. */}

                            <Route path="/" element={<Navigate to="/dashboard" replace />} />

                            <Route path="/dashboard" element={
                                <AdminLayout title="Dashboard">
                                    <Dashboard />
                                </AdminLayout>
                            } />

                            <Route path="/products" element={
                                <AdminLayout title="Product Management">
                                    <ProductManagement />
                                </AdminLayout>
                            } />

                            <Route path="/orders" element={
                                <AdminLayout title="Order Management">
                                    <OrderManagement />
                                </AdminLayout>
                            } />

                            <Route path="/orders/create" element={
                                <AdminLayout title="Create Order">
                                    <CreateOrder />
                                </AdminLayout>
                            } />

                            <Route path="/customers" element={
                                <AdminLayout title="Customer Management">
                                    <CustomerManagement />
                                </AdminLayout>
                            } />

                            <Route path="/site-editor" element={
                                <AdminLayout title="Site Content Editor">
                                    <SiteContent />
                                </AdminLayout>
                            } />

                            <Route path="/settings" element={
                                <AdminLayout title="Settings">
                                    <Settings />
                                </AdminLayout>
                            } />

                            {/* Catch all */}
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </Router>
                </SiteSettingsProvider>
            </AuthProvider>
        </HelmetProvider>
    )
}

export default App
