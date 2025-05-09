import { useState, useEffect, useRef, RefObject } from 'react';

interface SectionRef {
  id: string;
  ref: RefObject<HTMLElement>;
}

interface ScrollSpyOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const useScrollSpy = (
  {
    sectionElementRefs,
    options = {}
  }: {
    sectionElementRefs: SectionRef[];
    options?: ScrollSpyOptions;
  }
) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Store refs to avoid recreating on each render
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef(sectionElementRefs);

  useEffect(() => {
    sectionsRef.current = sectionElementRefs;
  }, [sectionElementRefs]);

  useEffect(() => {
    const { root = null, rootMargin = '0px', threshold = 0.2 } = options;

    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create a new IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Get all entries that are currently visible
        const visibleEntries = entries.filter(entry => entry.isIntersecting);

        // If we have at least one visible section
        if (visibleEntries.length > 0) {
          // Find the section that appears first in the DOM
          const visibleIds = visibleEntries.map(entry => entry.target.id);

          // Sort visible sections by their position in the sectionsRef array
          // This ensures we prioritize sections in the order they appear in the DOM
          const orderedVisible = sectionsRef.current
            .filter(section => visibleIds.includes(section.id))
            .map(section => section.id);

          if (orderedVisible.length > 0) {
            setActiveSection(orderedVisible[0]);
          }
        }
      },
      { root, rootMargin, threshold }
    );

    // Observe all sections
    sectionsRef.current.forEach(
      ({ id, ref }) => {
        if (ref.current) {
          observerRef.current?.observe(ref.current);
        }
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [options]);

  return activeSection;
};

// Add sectionRefs as a static property for convenient access 
useScrollSpy.sectionRefs = [] as SectionRef[];
