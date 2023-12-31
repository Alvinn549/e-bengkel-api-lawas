const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const { User, UserActivation } = require("../db/models");

function sendVerificationEmail(email, code) {
  // Calculate expiration time for the verification code (30 minutes from now)
  const expireTime = new Date(Date.now() + 30 * 60 * 1000);
  const expireTimeString = expireTime.toLocaleString();

  // Create a nodemailer transporter to send the email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    from: process.env.SMTP_USERNAME,
  });

  // Email content and options
  const mailOptions = {
    from: "e.bengkel.mail@gmail.com",
    to: email,
    subject: "Email Verification",
    html: `
      <div style="display: flex; justify-content: center; align-items: center;">
        <div style="background-color: #F8F9FA; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="color: #007BFF;">Welcome to Our App!</h1>
          <p>Thank you for registering an account with us.</p>
        <div style="background-color: #FFFFFF; padding: 10px; border-radius: 5px; margin-bottom: 10px; display: inline-block; width: 200px;">
          <h2 style="color: #DC3545;">${code}</h2>
        </div>
          <p>To complete your registration, please enter the above verification code.</p>
          <p>Code will expire in 30 minutes</p>
          <p style="margin-top: 10px;">Please note that the verification code will expire on <strong>${expireTimeString}</strong>.</p>
        </div>
      </div>
      `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
      return false;
    }
    console.log("Verification email sent");
    return true;
  });
}

async function verifyEmail(req, res) {
  try {
    const { email, code: verificationCode } = req.body;

    // Find the user with the provided email, including activation details
    const user = await User.findOne({
      where: { email },
      include: {
        model: UserActivation,
        as: "activation",
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isActive) {
      return res.json({ message: "Email already verified" });
    }

    const match = await bcrypt.compare(verificationCode, user.activation.code);

    if (!match) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    const { expireAt } = user.activation;

    // Check if the verification code has expired
    if (expireAt && expireAt < new Date()) {
      return res
        .status(400)
        .json({ message: "Verification code has expired!" });
    }

    // Mark the user as active and delete the activation record
    user.isActive = true;
    await user.save();
    await user.activation.destroy();

    return res.json({ message: "Email verification successful" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}

// Function to resend a verification email
async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;

    // Find the user with the provided email, including activation details
    const user = await User.findOne({
      where: { email },
      include: {
        model: UserActivation,
        as: "activation",
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isActive) {
      return res.json({ message: "Email already verified" });
    }

    // Generate a new verification code and salt for hashing
    const currentTime = new Date();
    const verificationCode = randomstring.generate(6);
    const salt = await bcrypt.genSalt(10);

    try {
      // Send a new verification email
      sendVerificationEmail(email, verificationCode);

      user.activation.code = await bcrypt.hash(verificationCode, salt);
      user.activation.expireAt = new Date(
        currentTime.getTime() + 30 * 60 * 1000,
      ); // Expiration time (30 minutes from now)

      await user.activation.save();
    } catch (error) {
      console.error(error);
    }

    return res.status(201).json({
      message: "Kode Berhasil di kirim!",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail,
};
