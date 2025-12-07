"use client";

import { useState } from "react";
import { LoginDialog } from "@/components/LoginDialog";
import { SignupDialog } from "@/components/SignupDialog";

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupDialog
        open={showSignup}
        onOpenChange={setShowSignup}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
