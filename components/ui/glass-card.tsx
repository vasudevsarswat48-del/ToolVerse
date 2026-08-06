import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverEffect = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-6 relative overflow-hidden",
        hoverEffect && "glass-panel-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};