const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");

const prisma = new PrismaClient();

const register = async (userData) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp
    } = userData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !contactNumber
    ) {
      throw new Error("All fields are required");
    }
    if (password !== confirmPassword) {
      throw new Error("Password and Confirm Password do not match. Please try again.");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("User already exists. Please sign in to continue.");
    }

    // Find the most recent OTP for the email
    const response = await prisma.emailOtp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });
    console.log(response);
    if (!response) {
      throw new Error("The OTP is not valid");
    }
    
    // Verify OTP hash
    const isOtpValid = await bcrypt.compare(otp, response.otpHash);
    if (!isOtpValid) {
      throw new Error("The OTP is not valid");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: contactNumber,
        passwordHash: hashedPassword,
        photoUrl: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
      }
    });

    await prisma.authIdentity.create({
      data: {
        provider: "email_password",
        providerUid: email,
        passwordHash: hashedPassword,
        userId: user.id,
      },
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return {
      success: true,
      user,
      token,
      message: "User registered successfully",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      const token = jwt.sign(
        { email: user.email, id: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      user.passwordHash = undefined;
      return {
        success: true,
        user,
        token,
        message: "User logged in successfully",
      };
    } else {
      throw new Error("Password is incorrect");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const sendOtp = async (email) => {
  try {
    const checkUserPresent = await prisma.user.findUnique({ where: { email } });
    if (checkUserPresent) {
      throw new Error("User is Already Registered");
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    
    // Hash the OTP
    const otpHash = await bcrypt.hash(otp, 10);
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    const otpBody = await prisma.emailOtp.create({
      data: { 
        email, 
        otpHash,
        purpose: 'verify_email',
        expiresAt
      }
    });
    console.log("OTP Body", otpBody);
    
    // Send OTP via email
    await mailSender(
      email,
      "Your OTP for Email Verification",
      `<p>Your OTP code is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`
    );
    
    return {
      success: true,
      message: "OTP Sent Successfully",
      otp,
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

const changePassword = async (email, oldPassword, newPassword) => {
  try {
    // Validate input
    if (!email || !oldPassword || !newPassword) {
      throw new Error("All fields are required");
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword ,passwordUpdatedAt: new Date() },
    });

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};


const resetPasswordToken=async(email)=>{
  try {
    const user=await prisma.user.findUnique({
      where:{email}
    })
    if(!user){
      throw new Error('Email not found');
    }
    const token=crypto.randomBytes(20).toString("hex")
    const updatedDetails=await prisma.user.update({
      where:{email},
      data:{
        passwordUpdatedAt: new Date()
      }
    })
   	const url = `http://localhost:3000/update-password/${token}`;
    await mailSender(email,"Password Reset",`Your Link for email verification is ${url}. Please click this url to reset your password.`)
    return {
      success: true,
      message: 'Email sent successfully, please check your email'
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}


const resetPassword = async (password, confirmPassword, token) => {
  try {
    if (confirmPassword !== password) {
      throw new Error("Password and Confirm Password Does not Match");
    }
    
    const userDetails = await prisma.user.findFirst({ 
      where: { email: token }
    });
    
    if (!userDetails) {
      throw new Error("Token is Invalid");
    }
    
    const encryptedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: userDetails.id },
      data: { 
        passwordHash: encryptedPassword,
        passwordUpdatedAt: new Date()
      },
    });
    
    return {
      success: true,
      message: "Password Reset Successful",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { register, login , sendOtp, changePassword , resetPasswordToken ,resetPassword};



