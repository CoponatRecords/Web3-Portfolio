import { useState, useEffect } from 'react';

// Define ComponentType
interface ComponentType {
  id: number;
  coin: string;
  componentName: string; // Store the name of the component

}

// List of available components (this could be dynamically imported if needed)
const componentsMap = {
  ChartComponent: 'ChartComponent', // Map component name to the actual component
};

// Custom hook for managing components with localStorage
export const useLocalStorageComponents = () => {
  const [components, setComponents] = useState<ComponentType[]>([]);

  // Load components from localStorage
  useEffect(() => {
    const savedComponents = localStorage.getItem('components');
    if (savedComponents) {
      try {
        const parsedComponents: ComponentType[] = JSON.parse(savedComponents);
        // Optionally, map component names to actual components if necessary
        setComponents(parsedComponents);
      } catch (error) {
        console.error("Error loading components from localStorage:", error);
      }
    }
  }, []);

  // Save components to localStorage whenever components change
  useEffect(() => {
    if (components.length > 0) {
      const componentsToSave = components.map(({ id, coin, componentName }) => ({
        id,
        coin,
        componentName,
      }));
      localStorage.setItem('components', JSON.stringify(componentsToSave));
    }
  }, [components]);

  return [components, setComponents] as const;
};
