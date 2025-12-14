export const getStudentRewardEmail = (
  studentName: string,
  qrCodeUrl: string,
  rewardName: string,
  companyName: string,
) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Seu resgate está pronto!</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; padding:0; font-family: Arial,sans-serif; background-color: #f4f6f8; }
    .container { max-width:600px; margin:20px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1); }
    .header { text-align:center; padding:20px; background-color:#4a90e2; }
    .header img { width:120px; }
    .content { padding:30px; text-align:center; }
    h1 { color:#333; font-size:24px; margin-bottom:10px; }
    p { color:#555; font-size:16px; line-height:1.5; }
    .qr-code { margin:25px 0; }
    .qr-code img { width:180px; height:180px; border-radius:12px; }
    .footer { text-align:center; font-size:12px; color:#999; padding:15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://raw.githubusercontent.com/andre-jales/moeda-estudantil/refs/heads/main/moeda-estudantil-app/public/logo.png" alt="Logo do Sistema">
    </div>
    <div class="content">
      <h1>Seu resgate está pronto!</h1>
      <p>Olá <strong>${studentName}</strong>, você resgatou a vantagem "<strong>${rewardName}</strong>" na empresa <strong>${companyName}</strong>.</p>
      <p>Apresente o QR code abaixo na empresa para validar seu resgate:</p>
      <div class="qr-code">
        <img src="${qrCodeUrl}" alt="QR Code do resgate">
      </div>
    </div>
    <div class="footer">
      © 2025 Sistema de Moedas
    </div>
  </div>
</body>
</html>
`;
