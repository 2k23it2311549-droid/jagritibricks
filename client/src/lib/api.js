import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
        // Backend expects Basic auth for now, or we can update backend to use Bearer
        // For the simple backend implementation we did, it uses Basic auth encoded from username:password
        // Let's adjust this to match the backend's adminAuth middleware which expects "Basic base64Object"
        // Actually, the login endpoint returns a token. Let's see how the backend validates it.
        // The backend middleware 'adminAuth' expects: "Basic " + base64(username:password)
        // The login endpoint returns: token = base64(username:password)

        // So we should set Authorization: Basic <token>
        config.headers.Authorization = `Basic ${adminToken}`
    }
    return config
})

export default api
