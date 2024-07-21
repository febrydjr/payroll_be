const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

exports.sendLink = async (req, res) => {
  try {
    const { email } = req.body;
    const token = jwt.sign({ email }, process.env.JWT_KEY, {
      expiresIn: "15m",
    });

    const link = `https://uku-uku.vercel.app/register/${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    await transporter.sendMail({
      from: "REGISTER NEW EMPLOYEE",
      to: email,
      subject: "Registration Link",
      html: `
          <p>Click the button below to register:</p>
          <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border: none; cursor: pointer;">
            Register
          </a>
        `,
    });

    return res
      .status(200)
      .json({ message: "Registration link sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
