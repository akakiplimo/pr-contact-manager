import { Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <Pressable onPress={logout} style={{ marginRight: 15 }}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'PR Contacts',
        }}
      />
      <Stack.Screen
        name="contact/[id]"
        options={{
          title: 'Contact Details',
        }}
      />
      <Stack.Screen
        name="contact/add"
        options={{
          title: 'Add New Contact',
        }}
      />
      <Stack.Screen
        name="contact/edit/[id]"
        options={{
          title: 'Edit Contact',
        }}
      />
    </Stack>
  );
}
