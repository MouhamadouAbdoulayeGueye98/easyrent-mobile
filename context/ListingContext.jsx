import { createContext, useContext, useState } from "react";

const ListingContext = createContext(null);

export function ListingProvider({ children }) {
  const [listing, setListing] = useState({
    // Étape 1
    title: "",
    propertyType: "",
    listingType: "",
    description: "",

    // Étape 2
    region: "",
    city: "",
    district: "",
    address: "",

    // Étape 3
    bedrooms: 0,
    bathrooms: 0,
    area: "",
    furnished: false,

    // Étape 4
    price: "",
    charges: "",
    deposit: "",
    availability: "",

    // Étape 5
    images: [],

    // Plus tard
    amenities: {},
  });

  function updateListing(data) {
    setListing((prev) => ({
      ...prev,
      ...data,
    }));
  }

  function resetListing() {
    setListing({
      title: "",
      propertyType: "",
      listingType: "",
      description: "",
      region: "",
      city: "",
      district: "",
      address: "",
      bedrooms: 0,
      bathrooms: 0,
      area: "",
      furnished: false,
      price: "",
      charges: "",
      deposit: "",
      availability: "",
      images: [],
      amenities: {},
    });
  }

  return (
    <ListingContext.Provider
      value={{
        listing,
        updateListing,
        resetListing,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
}

export function useListing() {
  const context = useContext(ListingContext);

  if (!context) {
    throw new Error(
      "useListing doit être utilisé à l'intérieur de ListingProvider"
    );
  }

  return context;
}