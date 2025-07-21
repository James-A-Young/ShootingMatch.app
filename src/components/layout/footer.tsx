import { Target } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-card">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <Link href="/" className="flex items-center space-x-2">
                        <Target className="h-6 w-6 text-primary" />
                        <p className="text-lg font-bold">ShootingMatch.App</p>
                    </Link>
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © {new Date().getFullYear()} All Rights Reserved.
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                        Terms of Service
                    </Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}
