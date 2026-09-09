import {
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import Header from "../../../components/common/Header";
import FormSection from "../../../components/forms/FormSection";
import FormInput from "../../../components/forms/FormInput";
import FormButton from "../../../components/forms/FormButton";

import {
  getPropertyById,
  updateProperty,
  deletePropertyPhoto,
  uploadPropertyPhoto,
} from "../../../services/propertyService";

export default function EditListing() {
  const { id } = useLocalSearchParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  async function loadProperty() {
    try {
      setLoading(true);

      const data = await getPropertyById(id);

      console.log("ANNONCE À MODIFIER :", data);

      setListing(data);
    } catch (error) {
      console.error(
        "Erreur chargement annonce :",
        error.response?.data || error,
      );

      Alert.alert("Erreur", "Impossible de charger cette annonce.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(key, value) {
    setListing((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleDeletePhoto(photoId) {
    Alert.alert(
      "Supprimer la photo",
      "Voulez-vous vraiment supprimer cette photo ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePropertyPhoto(photoId);

              setListing((prev) => ({
                ...prev,
                photos: prev.photos.filter((photo) => photo.id !== photoId),
              }));
            } catch (error) {
              console.error(
                "Erreur suppression photo :",
                error.response?.data || error,
              );

              Alert.alert("Erreur", "Impossible de supprimer cette photo.");
            }
          },
        },
      ],
    );
  }

  async function handleAddPhoto() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission nécessaire",
          "Veuillez autoriser l'accès à vos photos.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const image = result.assets[0];

      const uploadedPhoto = await uploadPropertyPhoto(id, image);

      setListing((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), uploadedPhoto],
      }));
    } catch (error) {
      console.error("Erreur ajout photo :", error.response?.data || error);

      Alert.alert("Erreur", "Impossible d'ajouter la photo.");
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      if (!listing.title || !listing.description) {
        Alert.alert(
          "Informations manquantes",
          "Veuillez compléter le titre et la description.",
        );
        return;
      }

      if (!listing.city || !listing.address) {
        Alert.alert(
          "Localisation manquante",
          "Veuillez compléter la ville et l'adresse.",
        );
        return;
      }

      if (!listing.price) {
        Alert.alert("Prix manquant", "Veuillez renseigner le prix.");
        return;
      }

      const updatedProperty = await updateProperty(id, {
        title: listing.title,
        description: listing.description,

        region: listing.region || undefined,
        city: listing.city,
        quartier: listing.quartier || undefined,
        address: listing.address,

        type: listing.type,
        listingType: listing.listingType,

        price: Number(listing.price),

        surface: listing.surface ? Number(listing.surface) : undefined,

        rooms: Number(listing.rooms || 0),

        bathrooms: Number(listing.bathrooms || 0),

        charges: listing.charges ? Number(listing.charges) : undefined,

        deposit: listing.deposit ? Number(listing.deposit) : undefined,

        availability: listing.availability || undefined,

        furnished: listing.furnished,
      });

      console.log("ANNONCE MODIFIÉE :", updatedProperty);

      Alert.alert("Modification réussie", "Votre annonce a été mise à jour.", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error(
        "Erreur modification annonce :",
        error.response?.data || error,
      );

      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Impossible de modifier l'annonce.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header title="Modifier l'annonce" showBack />

      <FormSection title="Informations générales">
        <FormInput
          label="Titre du logement"
          placeholder="Ex: Appartement F4 aux Almadies"
          placeholderTextColor="#9CA3AF"
          value={listing.title || ""}
          onChangeText={(text) => handleChange("title", text)}
        />

        <FormInput
          label="Description"
          placeholder="Décrivez votre logement..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={5}
          value={listing.description || ""}
          onChangeText={(text) => handleChange("description", text)}
        />
      </FormSection>

      <FormSection title="Localisation">
        <FormInput
          label="Région"
          placeholder="Ex: Dakar"
          placeholderTextColor="#9CA3AF"
          value={listing.region || ""}
          onChangeText={(text) => handleChange("region", text)}
        />

        <FormInput
          label="Ville"
          placeholder="Ex: Dakar"
          placeholderTextColor="#9CA3AF"
          value={listing.city || ""}
          onChangeText={(text) => handleChange("city", text)}
        />

        <FormInput
          label="Quartier"
          placeholder="Ex: Almadies"
          placeholderTextColor="#9CA3AF"
          value={listing.quartier || ""}
          onChangeText={(text) => handleChange("quartier", text)}
        />

        <FormInput
          label="Adresse précise"
          placeholder="Rue, numéro..."
          placeholderTextColor="#9CA3AF"
          value={listing.address || ""}
          onChangeText={(text) => handleChange("address", text)}
        />
      </FormSection>

      <FormSection title="Caractéristiques">
        <FormInput
          label="Nombre de chambres"
          placeholder="Ex: 3"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={String(listing.rooms ?? "")}
          onChangeText={(text) => handleChange("rooms", text)}
        />

        <FormInput
          label="Salles de bain"
          placeholder="Ex: 2"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={String(listing.bathrooms ?? "")}
          onChangeText={(text) => handleChange("bathrooms", text)}
        />

        <FormInput
          label="Surface (m²)"
          placeholder="Ex: 120"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={String(listing.surface ?? "")}
          onChangeText={(text) => handleChange("surface", text)}
        />
      </FormSection>

      <FormSection title="Prix et disponibilité">
        <FormInput
          label="Prix"
          placeholder="Ex: 250000"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={String(listing.price ?? "")}
          onChangeText={(text) => handleChange("price", text)}
        />

        <FormInput
          label="Charges"
          placeholder="Ex: 15000"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={String(listing.charges ?? "")}
          onChangeText={(text) => handleChange("charges", text)}
        />

        <FormInput
          label="Caution"
          placeholder="Ex: 2 mois"
          placeholderTextColor="#9CA3AF"
          value={String(listing.deposit ?? "")}
          onChangeText={(text) => handleChange("deposit", text)}
        />

        <FormInput
          label="Disponibilité"
          placeholder="Ex: Disponible immédiatement"
          placeholderTextColor="#9CA3AF"
          value={listing.availability || ""}
          onChangeText={(text) => handleChange("availability", text)}
        />
      </FormSection>

      <FormSection title="Photos">
        <View style={styles.photosGrid}>
          {(listing.photos || []).map((photo) => (
            <View key={photo.id} style={styles.photoContainer}>
              <Image source={{ uri: photo.url }} style={styles.photo} />

              <TouchableOpacity
                style={styles.deletePhotoButton}
                onPress={() => handleDeletePhoto(photo.id)}
              >
                <Text style={styles.deletePhotoText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addPhotoButton}
          onPress={handleAddPhoto}
        >
          <Text style={styles.addPhotoText}>+ Ajouter une photo</Text>
        </TouchableOpacity>
      </FormSection>

      <FormButton
        title={saving ? "Enregistrement..." : "Enregistrer les modifications"}
        onPress={handleSave}
        disabled={saving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  photoContainer: {
    width: "47%",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  deletePhotoButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },

  deletePhotoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 24,
  },

  addPhotoButton: {
    marginTop: 15,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2563EB",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },

  addPhotoText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
  },
});
