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
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import { useLoadInstitutions } from "../hooks/useLoadInstitutions";
import { useCreateInstitution } from "../hooks/useCreateInstitution";
import { useUpdateInstitution } from "../hooks/useUpdateInstitution";

import {
  Container,
  HeaderWrapper,
  HeaderTop,
  HeaderBottom,
  SearchField,
  StyledTableContainer,
  StyledTableHead,
  CreateButton,
  TableWrapper,
} from "./styles/InstitutionsPage.styled";

import { INSTITUTIONS_PAGE_TEXT } from "../utils/constants";
import type { IInstitution } from "../types/IInstitution";

const InstitutionsPage: FC = () => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<IInstitution | null>(null);
  const [instName, setInstName] = useState("");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const { data: institutions, refetch } = useLoadInstitutions(
    page + 1,
    limit,
    search
  );

  const items = institutions?.items ?? [];
  const total = institutions?.total ?? 0;

  const { mutateAsync: createInstitution, isPending: isCreating } =
    useCreateInstitution();
  const { mutateAsync: updateInstitution, isPending: isUpdating } =
    useUpdateInstitution();

  const handleCreate = () => {
    setEditing(null);
    setInstName("");
    setOpenModal(true);
  };

  const handleEdit = (institution: IInstitution) => {
    setEditing(institution);
    setInstName(institution.name);
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      if (!instName.trim()) {
        setSnackbar({
          open: true,
          message: "O nome da instituição não pode estar vazio.",
          severity: "error",
        });
        return;
      }

      if (editing) {
        await updateInstitution({
          id: editing.id,
          newInstitutionName: instName,
        });
        setSnackbar({
          open: true,
          message: "Instituição atualizada com sucesso!",
          severity: "success",
        });
      } else {
        await createInstitution(instName);
        setSnackbar({
          open: true,
          message: "Instituição criada com sucesso!",
          severity: "success",
        });
      }

      setOpenModal(false);
      await refetch();
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Ocorreu um erro. Tente novamente.",
        severity: "error",
      });
    }
  };

  return (
    <Container>
      <HeaderWrapper>
        <HeaderTop>
          <h2 style={{ margin: 0 }}>{INSTITUTIONS_PAGE_TEXT.title}</h2>
        </HeaderTop>

        <HeaderBottom>
          <SearchField
            placeholder={INSTITUTIONS_PAGE_TEXT.searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />

          <CreateButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            {INSTITUTIONS_PAGE_TEXT.createButton}
          </CreateButton>
        </HeaderBottom>
      </HeaderWrapper>

      <TableWrapper elevation={2}>
        <StyledTableContainer>
          <Table stickyHeader>
            <StyledTableHead>
              <TableRow>
                <TableCell>{INSTITUTIONS_PAGE_TEXT.table.name}</TableCell>
                <TableCell align="right">
                  {INSTITUTIONS_PAGE_TEXT.table.actions}
                </TableCell>
              </TableRow>
            </StyledTableHead>

            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2}>
                    {INSTITUTIONS_PAGE_TEXT.table.empty}
                  </TableCell>
                </TableRow>
              )}

              {items.map((i: IInstitution) => (
                <TableRow key={i.id} hover>
                  <TableCell>{i.name}</TableCell>

                  <TableCell align="right">
                    <Tooltip title="Editar" arrow>
                      <IconButton onClick={() => handleEdit(i)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
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
          labelRowsPerPage={INSTITUTIONS_PAGE_TEXT.pagination.rowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </TableWrapper>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>
          {editing
            ? INSTITUTIONS_PAGE_TEXT.modal.editTitle
            : INSTITUTIONS_PAGE_TEXT.modal.createTitle}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label={INSTITUTIONS_PAGE_TEXT.modal.nameLabel}
            value={instName}
            onChange={(e) => setInstName(e.target.value)}
            sx={{ marginTop: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>
            {INSTITUTIONS_PAGE_TEXT.modal.cancel}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            loading={isCreating || isUpdating}
          >
            {INSTITUTIONS_PAGE_TEXT.modal.save}
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

export default InstitutionsPage;
