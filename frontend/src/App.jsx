import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "./context/store";

//Layouts
import LandingLayout from "./layouts/LandingLayout/LandingLayout";
import UserLayout from "./layouts/UserLayout/UserLayout";
import LawyerLayout from "./layouts/LawyerLayout/LawyerLayout";
import BioData from "./pages/lawyer/BioData/BioData";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";

//Layouts childrens
import landingChildrens from "./utils/landingChildrens";
import userChildrens from "./utils/userChildrens";
import adminChildrens from "./utils/adminChildrens";
import lawyerChildrens from "./utils/lawyerChildrens";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: landingChildrens
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: userChildrens
  },
  {
    path: "/user-lawyer",
    element: <LawyerLayout />,
    children: lawyerChildrens
  },
  {
    path: "/user-lawyer/bio-data",
    element: <BioData />
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: adminChildrens
  }
]);

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <RouterProvider router={router}/>
      </StoreProvider>
    </ QueryClientProvider>
  )
}

export default App;
