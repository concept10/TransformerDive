import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, XIcon, BookIcon, PuzzleIcon, CodeIcon, WrenchIcon } from "lucide-react";

// Sample search data - in a real app, this would come from an API
const sectionData = [
  { 
    id: "introduction", 
    title: "Introduction to Transformer Models",
    content: "Transformer models have revolutionized natural language processing and beyond. Introduced in the seminal paper 'Attention Is All You Need' (Vaswani et al., 2017), these models are now the foundation of modern language AI systems.",
    tags: ["introduction", "transformers", "overview"]
  },
  {
    id: "architecture",
    title: "Architecture Overview",
    content: "The Transformer architecture consists of an encoder and decoder, each containing stacks of identical layers. The key innovation is the multi-head self-attention mechanism, which allows the model to focus on different parts of the input sequence simultaneously.",
    tags: ["architecture", "encoder", "decoder", "structure"]
  },
  {
    id: "embeddings",
    title: "Embeddings & Positional Encoding",
    content: "Transformers begin by converting input tokens into embeddings and adding positional encodings to maintain sequence order information, since the attention mechanism itself is permutation-invariant.",
    tags: ["embeddings", "positional encoding", "input representation"]
  },
  {
    id: "attention",
    title: "Self-Attention Mechanism",
    content: "The self-attention mechanism computes attention scores between all pairs of tokens in a sequence, allowing the model to weigh the importance of different tokens when processing each token. This is calculated using query, key, and value matrices.",
    tags: ["attention", "self-attention", "multi-head attention"]
  },
  {
    id: "encoder",
    title: "Encoder Structure",
    content: "The Transformer encoder consists of multiple identical layers, each containing a multi-head self-attention mechanism followed by a position-wise feed-forward network. Layer normalization and residual connections are applied around each sub-layer.",
    tags: ["encoder", "self-attention", "feed-forward", "layer norm"]
  },
  {
    id: "decoder",
    title: "Decoder Structure",
    content: "The Transformer decoder is similar to the encoder but includes an additional cross-attention layer that attends to the encoder's output. It also uses masked self-attention to prevent attending to future tokens during training.",
    tags: ["decoder", "masked attention", "cross-attention"]
  },
  {
    id: "code",
    title: "Code Implementation",
    content: "Implementing a Transformer model involves creating the embedding layers, attention mechanisms, encoder and decoder stacks, and the final output layer. Modern frameworks like PyTorch and TensorFlow provide efficient tensor operations for this purpose.",
    tags: ["code", "implementation", "pytorch", "tensorflow"]
  },
  {
    id: "training",
    title: "Training Process",
    content: "Training a Transformer model typically involves using teacher forcing with a masked language modeling objective, large datasets, and techniques like learning rate warmup and dropout to improve optimization and generalization.",
    tags: ["training", "optimization", "hyperparameters"]
  },
  {
    id: "comparison",
    title: "Model Comparisons",
    content: "Transformers offer advantages over RNNs including better parallelization, improved capture of long-range dependencies, and more stable training. However, they can be more memory-intensive and may not excel at very sequential tasks.",
    tags: ["comparison", "rnn", "lstm", "pros and cons"]
  },
  {
    id: "quiz",
    title: "Knowledge Check",
    content: "Test your understanding of Transformer models with these quiz questions covering architecture, attention mechanisms, and training methods.",
    tags: ["quiz", "assessment", "questions"]
  },
];

