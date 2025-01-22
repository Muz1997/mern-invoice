import { Divider, Styled } from "@mui/material";

const DividerStyle = Styled(Divider)({
  width: "50%",
  marginTop: "10px",
  marginBottom: "15px",
  marginLeft: "auto",
  marginRight: "auto",
  height: "3px",
  backgroundImage:
    "linear-gradient(to right,rgba(0,0,0,0),rgba(9,84,132),rgba(0,0,0,0))",
});

const StyleDivider = () => {
  return <DividerStyle />;
};

export default StyleDivider;
