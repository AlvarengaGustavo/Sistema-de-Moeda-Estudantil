import GroupIcon from "@mui/icons-material/Group";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import type { TUserRole } from "../../login/types/TUserRole";

export interface MenuItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

export const MENU_ITEMS: Record<TUserRole, MenuItem[]> = {
  TEACHER: [
    {
      label: "Realizar Doação",
      icon: VolunteerActivismIcon,
      path: "/doacao",
    },
    {
      label: "Extrato",
      icon: ReceiptLongIcon,
      path: "/extrato",
    },
  ],

  STUDENT: [
    {
      label: "Resgatar Vantagens",
      icon: CardGiftcardIcon,
      path: "/vantagens",
    },
    {
      label: "Extrato",
      icon: ReceiptLongIcon,
      path: "/extrato",
    },
  ],

  COMPANY: [
    {
      label: "Vantagens",
      icon: CardGiftcardIcon,
      path: "/gerenciar-vantagens",
    },
    {
      label: "Extrato",
      icon: ReceiptLongIcon,
      path: "/extrato",
    },
  ],

  ADMIN: [
    {
      label: "Gerenciar Alunos",
      icon: GroupIcon,
      path: "/alunos",
    },
    {
      label: "Gerenciar Professores",
      icon: BadgeIcon,
      path: "/professores",
    },
    {
      label: "Gerenciar Empresas",
      icon: BusinessIcon,
      path: "/empresas",
    },
    {
      label: "Gerenciar Instituições",
      icon: AccountBalanceIcon,
      path: "/instituicoes",
    },
  ],
};
