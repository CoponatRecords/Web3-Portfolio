"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalStorageComponents = void 0;
var react_1 = require("react");
// List of available components (this could be dynamically imported if needed)
var componentsMap = {
    ChartComponent: 'ChartComponent', // Map component name to the actual component
};
// Custom hook for managing components with localStorage
var useLocalStorageComponents = function () {
    var _a = (0, react_1.useState)([]), components = _a[0], setComponents = _a[1];
    // Load components from localStorage
    (0, react_1.useEffect)(function () {
        var savedComponents = localStorage.getItem('components');
        if (savedComponents) {
            try {
                var parsedComponents = JSON.parse(savedComponents);
                // Optionally, map component names to actual components if necessary
                setComponents(parsedComponents);
            }
            catch (error) {
                console.error("Error loading components from localStorage:", error);
            }
        }
    }, []);
    // Save components to localStorage whenever components change
    (0, react_1.useEffect)(function () {
        if (components.length > 0) {
            var componentsToSave = components.map(function (_a) {
                var id = _a.id, coin = _a.coin, componentName = _a.componentName;
                return ({
                    id: id,
                    coin: coin,
                    componentName: componentName,
                });
            });
            localStorage.setItem('components', JSON.stringify(componentsToSave));
        }
    }, [components]);
    return [components, setComponents];
};
exports.useLocalStorageComponents = useLocalStorageComponents;
