
export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export interface Patient {
  id: string;
  patientId: string;
  nameEn: string;
  nameBn: string;
  age: number;
  dob: string;
  gender: Gender;
  phone: string;
  address: string;
  bloodGroup: string;
  allergies: string[];
  weight: number;
  height: number;
  nid?: string;
  occupation?: string;
  photoUrl: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  bmdcRegNo: string;
  specialization: string;
  digitalSignatureUrl: string;
  chamber: string;
  visitingHours: string;
}

export interface Medicine {
  id: string;
  genericName: string;
  brandName: string;
  strength: string;
  dosageForm: string; // e.g., Tablet, Capsule, Syrup
  company: string;
}

export interface PrescribedMedicine {
  id: string;
  medicine: Medicine;
  dose: string;
  frequency: string;
  duration: string;
  route: string; // e.g., Oral, IV
  sig: string; // Special instructions
  isNew: boolean; // For printing logic
}

export interface LabTest {
  id: string;
  name: string;
  preparation?: string;
}

export interface OrderedLabTest {
    id: string;
    test: LabTest;
    instructions: string;
}

export interface Visit {
  id: string;
  patientId: string;
  doctorId: string;
  visitDate: string;
  clinicalNotes: string;
  diagnosis: string;
  medicines: PrescribedMedicine[];
  labTests: OrderedLabTest[];
  advice: string;
  followUpDate: string;
  prescriptionVersion: number;
}
