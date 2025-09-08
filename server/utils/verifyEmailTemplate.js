const VerificationEmail = (username, otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Email Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #333;
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
          color: #444;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
          padding: 10px;
          background: #f3f3f3;
          border-radius: 5px;
          letter-spacing: 3px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Hi ${username}, Please Verify Your Email Address</h1>
        </div>
        <div class="content">
          <p>Thank you for registering with Ecommerce App. Please use the OTP below to verify your email address:</p>
          <div class="otp">${otp}</div>
          <p>If you didn’t create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Ecommerce App. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  };
  
  export default VerificationEmail;
  