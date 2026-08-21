// import { useAuth, useUser } from "@clerk/clerk-react";
// import { useMutation } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { syncUser } from "../lib/api";

// // the best way to implement this is by using webhooks
// function useUserSync() {
//   const { isSignedIn } = useAuth();
//   const { user } = useUser();

//   const { mutate: syncUserMutation, isPending, isSuccess } = useMutation({ mutationFn: syncUser });

//   useEffect(() => {
//     if (isSignedIn && user && !isPending && !isSuccess) {
//       syncUserMutation({
//         email: user.primaryEmailAddress?.emailAddress,
//         name: user.fullName || user.firstName,
//         imageUrl: user.imageUrl,
//       });
//     }
//   }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);

//   return { isSynced: isSuccess };
// }

// export default useUserSync;

import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { syncUser } from "../lib/api";

function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const hasSyncedRef = useRef(false);

  const { mutate: syncUserMutation, isPending, isSuccess } = useMutation({
    mutationFn: syncUser,
    onError: (err) => {
      console.error("User sync error:", err);
    },
  });

  useEffect(() => {
    if (isSignedIn && user && !isPending && !isSuccess && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      syncUserMutation();
    }
  }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);

  return { isSynced: isSuccess };
}

export default useUserSync;