import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import LayoutGeneric from '~/components/LayoutGeneric';
import Loading from '~/components/Loading';
import { useAuth } from '~/hooks/useAuth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '~/utils/firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Button } from '~/components/Button';

export default function UsersPage() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  const getAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
    } catch (e) {
      console.error('Error getting document: ', e);
    }
  };

  const getCurrentUser = async () => {
    if (user) {
      try {
        const docRef = doc(db, 'users', user?.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log('No such document!');
        }
      } catch (error) {
        console.log(error);
      }
    } else console.log('User not logged in!');
  };


  const createNewUser = async () => {
    try {
      await setDoc(doc(db, "users", "rodrigoyleila@gmail.com"), {
        name: "Rodrigo Lucas Pereira",
        email: "rodrigoyleila@gmail.com",
        type: "1"
      });
      return true
      
    } catch (error: any) {
      const errorCode = error.code;
      console.error(error.message)
      return false;
    }

  }

  useEffect(() => {
    getAllUsers();
    getCurrentUser();
  }, []);

  return (
    <LayoutGeneric title={t('usersPage.title')}>
      {loading ? (
        <Loading show={loading} />
      ) : (
        <>
          <Text>Email logged in: {user?.email}</Text>
          <Text>Name logged in: {user?.displayName}</Text>
          {/* <Button title='Create' onPress={createNewUser} /> */}
        </>
      )}
    </LayoutGeneric>
  );
}
