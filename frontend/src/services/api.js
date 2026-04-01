import { API_BASE_URL } from '../constants';

/**
 * Calls the nearby donors endpoint.
 * @param {Object} data - { lat, lng, bloodGroup, area }
 * @returns {Promise<Object>} The API response data.
 */
export const findDonors = async (data) => {
  const response = await fetch(`${API_BASE_URL}/donors/nearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};
