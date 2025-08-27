
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline/index.js';
import { api } from '../services/mockApi';
import { Patient, Visit, Medicine, LabTest, PrescribedMedicine, OrderedLabTest } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { useAppContext } from '../context/AppContext';

const PrescriptionEditor: React.FC = () => {
    const { patientId, visitId } = useParams<{ patientId: string; visitId?: string }>();
    const navigate = useNavigate();
    const { t } = useLocalization();
    const { language } = useAppContext();
    
    const [patient, setPatient] = useState<Patient | null>(null);
    const [visit, setVisit] = useState<Partial<Visit>>({
        clinicalNotes: '',
        diagnosis: '',
        medicines: [],
        labTests: [],
        advice: '',
        followUpDate: '',
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // State for medicine/test search
    const [medSearchTerm, setMedSearchTerm] = useState('');
    const [medSearchResults, setMedSearchResults] = useState<Medicine[]>([]);
    const [testSearchTerm, setTestSearchTerm] = useState('');
    const [testSearchResults, setTestSearchResults] = useState<LabTest[]>([]);

    const fetchInitialData = useCallback(async () => {
        if (!patientId) return;
        setLoading(true);
        const patientData = await api.getPatientById(patientId);
        setPatient(patientData || null);

        if (visitId) { // Editing existing visit
            const visitData = await api.getVisitById(patientId, visitId);
            if (visitData) {
                // Mark all existing medicines as not new
                const updatedMedicines = visitData.medicines.map(m => ({ ...m, isNew: false }));
                setVisit({ ...visitData, medicines: updatedMedicines });
            }
        } else { // New visit
             setVisit({
                patientId,
                doctorId: 'doc1',
                visitDate: new Date().toISOString(),
                clinicalNotes: '',
                diagnosis: '',
                medicines: [],
                labTests: [],
                advice: '',
                followUpDate: '',
                prescriptionVersion: 1
            });
        }
        setLoading(false);
    }, [patientId, visitId]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);
    
    // Handlers for searching medicines and tests
    useEffect(() => {
        if (medSearchTerm.length > 1) {
            const handler = setTimeout(async () => {
                const results = await api.getMedicines(medSearchTerm);
                setMedSearchResults(results);
            }, 300);
            return () => clearTimeout(handler);
        } else {
            setMedSearchResults([]);
        }
    }, [medSearchTerm]);

    useEffect(() => {
        if (testSearchTerm.length > 1) {
            const handler = setTimeout(async () => {
                const results = await api.getLabTests(testSearchTerm);
                setTestSearchResults(results);
            }, 300);
            return () => clearTimeout(handler);
        } else {
            setTestSearchResults([]);
        }
    }, [testSearchTerm]);
    

    const handleVisitChange = (field: keyof Visit, value: any) => {
        setVisit(prev => ({ ...prev, [field]: value }));
    };

    const handleMedicineChange = (index: number, field: keyof PrescribedMedicine, value: any) => {
        const newMedicines = [...(visit.medicines || [])];
        (newMedicines[index] as any)[field] = value;
        handleVisitChange('medicines', newMedicines);
    };

    const addMedicine = (medicine: Medicine) => {
        const newMed: PrescribedMedicine = {
            id: `pm-${Date.now()}`,
            medicine,
            dose: '1',
            frequency: '1+0+1',
            duration: '7 days',
            route: 'Oral',
            sig: '',
            isNew: true, // Mark as new when added
        };
        handleVisitChange('medicines', [...(visit.medicines || []), newMed]);
        setMedSearchTerm('');
        setMedSearchResults([]);
    };

    const removeMedicine = (index: number) => {
        const newMedicines = [...(visit.medicines || [])];
        newMedicines.splice(index, 1);
        handleVisitChange('medicines', newMedicines);
    };

    const addTest = (test: LabTest) => {
        const newTest: OrderedLabTest = {
            id: `olt-${Date.now()}`,
            test,
            instructions: '',
        };
        handleVisitChange('labTests', [...(visit.labTests || []), newTest]);
        setTestSearchTerm('');
        setTestSearchResults([]);
    }

    const removeTest = (index: number) => {
        const newTests = [...(visit.labTests || [])];
        newTests.splice(index, 1);
        handleVisitChange('labTests', newTests);
    };

    const handleSave = async () => {
        if (!visit.patientId) return;
        setIsSaving(true);
        try {
            let savedVisit;
            if (visitId) {
                // When updating, increment version and ensure all fields are there.
                const visitToUpdate: Visit = {
                    ...visit as Visit,
                    prescriptionVersion: (visit.prescriptionVersion || 1) + 1,
                };
                savedVisit = await api.updateVisit(visitToUpdate);
            } else {
                savedVisit = await api.saveVisit(visit as Omit<Visit, 'id'>);
            }
            setIsSaving(false);
            window.open(`/#/print/prescription/${savedVisit.patientId}/${savedVisit.id}`, '_blank');
            navigate(`/patient/${savedVisit.patientId}`);
        } catch (error) {
            console.error("Failed to save visit", error);
            setIsSaving(false);
        }
    };

    if (loading) return <div>Loading editor...</div>;
    if (!patient) return <div>Patient not found</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Left Panel: Patient Info */}
            <div className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                 <h2 className={`text-2xl font-semibold mb-4 border-b pb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('patientInformation')}</h2>
                 <img src={patient.photoUrl} alt="Patient" className="w-24 h-24 rounded-full mx-auto mb-4" />
                 <p className={`text-center text-xl font-bold ${language === 'bn' ? 'font-bengali' : ''}`}>{language === 'bn' ? patient.nameBn : patient.nameEn}</p>
                 <div className="text-sm mt-4 space-y-1">
                     <p><strong>ID:</strong> {patient.patientId}</p>
                     <p><strong>Age/Gender:</strong> {patient.age} / {patient.gender}</p>
                     <p><strong>Phone:</strong> {patient.phone}</p>
                 </div>
            </div>

            {/* Right Panel: Prescription Form */}
            <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6 overflow-y-auto">
                <div>
                    <label className={`block font-semibold mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('clinicalNotes')}</label>
                    <textarea rows={3} value={visit.clinicalNotes} onChange={e => handleVisitChange('clinicalNotes', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                 <div>
                    <label className={`block font-semibold mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('diagnosis')}</label>
                    <input type="text" value={visit.diagnosis} onChange={e => handleVisitChange('diagnosis', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>

                {/* Medicines Section */}
                <div className="border-t pt-4">
                    <h3 className={`text-xl font-semibold mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('medicines')}</h3>
                    <div className="space-y-3">
                    {(visit.medicines || []).map((med, index) => (
                        <div key={med.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <div className="md:col-span-2">
                                <p className="font-semibold">{med.medicine.brandName} <span className="text-sm text-gray-500">{med.medicine.strength}</span></p>
                                <p className="text-xs text-gray-400">{med.medicine.genericName}</p>
                            </div>
                            <input type="text" placeholder={t('dose')} value={med.dose} onChange={e => handleMedicineChange(index, 'dose', e.target.value)} className="p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                            <input type="text" placeholder={t('frequency')} value={med.frequency} onChange={e => handleMedicineChange(index, 'frequency', e.target.value)} className="p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                            <input type="text" placeholder={t('duration')} value={med.duration} onChange={e => handleMedicineChange(index, 'duration', e.target.value)} className="p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                             <div className="flex items-center">
                                <input type="text" placeholder="SIG" value={med.sig} onChange={e => handleMedicineChange(index, 'sig', e.target.value)} className={`flex-grow p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}/>
                                <button onClick={() => removeMedicine(index)} className="ml-2 text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5"/></button>
                             </div>
                        </div>
                    ))}
                    </div>
                     <div className="mt-2 relative">
                        <input type="text" placeholder={t('searchMedicine')} value={medSearchTerm} onChange={e => setMedSearchTerm(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        {medSearchResults.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                                {medSearchResults.map(med => <li key={med.id} onClick={() => addMedicine(med)} className="p-2 hover:bg-primary-100 dark:hover:bg-gray-700 cursor-pointer">{med.brandName} ({med.genericName}) {med.strength}</li>)}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Lab Tests Section */}
                <div className="border-t pt-4">
                     <h3 className={`text-xl font-semibold mb-2 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('labTests')}</h3>
                     {(visit.labTests || []).map((test, index) => (
                         <div key={test.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md mb-2">
                            <p>{test.test.name}</p>
                            <button onClick={() => removeTest(index)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
                         </div>
                     ))}
                      <div className="mt-2 relative">
                        <input type="text" placeholder={t('searchTest')} value={testSearchTerm} onChange={e => setTestSearchTerm(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        {testSearchResults.length > 0 && (
                             <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                                {testSearchResults.map(tst => <li key={tst.id} onClick={() => addTest(tst)} className="p-2 hover:bg-primary-100 dark:hover:bg-gray-700 cursor-pointer">{tst.name}</li>)}
                            </ul>
                        )}
                      </div>
                </div>
                 <div>
                    <label className={`block font-semibold mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('advice')}</label>
                    <textarea rows={3} value={visit.advice} onChange={e => handleVisitChange('advice', e.target.value)} className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${language === 'bn' ? 'font-bengali' : ''}`}/>
                </div>
                 <div>
                    <label className={`block font-semibold mb-1 ${language === 'bn' ? 'font-bengali' : ''}`}>{t('followUp')}</label>
                    <input type="date" value={visit.followUpDate} onChange={e => handleVisitChange('followUpDate', e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
                </div>
                <div className="flex justify-end pt-4 border-t">
                    <button onClick={handleSave} disabled={isSaving} className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-green-700 disabled:bg-green-400 transition-colors">
                        <CheckIcon className="h-5 w-5 mr-2"/>
                        {isSaving ? 'Saving...' : t('savePrescription')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionEditor;