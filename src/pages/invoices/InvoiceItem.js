import React from "react";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { TableRow, TableCell, IconButton } from "@material-ui/core";
import moment from "moment";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../../features/invoiceSlice";
import { toast } from "react-toastify";

const InvoiceItem = ({
  _id,
  editInvoice,
  client,
  dueDate,
  openInvoice,
  invoiceNumber,
  status,
  total,
  currency,
}) => {
  const dispatch = useDispatch();

  const toCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleDelete = (id) => {
    dispatch(deleteInvoice({ id, toast }));
  };
  const tableStyle = {
    width: 160,
    fontSize: 14,
    cursor: "pointer",
    borderBottom: "none",
    padding: "8px",
    textAlign: "center",
  };

  function checkStatus(status) {
    return status === "Partial"
      ? {
          border: "solid 0px #1976d2",
          backgroundColor: "#baddff",
          padding: "8px 18px",
          borderRadius: "20px",
        }
      : status === "Paid"
      ? {
          border: "solid 0px green",
          backgroundColor: "#a5ffcd",
          padding: "8px 18px",
          borderRadius: "20px",
        }
      : status === "Unpaid"
      ? {
          border: "solid 0px red",
          backgroundColor: "#ffaa91",
          padding: "8px 18px",
          borderRadius: "20px",
        }
      : "red";
  }

  return (
    <TableRow key={_id} style={{ cursor: "pointer" }}>
      <TableCell style={tableStyle} onClick={() => openInvoice(_id)}>
        {invoiceNumber}
      </TableCell>
      <TableCell style={tableStyle} onClick={() => openInvoice(_id)}>
        {client?.name}{" "}
      </TableCell>
      <TableCell style={tableStyle} onClick={() => openInvoice(_id)}>
        {currency} {total ? toCommas(total) : total}{" "}
      </TableCell>
      <TableCell style={tableStyle} onClick={() => openInvoice(_id)}>
        {moment(dueDate).fromNow()}{" "}
      </TableCell>
      <TableCell style={tableStyle} onClick={() => openInvoice(_id)}>
        <button style={checkStatus(status)}>{status}</button>
      </TableCell>

      <TableCell style={{ ...tableStyle, width: "10px" }}>
        <IconButton onClick={() => editInvoice(_id)}>
          <BorderColorIcon style={{ width: "20px", height: "20px" }} />
        </IconButton>
      </TableCell>
      <TableCell style={{ ...tableStyle, width: "10px" }}>
        <IconButton onClick={() => handleDelete(_id)}>
          <DeleteOutlineRoundedIcon style={{ width: "20px", height: "20px" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default InvoiceItem;
