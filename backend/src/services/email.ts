import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || process.env.SMTP_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.SMTP_PASS,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || '',
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('❌ Email send error:', error)
    throw error
  }
}

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string, name: string = 'User') => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; }
        .header { background: #2563EB; color: white; padding: 20px; text-align: center; }
        .otp { font-size: 32px; font-weight: bold; color: #2563EB; text-align: center; padding: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vansh Enterprises</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>Your OTP for verification is:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Vansh Enterprises. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'OTP Verification - Vansh Enterprises',
    html,
  })
}

// Send order confirmation email
export const sendOrderConfirmationEmail = async (
  email: string,
  orderDetails: any,
  name: string = 'User'
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; }
        .header { background: #22C55E; color: white; padding: 20px; text-align: center; }
        .order-details { padding: 20px; }
        .order-item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
        </div>
        <div class="order-details">
          <h2>Hello ${name},</h2>
          <p>Your order has been confirmed successfully.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <p><strong>Order ID:</strong> ${orderDetails.orderNumber || 'N/A'}</p>
            <p><strong>Product:</strong> ${orderDetails.productName || 'N/A'}</p>
            <p><strong>Quantity:</strong> ${orderDetails.quantity || 0} KG</p>
            <p><strong>Company:</strong> ${orderDetails.companyName || 'N/A'}</p>
            <p><strong>City:</strong> ${orderDetails.city || 'N/A'}</p>
          </div>
          <p>We will process your order and get back to you shortly.</p>
          <p>Thank you for choosing Vansh Enterprises!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Vansh Enterprises. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderDetails.orderNumber || 'Vansh Enterprises'}`,
    html,
  })
}
