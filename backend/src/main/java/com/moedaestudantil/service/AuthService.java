package com.moedaestudantil.service;

import com.moedaestudantil.dto.login.LoginRequestDTO;
import com.moedaestudantil.dto.login.LoginResponseDTO;
import com.moedaestudantil.dto.login.UserDTO;
import com.moedaestudantil.model.Admin;
import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.EmpresaParceira;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.repository.AdminRepository;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.EmpresaParceiraRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import com.moedaestudantil.security.JwtTokenProvider;
// import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final EmpresaParceiraRepository empresaRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(AlunoRepository alunoRepository,
                       ProfessorRepository professorRepository,
                       EmpresaParceiraRepository empresaRepository,
                       AdminRepository adminRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.empresaRepository = empresaRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Lógica de login principal.
     * Tenta autenticar o usuário sequencialmente em cada repositório.
     */
    public LoginResponseDTO login(LoginRequestDTO request) throws Exception {

        // 1. Tenta como Aluno
        Optional<Aluno> aluno = alunoRepository.findByEmail(request.getEmail()); // Alterado de .email()
        if (aluno.isPresent()) {
            if (passwordEncoder.matches(request.getSenha(), aluno.get().getSenha())) { // Alterado de .senha()
                UserDTO userDto = new UserDTO(aluno.get());
                String token = jwtTokenProvider.generateToken(userDto);
                return new LoginResponseDTO(token, userDto);
            }
        }

        // 2. Tenta como Professor
        Optional<Professor> professor = professorRepository.findByEmail(request.getEmail()); // Alterado de .email()
        if (professor.isPresent()) {
            if (passwordEncoder.matches(request.getSenha(), professor.get().getSenha())) { // Alterado de .senha()
                UserDTO userDto = new UserDTO(professor.get());
                String token = jwtTokenProvider.generateToken(userDto);
                return new LoginResponseDTO(token, userDto);
            }
        }

        // 3. Tenta como Empresa
        Optional<EmpresaParceira> empresa = empresaRepository.findByEmail(request.getEmail()); // Alterado de .email()
        if (empresa.isPresent()) {
            if (passwordEncoder.matches(request.getSenha(), empresa.get().getSenha())) { // Alterado de .senha()
                UserDTO userDto = new UserDTO(empresa.get());
                String token = jwtTokenProvider.generateToken(userDto);
                return new LoginResponseDTO(token, userDto);
            }
        }

        // 4. Tenta como Admin
        Optional<Admin> admin = adminRepository.findByEmail(request.getEmail()); // Alterado de .email()
        if (admin.isPresent()) {
            if (passwordEncoder.matches(request.getSenha(), admin.get().getSenha())) { // Alterado de .senha()
                UserDTO userDto = new UserDTO(admin.get());
                String token = jwtTokenProvider.generateToken(userDto);
                return new LoginResponseDTO(token, userDto);
            }
        }

        // 5. Se não encontrou em nenhuma ou a senha estava errada
        throw new Exception("Email ou senha inválidos");
    }
}