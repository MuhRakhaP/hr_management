import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";
import "./login.css";

// Bagian: Basic Validation
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 6;

export default function Auth() {
  const navigate = useNavigate();
  // Bagian: Asumsi Auth
  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // Bagian: State Error
  const [errors, setErrors] = useState({});

  // Bagian: Redirect Login
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Bagian: Handle Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Bagian: Handle Submit
  const handleSubmit = async (e) => {
    // Bagian: Handle Submit Event
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Bagian: Logika Login
      const result = await signIn(formData.email, formData.password);

      if (!result.success) {
        toast.error(result.message || "Login failed.");
        return;
      }

      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      // Bagian: Error Lainnya
      toast.error("Terjadi kesalahan yang tidak terduga.");
      console.error("Kesalahan: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-card">
          <div className="login-logo">
            <span>HR</span>
          </div>
          <div className="login-heading">
            <h1>Welcome Back</h1>
            <p>Sign in to your HR Management Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="field-with-icon">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="field-password-toggle"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="field-error">{errors.password}</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <>
                  <span className="spinner" />
                  Processing...
                </>
              ) : (
                <>
                  <LogIn />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Don’t have access? Please contact the administrator.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
