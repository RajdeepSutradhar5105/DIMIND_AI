export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dimindGrad" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b6fff" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      {/* D shape */}
      <path
        d="M20 6h12c14.36 0 26 10.75 26 26S46.36 58 32 58H20V6Z"
        stroke="url(#dimindGrad)"
        strokeWidth="5.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* circuit brain half */}
      <path
        d="M20 14c-6 0-10 4.2-10 9.2 0 2 .7 3.8 1.9 5.2C10.7 29.8 10 31.6 10 33.6c0 5 4 9.2 10 9.2"
        stroke="url(#dimindGrad)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="14" cy="20" r="1.7" fill="#5a86ff" />
      <circle cx="12" cy="27" r="1.7" fill="#8b5cf6" />
      <circle cx="14" cy="36" r="1.7" fill="#d946ef" />
      <path d="M14 20h5M12 27h7M14 36h5" stroke="url(#dimindGrad)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight text-gradient ${className}`}>
      DIMIND
    </span>
  );
}
