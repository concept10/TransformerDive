# Interactive Components

This document provides an overview of the main interactive components used in the Transformer Models Educational Web Application, explaining their purpose, props, and usage patterns.

## TransformerFlow

The `TransformerFlow` component visualizes the data flow through a transformer architecture, showing how information moves through different parts of the model.

### Props

| Prop | Type | Description |
|------|------|-------------|
| *No specific props* | - | This component is self-contained |

### Usage

```tsx
import TransformerFlow from "@/components/TransformerFlow";

function MyComponent() {
  return (
    <div>
      <h2>Transformer Data Flow</h2>
      <TransformerFlow />
    </div>
  );
}
```

### Behavior

- Displays a step-by-step flow of data through transformer model
- Each step is animated with transitions
- Steps include: input embedding, positional encoding, multi-head attention, etc.
- Includes detailed explanations for each step

## AttentionVisualizer

The `AttentionVisualizer` component demonstrates how self-attention works by visualizing attention weights between tokens in a sequence.

### Props

| Prop | Type | Description |
|------|------|-------------|
| *No specific props* | - | This component is self-contained |

### Usage

```tsx
import AttentionVisualizer from "@/components/AttentionVisualizer";

function MyComponent() {
  return (
    <div>
      <h2>Self-Attention Visualization</h2>
      <AttentionVisualizer />
    </div>
  );
}
```

### Behavior

- Shows a matrix-like visualization of attention scores
- Allows users to hover over specific connections to see strength
- Demonstrates how each token attends to other tokens in a sequence
- Uses color intensity to show attention weight

## ArchitectureDiagram

The `ArchitectureDiagram` component displays a comprehensive view of the transformer architecture with its key components.

### Props

| Prop | Type | Description |
|------|------|-------------|
| *No specific props* | - | This component is self-contained |

### Usage

```tsx
import ArchitectureDiagram from "@/components/ArchitectureDiagram";

function MyComponent() {
  return (
    <div>
      <h2>Transformer Architecture</h2>
      <ArchitectureDiagram />
    </div>
  );
}
```

### Behavior

- Shows a visual representation of the complete transformer architecture
- Highlights different parts: encoder, decoder, attention heads, feed-forward networks
- Includes tooltips with explanations when hovering over components
- Color-coded to distinguish different functional parts

## CodeBlock

The `CodeBlock` component displays syntax-highlighted code examples with tabbed navigation for different code samples.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `tabs` | `Tab[]` | Array of code tabs to display |
| `defaultTab` | `string` | Optional ID of the tab to show by default |

### Tab Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the tab |
| `label` | `string` | Display label for the tab |
| `language` | `string` | Programming language for syntax highlighting |
| `code` | `string` | The code content to display |

### Usage

```tsx
import CodeBlock from "@/components/CodeBlock";

function MyComponent() {
  const codeTabs = [
    {
      id: "python",
      label: "Python",
      language: "python",
      code: "def hello_world():\n    print('Hello, world!')"
    },
    {
      id: "javascript",
      label: "JavaScript",
      language: "javascript",
      code: "function helloWorld() {\n    console.log('Hello, world!');\n}"
    }
  ];

  return (
    <div>
      <h2>Code Examples</h2>
      <CodeBlock tabs={codeTabs} defaultTab="python" />
    </div>
  );
}
```

### Behavior

- Displays code with syntax highlighting based on language
- Allows switching between different code examples via tabs
- Maintains tab state internally
- Uses `react-syntax-highlighter` for highlighting

## QuizQuestion

The `QuizQuestion` component displays an interactive quiz question with multiple-choice options and feedback.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `questionNumber` | `number` | The sequence number of the question |
| `question` | `string` | The question text |
| `options` | `QuizOption[]` | Array of answer options |
| `explanation` | `string` | Explanation shown after answering |

### QuizOption Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the option |
| `text` | `string` | Option text |
| `isCorrect` | `boolean` | Whether this is the correct answer |

### Usage

```tsx
import QuizQuestion from "@/components/QuizQuestion";

function MyComponent() {
  const question = {
    questionNumber: 1,
    question: "What is the main advantage of self-attention?",
    options: [
      { id: "a", text: "It's faster", isCorrect: false },
      { id: "b", text: "It captures long-range dependencies", isCorrect: true },
      { id: "c", text: "It uses less memory", isCorrect: false },
      { id: "d", text: "It's easier to implement", isCorrect: false }
    ],
    explanation: "Self-attention allows the model to consider relationships between all tokens in a sequence, regardless of their distance from each other."
  };

  return (
    <div>
      <h2>Quiz Time</h2>
      <QuizQuestion 
        questionNumber={question.questionNumber}
        question={question.question}
        options={question.options}
        explanation={question.explanation}
      />
    </div>
  );
}
```

### Behavior

- Presents a question with multiple-choice options
- Tracks user selection state
- Shows visual feedback when an answer is selected (correct/incorrect)
- Displays explanation text after an answer is selected