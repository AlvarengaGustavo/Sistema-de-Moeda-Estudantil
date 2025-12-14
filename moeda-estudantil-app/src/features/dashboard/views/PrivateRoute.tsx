import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { BrowserApi } from "../../../shared/BrowserApi/BrowserApi";
import { useLoginSlice } from "../../login/hooks/useLoginSlice";
import { useLoadUserInfo } from "../../login/hooks/useLoadUserInfo";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = BrowserApi.getToken();
  const navigate = useNavigate();

  const { authenticatedUser, setAuthenticatedUser } = useLoginSlice();
  const { isLoading, error, refetch } = useLoadUserInfo();

  useEffect(() => {
    if (token && !authenticatedUser) {
      refetch()
        .then((res) => {
          if (res.data) {
            setAuthenticatedUser(res.data);
          } else {
            throw new Error("No user");
          }
        })
        .catch(() => {
          BrowserApi.clearToken();
          navigate("/login", { replace: true });
        });
    }
  }, [authenticatedUser, navigate, refetch, setAuthenticatedUser, token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!authenticatedUser || isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    BrowserApi.clearToken();
    return <Navigate to="/login" replace />;
  }

  return children;
};
