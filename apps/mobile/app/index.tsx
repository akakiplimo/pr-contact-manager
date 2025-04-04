import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // While checking auth status, return nothing (or a loading screen)
  if (isLoading) {
    return null;
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
