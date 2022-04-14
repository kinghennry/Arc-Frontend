import React, { useState, useEffect } from "react";
import styles from "./Invoice.module.css";
import { SEO } from "../../components";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import { toCommas } from "../../utils/utils";
import SaveIcon from "@material-ui/icons/Save";
import currencies from "../../currencies.json";
import AddClient from "./AddClient";
import { initialState } from "../../initialState";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import {
  Container,
  TextField,
  Grid,
  Typography,
  TableContainer,
  TableCell,
  Table,
  InputBase,
  TableHead,
  TableBody,
  TableRow,
  Divider,
  Button,
  Paper,
  IconButton,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import InvoiceType from "./InvoiceType";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { toast } from "react-toastify";
import {
  createInvoice,
  updateInvoice,
  getInvoice,
} from "../../features/invoiceSlice";
import { getClientsByUser } from "../../features/clientSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  table: {
    minWidth: 650,
  },

  headerContainer: {
    // display: 'flex'
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(1),
  },
}));

function Invoice() {
  const [invoiceData, setInvoiceData] = useState(initialState);
  const [rates, setRates] = useState(0);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [vat, setVat] = useState(0);
  const [currency, setCurrency] = useState(currencies[0].value);
  const [subTotal, setSubTotal] = useState(0);
  const [client, setClient] = useState(null);
  const [type, setType] = useState("Invoice");
  const [total, setTotal] = useState(0);
  const today = new Date();
  const [status, setStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    today.getTime() + 7 * 24 * 60 * 60 * 1000
  );
  const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();
  const userId = user?.result?._id;
  const { userClients } = useSelector((state) => state.client);
  const { error, invoice } = useSelector((state) => ({
    ...state.invoice,
  }));
  const { id } = useParams();

  useEffect(() => {
    dispatch(getInvoice(id));
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (invoice) {
      //Automatically set the default invoice values as the ones in the invoice to be updated
      setInvoiceData(invoice);
      setRates(invoice.rates);
      setClient(invoice.client);
      setType(invoice.type);
      setStatus(invoice.status);
      setSelectedDate(invoice.dueDate);
    }
  }, [invoice]);

  const clients = userClients;

  useEffect(() => {
    dispatch(getClientsByUser(userId));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  const history = useHistory();

  useEffect(() => {
    if (type === "Receipt") {
      setStatus("Paid");
    } else {
      setStatus("Unpaid");
    }
  }, [type]);

  const defaultProps = {
    options: currencies,
    getOptionLabel: (option) => option.label,
  };

  const clientsProps = {
    options: clients,
    getOptionLabel: (option) => option.name,
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRates = (e) => {
    setRates(e.target.value);
    setInvoiceData((prevState) => ({ ...prevState, tax: e.target.value }));
  };

  // Change handler for dynamically added input field
  const handleChange = (index, e) => {
    const values = [...invoiceData.items];
    values[index][e.target.name] = e.target.value;
    setInvoiceData({ ...invoiceData, items: values });
  };

  useEffect(() => {
    //Get the subtotal
    const subTotal = () => {
      var arr = document.getElementsByName("amount");
      var subtotal = 0;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].value) {
          subtotal += +arr[i].value;
        }
        // document.getElementById("subtotal").value = subtotal;
        setSubTotal(subtotal);
      }
    };

    subTotal();
  }, [invoiceData]);

  useEffect(() => {
    const total = () => {
      //Tax rate is calculated as (input / 100 ) * subtotal + subtotal
      const overallSum = (rates / 100) * subTotal + subTotal;
      //VAT is calculated as tax rates /100 * subtotal
      setVat((rates / 100) * subTotal);
      setTotal(overallSum);
    };
    total();
  }, [invoiceData, rates, subTotal]);

  const handleAddField = (e) => {
    e.preventDefault();
    setInvoiceData((prevState) => ({
      ...prevState,
      items: [
        ...prevState.items,
        { itemName: "", unitPrice: "", quantity: "", discount: "", amount: "" },
      ],
    }));
  };

  const handleRemoveField = (index) => {
    const values = invoiceData.items;
    values.splice(index, 1);
    setInvoiceData((prevState) => ({ ...prevState, values }));
    // console.log(values)
  };

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedInvoiceData = {
      ...invoiceData,
      subTotal: subTotal,
      total: total,
      vat: vat,
      rates: rates,
      currency: currency,
      dueDate: selectedDate,
      client,
      type: type,
      status: status,
    };
    if (id) {
      console.log("updated");
      dispatch(updateInvoice({ id, updatedInvoiceData, toast }));
      history.push("/invoices");
    } else {
      dispatch(createInvoice({ updatedInvoiceData, history, toast }));
    }
  };

  const CustomPaper = (props) => {
    return <Paper elevation={3} {...props} />;
  };

  return (
    <React.Fragment>
      <SEO title="Create Invoice" />
      <div className={styles.invoiceLayout}>
        <form onSubmit={handleSubmit} className="mu-form">
          <AddClient setOpen={setOpen} open={open} />
          <Container className={classes.headerContainer}>
            <Grid container justifyContent="space-between">
              <Grid item>
                {/* <Avatar alt="Logo" variant='square' src="" className={classes.large} /> */}
              </Grid>
              <Grid item>
                <InvoiceType type={type} setType={setType} />
                <Typography variant="overline" style={{ color: "gray" }}>
                  Invoice#:{" "}
                </Typography>
                <InputBase defaultValue={invoiceData.invoiceNumber} />
              </Grid>
            </Grid>
          </Container>
          <Divider />
          <Container>
            <Grid
              container
              //   justifyContent="space-between"
              style={{ marginTop: "40px" }}
              className="client__grid"
            >
              <Grid item style={{ width: "50%" }} className="grd-width">
                <Container>
                  <Typography
                    variant="overline"
                    style={{ color: "gray", paddingRight: "3px" }}
                    gutterBottom
                  >
                    Bill to
                  </Typography>
                  {client && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        {client.name}
                      </Typography>
                      <Typography variant="body2">{client.email}</Typography>
                      <Typography variant="body2">{client.phone}</Typography>
                      <Typography variant="body2">{client.address}</Typography>
                      <Button
                        color="primary"
                        size="small"
                        style={{ textTransform: "none" }}
                        onClick={() => setClient(null)}
                      >
                        Change
                      </Button>
                    </>
                  )}
                  <div
                    style={client ? { display: "none" } : { display: "block" }}
                  >
                    <Autocomplete
                      {...clientsProps}
                      PaperComponent={CustomPaper}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // required={!invoice && true}
                          label="Select Customer"
                          margin="normal"
                          variant="outlined"
                        />
                      )}
                      value={clients?.name}
                      onChange={(event, value) => setClient(value)}
                    />
                  </div>
                </Container>
              </Grid>
              {/* <Grid item style={{ marginRight: 20, textAlign: "right" }}> */}
              <Grid item className="grid__status">
                <Typography
                  variant="overline"
                  style={{ color: "gray" }}
                  gutterBottom
                >
                  Status
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  style={{ color: type === "Receipt" ? "green" : "red" }}
                >
                  {type === "Receipt" ? "Paid" : "Unpaid"}
                </Typography>
                <Typography
                  variant="overline"
                  style={{ color: "gray" }}
                  gutterBottom
                >
                  Date
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {moment().format("MMM Do YYYY")}
                </Typography>
                <Typography
                  variant="overline"
                  style={{ color: "gray" }}
                  gutterBottom
                >
                  Due Date
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedDate
                    ? moment(selectedDate).format("MMM Do YYYY")
                    : "4th Apr 2022"}
                </Typography>
                <Typography variant="overline" gutterBottom>
                  Amount
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {currency} {toCommas(total)}
                </Typography>
              </Grid>
            </Grid>
          </Container>
          <div>
            <TableContainer component={Paper} className="tb-container">
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Disc(%)</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceData?.items.map((itemField, index) => (
                    <TableRow key={index}>
                      <TableCell scope="row" style={{ width: "40%" }}>
                        {" "}
                        <InputBase
                          style={{ width: "100%" }}
                          outline="none"
                          sx={{ ml: 1, flex: 1 }}
                          type="text"
                          name="itemName"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.itemName}
                          placeholder="Item name or description"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="quantity"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.quantity}
                          placeholder="0"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="unitPrice"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.unitPrice}
                          placeholder="0"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="discount"
                          onChange={(e) => handleChange(index, e)}
                          value={itemField.discount}
                          placeholder="0"
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="amount"
                          onChange={(e) => handleChange(index, e)}
                          value={
                            itemField.quantity * itemField.unitPrice -
                            (itemField.quantity *
                              itemField.unitPrice *
                              itemField.discount) /
                              100
                          }
                          disabled
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleRemoveField(index)}>
                          <DeleteOutlineRoundedIcon
                            style={{ width: "20px", height: "20px" }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className={styles.addButton}>
              <button onClick={handleAddField}>+</button>
            </div>
          </div>
          <div className={styles.invoiceSummary}>
            <div className={styles.summary}>Invoice Summary</div>
            <div className={styles.summaryItem}>
              <p>Sub total:</p>
              <h4>{subTotal}</h4>
            </div>
            <div className={styles.summaryItem}>
              <p>VAT(%):</p>
              <h4>{vat}</h4>
            </div>
            <div className={styles.summaryItem}>
              <p>Total</p>
              <h4
                style={{ color: "black", fontSize: "18px", lineHeight: "8px" }}
              >
                {currency} {toCommas(total)}
              </h4>
            </div>
          </div>

          <div className={styles.toolBar}>
            <Container>
              <Grid container>
                <Grid item style={{ marginTop: "16px", marginRight: 10 }}>
                  <TextField
                    type="text"
                    step="any"
                    name="rates"
                    id="rates"
                    value={rates}
                    onChange={handleRates}
                    placeholder="e.g 10"
                    label="Tax Rates(%)"
                  />
                </Grid>
                <Grid item style={{ marginRight: 10 }}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-dialog"
                      label="Due date"
                      format="MM/dd/yyyy"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item style={{ width: 270, marginRight: 10 }}>
                  <Autocomplete
                    {...defaultProps}
                    id="debug"
                    debug
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select currency"
                        margin="normal"
                      />
                    )}
                    value={currency.value}
                    onChange={(event, value) => setCurrency(value.value)}
                  />
                </Grid>
              </Grid>
            </Container>
          </div>

          <div className={styles.note}>
            <h4>Notes/Terms</h4>
            <textarea
              placeholder="Provide additional details or terms of service"
              onChange={(e) =>
                setInvoiceData({ ...invoiceData, notes: e.target.value })
              }
              value={invoiceData.notes}
            />
          </div>

          <Grid container justifyContent="center">
            <Button
              variant="contained"
              style={{ justifyContentContent: "center" }}
              type="submit"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<SaveIcon />}
            >
              Save and Continue
            </Button>
          </Grid>
        </form>
      </div>
    </React.Fragment>
  );
}

export default Invoice;
