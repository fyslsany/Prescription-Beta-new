
import { Patient, Visit, Medicine, LabTest } from '../types';
import { MOCK_PATIENTS, MOCK_VISITS, MOCK_MEDICINES, MOCK_LAB_TESTS } from '../constants';

const LATENCY = 500; // ms

// A helper to simulate network latency
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getPatients: async (query?: string): Promise<Patient[]> => {
    await sleep(LATENCY);
    if (!query) {
      return MOCK_PATIENTS;
    }
    const lowercasedQuery = query.toLowerCase();
    return MOCK_PATIENTS.filter(p => 
      p.nameEn.toLowerCase().includes(lowercasedQuery) || 
      p.nameBn.includes(lowercasedQuery) || 
      p.phone.includes(lowercasedQuery) ||
      p.patientId.toLowerCase().includes(lowercasedQuery)
    );
  },
  getPatientById: async (id: string): Promise<Patient | undefined> => {
    await sleep(LATENCY);
    return MOCK_PATIENTS.find(p => p.id === id);
  },
  getVisitsByPatientId: async (patientId: string): Promise<Visit[]> => {
    await sleep(LATENCY);
    return MOCK_VISITS.filter(v => v.patientId === patientId).sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
  },
  getVisitById: async(patientId: string, visitId: string): Promise<Visit | undefined> => {
    await sleep(LATENCY);
    return MOCK_VISITS.find(v => v.patientId === patientId && v.id === visitId);
  },
  getMedicines: async (query: string): Promise<Medicine[]> => {
    await sleep(200);
    const lowercasedQuery = query.toLowerCase();
    return MOCK_MEDICINES.filter(m => 
        m.brandName.toLowerCase().includes(lowercasedQuery) || 
        m.genericName.toLowerCase().includes(lowercasedQuery)
    ).slice(0, 5);
  },
  getLabTests: async (query: string): Promise<LabTest[]> => {
      await sleep(200);
      const lowercasedQuery = query.toLowerCase();
      return MOCK_LAB_TESTS.filter(t => t.name.toLowerCase().includes(lowercasedQuery)).slice(0, 5);
  },
  saveVisit: async (visit: Omit<Visit, 'id'>): Promise<Visit> => {
      await sleep(LATENCY);
      const newVisit: Visit = {
          ...visit,
          id: `v${Date.now()}`
      };
      MOCK_VISITS.push(newVisit);
      console.log("Saved Visit:", newVisit);
      return newVisit;
  },
  updateVisit: async (updatedVisit: Visit): Promise<Visit> => {
      await sleep(LATENCY);
      const index = MOCK_VISITS.findIndex(v => v.id === updatedVisit.id);
      if (index !== -1) {
          MOCK_VISITS[index] = updatedVisit;
          console.log("Updated Visit:", updatedVisit);
          return updatedVisit;
      }
      throw new Error("Visit not found");
  }
};
