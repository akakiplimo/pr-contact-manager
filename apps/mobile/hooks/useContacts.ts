import { useState, useCallback } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import {
  API_ROUTES,
  IContact,
  IPaginatedResponse,
} from '../../../packages/shared/src';
import { API_BASE_URL } from '../constants/Config';

const TOKEN_KEY = 'pr-contacts-token';

export function useContacts() {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Get auth token
  const getToken = async (): Promise<string | null> => {
    return SecureStore.getItemAsync(TOKEN_KEY);
  };

  // Fetch contacts with optional filters
  const fetchContacts = useCallback(
    async (
      newPage = 1,
      searchQuery = '',
      selectedTags: string[] = [],
      selectedOrganization = ''
    ) => {
      try {
        setLoading(true);
        const token = await getToken();

        if (!token) {
          throw new Error('Authentication required');
        }

        // Make sure the token includes the 'Bearer ' prefix if your backend expects it
        const authHeader = token.startsWith('Bearer ')
          ? token
          : `Bearer ${token}`;

        let url = `${API_BASE_URL}${API_ROUTES.CONTACTS.BASE}?page=${newPage}&limit=10`;
        let debugUrl = `${API_BASE_URL}${API_ROUTES.CONTACTS.BASE}/debug-token`;

        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        if (selectedTags.length > 0) {
          url += `&tags=${encodeURIComponent(selectedTags.join(','))}`;
        }

        if (selectedOrganization) {
          url += `&organization=${encodeURIComponent(selectedOrganization)}`;
        }

        console.log('Fetching contacts:', url, `Bearer ${token}`);

        // await axios.get(debugUrl, {
        //   headers: { Authorization: authHeader },
        // });

        const response = await axios.get<IPaginatedResponse<IContact>>(url, {
          headers: { Authorization: authHeader },
        });

        if (newPage === 1) {
          setContacts(response.data.docs);
        } else {
          setContacts((prevContacts) => [
            ...prevContacts,
            ...response.data.docs,
          ]);
        }

        setPage(newPage);
        setTotalPages(response.data.totalPages);
        setHasMore(newPage < response.data.totalPages);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        Alert.alert('Error', 'Failed to fetch contacts');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // Get a single contact by ID
  const getContact = async (id: string): Promise<IContact | null> => {
    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get<IContact>(
        `${API_BASE_URL}${API_ROUTES.CONTACTS.BASE}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching contact details:', error);
      Alert.alert('Error', 'Failed to fetch contact details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new contact
  const createContact = async (
    contactData: Partial<IContact>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      console.log(
        `Create contact: ${API_BASE_URL}${API_ROUTES.CONTACTS.BASE}`,
        contactData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axios.post(
        `${API_BASE_URL}${API_ROUTES.CONTACTS.BASE}`,
        contactData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return true;
    } catch (error) {
      console.error('Error creating contact:', error);
      Alert.alert('Error', 'Failed to create contact');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing contact
  const updateContact = async (
    id: string,
    contactData: Partial<IContact>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.patch(
        `${API_BASE_URL}${API_ROUTES.CONTACTS.BASE}/${id}`,
        contactData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return true;
    } catch (error) {
      console.error('Error updating contact:', error);
      Alert.alert('Error', 'Failed to update contact');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a contact
  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      await axios.delete(`${API_BASE_URL}${API_ROUTES.CONTACTS.BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      Alert.alert('Error', 'Failed to delete contact');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Export contacts to Excel
  const exportToExcel = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${API_BASE_URL}${API_ROUTES.CONTACTS.EXPORT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      // In a real app, you'd save this file or share it
      // This would require using expo-file-system and expo-sharing
      console.log('Export successful');

      return response.data;
    } catch (error) {
      console.error('Error exporting contacts:', error);
      Alert.alert('Error', 'Failed to export contacts');
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags
  const getAllTags = async (): Promise<string[]> => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get<string[]>(
        `${API_BASE_URL}${API_ROUTES.CONTACTS.TAGS}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  };

  // Get all unique organizations
  const getAllOrganizations = async (): Promise<string[]> => {
    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get<string[]>(
        `${API_BASE_URL}${API_ROUTES.CONTACTS.ORGANIZATIONS}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return [];
    }
  };

  // Pull to refresh
  const handleRefresh = useCallback(
    (
      searchQuery = '',
      selectedTags: string[] = [],
      selectedOrganization = ''
    ) => {
      setRefreshing(true);
      fetchContacts(1, searchQuery, selectedTags, selectedOrganization);
    },
    [fetchContacts]
  );

  // Load more contacts
  const handleLoadMore = useCallback(
    (
      searchQuery = '',
      selectedTags: string[] = [],
      selectedOrganization = ''
    ) => {
      if (hasMore && !loading) {
        fetchContacts(
          page + 1,
          searchQuery,
          selectedTags,
          selectedOrganization
        );
      }
    },
    [fetchContacts, hasMore, loading, page]
  );

  return {
    contacts,
    loading,
    refreshing,
    page,
    totalPages,
    hasMore,
    fetchContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    exportToExcel,
    getAllTags,
    getAllOrganizations,
    handleRefresh,
    handleLoadMore,
  };
}
