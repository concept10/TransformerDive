// Configure MathJax options
export function configureMathJax() {
  if ((window as any).MathJax) {
    (window as any).MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
        ignoreHtmlClass: 'tex2jax_ignore',
        processHtmlClass: 'tex2jax_process'
      },
      startup: {
        pageReady: () => {
          console.log('MathJax is ready');
          return (window as any).MathJax.startup.defaultPageReady();
        }
      },
      svg: {
        fontCache: 'global'
      }
    };
  }
}

// Function to manually trigger MathJax rendering
export function renderMathInElement(element: HTMLElement) {
  if ((window as any).MathJax && (window as any).MathJax.typesetPromise) {
    (window as any).MathJax.typesetPromise([element])
      .then(() => {
        console.log('MathJax rendering complete');
      })
      .catch((err: any) => {
        console.error('Error rendering MathJax:', err);
      });
  }
}

// Initialize MathJax globally
export function initMathJax() {
  configureMathJax();
  
  // Add script to load MathJax if not already present
  if (!(window as any).MathJax) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
  }
}

export default {
  configureMathJax,
  renderMathInElement,
  initMathJax
};
