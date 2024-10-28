import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Notification from "./components/Notification";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@mui/material";

function App() {
	// const [count, setCount] = useState(0);
  const { signOut } = useAuthenticator();
	return (
    <Container maxWidth="sm">
      <Button onClick={signOut}>Sign out</Button>
      <Box sx={{ my: 4 }}>
        <Notification />
        <PostForm />
        <PostList />
      </Box>
    </Container>
  );
}

export default App;
