// src/components/layout/Logo.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center shrink-0">
      <div className="relative h-16 w-14">
        <Image
          src="/sellkoro.png"
          alt="SellKoro"
          fill
          priority
          sizes="160px"
          className="object-contain"
        />
      </div>
    </Link>
  );
}