import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function AttentionVisualizer() {
  useEffect(() => {
    // This would be where we'd initialize a D3 visualization
    // For now, we'll rely on the SVG visualization below
  }, []);

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">How Self-Attention Works</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full bg-neutral-100 p-6 rounded-lg mb-4 flex flex-col items-center">
            <svg width="600" height="300" viewBox="0 0 600 300" className="max-w-full h-auto">
              {/* Input tokens */}
              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="80" height="40" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="4" />
                <text x="40" y="25" textAnchor="middle" fill="#1e40af" fontSize="16">Input 1</text>
                
                <rect x="0" y="60" width="80" height="40" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="4" />
                <text x="40" y="85" textAnchor="middle" fill="#1e40af" fontSize="16">Input 2</text>
                
                <rect x="0" y="120" width="80" height="40" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="4" />
                <text x="40" y="145" textAnchor="middle" fill="#1e40af" fontSize="16">Input 3</text>
                
                <rect x="0" y="180" width="80" height="40" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="4" />
                <text x="40" y="205" textAnchor="middle" fill="#1e40af" fontSize="16">Input 4</text>
              </g>
              
              {/* Attention mechanism */}
              <g transform="translate(180, 50)">
                <rect x="0" y="0" width="160" height="220" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" rx="6" />
                <text x="80" y="30" textAnchor="middle" fill="#334155" fontSize="16" fontWeight="bold">Self-Attention</text>
                
                <g transform="translate(40, 70)">
                  <circle cx="0" cy="0" r="15" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2" />
                  <text x="0" y="5" textAnchor="middle" fill="#4338ca" fontSize="14">Q</text>
                  
                  <circle cx="40" cy="40" r="15" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
                  <text x="40" y="45" textAnchor="middle" fill="#047857" fontSize="14">K</text>
                  
                  <circle cx="80" cy="80" r="15" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
                  <text x="80" y="85" textAnchor="middle" fill="#db2777" fontSize="14">V</text>
                  
                  <path d="M 0 15 L 25 25" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  <path d="M 40 55 L 65 65" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  <path d="M 80 95 L 80 120" stroke="#ec4899" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </g>
                
                <rect x="30" y="170" width="100" height="30" fill="#f8fafc" stroke="#64748b" strokeWidth="2" rx="4" />
                <text x="80" y="190" textAnchor="middle" fill="#334155" fontSize="14">Softmax</text>
              </g>
              
              {/* Output */}
              <g transform="translate(390, 50)">
                <rect x="0" y="0" width="160" height="220" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" rx="6" />
                <text x="80" y="30" textAnchor="middle" fill="#334155" fontSize="16" fontWeight="bold">Weighted Sum</text>
                
                <rect x="30" y="60" width="100" height="40" fill="#fecaca" stroke="#ef4444" strokeWidth="2" rx="4" />
                <text x="80" y="85" textAnchor="middle" fill="#b91c1c" fontSize="16">Output 1</text>
                
                <rect x="30" y="120" width="100" height="40" fill="#fecaca" stroke="#ef4444" strokeWidth="2" rx="4" />
                <text x="80" y="145" textAnchor="middle" fill="#b91c1c" fontSize="16">Output 2</text>
                
                <rect x="30" y="180" width="100" height="40" fill="#fecaca" stroke="#ef4444" strokeWidth="2" rx="4" />
                <text x="80" y="205" textAnchor="middle" fill="#b91c1c" fontSize="16">Output 3</text>
              </g>
              
              {/* Flow arrows */}
              <path d="M 130 130 L 180 130" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <path d="M 340 130 L 390 130" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Arrowhead marker definition */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="flex flex-col items-center bg-neutral-50 rounded-lg p-4">
              <div className="text-primary-600 mb-2">
                <i className="ri-question-line text-2xl"></i>
              </div>
              <h4 className="font-medium text-center mb-2">Query</h4>
              <p className="text-sm text-neutral-600 text-center">Represents the current word seeking context from other words.</p>
            </div>
            
            <div className="flex flex-col items-center bg-neutral-50 rounded-lg p-4">
              <div className="text-secondary-600 mb-2">
                <i className="ri-key-line text-2xl"></i>
              </div>
              <h4 className="font-medium text-center mb-2">Key</h4>
              <p className="text-sm text-neutral-600 text-center">Used to determine compatibility with queries from other words.</p>
            </div>
            
            <div className="flex flex-col items-center bg-neutral-50 rounded-lg p-4">
              <div className="text-accent-600 mb-2">
                <i className="ri-information-line text-2xl"></i>
              </div>
              <h4 className="font-medium text-center mb-2">Value</h4>
              <p className="text-sm text-neutral-600 text-center">The actual content that gets weighted and aggregated.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="my-10">
        <h3 className="text-xl font-semibold mb-4">Self-Attention Formula</h3>
        
        <Card>
          <CardContent className="p-6">
            <div className="bg-neutral-50 rounded-lg p-4 mb-4 overflow-x-auto text-center">
              <div className="text-lg font-mono" id="formula-container">
                Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>)V
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                  <i className="ri-number-1"></i>
                </span>
                <div>
                  <h5 className="font-medium mb-1">Compatibility Calculation</h5>
                  <p className="text-sm text-neutral-600">Compute dot products between the query and all keys (QK<sup>T</sup>).</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                  <i className="ri-number-2"></i>
                </span>
                <div>
                  <h5 className="font-medium mb-1">Scaling</h5>
                  <p className="text-sm text-neutral-600">Divide by square root of dimension to stabilize gradients (√d<sub>k</sub>).</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                  <i className="ri-number-3"></i>
                </span>
                <div>
                  <h5 className="font-medium mb-1">Attention Distribution</h5>
                  <p className="text-sm text-neutral-600">Apply softmax to get normalized attention weights.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                  <i className="ri-number-4"></i>
                </span>
                <div>
                  <h5 className="font-medium mb-1">Value Aggregation</h5>
                  <p className="text-sm text-neutral-600">Multiply attention weights with values and sum them up.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="my-10">
        <h3 className="text-xl font-semibold mb-4">Multi-Head Attention</h3>
        
        <p className="text-neutral-600 mb-6">
          Rather than performing a single attention function, Transformers use multiple attention "heads" in parallel. This allows the model to jointly attend to information from different representation subspaces.
        </p>
        
        <Card>
          <CardHeader className="px-6 py-4 border-b border-neutral-200">
            <CardTitle className="text-base font-medium">Multi-Head Architecture</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-3">Benefits</h5>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-check-line text-sm"></i>
                    </span>
                    <span className="text-sm">Captures different types of relationships</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-check-line text-sm"></i>
                    </span>
                    <span className="text-sm">Provides multiple representation spaces</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary-100 text-primary-700 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <i className="ri-check-line text-sm"></i>
                    </span>
                    <span className="text-sm">Improves model capacity without increasing computational cost significantly</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-neutral-50 rounded-lg p-4">
                <h5 className="font-medium mb-3">Formula</h5>
                <div className="font-mono text-sm overflow-x-auto">
                  <p>MultiHead(Q, K, V) = Concat(head₁, ..., headₕ)W<sup>O</sup></p>
                  <p className="mt-2">where headᵢ = Attention(QW<sub>i</sub><sup>Q</sup>, KW<sub>i</sub><sup>K</sup>, VW<sub>i</sub><sup>V</sup>)</p>
                </div>
                <p className="text-xs text-neutral-500 mt-2">Each head has its own set of projection matrices W<sub>i</sub><sup>Q</sup>, W<sub>i</sub><sup>K</sup>, W<sub>i</sub><sup>V</sup></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
