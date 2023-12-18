import { useState } from "react";
import { Code } from "./components/code";
import { Creads } from "./components/creads";

export const Login = () => {
  const [loginStage, setLoginStage] = useState<"email" | "code">("email");

  return loginStage === "email" ? (
    <Creads nextStage={() => setLoginStage("code")} />
  ) : (
    <Code prevStage={() => setLoginStage("email")} />
  );
};
