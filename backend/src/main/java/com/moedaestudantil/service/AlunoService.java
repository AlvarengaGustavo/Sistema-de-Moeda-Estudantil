package com.moedaestudantil.service;

import com.moedaestudantil.dto.AlunoRequestDTO;
import com.moedaestudantil.dto.AlunoResponseDTO;
import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.repository.AlunoRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final PasswordEncoder passwordEncoder;

    public AlunoService(AlunoRepository alunoRepository, PasswordEncoder passwordEncoder) {
        this.alunoRepository = alunoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AlunoResponseDTO criarAluno(AlunoRequestDTO dto) {
        // duplicate checks
        Optional<Aluno> porEmail = alunoRepository.findByEmail(dto.getEmail());
        if (porEmail.isPresent()) {
            throw new DataIntegrityViolationException("Email já cadastrado");
        }

        Optional<Aluno> porCpf = alunoRepository.findByCpf(dto.getCpf());
        if (porCpf.isPresent()) {
            throw new DataIntegrityViolationException("CPF já cadastrado");
        }

        if (dto.getSenha() == null || dto.getSenha().isBlank() || dto.getSenha().length() < 6) {
            throw new IllegalArgumentException("Senha inválida: deve ter ao menos 6 caracteres");
        }

        String cpfDigits = onlyDigits(dto.getCpf());
        if (!isValidCPF(cpfDigits)) {
            throw new IllegalArgumentException("CPF inválido");
        }

        // RG validation removed by request (kept as optional free-text)
        String senhaCriptografada = passwordEncoder.encode(dto.getSenha());
        Aluno aluno = new Aluno(dto.getNome(), dto.getEmail(), senhaCriptografada, dto.getCpf(), dto.getRg(), dto.getEndereco(), dto.getInstituicaoDeEnsino(), dto.getCurso());
        Aluno salvo = alunoRepository.save(aluno);
        return toResponseDTO(salvo);
    }

    public List<AlunoResponseDTO> buscarTodos() {
        return alunoRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));
        return toResponseDTO(aluno);
    }

    public AlunoResponseDTO atualizar(Long id, AlunoRequestDTO dto) {
        Aluno existente = alunoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));

        // if changing email/CPF, check duplication
        if (!existente.getEmail().equals(dto.getEmail())) {
            alunoRepository.findByEmail(dto.getEmail()).ifPresent(a -> {
                throw new DataIntegrityViolationException("Email já cadastrado");
            });
        }
        if (!existente.getCpf().equals(dto.getCpf())) {
            alunoRepository.findByCpf(dto.getCpf()).ifPresent(a -> {
                throw new DataIntegrityViolationException("CPF já cadastrado");
            });
        }

        existente.setNome(dto.getNome());
        existente.setEmail(dto.getEmail());
        // only update password if provided
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            existente.setSenha(passwordEncoder.encode(dto.getSenha()));
        }
        existente.setCpf(dto.getCpf());
        // validate cpf if changed
        String cpfDigits = onlyDigits(dto.getCpf());
        if (!isValidCPF(cpfDigits)) {
            throw new IllegalArgumentException("CPF inválido");
        }
        // RG validation removed by request (kept as optional free-text)
        existente.setRg(dto.getRg());
        existente.setEndereco(dto.getEndereco());
        existente.setInstituicaoDeEnsino(dto.getInstituicaoDeEnsino());
        existente.setCurso(dto.getCurso());

        Aluno atualizado = alunoRepository.save(existente);
        return toResponseDTO(atualizado);
    }

    // basic helpers
    private String onlyDigits(String s) {
        if (s == null) {
            return "";
        }
        return s.replaceAll("\\D", "");
    }

    // simple CPF validation (length + checksum)
    private boolean isValidCPF(String cpf) {
        if (cpf == null) {
            return false;
        }
        if (cpf.length() != 11) {
            return false;
        }
        // reject same-digit sequences
        if (cpf.matches("^(\\d)\\1{10}$")) {
            return false;
        }

        try {
            int sum = 0;
            for (int i = 0; i < 9; i++) {
                sum += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
            }
            int firstCheck = 11 - (sum % 11);
            if (firstCheck >= 10) {
                firstCheck = 0;
            }
            if (firstCheck != Character.getNumericValue(cpf.charAt(9))) {
                return false;
            }

            sum = 0;
            for (int i = 0; i < 10; i++) {
                sum += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
            }
            int secondCheck = 11 - (sum % 11);
            if (secondCheck >= 10) {
                secondCheck = 0;
            }
            return secondCheck == Character.getNumericValue(cpf.charAt(10));
        } catch (Exception e) {
            return false;
        }
    }

    public void deletar(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new IllegalArgumentException("Aluno não encontrado");
        }
        alunoRepository.deleteById(id);
    }

    private AlunoResponseDTO toResponseDTO(Aluno a) {
        return new AlunoResponseDTO(a);
    }

    public Page<AlunoResponseDTO> buscarTodosPaginado(int page, int size, String sort) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<Aluno> paginaDeAlunos = alunoRepository.findAll(pageable);
        Page<AlunoResponseDTO> paginaDeDTOs = paginaDeAlunos.map(AlunoResponseDTO::new);

        return paginaDeDTOs;
    }
}
