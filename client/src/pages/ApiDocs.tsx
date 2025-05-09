import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CopyIcon, CheckIcon, InfoIcon } from "lucide-react";

// API endpoint documentation
const apiEndpoints = [
  {
    id: "content",
    method: "GET",
    path: "/api/content",
    title: "Get All Content",
    description: "Retrieves all educational content sections",
    parameters: [],
    responseExample: `{
  "sections": [
    {
      "id": 1,
      "slug": "introduction",
      "title": "Introduction to Transformer Models",
      "content": "Transformer models have revolutionized natural language processing...",
      "order": 1
    },
    ...
  ]
}`,
    statusCodes: [
      { code: 200, description: "Success" },
      { code: 500, description: "Server error" }
    ]
  },
  {
    id: "section",
    method: "GET",
    path: "/api/section/:slug",
    title: "Get Section by Slug",
    description: "Retrieves a specific section by its slug identifier",
    parameters: [
      { name: "slug", type: "string", description: "URL-friendly identifier for the section", required: true }
    ],
    responseExample: `{
  "section": {
    "id": 1,
    "slug": "introduction",
    "title": "Introduction to Transformer Models",
    "content": "Transformer models have revolutionized natural language processing...",
    "order": 1
  }
}`,
    statusCodes: [
      { code: 200, description: "Success" },
      { code: 404, description: "Section not found" },
      { code: 500, description: "Server error" }
    ]
  },
  {
    id: "quiz",
    method: "GET",
    path: "/api/quiz-questions",
    title: "Get Quiz Questions",
    description: "Retrieves all quiz questions for knowledge assessment",
    parameters: [],
    responseExample: `{
  "questions": [
    {
      "id": 1,
      "question": "What's the main advantage of self-attention over recurrent neural networks?",
      "options": [
        { "id": "q1-a", "text": "Self-attention requires less memory", "isCorrect": false },
        { "id": "q1-b", "text": "Self-attention creates smaller models", "isCorrect": false },
        { "id": "q1-c", "text": "Self-attention allows parallelization of sequence processing", "isCorrect": true },
        { "id": "q1-d", "text": "Self-attention automatically improves accuracy", "isCorrect": false }
      ],
      "explanation": "Self-attention allows the model to process all tokens in the sequence in parallel..."
    },
    ...
  ]
}`,
    statusCodes: [
      { code: 200, description: "Success" },
      { code: 500, description: "Server error" }
    ]
  },
  {
    id: "progress",
    method: "GET",
    path: "/api/user/:userId/progress",
    title: "Get User Progress",
    description: "Retrieves a user's learning progress",
    parameters: [
      { name: "userId", type: "number", description: "ID of the user", required: true }
    ],
    responseExample: `{
  "progress": {
    "id": 1,
    "userId": 123,
    "completedSections": ["introduction", "architecture", "embeddings"],
    "quizScores": {
      "quiz1": 85,
      "quiz2": 92
    },
    "lastActivity": "2023-05-01T12:34:56Z"
  }
}`,
    statusCodes: [
      { code: 200, description: "Success" },
      { code: 404, description: "User not found" },
      { code: 500, description: "Server error" }
    ]
  },
  {
    id: "update-progress",
    method: "PATCH",
    path: "/api/user/:userId/progress",
    title: "Update User Progress",
    description: "Updates a user's learning progress",
    parameters: [
      { name: "userId", type: "number", description: "ID of the user", required: true }
    ],
    requestBodyExample: `{
  "completedSections": ["introduction", "architecture", "embeddings", "attention"],
  "quizScores": {
    "quiz1": 85,
    "quiz2": 92,
    "quiz3": 78
  }
}`,
    responseExample: `{
  "progress": {
    "id": 1,
    "userId": 123,
    "completedSections": ["introduction", "architecture", "embeddings", "attention"],
    "quizScores": {
      "quiz1": 85,
      "quiz2": 92,
      "quiz3": 78
    },
    "lastActivity": "2023-05-02T10:11:12Z"
  }
}`,
    statusCodes: [
      { code: 200, description: "Success" },
      { code: 400, description: "Invalid request body" },
      { code: 404, description: "User not found" },
      { code: 500, description: "Server error" }
    ]
  }
];

