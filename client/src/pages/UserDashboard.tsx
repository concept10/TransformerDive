import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Importing the required components from recharts directly
import { BarChart, LineChart, Tooltip, ResponsiveContainer, XAxis, YAxis, Bar, CartesianGrid, Line } from "recharts";
import { CalendarIcon, BookOpenIcon, GraduationCapIcon, TrophyIcon, UserIcon, ClockIcon } from "lucide-react";

// Example user progress data
const userProgress = {
  name: "Alice Chen",
  email: "alice@example.com",
  completedSections: 7,
  totalSections: 11,
  completionRate: 63,
  lastActive: "2 days ago",
  quizScores: [
    { id: 1, name: "Introduction", score: 90, maxScore: 100 },
    { id: 2, name: "Architecture", score: 85, maxScore: 100 },
    { id: 3, name: "Embeddings", score: 70, maxScore: 100 },
    { id: 4, name: "Attention", score: 95, maxScore: 100 },
    { id: 5, name: "Encoder", score: 80, maxScore: 100 },
  ],
  activityHistory: [
    { date: "Jan 10", minutes: 35 },
    { date: "Jan 11", minutes: 20 },
    { date: "Jan 12", minutes: 45 },
    { date: "Jan 13", minutes: 0 },
    { date: "Jan 14", minutes: 30 },
    { date: "Jan 15", minutes: 60 },
    { date: "Jan 16", minutes: 25 },
  ],
  achievements: [
    { id: 1, name: "Fast Learner", description: "Completed 5 sections in a week", earned: true },
    { id: 2, name: "Quiz Master", description: "Score above 90% on all quizzes", earned: false },
    { id: 3, name: "Code Explorer", description: "Ran all code examples", earned: true },
    { id: 4, name: "Attention Expert", description: "Completed the attention playground exercises", earned: true },
  ],
  recommendedSections: [
    { id: "encoder", name: "Encoder Structure" },
    { id: "decoder", name: "Decoder Structure" },
    { id: "training", name: "Training Process" },
  ]
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="py-6 md:py-10 px-4 md:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <p className="text-neutral-600 mt-2">Track your learning progress and achievements</p>
        </div>
        <Button variant="outline" className="self-start md:self-auto">
          <UserIcon className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz Results</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userProgress.completionRate}%</div>
                <Progress value={userProgress.completionRate} className="h-2 mt-2" />
                <p className="text-xs text-neutral-500 mt-2">
                  {userProgress.completedSections} of {userProgress.totalSections} sections completed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">Average Quiz Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(userProgress.quizScores.reduce((acc, quiz) => acc + quiz.score, 0) / userProgress.quizScores.length)}%
                </div>
                <Progress 
                  value={Math.round(userProgress.quizScores.reduce((acc, quiz) => acc + quiz.score, 0) / userProgress.quizScores.length)} 
                  className="h-2 mt-2" 
                />
                <p className="text-xs text-neutral-500 mt-2">
                  Based on {userProgress.quizScores.length} completed quizzes
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">Study Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6 days</div>
                <div className="flex mt-2 space-x-1">
                  {userProgress.activityHistory.map((day, i) => (
                    <div 
                      key={i} 
                      className={`h-2 flex-1 rounded-sm ${day.minutes > 0 ? 'bg-primary-500' : 'bg-neutral-200'}`}
                      title={`${day.date}: ${day.minutes} minutes`}
                    />
                  ))}
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Last active: {userProgress.lastActive}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userProgress.achievements.filter(a => a.earned).length} / {userProgress.achievements.length}
                </div>
                <Progress 
                  value={(userProgress.achievements.filter(a => a.earned).length / userProgress.achievements.length) * 100} 
                  className="h-2 mt-2" 
                />
                <p className="text-xs text-neutral-500 mt-2">
                  {userProgress.achievements.filter(a => a.earned).length} badges earned
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Learning Activity</CardTitle>
                <CardDescription>Your study time over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userProgress.activityHistory}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <Bar dataKey="minutes" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next</CardTitle>
                <CardDescription>Sections to continue your learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProgress.recommendedSections.map((section) => (
                    <div key={section.id} className="flex items-start">
                      <BookOpenIcon className="h-5 w-5 mr-3 text-primary-500 mt-0.5" />
                      <div>
                        <Link href={`/#${section.id}`}>
                          <a className="font-medium text-primary-600 hover:underline">
                            {section.name}
                          </a>
                        </Link>
                        <p className="text-sm text-neutral-500">
                          Continue your learning journey
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Sections
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Section Completion</CardTitle>
              <CardDescription>Your progress through each section of the course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Introduction</div>
                  <div className="flex items-center">
                    <Progress value={100} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">100%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Architecture Overview</div>
                  <div className="flex items-center">
                    <Progress value={100} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">100%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Embeddings & Positional Encoding</div>
                  <div className="flex items-center">
                    <Progress value={100} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">100%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Self-Attention Mechanism</div>
                  <div className="flex items-center">
                    <Progress value={100} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">100%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Encoder Structure</div>
                  <div className="flex items-center">
                    <Progress value={75} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">75%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Decoder Structure</div>
                  <div className="flex items-center">
                    <Progress value={40} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">40%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Code Implementation</div>
                  <div className="flex items-center">
                    <Progress value={60} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">60%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Training Process</div>
                  <div className="flex items-center">
                    <Progress value={0} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">0%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Model Comparisons</div>
                  <div className="flex items-center">
                    <Progress value={0} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">0%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Knowledge Check</div>
                  <div className="flex items-center">
                    <Progress value={80} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">80%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium">Further Resources</div>
                  <div className="flex items-center">
                    <Progress value={30} className="h-2 w-40 md:w-80" />
                    <span className="ml-2 text-sm font-medium">30%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning History</CardTitle>
              <CardDescription>Your study sessions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: "Jan 1", minutes: 20 },
                    { date: "Jan 3", minutes: 40 },
                    { date: "Jan 5", minutes: 25 },
                    { date: "Jan 6", minutes: 50 },
                    { date: "Jan 8", minutes: 15 },
                    { date: "Jan 10", minutes: 35 },
                    { date: "Jan 11", minutes: 20 },
                    { date: "Jan 12", minutes: 45 },
                    { date: "Jan 14", minutes: 30 },
                    { date: "Jan 15", minutes: 60 },
                    { date: "Jan 16", minutes: 25 },
                  ]}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="minutes" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Quizzes Tab */}
        <TabsContent value="quizzes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
                <CardDescription>Your scores across all quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userProgress.quizScores}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <Bar dataKey="score" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Stats about your quiz performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Average Score</span>
                    <div className="text-2xl font-bold">
                      {Math.round(userProgress.quizScores.reduce((acc, quiz) => acc + quiz.score, 0) / userProgress.quizScores.length)}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Highest Score</span>
                    <div className="text-2xl font-bold">
                      {Math.max(...userProgress.quizScores.map(q => q.score))}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Lowest Score</span>
                    <div className="text-2xl font-bold">
                      {Math.min(...userProgress.quizScores.map(q => q.score))}%
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Quizzes Completed</span>
                    <div className="text-2xl font-bold">
                      {userProgress.quizScores.length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Detailed breakdown of each quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userProgress.quizScores.map((quiz) => (
                  <div key={quiz.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{quiz.name} Quiz</h3>
                      <Badge className={quiz.score >= 90 ? "bg-green-100 text-green-800" : quiz.score >= 70 ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}>
                        {quiz.score}%
                      </Badge>
                    </div>
                    <Progress value={quiz.score} className="h-2" />
                    <div className="flex justify-between mt-2 text-sm text-neutral-500">
                      <div>Score: {quiz.score} / {quiz.maxScore}</div>
                      <div>
                        {quiz.score >= 90 ? "Excellent" : quiz.score >= 70 ? "Good" : "Needs Review"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Retake Quizzes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProgress.achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.earned ? "" : "opacity-60"}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{achievement.name}</CardTitle>
                    {achievement.earned ? (
                      <Badge className="bg-green-100 text-green-800">Earned</Badge>
                    ) : (
                      <Badge variant="outline">Locked</Badge>
                    )}
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center">
                    <div className={`rounded-full p-3 ${achievement.earned ? "bg-primary-100" : "bg-neutral-100"}`}>
                      {achievement.id === 1 && <ClockIcon className={`h-6 w-6 ${achievement.earned ? "text-primary-600" : "text-neutral-400"}`} />}
                      {achievement.id === 2 && <TrophyIcon className={`h-6 w-6 ${achievement.earned ? "text-primary-600" : "text-neutral-400"}`} />}
                      {achievement.id === 3 && <BookOpenIcon className={`h-6 w-6 ${achievement.earned ? "text-primary-600" : "text-neutral-400"}`} />}
                      {achievement.id === 4 && <GraduationCapIcon className={`h-6 w-6 ${achievement.earned ? "text-primary-600" : "text-neutral-400"}`} />}
                    </div>
                    <div className="ml-4">
                      {achievement.earned ? (
                        <p className="text-sm text-neutral-600">Completed on Jan 15, 2023</p>
                      ) : (
                        <p className="text-sm text-neutral-600">Complete all quizzes to unlock</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}