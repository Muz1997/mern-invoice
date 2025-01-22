import { Box, CSSBaseline, Typography } from "@material-ui/core";
import { FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" sx={{ colorNames: "#fffffF" }} align="center">
      {"Copyright ©"}
      <Link color="inherit" href="#">
        MERN INVOICE
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

const Footer = () => {
  return (
    <Box sx={{ position: "fixed", bottom: 0, width: "100%" }}>
      <CSSBaseline />
      <Box
        component="footer"
        sx={{
          px: 1,
          py: 1,
          mt: auto,
          bgcolor: "#000000",
        }}
      >
        <Typography
          variant="subtitle1"
          align="center"
          component="p"
          sx={{ color: "#07f011" }}
        >
          {" "}
          <FaMoneyBillWave />
          Because we care about your money <FaMoneyBillWave />
        </Typography>
        <Copyright />
      </Box>
    </Box>
  );
};

export default Footer;
