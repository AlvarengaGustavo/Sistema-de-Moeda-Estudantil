import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Card,
  Container,
  Form,
  Logo,
  LogoArea,
  SubmitButton,
} from "./styles/LoginPage.styled";
import { LOGIN_PAGE_TEXTS } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import { BrowserApi } from "../../../shared/BrowserApi/BrowserApi";
import { useLoadUserInfo } from "../hooks/useLoadUserInfo";
import { useLoginSlice } from "../hooks/useLoginSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthenticatedUser } = useLoginSlice();
  const { refetch, isLoading } = useLoadUserInfo();
  const navigate = useNavigate();

  const renderError = () => {
    if (!error) {
      return null;
    }

    return (
      <Typography color="error" variant="body2" mt={2}>
        {error}
      </Typography>
    );
  };

  const onLoginSuccess = async (token: string) => {
    BrowserApi.setToken(token);

    const userInfo = await refetch();

    if (userInfo.data) {
      setAuthenticatedUser(userInfo.data);
    }

    setError("");
  };

  const { mutateAsync: login, isPending } = useAuth(onLoginSuccess);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      return setError(LOGIN_PAGE_TEXTS.fillEmailError);
    }

    if (!password) {
      return setError(LOGIN_PAGE_TEXTS.fillPasswordError);
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!emailRegex.test(email)) {
      return setError(LOGIN_PAGE_TEXTS.invalidEmailError);
    }

    login({ email, password })
      .then(() => {
        navigate("/");
      })
      .catch((error: { response?: { status: number } }) => {
        if (error.response?.status === 401) {
          setError(LOGIN_PAGE_TEXTS.invalidCredentialsError);
        } else {
          setError(LOGIN_PAGE_TEXTS.unexpectedError);
        }
      });
  };

  return (
    <Container>
      <Card elevation={6}>
        <LogoArea>
          <Logo src="/logo_login.png" alt={LOGIN_PAGE_TEXTS.logoAlt} />
        </LogoArea>

        <Typography variant="h5" fontWeight={700} gutterBottom>
          {LOGIN_PAGE_TEXTS.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          {LOGIN_PAGE_TEXTS.subtitle}
        </Typography>

        <Form onSubmit={handleSubmit} noValidate>
          <TextField
            label={LOGIN_PAGE_TEXTS.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="email"
            required
          />

          <TextField
            label={LOGIN_PAGE_TEXTS.password}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            autoComplete="current-password"
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? LOGIN_PAGE_TEXTS.hidePassword
                          : LOGIN_PAGE_TEXTS.showPassword
                      }
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {renderError()}

          <SubmitButton
            type="submit"
            variant="contained"
            loading={isPending || isLoading}
            fullWidth
          >
            {LOGIN_PAGE_TEXTS.buttonText}
          </SubmitButton>
        </Form>

        <Typography variant="body2" align="center" mt={3}>
          {LOGIN_PAGE_TEXTS.stillNoAccount}
          <Link href="/registro" underline="none">
            {LOGIN_PAGE_TEXTS.signUp}
          </Link>
        </Typography>
      </Card>
    </Container>
  );
};

export default LoginPage;
