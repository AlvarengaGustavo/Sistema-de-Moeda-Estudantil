package com.moedaestudantil.service;

import com.moedaestudantil.dto.AlunoRequestDTO;
import com.moedaestudantil.dto.AlunoResponseDTO;
import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.model.Transacao;
import com.moedaestudantil.model.Vantagem;

import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.InstituicaoRepository;
import com.moedaestudantil.repository.VantagemRepository;
import com.moedaestudantil.repository.TransacaoRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.moedaestudantil.exception.BusinessException;
import com.moedaestudantil.exception.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final TransacaoRepository transacaoRepository;  
    private final PasswordEncoder passwordEncoder;
    private final InstituicaoRepository instituicaoRepository;

    public AlunoService(AlunoRepository alunoRepository, PasswordEncoder passwordEncoder, VantagemRepository vantagemRepository, TransacaoRepository transacaoRepository,
            InstituicaoRepository instituicaoRepository) {
        this.alunoRepository = alunoRepository;
        this.passwordEncoder = passwordEncoder;
        this.instituicaoRepository = instituicaoRepository;
        this.vantagemRepository = vantagemRepository;
        this.transacaoRepository = transacaoRepository;
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
        Aluno aluno = new Aluno(dto.getNome(), dto.getEmail(), senhaCriptografada, dto.getCpf(), dto.getRg(),
                dto.getEndereco(), dto.getInstituicaoDeEnsino(), dto.getCurso());
        // resolver instituição por nome (pré-cadastrada)
        Instituicao inst = instituicaoRepository.findByNome(dto.getInstituicaoDeEnsino())
                .orElseThrow(() -> new IllegalArgumentException("Instituição não encontrada"));
        aluno.setInstituicao(inst);
        Aluno salvo = alunoRepository.save(aluno);
        return toResponseDTO(salvo);
    }

    public List<AlunoResponseDTO> buscarTodos() {
        return alunoRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));
        return toResponseDTO(aluno);
    }

    public AlunoResponseDTO atualizar(Long id, AlunoRequestDTO dto) {
        Aluno existente = alunoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));

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
        Instituicao inst = instituicaoRepository.findByNome(dto.getInstituicaoDeEnsino())
                .orElseThrow(() -> new IllegalArgumentException("Instituição não encontrada"));
        existente.setInstituicao(inst);
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

    public Aluno resgatarVantagem(String email, Long vantagemId) {
        // 1. Buscar as entidades
        // A lógica de busca do aluno foi movida para cá (do Controller)
        Aluno aluno = alunoRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com email: " + email));

        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new ResourceNotFoundException("Vantagem não encontrada"));

        // 2. Validar a regra de negócio (Saldo)
        if (aluno.getSaldoMoedas() < vantagem.getPrecoMoedas()) {
            throw new BusinessException("Saldo insuficiente para resgatar esta vantagem.");
        }

        // 3. Debitar o saldo do aluno
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getPrecoMoedas());
        Aluno alunoAtualizado = alunoRepository.save(aluno);

        // 4. Criar o registro no histórico (Usando 'Transacao' e o modelo ATUALIZADO)
        Transacao transacao = new Transacao();
        transacao.setAluno(alunoAtualizado);
        transacao.setVantagem(vantagem); // <-- [CORRIGIDO] Usando o novo campo
        transacao.setProfessor(null); // <-- [CORRIGIDO] Definindo como nulo (agora é opcional)

        // 8. Usando o Enum 'TipoTransacao' que vi no seu ProfessorService
        transacao.setTipo(Transacao.TipoTransacao.RESGATE); // <-- [CORRIGIDO] Usando o novo enum

        transacao.setValor(-vantagem.getPrecoMoedas()); // Valor negativo (saída)
        transacao.setMensagem("Resgate: " + vantagem.getTitulo()); // <-- [CORRIGIDO] Usando 'setMensagem'

        // 9. Adicionando a data/hora (como vi no seu ProfessorService)
        transacao.setDataHora(LocalDateTime.now());

        // 10. Usando o repositório correto
        transacaoRepository.save(transacao);

        // 5. Retornar o aluno atualizado
        return alunoAtualizado;
    }
}
