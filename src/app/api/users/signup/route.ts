import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import {sendEmail} from "@/helpers/mailer"

import bcryptjs from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

connect()



export async function Post(request: NextRequest) {
    try {
        const requestBody = await request.json()
        const { username, password, email } = requestBody

        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({
                error: "User already exists"
            }, { status: 400 })
        }

        var salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt)

        const newUser = new User(
            username,
            hashPassword,
            email
        )

        const saveUser = await newUser.save()
        console.log(saveUser)
        
        await sendEmail({email: newUser.email, emailType: "VERIFY", userId: newUser._id})

        return NextResponse.json({message: "user registered successfully", success: true, saveUser}, {status: 204})
    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, { status: 400 })
    }
}