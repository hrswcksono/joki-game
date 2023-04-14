import React from "react";
import { Outlet } from "react-router-dom";

const Order = () => {
  return (
    <div className="container padding-top">
      <Outlet></Outlet>
    </div>
  );
};

export default Order;