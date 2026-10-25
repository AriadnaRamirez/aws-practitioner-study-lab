"use client";

import { Button } from "@/components/ui/button";
import { openOnboardingTour } from "./onboarding-host";

type OpenTourButtonProps = {
  className?: string;
  label?: string;
};

export function OpenTourButton({
  className,
  label = "Así funciona…",
}: OpenTourButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="lg"
      className={className}
      onClick={() => openOnboardingTour()}
    >
      {label}
    </Button>
  );
}
