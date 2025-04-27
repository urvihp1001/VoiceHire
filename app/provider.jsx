"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserAndCreate = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      // ✅ Fix: set a cleaned user object
      setUser({
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.user_metadata?.name || "",
        picture: currentUser.user_metadata?.picture || "",
      });

      const { data: existingUsers, error: selectError } = await supabase
        .from("Users")
        .select("id")
        .eq("email", currentUser.email)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error("Error fetching user:", selectError);
        return;
      }

      if (!existingUsers) {
        const { error: insertError } = await supabase.from("Users").insert([{
          name: currentUser.user_metadata?.name || "",
          email: currentUser.email || "",
          picture: currentUser.user_metadata?.picture || "",
        }]);
        if (insertError) console.error("Error inserting user:", insertError);
      }
    };

    getUserAndCreate();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || "",
          picture: session.user.user_metadata?.picture || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  return useContext(UserDetailContext);
};
