import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getFavorites, addFavorite, removeFavorite } from "../services/favorites";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data.map(fav => fav.propertyId));
    } catch (error) {
      console.error("Erreur chargement favoris :", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const toggleFavorite = useCallback(async (id) => {
    if (!user) return;

    try {
      if (favorites.includes(id)) {
        await removeFavorite(id);
        setFavorites(favorites.filter((item) => item !== id));
      } else {
        await addFavorite(id);
        setFavorites([...favorites, id]);
      }
    } catch (error) {
      console.error("Erreur toggle favori :", error);
    }
  }, [favorites, user]);

  const isFavorite = useCallback((id) => {
    return favorites.includes(id);
  }, [favorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        loadFavorites,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}