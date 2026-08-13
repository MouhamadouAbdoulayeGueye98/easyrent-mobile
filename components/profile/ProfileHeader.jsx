import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileHeader() {
  const { user } = useAuth();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
      </View>

      <Text style={styles.name}>{user?.name || 'Nom d\'utilisateur'}</Text>
      <Text style={styles.role}>
        {user?.role === 'publisher' ? (user?.publisherType || 'Annonceur') : 'Client'}
      </Text>
      <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>📞 {user?.phone || 'Téléphone non renseigné'}</Text>
        <Text style={styles.detailText}>📍 {user?.city || 'Ville non renseignée'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#4B5563',
  },
});