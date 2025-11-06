package com.moedaestudantil.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class VantagemRequestDTO {

  @NotBlank
  private String titulo;

  private String descricao;

  @NotNull
  @Min(0)
  private Integer precoMoedas;

  private String fotoUrl;

  @NotNull
  private Long empresaParceiraId;

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

  public Long getEmpresaParceiraId() {
    return empresaParceiraId;
  }

  public void setEmpresaParceiraId(Long empresaParceiraId) {
    this.empresaParceiraId = empresaParceiraId;
  }
}
