interface RegistrationStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function RegistrationStepIndicator({ currentStep, totalSteps }: RegistrationStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <div
          key={s}
          className={`h-2 rounded-full transition-all ${
            s === currentStep 
              ? 'w-10 bg-primary' 
              : s < currentStep 
                ? 'w-10 bg-primary/50' 
                : 'w-10 bg-muted'
          }`}
        />
      ))}
    </div>
  );
}
