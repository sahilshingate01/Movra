import '@testing-library/jest-dom';

// Polyfill scrollIntoView for jsdom (not available in test environment)
Element.prototype.scrollIntoView = () => {};
