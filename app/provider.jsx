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

      setUser(currentUser);

      const { data: existingUsers, error: selectError } = await supabase
        .from("Users")
        .select("id") // Select only `id`, lighter query
        .eq("email", currentUser.email)
        .single();    // Expect one record or null

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
      setUser(session?.user ?? null);
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
