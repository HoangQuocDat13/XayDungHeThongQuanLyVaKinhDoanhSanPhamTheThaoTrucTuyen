import React from "react";
import Image from "next/image";
import { getInitials, cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles = {
  xs: { container: "w-6 h-6 text-xs", img: 24 },
  sm: { container: "w-8 h-8 text-xs", img: 32 },
  md: { container: "w-10 h-10 text-sm", img: 40 },
  lg: { container: "w-12 h-12 text-base", img: 48 },
  xl: { container: "w-16 h-16 text-lg", img: 64 },
};

const bgColors = [
  "bg-teal-100 text-teal-800",
  "bg-blue-100 text-blue-800",
  "bg-purple-100 text-purple-800",
  "bg-orange-100 text-orange-800",
  "bg-green-100 text-green-800",
  "bg-pink-100 text-pink-800",
];

function getColorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % bgColors.length;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const { container, img } = sizeStyles[size];
  const initials = getInitials(name);
  const colorClass = bgColors[getColorIndex(name)];

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex-shrink-0 select-none",
        container,
        !src && colorClass,
        className
      )}
      title={name}
      aria-label={name}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={img}
          height={img}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-semibold leading-none">
          {initials}
        </span>
      )}
    </div>
  );
}
