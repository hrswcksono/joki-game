import React from "react";
import { Outlet } from "react-router-dom";
import './styles.css'

const Order = () => {
  return (
    <div className="container padding-top text-white">
      <Outlet></Outlet>
    </div>
  );
};

export default Order;
