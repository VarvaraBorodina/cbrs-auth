import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { sendEmail } from "../../../services/api";
import { useAuthContext } from "../../../components/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const max = 9999;
const WAIT_TIME = 1000 * 60 * 3;

export const Code = ({ prevStage }: { prevStage: () => void }) => {
  const [code, setCode] = useState("");
  const [originalCode, setOriginalCode] = useState(
    Math.floor(Math.random() * max)
  );
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { setCurrentUser, currentUser } = useAuthContext();

  useEffect(() => {
    if (!currentUser) {
      prevStage();
    } else {
      sendEmail(currentUser?.email, String(originalCode));
    }
  }, [currentUser, originalCode]);

  const onSend = async () => {
    if (String(originalCode) === code && currentUser) {
      setCurrentUser({
        ...currentUser,
        isVerified: true,
      });
      navigate("/");
    } else {
      setError("Не верный пинкод. Вам оправлен новый.");
      setOriginalCode(Math.floor(Math.random() * max));
      setTimeout(() => {
        setError("Время ожидания пинкода вышло. Вам оправлен новый.");
        setOriginalCode(Math.floor(Math.random() * max));
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
      >
        <Text fontSize="lg" textAlign={"center"} mb={4}>
          Введите код отправленный Вам на почту
        </Text>
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
        <Text fontSize="lg">{error}</Text>
        <Box display="flex" justifyContent="space-between" w="100%" my={4}>
          <Button
            bg="accent.800"
            color="white"
            _hover={{ bg: "accent.700" }}
            onClick={onSend}
            disabled={!code}
          >
            Далее
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
