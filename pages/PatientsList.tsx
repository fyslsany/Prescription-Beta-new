
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline/index.js';
import { api } from '../services/mockApi';
import { Patient } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { useAppContext } from '../context/AppContext';

const PatientsList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLocalization();
  const { language } = useAppContext();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    const data = await api.getPatients(searchTerm);
    setPatients(data);
    setLoading(false);
  }, [searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchPatients();
    }, 500); // Debounce search
    return () => clearTimeout(handler);
  }, [searchTerm, fetchPatients]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>{t('patientList')}</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700 transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          <span className={`${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>{t('newPatient')}</span>
        </button>
      </div>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder={t('searchPatients')}
          className={`w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        {loading ? (
            <div className="text-center p-8">Loading patients...</div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['ID', t('name'), t('age'), t('gender'), t('phone'), t('actions')].map(header => (
                 <th key={header} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{patient.patientId}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>{language === 'bn' ? patient.nameBn : patient.nameEn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(`/patient/${patient.id}`)} className="text-primary-600 hover:text-primary-800" title={t('view')}><EyeIcon className="h-5 w-5"/></button>
                    <button className="text-yellow-600 hover:text-yellow-800" title={t('edit')}><PencilIcon className="h-5 w-5"/></button>
                    <button className="text-red-600 hover:text-red-800" title={t('delete')}><TrashIcon className="h-5 w-5"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default PatientsList;