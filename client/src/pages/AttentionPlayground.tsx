import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Visualization component for attention weights
function AttentionHeatmap({ text, attentionWeights }: { text: string[], attentionWeights: number[][] }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-flow-col auto-cols-min gap-2">
        {text.map((token, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-sm font-mono px-2 py-1 mb-2 border rounded">
              {token}
            </div>
            {attentionWeights.map((weights, rowIdx) => (
              <div
                key={rowIdx}
                className="w-8 h-8 flex items-center justify-center text-xs"
                style={{
                  backgroundColor: `rgba(79, 70, 229, ${weights[i] || 0})`,
                  color: weights[i] > 0.5 ? 'white' : 'black',
                }}
              >
                {weights[i] ? weights[i].toFixed(2) : "0"}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Placeholder for actual attention calculation
function calculateAttention(text: string, numHeads: number): { tokens: string[], weights: number[][] } {
  // Tokenize text naively by spaces and punctuation
  const tokens = text
    .replace(/([.,!?;:])/g, " $1 ")
    .split(/\s+/)
    .filter(token => token.length > 0);
  
  // Generate random weights for demonstration
  const weights: number[][] = [];
  for (let i = 0; i < numHeads; i++) {
    const headWeights: number[] = [];
    // Each token attends to other tokens with random weights
    for (let j = 0; j < tokens.length; j++) {
      // Generate weights that sum to 1 for each position
      headWeights.push(Math.random());
    }
    // Normalize
    const sum = headWeights.reduce((a, b) => a + b, 0);
    const normalized = headWeights.map(w => w / sum);
    weights.push(normalized);
  }
  
  return { tokens, weights };
}

export default function AttentionPlayground() {
  const [inputText, setInputText] = useState(
    "The quick brown fox jumps over the lazy dog."
  );
  const [numHeads, setNumHeads] = useState(4);
  const [attentionData, setAttentionData] = useState<{
    tokens: string[];
    weights: number[][];
  } | null>(null);
  const [activeTab, setActiveTab] = useState("input");

  // Update attention visualization
  const visualizeAttention = () => {
    if (inputText.trim()) {
      const result = calculateAttention(inputText, numHeads);
      setAttentionData(result);
      setActiveTab("visualization");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Attention Mechanism Playground</h1>
        <p className="text-gray-600 mb-6">
          Visualize attention weights in transformer models with your own input text
        </p>
        
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="input">Input</TabsTrigger>
                <TabsTrigger value="visualization" disabled={!attentionData}>
                  Visualization
                </TabsTrigger>
                <TabsTrigger value="explanation">How It Works</TabsTrigger>
              </TabsList>
              
              <TabsContent value="input">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="text-input">Input Text</Label>
                    <Textarea
                      id="text-input"
                      placeholder="Enter some text to visualize attention..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-32 mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="num-heads">Number of Attention Heads: {numHeads}</Label>
                    <Slider
                      id="num-heads"
                      min={1}
                      max={12}
                      step={1}
                      value={[numHeads]}
                      onValueChange={(value) => setNumHeads(value[0])}
                      className="mt-2"
                    />
                  </div>
                  
                  <Button 
                    onClick={visualizeAttention} 
                    className="w-full"
                    disabled={!inputText.trim()}
                  >
                    Visualize Attention
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="visualization">
                {attentionData && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Attention Weights Visualization</h3>
                      <p className="text-gray-600 mb-4">
                        Each column represents a token. Each row represents an attention head. 
                        The intensity of the color indicates the strength of attention.
                      </p>
                      
                      <div className="bg-neutral-50 p-4 rounded-lg overflow-x-auto">
                        <AttentionHeatmap 
                          text={attentionData.tokens} 
                          attentionWeights={attentionData.weights} 
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Interpretation</h3>
                      <p className="text-gray-600">
                        This visualization shows how different attention heads focus on different tokens.
                        Darker cells indicate stronger attention weights. In real transformer models,
                        these patterns would reflect meaningful relationships between tokens such as
                        syntactic dependencies, semantic relationships, or other linguistic patterns.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => setActiveTab("input")} 
                      variant="outline"
                    >
                      Back to Input
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="explanation">
                <div className="prose prose-slate max-w-none">
                  <h3>How Attention Works in Transformers</h3>
                  <p>
                    Attention is a mechanism that allows models to focus on different parts of the input
                    when producing each part of the output. In transformer models, attention is calculated
                    as follows:
                  </p>
                  
                  <ol>
                    <li>
                      <strong>Computing Query, Key, and Value vectors</strong>: Each input token is 
                      transformed into three vectors: query (Q), key (K), and value (V).
                    </li>
                    <li>
                      <strong>Calculating attention scores</strong>: The attention score between any two
                      tokens is computed as the dot product of the query vector of the first token and the
                      key vector of the second token.
                    </li>
                    <li>
                      <strong>Scaling and normalization</strong>: These scores are scaled and then 
                      normalized using a softmax function to get attention weights that sum to 1.
                    </li>
                    <li>
                      <strong>Computing the final representations</strong>: The value vectors are 
                      weighted by these attention weights to produce the final output.
                    </li>
                  </ol>
                  
                  <p>
                    Multiple attention heads allow the model to focus on different aspects of the input
                    simultaneously. This multi-headed attention is a crucial component of transformer models.
                  </p>
                  
                  <h3>Application in Language Models</h3>
                  <p>
                    In language models like GPT and BERT, attention mechanisms allow the model to:
                  </p>
                  
                  <ul>
                    <li>Capture long-range dependencies between words</li>
                    <li>Understand contextual meanings of words</li>
                    <li>Focus on relevant parts of the input when generating output</li>
                    <li>Learn syntactic and semantic relationships in the text</li>
                  </ul>
                  
                  <p>
                    This playground provides a simplified visualization of how attention operates,
                    though real language models use more sophisticated versions of this mechanism.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}