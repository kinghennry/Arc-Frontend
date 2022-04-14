import React from "react";
import { useDispatch } from "react-redux";
import { Button, TableRow, TableCell, IconButton } from "@material-ui/core";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import { deleteClient } from "../../features/clientSlice";
import { toast } from "react-toastify";

const ClientItem = ({ _id, name, index, email, phone, handleEdit }) => {
  const dispatch = useDispatch();
  const tableStyle = {
    width: 160,
    fontSize: 14,
    cursor: "pointer",
    borderBottom: "none",
    padding: "8px",
    textAlign: "center",
  };
  const handleDelete = (id) => {
    dispatch(deleteClient({ id, toast }));
  };
  return (
    <TableRow key={_id} styel={{ cursor: "pointer" }}>
      <TableCell style={{ ...tableStyle, width: "10px" }}>
        {index + 1}
      </TableCell>
      <TableCell style={tableStyle} scope="row">
        <Button style={{ textTransform: "none" }}> {name} </Button>
      </TableCell>
      <TableCell style={tableStyle}>{email}</TableCell>
      <TableCell style={tableStyle}>{phone}</TableCell>
      <TableCell style={{ ...tableStyle, width: "10px" }}>
        <IconButton onClick={() => handleEdit(_id)}>
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

export default ClientItem;
