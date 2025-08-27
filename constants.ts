
import { Patient, Doctor, Medicine, LabTest, Gender, Visit } from './types';

export const MOCK_DOCTOR: Doctor = {
  id: 'doc1',
  name: 'Dr. A. K. Azad Chowdhury',
  bmdcRegNo: 'A-12345',
  specialization: 'Cardiology Specialist, MBBS, FCPS (Cardiology)',
  digitalSignatureUrl: 'https://picsum.photos/200/60?random=10',
  chamber: 'MediFlow Clinic, House 12, Road 5, Dhanmondi, Dhaka',
  visitingHours: 'Sat-Thu: 5 PM - 9 PM',
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p001',
    patientId: 'P-2024001',
    nameEn: 'Abdur Rahim',
    nameBn: 'আব্দুর রহিম',
    age: 45,
    dob: '1979-05-10',
    gender: Gender.Male,
    phone: '01712345678',
    address: '123 Kalabagan, Dhaka',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    weight: 75,
    height: 170,
    photoUrl: 'https://picsum.photos/200/200?random=1',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'p002',
    patientId: 'P-2024002',
    nameEn: 'Fatima Begum',
    nameBn: 'ফাতেমা বেগম',
    age: 32,
    dob: '1992-02-20',
    gender: Gender.Female,
    phone: '01812345679',
    address: '456 Mirpur, Dhaka',
    bloodGroup: 'A+',
    allergies: [],
    weight: 60,
    height: 155,
    photoUrl: 'https://picsum.photos/200/200?random=2',
    createdAt: '2024-02-10T11:30:00Z',
  },
    {
    id: 'p003',
    patientId: 'P-2024003',
    nameEn: 'Kamal Hasan',
    nameBn: 'কামাল হাসান',
    age: 58,
    dob: '1966-08-15',
    gender: Gender.Male,
    phone: '01912345680',
    address: '789 Gulshan, Dhaka',
    bloodGroup: 'B+',
    allergies: ['Dust'],
    weight: 82,
    height: 175,
    photoUrl: 'https://picsum.photos/200/200?random=3',
    createdAt: '2024-03-05T09:45:00Z',
  },
];

export const MOCK_MEDICINES: Medicine[] = [
  { id: 'm001', genericName: 'Paracetamol', brandName: 'Napa', strength: '500 mg', dosageForm: 'Tablet', company: 'Beximco' },
  { id: 'm002', genericName: 'Omeprazole', brandName: 'Losectil', strength: '20 mg', dosageForm: 'Capsule', company: 'Square' },
  { id: 'm003', genericName: 'Amoxicillin', brandName: 'Moxacil', strength: '500 mg', dosageForm: 'Capsule', company: 'Incepta' },
  { id: 'm004', genericName: 'Metformin', brandName: 'Comet', strength: '500 mg', dosageForm: 'Tablet', company: 'Square' },
  { id: 'm005', genericName: 'Amlodipine', brandName: 'Amlovas', strength: '5 mg', dosageForm: 'Tablet', company: 'Aristopharma' },
  { id: 'm006', genericName: 'Salbutamol', brandName: 'Azmasol', strength: '2 mg', dosageForm: 'Syrup', company: 'Beximco' },
];

export const MOCK_LAB_TESTS: LabTest[] = [
  { id: 'lt001', name: 'CBC (Complete Blood Count)' },
  { id: 'lt002', name: 'RBS (Random Blood Sugar)' },
  { id: 'lt003', name: 'Serum Creatinine' },
  { id: 'lt004', name: 'Lipid Profile' },
  { id: 'lt005', name: 'ECG' },
  { id: 'lt006', name: 'Chest X-Ray P/A View' },
];

export const MOCK_VISITS: Visit[] = [
    {
        id: 'v001',
        patientId: 'p001',
        doctorId: 'doc1',
        visitDate: '2024-07-10T14:00:00Z',
        clinicalNotes: 'Patient complains of fever and headache for 3 days.',
        diagnosis: 'Viral Fever',
        medicines: [
            { id: 'pm001', medicine: MOCK_MEDICINES[0], dose: '1', frequency: '1+1+1', duration: '5 days', route: 'Oral', sig: 'After meal', isNew: true }
        ],
        labTests: [
            { id: 'olt001', test: MOCK_LAB_TESTS[0], instructions: 'Fasting not required' }
        ],
        advice: 'Take plenty of rest and drink fluids.',
        followUpDate: '2024-07-15',
        prescriptionVersion: 1,
    },
    {
        id: 'v002',
        patientId: 'p002',
        doctorId: 'doc1',
        visitDate: '2024-06-20T10:00:00Z',
        clinicalNotes: 'Follow-up visit for hypertension management.',
        diagnosis: 'Hypertension',
        medicines: [
            { id: 'pm002', medicine: MOCK_MEDICINES[4], dose: '1', frequency: '1+0+0', duration: '30 days', route: 'Oral', sig: 'In the morning', isNew: true }
        ],
        labTests: [],
        advice: 'Monitor blood pressure regularly. Avoid salty food.',
        followUpDate: '2024-07-20',
        prescriptionVersion: 1,
    }
];
