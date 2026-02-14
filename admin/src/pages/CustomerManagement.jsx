import { useState, useEffect } from 'react'

import { supabase } from '../lib/supabaseClient'
import Toast from '../components/Toast'

export default function CustomerManagement() {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [resetModalOpen, setResetModalOpen] = useState(false)
    const [selectedUserForReset, setSelectedUserForReset] = useState(null)
    const [newPassword, setNewPassword] = useState('')
    const [resetLoading, setResetLoading] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            // Fetch users from public.users table
            const { data: users, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'user')
                .order('reset_requested', { ascending: false })
                .order('created_at', { ascending: false })

            if (error) throw error

            // For each user, fetch their order count
            const customersWithStats = await Promise.all(users.map(async (user) => {
                const { count, error: countError } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)

                return {
                    ...user,
                    orderCount: count || 0
                }
            }))

            setCustomers(customersWithStats)
        } catch (error) {
            console.error('Error fetching customers:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredCustomers = customers.filter(customer =>
        (customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    )

    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (newPassword.length < 4) {
            setToast({ message: 'Password must be at least 4 characters', type: 'error' })
            return
        }
        setResetLoading(true)
        try {
            const { error } = await supabase.rpc('admin_reset_password', {
                target_user_id: selectedUserForReset.id,
                new_password: newPassword
            })

            if (error) throw error

            setToast({ message: 'Password updated successfully', type: 'success' })
            setResetModalOpen(false)
            setNewPassword('')
        } catch (error) {
            console.error('Error resetting password:', error)
            setToast({ message: error.message || 'Failed to reset password', type: 'error' })
        } finally {
            setResetLoading(false)
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="dora-fade-in">
            {/* Action Bar */}
            <div className="mb-6">
                <div className="max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        className="w-full px-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red font-bold">
                                            {customer.name ? customer.name[0].toUpperCase() : 'U'}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {customer.name || 'Unknown Name'}
                                                {customer.reset_requested && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                        Reset Requested
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">{customer.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{customer.email}</div>
                                    <div className="text-sm text-gray-500">{customer.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {customer.orderCount} Orders
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(customer.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900">View History</button>
                                    <button
                                        onClick={() => {
                                            setSelectedUserForReset(customer)
                                            setResetModalOpen(true)
                                        }}
                                        className="text-orange-600 hover:text-orange-900 ml-4 font-medium"
                                    >
                                        Reset Password
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No customers found matching your search.
                    </div>
                )}
            </div>
            {/* Reset Password Modal */}
            {resetModalOpen && selectedUserForReset && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                            <button onClick={() => setResetModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-2">Reset password for: <span className="font-semibold text-gray-900">{selectedUserForReset.name || selectedUserForReset.email}</span></p>
                            <p className="text-sm text-gray-500">Enter a new temporary password for the user.</p>
                        </div>

                        <form onSubmit={handleResetPassword}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setResetModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetLoading || !newPassword}
                                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                                >
                                    {resetLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    )
}
