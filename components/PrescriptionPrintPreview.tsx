
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { api } from '../services/mockApi';
import { MOCK_DOCTOR } from '../constants';
import type { Patient, Visit, PrescribedMedicine } from '../types';
import { useAppContext } from '../context/AppContext';

const PrescriptionPrintPreview: React.FC = () => {
    const { patientId, visitId } = useParams<{ patientId: string; visitId: string }>();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [visit, setVisit] = useState<Visit | null>(null);
    const [printMode, setPrintMode] = useState<'all' | 'new'>('all');
    const { language } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            if (patientId && visitId) {
                const fetchedPatient = await api.getPatientById(patientId);
                const fetchedVisit = await api.getVisitById(patientId, visitId);
                setPatient(fetchedPatient || null);
                setVisit(fetchedVisit || null);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId, visitId]);
    
    useEffect(() => {
        if(visit && patient) {
            // Automatically trigger print dialog after a short delay
            const timer = setTimeout(() => window.print(), 1000);
            return () => clearTimeout(timer);
        }
    }, [visit, patient]);

    const medicinesToPrint = useMemo((): PrescribedMedicine[] => {
        if (!visit) return [];
        if (printMode === 'new') {
            return visit.medicines.filter(m => m.isNew);
        }
        return visit.medicines;
    }, [visit, printMode]);
    
    const pageStyle: React.CSSProperties = {
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        margin: '10mm auto',
        backgroundColor: 'white',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
        color: '#000',
    };

    if (!patient || !visit) {
        return <div className="flex justify-center items-center h-screen bg-gray-100"><div className="text-xl">Loading prescription...</div></div>;
    }

    return (
        <div className="bg-gray-100">
             <div className="p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10 no-print flex items-center justify-center space-x-4">
                <h2 className="text-lg font-semibold">Print Options</h2>
                 <select value={printMode} onChange={e => setPrintMode(e.target.value as 'all' | 'new')} className="p-2 border rounded-md">
                     <option value="all">Print Full Prescription</option>
                     <option value="new">Print Only New Medicines</option>
                 </select>
                <button onClick={() => window.print()} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Print Now</button>
            </div>
            <div style={pageStyle} className="font-sans">
                {/* Header */}
                <header className="flex justify-between items-start border-b-2 border-gray-700 pb-4">
                    <div className={language === 'bn' ? 'font-bengali' : ''}>
                        <h1 className="text-3xl font-bold text-gray-800">{MOCK_DOCTOR.name}</h1>
                        <p className="text-sm">{MOCK_DOCTOR.specialization}</p>
                        <p className="text-sm">BMDC Reg No: {MOCK_DOCTOR.bmdcRegNo}</p>
                    </div>
                    <div className={`text-right text-sm ${language === 'bn' ? 'font-bengali' : ''}`}>
                        <p className="font-semibold">{MOCK_DOCTOR.chamber}</p>
                        <p>{MOCK_DOCTOR.visitingHours}</p>
                    </div>
                </header>

                {/* Patient Info */}
                <section className="mt-4 border-b border-gray-400 pb-2">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr>
                                <td className="font-semibold w-1/6">Name</td>
                                <td>: {language === 'bn' ? patient.nameBn : patient.nameEn}</td>
                                <td className="font-semibold w-1/6">Age/Gender</td>
                                <td>: {patient.age} Y / {patient.gender}</td>
                                <td className="font-semibold w-1/6">Date</td>
                                <td>: {new Date(visit.visitDate).toLocaleDateString('en-GB')}</td>
                            </tr>
                            <tr>
                                <td className="font-semibold">Address</td>
                                <td>: {patient.address}</td>
                                <td className="font-semibold">Patient ID</td>
                                <td>: {patient.patientId}</td>
                                <td className="font-semibold">Visit ID</td>
                                <td>: {visit.id}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* Main Content */}
                <main className="flex mt-4">
                    {/* Left Column (Diagnosis, Tests) */}
                    <div className="w-1/3 pr-4 border-r border-gray-400">
                        <div>
                            <h3 className="font-bold text-lg mb-2">C/C:</h3>
                            <p className="text-sm pl-4 whitespace-pre-wrap">{visit.clinicalNotes}</p>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-bold text-lg mb-2">Diagnosis:</h3>
                            <p className="text-sm pl-4 font-semibold">{visit.diagnosis}</p>
                        </div>
                         {visit.labTests.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-bold text-lg mb-2">Lab Investigations:</h3>
                                <ul className="list-disc list-inside pl-4 text-sm">
                                    {visit.labTests.map(test => (
                                        <li key={test.id}>{test.test.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Medicines) */}
                    <div className="w-2/3 pl-6">
                        <span className="text-4xl font-bold">R<span className="text-2xl">x</span></span>
                        <div className="mt-4 space-y-4">
                            {medicinesToPrint.map((med, index) => (
                                <div key={med.id} className="text-sm">
                                    <p className="font-bold text-base">{index + 1}. {med.medicine.dosageForm} {med.medicine.brandName} ({med.medicine.genericName}) {med.medicine.strength}</p>
                                    <p className="pl-6">{med.dose} &nbsp;&nbsp;&nbsp; {med.frequency} &nbsp;&nbsp;&nbsp; ({med.duration})</p>
                                    {med.sig && <p className={`pl-6 italic ${language === 'bn' ? 'font-bengali' : ''}`}>{med.sig}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-auto pt-8 flex justify-between items-end absolute bottom-[20mm] left-[20mm] right-[20mm]">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Advice:</h3>
                        <p className={`text-sm pl-4 whitespace-pre-wrap ${language === 'bn' ? 'font-bengali' : ''}`}>{visit.advice}</p>
                        {visit.followUpDate && <p className="mt-4 text-sm font-semibold">Follow-up on: {new Date(visit.followUpDate).toLocaleDateString('en-GB')}</p>}
                    </div>
                    <div className="text-center">
                        <img src={MOCK_DOCTOR.digitalSignatureUrl} alt="Signature" className="h-12 mx-auto" />
                        <p className="border-t-2 border-gray-700 mt-2 pt-1 font-bold">{MOCK_DOCTOR.name}</p>
                    </div>
                    <div>
                        <QRCode value={`https://example.com/verify/prescription/${visit.id}`} size={80} />
                        <p className="text-xs mt-1">Scan to verify</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PrescriptionPrintPreview;
