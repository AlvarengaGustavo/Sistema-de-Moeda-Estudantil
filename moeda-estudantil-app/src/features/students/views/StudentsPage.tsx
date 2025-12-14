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

import { useLoadStudents } from "../hooks/useLoadStudents";
import { useUpdateStudent } from "../hooks/useUpdateStudent";
import { useLoadInstitutions } from "../../institutions/hooks/useLoadInstitutions";
import type { IInstitution } from "../../institutions/types/IInstitution";
import {
  formatCpf,
  isValidCpf,
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
} from "./styles/StudentsPage.styled";

import { STUDENTS_PAGE_TEXT } from "../utils/constants";
import type { IStudent } from "../types/IStudent";

const StudentsPage: FC = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<IStudent | null>(null);

  const [name, setName] = useState("");
  const [cpfMasked, setCpfMasked] = useState("");
  const [cpfRaw, setCpfRaw] = useState("");
  const [address, setAddress] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [selectedInstitution, setSelectedInstitution] =
    useState<IInstitution | null>(null);
  const [institutionInput, setInstitutionInput] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    cpf: "",
    address: "",
    course: "",
    institution: "",
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const { data: students, refetch } = useLoadStudents(page + 1, limit, search);
  const items = students?.items ?? [];
  const total = students?.total ?? 0;

  const { mutateAsync: updateStudent, isPending: isUpdating } =
    useUpdateStudent();

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

      case "address":
        if (!value.trim()) message = "Informe o endereço.";
        break;

      case "course":
        if (!value.trim()) message = "Informe o curso.";
        break;

      case "institution":
        if (!value.trim()) message = "Selecione a instituição.";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleEdit = (student: IStudent) => {
    setEditing(student);

    setName(student.name);
    validateField("name", student.name);

    setEmail(student.email);
    validateField("email", student.email);

    const onlyDigits = student.cpf.replace(/\D/g, "");
    setCpfRaw(onlyDigits);
    setCpfMasked(formatCpf(onlyDigits));
    validateField("cpf", onlyDigits);

    setAddress(student.address);
    validateField("address", student.address);

    setCourse(student.course);
    validateField("course", student.course);

    setInstitutionId(student.institutionId);
    setIsActive(student.isActive);

    const institution =
      (institutionsData?.items ?? []).find(
        (i) => i.id === student.institutionId
      ) || null;
    setSelectedInstitution(institution);
    setInstitutionInput(institution?.name ?? "");
    validateField("institution", student.institutionId);

    setOpenModal(true);
  };

  const handleSave = async () => {
    const fields = {
      name,
      email,
      cpf: cpfRaw,
      address,
      course,
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
      await updateStudent({
        id: editing!.id,
        name,
        email,
        cpf: cpfRaw,
        address,
        course,
        institutionId,
        isActive,
      });

      setSnackbar({
        open: true,
        message: "Aluno atualizado com sucesso!",
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
          <TableCell colSpan={5}>{STUDENTS_PAGE_TEXT.table.empty}</TableCell>
        </TableRow>
      );
    }

    return items.map((s: IStudent) => (
      <TableRow key={s.id} hover>
        <TableCell>{s.name}</TableCell>
        <TableCell>{s.email}</TableCell>
        <TableCell>{s.course}</TableCell>
        <TableCell>{s.institutionName}</TableCell>
        <TableCell>{s.isActive ? "Ativo" : "Inativo"}</TableCell>
        <TableCell align="right">
          <Tooltip title="Editar aluno" arrow>
            <IconButton onClick={() => handleEdit(s)}>
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
          <h2 style={{ margin: 0 }}>{STUDENTS_PAGE_TEXT.title}</h2>
        </HeaderTop>

        <HeaderBottom>
          <SearchField
            placeholder={STUDENTS_PAGE_TEXT.searchPlaceholder}
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
                <TableCell>{STUDENTS_PAGE_TEXT.table.name}</TableCell>
                <TableCell>{STUDENTS_PAGE_TEXT.table.email}</TableCell>
                <TableCell>{STUDENTS_PAGE_TEXT.table.course}</TableCell>
                <TableCell>{STUDENTS_PAGE_TEXT.table.institution}</TableCell>
                <TableCell>{STUDENTS_PAGE_TEXT.table.status}</TableCell>
                <TableCell align="right">
                  {STUDENTS_PAGE_TEXT.table.actions}
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
          labelRowsPerPage={STUDENTS_PAGE_TEXT.pagination.rowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </TableWrapper>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>{STUDENTS_PAGE_TEXT.modal.editTitle}</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label={STUDENTS_PAGE_TEXT.modal.nameLabel}
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
            label={STUDENTS_PAGE_TEXT.modal.emailLabel}
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
            label={STUDENTS_PAGE_TEXT.modal.cpfLabel}
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

          <TextField
            fullWidth
            label={STUDENTS_PAGE_TEXT.modal.addressLabel}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              validateField("address", e.target.value);
            }}
            sx={{ marginTop: 2 }}
            error={Boolean(errors.address)}
            helperText={errors.address}
          />

          <TextField
            fullWidth
            label={STUDENTS_PAGE_TEXT.modal.courseLabel}
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
              validateField("course", e.target.value);
            }}
            sx={{ marginTop: 2 }}
            error={Boolean(errors.course)}
            helperText={errors.course}
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
                label={STUDENTS_PAGE_TEXT.modal.institutionLabel}
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
            label="Ativo"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>
            {STUDENTS_PAGE_TEXT.modal.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {STUDENTS_PAGE_TEXT.modal.save}
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

export default StudentsPage;
