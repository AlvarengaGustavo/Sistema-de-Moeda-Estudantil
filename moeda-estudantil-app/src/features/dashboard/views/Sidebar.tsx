import type { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "../utils/constants";
import { useLoginSlice } from "../../login/hooks/useLoginSlice";
import {
  Box,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  LogoContainer,
  Menu,
  MenuItemIcon,
  StyledDivider,
  StyledDrawer,
} from "./styles/Sidebar.styled";
import { getRoleName } from "../utils/helperFunction";
import { BrowserApi } from "../../../shared/BrowserApi/BrowserApi";

const ITEM_HEIGHT = 46;

const Sidebar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticatedUser, setAuthenticatedUser } = useLoginSlice();
  const theme = useTheme();

  if (!authenticatedUser) {
    return null;
  }

  const role = authenticatedUser.role;
  const items = MENU_ITEMS[role];

  const handleLogout = () => {
    BrowserApi.clearToken();
    setAuthenticatedUser(undefined);
    navigate("/login");
  };

  return (
    <StyledDrawer variant="permanent" anchor="left">
      <LogoContainer>
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            height: 52,
            objectFit: "contain",
            filter: "brightness(1.1)",
          }}
        />
      </LogoContainer>

      <StyledDivider />

      <Menu>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              sx={{
                height: ITEM_HEIGHT,
                borderRadius: 2,
                mb: 0.5,
                px: 2,
                transition: "0.15s",

                backgroundColor: isActive
                  ? `${theme.palette.primary.contrastText}22`
                  : "transparent",

                borderLeft: isActive
                  ? `4px solid ${theme.palette.secondary.main}`
                  : "4px solid transparent",

                pl: isActive ? 1.5 : 2,

                "&:hover": {
                  backgroundColor: `rgba(255,255,255,0.10)`,
                },
              }}
            >
              <MenuItemIcon isActive={isActive}>
                <Icon />
              </MenuItemIcon>

              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.9rem",
                    color: theme.palette.primary.contrastText,
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </Menu>

      <Divider
        sx={{
          my: 2,
          borderColor: "rgba(255,255,255,0.25)",
        }}
      />

      <Box sx={{ pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 1,
            alignItems: "center",
            px: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.primary.contrastText,
            }}
          >
            <PersonIcon />
          </Box>

          <Box>
            <Typography fontWeight={600} color="inherit">
              {authenticatedUser.name?.trim() || "Administrador"}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }} color="inherit">
              {getRoleName(authenticatedUser.role)}
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          component={Link}
          to="/conta"
          startIcon={<SettingsIcon />}
          sx={{
            mb: 1,
            borderColor: "rgba(255,255,255,0.4)",
            color: theme.palette.primary.contrastText,
            "&:hover": {
              borderColor: "rgba(255,255,255,0.6)",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Minha conta
        </Button>

        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            borderColor: "rgba(255,255,255,0.4)",
            color: theme.palette.primary.contrastText,
            "&:hover": {
              borderColor: "rgba(255,255,255,0.6)",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Sair
        </Button>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
