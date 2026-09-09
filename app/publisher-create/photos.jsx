import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormButton from "../../components/forms/FormButton";
import { useListing } from "../../context/ListingContext";

import {
  createProperty,
  uploadPropertyPhoto,
} from "../../services/propertyService";

export default function Photos() {
  const { listing, resetListing } = useListing();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function pickImages() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission refusée",
        "La permission est nécessaire pour choisir des images.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handlePublish() {
    try {
      setLoading(true);

      // Vérifications
      if (!listing.title || !listing.description) {
        Alert.alert(
          "Informations manquantes",
          "Veuillez compléter les informations générales.",
        );
        return;
      }

      if (!listing.city || !listing.address) {
        Alert.alert(
          "Localisation manquante",
          "Veuillez compléter la localisation.",
        );
        return;
      }

      if (!listing.price) {
        Alert.alert(
          "Prix manquant",
          "Veuillez renseigner le prix du logement.",
        );
        return;
      }

      if (!listing.propertyType) {
        Alert.alert("Type manquant", "Veuillez choisir le type de logement.");
        return;
      }

      // 1. Création de l'annonce
      const property = await createProperty({
        title: listing.title,
        description: listing.description,

        region: listing.region || undefined,
        address: listing.address,
        city: listing.city,
        quartier: listing.district || undefined,

        type: listing.propertyType,
        listingType: listing.listingType || undefined,

        price: Number(listing.price),

        surface: listing.area ? Number(listing.area) : undefined,

        rooms: Number(listing.bedrooms),

        bathrooms: Number(listing.bathrooms),

        charges: listing.charges ? Number(listing.charges) : undefined,

        deposit: listing.deposit ? Number(listing.deposit) : undefined,

        availability: listing.availability || undefined,

        furnished: listing.furnished,
      });

      console.log("Annonce créée :", property);

      // 2. Upload des photos
      for (const image of images) {
        await uploadPropertyPhoto(property.id, image);
      }

      console.log("Toutes les photos ont été envoyées.");

      // 3. Réinitialiser le formulaire
      resetListing();
      setImages([]);

      // 4. Message puis retour dashboard
      Alert.alert("Annonce publiée", "Votre logement a été créé avec succès.", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/publisher");
          },
        },
      ]);
    } catch (error) {
      console.error("Erreur création annonce :", error.response?.data || error);

      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Impossible de publier l'annonce.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header title="Photos du logement" showBack />

      <FormSection title="Ajouter des photos">
        <TouchableOpacity
          style={styles.addButton}
          onPress={pickImages}
          disabled={loading}
        >
          <Text style={styles.addText}>+ Ajouter des photos</Text>
        </TouchableOpacity>

        <View style={styles.gallery}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => removeImage(index)}
              disabled={loading}
            >
              <Image source={{ uri: image.uri }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </FormSection>

      <FormButton
        title={loading ? "Publication..." : "Publier l'annonce"}
        onPress={handlePublish}
        disabled={loading}
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
    paddingBottom: 40,
  },

  addButton: {
    height: 120,
    borderWidth: 2,
    borderColor: "#2563EB",
    borderStyle: "dashed",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  addText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "700",
  },

  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    gap: 10,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
});