export const template = (code, user) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seu Código de Verificação</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* Estilos gerais e para reset */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #121212; }
        
        /* Estilos para o corpo do email */
        .container {
            font-family: 'Poppins', Arial, sans-serif; /* Fonte mais redonda */
            line-height: 1.6;
            color: #e0e0e0; 
            text-align: center; 
        }

        .main-card {
            background-color: #1E1E1E; 
            border-radius: 12px;
            padding: 40px 50px;
            max-width: 600px;
            margin: 40px auto; /* Margem para dar espaço do topo */
        }

        .header {
            text-align: center;
            padding-bottom: 30px; 
        }

        .header img {
            max-width: 150px;
        }

        .container {
            padding: 16px;
        }

        .content h2 {
            font-size: 24px;
            font-weight: bold;
            color: #ffffff; 
        }

        .verification-code-wrapper {
            background-color: #2C2C2C; 
            border-radius: 8px;
            padding: 25px; 
            text-align: center;
            margin: 30px auto; 
            max-width: 300px; 
        }

        .verification-code {
            font-size: 36px;
            font-weight: 700;
            color: #FFC107; /* Amarelo para o código */
            letter-spacing: 10px;
            margin: 10px 0;
            font-family: 'Poppins', monospace; /* Mantém a fonte arredondada */
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #a0a0a0; 
            padding-top: 30px; 
        }

        .footer a {
            color: #FFC107; /* Amarelo para os links */
            text-decoration: none;
        }

    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #121212;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
        <tr>
            <td align="center" valign="top" background="http://googleusercontent.com/file_content/1" style="background-color: #121212; background-position: center top; background-repeat: no-repeat;">

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <!-- Card Principal -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="main-card">
                                <tr>
                                    <td align="center">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <!-- Logo -->
                                            <tr>
                                                <td align="center" class="header">
                                                    <img src="https://placehold.co/150x50/FFC107/000000?text=CineLume" alt="Logo CineLume">
                                                </td>
                                            </tr>
                                            <!-- Texto -->
                                            <tr>
                                                <td align="center" class="container">
                                                    <h2>Olá${user.name ? ', ' + user.name : ''}!</h2>
                                                    <p>Obrigado por se inscrever no CineLume. Estamos felizes em ter você conosco!</p>
                                                    <p>Para concluir o processo, por favor, use o código de verificação abaixo:</p>
                                                    
                                                    <div class="verification-code-wrapper">
                                                        <p style="margin:0; font-size: 14px;">Seu código de uso único é:</p>
                                                        <p class="verification-code">${code.code}</p>
                                                    </div>
                                                    
                                                    <p>Insira este código no nosso site ou aplicativo para ativar sua conta. Note que este código é válido por um tempo limitado.</p>
                                                    <p>Se você não criou uma conta no CineLume, pode ignorar este e-mail com segurança.</p>
                                                    <br>
                                                    <p>Atenciosamente,<br>Equipe CineLume</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Seção do Rodapé -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                <tr>
                                    <td align="center" class="footer">
                                        <p>Você recebeu este e-mail porque uma conta foi criada no CineLume com este endereço.</p>
                                        <p>&copy; 2025 CineLume. Todos os direitos reservados.</p>
                                        <p><a href="#">Política de Privacidade</a> | <a href="#">Suporte</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>`;
