import type { FC } from "react";
import { useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useLoadInstitutionStudents } from "../hooks/useLoadInstitutionStudents";
import { useDonateCoins } from "../hooks/useDonateCoins";
import type { IInstitutionStudent } from "../types/IReward";
import { DONATION_PAGE_TEXT } from "../utils/constants";
import {
  ActionsRow,
  Container,
  ContentRow,
  FormCard,
  HeaderWrapper,
  HelperCard,
  StyledTextField,
  Subtitle,
  Title,
} from "./styles/DonationPage.styled";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const DonationPage: FC = () => {
  const { data: students, isLoading, error, refetch } =
    useLoadInstitutionStudents();
  const { mutateAsync: donateCoins, isPending } = useDonateCoins();

  const [selectedStudent, setSelectedStudent] =
    useState<IInstitutionStudent | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [errors, setErrors] = useState({
    student: "",
    amount: "",
    reason: "",
  });
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const options = useMemo(() => students ?? [], [students]);
  const noStudents = !isLoading && options.length === 0;

  const validate = () => {
    const newErrors = {
      student: selectedStudent ? "" : "Selecione um aluno.",
      amount:
        amount && Number(amount) > 0 ? "" : "Informe um valor maior que zero.",
      reason: reason.trim() ? "" : "Descreva o motivo da doação.",
    };

    setErrors(newErrors);
    return Object.values(newErrors).some((msg) => msg.length > 0);
  };

  const handleSubmit = async () => {
    const hasErrors = validate();
    if (hasErrors || !selectedStudent) return;

    try {
      await donateCoins({
        studentId: selectedStudent.id,
        amount: Number(amount),
        reason: reason.trim(),
      });

      setSnackbar({
        open: true,
        message: DONATION_PAGE_TEXT.feedback.success,
        severity: "success",
      });

      setSelectedStudent(null);
      setAmount("");
      setReason("");
      await refetch();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: DONATION_PAGE_TEXT.feedback.error,
        severity: "error",
      });
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <Title variant="h5">{DONATION_PAGE_TEXT.title}</Title>
        <Subtitle variant="body2">{DONATION_PAGE_TEXT.subtitle}</Subtitle>
      </HeaderWrapper>

      <ContentRow>
        <FormCard elevation={2}>
          {error && (
            <Alert severity="error">
              Não foi possível carregar os alunos. Tente novamente.
            </Alert>
          )}

          <Autocomplete
            options={options}
            value={selectedStudent}
            onChange={(_, value) => {
              setSelectedStudent(value);
              setErrors((prev) => ({ ...prev, student: "" }));
            }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={isLoading}
            noOptionsText={
              noStudents
                ? DONATION_PAGE_TEXT.emptyStudents
                : DONATION_PAGE_TEXT.loadingStudents
            }
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label={DONATION_PAGE_TEXT.fields.student}
                error={Boolean(errors.student)}
                helperText={errors.student}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <StyledTextField
            label={DONATION_PAGE_TEXT.fields.amount}
            type="number"
            value={amount}
            onChange={(e) => {
              const sanitized = e.target.value.replace(/\D/g, "");
              setAmount(sanitized);
              setErrors((prev) => ({ ...prev, amount: "" }));
            }}
            inputProps={{ min: 1 }}
            error={Boolean(errors.amount)}
            helperText={errors.amount}
          />

          <StyledTextField
            label={DONATION_PAGE_TEXT.fields.reason}
            multiline
            minRows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setErrors((prev) => ({ ...prev, reason: "" }));
            }}
            error={Boolean(errors.reason)}
            helperText={errors.reason}
          />

          <ActionsRow>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isPending || isLoading || noStudents}
            >
              {isPending ? "Enviando..." : DONATION_PAGE_TEXT.actions.donate}
            </Button>
          </ActionsRow>
        </FormCard>

        <HelperCard elevation={1}>
          <Typography variant="subtitle1" fontWeight={700}>
            {DONATION_PAGE_TEXT.helperTitle}
          </Typography>
          <List dense>
            {DONATION_PAGE_TEXT.helperItems.map((item) => (
              <ListItem key={item} disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          {noStudents && (
            <Box>
              <Alert severity="info">{DONATION_PAGE_TEXT.emptyStudents}</Alert>
            </Box>
          )}
        </HelperCard>
      </ContentRow>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DonationPage;

