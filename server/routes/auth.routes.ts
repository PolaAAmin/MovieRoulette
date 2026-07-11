import { Router, type Request, type Response, type NextFunction } from "express";
import { tmdbRequest } from "../tmdbClient";

const router = Router();

// The cookie stores TMDB's own session_id — we don't maintain a separate
// session store on our side. Every /me or /signout call just forwards this
// straight to TMDB.
const COOKIE_NAME = "tmdb_session_id";
const isProd = process.env.NODE_ENV === "production";

function handler(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}

interface TmdbAccount {
  id: number;
  username: string;
  name: string;
  avatar?: {
    gravatar?: { hash: string | null };
    tmdb?: { avatar_path: string | null };
  };
}

// Shape returned to the frontend. Note: TMDB's API never exposes an
// account's email address, so `email` is always "" — components should
// display `username` instead.
function toAuthUser(account: TmdbAccount) {
  const avatarPath = account.avatar?.tmdb?.avatar_path;
  const gravatarHash = account.avatar?.gravatar?.hash;
  const avatar = avatarPath
    ? `https://image.tmdb.org/t/p/w200${avatarPath}`
    : gravatarHash
    ? `https://www.gravatar.com/avatar/${gravatarHash}.jpg?s=200`
    : null;

  return {
    id: String(account.id),
    username: account.username,
    email: "",
    name: account.name || account.username,
    avatar,
  };
}

// POST /api/auth/signin
// Runs TMDB's full 3-step login flow server-side (never expose request
// tokens or credentials to the client) and stores the resulting session_id
// in an httpOnly cookie.
router.post(
  "/signin",
  handler(async (req, res) => {
    const { username, password } = req.body as { username?: string; password?: string };
    if (!username || !password) {
      res.status(400).json({ error: "Username (or email) and password are required." });
      return;
    }

    try {
      // Step 1 — create a request token
      const { request_token } = await tmdbRequest<{ request_token: string }>(
        "/authentication/token/new"
      );

      // Step 2 — validate it with the user's credentials
      const validated = await tmdbRequest<{ request_token: string }>(
        "/authentication/token/validate_with_login",
        { method: "POST", body: { username, password, request_token } }
      );

      // Step 3 — exchange the validated token for a session id
      const { session_id } = await tmdbRequest<{ session_id: string }>(
        "/authentication/session/new",
        { method: "POST", body: { request_token: validated.request_token } }
      );

      // Fetch the account this session belongs to
      const account = await tmdbRequest<TmdbAccount>("/account", {
        searchParams: { session_id },
      });

      res.cookie(COOKIE_NAME, session_id, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days; TMDB sessions don't expire on a fixed schedule
      });

      res.json({ user: toAuthUser(account) });
    } catch (err) {
      // TMDB returns 401 for bad credentials — surface a clean message either way.
      const e = err as Error & { status?: number };
      res.status(e.status === 401 || e.status === 403 ? 401 : e.status || 500).json({
        error:
          e.status === 401 || e.status === 403
            ? "Incorrect username/email or password."
            : e.message || "Sign in failed.",
      });
    }
  })
);

// GET /api/auth/me
router.get(
  "/me",
  handler(async (req, res) => {
    const sessionId = req.cookies?.[COOKIE_NAME];
    if (!sessionId) {
      res.status(401).json({ user: null });
      return;
    }

    try {
      const account = await tmdbRequest<TmdbAccount>("/account", {
        searchParams: { session_id: sessionId },
      });
      res.json({ user: toAuthUser(account) });
    } catch {
      // Session is invalid/expired on TMDB's side — drop the stale cookie
      // so the client stops treating the user as logged in.
      res.clearCookie(COOKIE_NAME);
      res.status(401).json({ user: null });
    }
  })
);

// POST /api/auth/signout
router.post(
  "/signout",
  handler(async (req, res) => {
    const sessionId = req.cookies?.[COOKIE_NAME];
    if (sessionId) {
      // Best-effort — invalidate on TMDB's side too, but don't block logout
      // on it succeeding (the cookie is cleared regardless).
      await tmdbRequest("/authentication/session", {
        method: "DELETE",
        body: { session_id: sessionId },
      }).catch(() => {});
    }
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  })
);

export default router;