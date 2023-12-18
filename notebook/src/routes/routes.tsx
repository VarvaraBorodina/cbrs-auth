import { createBrowserRouter } from "react-router-dom";
import { AddFile } from "../pages/addFile/addFile";
import { Home } from "../pages/home/home";
import { Login } from "../pages/login/login";
import { Register } from "../pages/register/register";
import { File } from "../pages/file/file";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/file/:fileName",
    element: <File />,
  },
  {
    path: "/add-file",
    element: <AddFile />,
  },
]);
