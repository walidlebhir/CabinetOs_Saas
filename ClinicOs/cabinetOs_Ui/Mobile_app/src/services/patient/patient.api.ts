import { api } from '@/lib/api';
import type { PatientInfoRequest, PatientResponse } from '@/types/patient';

export async function getMyPatientInfo(): Promise<PatientResponse> {
  const response = await api.get<PatientResponse>('/patient/info');
  return response.data;
}

export async function addPatientInfo(
  payload: PatientInfoRequest
): Promise<string> {
  const response = await api.post<string>('/patient/info/add', payload);
  return response.data;
}

export async function updatePatientInfo(
  payload: PatientInfoRequest
): Promise<string> {
  const response = await api.put<string>('/patient/info/update', payload);
  return response.data;
}
