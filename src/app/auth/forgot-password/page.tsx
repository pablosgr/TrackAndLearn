'use client';

import { useState } from "react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import CodeResetForm from "@/components/auth/CodeResetForm";
import PasswordResetForm from "@/components/auth/PasswordResetForm";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState<string | null>(null);
    const [code, setCode] = useState<string | null>(null);

    const handleSetEmail = (newEmail: string) => {
        setEmail(newEmail);
    }

    const handleSetCode = (newCode: string) => {
        setCode(newCode);
    }

    return (
        <div className="w-full h-screen flex items-center justify-center">
            {
                !email && <ForgotPasswordForm emailUpdate={handleSetEmail}/>
            }
            {
                (email && !code) && <CodeResetForm email={email} codeUpdate={handleSetCode}/>
            }
            {
                (code && email) && <PasswordResetForm email={email}/>
            }
        </div>
    );
}
