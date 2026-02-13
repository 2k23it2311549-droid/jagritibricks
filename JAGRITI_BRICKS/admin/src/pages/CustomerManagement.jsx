import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import api from '../lib/api'

export default function CustomerManagement() {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            const { data } = await api.get('/admin/users?role=customer')

            // Map keys to match previous structure if needed, but backend now returns orders_count
            const customersData = data.users.map(user => ({
                ...user,
                orderCount: user.orders_count || 0
            }))

            setCustomers(customersData)
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

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <AdminLayout title="Customer Management">
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
                                            <div className="text-sm font-medium text-gray-900">{customer.name || 'Unknown Name'}</div>
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
        </AdminLayout>
    )
}
