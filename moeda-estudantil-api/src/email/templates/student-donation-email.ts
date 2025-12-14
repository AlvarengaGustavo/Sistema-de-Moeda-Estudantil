export const getStudentDonationEmail = (
  studentName: string,
  teacherName: string,
  quantity: number,
  reason: string,
) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Você recebeu uma doação!</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; padding:0; font-family: Arial,sans-serif; background-color:#f4f6f8; }
    .container { max-width:600px; margin:20px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1); }
    .header { text-align:center; padding:20px; background-color:#4a90e2; }
    .header img { width:120px; }
    .content { padding:30px; text-align:center; }
    h1 { color:#333; font-size:24px; margin-bottom:10px; }
    p { color:#555; font-size:16px; line-height:1.5; }
    .footer { text-align:center; font-size:12px; color:#999; padding:15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://raw.githubusercontent.com/andre-jales/moeda-estudantil/refs/heads/main/moeda-estudantil-app/public/logo.png" alt="Logo do Sistema">
    </div>
    <div class="content">
      <h1>Você recebeu uma doação!</h1>
      <p>Olá <strong>${studentName}</strong>, o professor <strong>${teacherName}</strong> enviou <strong>${quantity}</strong> moedas para você.</p>
      <p>Motivo: <em>${reason}</em></p>
    </div>
    <div class="footer">
      © 2025 Sistema de Moedas
    </div>
  </div>
</body>
</html>
`;
