import { useState } from "react";
import { GlobalContext } from "./GlobalContext";
import axios from "axios";

const GlobalState = (props) => {
  const [paid, setPaid] = useState(false);
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
