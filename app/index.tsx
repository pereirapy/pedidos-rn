import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useAuth } from '~/hooks/useAuth';
import { Container } from '~/components/Container';

export default function IndexPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if(loading) return;
    if (user) router.replace('/dashboardPage');
    else router.replace('/loginPage');
  }, [loading, user]);

  return (
    <Container>
      <View>
        <Text>Loading...</Text>
      </View>
    </Container>
  );
}
