package com.moedaestudantil.dto;

import com.moedaestudantil.model.Transacao;

import java.time.LocalDateTime;

public class TransacaoResponseDTO {
  private Long id;
  private LocalDateTime dataHora;
  private Long professorId;
  private String professorNome;
  private Long alunoId;
  private String alunoNome;
  private String tipo;
  private Integer valor;
  private String mensagem;

  public TransacaoResponseDTO() {
  }

  public TransacaoResponseDTO(Transacao t) {
    this.id = t.getId();
    this.dataHora = t.getDataHora();
    this.professorId = t.getProfessor().getId();
    this.professorNome = t.getProfessor().getNome();
    this.alunoId = t.getAluno().getId();
    this.alunoNome = t.getAluno().getNome();
    this.tipo = t.getTipo().name();
    this.valor = t.getValor();
    this.mensagem = t.getMensagem();
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public LocalDateTime getDataHora() {
    return dataHora;
  }

  public void setDataHora(LocalDateTime dataHora) {
    this.dataHora = dataHora;
  }

  public Long getProfessorId() {
    return professorId;
  }

  public void setProfessorId(Long professorId) {
    this.professorId = professorId;
  }

  public String getProfessorNome() {
    return professorNome;
  }

  public void setProfessorNome(String professorNome) {
    this.professorNome = professorNome;
  }

  public Long getAlunoId() {
    return alunoId;
  }

  public void setAlunoId(Long alunoId) {
    this.alunoId = alunoId;
  }

  public String getAlunoNome() {
    return alunoNome;
  }

  public void setAlunoNome(String alunoNome) {
    this.alunoNome = alunoNome;
  }

  public String getTipo() {
    return tipo;
  }

  public void setTipo(String tipo) {
    this.tipo = tipo;
  }

  public Integer getValor() {
    return valor;
  }

  public void setValor(Integer valor) {
    this.valor = valor;
  }

  public String getMensagem() {
    return mensagem;
  }

  public void setMensagem(String mensagem) {
    this.mensagem = mensagem;
  }
}
