import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../config/FireBaseConfig";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });

    return unsubscribe;
  }, []);

  return user;
}
