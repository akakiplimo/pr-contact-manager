import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IContact } from '../../../../../../packages/shared/src';
import ContactForm from '@/components/ContactForm';
import { useContacts } from '@/hooks/useContacts';

export default function EditContactScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getContact, updateContact } = useContacts();

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

  const handleSubmit = async (formData: any) => {
    if (!id) return;

    const success = await updateContact(id, formData);
    if (success) {
      router.back();
    }
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
    <View style={styles.container}>
      <ContactForm
        initialData={contact}
        onSubmit={handleSubmit}
        isEditing={true}
      />
    </View>
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
});
