import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Prism from "prismjs";

// Import prism styles - we're inlining these to avoid having to add a CSS file
import "prismjs/themes/prism-tomorrow.css";
// Add language support
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";

type Tab = {
  id: string;
  label: string;
  language: string;
  code: string;
};

type CodeBlockProps = {
  tabs: Tab[];
  defaultTab?: string;
};

export default function CodeBlock({ tabs, defaultTab }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  useEffect(() => {
    // Highlight all code blocks after render
    Prism.highlightAll();
  }, [activeTab]);

  const activeCode = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden mb-8">
      <div className="border-b border-neutral-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "px-6 py-3 font-medium whitespace-nowrap",
                activeTab === tab.id
                  ? "text-neutral-800 border-b-2 border-primary-500"
                  : "text-neutral-600 hover:text-neutral-800"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto relative bg-[#2d2d2d] text-white">
        <pre className={`language-${activeCode?.language || "python"} p-4 m-0`}>
          <code>{activeCode?.code}</code>
        </pre>
        
        <button
          onClick={() => {
            if (activeCode) {
              navigator.clipboard.writeText(activeCode.code);
            }
          }}
          className="absolute top-2 right-2 text-neutral-400 hover:text-white bg-[#1e1e1e] p-2 rounded"
          title="Copy to clipboard"
        >
          <i className="ri-clipboard-line"></i>
        </button>
      </div>
    </div>
  );
}
