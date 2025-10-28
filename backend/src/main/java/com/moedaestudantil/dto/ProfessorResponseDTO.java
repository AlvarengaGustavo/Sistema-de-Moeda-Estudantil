package com.moedaestudantil.dto;

import com.moedaestudantil.model.Professor;

public class ProfessorResponseDTO {
  private Long id;
  private String nome;
  private String cpf;
  private String departamento;
  private String instituicao;
  private String email;
  private Integer saldoMoedas;

  public ProfessorResponseDTO() {
  }

  public ProfessorResponseDTO(Professor p) {
    this.id = p.getId();
    this.nome = p.getNome();
    this.cpf = p.getCpf();
    this.departamento = p.getDepartamento();
    this.instituicao = p.getInstituicao() != null ? p.getInstituicao().getNome() : null;
    this.email = p.getEmail();
    this.saldoMoedas = p.getSaldoMoedas();
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

  public String getInstituicao() {
    return instituicao;
  }

  public void setInstituicao(String instituicao) {
    this.instituicao = instituicao;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Integer getSaldoMoedas() {
    return saldoMoedas;
  }

  public void setSaldoMoedas(Integer saldoMoedas) {
    this.saldoMoedas = saldoMoedas;
  }
}
