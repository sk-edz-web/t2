import React, { useState } from "react";
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider,
  saveUserProfileToFirestore 
} from "../data";
import { UserProfile } from "../types";
import { 
  Key, 
  Mail, 
  Lock, 
  User, 
  HelpCircle, 
  Check, 
  Sparkles, 
  AlertTriangle 
} from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: (userId: string, initialProfile: UserProfile) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration extras
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate username characters: Forbidden & ! ? / } { ] [ \ |
  const validateUsername = (val: string) => {
    const forbidden = /[&!?/}{\[\]\\|]/g;
    return !forbidden.test(val);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isRegister) {
        // Enforce validations
        if (!validateUsername(username)) {
          setErrorMsg("Usernames cannot include specific symbols like & ! ? / } { ] [ \\ |");
          setLoading(false);
          return;
        }
        if (!name.trim() || !username.trim()) {
          setErrorMsg("Please fill out both Name and Username fields.");
          setLoading(false);
          return;
        }

        // Create user authentication
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          name: name.trim(),
          username: username.trim().toLowerCase(),
          bio: "Just joined the Get Ready With Us training platform!",
          contact: contact.trim() || email,
          hideContactPublic: false,
          followers: [],
          following: [],
          profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        };

        // Save initial user specs directly to Firestore
        await saveUserProfileToFirestore(cred.user.uid, newProfile);
        onLoginSuccess(cred.user.uid, newProfile);
      } else {
        // Regular Login
        const cred = await signInWithEmailAndPassword(auth, email, password);
        // The App component listens in real-time to profiles, so we just trigger login
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Authentication failed. Clear your parameters and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const emailVal = cred.user.email || "";
      const emailPrefix = emailVal.split("@")[0] || "student";
      const userTag = emailPrefix.replace(/[^a-zA-Z0-9_]/g, "");

      const initialProfileData: UserProfile = {
        uid: cred.user.uid,
        name: cred.user.displayName || "Verified Student",
        username: userTag.toLowerCase(),
        bio: "Exploring tech, design, and analytics skills in real-time.",
        contact: emailVal,
        hideContactPublic: false,
        followers: [],
        following: [],
        profileImage: cred.user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      };

      // Merge / create on first time
      await saveUserProfileToFirestore(cred.user.uid, initialProfileData);
      onLoginSuccess(cred.user.uid, initialProfileData);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Google Authentication popup closed or rejected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-6 shadow-md">
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/25 text-emerald-500 flex items-center justify-center mx-auto">
          <Key className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100 uppercase">
          {isRegister ? "Join Get Ready With Us" : "Student Verification Portal"}
        </h3>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
          {isRegister 
            ? "Configure your career path card details to log inside skedz real-time sandbox" 
            : "Sign in with your verified email parameters to synchronize educational states"}
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-500/10 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-500/15 rounded-xl text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleEmailAuth} className="space-y-4 text-xs font-medium">
        {/* Email Address */}
        <div>
          <label className="block text-neutral-500 mb-1">Email Coordinates</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-neutral-400">
              <Mail className="w-4 h-4" />
            </span>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., student@getready.com"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-neutral-500 mb-1">Secure Password</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-neutral-400">
              <Lock className="w-4 h-4" />
            </span>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isRegister ? "At least 6 characters..." : "Enter your secret password"}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Dynamic fields strictly requested by user for registering */}
        {isRegister && (
          <div className="space-y-4 border-t border-dashed border-neutral-100 dark:border-neutral-800 pt-3.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Register Bio Metrics</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Username Tag</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. johnd_92"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-500 mb-1">Phone / Telegram Contact ID (Optional)</label>
              <input 
                type="text" 
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g., +1-555-0199 or @telegram_handle"
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Form Actions */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-md shadow-emerald-500/10 text-xs cursor-pointer"
        >
          {loading ? "Establishing handshake..." : (isRegister ? "Launch Account Portfolio" : "Verify Profile Identity")}
        </button>
      </form>

      {/* Social Verification Separator */}
      <div className="relative flex items-center justify-center border-t border-neutral-150 dark:border-neutral-800 pt-4 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
        <span className="bg-white dark:bg-neutral-900 px-3 absolute -top-2">or securely proceed with</span>
      </div>

      {/* Google Provider Auth */}
      <button
        onClick={handleGoogleAuth}
        disabled={loading}
        className="w-full py-3 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl flex items-center justify-center gap-2 transition text-xs cursor-pointer"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.23 1.258 15.5 0 12.24 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.918 0 11.52-4.86 11.52-11.727 0-.789-.085-1.397-.188-1.988H12.24z"/>
        </svg>
        <span>Google Single Sign-On</span>
      </button>

      {/* Login Toggle Options */}
      <div className="text-center">
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setErrorMsg("");
          }}
          className="text-xs font-bold text-emerald-500 hover:underline"
        >
          {isRegister ? "Already hold an identity? Sign In instead" : "Unlock fresh candidate slot - Create Account"}
        </button>
      </div>
    </div>
  );
}
