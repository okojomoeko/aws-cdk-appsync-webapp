// src/components/Notification.tsx
import { useEffect, useState } from "react";
import { Snackbar } from "@mui/material";
import { onCreatePost } from "../graphql/subscriptions";
import { useAmplifyClient } from "../contexts/AmplifyClientContext";

const Notification = () => {
  const {AmplifyClient, userId} = useAmplifyClient();
  const [mention, setMention] = useState<string | null>(null);

  useEffect(() => {
    const subscription = AmplifyClient.graphql({
        query: onCreatePost,
        variables: {
          toUserId: userId,
        },
      })
      .subscribe({
        next: ({ data }) => {
          const post = data.onCreatePost.content;
          const fromUserId = data.onCreatePost.userId;
          setMention(`New post from ${fromUserId}: ${post}`);
        },
        error: (error) => {
          console.warn("Subscription error:", error);
        },
      });

    // Cleanup the subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };

  }, []);

  return (
    <Snackbar
      open={Boolean(mention)}
      message={mention}
      autoHideDuration={4000}
      onClose={() => setMention(null)}
    />
  );
};

export default Notification;
