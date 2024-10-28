import { useState } from "react";
import { Button, TextField, Container } from "@mui/material";
import { createPost } from "../graphql/mutations";
import { useAmplifyClient } from "../contexts/AmplifyClientContext";
import { getCurrentUser } from "aws-amplify/auth";

const PostForm = () => {
  const client = useAmplifyClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = async () => {
    const userId = (await getCurrentUser()).userId;
    // 一旦複数人ではなく、最初にメンションされた人に通知するようにします
    const toUserId = content.match(/@([^\s]+)/)?.[1] || null;
    await client.AmplifyClient.graphql({
      query: createPost,
      variables: { input: { content: content, title: title, userId: userId, toUserId: toUserId } },
    });
    setContent("");
    setTitle("");
  };

  return (
    <Container>
      <TextField label="Title" variant="filled" value={title} onChange={(e) => setTitle(e.target.value)}  />
      <TextField
        label="New Post"
        multiline
        maxRows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handlePost}>Post</Button>
    </Container>
  );
};

export default PostForm;
