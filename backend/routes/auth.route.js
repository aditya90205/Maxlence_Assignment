import { Router } from "express";
import passport from "../config/passport.js";
import { generateTokens } from "../utils/jwt.js";

const router = Router();

// Google OAuth routes (only if Google OAuth is configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
    }),
    async (req, res) => {
      try {
        // Generate JWT tokens
        const { accessToken, refreshToken } = generateTokens({
          id: req.user.id,
        });

        // Update user with refresh token
        req.user.refreshToken = refreshToken;
        await req.user.save();

        // Redirect to frontend with tokens
        const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`;
        res.redirect(redirectUrl);
      } catch (error) {
        console.error("Google OAuth callback error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`);
      }
    }
  );
} else {
  // Fallback routes when Google OAuth is not configured
  router.get("/google", (req, res) => {
    res.status(501).json({
      success: false,
      message: "Google OAuth is not configured on this server",
    });
  });

  router.get("/google/callback", (req, res) => {
    res.status(501).json({
      success: false,
      message: "Google OAuth is not configured on this server",
    });
  });
}

export default router;
