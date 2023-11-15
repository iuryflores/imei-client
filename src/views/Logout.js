import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const userToken = localStorage.getItem("token");

  const [loggedIn, setLoggedIn] = useState(!!userToken);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    logout();
  });

  return <div>Logout</div>;
};

export default Logout;
