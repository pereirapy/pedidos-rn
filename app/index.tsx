import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '~/hooks/useAuth';
import Loading from '~/components/Loading';

export default function IndexPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    setTimeout(() => {
      if (user) router.replace('/dashboardPage');
      else router.replace('/loginPage');
    }, 100);
  }, [loading, user]);

  return <Loading show={loading} />;
}
