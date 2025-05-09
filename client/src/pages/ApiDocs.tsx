import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, CheckIcon, CopyIcon } from "lucide-react";

// Types for API documentation
type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type Parameter = {
  name: string;
  type: string;
  description: string;
  required: boolean;
};

type StatusCode = {
  code: string;
  description: string;
};

type Endpoint = {
  id: string;
  name: string;
  method: Method;
  path: string;
  description: string;
  parameters: Parameter[];
  requestBodyExample?: string;
  responseExample: string;
  statusCodes: StatusCode[];
};

type APICategory = {
  id: string;
  name: string;
  description: string;
  endpoints: Endpoint[];
};

type DataModelField = {
  name: string;
  type: string;
  description: string;
};

type DataModel = {
  id: string;
  name: string;
  description: string;
  fields: DataModelField[];
};

export default function ApiDocs() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  
  // Helper function to copy code to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };
  
  // API categories and endpoints
  const apiCategories: APICategory[] = [
    {
      id: "content",
      name: "Content",
      description: "Endpoints for accessing and managing educational content",
      endpoints: [
        {
          id: "get-content",
          name: "Get All Content",
          method: "GET",
          path: "/api/content",
          description: "Retrieve all available content with sections and subsections",
          parameters: [],
          responseExample: JSON.stringify({
            sections: [
              {
                id: "intro",
                title: "Introduction to Transformers",
                slug: "introduction",
                content: "This section introduces transformer models...",
                subsections: [
                  {
                    id: "motivation",
                    title: "Motivation and Background",
                    slug: "motivation"
                  }
                ]
              }
            ]
          }, null, 2),
          statusCodes: [
            { code: "200", description: "Content retrieved successfully" },
            { code: "500", description: "Server error" }
          ]
        },
        {
          id: "get-section",
          name: "Get Section",
          method: "GET",
          path: "/api/content/section/:slug",
          description: "Retrieve a specific section by its slug",
          parameters: [
            {
              name: "slug",
              type: "string",
              description: "The unique slug identifier for the section",
              required: true
            }
          ],
          responseExample: JSON.stringify({
            id: "intro",
            title: "Introduction to Transformers",
            slug: "introduction",
            content: "This section introduces transformer models...",
            subsections: [
              {
                id: "motivation",
                title: "Motivation and Background",
                slug: "motivation",
                content: "Before transformers, recurrent neural networks..."
              }
            ]
          }, null, 2),
          statusCodes: [
            { code: "200", description: "Section retrieved successfully" },
            { code: "404", description: "Section not found" },
            { code: "500", description: "Server error" }
          ]
        }
      ]
    },
    {
      id: "quiz",
      name: "Quiz",
      description: "Endpoints for accessing and submitting quizzes",
      endpoints: [
        {
          id: "get-quizzes",
          name: "Get Quiz Questions",
          method: "GET",
          path: "/api/quiz",
          description: "Retrieve all quiz questions for the course",
          parameters: [],
          responseExample: JSON.stringify({
            questions: [
              {
                id: 1,
                sectionId: "attention",
                question: "What is the purpose of multi-head attention?",
                options: [
                  {
                    id: "a",
                    text: "To speed up training",
                    isCorrect: false
                  },
                  {
                    id: "b",
                    text: "To focus on different representation subspaces",
                    isCorrect: true
                  }
                ],
                explanation: "Multi-head attention allows the model to jointly attend to information from different representation subspaces."
              }
            ]
          }, null, 2),
          statusCodes: [
            { code: "200", description: "Quiz questions retrieved successfully" },
            { code: "500", description: "Server error" }
          ]
        },
        {
          id: "submit-quiz",
          name: "Submit Quiz Answers",
          method: "POST",
          path: "/api/quiz/submit",
          description: "Submit answers for quiz questions and receive feedback",
          parameters: [
            {
              name: "userId",
              type: "number",
              description: "The ID of the user submitting the answers",
              required: true
            }
          ],
          requestBodyExample: JSON.stringify({
            userId: 123,
            answers: [
              {
                questionId: 1,
                selectedOptionId: "b"
              },
              {
                questionId: 2,
                selectedOptionId: "a"
              }
            ]
          }, null, 2),
          responseExample: JSON.stringify({
            score: 1,
            totalQuestions: 2,
            correctAnswers: [
              {
                questionId: 1,
                selectedOptionId: "b",
                isCorrect: true
              },
              {
                questionId: 2,
                selectedOptionId: "a",
                isCorrect: false,
                correctOptionId: "c"
              }
            ]
          }, null, 2),
          statusCodes: [
            { code: "200", description: "Quiz submitted and scored successfully" },
            { code: "400", description: "Invalid request body" },
            { code: "404", description: "One or more questions not found" },
            { code: "500", description: "Server error" }
          ]
        }
      ]
    },
    {
      id: "user",
      name: "User",
      description: "Endpoints for user authentication and profile management",
      endpoints: [
        {
          id: "register",
          name: "Register User",
          method: "POST",
          path: "/api/auth/register",
          description: "Register a new user account",
          parameters: [],
          requestBodyExample: JSON.stringify({
            username: "johndoe",
            email: "john@example.com",
            password: "securep@ssword123"
          }, null, 2),
          responseExample: JSON.stringify({
            id: 123,
            username: "johndoe",
            email: "john@example.com"
          }, null, 2),
          statusCodes: [
            { code: "201", description: "User created successfully" },
            { code: "400", description: "Invalid request body or username already exists" },
            { code: "500", description: "Server error" }
          ]
        },
        {
          id: "login",
          name: "Login",
          method: "POST",
          path: "/api/auth/login",
          description: "Authenticate a user and receive session token",
          parameters: [],
          requestBodyExample: JSON.stringify({
            username: "johndoe",
            password: "securep@ssword123"
          }, null, 2),
          responseExample: JSON.stringify({
            id: 123,
            username: "johndoe",
            email: "john@example.com"
          }, null, 2),
          statusCodes: [
            { code: "200", description: "Login successful" },
            { code: "401", description: "Invalid credentials" },
            { code: "500", description: "Server error" }
          ]
        },
        {
          id: "logout",
          name: "Logout",
          method: "POST",
          path: "/api/auth/logout",
          description: "End the current user session",
          parameters: [],
          responseExample: JSON.stringify({
            success: true,
            message: "Logged out successfully"
          }, null, 2),
          statusCodes: [
            { code: "200", description: "Logout successful" },
            { code: "500", description: "Server error" }
          ]
        },
        {
          id: "get-user",
          name: "Get Current User",
          method: "GET",
          path: "/api/auth/me",
          description: "Retrieve the currently authenticated user's details",
          parameters: [],
          responseExample: JSON.stringify({
            id: 123,
            username: "johndoe",
            email: "john@example.com"
          }, null, 2),
          statusCodes: [
            { code: "200", description: "User retrieved successfully" },
            { code: "401", description: "Not authenticated" },
            { code: "500", description: "Server error" }
          ]
        },
        {
          id: "get-progress",
          name: "Get User Progress",
          method: "GET",
          path: "/api/user/progress",
          description: "Retrieve a user's learning progress data",
          parameters: [],
          responseExample: JSON.stringify({
            userId: 123,
            completedSections: ["intro", "architecture"],
            quizScores: {
              "intro": {
                score: 4,
                totalQuestions: 5,
                lastAttempt: "2023-09-15T14:30:00Z"
              },
              "architecture": {
                score: 7,
                totalQuestions: 7,
                lastAttempt: "2023-09-16T10:15:00Z"
              }
            },
            sectionProgress: {
              "attention": 75,
              "embeddings": 40,
              "training": 10,
              "applications": 0
            }
          }, null, 2),
          statusCodes: [
            { code: "200", description: "Progress retrieved successfully" },
            { code: "401", description: "Not authenticated" },
            { code: "500", description: "Server error" }
          ]
        },
        {
          id: "update-progress",
          name: "Update User Progress",
          method: "PATCH",
          path: "/api/user/progress",
          description: "Update a user's learning progress data",
          parameters: [],
          requestBodyExample: JSON.stringify({
            completedSections: ["intro", "architecture", "attention"],
            sectionProgress: {
              "embeddings": 65
            }
          }, null, 2),
          responseExample: JSON.stringify({
            userId: 123,
            completedSections: ["intro", "architecture", "attention"],
            sectionProgress: {
              "attention": 100,
              "embeddings": 65,
              "training": 10,
              "applications": 0
            },
            updated: true
          }, null, 2),
          statusCodes: [
            { code: "200", description: "Progress updated successfully" },
            { code: "400", description: "Invalid request body" },
            { code: "401", description: "Not authenticated" },
            { code: "500", description: "Server error" }
          ]
        }
      ]
    }
  ];
  
  // Data models
  const dataModels: DataModel[] = [
    {
      id: "user",
      name: "User",
      description: "Represents a registered user in the system",
      fields: [
        { name: "id", type: "number", description: "Unique identifier for the user" },
        { name: "username", type: "string", description: "User's unique username" },
        { name: "email", type: "string", description: "User's email address" },
        { name: "password", type: "string", description: "Hashed password (never returned in API responses)" }
      ]
    },
    {
      id: "section",
      name: "Section",
      description: "Represents a main content section in the course",
      fields: [
        { name: "id", type: "string", description: "Unique identifier for the section" },
        { name: "title", type: "string", description: "Display title of the section" },
        { name: "slug", type: "string", description: "URL-friendly identifier for the section" },
        { name: "content", type: "string", description: "Main content of the section in Markdown format" },
        { name: "subsections", type: "Subsection[]", description: "Array of subsections within this section" }
      ]
    },
    {
      id: "subsection",
      name: "Subsection",
      description: "Represents a subsection within a main content section",
      fields: [
        { name: "id", type: "string", description: "Unique identifier for the subsection" },
        { name: "title", type: "string", description: "Display title of the subsection" },
        { name: "slug", type: "string", description: "URL-friendly identifier for the subsection" },
        { name: "content", type: "string", description: "Content of the subsection in Markdown format" }
      ]
    },
    {
      id: "quiz-question",
      name: "QuizQuestion",
      description: "Represents a quiz question with multiple-choice options",
      fields: [
        { name: "id", type: "number", description: "Unique identifier for the question" },
        { name: "sectionId", type: "string", description: "ID of the section this question belongs to" },
        { name: "question", type: "string", description: "The question text" },
        { name: "options", type: "QuizOption[]", description: "Array of possible answer options" },
        { name: "explanation", type: "string", description: "Explanation of the correct answer" }
      ]
    },
    {
      id: "quiz-option",
      name: "QuizOption",
      description: "Represents a possible answer for a quiz question",
      fields: [
        { name: "id", type: "string", description: "Unique identifier for the option" },
        { name: "text", type: "string", description: "The option text" },
        { name: "isCorrect", type: "boolean", description: "Whether this option is the correct answer" }
      ]
    },
    {
      id: "user-progress",
      name: "UserProgress",
      description: "Represents a user's progress through the course",
      fields: [
        { name: "userId", type: "number", description: "ID of the user" },
        { name: "completedSections", type: "string[]", description: "IDs of sections the user has completed" },
        { name: "quizScores", type: "Record<string, QuizScore>", description: "Map of section IDs to quiz scores" },
        { name: "sectionProgress", type: "Record<string, number>", description: "Map of section IDs to progress percentages" }
      ]
    },
    {
      id: "quiz-score",
      name: "QuizScore",
      description: "Represents a user's score on a quiz",
      fields: [
        { name: "score", type: "number", description: "Number of questions answered correctly" },
        { name: "totalQuestions", type: "number", description: "Total number of questions in the quiz" },
        { name: "lastAttempt", type: "string (ISO date)", description: "Timestamp of the last attempt" }
      ]
    }
  ];
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
        <p className="text-gray-600 mb-8">
          Comprehensive documentation for interacting with the Transformer Education API
        </p>
        
        <Tabs defaultValue="endpoints">
          <TabsList className="mb-6">
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="models">Data Models</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="errors">Error Handling</TabsTrigger>
          </TabsList>
          
          {/* API Endpoints Tab */}
          <TabsContent value="endpoints">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  These endpoints provide access to the Transformer Education API resources
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>
                  The base URL for all API endpoints is <code className="px-1 py-0.5 bg-neutral-100 rounded text-neutral-800">https://api.transformer-edu.com/v1</code>
                </p>
              </CardContent>
            </Card>
            
            <Accordion type="single" collapsible className="mb-8">
              {apiCategories.map((category) => (
                <AccordionItem value={category.id} key={category.id}>
                  <AccordionTrigger className="text-lg font-medium">
                    {category.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-4 text-neutral-600">
                      {category.description}
                    </p>
                    
                    <div className="space-y-6">
                      {category.endpoints.map((endpoint) => (
                        <Card key={endpoint.id} className="border-l-4" style={{ borderLeftColor: 
                          endpoint.method === "GET" ? "#3b82f6" : 
                          endpoint.method === "POST" ? "#22c55e" :
                          endpoint.method === "PUT" ? "#f59e0b" :
                          endpoint.method === "PATCH" ? "#8b5cf6" :
                          "#ef4444"
                        }}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg font-medium">{endpoint.name}</CardTitle>
                                <CardDescription>{endpoint.description}</CardDescription>
                              </div>
                              <Badge className={
                                endpoint.method === "GET" ? "bg-blue-100 text-blue-800" :
                                endpoint.method === "POST" ? "bg-green-100 text-green-800" :
                                endpoint.method === "PUT" ? "bg-amber-100 text-amber-800" :
                                endpoint.method === "PATCH" ? "bg-purple-100 text-purple-800" :
                                "bg-red-100 text-red-800"
                              }>
                                {endpoint.method}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="font-mono text-sm text-neutral-500">
                                {endpoint.path}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyToClipboard(endpoint.path, `${endpoint.id}-path`)}
                                className="h-6 px-2"
                              >
                                {copiedEndpoint === `${endpoint.id}-path` ? (
                                  <CheckIcon className="h-3 w-3 text-green-600" />
                                ) : (
                                  <CopyIcon className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            
                            {endpoint.parameters.length > 0 && (
                              <div className="mb-6">
                                <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                                <div className="bg-neutral-50 rounded-md p-4">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr>
                                        <th className="text-left pb-2">Name</th>
                                        <th className="text-left pb-2">Type</th>
                                        <th className="text-left pb-2">Description</th>
                                        <th className="text-left pb-2">Required</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {endpoint.parameters.map((param, i) => (
                                        <tr key={i} className="border-t border-neutral-200">
                                          <td className="py-2 font-mono">{param.name}</td>
                                          <td className="py-2">{param.type}</td>
                                          <td className="py-2">{param.description}</td>
                                          <td className="py-2">
                                            {param.required ? (
                                              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                Required
                                              </Badge>
                                            ) : (
                                              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                                Optional
                                              </Badge>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                            
                            {endpoint.requestBodyExample && (
                              <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-sm font-semibold">Request Body</h4>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => copyToClipboard(endpoint.requestBodyExample || "", `${endpoint.id}-request`)}
                                    className="h-8 px-2"
                                  >
                                    {copiedEndpoint === `${endpoint.id}-request` ? (
                                      <CheckIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <CopyIcon className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                <pre className="bg-neutral-900 text-neutral-100 rounded-md p-4 overflow-x-auto text-sm">
                                  <code>{endpoint.requestBodyExample || ""}</code>
                                </pre>
                              </div>
                            )}
                            
                            <div className="mb-6">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-semibold">Response Format</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(endpoint.responseExample, `${endpoint.id}-response`)}
                                  className="h-8 px-2"
                                >
                                  {copiedEndpoint === `${endpoint.id}-response` ? (
                                    <CheckIcon className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <CopyIcon className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              <pre className="bg-neutral-900 text-neutral-100 rounded-md p-4 overflow-x-auto text-sm">
                                <code>{endpoint.responseExample}</code>
                              </pre>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Status Codes</h4>
                              <div className="bg-neutral-50 rounded-md p-4">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr>
                                      <th className="text-left pb-2">Code</th>
                                      <th className="text-left pb-2">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {endpoint.statusCodes.map((status, i) => (
                                      <tr key={i} className="border-t border-neutral-200">
                                        <td className="py-2 font-mono">{status.code}</td>
                                        <td className="py-2">{status.description}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          {/* Data Models Tab */}
          <TabsContent value="models">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Data Models</CardTitle>
                <CardDescription>
                  These models define the structure of data used throughout the API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {dataModels.map((model) => (
                    <div key={model.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                      <p className="text-neutral-600 mb-4">{model.description}</p>
                      
                      <div className="bg-neutral-50 rounded-md p-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left pb-2">Field</th>
                              <th className="text-left pb-2">Type</th>
                              <th className="text-left pb-2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {model.fields.map((field, i) => (
                              <tr key={i} className="border-t border-neutral-200">
                                <td className="py-2 font-mono">{field.name}</td>
                                <td className="py-2">{field.type}</td>
                                <td className="py-2">{field.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Authentication Tab */}
          <TabsContent value="authentication">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  Secure your API requests using token-based authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h3>Authentication Methods</h3>
                <p>
                  The API uses token-based authentication. To authenticate your requests, include an
                  <code>Authorization</code> header with a bearer token:
                </p>
                
                <pre className="bg-neutral-900 text-neutral-100 rounded-md p-4 overflow-x-auto text-sm">
                  <code>Authorization: Bearer your_api_token_here</code>
                </pre>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                  <div className="flex">
                    <InfoIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-800 font-medium">Important</h4>
                      <p className="text-blue-700 mt-1">
                        Keep your API tokens secure and never expose them in client-side code.
                        If you believe a token has been compromised, generate a new one immediately.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3>Obtaining an API Token</h3>
                <p>
                  You can obtain an API token by:
                </p>
                <ol>
                  <li>Registering for an account at <a href="https://transformer-edu.com/signup" className="text-primary-600 hover:underline">transformer-edu.com/signup</a></li>
                  <li>Navigating to your account settings</li>
                  <li>Generating a new API token in the "API Access" section</li>
                </ol>
                
                <h3>Token Expiration</h3>
                <p>
                  API tokens are valid for 90 days by default. You can set custom expiration dates when
                  generating tokens through the dashboard.
                </p>
                
                <h3>Rate Limiting</h3>
                <p>
                  API requests are limited to:
                </p>
                <ul>
                  <li>60 requests per minute for standard users</li>
                  <li>120 requests per minute for premium users</li>
                </ul>
                <p>
                  If you exceed these limits, you'll receive a <code>429 Too Many Requests</code> response.
                  The response will include a <code>Retry-After</code> header indicating how many seconds
                  to wait before making another request.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Error Handling Tab */}
          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <CardTitle>Error Handling</CardTitle>
                <CardDescription>
                  How to interpret and handle error responses from the API
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <h3>Error Response Format</h3>
                <p>
                  All errors follow a consistent format:
                </p>
                
                <pre className="bg-neutral-900 text-neutral-100 rounded-md p-4 overflow-x-auto text-sm">
                  <code>{`{
  "error": {
    "code": "error_code",
    "message": "A human-readable error message",
    "details": {
      // Additional error details when available
    }
  }
}`}</code>
                </pre>
                
                <h3>Common Error Codes</h3>
                <div className="bg-neutral-50 rounded-md p-4 my-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left pb-2">HTTP Status</th>
                        <th className="text-left pb-2">Error Code</th>
                        <th className="text-left pb-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-neutral-200">
                        <td className="py-2 font-mono">400</td>
                        <td className="py-2 font-mono">invalid_request</td>
                        <td className="py-2">The request was malformed or contained invalid parameters</td>
                      </tr>
                      <tr className="border-t border-neutral-200">
                        <td className="py-2 font-mono">401</td>
                        <td className="py-2 font-mono">unauthorized</td>
                        <td className="py-2">Authentication failed or token is invalid</td>
                      </tr>
                      <tr className="border-t border-neutral-200">
                        <td className="py-2 font-mono">403</td>
                        <td className="py-2 font-mono">forbidden</td>
                        <td className="py-2">The authenticated user doesn't have permission</td>
                      </tr>
                      <tr className="border-t border-neutral-200">
                        <td className="py-2 font-mono">404</td>
                        <td className="py-2 font-mono">not_found</td>
                        <td className="py-2">The requested resource was not found</td>
                      </tr>
                      <tr className="border-t border-neutral-200">
                        <td className="py-2 font-mono">429</td>
                        <td className="py-2 font-mono">rate_limited</td>
                        <td className="py-2">Too many requests, exceeding rate limits</td>
                      </tr>
                      <tr className="border-t border-neutral-200">
                        <td className="py-2 font-mono">500</td>
                        <td className="py-2 font-mono">server_error</td>
                        <td className="py-2">Internal server error</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h3>Error Handling Best Practices</h3>
                <ul>
                  <li>Always check the HTTP status code first</li>
                  <li>Handle common errors (400, 401, 403, 404) with specific user feedback</li>
                  <li>Implement exponential backoff for rate limiting errors (429)</li>
                  <li>Log detailed error information for debugging purposes</li>
                  <li>Present user-friendly error messages in your application</li>
                </ul>
                
                <h3>Example Error Responses</h3>
                <h4>Invalid Request (400)</h4>
                <pre className="bg-neutral-900 text-neutral-100 rounded-md p-4 overflow-x-auto text-sm">
                  <code>{`{
  "error": {
    "code": "invalid_request",
    "message": "The request body contains invalid fields",
    "details": {
      "validation_errors": [
        {
          "field": "email",
          "message": "Must be a valid email address"
        }
      ]
    }
  }
}`}</code>
                </pre>
                
                <h4>Authentication Error (401)</h4>
                <pre className="bg-neutral-900 text-neutral-100 rounded-md p-4 overflow-x-auto text-sm">
                  <code>{`{
  "error": {
    "code": "unauthorized",
    "message": "Invalid or expired authentication token"
  }
}`}</code>
                </pre>
                
                <h4>Resource Not Found (404)</h4>
                <pre className="bg-neutral-900 text-neutral-100 rounded-md p-4 overflow-x-auto text-sm">
                  <code>{`{
  "error": {
    "code": "not_found",
    "message": "The requested section could not be found",
    "details": {
      "resource_type": "section",
      "resource_id": "non_existent_section"
    }
  }
}`}</code>
                </pre>
                
                <h4>Rate Limiting (429)</h4>
                <pre className="bg-neutral-900 text-neutral-100 rounded-md p-4 overflow-x-auto text-sm">
                  <code>{`{
  "error": {
    "code": "rate_limited",
    "message": "Too many requests, please try again later",
    "details": {
      "retry_after": 30
    }
  }
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}