package com.moedaestudantil.dto;

import com.moedaestudantil.model.Transacao;
import java.time.LocalDateTime;

/**
 * DTO para exibir transações no extrato (Aluno ou Professor).
 */
public class TransacaoResponseDTO {

    private Long id;
    private LocalDateTime dataHora;
    private String tipo;
    private Integer valor;
    private String mensagem;
    
    // Aluno (Sempre obrigatório)
    private Long alunoId;
    private String alunoNome;

    // Professor (Opcional, apenas para ENVIO)
    private Long professorId;
    private String professorNome;

    // Vantagem (Opcional, apenas para RESGATE)
    private String vantagemDescricao; // Usaremos a 'mensagem' da transação aqui
    private String empresaNome; // Nome da empresa (se for resgate)

    /**
     * Construtor que recebe a Entidade Transacao e a converte para DTO.
     */
    public TransacaoResponseDTO(Transacao t) {
        this.id = t.getId();
        this.dataHora = t.getDataHora();
        this.tipo = t.getTipo().name();
        this.valor = t.getValor();
        this.mensagem = t.getMensagem();

        // Aluno (Sempre existe, conforme o modelo)
        this.alunoId = t.getAluno().getId();
        this.alunoNome = t.getAluno().getNome();

        // --- INÍCIO DA CORREÇÃO ---
        // O erro (NullPointerException) acontecia aqui (Linha 24, segundo o seu log).
        // Agora, verificamos o tipo de transação antes de aceder aos campos.

        if (t.getTipo() == Transacao.TipoTransacao.ENVIO && t.getProfessor() != null) {
            // Se for ENVIO, a origem/destino é o Professor
            this.professorId = t.getProfessor().getId();
            this.professorNome = t.getProfessor().getNome();
            this.empresaNome = null; // Não é um resgate
        
        } else if (t.getTipo() == Transacao.TipoTransacao.RESGATE && t.getVantagem() != null) {
            // Se for RESGATE, a origem/destino é a Vantagem/Empresa
            this.professorId = null; // Professor não participa
            this.professorNome = null; 
            
            // Tenta obter o nome da empresa
            if (t.getVantagem().getEmpresaParceira() != null) {
                this.empresaNome = t.getVantagem().getEmpresaParceira().getNome();
            } else {
                this.empresaNome = "Vantagem"; // Fallback
            }
        
        } else {
            // Tipo 'TROCA' ou dados inconsistentes
            this.professorId = null;
            this.professorNome = null;
            this.empresaNome = "N/A";
        }
        // --- FIM DA CORREÇÃO ---
    }

    // Getters
    public Long getId() { return id; }
    public LocalDateTime getDataHora() { return dataHora; }
    public String getTipo() { return tipo; }
    public Integer getValor() { return valor; }
    public String getMensagem() { return mensagem; }
    public Long getAlunoId() { return alunoId; }
    public String getAlunoNome() { return alunoNome; }
    public Long getProfessorId() { return professorId; }
    public String getProfessorNome() { return professorNome; }
    public String getEmpresaNome() { return empresaNome; }
}