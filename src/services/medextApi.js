import api from './api';

// ──────────────────────────────────────────────
// API Calls
// ──────────────────────────────────────────────

/** Health-check / status of the AI backend */
export const checkHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};

/** Primary extraction endpoint — send medical text, receive structured output */
export const extractMedicalInfo = async (payload) => {
  const { data } = await api.post('/extract', payload);
  return data;
};

/** Fetch extraction history from the backend (if supported) */
export const fetchHistory = async () => {
  const { data } = await api.get('/history');
  return data;
};

/** Delete a history item */
export const deleteHistoryItem = async (id) => {
  await api.delete(`/history/${id}`);
};

/** Get a single extraction result by ID */
export const getExtractionById = async (id) => {
  const { data } = await api.get(`/extract/${id}`);
  return data;
};

/** Extract medical info from an uploaded image/file (multipart) */
export const extractFromImage = async (formData) => {
  const { data } = await api.post('/analyze-prescription', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
