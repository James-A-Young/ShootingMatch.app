import type { SVGProps } from "react";

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M20.941 11.001c.143.68.225 1.383.225 2.103 0 5.912-4.575 10.376-10.45 10.376S.266 19.014.266 13.102.266 2.727 6.18 2.727c3.12 0 5.485 1.233 6.96 2.628l-2.733 2.628c-.785-.74-2.008-1.523-4.227-1.523-3.692 0-6.43 3.033-6.43 6.643s2.738 6.643 6.43 6.643c4.27 0 5.76-2.99 6.035-4.575h-6.035v-3.8H20.94z" />
        </svg>
    )
}

export function MicrosoftIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M11.53 2.1L1.17 3.93v9.42h10.36V2.1zm0 19.8v-9.43H1.17v9.43h10.36zm1.36-19.8v9.42h10.36V3.93L12.89 2.1zm0 19.8h10.36v-9.43H12.89v9.43z" />
        </svg>
    )
}
