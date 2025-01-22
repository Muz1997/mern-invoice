import { Box } from "@material-ui/core";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
