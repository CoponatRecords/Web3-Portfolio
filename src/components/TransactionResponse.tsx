import { Button, Box, Typography } from "@mui/material";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import { useEffect } from "react";
import { motion } from "framer-motion";

type BodyProps = {
  body: string;
};

export const TransactionSucces = ({ body }: BodyProps) => {
  useEffect(() => {
    enqueueSnackbar(body, {
      autoHideDuration: 3000,
      variant: "info",
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
      style: {
        background: "rgba(255, 255, 255, 0.05)",
        color: "#ffffff",
        borderRadius: 1,
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
        fontSize: "1rem",
      },
      action: (key) => (
        <Button
          onClick={() => closeSnackbar(key)}
          sx={{
            borderRadius: 1,
            background: "linear-gradient(90deg, #6200ea 0%, #304ffe 100%)",
            color: "#ffffff",
            "&:hover": {
              background: "linear-gradient(90deg, #7f39fb 0%, #3f51b5 100%)",
            },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            px: 2,
          }}
        >
          Dismiss
        </Button>
      ),
    });
  }, [body]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: 1,
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            fontWeight: "bold",
            color: "#ffffff",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          Transaction Sent Successfully!
        </Typography>
      </Box>
    </motion.div>
  );
};

export const TransactionFail = ({ body }: BodyProps) => {
  useEffect(() => {
    enqueueSnackbar(body, {
      autoHideDuration: 3000,
      variant: "warning",
      preventDuplicate: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
      style: {
        background: "rgba(255, 255, 255, 0.05)",
        color: "#f44336",
        borderRadius: 1,
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
        fontSize: "1rem",
      },
      action: (key) => (
        <Button
          onClick={() => closeSnackbar(key)}
          sx={{
            borderRadius: 1,
            background: "linear-gradient(90deg, #6200ea 0%, #304ffe 100%)",
            color: "#ffffff",
            "&:hover": {
              background: "linear-gradient(90deg, #7f39fb 0%, #3f51b5 100%)",
            },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            px: 2,
          }}
        >
          Dismiss
        </Button>
      ),
    });
  }, [body]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: 1,
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            fontWeight: "bold",
            color: "#f44336",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          Transaction Failed!
        </Typography>
      </Box>
    </motion.div>
  );
};
