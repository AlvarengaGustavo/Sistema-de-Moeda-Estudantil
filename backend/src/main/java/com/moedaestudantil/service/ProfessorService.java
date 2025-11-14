package com.moedaestudantil.service;

import com.moedaestudantil.dto.EnviarMoedasRequestDTO;
import com.moedaestudantil.dto.ExtratoResponseDTO;
import com.moedaestudantil.dto.ProfessorResponseDTO;
import com.moedaestudantil.dto.TransacaoResponseDTO;
import com.moedaestudantil.model.Aluno;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.model.Transacao;
import com.moedaestudantil.repository.AlunoRepository;
import com.moedaestudantil.repository.InstituicaoRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import com.moedaestudantil.repository.TransacaoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.moedaestudantil.dto.ProfessorDTO;
import com.moedaestudantil.exception.ResourceNotFoundException;
import com.moedaestudantil.model.Instituicao;
import com.moedaestudantil.model.Professor;
import com.moedaestudantil.repository.InstituicaoRepository;
import com.moedaestudantil.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfessorService {

    private final AlunoRepository alunoRepository;
    private final TransacaoRepository transacaoRepository;
    private final EmailService emailService;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private InstituicaoRepository instituicaoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ProfessorService(ProfessorRepository professorRepository,
            AlunoRepository alunoRepository,
            TransacaoRepository transacaoRepository,
            EmailService emailService) {
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.transacaoRepository = transacaoRepository;
        this.emailService = emailService;
    }

    private void mapDtoToEntity(ProfessorDTO dto, Professor professor, Instituicao instituicao) {
        professor.setNome(dto.getNome());
        professor.setCpf(dto.getCpf());
        professor.setDepartamento(dto.getDepartamento());
        professor.setEmail(dto.getEmail());
        professor.setInstituicao(instituicao);
    }

    public List<ProfessorResponseDTO> listarProfessores() {
        return professorRepository.findAll().stream()
                .peek(this::atualizarCotaSemestralSeNecessario)
                .map(ProfessorResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Cria um novo Professor.
     */
    @Transactional
    public Professor createProfessor(ProfessorDTO dto) {
        // 1. Validar e buscar a Instituição
        Instituicao instituicao = instituicaoRepository.findByNome(dto.getInstituicao())
                .orElseThrow(() -> new IllegalArgumentException("Instituição não encontrada"));

        // 2. Validar se a senha foi fornecida
        if (dto.getSenha() == null || dto.getSenha().isEmpty()) {
            throw new IllegalArgumentException("A senha é obrigatória para criar um novo professor.");
        }

        // 3. Mapear DTO para nova entidade
        Professor professor = new Professor();
        mapDtoToEntity(dto, professor, instituicao);

        // 4. Codificar e definir a senha
        professor.setSenha(passwordEncoder.encode(dto.getSenha()));

        // 5. Definir valores padrão
        professor.setSaldoMoedas(0);
        // (Definir ultimaCotaAno/Semestre se necessário)

        // 6. Salvar e retornar
        return professorRepository.save(professor);
    }

    /**
     * Atualiza um Professor existente.
     */
    @Transactional
    public Professor updateProfessor(Long id, ProfessorDTO dto) {
        // 1. Buscar o Professor existente
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado com id: " + id));

        // 2. Validar e buscar a Instituição (mesmo que seja a mesma)
        Instituicao instituicao = instituicaoRepository.findByNome(dto.getInstituicao())
                .orElseThrow(() -> new IllegalArgumentException("Instituição não encontrada"));

        // 3. Mapear dados do DTO
        mapDtoToEntity(dto, professor, instituicao);

        // 4. Lógica de atualização de senha:
        // Só atualiza a senha se uma nova senha for fornecida.
        if (dto.getSenha() != null && !dto.getSenha().trim().isEmpty()) {
            professor.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        // 5. Salvar e retornar
        return professorRepository.save(professor);
    }

    /**
     * Exclui um Professor.
     */
    @Transactional
    public void deleteProfessor(Long id) {
        // 1. Verificar se o professor existe antes de tentar excluir
        if (!professorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Professor não encontrado com id: " + id);
        }

        // 2. Excluir
        professorRepository.deleteById(id);
    }

    public void enviarMoedas(Long professorId, EnviarMoedasRequestDTO req) {
        if (req.getValor() == null || req.getValor() <= 0) {
            throw new IllegalArgumentException("Valor deve ser positivo");
        }
        if (req.getMotivo() == null || req.getMotivo().isBlank()) {
            throw new IllegalArgumentException("Motivo é obrigatório");
        }

        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado"));

        // aplica créditos semestrais pendentes
        atualizarCotaSemestralSeNecessario(professor);

        Aluno aluno = alunoRepository.findById(req.getAlunoId())
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));

        if (professor.getSaldoMoedas() < req.getValor()) {
            throw new IllegalArgumentException("Saldo insuficiente do professor");
        }

        // efetiva transferência
        professor.setSaldoMoedas(professor.getSaldoMoedas() - req.getValor());
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + req.getValor());
        professorRepository.save(professor);
        alunoRepository.save(aluno);

        Transacao t = new Transacao(
                LocalDateTime.now(),
                professor,
                aluno,
                Transacao.TipoTransacao.ENVIO,
                req.getValor(),
                req.getMotivo());
        transacaoRepository.save(t);

        // notifica aluno por email
        String assunto = "Você recebeu moedas!";
        String corpo = String.format(
                "Olá %s,\n\nVocê recebeu %d moedas do professor %s.\nMotivo: %s\n\nSaldo atual: %d\n\nAtenciosamente,\nSistema de Moeda Estudantil",
                aluno.getNome(), req.getValor(), professor.getNome(), req.getMotivo(), aluno.getSaldoMoedas());
        emailService.enviarEmail(aluno.getEmail(), assunto, corpo);
    }

    public ExtratoResponseDTO extratoProfessor(Long professorId) {
        Professor p = professorRepository.findById(professorId)
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado"));
        // atualiza cota antes de exibir extrato/saldo
        atualizarCotaSemestralSeNecessario(p);
        List<TransacaoResponseDTO> transacoes = transacaoRepository.findByProfessorIdOrderByDataHoraDesc(professorId)
                .stream().map(TransacaoResponseDTO::new).collect(Collectors.toList());
        return new ExtratoResponseDTO(p.getSaldoMoedas(), transacoes);
    }

    public ExtratoResponseDTO extratoAluno(Long alunoId) {
        Aluno a = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));
        List<TransacaoResponseDTO> transacoes = transacaoRepository.findByAlunoIdOrderByDataHoraDesc(alunoId)
                .stream().map(TransacaoResponseDTO::new).collect(Collectors.toList());
        return new ExtratoResponseDTO(a.getSaldoMoedas(), transacoes);
    }

    private void atualizarCotaSemestralSeNecessario(Professor p) {
        LocalDate hoje = LocalDate.now();
        int anoAtual = hoje.getYear();
        int semestreAtual = (hoje.getMonthValue() <= 6) ? 1 : 2;

        Integer anoUlt = p.getUltimaCotaAno();
        Integer semUlt = p.getUltimaCotaSemestre();

        int idxAtual = anoAtual * 2 + semestreAtual;
        int idxUlt = (anoUlt == null || semUlt == null) ? (idxAtual - 1) : (anoUlt * 2 + semUlt);

        int diferenca = idxAtual - idxUlt;
        if (diferenca > 0) {
            // Credita 1000 por semestre pendente
            int credito = 1000 * diferenca;
            p.setSaldoMoedas(p.getSaldoMoedas() + credito);
            p.setUltimaCotaAno(anoAtual);
            p.setUltimaCotaSemestre(semestreAtual);
            professorRepository.save(p);
        }
    }
}
