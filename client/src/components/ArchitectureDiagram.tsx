import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

type DiagramFeature = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

type ArchitectureComponentProps = {
  title: string;
  features: { title: string; description: string }[];
  colorClass: string;
};

function ArchitectureComponent({ title, features, colorClass }: ArchitectureComponentProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`${colorClass} rounded-lg px-4 py-2 font-medium mb-4 w-full text-center`}>
        {title}
      </div>
      <ul className="space-y-2 w-full">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <span className={`${colorClass} rounded-full p-1 mr-3 mt-0.5 flex-shrink-0`}>
              <i className="ri-arrow-right-s-line text-sm"></i>
            </span>
            <span className="text-sm">{feature.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ArchitectureDiagram() {
  const features: DiagramFeature[] = [
    {
      id: "attention",
      title: "Attention Mechanism",
      description: "Allows the model to focus on different parts of the input sequence when producing each output element. The key innovation is computing relevance scores between all positions.",
      icon: "ri-eye-line",
      color: "bg-primary-100 text-primary-600",
    },
    {
      id: "parallelization",
      title: "Parallelization",
      description: "Unlike RNNs, Transformers process the entire sequence in parallel, dramatically speeding up training and enabling much larger models.",
      icon: "ri-layout-grid-line",
      color: "bg-secondary-100 text-secondary-600",
    },
    {
      id: "multihead",
      title: "Multi-Head Attention",
      description: "Allows the model to jointly attend to information from different representation subspaces, capturing various aspects of relationships.",
      icon: "ri-broadcast-line",
      color: "bg-accent-100 text-accent-600",
    },
    {
      id: "residual",
      title: "Residual Connections",
      description: "Skip connections that help with gradient flow during training, allowing for much deeper networks without vanishing gradient problems.",
      icon: "ri-link-m",
      color: "bg-neutral-100 text-neutral-600",
    },
  ];

  const encoderFeatures = [
    { title: "Parallel Processing", description: "Processes input sequence in parallel" },
    { title: "Bidirectional", description: "Bidirectional self-attention" },
    { title: "Representations", description: "Creates contextual representations" },
  ];

  const decoderFeatures = [
    { title: "Output Generation", description: "Generates output sequence" },
    { title: "Masked Attention", description: "Uses masked self-attention for autoregressive generation" },
    { title: "Cross-Attention", description: "Attends to encoder outputs via cross-attention" },
  ];

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">High-Level Transformer Architecture</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="w-full bg-neutral-100 p-6 rounded-lg mb-6 flex flex-col items-center">
            <svg width="500" height="300" viewBox="0 0 500 300" className="max-w-full h-auto">
              {/* Encoder block */}
              <rect x="100" y="50" width="120" height="200" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="6" />
              <text x="160" y="40" textAnchor="middle" fill="#1e40af" fontSize="14" fontWeight="bold">Encoder</text>
              
              {/* Decoder block */}
              <rect x="280" y="50" width="120" height="200" fill="#dcfce7" stroke="#10b981" strokeWidth="2" rx="6" />
              <text x="340" y="40" textAnchor="middle" fill="#047857" fontSize="14" fontWeight="bold">Decoder</text>
              
              {/* Flow arrows */}
              <path d="M 220 100 L 280 100" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <path d="M 220 150 L 280 150" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <path d="M 220 200 L 280 200" stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Input text */}
              <text x="160" y="270" textAnchor="middle" fill="#4b5563" fontSize="12">Input Sequence</text>
              <path d="M 160 260 L 160 250" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrowhead)" />
              
              {/* Output text */}
              <text x="340" y="270" textAnchor="middle" fill="#4b5563" fontSize="12">Output Sequence</text>
              <path d="M 340 260 L 340 250" stroke="#4b5563" strokeWidth="1" markerEnd="url(#arrowhead)" />
              
              {/* Arrowhead marker definition */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
                </marker>
              </defs>
              
              {/* Encoder Layers */}
              <rect x="110" y="70" width="100" height="40" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" rx="4" />
              <text x="160" y="95" textAnchor="middle" fill="#1e40af" fontSize="10">Self-Attention</text>
              
              <rect x="110" y="120" width="100" height="40" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" rx="4" />
              <text x="160" y="145" textAnchor="middle" fill="#1e40af" fontSize="10">Feed Forward</text>
              
              <rect x="110" y="170" width="100" height="40" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" rx="4" />
              <text x="160" y="195" textAnchor="middle" fill="#1e40af" fontSize="10">Add & Normalize</text>
              
              {/* Decoder Layers */}
              <rect x="290" y="70" width="100" height="40" fill="#bbf7d0" stroke="#10b981" strokeWidth="1" rx="4" />
              <text x="340" y="95" textAnchor="middle" fill="#047857" fontSize="10">Masked Self-Attention</text>
              
              <rect x="290" y="120" width="100" height="40" fill="#bbf7d0" stroke="#10b981" strokeWidth="1" rx="4" />
              <text x="340" y="145" textAnchor="middle" fill="#047857" fontSize="10">Cross-Attention</text>
              
              <rect x="290" y="170" width="100" height="40" fill="#bbf7d0" stroke="#10b981" strokeWidth="1" rx="4" />
              <text x="340" y="195" textAnchor="middle" fill="#047857" fontSize="10">Feed Forward</text>
            </svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
            <ArchitectureComponent 
              title="Encoder" 
              features={encoderFeatures}
              colorClass="bg-blue-100 text-blue-700" 
            />
            
            <ArchitectureComponent 
              title="Decoder" 
              features={decoderFeatures}
              colorClass="bg-green-100 text-green-700" 
            />
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold mb-4">Key Concepts in Transformer Design</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.id}>
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                <i className={`${feature.icon} text-xl`}></i>
              </div>
              <h4 className="text-lg font-medium mb-2">{feature.title}</h4>
              <p className="text-neutral-600 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
