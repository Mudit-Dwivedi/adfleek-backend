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
      otp,
    } = req.body;
    console.log(firstName, lastName, email, password);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
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
      otp,
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

    res.status(500).json({ error: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await user.findOne({ email });
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
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
    const checkUserPresent = await user.findOne({ email });

    if (!checkUserPresent) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = await authService.sendOtp(email);
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await authService.changePassword(
      email,
      oldPassword,
      newPassword,
      confirmPassword
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

module.exports = { register, login, sendOtp, changePassword };
