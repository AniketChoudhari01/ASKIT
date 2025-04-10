import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/validate", {
          withCredentials: true,
        });
        console.log("User is logged in:", response.data);
        setUser(response.data.user);
      } catch (error) {
        console.log("User validation failed");
        setUser(null);
      }
    };

    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
