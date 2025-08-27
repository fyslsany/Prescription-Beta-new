
import React from 'react';
import { SunIcon, MoonIcon, LanguageIcon } from '@heroicons/react/24/outline/index.js';
import { useAppContext } from '../context/AppContext';
import { useLocalization } from '../hooks/useLocalization';

const Header: React.FC = () => {
    const { theme, setTheme, language, setLanguage } = useAppContext();
    const { t } = useLocalization();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    
    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'bn' : 'en');
    };

    return (
        <header className="no-print bg-white dark:bg-gray-800 shadow-sm dark:border-b dark:border-gray-700 p-4 flex justify-between items-center">
            <h1 className={`text-xl font-semibold ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>{t('welcomeDr')}</h1>
            
            <div className="flex items-center space-x-4">
                <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <LanguageIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    {theme === 'light' ? <MoonIcon className="h-6 w-6 text-gray-600" /> : <SunIcon className="h-6 w-6 text-gray-300" />}
                </button>

                <div className="flex items-center space-x-2">
                    <img className="h-10 w-10 rounded-full object-cover" src="https://picsum.photos/100/100?random=10" alt="Doctor profile" />
                    <div>
                        <p className="font-semibold text-sm">Dr. A. K. Azad</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Cardiologist</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;