"use client";
import { useSystemUserProfileMutation } from "../api/slices/auth";
import React, { useEffect } from "react";
// import { useAppSelector } from "../redux/store";

export default function PersistLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  const [getSystemUserProfile] = useSystemUserProfileMutation();

  // const { user, token} = useAppSelector(state => state.auth)
  useEffect(() => {
      const loadSystemUserProfile = async () => {
        try {
          await getSystemUserProfile({});
        } catch (err) {
          console.error(err);
        }
      };

    loadSystemUserProfile();
   

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <> {children}</>;
}
