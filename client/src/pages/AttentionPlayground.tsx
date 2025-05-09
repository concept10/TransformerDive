import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AttentionPlayground() {
  const [inputSentence, setInputSentence] = useState("The transformer model has revolutionized natural language processing.");
  const [tokens, setTokens] = useState<string[]>([]);
  const [attentionWeights, setAttentionWeights] = useState<number[][]>([]);
  const [numHeads, setNumHeads] = useState(4);
  const [temperature, setTemperature] = useState(1.0);
  const [activeHead, setActiveHead] = useState(0);
  const [activeTab, setActiveTab] = useState("visual");

  // Initialize with default weights
  useEffect(() => {
    tokenizeInput();
  }, []);

  // Tokenize the input sentence
  const tokenizeInput = () => {
    // Simple tokenization by space (in a real app, would use a proper tokenizer)
    const newTokens = inputSentence.split(/\s+/).filter(token => token.length > 0);
    setTokens(newTokens);
    
    // Generate random attention patterns for demonstration
    const numTokens = newTokens.length;
    const heads: number[][][] = [];
    
    // Generate weights for each attention head
    for (let h = 0; h < numHeads; h++) {
      const headWeights: number[][] = [];
      for (let i = 0; i < numTokens; i++) {
        const rowWeights: number[] = [];
        let sum = 0;
        
        // Generate raw weights
        for (let j = 0; j < numTokens; j++) {
          // Different patterns for different heads
          let weight;
          if (h === 0) {
            // First head: Focus on adjacent tokens
            weight = Math.exp(-Math.abs(i - j) / temperature);
          } else if (h === 1) {
            // Second head: Focus on similar positions in sentence
            weight = i === j ? 1 : 0.1 / (Math.abs(i - j) + 1);
          } else if (h === 2) {
            // Third head: Random but structured attention
            weight = Math.random() * Math.exp(-Math.abs(i - j) / 3);
          } else {
            // Other heads: More random patterns
            weight = Math.random();
          }
          rowWeights.push(weight);
          sum += weight;
        }
        
        // Normalize to create a probability distribution
        const normalizedRow = rowWeights.map(w => w / sum);
        headWeights.push(normalizedRow);
      }
      heads.push(headWeights);
    }
    
    setAttentionWeights(heads[activeHead]);
  };

  // Calculate color intensity based on weight
  const getColorIntensity = (weight: number) => {
    const hue = 210; // Blue
    const saturation = 100;
    const lightness = 100 - (weight * 50); // Darker color for higher weights
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Handle changing the active attention head
  const handleHeadChange = (headIndex: string) => {
    const index = parseInt(headIndex);
    setActiveHead(index);
    tokenizeInput(); // Regenerate weights
  };

  // Change temperature (randomness) of attention
  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
    tokenizeInput(); // Regenerate weights
  };

  return (
    <div className="py-6 md:py-10 px-4 md:px-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Attention Mechanism Playground</h1>
      <p className="text-lg text-neutral-600 mb-8">
        Explore how self-attention works by visualizing attention weights between tokens.
        The colors represent attention strength - darker means stronger attention.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>
              Enter a sentence to visualize attention patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="input-text">Text Input</Label>
                <Input
                  id="input-text"
                  value={inputSentence}
                  onChange={(e) => setInputSentence(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={tokenizeInput}>Process Text</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attention Controls</CardTitle>
            <CardDescription>
              Adjust attention parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="head-selector">Attention Head</Label>
                <Select value={activeHead.toString()} onValueChange={handleHeadChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select head" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: numHeads}).map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        Head {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Temperature: {temperature.toFixed(1)}</Label>
                <Slider 
                  value={[temperature]} 
                  min={0.1} 
                  max={2.0} 
                  step={0.1}
                  onValueChange={handleTemperatureChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visual" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="visual">Visual Representation</TabsTrigger>
          <TabsTrigger value="matrix">Attention Matrix</TabsTrigger>
          <TabsTrigger value="explanation">How It Works</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attention Visualization</CardTitle>
              <CardDescription>
                Hover over tokens to see what they attend to
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tokens.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {tokens.map((token, i) => (
                      <div 
                        key={i}
                        className="relative px-3 py-2 rounded-lg border border-neutral-200 bg-white shadow-sm"
                      >
                        <span className="font-mono">{token}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4 w-full overflow-x-auto">
                    <div className="min-w-[600px]">
                      {tokens.map((fromToken, i) => (
                        <div key={i} className="mb-4">
                          <div className="text-sm font-medium mb-1">{fromToken} attends to:</div>
                          <div className="flex items-center">
                            <div className="w-20 font-mono text-sm text-right pr-3">{fromToken}</div>
                            <div className="flex-1 flex items-center space-x-1">
                              {tokens.map((toToken, j) => {
                                const weight = attentionWeights[i]?.[j] || 0;
                                return (
                                  <div 
                                    key={j}
                                    className="flex-1 h-6 rounded-sm" 
                                    style={{
                                      backgroundColor: getColorIntensity(weight),
                                      transition: 'all 0.3s ease',
                                    }}
                                    title={`Weight: ${(weight * 100).toFixed(1)}%`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  Enter some text and click "Process Text" to visualize attention
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Attention Weight Matrix</CardTitle>
              <CardDescription>
                Numerical view of attention weights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tokens.length > 0 && attentionWeights.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 border bg-neutral-50"></th>
                        {tokens.map((token, i) => (
                          <th key={i} className="p-2 border bg-neutral-50 font-mono text-sm">
                            {token}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((fromToken, i) => (
                        <tr key={i}>
                          <th className="p-2 border bg-neutral-50 font-mono text-sm text-left">
                            {fromToken}
                          </th>
                          {tokens.map((toToken, j) => {
                            const weight = attentionWeights[i]?.[j] || 0;
                            return (
                              <td 
                                key={j} 
                                className="p-2 border text-center"
                                style={{ backgroundColor: getColorIntensity(weight) }}
                              >
                                {weight.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  Enter some text and click "Process Text" to generate the matrix
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="explanation">
          <Card>
            <CardHeader>
              <CardTitle>How Self-Attention Works</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <h3>The Self-Attention Mechanism</h3>
              <p>
                Self-attention is a key innovation in transformer models that allows the model to weigh the importance of different words in a sentence when processing a specific word.
              </p>
              
              <h4>Step 1: Create Query, Key, and Value Vectors</h4>
              <p>
                For each token in the input sequence, the model creates three vectors:
              </p>
              <ul>
                <li><strong>Query (Q)</strong>: Represents what the token is "looking for"</li>
                <li><strong>Key (K)</strong>: Represents what the token "offers" to other tokens</li>
                <li><strong>Value (V)</strong>: Contains the actual information about the token</li>
              </ul>
              
              <h4>Step 2: Calculate Attention Scores</h4>
              <p>
                For each token, the model computes how much it should attend to every other token by taking the dot product of its Query vector with the Key vectors of all tokens.
              </p>
              <pre className="bg-neutral-100 p-3 rounded-md">
                Attention Scores = Q × K<sup>T</sup>
              </pre>
              
              <h4>Step 3: Scale and Apply Softmax</h4>
              <p>
                The scores are scaled to prevent extremely large values and then passed through a softmax function to get attention weights that sum to 1.
              </p>
              <pre className="bg-neutral-100 p-3 rounded-md">
                Attention Weights = softmax(Attention Scores ÷ √d<sub>k</sub>)
              </pre>
              
              <h4>Step 4: Compute Weighted Sum</h4>
              <p>
                Finally, the model computes a weighted sum of the Value vectors using the attention weights.
              </p>
              <pre className="bg-neutral-100 p-3 rounded-md">
                Output = Attention Weights × V
              </pre>
              
              <h3>Multi-Head Attention</h3>
              <p>
                Transformer models use multiple attention heads in parallel, each with different weights. This allows the model to:
              </p>
              <ul>
                <li>Capture different types of relationships between words</li>
                <li>Focus on both local and global context</li>
                <li>Understand complex linguistic patterns</li>
              </ul>
              
              <p>
                In this playground, you can explore different attention heads to see how they focus on different aspects of the input text.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}