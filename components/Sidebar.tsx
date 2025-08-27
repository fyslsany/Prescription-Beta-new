
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UsersIcon, CogIcon, Bars3Icon, XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline/index.js';
import { useLocalization } from '../hooks/useLocalization';

const Sidebar: React.FC = () => {
    const { t } = useLocalization();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { to: "/", icon: HomeIcon, label: t('dashboard') },
        { to: "/patients", icon: UsersIcon, label: t('patients') },
        { to: "/settings", icon: CogIcon, label: t('settings') },
    ];

    const linkClasses = "flex items-center px-4 py-2.5 text-gray-500 hover:bg-primary-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200";
    const activeLinkClasses = "bg-primary-500 text-white dark:bg-primary-600 dark:text-white";

    const renderNavLinks = () => navLinks.map(link => (
        <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
            onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
        >
            <link.icon className="h-6 w-6 mr-3" />
            <span className="font-medium">{link.label}</span>
        </NavLink>
    ));

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="no-print lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
            
            {/* Sidebar for Desktop */}
            <aside className="no-print hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center mb-8">
                    <DocumentTextIcon className="h-8 w-8 text-primary-600 dark:text-primary-500" />
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white ml-2">MediFlow</h1>
                </div>
                <nav className="flex-1 space-y-2">
                    {renderNavLinks()}
                </nav>
            </aside>

            {/* Sidebar for Mobile */}
            <div className={`no-print fixed inset-0 z-40 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
                <aside className="relative flex flex-col w-64 bg-white dark:bg-gray-800 h-full p-4">
                     <div className="flex items-center mb-8">
                        <DocumentTextIcon className="h-8 w-8 text-primary-600 dark:text-primary-500" />
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white ml-2">MediFlow</h1>
                    </div>
                    <nav className="flex-1 space-y-2">
                        {renderNavLinks()}
                    </nav>
                </aside>
            </div>
        </>
    );
};

export default Sidebar;