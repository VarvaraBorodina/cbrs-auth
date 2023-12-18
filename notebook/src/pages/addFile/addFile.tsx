import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../components/AuthContext/AuthContext";
import { addnewFile } from "../../services/api";

export const AddFile = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser || !currentUser?.sessionToken) {
      navigate("/login");
    }
  });

  const onSend = async () => {
    try {
      const sessionToken = currentUser?.sessionToken;
      await addnewFile(fileName, content, sessionToken ?? "");
      navigate("/");
    } catch (error) {
      setError("Неудалось создать файл");
    }
  };

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
          <Text fontSize="lg" textAlign={"center"} mb={4}>
            Создание файла
          </Text>

          <Input
            placeholder="Контент"
            size="lg"
            my={2}
            bg="white"
            focusBorderColor="brand.900"
            _placeholder={{ color: "brand.900", opacity: 0.5 }}
            value={content}
            onChange={({ target: { value } }) => setContent(value)}
          />
          <Input
            placeholder="Имя файла"
            size="lg"
            my={2}
            bg="white"
            focusBorderColor="brand.900"
            _placeholder={{ color: "brand.900", opacity: 0.5 }}
            value={fileName}
            onChange={({ target: { value } }) => setFileName(value)}
          />
          <Text fontSize="lg" textAlign={"center"} mb={4}>
            {error}
          </Text>
          <Box display={"flex"} justifyContent="space-between">
            <Button
              bg="accent.800"
              color="white"
              _hover={{ bg: "accent.700" }}
              mt={4}
              onClick={() => navigate("/")}
            >
              Отмена
            </Button>
            <Button
              bg="accent.800"
              color="white"
              _hover={{ bg: "accent.700" }}
              mt={4}
              onClick={() => onSend()}
            >
              Создать
            </Button>
          </Box>
        </>
      </Box>
    </Box>
  );
};
