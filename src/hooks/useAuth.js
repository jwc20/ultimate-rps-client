import * as React from "react";
import { AuthContext } from "../auth/AuthContext";

function useAuth() {
  return React.useContext(AuthContext);
}

export { useAuth };