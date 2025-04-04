import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useContacts } from '@/hooks/useContacts';
import ContactForm from '@/components/ContactForm';

export default function AddContactScreen() {
  const { createContact } = useContacts();
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    const success = await createContact(formData);
    if (success) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <ContactForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
