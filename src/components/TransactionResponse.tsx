import { Button } from "@mui/material";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import { useEffect } from "react";

type BodyProps = {
  body: string;
};

export const TransactionSucces = ({ body }: BodyProps) => {
  useEffect(() => {
    enqueueSnackbar(body, {
      autoHideDuration: 7000,
      variant: "info",
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
      action: (key) => (
        <Button color="success" onClick={() => closeSnackbar(key)}>
          Dismiss
        </Button>
      ),
    });
  }, [body]);

  return (
    <div>
      Transaction Sent Successfully!
    </div>
  );
};

export const TransactionFail = ({ body }: BodyProps) => {
  useEffect(() => {
    enqueueSnackbar(body, {
      autoHideDuration: 7000,
      variant: "warning",
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
      action: (key) => (
        <Button color="error" onClick={() => closeSnackbar(key)}>
          Dismiss
        </Button>
      ),
    });
  }, [body]);

  return (
    <div style={{ color: "red" }}>
      Transaction Failed!
    </div>
  );
};
