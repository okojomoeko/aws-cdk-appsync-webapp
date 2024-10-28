// src/components/PostList.tsx
import React, { useEffect, useState } from "react";
import {
	Avatar,
	Button,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
  TextField,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { getPost, listPostsByUserId } from "../graphql/queries";
import { useAmplifyClient } from "../contexts/AmplifyClientContext";
import type { Post } from "../API";

const PostList = () => {
	const client = useAmplifyClient();
	const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState("");

	useEffect(() => {
		const posts = async () => {
			const result = await client.AmplifyClient.graphql({
				query: getPost,
      });
			setPosts(result.data?.getPost as Post[] || []);
		};

		posts().catch(console.error);
	}, []);

	return (
    <>
      <Button
        onClick={() => {
          const posts = async () => {
            const result = await client.AmplifyClient.graphql({
              query: getPost,
            });
            setPosts(result.data?.getPost as Post[] || []);
          };
          posts().catch(console.error);
        }}
      >
        Get Posts
      </Button>
      <TextField
        label="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <Button
        onClick={() => {
          if (userId === "") {
            return;
          }
          const posts = async () => {
            const result = await client.AmplifyClient.graphql({
              query: listPostsByUserId,
              variables: {input: {userId: userId}},
            });
            setPosts(result.data?.listPostsByUserId?.posts as Post[] || []);
          };
          posts().catch(console.error);
        }}
      >
        Search Posts By User ID
      </Button>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {posts.map((post) => (
          <ListItem key={post.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={post.content} secondary={post.userId} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default PostList;
