import React from "react";
import { useContext } from "react";
import { DataContext } from "../store/GlobalState";
// import Toast from "./Toast";
import Loading from "./Loading";
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";

const Notify = () => {
  const { state, dispatch } = useContext(DataContext);
  const { notify } = state;
  return (
    <>
      {notify.loading && <Loading />}
      {notify.error && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={true}
          autoHideDuration={3000}
          onClose={() => dispatch({ type: "NOTIFY", payload: {} })}
        >
          <Alert
            variant="filled"
            severity="error"
            onClose={() => dispatch({ type: "NOTIFY", payload: {} })}
          >
            Lỗi: {notify.error}
          </Alert>
        </Snackbar>
      )}
      {notify.success && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={true}
          autoHideDuration={3000}
          onClose={() => dispatch({ type: "NOTIFY", payload: {} })}
        >
          <Alert
            variant="filled"
            severity="success"
            onClose={() => dispatch({ type: "NOTIFY", payload: {} })}
          >
            {notify.success}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Notify;
