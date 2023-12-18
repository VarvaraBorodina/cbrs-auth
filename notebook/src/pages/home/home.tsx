import { Box, Button, Link, List, ListItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../components/AuthContext/AuthContext";
import { getFiles } from "../../services/api";
import { Link as ReactRouterLink } from "react-router-dom";

export const Home = () => {
  const { currentUser, setCurrentUser } = useAuthContext();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    if (!currentUser || !currentUser?.sessionToken) {
      navigate("/login");
    }

    const sessionToken = currentUser?.sessionToken;
    const response = await getFiles(sessionToken ?? "");

    setFiles(response.data.files);
  };

  useEffect(() => {
    fetchFiles();
  }, [currentUser]);

  return (
    <Box
      bg="white"
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box
        bg="brand.800"
        p={10}
        w="30%"
        margin={"auto"}
        borderRadius={10}
        color={"brand.900"}
      >
        <>
          <Text fontSize="3xl" textAlign={"center"} mb={4}>
            Файлы
          </Text>

          <List>
            {files.map((file: string) => (
              <ListItem>
                <Link as={ReactRouterLink} to={`file/${file.split(".")[0]}`}>
                  {file}
                </Link>
              </ListItem>
            ))}
          </List>
          <Box display={"flex"} justifyContent="space-between">
            <Button
              bg="accent.800"
              color="white"
              _hover={{ bg: "accent.700" }}
              mt={4}
              onClick={() => navigate("/add-file")}
            >
              Создать новый
            </Button>
            <Button
              bg="accent.800"
              color="white"
              _hover={{ bg: "accent.700" }}
              mt={4}
              onClick={() => setCurrentUser(null)}
            >
              Выйти
            </Button>
          </Box>
        </>
      </Box>
    </Box>
  );
};
