import { User, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { auth, db } from '~/utils/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(auth ? auth?.currentUser : undefined);
  const [loading, setLoading] = useState(true);

  const updateCurrentUser = async (userLoggedIn?: User | null) => {
    if (userLoggedIn && userLoggedIn.email) {
      try {
        const docRef = doc(db, 'users', userLoggedIn.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const currentUserData = docSnap.data();
          if (currentUserData.name !== '')
            await updateProfile(userLoggedIn, { displayName: currentUserData.name });
        } else {
          // docSnap.data() will be undefined in this case
          console.log('User not found!');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await updateCurrentUser(user);
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
};
