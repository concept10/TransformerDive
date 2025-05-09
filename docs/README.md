# Transformer Models Educational Web Application Documentation

Welcome to the documentation for the Transformer Models Educational Web Application. This documentation provides comprehensive information about the application's architecture, components, and development processes.

## Table of Contents

### Architecture Documentation

- [File Layout](./architecture/file-layout.md) - Overview of the project's file structure and organization

### Lifecycle Documentation

- [Application Lifecycle](./lifecycle/application-lifecycle.md) - Details on how data flows through the application and component interactions

### Component Documentation

- [Interactive Components](./components/interactive-components.md) - Documentation for the main interactive components

## About the Application

This educational web application explains how transformer-based language models work, with interactive visualizations and code examples. It aims to help users understand the inner workings of modern language models through:

1. **Interactive visualizations** of key concepts like self-attention and model architecture
2. **Code examples** showing implementation details
3. **Educational content** covering all aspects of transformer models
4. **Quiz questions** to test understanding

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js
- **Data Handling**: React Query, In-memory storage
- **Build Tools**: Vite, TSX

## Development Guidelines

### Code Style

- Use functional components with React hooks
- Keep components focused and modular
- Use TypeScript interfaces for prop definitions
- Follow the existing naming conventions

### Adding New Features

1. Update the data model in `shared/schema.ts` if needed
2. Implement any required server endpoints in `server/routes.ts`
3. Create new React components in the appropriate directories
4. Update documentation to reflect changes

### Performance Considerations

- Use React Query for data fetching and caching
- Implement proper memo/useCallback for expensive operations
- Consider code splitting for large components

## Contributing

If contributing to this project, please:

1. Follow the established code structure and patterns
2. Update documentation alongside code changes
3. Ensure all interactive elements are accessible
4. Test across different screen sizes
5. Write well-documented, clean code