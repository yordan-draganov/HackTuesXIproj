import React, {createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  const updateUser = async (field, value) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { [field]: value });

    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};