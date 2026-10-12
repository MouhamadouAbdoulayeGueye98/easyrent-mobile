import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { z } from 'zod';
import { router } from 'expo-router';

import { useCreatePropertyMutation } from './api';
// 1. Définition du schéma de validation Zod
const propertySchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  city: z.string().min(2, "La ville est requise"),
  price: z.coerce.number().positive("Le prix doit être un nombre valide supérieur à 0"),
});

export default function CreatePropertyScreen() {
  // États locaux pour les champs du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');

  // Hook de mutation RTK Query
  const [createProperty, { isLoading }] = useCreatePropertyMutation();

  async function handleFormSubmit() {
    // 2. Préparation des données brutes du formulaire
    const rawData = {
      title,
      description,
      city,
      price, // Sera converti en nombre par z.coerce.number()
    };

    // 3. Validation avec Zod (.safeParse pour éviter les crashs)
    const validationResult = propertySchema.safeParse(rawData);

    if (!validationResult.success) {
      // Récupère la première erreur de validation rencontrée
      const firstError = validationResult.error.errors[0].message;
      Alert.alert("Erreur de validation", firstError);
      return;
    }

    // 4. Si la validation réussit, on envoie les données nettoyées via RTK Query
    try {
      const cleanData = validationResult.data;
      
      await createProperty(cleanData).unwrap();
      
      Alert.alert("Succès", "Propriété créée avec succès !");
      router.back(); 
    } catch (err) {
      console.error("Erreur API :", err);
      Alert.alert("Erreur", "Impossible de créer la propriété pour le moment.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Publier un bien</Text>

      <Text style={styles.label}>Titre de l'annonce</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Bel appartement moderne"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Décrivez votre bien..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Ville</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Dakar"
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>Prix (FCFA)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 150000"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleFormSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Valider et Créer</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9fa', flexGrow: 1, paddingTop: 60 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#111' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#333' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});