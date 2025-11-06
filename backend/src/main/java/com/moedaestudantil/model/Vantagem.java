package com.moedaestudantil.model;

import javax.persistence.*;

@Entity
@Table(name = "vantagens")
public class Vantagem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String titulo;

  @Column(columnDefinition = "TEXT")
  private String descricao;

  @Column(nullable = false)
  private Integer precoMoedas;

  private String fotoUrl;

  @ManyToOne
  @JoinColumn(name = "empresa_id")
  private EmpresaParceira empresaParceira;

  public Vantagem() {
  }

  public Vantagem(String titulo, String descricao, Integer precoMoedas, String fotoUrl,
      EmpresaParceira empresaParceira) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.precoMoedas = precoMoedas;
    this.fotoUrl = fotoUrl;
    this.empresaParceira = empresaParceira;
  }

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

  public EmpresaParceira getEmpresaParceira() {
    return empresaParceira;
  }

  public void setEmpresaParceira(EmpresaParceira empresaParceira) {
    this.empresaParceira = empresaParceira;
  }
}
