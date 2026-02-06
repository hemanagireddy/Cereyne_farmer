import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Sprout,
    Weight,
    TrendingUp,
    Calendar,
    AlertCircle,
    Clock,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const Dashboard = () => {
    const [data, setData] = useState({ crops: [], summary: { totalCrops: 0, totalQuantity: 0 } });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/inventory');
                setData({
                    crops: response.data.data.crops,
                    summary: response.data.summary
                });
            } catch (err) {
                console.error('Error fetching dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-primary-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Crops',
            value: data.summary.totalCrops,
            icon: Sprout,
            color: 'bg-emerald-500',
            description: 'Active yields in tracking'
        },
        {
            label: 'Total Quantity',
            value: `${data.summary.totalQuantity.toLocaleString()} kg`,
            icon: Weight,
            color: 'bg-blue-500',
            description: 'Cumulative weight (kg) of all crops'
        },
        {
            label: 'Growth Rate',
            value: '+12.5%',
            icon: TrendingUp,
            color: 'bg-amber-500',
            description: 'Increase from last month'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-10">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-extrabold text-gray-900 tracking-tight"
                >
                    Welcome back, <span className="text-primary-600">{user.fullName.split(' ')[0]}</span> 👋
                </motion.h1>
                <p className="mt-2 text-lg text-gray-500">Here's what's happening at {user.farmName} today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform ${stat.color}`}></div>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500 flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
                            {stat.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Crops Table */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Recent Crops</h2>
                        <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center">
                            View all <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
                                    <th className="px-6 py-4">Crop Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Qty</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Planted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.crops.slice(0, 5).map((crop) => (
                                    <tr key={crop._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{crop.yieldName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                                                {crop.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{crop.quantity} {crop.unit}</td>
                                        <td className="px-6 py-4">
                                            {crop.status === 'growing' && (
                                                <span className="inline-flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                                                    <Clock className="h-3 w-3 mr-1" /> Growing
                                                </span>
                                            )}
                                            {crop.status === 'harvested' && (
                                                <span className="inline-flex items-center text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Harvested
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {format(new Date(crop.plantedDate), 'MMM d, yyyy')}
                                        </td>
                                    </tr>
                                ))}
                                {data.crops.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                            No crops found. Start by adding your first yield!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reminders / Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary-600 to-green-700 p-6 rounded-3xl text-white shadow-xl shadow-primary-600/20">
                        <h3 className="text-xl font-bold mb-2">Smart Insight</h3>
                        <p className="text-primary-50 text-sm opacity-90 mb-6">
                            Your organic wheat yield is 15% higher than the regional average this season. Keep it up!
                        </p>
                        <button className="w-full py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors">
                            Read Report
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                            Notifications
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Rain Forecast', desc: 'Heavy rain expected this Sunday.', icon: Calendar },
                                { title: 'Market Price Pick', desc: 'Vegetable prices are up by 5%.', icon: TrendingUp }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <item.icon className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
