const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const redisClient = require('../config/redis').client;

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessAndRefreshTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const setTokenCookies = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  auth: { 
    user: process.env.SMTP_USER || "example_user", 
    pass: process.env.SMTP_PASS || "example_pass" 
  }
});

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  console.log(`[TESTING] Verification Link for ${email}: ${url}`); 
  await transporter.sendMail({
    from: `"Maxlence Auth" <${process.env.SMTP_USER || 'noreply@app.com'}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `<p>Welcome to our app!</p><p>Please click the link below to verify your email address and activate your account:</p><a href="${url}">${url}</a>`
  });
};

const sendResetEmail = async (email, token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  console.log(`[TESTING] Password Reset Link for ${email}: ${url}`);
  await transporter.sendMail({
    from: `"Maxlence Auth" <${process.env.SMTP_USER || 'noreply@app.com'}>`,
    to: email,
    subject: "Reset Your Password",
    html: `<p>We received a request to reset your password.</p><p>Click the link below to choose a new password:</p><a href="${url}">${url}</a><p>If you did not make this request, you can ignore this email.</p>`
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: 'This email is already associated with an existing account.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(20).toString('hex');
    const profile_image = req.file ? `/uploads/${req.file.filename}` : null;

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      profile_image,
      verification_token: verificationToken,
      is_verified: false, 
    });

    if (redisClient && redisClient.isReady) {
       await redisClient.flushDb();
    }

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.is_verified = true;
    user.verification_token = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) return res.status(404).json({ message: 'User does not exist. Please create an account.' });
    if (!user.password) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.is_verified) return res.status(401).json({ message: 'Please verify your email to log in.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user.id);
    setTokenCookies(res, refreshToken);

    res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email, role: user.role, profile_image: user.profile_image } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    const decoded = jwt.decode(credential); 
    if (!decoded || !decoded.email) return res.status(400).json({ message: "Invalid Google Token" });

    const { email, name, picture, sub: google_id } = decoded;

    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      user = await User.create({
        name,
        email,
        profile_image: picture,
        google_id,
        is_verified: true,
      });

      if (redisClient && redisClient.isReady) {
         await redisClient.flushDb();
      }
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user.id);
    setTokenCookies(res, refreshToken);

    res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email, role: user.role, profile_image: user.profile_image } });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Google Authentication failed' });
  }
};

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateAccessAndRefreshTokens(decoded.id);
    setTokenCookies(res, newRefreshToken);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.reset_password_token = resetToken;
  await user.save();

  await sendResetEmail(user.email, resetToken);
  res.json({ message: 'Password reset link sent to your email' });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ where: { reset_password_token: token } });
  
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.reset_password_token = null;
  await user.save();

  res.json({ message: 'Password has been reset' });
};
