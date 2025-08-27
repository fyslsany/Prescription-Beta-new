
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/mockApi';
import { Patient, Visit } from '../types';
import { PlusIcon, PencilIcon, PrinterIcon } from '@heroicons/react/24/outline/index.js';
import { useLocalization } from '../hooks/useLocalization';
import { useAppContext } from '../context/AppContext';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLocalization();
  const { language } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      const patientData = await api.getPatientById(id);
      const visitsData = await api.getVisitsByPatientId(id);
      setPatient(patientData || null);
      setVisits(visitsData);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8">Loading patient details...</div>;
  }

  if (!patient) {
    return <div className="text-center p-8 text-red-500">Patient not found.</div>;
  }

  const handlePrint = (visitId: string) => {
    window.open(`/#/print/prescription/${patient.id}/${visitId}`, '_blank');
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start">
          <img src={patient.photoUrl} alt="Patient" className="w-32 h-32 rounded-full object-cover mr-6 mb-4 md:mb-0" />
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-1 ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>{language === 'bn' ? patient.nameBn : patient.nameEn}</h1>
            <p className="text-gray-500 dark:text-gray-400">Patient ID: {patient.patientId}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 mt-4 text-sm">
              <p><strong>{t('age')}:</strong> {patient.age}</p>
              <p><strong>{t('gender')}:</strong> {patient.gender}</p>
              <p><strong>{t('phone')}:</strong> {patient.phone}</p>
              <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
              <p><strong>Weight:</strong> {patient.weight} kg</p>
              <p><strong>Height:</strong> {patient.height} cm</p>
              <p className="col-span-2"><strong>Allergies:</strong> {patient.allergies.join(', ') || 'None'}</p>
            </div>
          </div>
          <button onClick={() => navigate(`/prescription/new/${patient.id}`)} className="mt-4 md:mt-0 bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-700 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            <span className={`${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>{t('newPrescription')}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className={`text-2xl font-semibold mb-4 ${language === 'bn' ? 'font-bengali' : 'font-sans'}`}>{t('visits')}</h2>
        <div className="space-y-4">
          {visits.map(visit => (
            <div key={visit.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{new Date(visit.visitDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Diagnosis: <span className="font-medium text-gray-700 dark:text-gray-300">{visit.diagnosis}</span></p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => navigate(`/prescription/edit/${patient.id}/${visit.id}`)} className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="Edit Prescription"><PencilIcon className="h-5 w-5" /></button>
                  <button onClick={() => handlePrint(visit.id)} className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors" title="Print Prescription"><PrinterIcon className="h-5 w-5" /></button>
                </div>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold text-sm">Medicines:</h4>
                <ul className="list-disc list-inside pl-4 text-sm">
                  {visit.medicines.map(med => <li key={med.id}>{med.medicine.brandName} - {med.dose} ({med.duration})</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;