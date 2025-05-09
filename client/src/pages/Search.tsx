import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, FileText, Book, Code, ExternalLink, CornerDownRight } from "lucide-react";

// Types for search results
type SearchResultBase = {
  id: string;
  title: string;
  type: "section" | "article" | "codeExample" | "concept";
  snippet: string;
  url: string;
};

type SectionResult = SearchResultBase & {
  type: "section";
  parentSection?: string;
};

type ArticleResult = SearchResultBase & {
  type: "article";
  author: string;
  publishDate: string;
};

type CodeExampleResult = SearchResultBase & {
  type: "codeExample";
  language: string;
  complexity: "beginner" | "intermediate" | "advanced";
};

type ConceptResult = SearchResultBase & {
  type: "concept";
  relatedConcepts: string[];
};

type SearchResult = SectionResult | ArticleResult | CodeExampleResult | ConceptResult;

// Map of result type to icon
const resultTypeIcons: Record<SearchResult["type"], React.ReactNode> = {
  section: <Book className="h-5 w-5" />,
  article: <FileText className="h-5 w-5" />,
  codeExample: <Code className="h-5 w-5" />,
  concept: <CornerDownRight className="h-5 w-5" />,
};

// Helper function to get placeholder results based on query
function getSearchResults(query: string): SearchResult[] {
  // If no query, return empty results
  if (!query.trim()) return [];
  
  // For demo purposes, return mock results based on the query
  return [
    {
      id: "section-1",
      title: "Self-Attention Mechanism",
      type: "section",
      snippet: `...The self-attention mechanism is the core component of transformer models, allowing the model to weigh the importance of different words in the input sequence...`,
      url: "/#attention",
      parentSection: "Transformer Architecture",
    },
    {
      id: "section-2",
      title: "Multi-Head Attention",
      type: "section",
      snippet: `...Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions...`,
      url: "/#multi-head-attention",
      parentSection: "Self-Attention Mechanism",
    },
    {
      id: "article-1",
      title: "Understanding Transformer Attention",
      type: "article",
      snippet: `...Attention mechanisms have become a critical component in modern NLP models, particularly in transformer architectures...`,
      url: "/articles/understanding-transformer-attention",
      author: "Jane Smith",
      publishDate: "2023-08-15",
    },
    {
      id: "code-1",
      title: "Implementing Self-Attention in PyTorch",
      type: "codeExample",
      snippet: `class SelfAttention(nn.Module):\n    def __init__(self, embed_size, heads):\n        super(SelfAttention, self).__init__()\n        self.embed_size = embed_size\n        self.heads = heads\n        self.head_dim = embed_size // heads...`,
      url: "/examples/self-attention-pytorch",
      language: "python",
      complexity: "intermediate",
    },
    {
      id: "concept-1",
      title: "Scaled Dot-Product Attention",
      type: "concept",
      snippet: `...Scaled dot-product attention computes the attention weights by taking the dot product of the query with all keys, dividing by the square root of the dimension of the keys...`,
      url: "/concepts/scaled-dot-product-attention",
      relatedConcepts: ["Query-Key-Value", "Softmax Function", "Attention Weights"],
    },
    {
      id: "concept-2",
      title: "Positional Encoding",
      type: "concept",
      snippet: `...Since transformer models don't have any built-in sequence order information, positional encodings are added to give the model information about the position of tokens...`,
      url: "/concepts/positional-encoding",
      relatedConcepts: ["Sinusoidal Encoding", "Learned Positional Embeddings"],
    },
  ].filter(result => 
    result.title.toLowerCase().includes(query.toLowerCase()) || 
    result.snippet.toLowerCase().includes(query.toLowerCase())
  );
}

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  
  // Handle search
  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const results = getSearchResults(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };
  
  // Initialize search if query parameter exists
  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, []);
  
  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  // Filter results based on active tab
  const filteredResults = activeTab === "all" 
    ? searchResults 
    : searchResults.filter(result => result.type === activeTab);
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Transformer Documentation</h1>
        
        {/* Search Input */}
        <div className="flex gap-2 mb-8">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for concepts, examples, or sections..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={!query.trim() || isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
        
        {/* No query state */}
        {!query.trim() && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Start Your Search</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Enter keywords related to transformer models, attention mechanisms, 
                  or specific techniques to find relevant documentation.
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                  <Button variant="outline" size="sm" onClick={() => setQuery("attention mechanism")}>
                    Attention Mechanism
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setQuery("positional encoding")}>
                    Positional Encoding
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setQuery("transformer architecture")}>
                    Transformer Architecture
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setQuery("embedding")}>
                    Embeddings
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setQuery("pytorch implementation")}>
                    PyTorch Implementation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Search results */}
        {query.trim() && (
          <>
            {isSearching ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {searchResults.length === 0 
                      ? "No results found" 
                      : `${searchResults.length} results for "${query}"`}
                  </h2>
                </div>
                
                {searchResults.length > 0 && (
                  <>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                      <TabsList>
                        <TabsTrigger value="all">
                          All ({searchResults.length})
                        </TabsTrigger>
                        <TabsTrigger value="section">
                          Sections ({searchResults.filter(r => r.type === "section").length})
                        </TabsTrigger>
                        <TabsTrigger value="concept">
                          Concepts ({searchResults.filter(r => r.type === "concept").length})
                        </TabsTrigger>
                        <TabsTrigger value="codeExample">
                          Code Examples ({searchResults.filter(r => r.type === "codeExample").length})
                        </TabsTrigger>
                        <TabsTrigger value="article">
                          Articles ({searchResults.filter(r => r.type === "article").length})
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    <div className="space-y-4">
                      {filteredResults.map((result) => (
                        <Card key={result.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="flex items-start gap-3">
                                <div className="text-gray-500 mt-1">
                                  {resultTypeIcons[result.type]}
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-start mb-1">
                                    <div>
                                      <Link href={result.url}>
                                        <a className="text-lg font-medium text-primary hover:underline flex items-center gap-1">
                                          {result.title}
                                          <ExternalLink className="h-4 w-4" />
                                        </a>
                                      </Link>
                                      
                                      {result.type === "section" && result.parentSection && (
                                        <div className="text-sm text-gray-500 mb-1">
                                          in {result.parentSection}
                                        </div>
                                      )}
                                      
                                      {result.type === "article" && (
                                        <div className="text-sm text-gray-500 mb-1">
                                          by {result.author} • {new Date(result.publishDate).toLocaleDateString()}
                                        </div>
                                      )}
                                      
                                      {result.type === "codeExample" && (
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge variant="outline">{result.language}</Badge>
                                          <Badge 
                                            variant="outline" 
                                            className={
                                              result.complexity === "beginner" 
                                                ? "text-green-600 border-green-200 bg-green-50" 
                                                : result.complexity === "intermediate"
                                                ? "text-amber-600 border-amber-200 bg-amber-50"
                                                : "text-red-600 border-red-200 bg-red-50"
                                            }
                                          >
                                            {result.complexity}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <Badge variant="secondary" className="ml-2">
                                      {result.type === "codeExample" 
                                        ? "Code" 
                                        : result.type === "section" 
                                        ? "Section"
                                        : result.type === "article"
                                        ? "Article"
                                        : "Concept"}
                                    </Badge>
                                  </div>
                                  
                                  <p className="text-gray-600 text-sm mb-3">
                                    {result.snippet}
                                  </p>
                                  
                                  {result.type === "concept" && result.relatedConcepts.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {result.relatedConcepts.map((concept, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {concept}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
                
                {searchResults.length === 0 && !isSearching && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2">No results found</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                          We couldn't find any matches for "{query}". Try using different keywords 
                          or check your spelling.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                          <Button variant="outline" size="sm" onClick={() => setQuery("attention")}>
                            Try "attention"
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setQuery("transformer")}>
                            Try "transformer"
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setQuery("embedding")}>
                            Try "embedding"
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}