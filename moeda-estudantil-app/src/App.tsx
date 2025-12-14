import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./features/login/views/LoginPage";
import MainLayout from "./features/dashboard/views/MainLayout";
import InstitutionsPage from "./features/institutions/views/InstitutionsPage";
import StudentsPage from "./features/students/views/StudentsPage";
import RegisterSelectPage from "./features/register/views/RegisterSelectPage";
import RegisterStudentPage from "./features/register/views/RegisterStudentPage";
import RegisterCompanyPage from "./features/register/views/RegisterCompanyPage";
import CompaniesPage from "./features/companies/views/CompaniesPage";
import TeachersPage from "./features/teachers/views/TeachersPage";
import DonationPage from "./features/rewards/views/DonationPage";
import TransactionsPage from "./features/rewards/views/TransactionsPage";
import CompanyRewardsPage from "./features/rewards/views/CompanyRewardsPage";
import StudentRewardsPage from "./features/rewards/views/StudentRewardsPage";
import UpdateCredentialsPage from "./features/account/views/UpdateCredentialsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterSelectPage />} />
        <Route path="registro/aluno" element={<RegisterStudentPage />} />
        <Route path="registro/empresa" element={<RegisterCompanyPage />} />
        <Route path="/" element={<MainLayout />} />

        <Route element={<MainLayout />}>
          <Route path="/instituicoes" element={<InstitutionsPage />} />
          <Route path="/alunos" element={<StudentsPage />} />
          <Route path="/empresas" element={<CompaniesPage />} />
          <Route path="/professores" element={<TeachersPage />} />
          <Route path="/doacao" element={<DonationPage />} />
          <Route path="/extrato" element={<TransactionsPage />} />
          <Route path="/gerenciar-vantagens" element={<CompanyRewardsPage />} />
          <Route path="/vantagens" element={<StudentRewardsPage />} />
          <Route path="/conta" element={<UpdateCredentialsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
