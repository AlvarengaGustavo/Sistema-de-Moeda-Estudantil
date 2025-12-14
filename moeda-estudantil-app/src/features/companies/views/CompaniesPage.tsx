import type { FC } from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { useLoadCompanies } from "../hooks/useLoadCompanies.ts";
import { useUpdateCompany } from "../hooks/useUpdateCompany";
import {
  formatCnpj,
  isValidCnpj,
  isValidEmail,
} from "../../../shared/utils/helperFunctions";

import {
  Container,
  HeaderWrapper,
  HeaderTop,
  HeaderBottom,
  SearchField,
  TableWrapper,
  StyledTableHead,
  StyledTableContainer,
} from "./styles/CompaniesPage.styled";

import { COMPANIES_PAGE_TEXT } from "../utils/constants";
import type { ICompany } from "../types/ICompany";

const CompaniesPage: FC = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<ICompany | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnpjMasked, setCnpjMasked] = useState("");
  const [cnpjRaw, setCnpjRaw] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    cnpj: "",
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const { data: companies, refetch } = useLoadCompanies(
    page + 1,
    limit,
    search
  );
  const items = companies?.items ?? [];
  const total = companies?.total ?? 0;

  const { mutateAsync: updateCompany, isPending: isUpdating } =
    useUpdateCompany();

  const validateField = (field: string, value: string) => {
    let message = "";

    switch (field) {
      case "name":
        if (!value.trim()) message = "Informe o nome.";
        break;
      case "email":
        if (!value.trim()) message = "Informe o email.";
        else if (!isValidEmail(value)) message = "Email inválido.";
        break;
      case "cnpj":
        if (!value) message = "Informe o CNPJ.";
        else if (value.length !== 14) message = "CNPJ deve ter 14 dígitos.";
        else if (!isValidCnpj(value)) message = "CNPJ inválido.";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleEdit = (company: ICompany) => {
    setEditing(company);

    setName(company.name);
    validateField("name", company.name);

    setEmail(company.email);
    validateField("email", company.email);

    const onlyDigits = company.cnpj.replace(/\D/g, "");
    setCnpjRaw(onlyDigits);
    setCnpjMasked(formatCnpj(onlyDigits));
    validateField("cnpj", onlyDigits);

    setIsActive(company.isActive);

    setOpenModal(true);
  };

  const handleSave = async () => {
    const fields = {
      name,
      email,
      cnpj: cnpjRaw,
    };

    Object.entries(fields).forEach(([f, v]) => validateField(f, v));

    const hasError = Object.values(errors).some((e) => e.length > 0);
    if (hasError) {
      setSnackbar({
        open: true,
        message: "Verifique os campos inválidos.",
        severity: "error",
      });
      return;
    }

    try {
      await updateCompany({
        id: editing!.id,
        name,
        email,
        cnpj: cnpjRaw,
        isActive,
      });

      setSnackbar({
        open: true,
        message: "Empresa atualizada com sucesso!",
        severity: "success",
      });

      setOpenModal(false);
      await refetch();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Ocorreu um erro. Tente novamente.",
        severity: "error",
      });
    }
  };

  const renderTableData = () => {
    if (items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5}>{COMPANIES_PAGE_TEXT.table.empty}</TableCell>
        </TableRow>
      );
    }

    return items.map((c: ICompany) => (
      <TableRow key={c.id} hover>
        <TableCell>{c.name}</TableCell>
        <TableCell>{c.email}</TableCell>
        <TableCell>{formatCnpj(c.cnpj)}</TableCell>
        <TableCell>{c.isActive ? "Ativa" : "Inativa"}</TableCell>
        <TableCell align="right">
          <Tooltip title="Editar empresa" arrow>
            <IconButton onClick={() => handleEdit(c)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Container>
      <HeaderWrapper>
        <HeaderTop>
          <h2 style={{ margin: 0 }}>{COMPANIES_PAGE_TEXT.title}</h2>
        </HeaderTop>

        <HeaderBottom>
          <SearchField
            placeholder={COMPANIES_PAGE_TEXT.searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </HeaderBottom>
      </HeaderWrapper>

      <TableWrapper elevation={2}>
        <StyledTableContainer>
          <Table stickyHeader>
            <StyledTableHead>
              <TableRow>
                <TableCell>{COMPANIES_PAGE_TEXT.table.name}</TableCell>
                <TableCell>{COMPANIES_PAGE_TEXT.table.email}</TableCell>
                <TableCell>{COMPANIES_PAGE_TEXT.table.cnpj}</TableCell>
                <TableCell>{COMPANIES_PAGE_TEXT.table.status}</TableCell>
                <TableCell align="right">
                  {COMPANIES_PAGE_TEXT.table.actions}
                </TableCell>
              </TableRow>
            </StyledTableHead>

            <TableBody>{renderTableData()}</TableBody>
          </Table>
        </StyledTableContainer>

        <TablePagination
          sx={{ borderTop: "1px solid #e0e0e0" }}
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage={COMPANIES_PAGE_TEXT.pagination.rowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </TableWrapper>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>{COMPANIES_PAGE_TEXT.modal.editTitle}</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label={COMPANIES_PAGE_TEXT.modal.nameLabel}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateField("name", e.target.value);
            }}
            sx={{ marginTop: 1 }}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            label={COMPANIES_PAGE_TEXT.modal.emailLabel}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField("email", e.target.value);
            }}
            sx={{ marginTop: 2 }}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label={COMPANIES_PAGE_TEXT.modal.cnpjLabel}
            value={cnpjMasked}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 14);
              setCnpjRaw(digits);
              setCnpjMasked(formatCnpj(digits));
              validateField("cnpj", digits);
            }}
            sx={{ marginTop: 2 }}
            error={Boolean(errors.cnpj)}
            helperText={errors.cnpj}
          />

          <FormControlLabel
            sx={{ marginTop: 2 }}
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Ativa"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>
            {COMPANIES_PAGE_TEXT.modal.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {COMPANIES_PAGE_TEXT.modal.save}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CompaniesPage;
