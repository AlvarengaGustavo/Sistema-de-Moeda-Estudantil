package com.moedaestudantil.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
public class Transacao {

  public enum TipoTransacao {
    ENVIO,
    TROCA,
    RESGATE 
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private LocalDateTime dataHora;

  // [ALTERADO] Tornamos o professor opcional
  @ManyToOne(optional = true) 
  @JoinColumn(name = "professor_id")
  private Professor professor;

  // O Aluno ainda é obrigatório
  @ManyToOne(optional = false) 
  @JoinColumn(name = "aluno_id")
  private Aluno aluno;

  // [NOVO] Campo para rastrear a vantagem (opcional)
  @ManyToOne(optional = true)
  @JoinColumn(name = "vantagem_id")
  private Vantagem vantagem;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TipoTransacao tipo;

  @Column(nullable = false)
  private Integer valor;

  @Column(nullable = false, length = 1000)
  private String mensagem;

  public Transacao() {
  }

  // Construtor original (para Envios do Professor)
  public Transacao(LocalDateTime dataHora, Professor professor, Aluno aluno, TipoTransacao tipo, Integer valor,
      String mensagem) {
    this.dataHora = dataHora;
    this.professor = professor;
    this.aluno = aluno;
    this.tipo = tipo;
    this.valor = valor;
    this.mensagem = mensagem;
  }
  
  // [NOVO] Construtor para Resgate de Vantagem (sem professor)
  public Transacao(LocalDateTime dataHora, Aluno aluno, Vantagem vantagem, TipoTransacao tipo, Integer valor,
      String mensagem) {
    this.dataHora = dataHora;
    this.aluno = aluno;
    this.vantagem = vantagem;
    this.tipo = tipo;
    this.valor = valor;
    this.mensagem = mensagem;
    this.professor = null; // Garante que é nulo
  }

  // --- Getters e Setters ---
  
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

  // Getter/Setter para Vantagem
  public Vantagem getVantagem() {
    return vantagem;
  }

  public void setVantagem(Vantagem vantagem) {
    this.vantagem = vantagem;
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