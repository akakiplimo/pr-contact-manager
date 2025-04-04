import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContacts } from '../../../hooks/useContacts';
import { useAuth } from '../../../hooks/useAuth';
import { IContact, Role } from '../../../../../packages/shared/src';

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getContact, deleteContact } = useContacts();
  const { hasRole } = useAuth();

  const [contact, setContact] = useState<IContact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchContactDetails();
    }
  }, [id]);

  const fetchContactDetails = async () => {
    if (!id) return;

    setLoading(true);
    const contactData = await getContact(id);
    setContact(contactData);
    setLoading(false);
  };

  const handleWikipediaPress = () => {
    if (contact?.wikipediaUrl) {
      Linking.openURL(contact.wikipediaUrl);
    }
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleShareContact = async () => {
    if (!contact) return;

    try {
      const message = `Contact Information:
Name: ${contact.name}
${contact.position ? `Position: ${contact.position}\n` : ''}${
        contact.organization ? `Organization: ${contact.organization}\n` : ''
      }${contact.email ? `Email: ${contact.email}\n` : ''}${
        contact.phone ? `Phone: ${contact.phone}\n` : ''
      }`;

      await Share.share({
        message,
        title: `Contact: ${contact.name}`,
      });
    } catch (error) {
      console.error('Error sharing contact:', error);
    }
  };

  const handleEditContact = () => {
    router.push(`/contact/edit/${id}`);
  };

  const handleDeleteContact = () => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteContact(id);
            if (success) {
              Alert.alert('Success', 'Contact deleted successfully');
              router.back();
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!contact) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Contact not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {contact.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{contact.name}</Text>
          {contact.position && (
            <Text style={styles.position}>{contact.position}</Text>
          )}
          {contact.organization && (
            <Text style={styles.organization}>{contact.organization}</Text>
          )}
        </View>
      </View>

      {contact.tags && contact.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {contact.tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        {contact.email && (
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handleEmailPress(contact.email!)}
          >
            <Ionicons name="mail-outline" size={22} color="#666" />
            <Text style={styles.infoText}>{contact.email}</Text>
          </TouchableOpacity>
        )}

        {contact.phone && (
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handlePhonePress(contact.phone!)}
          >
            <Ionicons name="call-outline" size={22} color="#666" />
            <Text style={styles.infoText}>{contact.phone}</Text>
          </TouchableOpacity>
        )}

        {contact.wikipediaUrl && (
          <TouchableOpacity
            style={styles.infoRow}
            onPress={handleWikipediaPress}
          >
            <Ionicons name="globe-outline" size={22} color="#666" />
            <Text style={styles.infoText}>Wikipedia</Text>
          </TouchableOpacity>
        )}
      </View>

      {contact.contactPerson && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Person</Text>

          <Text style={styles.contactPersonName}>
            {contact.contactPerson.name}
            {contact.contactPerson.relationship &&
              ` (${contact.contactPerson.relationship})`}
          </Text>

          {contact.contactPerson.email && (
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => handleEmailPress(contact.contactPerson!.email!)}
            >
              <Ionicons name="mail-outline" size={22} color="#666" />
              <Text style={styles.infoText}>{contact.contactPerson.email}</Text>
            </TouchableOpacity>
          )}

          {contact.contactPerson.phone && (
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => handlePhonePress(contact.contactPerson!.phone!)}
            >
              <Ionicons name="call-outline" size={22} color="#666" />
              <Text style={styles.infoText}>{contact.contactPerson.phone}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {contact.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{contact.notes}</Text>
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShareContact}
        >
          <Ionicons name="share-social-outline" size={22} color="white" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>

        {/* {hasRole([Role.ADMIN, Role.EDITOR]) && ( */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
          onPress={handleEditContact}
        >
          <Ionicons name="create-outline" size={22} color="white" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        {/* )} */}

        {/* {hasRole([Role.ADMIN]) && ( */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#F44336' }]}
          onPress={handleDeleteContact}
        >
          <Ionicons name="trash-outline" size={22} color="white" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
        {/* )} */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  position: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  organization: {
    fontSize: 16,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 10,
  },
  tagChip: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  contactPersonName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  notes: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
    fontSize: 16,
  },
});
