import { useState } from 'react';
import { findDonors as fetchFromApi } from '../services/api';

const useBloodDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchDonors = async (searchData) => {
    setLoading(true);
    setApiError(null);
    setHasSearched(true);

    try {
      const data = await fetchFromApi(searchData);

      if (data.success) {
        setDonors(data.data);
      } else {
        setApiError(data.message || 'Failed to fetch donors');
      }
    } catch (error) {
      setApiError('Server connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return { donors, loading, apiError, searchDonors, hasSearched };
};

export default useBloodDonors;
