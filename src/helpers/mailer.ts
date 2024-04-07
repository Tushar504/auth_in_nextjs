import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import User from '@/models/userModel'
export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        let verify_uri
        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 })
            verify_uri = `${process.env.DOMAIN_NAME}/verifyemail?token=${hashedToken}`
        }
        else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 })
            verify_uri = `${process.env.DOMAIN_NAME}/resetpassword?token=${hashedToken}`
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            auth: {
              user: process.env.MAILER_USER,
              pass: process.env.MAILER_PASS
            }
          } as any);
        
        const email_message = `<p> Click <a href=${verify_uri}>here</a> to ${ emailType === "VERIFY" ? 'Verify your email': 'Reset your password'}</p>`

        const options = {
            from: 'tushar@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? 'verify your email' : 'Reset your password',
            html: email_message
        }

        const info = await transporter.sendMail(options)

        return info


    } catch (error: any) {
        throw new Error(error.message)
    }
}