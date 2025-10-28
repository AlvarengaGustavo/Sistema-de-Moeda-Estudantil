package com.moedaestudantil.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
public class Transacao {

  public enum TipoTransacao {
    ENVIO, // envio de moedas do professor para o aluno
    TROCA // troca de vantagens (futuro)
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private LocalDateTime dataHora;

  @ManyToOne(optional = false)
  @JoinColumn(name = "professor_id")
  private Professor professor;

  @ManyToOne(optional = false)
  @JoinColumn(name = "aluno_id")
  private Aluno aluno;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TipoTransacao tipo;

  @Column(nullable = false)
  private Integer valor;

  @Column(nullable = false, length = 1000)
  private String mensagem;

  public Transacao() {
  }

  public Transacao(LocalDateTime dataHora, Professor professor, Aluno aluno, TipoTransacao tipo, Integer valor,
      String mensagem) {
    this.dataHora = dataHora;
    this.professor = professor;
    this.aluno = aluno;
    this.tipo = tipo;
    this.valor = valor;
    this.mensagem = mensagem;
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

  public Professor getProfessor() {
    return professor;
  }

  public void setProfessor(Professor professor) {
    this.professor = professor;
  }

  public Aluno getAluno() {
    return aluno;
  }

  public void setAluno(Aluno aluno) {
    this.aluno = aluno;
  }

  public TipoTransacao getTipo() {
    return tipo;
  }

  public void setTipo(TipoTransacao tipo) {
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
