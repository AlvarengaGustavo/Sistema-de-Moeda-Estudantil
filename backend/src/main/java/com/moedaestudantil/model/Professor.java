package com.moedaestudantil.model;

import javax.persistence.*;

@Entity
@Table(name = "professores", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "email" }),
    @UniqueConstraint(columnNames = { "cpf" })
})
public class Professor {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String nome;

  @Column(nullable = false, unique = true)
  private String cpf;

  @Column(nullable = false)
  private String departamento;

  @ManyToOne(optional = false)
  @JoinColumn(name = "instituicao_id")
  private Instituicao instituicao;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String senha;

  @Column(nullable = false)
  private Integer saldoMoedas = 0;

  // controle de crédito semestral (1 ou 2)
  private Integer ultimaCotaAno;
  private Integer ultimaCotaSemestre; // 1: jan-jun, 2: jul-dez

  public Professor() {
  }

  public Professor(String nome, String cpf, String departamento, String instituicao, String email, String senha) {
    this.nome = nome;
    this.cpf = cpf;
    this.departamento = departamento;
    this.email = email;
    this.senha = senha;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getCpf() {
    return cpf;
  }

  public void setCpf(String cpf) {
    this.cpf = cpf;
  }

  public String getDepartamento() {
    return departamento;
  }

  public void setDepartamento(String departamento) {
    this.departamento = departamento;
  }

  public Instituicao getInstituicao() {
    return instituicao;
  }

  public void setInstituicao(Instituicao instituicao) {
    this.instituicao = instituicao;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getSenha() {
    return senha;
  }

  public void setSenha(String senha) {
    this.senha = senha;
  }

  public Integer getSaldoMoedas() {
    return saldoMoedas;
  }

  public void setSaldoMoedas(Integer saldoMoedas) {
    this.saldoMoedas = saldoMoedas;
  }

  public Integer getUltimaCotaAno() {
    return ultimaCotaAno;
  }

  public void setUltimaCotaAno(Integer ultimaCotaAno) {
    this.ultimaCotaAno = ultimaCotaAno;
  }

  public Integer getUltimaCotaSemestre() {
    return ultimaCotaSemestre;
  }

  public void setUltimaCotaSemestre(Integer ultimaCotaSemestre) {
    this.ultimaCotaSemestre = ultimaCotaSemestre;
  }
}
