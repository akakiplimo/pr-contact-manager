import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, onTagsChange }) => {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() === '') return;

    // Don't add duplicates
    if (!tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      onTagsChange(newTags);
    }

    setTagInput('');
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const renderTag = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.tagContainer}>
      <Text style={styles.tagText}>{item}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeTag(index)}
      >
        <Ionicons name="close-circle" size={16} color="#666" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={tagInput}
          onChangeText={setTagInput}
          placeholder="Add tags (press add after each tag)"
          onSubmitEditing={addTag}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTag}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tags}
        renderItem={renderTag}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal={false}
        numColumns={3}
        style={styles.tagsList}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tags added yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 9,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  tagsList: {
    marginTop: 10,
  },
  tagContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 14,
    marginRight: 5,
  },
  removeButton: {
    padding: 2,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default TagsInput;
