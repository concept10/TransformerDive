import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import TransformerFlow from "@/components/TransformerFlow";
import AttentionVisualizer from "@/components/AttentionVisualizer";
import CodeBlock from "@/components/CodeBlock";
import QuizQuestion from "@/components/QuizQuestion";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement>(null);
  
  // Create refs for each section
  const introRef = useRef<HTMLElement>(null);
  const architectureRef = useRef<HTMLElement>(null);
  const embeddingsRef = useRef<HTMLElement>(null);
  const attentionRef = useRef<HTMLElement>(null);
  const encoderRef = useRef<HTMLElement>(null);
  const decoderRef = useRef<HTMLElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const trainingRef = useRef<HTMLElement>(null);
  const comparisonRef = useRef<HTMLElement>(null);
  const quizRef = useRef<HTMLElement>(null);
  const resourcesRef = useRef<HTMLElement>(null);
  
  const activeSection = useScrollSpy({
    sectionElementRefs: [
      { id: "introduction", ref: introRef },
      { id: "architecture", ref: architectureRef },
      { id: "embeddings", ref: embeddingsRef },
      { id: "attention", ref: attentionRef },
      { id: "encoder", ref: encoderRef },
      { id: "decoder", ref: decoderRef },
      { id: "code", ref: codeRef },
      { id: "training", ref: trainingRef },
      { id: "comparison", ref: comparisonRef },
      { id: "quiz", ref: quizRef },
      { id: "resources", ref: resourcesRef },
    ],
    options: {
      root: sectionsRef.current,
      threshold: 0.2,
    }
  });

  // Fetch content from the server
  const { data: content, isLoading } = useQuery({
    queryKey: ['/api/content'],
  });

  // Set the hash based on active section
  useEffect(() => {
    if (activeSection && activeSection !== window.location.hash.substring(1)) {
      window.history.replaceState(null, "", `#${activeSection}`);
    }
  }, [activeSection]);

  // Code block tabs
  const attentionCodeTabs = [
    {
      id: "self-attention",
      label: "Self-Attention",
      language: "python",
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super(MultiHeadAttention, self).__init__()
        self.num_heads = num_heads
        self.d_model = d_model
        
        assert d_model % num_heads == 0, "d_model must be divisible by num_heads"
        
        self.d_k = d_model // num_heads
        
        # Linear projections
        self.q_linear = nn.Linear(d_model, d_model)
        self.k_linear = nn.Linear(d_model, d_model)
        self.v_linear = nn.Linear(d_model, d_model)
        self.out = nn.Linear(d_model, d_model)
        
    def forward(self, q, k, v, mask=None):
        batch_size = q.size(0)
        
        # Linear projections and reshape
        q = self.q_linear(q).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        k = self.k_linear(k).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        v = self.v_linear(v).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        # Compute attention scores
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_k)
        
        # Apply mask if provided
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        # Apply softmax to get attention weights
        attention_weights = F.softmax(scores, dim=-1)
        
        # Apply attention weights to values
        output = torch.matmul(attention_weights, v)
        
        # Reshape and concatenate heads
        output = output.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        
        # Final linear projection
        return self.out(output)`
    },
    {
      id: "encoder-layer",
      label: "Encoder Layer",
      language: "python",
      code: `class EncoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super(EncoderLayer, self).__init__()
        self.self_attn = MultiHeadAttention(d_model, num_heads)
        self.feed_forward = FeedForward(d_model, d_ff)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x, mask=None):
        # Self-attention block with residual connection and layer normalization
        attn_output = self.self_attn(x, x, x, mask)
        x = self.norm1(x + self.dropout(attn_output))
        
        # Feed-forward block with residual connection and layer normalization
        ff_output = self.feed_forward(x)
        x = self.norm2(x + self.dropout(ff_output))
        
        return x
        
class FeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super(FeedForward, self).__init__()
        self.linear1 = nn.Linear(d_model, d_ff)
        self.linear2 = nn.Linear(d_ff, d_model)
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x):
        return self.linear2(self.dropout(F.relu(self.linear1(x))))`
    },
    {
      id: "full-transformer",
      label: "Full Transformer",
      language: "python",
      code: `class Transformer(nn.Module):
    def __init__(self, src_vocab_size, tgt_vocab_size, d_model, num_heads, 
                 num_encoder_layers, num_decoder_layers, d_ff, max_seq_len, dropout=0.1):
        super(Transformer, self).__init__()
        
        # Embeddings
        self.src_embedding = nn.Embedding(src_vocab_size, d_model)
        self.tgt_embedding = nn.Embedding(tgt_vocab_size, d_model)
        self.positional_encoding = PositionalEncoding(d_model, max_seq_len)
        
        # Encoder and Decoder
        encoder_layer = nn.TransformerEncoderLayer(d_model, num_heads, d_ff, dropout)
        self.encoder = nn.TransformerEncoder(encoder_layer, num_encoder_layers)
        
        decoder_layer = nn.TransformerDecoderLayer(d_model, num_heads, d_ff, dropout)
        self.decoder = nn.TransformerDecoder(decoder_layer, num_decoder_layers)
        
        # Final output layer
        self.output_layer = nn.Linear(d_model, tgt_vocab_size)
        
        self.d_model = d_model
        
    def forward(self, src, tgt, src_mask=None, tgt_mask=None, memory_mask=None):
        # Embed source and target sequences and add positional encoding
        src_embedded = self.positional_encoding(self.src_embedding(src) * math.sqrt(self.d_model))
        tgt_embedded = self.positional_encoding(self.tgt_embedding(tgt) * math.sqrt(self.d_model))
        
        # Pass through encoder
        memory = self.encoder(src_embedded, src_mask)
        
        # Pass through decoder
        output = self.decoder(tgt_embedded, memory, tgt_mask, memory_mask)
        
        # Generate logits for next token prediction
        return self.output_layer(output)`
    }
  ];

  const embeddings = [
    {
      id: "word-embeddings",
      label: "Word Embeddings",
      language: "python",
      code: `import torch
