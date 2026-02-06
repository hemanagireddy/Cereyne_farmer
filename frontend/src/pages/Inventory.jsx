import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    X,
    Save,
    Filter,
    Package,
    Calendar,
    Layers,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const Inventory = () => {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingCrop, setEditingCrop] = useState(null);
    const [formData, setFormData] = useState({
        yieldName: '',
        category: 'Vegetables',
        quantity: '',
        unit: 'kg',
        plantedDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'growing'
    });

    const categories = ['Grains', 'Vegetables', 'Fruits', 'Legumes', 'Others'];
    const units = ['kg', 'tons', 'quintals', 'units'];
    const statuses = ['growing', 'harvested', 'sold'];

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            const response = await api.get('/inventory');
            setCrops(response.data.data.crops);
        } catch (err) {
            console.error('Error fetching crops', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCrop) {
                await api.patch(`/inventory/${editingCrop._id}`, formData);
            } else {
                await api.post('/inventory', formData);
            }
            setIsModalOpen(false);
            setEditingCrop(null);
            resetForm();
            fetchCrops();
        } catch (err) {
            alert('Error saving crop. Please check permissions and input.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this crop record?')) {
            try {
                await api.delete(`/inventory/${id}`);
                fetchCrops();
            } catch (err) {
                alert('Error deleting crop.');
            }
        }
    };

    const handleEdit = (crop) => {
        setEditingCrop(crop);
        setFormData({
            yieldName: crop.yieldName,
            category: crop.category,
            quantity: crop.quantity,
            unit: crop.unit,
            plantedDate: format(new Date(crop.plantedDate), 'yyyy-MM-dd'),
            status: crop.status
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            yieldName: '',
            category: 'Vegetables',
            quantity: '',
            unit: 'kg',
            plantedDate: format(new Date(), 'yyyy-MM-dd'),
            status: 'growing'
        });
    };

    const filteredCrops = crops.filter(crop =>
        crop.yieldName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Crop Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage and track your agricultural records</p>
                </div>
                <button
                    onClick={() => { resetForm(); setEditingCrop(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-600/20 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add New Crop</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search crop name..."
                        className="w-full pl-11 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-all">
                        <Filter className="h-4 w-4" />
                        <span className="text-sm font-medium">Filter</span>
                    </button>
                </div>
            </div>

            {/* Crops Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white h-48 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCrops.map((crop) => (
                            <motion.div
                                key={crop._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${crop.status === 'harvested' ? 'bg-primary-100 text-primary-600' : 'bg-amber-100 text-amber-600'}`}>
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(crop)}
                                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                        >
                                            <Edit3 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(crop._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-1">{crop.yieldName}</h3>
                                <p className="text-sm text-gray-500 mb-4">{crop.category}</p>

                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Layers className="h-4 w-4 mr-2 opacity-40" />
                                        <span className="font-semibold">{crop.quantity} {crop.unit}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 opacity-40" />
                                        <span>Planted: {format(new Date(crop.plantedDate), 'MMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Activity className="h-4 w-4 mr-2 opacity-40" />
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${crop.status === 'growing' ? 'bg-amber-100 text-amber-800' :
                                                crop.status === 'harvested' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {crop.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 overflow-hidden"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                {editingCrop ? 'Edit Crop Details' : 'Add New Crop'}
                            </h2>
                            <p className="text-gray-500 mb-8">Comprehensive yield tracking for your farm.</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Crop/Yield Name</label>
                                    <input
                                        name="yieldName"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        placeholder="e.g. Organic Russet Potatoes"
                                        value={formData.yieldName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select
                                            name="category"
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                        <select
                                            name="status"
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                                        <input
                                            name="quantity"
                                            type="number"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            placeholder="0.00"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                                        <select
                                            name="unit"
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                            value={formData.unit}
                                            onChange={handleInputChange}
                                        >
                                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Planted Date</label>
                                    <input
                                        name="plantedDate"
                                        type="date"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        value={formData.plantedDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center space-x-2"
                                    >
                                        <Save className="h-5 w-5" />
                                        <span>{editingCrop ? 'Update Record' : 'Save Crop Record'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;
