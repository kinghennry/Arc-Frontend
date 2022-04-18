import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_API });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

//*auth
export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
export const googleSignIn = (result) => API.post("/user/googleSignin", result);

//clients
//getClientsByUser
export const getClientsByUser = (userId) =>
  API.get(`/clients/userClients/${userId}`);

//createClient
export const createClient = (clientData) => API.post("/clients", clientData);

//delete client
export const deleteClient = (id) => API.delete(`/clients/${id}`);

//edit client
export const updateClient = (clientData, id) =>
  API.patch(`/clients/${id}`, clientData);

//*invoice
//create invoice
export const addInvoice = (updatedInvoiceData) =>
  API.post("/invoices", updatedInvoiceData);

//getUserInvoice.
export const getUserInvoices = (userId) =>
  API.get(`/invoices/creator/${userId}`);

//getinvoice.
export const getInvoice = (id) => API.get(`/invoices/${id}`);

//updateinvoice
export const updateInvoice = (updatedInvoiceData, id) =>
  API.patch(`/invoices/${id}`, updatedInvoiceData);

//deleteinvoice
export const deleteInvoice = (id) => API.delete(`/invoices/${id}`);

//profiles
//createProfile
// export const createProfile = (updatedFormData) =>
//   API.post("/profiles", updatedFormData);
//getProfilesByUser

// export const getProfileByUser = (userId) =>
//   API.get(`/profiles/creator/${userId}`);

//edit profile
// export const updateProfile = (updatedFormData, id) =>
//   API.patch(`/profiles/${id}`, updatedFormData);
