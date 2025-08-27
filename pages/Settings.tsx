import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { MOCK_DOCTOR } from '../constants';
import { useAppContext } from '../context/AppContext';

const Settings: React.FC = () => {
    // FIX: Property 'i18n' does not exist on type returned by useLocalization. Use useAppContext to get language directly.
    const { t } = useLocalization();
    const { language } = useAppContext();

    return (
        <div>
            <h1 className={`text-3xl font-bold text-gray-800 dark:text-white mb-6 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('settings')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Doctor Profile Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Doctor Profile</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input type="text" defaultValue={MOCK_DOCTOR.name} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Specialization</label>
                            <input type="text" defaultValue={MOCK_DOCTOR.specialization} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">BMDC Reg No.</label>
                            <input type="text" defaultValue={MOCK_DOCTOR.bmdcRegNo} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Digital Signature</label>
                            <input type="file" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
                        </div>
                        <div className="pt-2">
                             <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save Profile</button>
                        </div>
                    </form>
                </div>

                {/* Prescription Pad Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Prescription Pad Layout</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Page Size</label>
                            <select className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700">
                                <option>A4</option>
                                <option>A5</option>
                                <option>Letter</option>
                            </select>
                        </div>
                        <div>
                            <h3 className="text-md font-medium">Margins (in mm)</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-xs">Top</label>
                                    <input type="number" defaultValue="20" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-xs">Bottom</label>
                                    <input type="number" defaultValue="20" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                                </div>
                                 <div>
                                    <label className="block text-xs">Left</label>
                                    <input type="number" defaultValue="20" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                                </div>
                                 <div>
                                    <label className="block text-xs">Right</label>
                                    <input type="number" defaultValue="20" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-2">
                             <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save Layout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;