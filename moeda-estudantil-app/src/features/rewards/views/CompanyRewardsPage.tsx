import type { FC } from "react";
import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CardActions,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import { useLoadCompanyRewards } from "../hooks/useLoadCompanyRewards";
import { useCreateCompanyReward } from "../hooks/useCreateCompanyReward";
import { useUpdateCompanyReward } from "../hooks/useUpdateCompanyReward";
import type { IReward } from "../types/IReward";
import { COMPANY_REWARDS_TEXT } from "../utils/companyRewardsConstants";
import {
  ActionsRow,
  CardsGrid,
  Container,
  HeaderWrapper,
  RewardCard,
  RewardCardContent,
  StyledTextField,
} from "./styles/CompanyRewardsPage.styled";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

type FormState = {
  id?: string;
  name: string;
  description: string;
  amount: string;
  imageUrl: string;
  isActive: boolean;
};

const defaultFormState: FormState = {
  name: "",
  description: "",
  amount: "",
  imageUrl: "",
  isActive: true,
};

const CompanyRewardsPage: FC = () => {
  const { data, isLoading, error, refetch } = useLoadCompanyRewards();
  const { mutateAsync: createReward, isPending: isCreating } =
    useCreateCompanyReward();
  const { mutateAsync: updateReward, isPending: isUpdating } =
    useUpdateCompanyReward();

  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [errorsState, setErrorsState] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const items = data ?? [];
  const isEditing = Boolean(form.id);
  const isSubmitting = isCreating || isUpdating;

  const previewUrl = useMemo(() => form.imageUrl.trim(), [form.imageUrl]);

  const resetForm = () => {
    setForm(defaultFormState);
    setErrorsState({});
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleOpenEdit = (reward: IReward) => {
    setForm({
      id: reward.id,
      name: reward.name,
      description: reward.description,
      amount: reward.amount.toString(),
      imageUrl: reward.imageUrl,
      isActive: reward.isActive,
    });
    setErrorsState({});
    setOpenModal(true);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Informe o nome.";
    if (!form.description.trim())
      newErrors.description = "Informe a descrição.";
    if (!form.amount.trim() || Number(form.amount) <= 0)
      newErrors.amount = "Informe um custo maior que zero.";
    if (!form.imageUrl.trim()) newErrors.imageUrl = "Informe a URL da imagem.";

    setErrorsState(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      amount: Number(form.amount),
      imageUrl: form.imageUrl.trim(),
      isActive: form.isActive,
    };

    try {
      if (isEditing && form.id) {
        await updateReward({ id: form.id, ...payload });
        setSnackbar({
          open: true,
          message: COMPANY_REWARDS_TEXT.feedback.successUpdate,
          severity: "success",
        });
      } else {
        await createReward(payload);
        setSnackbar({
          open: true,
          message: COMPANY_REWARDS_TEXT.feedback.successCreate,
          severity: "success",
        });
      }

      setOpenModal(false);
      resetForm();
      await refetch();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: COMPANY_REWARDS_TEXT.feedback.error,
        severity: "error",
      });
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <Typography variant="h5" fontWeight={700}>
          {COMPANY_REWARDS_TEXT.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {COMPANY_REWARDS_TEXT.subtitle}
        </Typography>
        <ActionsRow>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            {COMPANY_REWARDS_TEXT.actions.new}
          </Button>
        </ActionsRow>
      </HeaderWrapper>

      {isLoading && (
        <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={20} /> {COMPANY_REWARDS_TEXT.states.loading}
        </Typography>
      )}

      {error && (
        <Alert
          severity="error"
          action={
            <Button onClick={() => refetch()} size="small" color="inherit">
              Tentar novamente
            </Button>
          }
        >
          {COMPANY_REWARDS_TEXT.states.error}
        </Alert>
      )}

      {!isLoading && !error && items.length === 0 && (
        <Typography>{COMPANY_REWARDS_TEXT.states.empty}</Typography>
      )}

      <CardsGrid container flex={1} overflow="auto" spacing={2}>
        {items.map((reward) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={reward.id}>
            <RewardCard elevation={2}>
              <CardMedia
                component="img"
                height="160"
                image={reward.imageUrl}
                alt={reward.name}
                sx={{ objectFit: "cover" }}
              />
              <RewardCardContent>
                <Typography variant="subtitle1" fontWeight={700}>
                  {reward.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {reward.description}
                </Typography>

                <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={`${reward.amount} moedas`}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={reward.isActive ? "Ativo" : "Inativo"}
                    color={reward.isActive ? "success" : "default"}
                    size="small"
                    variant={reward.isActive ? "filled" : "outlined"}
                  />
                </Box>
              </RewardCardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={() => handleOpenEdit(reward)}
                >
                  {COMPANY_REWARDS_TEXT.actions.edit}
                </Button>
              </CardActions>
            </RewardCard>
          </Grid>
        ))}
      </CardsGrid>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditing
            ? COMPANY_REWARDS_TEXT.actions.edit
            : COMPANY_REWARDS_TEXT.actions.new}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingTop: 1,
            }}
          >
            <StyledTextField
              label={COMPANY_REWARDS_TEXT.fields.name}
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              error={Boolean(errorsState.name)}
              helperText={errorsState.name}
            />

            <StyledTextField
              label={COMPANY_REWARDS_TEXT.fields.description}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              multiline
              minRows={3}
              error={Boolean(errorsState.description)}
              helperText={errorsState.description}
            />

            <StyledTextField
              label={COMPANY_REWARDS_TEXT.fields.amount}
              type="number"
              value={form.amount}
              inputProps={{ min: 1 }}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  amount: e.target.value.replace(/\D/g, ""),
                }))
              }
              error={Boolean(errorsState.amount)}
              helperText={errorsState.amount}
            />

            <StyledTextField
              label={COMPANY_REWARDS_TEXT.fields.imageUrl}
              value={form.imageUrl}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              error={Boolean(errorsState.imageUrl)}
              helperText={errorsState.imageUrl}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                />
              }
              label={COMPANY_REWARDS_TEXT.fields.isActive}
            />
          </Box>

          {previewUrl && (
            <Box
              sx={{
                flex: "0 0 200px",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                marginTop: 1,
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={previewUrl}
                alt="Preview"
                sx={{ objectFit: "contain", height: "100%" }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>
            {COMPANY_REWARDS_TEXT.actions.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Salvando..."
              : isEditing
              ? COMPANY_REWARDS_TEXT.actions.save
              : COMPANY_REWARDS_TEXT.actions.create}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
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

export default CompanyRewardsPage;