// Data models
const dataModels = [
  {
    id: "user",
    name: "User",
    description: "Represents a user of the application",
    fields: [
      { name: "id", type: "number", description: "Unique identifier" },
      { name: "username", type: "string", description: "User's username" },
      { name: "password", type: "string", description: "Hashed password" }
    ]
  },
  {
    id: "section",
    name: "Section",
    description: "Represents an educational section in the application",
    fields: [
      { name: "id", type: "number", description: "Unique identifier" },
      { name: "slug", type: "string", description: "URL-friendly identifier" },
      { name: "title", type: "string", description: "Section title" },
      { name: "content", type: "string", description: "Section content" },
      { name: "order", type: "number", description: "Display order" }
    ]
  },
  {
    id: "quizQuestion",
    name: "QuizQuestion",
    description: "Represents a quiz question for testing knowledge",
    fields: [
      { name: "id", type: "number", description: "Unique identifier" },
      { name: "question", type: "string", description: "Question text" },
      { name: "options", type: "array", description: "Answer options" },
      { name: "correctOption", type: "string", description: "Correct answer identifier" },
      { name: "explanation", type: "string", description: "Explanation of the correct answer" }
    ]
  },
  {
    id: "userProgress",
    name: "UserProgress",
    description: "Tracks a user's progress through the educational content",
    fields: [
      { name: "id", type: "number", description: "Unique identifier" },
      { name: "userId", type: "number", description: "Reference to a user" },
      { name: "completedSections", type: "array", description: "Sections the user has completed" },
      { name: "quizScores", type: "object", description: "User's scores on quizzes" },
      { name: "lastActivity", type: "string", description: "ISO timestamp of last activity" }
    ]
  }
];

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState("endpoints");
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  
  // Copy to clipboard function
  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedEndpoint(endpoint);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    });
  };

  return (
    <div className="py-6 md:py-10 px-4 md:px-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
        <p className="text-lg text-neutral-600">
          Comprehensive documentation for the Transformer Models Educational API
        </p>
      </div>
      
      <Tabs defaultValue="endpoints" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                The API is organized around REST principles. It uses standard HTTP response codes, authentication, and verbs.
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p>
                All API endpoints are relative to the base URL: <code>https://api.transformer-edu.com/v1</code>
              </p>
              <p>
                All responses are returned as JSON and include appropriate HTTP status codes.
              </p>
            </CardContent>
          </Card>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {apiEndpoints.map((endpoint) => (
              <AccordionItem value={endpoint.id} key={endpoint.id} className="border rounded-lg overflow-hidden shadow-sm">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center w-full text-left">
                    <Badge className={endpoint.method === "GET" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                      {endpoint.method}
                    </Badge>
                    <span className="ml-3 font-mono text-sm">{endpoint.path}</span>
                    <span className="ml-auto text-sm font-medium text-neutral-500">{endpoint.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t">
                  <div className="px-6 py-4">
                    <p className="text-neutral-600 mb-4">{endpoint.description}</p>
                    
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
                                  <td className="py-2">{param.required ? "Yes" : "No"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {"requestBodyExample" in endpoint && (
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
    "message": "Your API token is invalid or has expired",
    "details": {
      "token_state": "expired",
      "expired_at": "2023-04-15T12:00:00Z"
    }
  }
}`}</code>
              </pre>
              
              <h4>Rate Limiting (429)</h4>
              <pre className="bg-neutral-900 text-neutral-100 rounded-md p-4 overflow-x-auto text-sm">
                <code>{`{
  "error": {
    "code": "rate_limited",
    "message": "You have exceeded the rate limit",
    "details": {
      "rate_limit": {
        "max_requests": 60,
        "window": "1 minute",
        "retry_after": 30
      }
    }
  }
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}