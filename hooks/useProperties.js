import { useState, useEffect } from 'react';

export default function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Remplacez 10.0.2.2 par l'IP de votre PC si vous êtes sur un vrai téléphone
    fetch('http://127.0.0.1:3000/properties')
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des logements:', err);
        setLoading(false);
      });
  }, []);

  const filteredProperties = properties.filter((item) =>
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