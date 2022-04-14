/* eslint-disable */
import React, { useEffect, useState } from "react";
import { SEO } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, NoData } from "../../components";
import { getInvoicesbyuser } from "../../features/invoiceSlice";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Paper,
  Table,
  TableBody,
  TableRow,
  TablePagination,
  TableCell,
  TableHead,
  TableContainer,
  TableFooter,
  IconButton,
  Container,
} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { useLocation } from "react-router-dom";
import InvoiceItem from "./InvoiceItem";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles((theme) => ({
  table: {
    minWidth: 500,
  },

  tablecell: {
    fontSize: "16px",
  },
}));

const headerStyle = { borderBottom: "none", textAlign: "center" };

const Invoices = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const classes = useStyles2();
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInvoices, loading } = useSelector((state) => state.invoice);
  const rows = userInvoices;
  const userId = user?.result?._id;
  useEffect(() => {
    dispatch(getInvoicesbyuser(userId));
    // eslint-disable-next-line
  }, [userId, location, dispatch]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rows.length);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const editInvoice = (id) => {
    history.push(`/edit/invoice/${id}`);
  };

  const openInvoice = (id) => {
    history.push(`/invoice/${id}`);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          paddingTop: "20px",
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      // add seo
      <>
        <SEO
          title={` ${
            user?.result?.name.split(" ")[0]
          } , You don't have any Invoices Yet`}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            paddingTop: "20px",
            margin: "80px",
          }}
        >
          <NoData />
          <p style={{ padding: "40px", color: "gray", textAlign: "center" }}>
            No invoice yet. Click the plus icon to create invoice
          </p>
        </div>
      </>
    );
  }

  return (
    <React.Fragment>
      <SEO
        title={` ${user?.result?.name.split(" ")[0]}, Checkout your ${
          userInvoices.length
        } Invoice${userInvoices.length > 1 ? "s" : ""}`}
      />
      <div>
        <Container
          style={{
            width: "85%",
            paddingTop: "70px",
            paddingBottom: "50px",
            border: "none",
          }}
        >
          <TableContainer component={Paper} elevation={0}>
            <Table
              className={classes.table}
              aria-label="custom pagination table"
            >
              <TableHead>
                <TableRow>
                  <TableCell style={headerStyle}>Number</TableCell>
                  <TableCell style={headerStyle}>Client</TableCell>
                  <TableCell style={headerStyle}>Amount</TableCell>
                  <TableCell style={headerStyle}>Due Date</TableCell>
                  <TableCell style={headerStyle}>Status</TableCell>
                  <TableCell style={headerStyle}>Edit</TableCell>
                  <TableCell style={headerStyle}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row, index) => (
                  <InvoiceItem
                    editInvoice={editInvoice}
                    openInvoice={openInvoice}
                    key={row._id}
                    {...row}
                  />
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={6}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Invoices;
