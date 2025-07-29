import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";


const initialUserState = {
  name: "",
  email: "",
  password: "",
  profilePicture: "",
  addresses: [], // updated: as an array
  phone: "",
};

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(initialUserState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // new: loading state

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/validate`, {
          withCredentials: true,
        });
        setUser(response.data.user);
        setIsAuthenticated(true);
        // console.log("User validated:", response.data.user);
      } catch (error) {
        setUser(initialUserState);
        setIsAuthenticated(false);
        console.error(
          "User validation failed:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const updateUser = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const setFullUser = (userData) => {
    setUser(userData);
  };

  const resetUser = () => {
    setUser(initialUserState);
    setIsAuthenticated(false);
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      // Optionally handle error
    }
    setUser(initialUserState);
    setIsAuthenticated(false);
  };

  // optimize: memoize context value
  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      updateUser,
      setFullUser,
      resetUser,
      isAuthenticated,
      loading, // added to context
      logout,
    }),
    [user, isAuthenticated, loading]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);
export { UserProvider, useUser, UserContext };
