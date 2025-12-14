import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import { Box, Divider, List, ListItemIcon } from "@mui/material";

const DRAWER_WIDTH = 260;
export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: DRAWER_WIDTH,
    boxSizing: "border-box",
    padding: "0.5rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

export const LogoContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginBottom: "0.5rem",
  marginTop: "0.5rem",
});

export const StyledDivider = styled(Divider)({
  borderColor: "rgba(255,255,255,0.25)",
});

export const Menu = styled(List)({
  flex: 1,
});

export const MenuItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  minWidth: 32,
  color: isActive
    ? theme.palette.secondary.main
    : theme.palette.primary.contrastText,
}));
