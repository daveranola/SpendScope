"use client";

import { useEffect, useState } from "react";

type Props = {
  triggerKey: string;
  children: React.ReactNode;
};

export function FadeInSection({ triggerKey, children }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 200ms ease, transform 200ms ease",
      }}
      className="space-y-6"
    >
      {children}
    </div>
  );
}
