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
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RedeemIcon from "@mui/icons-material/Redeem";

import { useLoadAvailableRewards } from "../hooks/useLoadAvailableRewards";
import { useRedeemReward } from "../hooks/useRedeemReward";
import { STUDENT_REWARDS_TEXT } from "../utils/studentRewardsConstants";
import type { IReward } from "../types/IReward";
import {
  CardsGrid,
  Container,
  HeaderWrapper,
  RewardCard,
  RewardCardContent,
} from "./styles/StudentRewardsPage.styled";
import { useLoadUserInfo } from "../../login/hooks/useLoadUserInfo";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error";
};

const StudentRewardsPage: FC = () => {
  const { data, isLoading, error, refetch } = useLoadAvailableRewards();
  const { mutateAsync: redeemReward, isPending } = useRedeemReward();
  const { userInfo, refetch: refetchUserInfo } = useLoadUserInfo();
  const role = userInfo?.role;
  const [selected, setSelected] = useState<IReward | null>(null);
  const [confirmReward, setConfirmReward] = useState<IReward | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const items = useMemo(
    () => (data ?? []).filter((reward) => reward.isActive),
    [data]
  );

  const handleRedeem = async (reward: IReward) => {
    try {
      await redeemReward({ rewardId: reward.id });
      setSnackbar({
        open: true,
        message: STUDENT_REWARDS_TEXT.feedback.success,
        severity: "success",
      });
      setSelected(null);
      setConfirmReward(null);
      await refetch();
      await refetchUserInfo();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: STUDENT_REWARDS_TEXT.feedback.error,
        severity: "error",
      });
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <Typography variant="h5" fontWeight={700}>
          {STUDENT_REWARDS_TEXT.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {STUDENT_REWARDS_TEXT.subtitle}
        </Typography>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderColor: "divider",
          }}
        >
          <Stack>
            <Typography variant="subtitle2" color="text.secondary">
              Saldo disponível
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {`${userInfo?.balance ?? "-"} moedas`}
            </Typography>
          </Stack>
          <Chip
            label={role === "TEACHER" ? "Professor" : "Aluno"}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      </HeaderWrapper>

      {isLoading && (
        <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={20} /> {STUDENT_REWARDS_TEXT.states.loading}
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
          {STUDENT_REWARDS_TEXT.states.error}
        </Alert>
      )}

      {!isLoading && !error && items.length === 0 && (
        <Typography>{STUDENT_REWARDS_TEXT.states.empty}</Typography>
      )}

      <CardsGrid container flex={1} overflow="auto" spacing={2} padding={1}>
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
                  {typeof userInfo?.balance === "number" &&
                    userInfo.balance < reward.amount && (
                      <Chip
                        label="Saldo insuficiente"
                        color="error"
                        variant="outlined"
                        size="small"
                      />
                    )}
                </Box>
              </RewardCardContent>
              <CardActions
                sx={{ justifyContent: "center", gap: 1, p: 1, pt: 0.5 }}
              >
                <Button
                  startIcon={<VisibilityIcon />}
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 0, px: 1.25 }}
                  onClick={() => setSelected(reward)}
                >
                  {STUDENT_REWARDS_TEXT.details.title}
                </Button>
                <Button
                  startIcon={<RedeemIcon />}
                  size="small"
                  variant="contained"
                  sx={{ minWidth: 0, px: 1.5 }}
                  onClick={() => setConfirmReward(reward)}
                  disabled={
                    isPending ||
                    (typeof userInfo?.balance === "number" &&
                      userInfo.balance < reward.amount)
                  }
                >
                  {STUDENT_REWARDS_TEXT.actions.redeem}
                </Button>
              </CardActions>
            </RewardCard>
          </Grid>
        ))}
      </CardsGrid>

      {/* Modal de confirmação de resgate */}
      <Dialog
        open={Boolean(confirmReward)}
        onClose={() => setConfirmReward(null)}
        fullWidth
        maxWidth="sm"
      >
        {confirmReward && (
          <>
            <DialogTitle>Confirmar resgate</DialogTitle>
            <DialogContent>
              <Stack gap={1.5}>
                <Typography>
                  Você está prestes a resgatar "{confirmReward.name}".
                </Typography>
                <Typography color="text.secondary">
                  Custo: {confirmReward.amount} moedas
                </Typography>
                <Typography color="text.secondary">
                  Seu saldo: {userInfo?.balance ?? "-"} moedas
                </Typography>
                {typeof userInfo?.balance === "number" &&
                  userInfo.balance < confirmReward.amount && (
                    <Alert severity="error">
                      Seu saldo é insuficiente para esse resgate.
                    </Alert>
                  )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmReward(null)}>
                {STUDENT_REWARDS_TEXT.actions.close}
              </Button>
              <Button
                variant="contained"
                startIcon={<RedeemIcon />}
                onClick={() => handleRedeem(confirmReward)}
                disabled={
                  isPending ||
                  (typeof userInfo?.balance === "number" &&
                    userInfo.balance < confirmReward.amount)
                }
              >
                {isPending
                  ? "Resgatando..."
                  : STUDENT_REWARDS_TEXT.actions.redeem}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="md"
      >
        {selected && (
          <>
            <DialogTitle>{selected.name}</DialogTitle>
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              {/* Imagem */}
              <Box
                component="img"
                src={selected.imageUrl}
                alt={selected.name}
                sx={{
                  width: { xs: "100%", sm: "40%" },
                  objectFit: "contain",
                  maxHeight: "60vh",
                  borderRadius: 1,
                }}
              />

              {/* Conteúdo */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {STUDENT_REWARDS_TEXT.details.cost}: {selected.amount} moedas
                </Typography>

                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {selected.description}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  ID: {selected.id}
                </Typography>

                {/* Aviso de envio por email */}
                <Alert severity="info" sx={{ mt: 1 }}>
                  Após o resgate, a vantagem será enviada para o seu email.
                </Alert>

                {/* Removido: tabela de transações moved para TransactionsPage */}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelected(null)}>
                {STUDENT_REWARDS_TEXT.actions.close}
              </Button>
              <Button
                variant="contained"
                startIcon={<RedeemIcon />}
                onClick={() => setConfirmReward(selected)}
                disabled={
                  isPending ||
                  (typeof userInfo?.balance === "number" &&
                    userInfo.balance < selected.amount)
                }
              >
                {STUDENT_REWARDS_TEXT.actions.redeem}
              </Button>
            </DialogActions>
          </>
        )}
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

export default StudentRewardsPage;
