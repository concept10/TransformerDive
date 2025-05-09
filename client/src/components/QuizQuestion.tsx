import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuizQuestionProps = {
  questionNumber: number;
  question: string;
  options: QuizOption[];
  explanation: string;
};

export default function QuizQuestion({
  questionNumber,
  question,
  options,
  explanation,
}: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = () => {
    if (!selectedOption) return;
    
    const selected = options.find(opt => opt.id === selectedOption);
    if (selected) {
      setIsCorrect(selected.isCorrect);
      setIsAnswered(true);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="border-b border-neutral-200 px-6 py-4">
        <CardTitle className="text-lg">Question {questionNumber}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="font-medium mb-4">{question}</p>
        
        <RadioGroup
          value={selectedOption || ""}
          onValueChange={setSelectedOption}
          className="space-y-3"
          disabled={isAnswered}
        >
          {options.map((option) => (
            <div key={option.id} className="flex items-center">
              <RadioGroupItem
                id={option.id}
                value={option.id}
                className={cn(
                  isAnswered && option.isCorrect && "border-green-500 text-green-500"
                )}
              />
              <Label
                htmlFor={option.id}
                className={cn(
                  "ml-3 text-sm text-neutral-700",
                  isAnswered && option.isCorrect && "text-green-700 font-medium"
                )}
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {isAnswered && (
          <div className="mt-6">
            <div className={cn(
              "border rounded-lg p-4 flex",
              isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            )}>
              <div className="flex-shrink-0">
                <i className={cn(
                  isCorrect ? "ri-check-line text-green-600" : "ri-close-line text-red-600"
                )}></i>
              </div>
              <div className="ml-3">
                <p className={cn(
                  "text-sm font-medium",
                  isCorrect ? "text-green-700" : "text-red-700"
                )}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </p>
                <p className={cn(
                  "text-sm mt-1",
                  isCorrect ? "text-green-600" : "text-red-600"
                )}>
                  {explanation}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <Button 
            onClick={handleCheck} 
            disabled={!selectedOption || isAnswered}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
          >
            Check Answer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
