import type { TUserRole } from "../../login/types/TUserRole";

export const getRoleName = (role: TUserRole): string => {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "TEACHER":
      return "Professor";
    case "STUDENT":
      return "Aluno";
    case "COMPANY":
      return "Empresa";
  }
};
