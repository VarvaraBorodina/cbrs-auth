import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { login } from "../../../services/api";
import { useAuthContext } from "../../../components/AuthContext/AuthContext";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const Creads = ({ nextStage }: { nextStage: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setCurrentUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => emailjs.init("dXP4YtTQ_INVVaMID"), []);

  const onSend = async () => {
    try {
      const response = await login(password, email);

      setCurrentUser({
        username: response.data.username,
        email: response.data.email,
        sessionToken: response.data.sessionToken,
        isVerified: false,
      });

      nextStage();
    } catch (e: unknown) {
      const error = e as AxiosError;
      if (error?.response?.status === 400) {
        setError("Пользователь не найден");
      }
      if (error?.response?.status === 403) {
        setError("Неправильный пароль");
      }
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
        <Text fontSize="3xl" textAlign={"center"} mb={4}>
          Авторизация
        </Text>
        <Input
          placeholder="Адресс почты"
          size="lg"
          my={2}
          bg="white"
          focusBorderColor="brand.900"
          _placeholder={{ color: "brand.900", opacity: 0.5 }}
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
        />
        <Input
          type={"password"}
          placeholder="Пароль"
          size="lg"
          my={2}
          bg="white"
          focusBorderColor="brand.900"
          _placeholder={{ color: "brand.900", opacity: 0.5 }}
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
        />
        <Text fontSize="lg">{error}</Text>
        <Box display="flex" justifyContent="space-between" w="100%" my={4}>
          <Button
            bg="accent.800"
            color="white"
            _hover={{ bg: "accent.700" }}
            onClick={() => navigate("/register")}
          >
            Зарегестрироваться
          </Button>
          <Button
            bg="accent.800"
            color="white"
            _hover={{ bg: "accent.700" }}
            onClick={onSend}
          >
            Войти
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
