import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { syncUser } from "../lib/api";

function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const syncedUserIdRef = useRef(null);

  const { mutate: syncUserMutation, isPending, isSuccess } = useMutation({
    mutationFn: syncUser,
    retry: 2,
    onError: (err) => {
      console.error("User sync error:", err);
    },
  });

  useEffect(() => {
    // Reset sync state when user signs out or user ID changes
    if (!isSignedIn || !user?.id) {
      syncedUserIdRef.current = null;
      return;
    }

    // Trigger sync only if this specific user ID hasn't been successfully synced yet
    if (isSignedIn && user?.id && syncedUserIdRef.current !== user.id && !isPending) {
      syncUserMutation(
        {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || user.firstName,
          imageUrl: user.imageUrl,
        },
        {
          onSuccess: () => {
            syncedUserIdRef.current = user.id;
          },
        }
      );
    }
  }, [isSignedIn, user, syncUserMutation, isPending]);

  return { isSynced: isSuccess };
}

export default useUserSync;