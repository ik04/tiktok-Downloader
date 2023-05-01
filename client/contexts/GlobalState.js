import { useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import axios from "axios";

const GlobalState = (props) => {
  const [paid, setPaid] = useState(false);

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
    getUserData();
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        paid,
        setPaid,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalState;
// todo: add more features to allow the user more freedom
