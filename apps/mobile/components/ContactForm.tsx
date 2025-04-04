import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TagsInput from './TagsInput';
import { IContact } from '../../../packages/shared/src';

interface ContactFormProps {
  initialData?: IContact;
  isEditing?: boolean;
  onSubmit: (formData: Partial<IContact>) => Promise<void>;
}

const ContactForm: React.FC<ContactFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<IContact>>({
    name: '',
    position: '',
    organization: '',
    email: '',
    phone: '',
    wikipediaUrl: '',
    tags: [],
    notes: '',
    contactPerson: {
      name: '',
      relationship: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        ...initialData,
        // Ensure contactPerson exists with all fields
        contactPerson: {
          name: initialData.contactPerson?.name || '',
          relationship: initialData.contactPerson?.relationship || '',
          email: initialData.contactPerson?.email || '',
          phone: initialData.contactPerson?.phone || '',
        },
      });
    }
  }, [initialData, isEditing]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactPersonChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson!,
        [field]: value,
      },
    }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({
      ...prev,
      tags,
    }));
  };

  const validateForm = () => {
    if (!formData.name || formData.name.trim() === '') {
      Alert.alert('Validation Error', 'Name is required');
      return false;
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      Alert.alert('Validation Error', 'Invalid email format');
      return false;
    }

    if (
      formData.contactPerson?.email &&
      !/^\S+@\S+\.\S+$/.test(formData.contactPerson.email)
    ) {
      Alert.alert('Validation Error', 'Invalid contact person email format');
      return false;
    }

    if (
      formData.wikipediaUrl &&
      !formData.wikipediaUrl.startsWith('https://') &&
      !formData.wikipediaUrl.startsWith('http://')
    ) {
      Alert.alert(
        'Validation Error',
        'Wikipedia URL should start with http:// or https://'
      );
    }
  };

  const handleSubmit = async () => {
    console.log('inside submit');
    // if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Clean up the data before submission
      const submitData = { ...formData };

      // Remove empty strings from contactPerson
      if (submitData.contactPerson) {
        if (!submitData.contactPerson.name) {
          delete submitData.contactPerson;
        }
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert(
        'Error',
        `Failed to ${isEditing ? 'update' : 'create'} contact`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Position</Text>
            <TextInput
              style={styles.input}
              value={formData.position}
              onChangeText={(value) => handleInputChange('position', value)}
              placeholder="Enter position"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Organization</Text>
            <TextInput
              style={styles.input}
              value={formData.organization}
              onChangeText={(value) => handleInputChange('organization', value)}
              placeholder="Enter organization"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wikipedia URL</Text>
            <TextInput
              style={styles.input}
              value={formData.wikipediaUrl}
              onChangeText={(value) => handleInputChange('wikipediaUrl', value)}
              placeholder="https://en.wikipedia.org/wiki/..."
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags</Text>
            <TagsInput
              tags={formData.tags || []}
              onTagsChange={handleTagsChange}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Contact Person</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.contactPerson?.name}
              onChangeText={(value) => handleContactPersonChange('name', value)}
              placeholder="Enter contact person name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Relationship</Text>
            <TextInput
              style={styles.input}
              value={formData.contactPerson?.relationship}
              onChangeText={(value) =>
                handleContactPersonChange('relationship', value)
              }
              placeholder="E.g., Assistant, Manager, Friend"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.contactPerson?.email}
              onChangeText={(value) =>
                handleContactPersonChange('email', value)
              }
              placeholder="Enter contact person email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.contactPerson?.phone}
              onChangeText={(value) =>
                handleContactPersonChange('phone', value)
              }
              placeholder="Enter contact person phone"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Enter any notes about this contact"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={submitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Update' : 'Create'} Contact
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formSection: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 30,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default ContactForm;
