/* eslint-disable */
import React, { useState, useEffect } from "react";
import { SEO } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, NoData } from "../../components";
import { getClientsByUser } from "../../features/clientSlice";
import Clients from "./Clients";
import AddClient from "./AddClient";

function ClientList() {
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?._id;
  const { userClients, loading } = useSelector((state) => state.client);
  useEffect(() => {
    dispatch(getClientsByUser(userId));
  }, [currentId, userId]);

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

  if (userClients.length === 0) {
    return (
      <>
        <SEO
          title={` ${
            user?.result?.name.split(" ")[0]
          } , You don't have any Clients Yet`}
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
            No customers yet. Click the plus icon to add customer
          </p>
        </div>
      </>
    );
  }

  return (
    <React.Fragment>
      <SEO
        title={` ${user?.result?.name.split(" ")[0]} , Checkout your ${
          userClients.length
        } Client${userClients.length > 1 ? "s" : ""}`}
      />
      <div>
        <AddClient
          open={open}
          setOpen={setOpen}
          currentId={currentId}
          setCurrentId={setCurrentId}
        />
        <Clients
          open={open}
          setOpen={setOpen}
          currentId={currentId}
          setCurrentId={setCurrentId}
          userClients={userClients}
        />
      </div>
    </React.Fragment>
  );
}

export default ClientList;