const codeExamples = [
  {
    id: "attention-code",
    title: "Self-Attention Implementation",
    language: "python",
    code: "class MultiHeadAttention(nn.Module):\n    def __init__(self, d_model, num_heads):\n        super(MultiHeadAttention, self).__init__()\n        # Implementation of multi-head attention"
  },
  {
    id: "encoder-code",
    title: "Encoder Layer",
    language: "python",
    code: "class EncoderLayer(nn.Module):\n    def __init__(self, d_model, num_heads, d_ff, dropout):\n        super(EncoderLayer, self).__init__()\n        # Implementation of encoder layer"
  },
  {
    id: "embedding-code",
    title: "Positional Encoding",
    language: "python",
    code: "class PositionalEncoding(nn.Module):\n    def __init__(self, d_model, max_seq_length):\n        super(PositionalEncoding, self).__init__()\n        # Implementation of positional encoding"
  }
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [location, setLocation] = useLocation();

  // Search function
  const performSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Add to recent searches
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
    }
    
    // Simulate search with setTimeout (in a real app, this would be an API call)
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      
      // Search sections
      const sectionsResults = sectionData.filter(
        section => 
          section.title.toLowerCase().includes(query) || 
          section.content.toLowerCase().includes(query) ||
          section.tags.some(tag => tag.toLowerCase().includes(query))
      );
      
      // Search code examples
      const codeResults = codeExamples.filter(
        example => 
          example.title.toLowerCase().includes(query) ||
          example.code.toLowerCase().includes(query) ||
          example.language.toLowerCase().includes(query)
      );
      
      // Combine results
      setSearchResults([...sectionsResults, ...codeResults]);
      setIsSearching(false);
    }, 300);
  };

  // Handle enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  // Navigate to a search result
  const navigateToResult = (id: string) => {
    setLocation(`/#${id}`);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Filter results based on active tab
  const filteredResults = activeTab === "all" 
    ? searchResults 
    : activeTab === "content" 
      ? searchResults.filter(result => 'content' in result) 
      : searchResults.filter(result => 'code' in result);

  return (
    <div className="py-6 md:py-10 px-4 md:px-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Content</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <Input
            type="text"
            placeholder="Search for topics, code examples, or concepts..."
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button 
                onClick={clearSearch}
                className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm text-neutral-500">
            {searchResults.length > 0 && !isSearching && 
              `${searchResults.length} result${searchResults.length === 1 ? '' : 's'} found`
            }
            {isSearching && 'Searching...'}
          </div>
          <Button onClick={performSearch} size="sm">Search</Button>
        </div>
      </div>

      {recentSearches.length > 0 && !searchResults.length && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => {
                    setSearchQuery(search);
                    performSearch();
                  }}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.length > 0 && (
        <>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList>
              <TabsTrigger value="all">All Results</TabsTrigger>
              <TabsTrigger value="content">Educational Content</TabsTrigger>
              <TabsTrigger value="code">Code Examples</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {filteredResults.map((result, index) => (
              <Card key={index} className="overflow-hidden">
                {'content' in result ? (
                  // Content result
                  <>
                    <CardHeader className="py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            <button 
                              onClick={() => navigateToResult(result.id)}
                              className="text-primary-600 hover:underline text-left"
                            >
                              {result.title}
                            </button>
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center">
                            <BookIcon className="h-3 w-3 mr-1" />
                            Section content
                          </CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigateToResult(result.id)}
                        >
                          View Section
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-0 pb-4">
                      <p className="text-neutral-600">{result.content}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {result.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </>
                ) : (
                  // Code example result
                  <>
                    <CardHeader className="py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            <button 
                              onClick={() => navigateToResult('code')}
                              className="text-primary-600 hover:underline text-left"
                            >
                              {result.title}
                            </button>
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center">
                            <CodeIcon className="h-3 w-3 mr-1" />
                            {result.language} code example
                          </CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigateToResult('code')}
                        >
                          View Code
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-0 pb-4">
                      <pre className="bg-neutral-50 p-3 rounded-md overflow-x-auto text-sm">
                        <code>{result.code}</code>
                      </pre>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {searchQuery && !isSearching && searchResults.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No results found</CardTitle>
            <CardDescription>
              We couldn't find any matches for "{searchQuery}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600 mb-4">Suggestions:</p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>Check your spelling</li>
              <li>Try more general keywords</li>
              <li>Try different keywords</li>
              <li>Try fewer keywords</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {!searchQuery && !recentSearches.length && (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Search for content</h2>
          <p className="text-neutral-600 max-w-md mx-auto">
            Enter keywords to search through educational content, code examples, and concepts related to transformer models.
          </p>
        </div>
      )}
    </div>
  );
}