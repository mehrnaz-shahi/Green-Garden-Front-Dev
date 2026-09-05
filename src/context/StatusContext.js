import React, { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { get_for_user } from "../services/api";
export const StatusContext = createContext(null);

export const StatusProvider = ({ children }) => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [result, setResult] = useState({});
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("usual");

  useEffect(() => {
    const fetch = async () => {
      const res = await get_for_user("accounts/get-user/", cookies["token"]);
      setResult(res);
      setError(res);
    };
    fetch();
  }, [cookies["token"]]);

  useEffect(() => {
    if (error === 401) {
      setStatus("usual");
    } else if (result && result.is_garden_owner) {
      setStatus("garden_owner");
    } else if (result) {
      setStatus("user");
    }
  }, [result, error, cookies["token"]]);

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
};
