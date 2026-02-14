import { useState, useEffect } from 'react'

import { supabase } from '../lib/supabaseClient'

export default function SiteContent() {
    const [content, setContent] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('hero')

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('*')
                .order('key')

            if (error) throw error
            setContent(data || [])
        } catch (error) {
            console.error('Error fetching content:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = (id, value) => {
        setContent(prev => prev.map(item =>
            item.id === id ? { ...item, value } : item
        ))
    }

    const saveChanges = async () => {
        setSaving(true)
        try {
            const updates = content.map(item =>
                supabase
                    .from('site_content')
                    .update({ value: item.value, updated_at: new Date() })
                    .eq('id', item.id)
            )

            await Promise.all(updates)
            alert('Site content updated successfully! 🚀')
        } catch (error) {
            console.error('Error saving content:', error)
            alert('Failed to save changes.')
        } finally {
            setSaving(false)
        }
    }

    // Group content by section
    const sections = ['hero', 'announcement', 'contact']
    const filteredContent = content.filter(item => item.section === activeTab)

    if (loading) return (
        <div className="dora-fade-in">
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
            </div>
        </div>
    )

    return (
        <div className="dora-fade-in">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Visual Sidebar for Sections */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="clay-card p-4 space-y-2 sticky top-8">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Sections</h3>
                        {sections.map(section => (
                            <button
                                key={section}
                                onClick={() => setActiveTab(section)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium capitalize ${activeTab === section
                                    ? 'bg-gradient-vibrant text-white shadow-lg'
                                    : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {section}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 space-y-6">
                    <div className="clay-card p-8 dora-reveal">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab} Section</h2>
                                <p className="text-gray-500">Customize the look and feel of your {activeTab} area.</p>
                            </div>
                            <button
                                onClick={saveChanges}
                                disabled={saving}
                                className={`btn-clay px-8 py-3 font-bold flex items-center gap-2 ${saving ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {saving ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>💾 Save Changes</>
                                )}
                            </button>
                        </div>

                        <div className="space-y-6">
                            {filteredContent.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    No editable content found for this section.
                                    <br />
                                    <span className="text-xs">(Add rows to 'site_content' table with section='{activeTab}')</span>
                                </div>
                            ) : (
                                filteredContent.map((item) => (
                                    <div key={item.id} className="group">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 capitalize">
                                            {item.key.replace(/_/g, ' ')}
                                        </label>

                                        {item.type === 'textarea' ? (
                                            <textarea
                                                value={item.value || ''}
                                                onChange={(e) => handleUpdate(item.id, e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none bg-gray-50 focus:bg-white resize-none"
                                            />
                                        ) : item.type === 'image' ? (
                                            <div className="space-y-3">
                                                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group-hover:border-brand-orange/50 transition-colors">
                                                    <img
                                                        src={item.value}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => e.target.src = 'https://placehold.co/600x400?text=Invalid+Image+URL'}
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium backdrop-blur-sm">
                                                        Preview
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={item.value || ''}
                                                    onChange={(e) => handleUpdate(item.id, e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none bg-gray-50 focus:bg-white text-sm font-mono text-gray-600"
                                                    placeholder="Enter Image URL..."
                                                />
                                            </div>
                                        ) : item.type === 'datetime' ? (
                                            <input
                                                type="datetime-local"
                                                value={item.value || ''}
                                                onChange={(e) => handleUpdate(item.id, e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none bg-gray-50 focus:bg-white font-medium"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={item.value || ''}
                                                onChange={(e) => handleUpdate(item.id, e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all outline-none bg-gray-50 focus:bg-white font-medium"
                                            />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
