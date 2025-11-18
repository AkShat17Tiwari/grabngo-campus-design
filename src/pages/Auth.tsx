import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail, Lock, Chrome, User, Phone } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");
const phoneSchema = z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number");

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"customer" | "vendor_staff" | "admin">("customer");
  const [signupErrors, setSignupErrors] = useState<{ 
    name?: string; 
    phone?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string 
  }>({});

  useEffect(() => {
    // Check if user is already logged in and redirect based on role
    const checkSessionAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch user role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        if (roleData) {
          redirectBasedOnRole(roleData.role);
        } else {
          navigate("/");
        }
      }
    };

    checkSessionAndRedirect();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === 'SIGNED_IN') {
        // Small delay to ensure role is created
        setTimeout(async () => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          if (roleData) {
            redirectBasedOnRole(roleData.role);
          } else {
            navigate("/");
          }
        }, 500);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'vendor_staff':
        navigate('/vendor');
        break;
      case 'customer':
      default:
        navigate('/');
        break;
    }
  };

  const validateLoginForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(loginEmail);
    } catch (e) {
      if (e instanceof z.ZodError) {
        errors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(loginPassword);
    } catch (e) {
      if (e instanceof z.ZodError) {
        errors.password = e.errors[0].message;
      }
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = () => {
    const errors: { 
      name?: string; 
      phone?: string; 
      email?: string; 
      password?: string; 
      confirmPassword?: string 
    } = {};
    
    try {
      nameSchema.parse(signupName);
    } catch (e) {
      if (e instanceof z.ZodError) {
        errors.name = e.errors[0].message;
      }
    }

    try {
      phoneSchema.parse(signupPhone);
    } catch (e) {
      if (e instanceof z.ZodError) {
        errors.phone = e.errors[0].message;
      }
    }

    try {
      emailSchema.parse(signupEmail);
    } catch (e) {
      if (e instanceof z.ZodError) {
        errors.email = e.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(signupPassword);
    } catch (e) {
      if (e instanceof z.ZodError) {
        errors.password = e.errors[0].message;
      }
    }

    if (signupPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) return;

    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: signupName,
          phone: signupPhone,
        }
      }
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Create user role after signup
    if (data.user) {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: selectedRole,
          outlet_id: selectedRole === 'vendor_staff' ? 1 : null // Default to first outlet for vendors
        });

      if (roleError) {
        console.error('Error creating user role:', roleError);
      }

      toast.success("Account created! Welcome to GrabNGo!");
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            GrabNGo
          </h1>
          <p className="text-muted-foreground">Your campus food, delivered fast</p>
        </div>

        <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-elegant animate-scale-in">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <InputField
                  label="Email"
                  type="email"
                  placeholder="your.email@college.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  error={loginErrors.email}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />
                
                <InputField
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  error={loginErrors.password}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />

                <div className="flex items-center justify-end mb-4">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary-light transition-colors"
                    onClick={() => toast.info("Password reset coming soon!")}
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                  variant="gradient"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Sign in with Google
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <InputField
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  error={signupErrors.name}
                  icon={<User className="w-4 h-4" />}
                  required
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  placeholder="9876543210"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  error={signupErrors.phone}
                  icon={<Phone className="w-4 h-4" />}
                  required
                />

                <InputField
                  label="Email"
                  type="email"
                  placeholder="your.email@college.edu"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  error={signupErrors.email}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select Role</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={selectedRole === 'customer' ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => setSelectedRole('customer')}
                    >
                      Customer
                    </Button>
                    <Button
                      type="button"
                      variant={selectedRole === 'vendor_staff' ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => setSelectedRole('vendor_staff')}
                    >
                      Vendor
                    </Button>
                    <Button
                      type="button"
                      variant={selectedRole === 'admin' ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => setSelectedRole('admin')}
                    >
                      Admin
                    </Button>
                  </div>
                </div>
                
                <InputField
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  error={signupErrors.password}
                  helperText="At least 6 characters"
                  icon={<Lock className="w-4 h-4" />}
                  required
                />

                <InputField
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={signupErrors.confirmPassword}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                  variant="gradient"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Sign up with Google
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
