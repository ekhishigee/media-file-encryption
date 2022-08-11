
import { useRoutes } from "react-router-dom";
import { AWSS3Storage } from "./pages/aws-s3-storage";
import { HomePage } from "./pages/home";
import { IPFSStorage } from "./pages/ipfs-storage";

const routeObjects = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "aws-s3",
    element: <AWSS3Storage />,
  },
  {
    path: "ipfs",
    element: <IPFSStorage />,
  },
];

export const AppRoutes = () => {
  const routes = useRoutes(routeObjects);
  return <>{routes}</>;
};
