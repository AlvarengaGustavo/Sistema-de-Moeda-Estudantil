import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import { Content } from "./styles/MainLayout.styled";
import { PrivateRoute } from "./PrivateRoute";

const MainLayout = () => {
  return (
    <PrivateRoute>
      <Box display="flex" height="100vh">
        <Sidebar />

        <Content>
          <Outlet />
        </Content>
      </Box>
    </PrivateRoute>
  );
};

export default MainLayout;
