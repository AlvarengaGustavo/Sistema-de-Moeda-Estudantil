package com.moedaestudantil.dto;

import java.util.List;

public class ExtratoResponseDTO {
  private Integer saldoAtual;
  private List<TransacaoResponseDTO> transacoes;

  public ExtratoResponseDTO() {
  }

  public ExtratoResponseDTO(Integer saldoAtual, List<TransacaoResponseDTO> transacoes) {
    this.saldoAtual = saldoAtual;
    this.transacoes = transacoes;
  }

  public Integer getSaldoAtual() {
    return saldoAtual;
  }

  public void setSaldoAtual(Integer saldoAtual) {
    this.saldoAtual = saldoAtual;
  }

  public List<TransacaoResponseDTO> getTransacoes() {
    return transacoes;
  }

  public void setTransacoes(List<TransacaoResponseDTO> transacoes) {
    this.transacoes = transacoes;
  }
}
