const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      contactNumber,
      accountType,
      otp
      } = req.body;
    console.log(firstName, lastName, email, password);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !contactNumber ||
      !accountType ||
      !otp
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await authService.register({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      contactNumber,
      accountType,
      otp
    });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    if (error.message === "All fields are required") {
      return res.status(400).json({ error: error.message });
    }

    if (error.message === "User already exists") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Something went wrong in controller" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    if (error.message === "All fields are required") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.sendOtp(email);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    if (error.message === "User is Already Registered") {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    
    const result = await authService.changePassword(
      email,
      oldPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    if (error.message === "All fields are required") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};


const resetPassword = async(req,res)=>{
  try {
    const { password, confirmPassword, token} = req.body;
    const result = await authService.resetPassword( password, confirmPassword, token);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    if (error.message === "All fields are required") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
}

const resetPasswordToken =async(req,res)=>{
  try {
    const {email} = req.body;
    const result = await authService.resetPasswordToken(email);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    if (error.message === "All fields are required") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
}

const googleLogin = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (! id_token) {
      return res.status(400).json({ error: "idToken is required" });
    }

    const result = await authService.googleLogin(id_token);

    res.json({
      success: true,
      user: result.user,
      token: result.token,
      message: "Google login successful"
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: error.message || "Google login failed" });
  }
}




module.exports = { register, login, sendOtp, changePassword ,resetPassword ,resetPasswordToken ,googleLogin};
