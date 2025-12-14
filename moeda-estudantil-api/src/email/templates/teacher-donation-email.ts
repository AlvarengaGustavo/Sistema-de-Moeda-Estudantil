export const getTeacherDonationEmail = (
  studentName: string,
  teacherName: string,
  quantity: number,
  reason: string,
) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Doação enviada</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family:Arial,sans-serif; }
    .container {
      max-width:600px;
      margin:24px auto;
      background:#fff;
      border-radius:14px;
      overflow:hidden;
      box-shadow:0 6px 20px rgba(0,0,0,0.08);
    }
    .header {
      background:linear-gradient(135deg,#4a90e2,#357abd);
      padding:24px;
      text-align:center;
    }
    .header img { width:120px; }
    .content { padding:32px; text-align:center; }
    h1 { color:#2d2d2d; font-size:24px; }
    p { color:#555; font-size:16px; line-height:1.6; }
    .highlight {
      background:#f7f9fc;
      border-radius:12px;
      padding:20px;
      margin:24px 0;
    }
    .footer {
      text-align:center;
      font-size:12px;
      color:#999;
      padding:16px;
      background:#fafafa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://raw.githubusercontent.com/andre-jales/moeda-estudantil/refs/heads/main/moeda-estudantil-app/public/logo.png" alt="Logo">
    </div>

    <div class="content">
      <h1>✅ Doação realizada!</h1>
      <p>Olá <strong>${teacherName}</strong>,</p>
      <p>Sua doação foi enviada com sucesso.</p>

      <div class="highlight">
        <p><strong>Aluno:</strong> ${studentName}</p>
        <p><strong>Quantidade:</strong> ${quantity} moedas</p>
        <p><strong>Motivo:</strong> <em>${reason}</em></p>
      </div>

      <p>Obrigado por incentivar e reconhecer seus alunos 💙</p>
    </div>

    <div class="footer">
      © 2025 Sistema de Moedas
    </div>
  </div>
</body>
</html>`;
