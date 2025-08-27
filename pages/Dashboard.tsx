
import React from 'react';
import { ChartBarIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline/index.js';
import { useLocalization } from '../hooks/useLocalization';
import { MOCK_PATIENTS } from '../constants';
import { useAppContext } from '../context/AppContext';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    // FIX: Property 'i18n' does not exist on type returned by useLocalization. Use useAppContext to get language directly.
    const { t } = useLocalization();
    const { language } = useAppContext();

    return (
        <div>
            <h1 className={`text-3xl font-bold text-gray-800 dark:text-white mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('dashboard')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    icon={<UserGroupIcon className="h-6 w-6 text-white" />}
                    title={t('totalPatients')}
                    value={MOCK_PATIENTS.length.toString()}
                    color="bg-blue-500"
                />
                 <StatCard 
                    icon={<ChartBarIcon className="h-6 w-6 text-white" />}
                    title={t('todayAppointments')}
                    value="12"
                    color="bg-green-500"
                />
                 <StatCard 
                    icon={<CurrencyDollarIcon className="h-6 w-6 text-white" />}
                    title={t('monthlyRevenue')}
                    value="$15,230"
                    color="bg-indigo-500"
                />
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex space-x-4">
                     <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        New Patient
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Search Patient
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        View Today's Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;