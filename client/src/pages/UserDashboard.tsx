import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, CheckCircle, Clock, FileText, GraduationCap, Trophy } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Type for quiz completion data
type QuizSummary = {
  sectionId: string;
  sectionName: string;
  completed: boolean;
  score: number;
  totalQuestions: number;
};

// Type for section progress data
type SectionProgress = {
  id: string;
  name: string;
  completed: boolean;
  progress: number;
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch user progress data
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['/api/user/progress'],
    enabled: !!user,
  });
  
  // Mock data for the dashboard
  const quizSummaries: QuizSummary[] = [
    {
      sectionId: "intro",
      sectionName: "Introduction to Transformers",
      completed: true,
      score: 4,
      totalQuestions: 5,
    },
    {
      sectionId: "architecture",
      sectionName: "Transformer Architecture",
      completed: true,
      score: 7,
      totalQuestions: 7,
    },
    {
      sectionId: "attention",
      sectionName: "Self-Attention Mechanism",
      completed: false,
      score: 3,
      totalQuestions: 6,
    },
    {
      sectionId: "embeddings",
      sectionName: "Embeddings and Positional Encoding",
      completed: false,
      score: 0,
      totalQuestions: 4,
    },
  ];
  
  const sectionProgress: SectionProgress[] = [
    {
      id: "intro",
      name: "Introduction to Transformers",
      completed: true,
      progress: 100,
    },
    {
      id: "architecture",
      name: "Transformer Architecture",
      completed: true,
      progress: 100,
    },
    {
      id: "attention",
      name: "Self-Attention Mechanism",
      completed: false,
      progress: 75,
    },
    {
      id: "embeddings",
      name: "Embeddings and Positional Encoding",
      completed: false,
      progress: 40,
    },
    {
      id: "training",
      name: "Training Transformers",
      completed: false,
      progress: 10,
    },
    {
      id: "applications",
      name: "Applications and Use Cases",
      completed: false,
      progress: 0,
    },
  ];
  
  // Calculate overall progress
  const overallProgress = Math.round(
    sectionProgress.reduce((sum, section) => sum + section.progress, 0) / sectionProgress.length
  );
  
  // Calculate quiz stats
  const completedQuizzes = quizSummaries.filter(quiz => quiz.completed).length;
  const totalCorrect = quizSummaries.reduce((sum, quiz) => sum + quiz.score, 0);
  const totalQuestions = quizSummaries.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
  const quizSuccessRate = Math.round((totalCorrect / totalQuestions) * 100);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Learning Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your progress and performance</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>Continue Learning</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Overall Progress Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{overallProgress}%</div>
              <Progress value={overallProgress} className="h-2" />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                {sectionProgress.filter(s => s.completed).length} of {sectionProgress.length} sections completed
              </p>
            </CardFooter>
          </Card>
          
          {/* Quiz Performance Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quiz Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{quizSuccessRate}%</div>
              <Progress value={quizSuccessRate} className="h-2" />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                {totalCorrect} correct answers out of {totalQuestions} questions
              </p>
            </CardFooter>
          </Card>
          
          {/* Achievements Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  <span>First Section</span>
                </Badge>
                <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  <span>Perfect Quiz</span>
                </Badge>
                <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Fast Learner</span>
                </Badge>
                <Badge className="bg-neutral-500/10 text-neutral-600 hover:bg-neutral-500/20 flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  <span>Transformer Enthusiast</span>
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">4 of 12 achievements unlocked</p>
            </CardFooter>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Course Overview</TabsTrigger>
            <TabsTrigger value="quizzes">Quiz Results</TabsTrigger>
            <TabsTrigger value="notes">Your Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Section Progress</CardTitle>
                <CardDescription>
                  Track your progress through each section of the course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sectionProgress.map((section) => (
                    <div key={section.id}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {section.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-amber-500" />
                          )}
                          <span className="font-medium">{section.name}</span>
                        </div>
                        <span className="text-sm font-medium">{section.progress}%</span>
                      </div>
                      <Progress value={section.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Sections</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Results</CardTitle>
                <CardDescription>
                  Your performance on course assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quizSummaries.map((quiz) => (
                    <div key={quiz.sectionId} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-neutral-500" />
                          <span className="font-medium">{quiz.sectionName}</span>
                        </div>
                        <Badge variant={quiz.completed ? "default" : "outline"}>
                          {quiz.completed ? "Completed" : "Incomplete"}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Score: {quiz.score}/{quiz.totalQuestions}</span>
                        <span className={quiz.score / quiz.totalQuestions >= 0.7 ? "text-green-600" : "text-amber-600"}>
                          {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                        </span>
                      </div>
                      <Progress value={(quiz.score / quiz.totalQuestions) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {completedQuizzes} of {quizSummaries.length} quizzes completed
                </span>
                <Button variant="outline" size="sm">Retake Quizzes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Your Notes</CardTitle>
                <CardDescription>
                  Notes you've saved during your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Empty state */}
                  <div className="text-center py-8">
                    <FileText className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                    <p className="text-neutral-500 mb-4 max-w-md mx-auto">
                      You haven't created any notes yet. Take notes as you learn to refer back to important concepts.
                    </p>
                    <Button variant="outline">Start Taking Notes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="bg-neutral-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recommended Next Steps</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="bg-blue-100 text-blue-800 p-1 rounded mt-0.5">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Complete "Self-Attention Mechanism" section</p>
                <p className="text-sm text-neutral-500">25% remaining to complete this section</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-green-100 text-green-800 p-1 rounded mt-0.5">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Retake "Self-Attention Mechanism" quiz</p>
                <p className="text-sm text-neutral-500">Your current score: 3/6</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-amber-100 text-amber-800 p-1 rounded mt-0.5">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Start "Embeddings and Positional Encoding" section</p>
                <p className="text-sm text-neutral-500">This builds on your understanding of attention mechanisms</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}