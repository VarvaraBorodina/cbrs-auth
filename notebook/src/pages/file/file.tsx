import { Box, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../components/AuthContext/AuthContext";
import { getFile } from "../../services/api";
export const File = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const { fileName } = useParams();

  const [content, setContent] = useState("");

  const fetchFile = async () => {
    try {
      if (!currentUser || !currentUser?.sessionToken) {
        navigate("/login");
      }

      const sessionToken = currentUser?.sessionToken;
      const response = await getFile(fileName ?? "", sessionToken ?? "");
      setContent(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFile();
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
            {fileName}
          </Text>
          {content ? (
            <Box
              bg="white"
              w="100%"
              display="flex"
              alignItems="start"
              justifyContent="start"
              p={4}
              borderRadius={10}
            >
              <Text fontSize="lg" textAlign={"center"}>
                {content}
              </Text>
            </Box>
          ) : (
            <Text fontSize="lg" textAlign={"center"}>
              Загрузка...
            </Text>
          )}

          <Box display={"flex"} justifyContent="space-between">
            <Button
              bg="accent.800"
              color="white"
              _hover={{ bg: "accent.700" }}
              mt={4}
              onClick={() => navigate("/")}
            >
              Назад
            </Button>
          </Box>
        </>
      </Box>
    </Box>
  );
};
