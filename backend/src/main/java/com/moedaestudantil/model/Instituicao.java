package com.moedaestudantil.model;

import javax.persistence.*;

@Entity
@Table(name = "instituicoes", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "nome" })
})
public class Instituicao {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String nome;

  public Instituicao() {
  }

  public Instituicao(String nome) {
    this.nome = nome;
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
}
