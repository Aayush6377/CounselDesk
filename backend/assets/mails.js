import { frontend } from "../server.js";

export const otpMailContent = (otp) => ({
    subject: "Your OTP for CounselDesk - Account Verification",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #E8D7B5; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #A89166; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">CounselDesk</h1>
        <p style="margin: 0; font-size: 14px;">Your AI Legal Assistant</p>
      </div>
      <div style="padding: 30px; text-align: center; background-color: #ffffff;">
        <h2 style="color: #1A1A1A;">OTP Verification</h2>
        <p style="font-size: 16px; color: #1A1A1A; line-height: 1.6;">Hello,</p>
        <p style="font-size: 16px; color: #1A1A1A; line-height: 1.6;">Your One-Time Password (OTP) for account verification is:</p>
        <div style="background-color: #E8D7B5; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h1 style="margin: 0; font-size: 32px; color: #A89166; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="font-size: 14px; color: #1A1A1A; opacity: 0.8;">This OTP is valid for 2 minutes.</p>
        <p style="font-size: 14px; color: #1A1A1A; opacity: 0.8;">Do not share this OTP with anyone.</p>
      </div>
      <div style="background-color: #E8D7B5; color: #1A1A1A; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">&copy; 2025 CounselDesk. All rights reserved.</p>
        <p style="margin: 5px 0 0;">If you did not request this, please ignore this email.</p>
      </div>
    </div>
  `
});

export const welcomeMailContent = (userName) => ({
    subject: "Welcome to CounselDesk! Your AI Legal Assistant Awaits.",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #E8D7B5; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #A89166; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">CounselDesk</h1>
        <p style="margin: 0; font-size: 14px;">Your AI Legal Assistant</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff; line-height: 1.6;">
        <h2 style="color: #1A1A1A; text-align: center;">Welcome to the Future of Legal Assistance</h2>
        <p style="font-size: 16px; color: #1A1A1A;">Hello ${userName},</p>
        <p style="font-size: 16px; color: #1A1A1A;">
          We are thrilled to have you join the CounselDesk community. Your account has been successfully created, and you're now ready to explore a smarter, simpler way to handle your legal queries.
        </p>
        <h3 style="color: #1A1A1A; border-bottom: 2px solid #E8D7B5; padding-bottom: 5px; margin-top: 30px;">What You Can Do Now:</h3>
        <ul style="font-size: 16px; color: #1A1A1A; list-style-type: none; padding-left: 0;">
            <li style="padding: 5px 0;">✔&nbsp; Get instant answers to complex legal questions.</li>
            <li style="padding: 5px 0;">✔&nbsp; Draft legal documents with the help of our AI.</li>
            <li style="padding: 5px 0;">✔&nbsp; Connect with our network of verified legal professionals.</li>
        </ul>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${frontend}" target="_blank" style="background-color: #A89166; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">Explore Your Dashboard</a>
        </div>
        <p style="font-size: 16px; color: #1A1A1A;">
          Remember, while our AI is powerful, its advice does not constitute a legal opinion. Always consult with a qualified professional for critical matters.
        </p>
      </div>
      <div style="background-color: #E8D7B5; color: #1A1A1A; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">&copy; 2025 CounselDesk. All rights reserved.</p>
        <p style="margin: 5px 0 0;">Faridabad, Haryana, India</p>
      </div>
    </div>
  `
});

export const appointmentConfirmationMailContent = (details) => ({
    subject: `Appointment Confirmed with ${details.lawyerName} on ${details.appointmentDate}`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #E8D7B5; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #A89166; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">CounselDesk</h1>
        <p style="margin: 0; font-size: 14px;">Your AI Legal Assistant</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff; line-height: 1.6;">
        <h2 style="color: #1A1A1A; text-align: center;">Your Appointment is Confirmed!</h2>
        <p style="font-size: 16px; color: #1A1A1A;">Hello ${details.userName},</p>
        <p style="font-size: 16px; color: #1A1A1A;">
          This email confirms your booking for a legal consultation. Please find the details of your upcoming appointment below.
        </p>
        <div style="background-color: #f9f9f9; border: 1px solid #E8D7B5; border-radius: 8px; padding: 20px; margin-top: 20px;">
          <h3 style="color: #1A1A1A; border-bottom: 2px solid #E8D7B5; padding-bottom: 10px; margin-top: 0;">Appointment Details:</h3>
          <ul style="font-size: 16px; color: #1A1A1A; list-style-type: none; padding-left: 0;">
            <li style="padding: 8px 0;"><strong>Lawyer:</strong> ${details.lawyerName}</li>
            <li style="padding: 8px 0;"><strong>Date:</strong> ${details.appointmentDate}</li>
            <li style="padding: 8px 0;"><strong>Time:</strong> ${details.appointmentTime} (IST)</li>
            <li style="padding: 8px 0;"><strong>Fee Paid:</strong> ₹${details.consultationFee}</li>
          </ul>
        </div>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${frontend}/user/appointments" target="_blank" style="background-color: #A89166; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">View My Appointments</a>
        </div>
        <p style="font-size: 16px; color: #1A1A1A;">
          Please be prepared for your session at the scheduled time. If you need to reschedule or cancel, please do so through your dashboard at least 24 hours in advance.
        </p>
      </div>
      <div style="background-color: #E8D7B5; color: #1A1A1A; padding: 15px; text-align: center; font-size: 12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} CounselDesk. All rights reserved.</p>
        <p style="margin: 5px 0 0;">Faridabad, Haryana, India</p>
      </div>
    </div>
    `
});