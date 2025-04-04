import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IContact } from '../../../packages/shared/src';

interface ContactCardProps {
  contact: IContact;
  onPress: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {contact.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{contact.name}</Text>

        {contact.position && (
          <Text style={styles.position}>{contact.position}</Text>
        )}

        {contact.organization && (
          <Text style={styles.organization}>{contact.organization}</Text>
        )}

        {contact.tags && contact.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {contact.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {contact.tags.length > 3 && (
              <Text style={styles.moreTagsText}>
                +{contact.tags.length - 3}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {contact.email && (
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={16} color="#666" />
          </View>
        )}

        {contact.phone && (
          <View style={styles.iconContainer}>
            <Ionicons name="call-outline" size={16} color="#666" />
          </View>
        )}

        <Ionicons name="chevron-forward" size={20} color="#bbb" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  position: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  organization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  tagChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#2196F3',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});

export default ContactCard;
