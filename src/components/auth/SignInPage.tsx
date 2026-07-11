import { useActionState, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";
import { signInSchema } from "@/features/auth/schemas";

interface SignInState {
  success: boolean;
  error: string;
  fieldErrors: Record<string, string>;
}

const initialState: SignInState = { success: false, error: "", fieldErrors: {} };

export default function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [formState, signInAction, isPending] = useActionState(
    async (_prevState: SignInState, formData: FormData): Promise<SignInState> => {
      const raw = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      };

      const parsed = signInSchema.safeParse(raw);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((issue) => {
          const key = issue.path[0] as string;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        });
        return { success: false, error: "", fieldErrors };
      }

      try {
        await signIn(parsed.data.username, parsed.data.password);
        toast.success("Welcome back!", { description: "You've been signed in" });
        navigate("/profile");
        return { success: true, error: "", fieldErrors: {} };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Sign in failed";
        toast.error(message);
        return { success: false, error: message, fieldErrors: {} };
      }
    },
    initialState
  );

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card glass-panel">
          <div className="auth-brand">
            <img src="/brandLogo.png" alt="MovieRoulette" className="auth-brand-logo" />
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in with your <strong>TMDB</strong> account to sync favourites and recommendations
          </p>

          <Form action={signInAction} noValidate className="auth-form">
            <Form.Group className="auth-field">
              <Form.Label>Username or email</Form.Label>
              <div className="auth-input-wrap">
                <i className="bi bi-person auth-input-icon" />
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="your TMDB username or email"
                  autoComplete="username"
                  disabled={isPending}
                  isInvalid={!!formState.fieldErrors.username}
                />
              </div>
              {formState.fieldErrors.username && (
                <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                  {formState.fieldErrors.username}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="auth-field">
              <Form.Label>Password</Form.Label>
              <div className="auth-input-wrap">
                <i className="bi bi-lock auth-input-icon" />
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Your password"
                  autoComplete="current-password"
                  disabled={isPending}
                  isInvalid={!!formState.fieldErrors.password}
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
                </button>
              </div>
              {formState.fieldErrors.password && (
                <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                  {formState.fieldErrors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {formState.error && <p className="text-danger small mb-3">{formState.error}</p>}

            <Button type="submit" className="auth-submit-btn" disabled={isPending}>
              {isPending ? (
                <>
                  <span className="auth-spinner" /> Signing in…
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right" /> Sign In
                </>
              )}
            </Button>

            <p className="auth-switch">
              Don't have a TMDB account?{" "}
              <button type="button" className="auth-switch-link" onClick={() => navigate("/signup")}>
                Create one
              </button>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}