import { useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import axios from "axios";

const GlobalState = (props) => {
  const [paid, setPaid] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // ! set through ssr
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const getUserData = async () => {
    const url = "http://localhost:8000/api/user";
    const resp = await axios.get(url, {});
    console.log(resp);
    setEmail(resp.data.email);
    setUsername(resp.data.username);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${resp.data.access_token}`;
  };

  useEffect(() => {
    if (loggedIn) {
      getUserData();
    }
  }, [loggedIn]);
  return (
    <GlobalContext.Provider
      value={{
        username,
        email,
        paid,
        setPaid,
        loggedIn,
        updateLoggedIn: (value) => {
          setLoggedIn(value);
        },
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalState;
// todo: add more features to allow the user more freedom
