import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await api.get('/properties');
        setProperties(response.data);
      } catch (err) {
        console.error(
          'Erreur lors du chargement des logements:',
          err?.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const filteredProperties = properties.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    filteredProperties,
    loading,
    searchQuery,
    setSearchQuery,
  };
}

