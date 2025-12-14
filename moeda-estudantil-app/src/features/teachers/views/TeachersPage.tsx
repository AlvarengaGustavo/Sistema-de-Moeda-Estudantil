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
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import { useLoadTeachers } from "../hooks/useLoadTeachers";
import { useUpdateTeacher } from "../hooks/useUpdateTeacher";
import { useCreateTeacher } from "../hooks/useCreateTeacher";
import { useLoadInstitutions } from "../../institutions/hooks/useLoadInstitutions";
import type { IInstitution } from "../../institutions/types/IInstitution";
import {
  formatCpf,
  isValidCpf,
  isValidEmail,
} from "../../../shared/utils/helperFunctions";

import {
  Container,
  CreateButton,
  HeaderWrapper,
  HeaderTop,
  HeaderBottom,
  SearchField,
  TableWrapper,
  StyledTableHead,
  StyledTableContainer,
} from "./styles/TeachersPage.styled";

import { TEACHERS_PAGE_TEXT } from "../utils/constants";
import type { ITeacher } from "../types/ITeacher";

const TeachersPage: FC = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editing, setEditing] = useState<ITeacher | null>(null);

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [cpfMasked, setCpfMasked] = useState("");
  const [cpfRaw, setCpfRaw] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [selectedInstitution, setSelectedInstitution] =
    useState<IInstitution | null>(null);
  const [institutionInput, setInstitutionInput] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    department: "",
    institution: "",
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const { data: teachers, refetch } = useLoadTeachers(page + 1, limit, search);
  const items = teachers?.items ?? [];
  const total = teachers?.total ?? 0;

  const { mutateAsync: updateTeacher, isPending: isUpdating } =
    useUpdateTeacher();
  const { mutateAsync: createTeacher, isPending: isCreating } =
    useCreateTeacher();

  const { data: institutionsData } = useLoadInstitutions(
    1,
    10,
    institutionInput
  );

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

      case "cpf":
        if (!value) message = "Informe o CPF.";
        else if (value.length !== 11) message = "CPF deve ter 11 dígitos.";
        else if (!isValidCpf(value)) message = "CPF inválido.";
        break;

      case "password":
        if (openCreateModal && !value.trim()) message = "Informe a senha.";
        break;

      case "department":
        if (!value.trim()) message = "Informe o departamento.";
        break;

      case "institution":
        if (!value.trim()) message = "Selecione a instituição.";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const resetForm = () => {
    setEditing(null);
    setName("");
    setDepartment("");
    setCpfMasked("");
    setCpfRaw("");
    setEmail("");
    setPassword("");
    setInstitutionId("");
    setIsActive(true);
    setSelectedInstitution(null);
    setInstitutionInput("");
    setErrors({
      name: "",
      email: "",
      cpf: "",
      password: "",
      department: "",
      institution: "",
    });
  };

  const handleEdit = (teacher: ITeacher) => {
    setEditing(teacher);

    setName(teacher.name);
    validateField("name", teacher.name);

    setEmail(teacher.email);
    validateField("email", teacher.email);

    const onlyDigits = teacher.cpf.replace(/\D/g, "");
    setDepartment(teacher.department ?? "");
    validateField("department", teacher.department ?? "");
    setCpfRaw(onlyDigits);
    setCpfMasked(formatCpf(onlyDigits));
    validateField("cpf", onlyDigits);

    setInstitutionId(teacher.institutionId);
    setIsActive(teacher.isActive);

    const institution =
      (institutionsData?.items ?? []).find(
        (i) => i.id === teacher.institutionId
      ) || null;
    setSelectedInstitution(institution);
    setInstitutionInput(institution?.name ?? "");
    validateField("institution", teacher.institutionId);

    setOpenEditModal(true);
  };

  const handleSaveEdit = async () => {
    const fields = {
      name,
      email,
      cpf: cpfRaw,
      department,
      institution: institutionId,
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
      await updateTeacher({
        id: editing!.id,
        name,
        department,
        email,
        cpf: cpfRaw,
        institutionId,
        isActive,
      });

      setSnackbar({
        open: true,
        message: "Professor atualizado com sucesso!",
        severity: "success",
      });

      setOpenEditModal(false);
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

  const handleOpenCreate = () => {
    resetForm();
    setOpenCreateModal(true);
  };

  const handleSaveCreate = async () => {
    const fields = {
      name,
      email,
      cpf: cpfRaw,
      password,
      department,
      institution: institutionId,
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
      await createTeacher({
        name,
        email,
        department,
        cpf: cpfRaw,
        password,
        institutionId,
      });

      setSnackbar({
        open: true,
        message: "Professor cadastrado com sucesso!",
        severity: "success",
      });

      setOpenCreateModal(false);
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
          <TableCell colSpan={5}>{TEACHERS_PAGE_TEXT.table.empty}</TableCell>
        </TableRow>
      );
    }

    return items.map((t: ITeacher) => (
      <TableRow key={t.id} hover>
        <TableCell>{t.name}</TableCell>
        <TableCell>{t.email}</TableCell>
        <TableCell>{t.department ?? "-"}</TableCell>
        <TableCell>{t.institutionName}</TableCell>
        <TableCell>{t.balance}</TableCell>
        <TableCell>{t.isActive ? "Ativo" : "Inativo"}</TableCell>
        <TableCell align="right">
          <Tooltip title="Editar professor" arrow>
            <IconButton onClick={() => handleEdit(t)}>
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
          <h2 style={{ margin: 0 }}>{TEACHERS_PAGE_TEXT.title}</h2>
        </HeaderTop>

        <HeaderBottom>
          <SearchField
            placeholder={TEACHERS_PAGE_TEXT.searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />

          <CreateButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            {TEACHERS_PAGE_TEXT.actions.new}
          </CreateButton>
        </HeaderBottom>
      </HeaderWrapper>

      <TableWrapper elevation={2}>
        <StyledTableContainer>
          <Table stickyHeader>
            <StyledTableHead>
              <TableRow>
                <TableCell>{TEACHERS_PAGE_TEXT.table.name}</TableCell>
                <TableCell>{TEACHERS_PAGE_TEXT.table.email}</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>{TEACHERS_PAGE_TEXT.table.institution}</TableCell>
                <TableCell>{TEACHERS_PAGE_TEXT.table.balance}</TableCell>
                <TableCell>{TEACHERS_PAGE_TEXT.table.status}</TableCell>
                <TableCell align="right">
                  {TEACHERS_PAGE_TEXT.table.actions}
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
          labelRowsPerPage={TEACHERS_PAGE_TEXT.pagination.rowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </TableWrapper>

      {/* Edit Modal */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        fullWidth
      >
        <DialogTitle>{TEACHERS_PAGE_TEXT.modal.editTitle}</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label={TEACHERS_PAGE_TEXT.modal.nameLabel}
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
            label="Departamento"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              validateField("department", e.target.value);
            }}
            sx={{ marginTop: 2 }}
            error={Boolean(errors.department)}
            helperText={errors.department}
          />

          <TextField
            fullWidth
            label={TEACHERS_PAGE_TEXT.modal.emailLabel}
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
            label={TEACHERS_PAGE_TEXT.modal.cpfLabel}
            value={cpfMasked}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
              setCpfRaw(digits);
              setCpfMasked(formatCpf(digits));
              validateField("cpf", digits);
            }}
            sx={{ marginTop: 2 }}
            error={Boolean(errors.cpf)}
            helperText={errors.cpf}
          />

          <Autocomplete
            loadingText="Carregando..."
            sx={{ marginTop: 2 }}
            options={(institutionsData?.items ?? []) as IInstitution[]}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedInstitution}
            inputValue={institutionInput}
            onInputChange={(_, newValue) => setInstitutionInput(newValue)}
            onChange={(_, value) => {
              setSelectedInstitution(value);
              setInstitutionId(value?.id ?? "");
              validateField("institution", value?.id ?? "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={TEACHERS_PAGE_TEXT.modal.institutionLabel}
                error={Boolean(errors.institution)}
                helperText={errors.institution}
              />
            )}
          />

          <FormControlLabel
            sx={{ marginTop: 2 }}
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label={TEACHERS_PAGE_TEXT.modal.statusLabel}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>
            {TEACHERS_PAGE_TEXT.modal.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={isUpdating}
          >
            {TEACHERS_PAGE_TEXT.modal.save}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Modal */}
      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        fullWidth
      >
        <DialogTitle>{TEACHERS_PAGE_TEXT.modal.createTitle}</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label={TEACHERS_PAGE_TEXT.modal.nameLabel}
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
            label={TEACHERS_PAGE_TEXT.modal.emailLabel}
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
            type="password"
            label={TEACHERS_PAGE_TEXT.modal.passwordLabel}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validateField("password", e.target.value);
            }}
            sx={{ marginTop: 2 }}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />

          <TextField
            fullWidth
            label="Departamento"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              validateField("department", e.target.value);
            }}
            sx={{ marginTop: 2 }}
            error={Boolean(errors.department)}
            helperText={errors.department}
          />

          <TextField
            fullWidth
            label={TEACHERS_PAGE_TEXT.modal.cpfLabel}
            value={cpfMasked}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
              setCpfRaw(digits);
              setCpfMasked(formatCpf(digits));
              validateField("cpf", digits);
            }}
            sx={{ marginTop: 2 }}
            error={Boolean(errors.cpf)}
            helperText={errors.cpf}
          />

          <Autocomplete
            loadingText="Carregando..."
            sx={{ marginTop: 2 }}
            options={(institutionsData?.items ?? []) as IInstitution[]}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedInstitution}
            inputValue={institutionInput}
            onInputChange={(_, newValue) => setInstitutionInput(newValue)}
            onChange={(_, value) => {
              setSelectedInstitution(value);
              setInstitutionId(value?.id ?? "");
              validateField("institution", value?.id ?? "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={TEACHERS_PAGE_TEXT.modal.institutionLabel}
                error={Boolean(errors.institution)}
                helperText={errors.institution}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)}>
            {TEACHERS_PAGE_TEXT.modal.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCreate}
            disabled={isCreating}
          >
            {TEACHERS_PAGE_TEXT.modal.create}
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

export default TeachersPage;
