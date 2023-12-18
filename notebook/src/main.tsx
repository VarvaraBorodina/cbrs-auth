import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import { router } from "./routes/routes";

const colors = {
  brand: {
    900: "#cb6b85",
    800: "#f0dae1",
    700: "#FCF4F0",
  },
  accent: {
    700: "#bed2bf",
    800: "#abcdad",
  },
};

const theme = extendTheme({
  colors,
  styles: {
    global: {
      "#root": {
        minHeight: "100vh",
        minWidth: "100vw",
      },
    },
  },
});

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement!).render(
  <StrictMode>
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </AuthProvider>
  </StrictMode>
);
