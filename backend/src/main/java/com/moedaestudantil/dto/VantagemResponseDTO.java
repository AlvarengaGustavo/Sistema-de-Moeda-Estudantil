package com.moedaestudantil.dto;

public class VantagemResponseDTO {

  private Long id;
  private String titulo;
  private String descricao;
  private Integer precoMoedas;
  private String fotoUrl;
  private Long empresaId;
  private String empresaNome;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTitulo() {
    return titulo;
  }

  public void setTitulo(String titulo) {
    this.titulo = titulo;
  }

  public String getDescricao() {
    return descricao;
  }

  public void setDescricao(String descricao) {
    this.descricao = descricao;
  }

  public Integer getPrecoMoedas() {
    return precoMoedas;
  }

  public void setPrecoMoedas(Integer precoMoedas) {
    this.precoMoedas = precoMoedas;
  }

  public String getFotoUrl() {
    return fotoUrl;
  }

  public void setFotoUrl(String fotoUrl) {
    this.fotoUrl = fotoUrl;
  }

  public Long getEmpresaId() {
    return empresaId;
  }

  public void setEmpresaId(Long empresaId) {
    this.empresaId = empresaId;
  }

  public String getEmpresaNome() {
    return empresaNome;
  }

  public void setEmpresaNome(String empresaNome) {
    this.empresaNome = empresaNome;
  }
}
