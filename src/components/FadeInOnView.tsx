"use client";

import { useEffect, useRef, useState } from "react";

export default function FadeInOnView({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?:string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element); // animate only once
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -15% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}