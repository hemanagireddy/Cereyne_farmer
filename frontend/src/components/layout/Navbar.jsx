import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Leaf, LogOut, LayoutDashboard, Database, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                            <Leaf className="h-6 w-6 text-primary-600" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-green-500 bg-clip-text text-transparent">
                            Cerevyn Farmer
                        </span>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link
                            to="/dashboard"
                            className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                        <Link
                            to="/inventory"
                            className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            <Database className="h-4 w-4" />
                            <span className="text-sm font-medium">Inventory</span>
                        </Link>

                        <div className="h-6 w-px bg-gray-200"></div>

                        <div className="flex items-center space-x-3">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-900">{user.fullName}</span>
                                <span className="text-xs text-gray-500">{user.farmName}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
