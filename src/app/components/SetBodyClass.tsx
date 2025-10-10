"use client";

import { useEffect } from "react";

type Props = {
  className: string;
};

export function SetBodyClass({ className }: Props) {
  useEffect(() => {
    document.body.classList.add(className);

    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);

  return null;
}
