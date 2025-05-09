import { useState } from "react";
import { cn } from "@/lib/utils";

type FlowStep = {
  id: number;
  title: string;
  description: string;
};

const steps: FlowStep[] = [
  {
    id: 1,
    title: "Input Embedding",
    description: "Words are converted to vectors and combined with positional encodings.",
  },
  {
    id: 2,
    title: "Encoder Processing",
    description: "Self-attention and feed-forward networks process the input sequence.",
  },
  {
    id: 3,
    title: "Decoder Processing",
    description: "Decoder uses encoder outputs and previously generated tokens to produce next outputs.",
  },
];

export default function TransformerFlow() {
  const [activeStep, setActiveStep] = useState(1);

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleNextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <h4 className="font-medium">Step-by-Step Processing</h4>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevStep}
            disabled={activeStep === 1}
            className="text-neutral-600 hover:text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>
          <button
            onClick={handleNextStep}
            disabled={activeStep === steps.length}
            className="text-neutral-600 hover:text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step) => (
            <div key={step.id} className="flow-step">
              <div
                className={cn(
                  "bg-neutral-100 rounded-lg p-4 h-full",
                  activeStep === step.id && "border-2 border-primary-500"
                )}
              >
                <div className="text-center mb-3">
                  <span
                    className={cn(
                      "inline-block rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium text-white",
                      activeStep === step.id ? "bg-primary-600" : "bg-neutral-400"
                    )}
                  >
                    {step.id}
                  </span>
                </div>
                <h5 className="font-medium text-center mb-2">{step.title}</h5>
                <p className="text-sm text-neutral-600 text-center">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium",
                  activeStep === step.id
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700",
                  step.id === 1 && "rounded-l-lg",
                  step.id === steps.length && "rounded-r-lg"
                )}
              >
                Step {step.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
