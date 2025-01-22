import { Styled, TableRow } from "@mui/material";

const TableRowStyled = Styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableRow = ({ children }) => {
  return <TableRowStyled>{children}</TableRowStyled>;
};

export default StyledTableRow;
