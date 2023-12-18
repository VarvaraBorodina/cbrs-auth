import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, sendEmail } from "../../services/api";
import emailjs from "@emailjs/browser";
import { AxiosError } from "axios";
import { useAuthContext } from "../../components/AuthContext/AuthContext";

const max = 9999;
const WAIT_TIME = 1000 * 60 * 3;

export const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [originalCode, setOriginalCode] = useState(
    Math.floor(Math.random() * max)
  );

  const [error, setError] = useState("");
  const { setCurrentUser } = useAuthContext();

  useEffect(() => emailjs.init("dXP4YtTQ_INVVaMID"), []);

  const navigate = useNavigate();

  const onSendCode = async () => {
    setShowCode(true);
    sendEmail(email, String(originalCode));
  };

  const onApplyCode = async () => {
    if (String(originalCode) === code) {
      try {
        const response = await register(username, email, password);
        setCurrentUser({
          username: response.data.user.username,
          email: response.data.user.email,
          sessionToken: response.data.sessionToken,
          isVerified: true,
        });
        navigate("/");
      } catch (e: unknown) {
        const error = e as AxiosError;
        if (error?.response?.status === 400) {
          setError("Пользователь уже существует");
        }
      }
    } else {
      const newCode = Math.floor(Math.random() * max);
      setOriginalCode(newCode);
      sendEmail(email, String(newCode));
      setError("Не верный пинкод. Вам оправлен новый.");
      setOriginalCode(Math.floor(Math.random() * max));

      setTimeout(() => {
        setError("Время ожидания пинкода вышло. Вам оправлен новый.");
        const newCode = Math.floor(Math.random() * max);
        setOriginalCode(newCode);
        sendEmail(email, String(newCode));
      }, WAIT_TIME);
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
        height={"75%"}
      >
        <Text fontSize="2xl">Введите свои данные</Text>
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
          placeholder="Имя пользователя"
          size="lg"
          my={2}
          bg="white"
          focusBorderColor="brand.900"
          _placeholder={{ color: "brand.900", opacity: 0.5 }}
          value={username}
          onChange={({ target: { value } }) => setUsername(value)}
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
        <>
          {showCode ? (
            <>
              <Input
                placeholder="Код"
                size="lg"
                my={2}
                bg="white"
                focusBorderColor="brand.900"
                _placeholder={{ color: "brand.900", opacity: 0.5 }}
                value={code}
                onChange={({ target: { value } }) => setCode(value)}
              />
              <Box display="flex" justifyContent="end" w="100%" my={4}>
                <Button
                  bg="accent.800"
                  color="white"
                  _hover={{ bg: "accent.700" }}
                  onClick={onApplyCode}
                >
                  Зарегестрироваться
                </Button>
              </Box>
            </>
          ) : (
            <Box display="flex" justifyContent="end" w="100%" my={4}>
              <Button
                bg="accent.800"
                color="white"
                _hover={{ bg: "accent.700" }}
                onClick={onSendCode}
              >
                Оправить код на почту
              </Button>
            </Box>
          )}
          <Text fontSize="lg">{error}</Text>
        </>
      </Box>
    </Box>
  );
};
