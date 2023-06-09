import axios from "axios";
import Swal from "sweetalert2";

const URL = "http://localhost:3000/user";
const token = localStorage.getItem("access_token");

const loginUser = async (user) => {
  try {
    let result = await axios({
      method: "POST",
      url: URL + "/login",
      data: user,
    });

    const access_token = result.data;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("role", "user");

    Swal.fire("Berhasil Login", "Login Success", "success");
    // cb(result.data);
  } catch (error) {
    console.log(error);
  }
};

const registerUser = async (user) => {
  try {
    let register = await axios({
      method: "POST",
      url: URL + "/create",
      data: user,
      headers: { "Content-Type": "multipart/form-data" },
    });
    Swal.fire("Berhasil Register", "Register Success", "success");
    // cb(register.data);
    console.log(register.data);
  } catch (error) {
    console.log(error);
  }
};

const detailUser = async (cb) => {
  try {
    let result = await axios({
      method: "GET",
      url: URL + "/profile",
      headers: {
        access_token: token,
      },
    });

    console.log(result.data);
    cb(result.data);
  } catch (error) {
    console.log(error);
  }
};

const listOrder = async (cb) => {
  try {
    let result = await axios({
      method: "GET",
      url: URL + "/order",
      headers: {
        access_token: token,
      },
    });
    cb(result.data);
  } catch (error) {
    console.log(error);
  }
};

const detailOrder = async (id, cb) => {
  try {
    let result = await axios({
      method: "GET",
      url: URL + "/order/" + id,
      headers: {
        access_token: token,
      },
    });
    cb(result.data);
  } catch (error) {
    console.log(error);
  }
};

const deleteOrder = async (id) => {
  try {
    let result = await axios({
      method: "DELETE",
      url: URL + "/order/" + id,
      headers: {
        access_token: token,
      },
    });
    Swal.fire("Berhasil Delete", `Delete order ${id} Success`, "success");
  } catch (error) {
    console.log(error);
  }
};

const editUser = async (user) => {
  const headers = {
    access_token: token,
    "Content-Type": "multipart/form-data",
  };
  try {
    let result = await axios({
      method: "PUT",
      url: URL + "/edit",
      data: user,
      headers: headers,
    });
    console.log(result);
    Swal.fire("Berhasil Edit Profile", "Edit Profile Success", "success");
  } catch (error) {
    console.log(error);
  }
};

const addOrder = async (id) => {
  try {
    let result = await axios({
      method: "POST",
      url: URL + "/createorder/" + id,
      headers: {
        access_token: token,
      },
    });
    console.log(result)
    Swal.fire("Berhasil Order", "Order Success", "success");
  } catch (error) {
    console.log(error);
  }
};

const allListPaket = async (cb) => {
  try {
    let result = await axios({
      method: "GET",
      url: URL + "/listpaket",
    });
    cb(result.data);
  } catch (error) {
    console.log(error);
  }
};

const rateOrderDone = async (id, rate) => {
  try {
    let result = await axios({
      method: "PUT",
      url: URL + "/orderrate/" + id,
      data: rate,
      headers: {
        access_token: token,
      },
    });
    console.log(result)
    Swal.fire("Berhasil Rate Order", "Rate Order Success", "success");
  } catch (error) {
    console.log(error)
  }
} 

export {
  loginUser,
  registerUser,
  detailUser,
  listOrder,
  detailOrder,
  deleteOrder,
  editUser,
  addOrder,
  allListPaket,
  rateOrderDone
};
