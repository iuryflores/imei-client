import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");
    };

    logout();
  }, [navigate]);

  return <div>Logout</div>;
};

export default Logout;
