import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (tags: string[], organization: string) => void;
  selectedTags: string[];
  selectedOrganization: string;
  availableTags: string[];
  availableOrganizations: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  selectedTags,
  selectedOrganization,
  availableTags,
  availableOrganizations,
}) => {
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>([]);
  const [localSelectedOrganization, setLocalSelectedOrganization] =
    useState('');
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [orgSearchQuery, setOrgSearchQuery] = useState('');

  useEffect(() => {
    if (visible) {
      setLocalSelectedTags(selectedTags);
      setLocalSelectedOrganization(selectedOrganization);
      setTagSearchQuery('');
      setOrgSearchQuery('');
    }
  }, [visible, selectedTags, selectedOrganization]);

  const toggleTag = (tag: string) => {
    if (localSelectedTags.includes(tag)) {
      setLocalSelectedTags(localSelectedTags.filter((t) => t !== tag));
    } else {
      setLocalSelectedTags([...localSelectedTags, tag]);
    }
  };

  const selectOrganization = (org: string) => {
    if (localSelectedOrganization === org) {
      setLocalSelectedOrganization('');
    } else {
      setLocalSelectedOrganization(org);
    }
  };

  const handleApply = () => {
    onApply(localSelectedTags, localSelectedOrganization);
  };

  const handleReset = () => {
    setLocalSelectedTags([]);
    setLocalSelectedOrganization('');
  };

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  const filteredOrganizations = availableOrganizations.filter((org) =>
    org.toLowerCase().includes(orgSearchQuery.toLowerCase())
  );

  const renderTagItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.filterItem,
        localSelectedTags.includes(item) && styles.selectedFilterItem,
      ]}
      onPress={() => toggleTag(item)}
    >
      <Text
        style={[
          styles.filterItemText,
          localSelectedTags.includes(item) && styles.selectedFilterItemText,
        ]}
      >
        {item}
      </Text>
      {localSelectedTags.includes(item) && (
        <Ionicons name="checkmark" size={16} color="white" />
      )}
    </TouchableOpacity>
  );

  const renderOrgItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.filterItem,
        localSelectedOrganization === item && styles.selectedFilterItem,
      ]}
      onPress={() => selectOrganization(item)}
    >
      <Text
        style={[
          styles.filterItemText,
          localSelectedOrganization === item && styles.selectedFilterItemText,
        ]}
      >
        {item}
      </Text>
      {localSelectedOrganization === item && (
        <Ionicons name="checkmark" size={16} color="white" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Contacts</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Tags</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search tags..."
                value={tagSearchQuery}
                onChangeText={setTagSearchQuery}
                clearButtonMode="while-editing"
              />
              <FlatList
                data={filteredTags}
                renderItem={renderTagItem}
                keyExtractor={(item) => item}
                scrollEnabled={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No tags available</Text>
                }
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Organizations</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search organizations..."
                value={orgSearchQuery}
                onChangeText={setOrgSearchQuery}
                clearButtonMode="while-editing"
              />
              <FlatList
                data={filteredOrganizations}
                renderItem={renderOrgItem}
                keyExtractor={(item) => item}
                scrollEnabled={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    No organizations available
                  </Text>
                }
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 15,
    maxHeight: 500,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 5,
    marginVertical: 4,
    backgroundColor: '#f0f0f0',
  },
  selectedFilterItem: {
    backgroundColor: '#2196F3',
  },
  filterItemText: {
    fontSize: 16,
  },
  selectedFilterItemText: {
    color: 'white',
  },
  resetButton: {
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
});

export default FilterModal;
