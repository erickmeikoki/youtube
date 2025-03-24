import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: "calc(100vh - 64px)", // Subtract navbar height
}));

const PagePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 500,
}));

const PageWrapper = ({
  children,
  loading,
  error,
  onRetry,
  title,
  maxWidth = "lg",
}) => {
  return (
    <PageContainer maxWidth={maxWidth}>
      {title && <PageTitle variant="h4">{title}</PageTitle>}

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        >
          {error}
        </Alert>
      ) : (
        <PagePaper>{children}</PagePaper>
      )}
    </PageContainer>
  );
};

export default PageWrapper;
