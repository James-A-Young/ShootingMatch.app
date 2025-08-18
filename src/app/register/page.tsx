"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { GoogleIcon, MicrosoftIcon } from "@/components/icons";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const confirm = confirmRef.current?.value;
        if (!email || !password || !confirm) {
            setError("All fields are required");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        setLoading(false);
        if (res.ok) {
            router.push("/login");
        } else {
            const data = await res.json();
            setError(data.error || "Registration failed");
        }
    };

    const handleOAuth = (provider: "google" | "microsoft") => {
        window.location.href = `/api/auth/oauth/${provider}`;
    };

    return (
        <div className="flex min-h-[calc(100vh-11rem)] items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Register</CardTitle>
                    <CardDescription>
                        Create an account to start managing your club.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-6">
                        <Button variant="outline" type="button" onClick={() => handleOAuth("google")}
                            disabled={loading}>
                            <GoogleIcon className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                        <Button variant="outline" type="button" onClick={() => handleOAuth("microsoft")}
                            disabled={loading}>
                            <MicrosoftIcon className="mr-2 h-4 w-4" />
                            Microsoft
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <form className="grid gap-4" onSubmit={handleRegister}>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required ref={emailRef} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required ref={passwordRef} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" required ref={confirmRef} />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="underline hover:text-primary">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
