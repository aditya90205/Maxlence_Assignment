import User from "../model/User.js";
import { Op } from "sequelize";
import { sendEmail } from "../config/email.js";
import {
  generateTokens,
  generateVerificationToken,
  generateResetToken,
} from "../utils/jwt.js";
import redis from "../config/redis.js";

export class UserService {
  static async createUser(userData, profileImagePath = null) {
    try {
      const { firstName, lastName, email, password } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        profileImage: profileImagePath,
        emailVerificationToken: generateVerificationToken(),
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      // Send verification email
      await this.sendVerificationEmail(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async loginUser(email, password) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user || !(await user.comparePassword(password))) {
        throw new Error("Invalid credentials");
      }

      if (!user.isActive) {
        throw new Error("Account is deactivated");
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens({ id: user.id });

      // Store refresh token
      user.refreshToken = refreshToken;
      user.lastLogin = new Date();
      await user.save();

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  static async sendVerificationEmail(user) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${user.emailVerificationToken}`;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Hello ${user.firstName},</p>
          <p>Thank you for registering! Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>If you didn't create an account, please ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `;

      await sendEmail(user.email, "Verify Your Email Address", emailHtml);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  }

  static async verifyEmail(token) {
    try {
      const user = await User.findOne({
        where: {
          emailVerificationToken: token,
          emailVerificationExpires: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        throw new Error("Invalid or expired verification token");
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationExpires = null;
      await user.save();

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async forgotPassword(email) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("No user found with this email address");
      }

      const resetToken = generateResetToken();
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      // Send reset email
      await this.sendPasswordResetEmail(user, resetToken);

      return { message: "Password reset email sent" };
    } catch (error) {
      throw error;
    }
  }

  static async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>Hello ${user.firstName},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `;

      await sendEmail(user.email, "Password Reset Request", emailHtml);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        where: {
          passwordResetToken: token,
          passwordResetExpires: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        throw new Error("Invalid or expired reset token");
      }

      user.password = newPassword;
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      user.refreshToken = null; // Invalidate refresh tokens
      await user.save();

      return { message: "Password reset successful" };
    } catch (error) {
      throw error;
    }
  }

  static async getUsers(page = 1, limit = 10, search = "") {
    try {
      const offset = (page - 1) * limit;
      const whereClause = search
        ? {
            [Op.or]: [
              { firstName: { [Op.like]: `%${search}%` } },
              { lastName: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      const { rows: users, count } = await User.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
      });

      return {
        users,
        totalUsers: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, updateData, profileImagePath = null) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const updates = { ...updateData };
      if (profileImagePath) {
        updates.profileImage = profileImagePath;
      }

      await user.update(updates);
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }

      await user.update({ isActive: false });
      return { message: "User deactivated successfully" };
    } catch (error) {
      throw error;
    }
  }

  static async refreshAccessToken(refreshToken) {
    try {
      const user = await User.findOne({ where: { refreshToken } });
      if (!user) {
        throw new Error("Invalid refresh token");
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens({
        id: user.id,
      });

      user.refreshToken = newRefreshToken;
      await user.save();

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw error;
    }
  }

  static async logout(userId) {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
      return { message: "Logged out successfully" };
    } catch (error) {
      throw error;
    }
  }
}
