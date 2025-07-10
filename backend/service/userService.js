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

      // Generate verification token
      const verificationToken = generateVerificationToken();
      console.log("Generated verification token:", verificationToken);

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        profileImage: profileImagePath,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      console.log(
        "User created with email:",
        email,
        "and token:",
        verificationToken
      );

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
      console.log("Verifying email with token:", token);
      console.log("Token length:", token?.length);

      // First, try to find a user with this verification token that hasn't expired
      const user = await User.findOne({
        where: {
          emailVerificationToken: token,
          emailVerificationExpires: { [Op.gt]: new Date() },
        },
      });

      console.log(
        "User found for verification:",
        user ? user.email : "No user found"
      );

      if (user) {
        // Check if user is already verified
        if (user.isEmailVerified) {
          console.log("User is already verified:", user.email);
          return user;
        }

        // Verify the user
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        console.log("Email verification successful for user:", user.email);
        return user;
      }

      // If no active token found, check for expired token
      const expiredUser = await User.findOne({
        where: {
          emailVerificationToken: token,
        },
      });

      if (expiredUser) {
        console.log("Found user with expired token:", expiredUser.email);
        console.log("Token expires at:", expiredUser.emailVerificationExpires);
        console.log("Current time:", new Date());

        // If the user is already verified, return success
        if (expiredUser.isEmailVerified) {
          console.log("User was already verified, returning success");
          return expiredUser;
        }

        throw new Error(
          "Verification token has expired. Please request a new verification email."
        );
      }

      // If no user found with this token, check if maybe this is an issue with a user that's already verified
      // but the frontend is trying to verify again (this can happen if user clicks link multiple times)
      console.log(
        "No user found with this token. This might be a token that was already used."
      );

      throw new Error(
        "Invalid verification token. This link may have already been used or is invalid."
      );
    } catch (error) {
      console.error("Email verification error:", error.message);
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

  // static async getUsers(page = 1, limit = 10, search = "") {
  //   try {
  //     const offset = (page - 1) * limit;
  //     const whereClause = search
  //       ? {
  //           [Op.or]: [
  //             { firstName: { [Op.like]: `%${search}%` } },
  //             { lastName: { [Op.like]: `%${search}%` } },
  //             { email: { [Op.like]: `%${search}%` } },
  //           ],
  //         }
  //       : {};

  //     const { rows: users, count } = await User.findAndCountAll({
  //       where: whereClause,
  //       limit: parseInt(limit),
  //       offset: parseInt(offset),
  //       order: [["createdAt", "DESC"]],
  //     });

  //     return {
  //       users,
  //       totalUsers: count,
  //       totalPages: Math.ceil(count / limit),
  //       currentPage: parseInt(page),
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  static async getUsers(page = 1, limit = 10, search = "") {
    try {
      const offset = (page - 1) * limit;
      let whereClause = { isActive: true }; // Only active users

      if (search) {
        whereClause = {
          ...whereClause,
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        };
      }

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

      // await user.update({ isActive: false });
      await user.destroy();
      return { message: "User deleted successfully" };
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

  static async resendVerificationEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("No user found with this email address");
      }

      if (user.isEmailVerified) {
        throw new Error("Email is already verified");
      }

      // Generate new verification token
      const verificationToken = generateVerificationToken();
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 hours
      await user.save();

      // Send verification email
      await this.sendVerificationEmail(user);

      return { message: "Verification email sent successfully" };
    } catch (error) {
      throw error;
    }
  }
}
