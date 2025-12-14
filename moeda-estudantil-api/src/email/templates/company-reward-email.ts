export const getCompanyRewardEmail = (
  studentName: string,
  rewardName: string,
  companyName: string,
  date: string,
) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Resgate de vantagem recebido</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 24px auto;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #4a90e2, #357abd);
      padding: 24px;
      text-align: center;
    }
    .header img {
      width: 120px;
    }
    .content {
      padding: 32px;
      text-align: center;
    }
    h1 {
      color: #2d2d2d;
      font-size: 24px;
      margin-bottom: 12px;
    }
    p {
      color: #555;
      font-size: 16px;
      line-height: 1.6;
    }
    .card {
      background: #f7f9fc;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
      text-align: left;
    }
    .card p {
      margin: 8px 0;
      font-size: 15px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999;
      padding: 16px;
      background-color: #fafafa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://raw.githubusercontent.com/andre-jales/moeda-estudantil/refs/heads/main/moeda-estudantil-app/public/logo.png" alt="Logo do Sistema">
    </div>

    <div class="content">
      <h1>🎉 Novo resgate recebido!</h1>
      <p>Uma vantagem foi resgatada no seu estabelecimento.</p>

      <div class="card">
        <p><strong>Aluno:</strong> ${studentName}</p>
        <p><strong>Vantagem:</strong> ${rewardName}</p>
        <p><strong>Empresa:</strong> ${companyName}</p>
        <p><strong>Data:</strong> ${date}</p>
      </div>

      <p>Apresente este resgate normalmente ao aluno conforme suas regras internas.</p>
    </div>

    <div class="footer">
      © 2025 Sistema de Moedas • Todos os direitos reservados
    </div>
  </div>
</body>
</html>`;
