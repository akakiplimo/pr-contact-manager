import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IContact, Role } from '../../../../packages/shared/src';
import ContactCard from '@/components/ContactCard';
import FilterModal from '@/components/FilterModal';
import { useAuth } from '@/hooks/useAuth';
import { useContacts } from '@/hooks/useContacts';

export default function ContactsListScreen() {
  const router = useRouter();
  const { hasRole } = useAuth();
  const {
    contacts,
    loading,
    refreshing,
    hasMore,
    fetchContacts,
    handleRefresh,
    handleLoadMore,
    getAllTags,
    getAllOrganizations,
  } = useContacts();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableOrganizations, setAvailableOrganizations] = useState<
    string[]
  >([]);

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
    loadFilterData();
  }, []);

  // Load filter data (tags and organizations)
  const loadFilterData = async () => {
    const tags = await getAllTags();
    const orgs = await getAllOrganizations();
    setAvailableTags(tags);
    setAvailableOrganizations(orgs);
  };

  // Handle search submission
  const handleSearch = () => {
    fetchContacts(1, searchQuery, selectedTags, selectedOrganization);
  };

  // Handle filter application
  const handleApplyFilters = (tags: string[], organization: string) => {
    setSelectedTags(tags);
    setSelectedOrganization(organization);
    setFilterModalVisible(false);
    fetchContacts(1, searchQuery, tags, organization);
  };

  // Navigate to contact details
  const handleContactPress = (contact: IContact) => {
    router.push(`/contact/${contact._id}`);
  };

  // Render contact item
  const renderContactItem = ({ item }: { item: IContact }) => (
    <ContactCard contact={item} onPress={() => handleContactPress(item)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item._id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              handleRefresh(searchQuery, selectedTags, selectedOrganization)
            }
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
        onEndReached={() =>
          handleLoadMore(searchQuery, selectedTags, selectedOrganization)
        }
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator
              size="large"
              color="#2196F3"
              style={styles.loadingIndicator}
            />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No contacts found</Text>
              <Link href="/contact/add" asChild>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
              </Link>
            </View>
          ) : null
        }
      />

      {contacts && contacts.length > 0 ? (
        <Link href="/contact/add" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </Link>
      ) : null}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        selectedTags={selectedTags}
        selectedOrganization={selectedOrganization}
        availableTags={availableTags}
        availableOrganizations={availableOrganizations}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 12,
    marginRight: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  listContent: {
    flexGrow: 1,
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