import torch.nn as nn
import math

class Embeddings(nn.Module):
    def __init__(self, vocab_size, d_model):
        super(Embeddings, self).__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.d_model = d_model
        
    def forward(self, x):
        # Scale embeddings by sqrt(d_model)
        return self.embedding(x) * math.sqrt(self.d_model)`
    },
    {
      id: "positional-encoding",
      label: "Positional Encoding",
      language: "python",
      code: `import torch
import torch.nn as nn
import math

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_seq_length=5000):
        super(PositionalEncoding, self).__init__()
        
        # Create a tensor of shape (max_seq_length, d_model)
        pe = torch.zeros(max_seq_length, d_model)
        
        # Create a tensor of shape (max_seq_length, 1)
        position = torch.arange(0, max_seq_length, dtype=torch.float).unsqueeze(1)
        
        # Create a tensor of shape (1, d_model/2)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        
        # Apply sin to even indices
        pe[:, 0::2] = torch.sin(position * div_term)
        
        # Apply cos to odd indices
        pe[:, 1::2] = torch.cos(position * div_term)
        
        # Add batch dimension (1, max_seq_length, d_model)
        pe = pe.unsqueeze(0)
        
        # Register as buffer (not a parameter, but part of the module)
        self.register_buffer('pe', pe)
        
    def forward(self, x):
        # Add positional encoding to input embeddings
        x = x + self.pe[:, :x.size(1), :]
        return x`
    }
  ];

  // Quiz questions
  const quizQuestions = [
    {
      questionNumber: 1,
      question: "What's the main advantage of self-attention over recurrent neural networks?",
      options: [
        { id: "q1-a", text: "Self-attention requires less memory", isCorrect: false },
        { id: "q1-b", text: "Self-attention creates smaller models", isCorrect: false },
        { id: "q1-c", text: "Self-attention allows parallelization of sequence processing", isCorrect: true },
        { id: "q1-d", text: "Self-attention automatically improves accuracy", isCorrect: false }
      ],
      explanation: "Self-attention allows the model to process all tokens in the sequence in parallel, unlike RNNs which must process tokens sequentially. This enables much better utilization of modern hardware like GPUs."
    },
    {
      questionNumber: 2,
      question: "What is the purpose of the scaling factor (√d_k) in the attention formula?",
      options: [
        { id: "q2-a", text: "To reduce the model's memory usage", isCorrect: false },
        { id: "q2-b", text: "To stabilize gradients during training", isCorrect: true },
        { id: "q2-c", text: "To make the model run faster", isCorrect: false },
        { id: "q2-d", text: "To increase the attention span", isCorrect: false }
      ],
      explanation: "The scaling factor prevents the dot products from growing too large in magnitude, which would push the softmax function into regions with very small gradients, making training difficult."
    },
    {
      questionNumber: 3,
      question: "Which of the following is NOT a component of a Transformer encoder layer?",
      options: [
        { id: "q3-a", text: "Multi-head attention", isCorrect: false },
        { id: "q3-b", text: "Masked self-attention", isCorrect: true },
        { id: "q3-c", text: "Layer normalization", isCorrect: false },
        { id: "q3-d", text: "Feed-forward network", isCorrect: false }
      ],
      explanation: "Masked self-attention is used in the decoder, not the encoder. The encoder uses standard self-attention that can attend to all positions in the input sequence."
    }
  ];

  if (isLoading) {
    return (
      <div className="py-6 md:py-10 px-4 md:px-10 max-w-5xl mx-auto">
        <p>Loading educational content...</p>
      </div>
    );
  }

  return (
    <div ref={sectionsRef} className="py-6 md:py-10 px-4 md:px-10 max-w-5xl mx-auto">
      {/* Introduction Section */}
      <section id="introduction" ref={introRef} className="mb-16">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Introduction to Transformer Models</h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-neutral-600 leading-relaxed mb-6">
            Transformer models have revolutionized natural language processing and beyond. Introduced in the seminal paper <a href="https://arxiv.org/abs/1706.03762" className="text-primary-600 hover:underline">"Attention Is All You Need"</a> (Vaswani et al., 2017), these models are now the foundation of modern language AI systems.
          </p>

          <Card className="mb-8">
            <CardHeader className="px-6 py-4 border-b border-neutral-200">
              <CardTitle className="text-lg">Key Innovations of Transformers</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span>Eliminated sequential nature of RNNs, enabling more parallelization</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span>Introduced multi-head self-attention mechanism</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span>Provided a fixed-length context model that better captures long-range dependencies</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span>Established foundation for models like BERT, GPT, T5, and other large language models</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold mb-4">Evolution of Transformer Models</h3>
          <div className="relative pb-8">
            <div className="absolute top-5 left-5 h-full w-0.5 bg-neutral-200" aria-hidden="true"></div>
            
            <div className="relative flex items-start mb-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-500 text-white shrink-0">
                <i className="ri-article-line"></i>
              </div>
              <div className="ml-6">
                <h4 className="text-lg font-medium">2017: Original Transformer Paper</h4>
                <p className="mt-1 text-neutral-600">"Attention Is All You Need" introduces the Transformer architecture.</p>
              </div>
            </div>
            
            <div className="relative flex items-start mb-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary-500 text-white shrink-0">
                <i className="ri-robot-line"></i>
              </div>
              <div className="ml-6">
                <h4 className="text-lg font-medium">2018: BERT</h4>
                <p className="mt-1 text-neutral-600">Bidirectional Encoder Representations from Transformers by Google.</p>
              </div>
            </div>
            
            <div className="relative flex items-start mb-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent-500 text-white shrink-0">
                <i className="ri-chat-3-line"></i>
              </div>
              <div className="ml-6">
                <h4 className="text-lg font-medium">2018-2023: GPT Models</h4>
                <p className="mt-1 text-neutral-600">OpenAI's series of increasingly powerful autoregressive language models.</p>
              </div>
            </div>
            
            <div className="relative flex items-start">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-neutral-600 text-white shrink-0">
                <i className="ri-global-line"></i>
              </div>
              <div className="ml-6">
                <h4 className="text-lg font-medium">2023+: Modern Innovations</h4>
                <p className="mt-1 text-neutral-600">Mixture of Experts, specialized architectures, and efficiency improvements.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Component: Transformer Applications */}
        <div className="my-10">
          <h3 className="text-xl font-semibold mb-4">Applications of Transformer Models</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                  <i className="ri-translate-2 text-xl"></i>
                </div>
                <h4 className="text-lg font-medium mb-2">Machine Translation</h4>
                <p className="text-neutral-600 text-sm">Neural machine translation systems like Google Translate use Transformer models to provide more accurate translations.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center mb-4 group-hover:bg-secondary-600 group-hover:text-white transition-colors duration-200">
                  <i className="ri-ai-generate text-xl"></i>
                </div>
                <h4 className="text-lg font-medium mb-2">Text Generation</h4>
                <p className="text-neutral-600 text-sm">Autoregressive models like GPT produce human-like text for content creation, chatbots, and creative writing.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center mb-4 group-hover:bg-accent-600 group-hover:text-white transition-colors duration-200">
                  <i className="ri-file-search-line text-xl"></i>
                </div>
                <h4 className="text-lg font-medium mb-2">Question Answering</h4>
                <p className="text-neutral-600 text-sm">Systems that can understand questions and extract relevant answers from documents or knowledge bases.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Architecture Overview Section */}
      <section id="architecture" ref={useScrollSpy.sectionRefs[1].ref} className="mb-16">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Transformer Architecture Overview</h2>
        
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
          The Transformer architecture consists of an encoder-decoder structure, though many modern variants use only one of these components. Let's explore the high-level view before diving into each component.
        </p>
        
        <ArchitectureDiagram />
        
        {/* Information flow interactive diagram */}
        <div className="my-10">
          <h3 className="text-xl font-semibold mb-4">Information Flow in a Transformer</h3>
          <TransformerFlow />
        </div>
      </section>

      {/* Embeddings Section */}
      <section id="embeddings" ref={useScrollSpy.sectionRefs[2].ref} className="mb-16">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Embeddings & Positional Encoding</h2>
        
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
          Before words can be processed by the Transformer architecture, they need to be converted into a form the model can understand. This is done through embeddings and positional encodings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-neutral-200">
              <CardTitle className="text-lg">Word Embeddings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mr-4">
                  <i className="ri-file-word-line text-xl"></i>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Word to Vector Mapping</h4>
                  <p className="text-sm text-neutral-600">Each token (word or sub-word) is mapped to a high-dimensional vector that captures semantic meaning.</p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">Word embeddings convert tokens into dense vectors of floating point numbers. These vectors are learned during training and position similar words close to each other in vector space.</p>
              <div className="text-sm text-neutral-500 bg-neutral-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Example:</p>
                <p>Token "king" → [0.1, -0.5, 0.2, ..., 0.7]</p>
                <p>Token "queen" → [0.2, -0.4, 0.1, ..., 0.8]</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-6 py-4 border-b border-neutral-200">
              <CardTitle className="text-lg">Positional Encoding</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center mr-4">
                  <i className="ri-sort-asc text-xl"></i>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Position Information</h4>
                  <p className="text-sm text-neutral-600">Adds information about the position of each token in the sequence.</p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">Unlike RNNs, Transformers process all tokens simultaneously, which means they have no inherent understanding of token order. Positional encodings add this information.</p>
              <div className="text-sm bg-neutral-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Formula:</p>
                <div className="font-mono">
                  <p>PE(pos,2i) = sin(pos/10000<sup>2i/d<sub>model</sub></sup>)</p>
                  <p>PE(pos,2i+1) = cos(pos/10000<sup>2i/d<sub>model</sub></sup>)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-xl font-semibold mb-4">Implementation in Code</h3>
        <CodeBlock tabs={embeddings} defaultTab="word-embeddings" />

        <Card className="mb-6">
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-lg">Why Sinusoidal Positional Encoding?</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5">
                  <i className="ri-check-line text-sm"></i>
                </span>
                <div>
                  <p className="text-neutral-600">Allows the model to easily learn to attend by relative positions</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5">
                  <i className="ri-check-line text-sm"></i>
                </span>
                <div>
                  <p className="text-neutral-600">Can be computed for arbitrary sequence lengths</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5">
                  <i className="ri-check-line text-sm"></i>
                </span>
                <div>
                  <p className="text-neutral-600">The values have a known pattern that can help the model understand position differences</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Self-Attention Section */}
      <section id="attention" ref={useScrollSpy.sectionRefs[3].ref} className="mb-16">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Self-Attention Mechanism</h2>
        
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
          The self-attention mechanism is at the heart of the Transformer architecture. It allows the model to weigh the importance of different words in a sequence when representing each word.
        </p>
        
        <AttentionVisualizer />
      </section>

      {/* Encoder Structure Section */}
      <section id="encoder" ref={useScrollSpy.sectionRefs[4].ref} className="mb-16">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Encoder Structure</h2>
        
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
          The Transformer encoder processes the input sequence and creates a representation that captures the context of each token in relation to all other tokens.
        </p>
        
        <Card className="mb-8">
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-lg">Encoder Layer Components</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="w-full bg-neutral-100 rounded-lg p-4 mb-4 flex flex-col items-center">
                  <svg width="200" height="300" viewBox="0 0 200 300" className="max-w-full h-auto">
                    {/* Input */}
                    <rect x="50" y="20" width="100" height="30" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="4" />
                    <text x="100" y="40" textAnchor="middle" fill="#1e40af" fontSize="14">Input Embeddings</text>
                    
                    {/* Flow arrow */}
                    <path d="M 100 50 L 100 70" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    
                    {/* Multi-Head Attention */}
                    <rect x="30" y="70" width="140" height="50" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2" rx="4" />
                    <text x="100" y="100" textAnchor="middle" fill="#4338ca" fontSize="14">Multi-Head Attention</text>
                    
                    {/* Add & Norm 1 */}
                    <rect x="30" y="140" width="140" height="30" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" rx="4" />
                    <text x="100" y="160" textAnchor="middle" fill="#4338ca" fontSize="12">Add & Normalize</text>
                    
                    {/* Flow arrow */}
                    <path d="M 100 170 L 100 190" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    
                    {/* Feed Forward */}
                    <rect x="30" y="190" width="140" height="50" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2" rx="4" />
                    <text x="100" y="220" textAnchor="middle" fill="#4338ca" fontSize="14">Feed Forward Network</text>
                    
                    {/* Add & Norm 2 */}
                    <rect x="30" y="260" width="140" height="30" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" rx="4" />
                    <text x="100" y="280" textAnchor="middle" fill="#4338ca" fontSize="12">Add & Normalize</text>
                    
                    {/* Arrowhead marker definition */}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
                      </marker>
                    </defs>
                  </svg>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Key Components</h4>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-focus-2-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Multi-Head Self-Attention</h5>
                      <p className="text-sm text-neutral-600">Processes all input tokens simultaneously, calculating attention weights between each token pair.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-add-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Residual Connections</h5>
                      <p className="text-sm text-neutral-600">Skip connections that add the input to the output of each sub-layer, helping gradient flow during training.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-scales-3-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Layer Normalization</h5>
                      <p className="text-sm text-neutral-600">Normalizes the values across the feature dimension, improving training stability.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-node-tree text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Feed-Forward Network</h5>
                      <p className="text-sm text-neutral-600">A simple two-layer neural network applied to each position independently, increasing model capacity.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-lg">Stacked Encoder Layers</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-neutral-600 mb-4">
              The encoder consists of multiple identical layers stacked on top of each other. Each layer refines the representations from the previous layer. In the original Transformer paper, 6 encoder layers were used.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <div className="font-medium mb-2">BERT Base</div>
                <p className="text-sm text-neutral-600">12 encoder layers</p>
                <p className="text-sm text-neutral-600">768 hidden dimensions</p>
                <p className="text-sm text-neutral-600">12 attention heads</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <div className="font-medium mb-2">BERT Large</div>
                <p className="text-sm text-neutral-600">24 encoder layers</p>
                <p className="text-sm text-neutral-600">1024 hidden dimensions</p>
                <p className="text-sm text-neutral-600">16 attention heads</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 text-center">
                <div className="font-medium mb-2">RoBERTa Large</div>
                <p className="text-sm text-neutral-600">24 encoder layers</p>
                <p className="text-sm text-neutral-600">1024 hidden dimensions</p>
                <p className="text-sm text-neutral-600">16 attention heads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Decoder Structure Section */}
      <section id="decoder" ref={useScrollSpy.sectionRefs[5].ref} className="mb-16">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Decoder Structure</h2>
        
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
          The Transformer decoder generates the output sequence one token at a time, using both the encoder's output and previously generated tokens.
        </p>
        
        <Card className="mb-8">
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-lg">Decoder Layer Components</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="w-full bg-neutral-100 rounded-lg p-4 mb-4 flex flex-col items-center">
                  <svg width="200" height="400" viewBox="0 0 200 400" className="max-w-full h-auto">
                    {/* Input */}
                    <rect x="50" y="20" width="100" height="30" fill="#dcfce7" stroke="#10b981" strokeWidth="2" rx="4" />
                    <text x="100" y="40" textAnchor="middle" fill="#047857" fontSize="14">Output Embeddings</text>
                    
                    {/* Flow arrow */}
                    <path d="M 100 50 L 100 70" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrow-decoder)" />
                    
                    {/* Masked Multi-Head Attention */}
                    <rect x="30" y="70" width="140" height="50" fill="#bbf7d0" stroke="#10b981" strokeWidth="2" rx="4" />
                    <text x="100" y="95" textAnchor="middle" fill="#047857" fontSize="12">Masked Multi-Head</text>
                    <text x="100" y="110" textAnchor="middle" fill="#047857" fontSize="12">Attention</text>
                    
                    {/* Add & Norm 1 */}
                    <rect x="30" y="140" width="140" height="30" fill="#dcfce7" stroke="#10b981" strokeWidth="2" rx="4" />
                    <text x="100" y="160" textAnchor="middle" fill="#047857" fontSize="12">Add & Normalize</text>
                    
                    {/* Flow arrow */}
                    <path d="M 100 170 L 100 190" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrow-decoder)" />
                    
                    {/* Cross-Attention */}
                    <rect x="30" y="190" width="140" height="50" fill="#bbf7d0" stroke="#10b981" strokeWidth="2" rx="4" />
                    <text x="100" y="215" textAnchor="middle" fill="#047857" fontSize="12">Cross-Attention</text>
                    <text x="100" y="230" textAnchor="middle" fill="#047857" fontSize="10">(Encoder-Decoder Attention)</text>
                    
                    {/* Encoder input to Cross-Attention */}
                    <path d="M 0 215 L 30 215" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrow-decoder)" />
                    <text x="15" y="200" textAnchor="middle" fill="#1e40af" fontSize="10" transform="rotate(-90, 15, 200)">Encoder Output</text>
                    
                    {/* Add & Norm 2 */}
                    <rect x="30" y="260" width="140" height="30" fill="#dcfce7" stroke="#10b981" strokeWidth="2" rx="4" />
                    <text x="100" y="280" textAnchor="middle" fill="#047857" fontSize="12">Add & Normalize</text>
                    
                    {/* Flow arrow */}
                    <path d="M 100 290 L 100 310" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrow-decoder)" />
                    
                    {/* Feed Forward */}
                    <rect x="30" y="310" width="140" height="50" fill="#bbf7d0" stroke="#10b981" strokeWidth="2" rx="4" />
                    <text x="100" y="340" textAnchor="middle" fill="#047857" fontSize="14">Feed Forward Network</text>
                    
                    {/* Add & Norm 3 */}
                    <rect x="30" y="380" width="140" height="30" fill="#dcfce7" stroke="#10b981" strokeWidth="2" rx="4" />
                    <text x="100" y="400" textAnchor="middle" fill="#047857" fontSize="12">Add & Normalize</text>
                    
                    {/* Arrowhead marker definition */}
                    <defs>
                      <marker id="arrow-decoder" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
                      </marker>
                    </defs>
                  </svg>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Key Components</h4>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-eye-off-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Masked Self-Attention</h5>
                      <p className="text-sm text-neutral-600">Prevents the decoder from looking at future tokens during training, enabling autoregressive generation.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-link-unlink-m text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Cross-Attention</h5>
                      <p className="text-sm text-neutral-600">Allows the decoder to attend to all encoder outputs, connecting the two parts of the model.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-add-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Residual Connections</h5>
                      <p className="text-sm text-neutral-600">Skip connections that add the input to the output of each sub-layer, similar to the encoder.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-scales-3-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Layer Normalization</h5>
                      <p className="text-sm text-neutral-600">Normalizes the values to stabilize training, applied after each sub-layer.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-node-tree text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Feed-Forward Network</h5>
                      <p className="text-sm text-neutral-600">A two-layer neural network similar to that in the encoder.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-xl font-semibold mb-4">Decoder-Only vs. Encoder-Decoder Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-neutral-200">
              <CardTitle className="text-lg">Decoder-Only Models</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center mr-4">
                  <i className="ri-chat-3-line text-xl"></i>
                </div>
                <div>
                  <h4 className="font-medium">GPT Family</h4>
                  <p className="text-sm text-neutral-600">Generative Pre-trained Transformers</p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">These models use only the decoder part of the original Transformer, with masked self-attention to predict the next token in a sequence. They excel at text generation tasks.</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span className="text-sm">Text completion and generation</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span className="text-sm">Conversational AI</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span className="text-sm">Creative writing</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-6 py-4 border-b border-neutral-200">
              <CardTitle className="text-lg">Encoder-Decoder Models</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mr-4">
                  <i className="ri-translate-2 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-medium">T5, BART</h4>
                  <p className="text-sm text-neutral-600">Text-to-Text Transfer Transformer</p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">These models use both encoder and decoder, making them suitable for tasks that transform one sequence into another, like translation or summarization.</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span className="text-sm">Machine translation</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span className="text-sm">Text summarization</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                    <i className="ri-check-line text-sm"></i>
                  </span>
                  <span className="text-sm">Question answering</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Code Implementation Section */}
      <section id="code" ref={useScrollSpy.sectionRefs[6].ref} className="mb-16">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Code Implementation</h2>
        
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
          Understanding the implementation details of Transformer models can deepen your knowledge of how they work. Let's examine key components in Python code.
        </p>
        
        <CodeBlock tabs={attentionCodeTabs} defaultTab="self-attention" />
        
        <p className="text-neutral-600 mb-8">
          The above implementation demonstrates the key components of a Transformer model. Note that this is a simplified version - production implementations might include additional optimizations and features.
        </p>

        <h3 className="text-xl font-semibold mb-4">Implementation Frameworks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
                <i className="ri-fire-line text-xl"></i>
              </div>
              <h4 className="text-lg font-medium mb-2">PyTorch</h4>
              <p className="text-neutral-600 text-sm mb-4">Dynamic computation graph framework with native Transformer support.</p>
              <div className="text-sm text-neutral-500">
                <code>torch.nn.Transformer</code>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <i className="ri-code-box-line text-xl"></i>
              </div>
              <h4 className="text-lg font-medium mb-2">TensorFlow</h4>
              <p className="text-neutral-600 text-sm mb-4">Google's ML framework with Transformer layers in Keras.</p>
              <div className="text-sm text-neutral-500">
                <code>tf.keras.layers.TransformerEncoder</code>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <i className="ri-server-line text-xl"></i>
              </div>
              <h4 className="text-lg font-medium mb-2">Hugging Face</h4>
              <p className="text-neutral-600 text-sm mb-4">Library with pre-trained transformer models ready for use.</p>
              <div className="text-sm text-neutral-500">
                <code>transformers.AutoModel</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Training Process Section */}
      <section id="training" ref={useScrollSpy.sectionRefs[7].ref} className="mb-16">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Training Process</h2>
        
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
          Training transformer models involves several key steps and techniques that help these large models learn effectively.
        </p>
        
        <Card className="mb-8">
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-lg">Pre-training and Fine-tuning Approach</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-3 text-lg">1. Pre-training</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-database-2-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Massive Data</h5>
                      <p className="text-sm text-neutral-600">Train on large corpus of text data (e.g., Common Crawl, Wikipedia)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-puzzle-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Self-supervised Learning</h5>
                      <p className="text-sm text-neutral-600">Using tasks like masked language modeling (BERT) or next token prediction (GPT)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-scales-3-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">General Knowledge</h5>
                      <p className="text-sm text-neutral-600">Model learns language patterns, facts, and general knowledge</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-lg">2. Fine-tuning</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-focus-2-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Task Adaptation</h5>
                      <p className="text-sm text-neutral-600">Train further on specific dataset for targeted tasks</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-chat-check-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Supervised Learning</h5>
                      <p className="text-sm text-neutral-600">Uses labeled data specific to the downstream task</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-secondary-100 text-secondary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-money-dollar-circle-line text-sm"></i>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Resource Efficient</h5>
                      <p className="text-sm text-neutral-600">Requires less data and compute than pre-training</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-xl font-semibold mb-4">Common Pre-training Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-neutral-200">
              <CardTitle className="text-lg">Masked Language Modeling (MLM)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
                  <i className="ri-mask-line text-xl"></i>
                </div>
                <div>
                  <h4 className="font-medium">Used by BERT, RoBERTa</h4>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">Randomly mask tokens in the input and train the model to predict the masked tokens based on surrounding context.</p>
              <div className="bg-neutral-100 p-4 rounded-lg mb-4">
                <p className="font-mono text-sm">
                  Input: "The dog [MASK] on the [MASK]."<br/>
                  Model predicts: "sits" and "chair"
                </p>
              </div>
              <p className="text-sm text-neutral-500">Enables bidirectional context understanding.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-6 py-4 border-b border-neutral-200">
              <CardTitle className="text-lg">Causal Language Modeling (CLM)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-4">
                  <i className="ri-arrow-right-line text-xl"></i>
                </div>
                <div>
                  <h4 className="font-medium">Used by GPT models</h4>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">Predict the next token based on all previous tokens in the sequence. Each token attends only to previous tokens.</p>
              <div className="bg-neutral-100 p-4 rounded-lg mb-4">
                <p className="font-mono text-sm">
                  Input: "The dog sits"<br/>
                  Model predicts: "on"
                </p>
              </div>
              <p className="text-sm text-neutral-500">Well-suited for text generation tasks.</p>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-xl font-semibold mb-4">Training Optimizations</h3>
        <div className="space-y-4 mb-8">
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
              <i className="ri-speed-line text-sm"></i>
            </div>
            <div>
              <h5 className="font-medium mb-1">Gradient Accumulation</h5>
              <p className="text-sm text-neutral-600">Accumulate gradients over multiple batches before updating weights, enabling larger effective batch sizes.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
              <i className="ri-compasses-2-line text-sm"></i>
            </div>
            <div>
              <h5 className="font-medium mb-1">Mixed Precision Training</h5>
              <p className="text-sm text-neutral-600">Use both 16-bit and 32-bit floating-point types to reduce memory usage and increase training speed.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
              <i className="ri-distribute-vertical text-sm"></i>
            </div>
            <div>
              <h5 className="font-medium mb-1">Distributed Training</h5>
              <p className="text-sm text-neutral-600">Parallelize model training across multiple GPUs or TPUs using data parallelism or model parallelism techniques.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
              <i className="ri-line-chart-line text-sm"></i>
            </div>
            <div>
              <h5 className="font-medium mb-1">Learning Rate Scheduling</h5>
              <p className="text-sm text-neutral-600">Use warmup followed by decay to improve convergence and final model quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Model Comparisons Section */}
      <section id="comparison" ref={useScrollSpy.sectionRefs[8].ref} className="mb-16">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Model Comparisons</h2>
        
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
          There are many variants of transformer models, each with their own architecture and training methodology. Let's compare some of the most influential ones.
        </p>
        
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-lg">Major Transformer Model Families</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Architecture</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Pre-training Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Key Features</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Best Use Cases</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">BERT</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Encoder-only</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Masked Language Modeling</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">Bidirectional context understanding</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">Classification, NER, QA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-600">GPT</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Decoder-only</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Causal Language Modeling</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">Auto-regressive text generation</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">Text generation, completion, conversation</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-accent-600">T5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Encoder-Decoder</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Span corruption</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">Text-to-text framework for all NLP tasks</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">Translation, summarization, QA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">RoBERTa</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Encoder-only</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Masked Language Modeling</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">BERT with optimized training procedure</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">Classification, NER, sentiment analysis</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">BART</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Encoder-Decoder</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">Text corruption and reconstruction</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">Combines BERT and GPT pretraining</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">Summarization, translation, dialogue</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-xl font-semibold mb-4">Size Comparison</h3>
        <div className="grid grid-cols-1 mb-8">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-neutral-200">
              <CardTitle className="text-lg">Model Size Evolution (Parameters)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full bg-neutral-100 rounded-lg p-4 flex flex-col items-center">
                <svg width="800" height="200" viewBox="0 0 800 200" className="max-w-full h-auto">
                  {/* Horizontal axis */}
                  <line x1="50" y1="150" x2="750" y2="150" stroke="#4b5563" strokeWidth="2" />
                  
                  {/* Vertical axis */}
                  <line x1="50" y1="150" x2="50" y2="20" stroke="#4b5563" strokeWidth="2" />
                  
                  {/* Horizontal markers and labels */}
                  <line x1="150" y1="150" x2="150" y2="155" stroke="#4b5563" strokeWidth="2" />
                  <text x="150" y="170" textAnchor="middle" fill="#4b5563" fontSize="12">BERT Base (2018)</text>
                  
                  <line x1="250" y1="150" x2="250" y2="155" stroke="#4b5563" strokeWidth="2" />
                  <text x="250" y="170" textAnchor="middle" fill="#4b5563" fontSize="12">GPT-2 (2019)</text>
                  
                  <line x1="350" y1="150" x2="350" y2="155" stroke="#4b5563" strokeWidth="2" />
                  <text x="350" y="170" textAnchor="middle" fill="#4b5563" fontSize="12">T5 Large (2020)</text>
                  
                  <line x1="450" y1="150" x2="450" y2="155" stroke="#4b5563" strokeWidth="2" />
                  <text x="450" y="170" textAnchor="middle" fill="#4b5563" fontSize="12">GPT-3 (2020)</text>
                  
                  <line x1="550" y1="150" x2="550" y2="155" stroke="#4b5563" strokeWidth="2" />
                  <text x="550" y="170" textAnchor="middle" fill="#4b5563" fontSize="12">PaLM (2022)</text>
                  
                  <line x1="650" y1="150" x2="650" y2="155" stroke="#4b5563" strokeWidth="2" />
                  <text x="650" y="170" textAnchor="middle" fill="#4b5563" fontSize="12">GPT-4 (2023)</text>
                  
                  {/* Vertical markers and labels */}
                  <line x1="45" y1="130" x2="50" y2="130" stroke="#4b5563" strokeWidth="2" />
                  <text x="40" y="135" textAnchor="end" fill="#4b5563" fontSize="12">1B</text>
                  
                  <line x1="45" y1="110" x2="50" y2="110" stroke="#4b5563" strokeWidth="2" />
                  <text x="40" y="115" textAnchor="end" fill="#4b5563" fontSize="12">10B</text>
                  
                  <line x1="45" y1="90" x2="50" y2="90" stroke="#4b5563" strokeWidth="2" />
                  <text x="40" y="95" textAnchor="end" fill="#4b5563" fontSize="12">100B</text>
                  
                  <line x1="45" y1="70" x2="50" y2="70" stroke="#4b5563" strokeWidth="2" />
                  <text x="40" y="75" textAnchor="end" fill="#4b5563" fontSize="12">500B</text>
                  
                  <line x1="45" y1="50" x2="50" y2="50" stroke="#4b5563" strokeWidth="2" />
                  <text x="40" y="55" textAnchor="end" fill="#4b5563" fontSize="12">1T+</text>
                  
                  {/* Model bars */}
                  <rect x="130" y="140" width="40" height="10" fill="#3b82f6" />
                  <text x="150" y="135" textAnchor="middle" fill="#3b82f6" fontSize="10">110M</text>
                  
                  <rect x="230" y="135" width="40" height="15" fill="#10b981" />
                  <text x="250" y="130" textAnchor="middle" fill="#10b981" fontSize="10">1.5B</text>
                  
                  <rect x="330" y="130" width="40" height="20" fill="#ec4899" />
                  <text x="350" y="125" textAnchor="middle" fill="#ec4899" fontSize="10">11B</text>
                  
                  <rect x="430" y="103" width="40" height="47" fill="#10b981" />
                  <text x="450" y="98" textAnchor="middle" fill="#10b981" fontSize="10">175B</text>
                  
                  <rect x="530" y="87" width="40" height="63" fill="#6366f1" />
                  <text x="550" y="82" textAnchor="middle" fill="#6366f1" fontSize="10">540B</text>
                  
                  <rect x="630" y="50" width="40" height="100" fill="#10b981" />
                  <text x="650" y="45" textAnchor="middle" fill="#10b981" fontSize="10">~1.8T</text>
                </svg>
              </div>
              <p className="text-sm text-neutral-500 mt-4 text-center">Note: Parameter counts are approximate and GPT-4's exact size is not publicly disclosed.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Knowledge Check Section */}
      <section id="quiz" ref={useScrollSpy.sectionRefs[9].ref} className="mb-16">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Test Your Knowledge</h2>
        
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">
          Let's check your understanding of the Transformer architecture with a few questions.
        </p>
        
        {quizQuestions.map((question) => (
          <QuizQuestion
            key={question.questionNumber}
            questionNumber={question.questionNumber}
            question={question.question}
            options={question.options}
            explanation={question.explanation}
          />
        ))}

        <Card>
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-lg">Your Score</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-neutral-600 mb-4">Check your answers for all questions to see your total score.</p>
            <Button className="bg-primary-600 hover:bg-primary-700">
              Review All Answers
            </Button>
          </CardContent>
        </Card>
      </section>
      
      {/* Further Resources */}
      <section id="resources" ref={useScrollSpy.sectionRefs[10].ref} className="mb-8">
        <h2 className="text-3xl font-bold mb-5 text-neutral-800">Further Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="px-6 py-4 border-b border-neutral-200">
              <CardTitle className="text-lg">Research Papers</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="ri-article-line text-primary-600 mt-1 mr-2"></i>
                  <div>
                    <a href="https://arxiv.org/abs/1706.03762" className="text-primary-600 hover:underline font-medium">Attention Is All You Need</a>
                    <p className="text-sm text-neutral-600">Vaswani et al. (2017) - The original Transformer paper</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="ri-article-line text-primary-600 mt-1 mr-2"></i>
                  <div>
                    <a href="https://arxiv.org/abs/1810.04805" className="text-primary-600 hover:underline font-medium">BERT: Pre-training of Deep Bidirectional Transformers</a>
                    <p className="text-sm text-neutral-600">Devlin et al. (2018) - Introduction of BERT</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="ri-article-line text-primary-600 mt-1 mr-2"></i>
                  <div>
                    <a href="https://arxiv.org/abs/2005.14165" className="text-primary-600 hover:underline font-medium">Language Models are Few-Shot Learners</a>
                    <p className="text-sm text-neutral-600">Brown et al. (2020) - GPT-3 paper</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="px-6 py-4 border-b border-neutral-200">
              <CardTitle className="text-lg">Tutorials & Courses</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="ri-video-line text-secondary-600 mt-1 mr-2"></i>
                  <div>
                    <a href="https://web.stanford.edu/class/cs224n/" className="text-primary-600 hover:underline font-medium">Stanford CS224N: NLP with Deep Learning</a>
                    <p className="text-sm text-neutral-600">Comprehensive course covering Transformers and their applications</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="ri-book-open-line text-secondary-600 mt-1 mr-2"></i>
                  <div>
                    <a href="https://huggingface.co/docs/transformers/index" className="text-primary-600 hover:underline font-medium">HuggingFace Transformers Documentation</a>
                    <p className="text-sm text-neutral-600">Practical guides for working with Transformer models</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="ri-github-line text-secondary-600 mt-1 mr-2"></i>
                  <div>
                    <a href="https://jalammar.github.io/illustrated-transformer/" className="text-primary-600 hover:underline font-medium">The Illustrated Transformer</a>
                    <p className="text-sm text-neutral-600">Visual guide to understanding Transformer architecture</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
