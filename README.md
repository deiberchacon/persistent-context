# Persistent Context

[![npm version](https://img.shields.io/npm/v/persistent-context.svg)](https://www.npmjs.com/package/persistent-context)
[![license](https://img.shields.io/npm/l/persistent-context.svg)](https://github.com/deiberchacon/persistent-context/blob/master/LICENSE)

A lightweight React context provider for persisting state in `localStorage` or `sessionStorage` with TypeScript support.

## Features

- 🔄 Persist React context in localStorage or sessionStorage
- 📦 Lightweight with TypeScript support and zero dependencies
- 🌳 Modern package (ESM/CJS) with full browser compatibility

## Installation

```bash
# npm
npm install persistent-context

# yarn
yarn add persistent-context

# pnpm
pnpm add persistent-context
```

## Usage

### Basic Usage with JavaScript

```jsx
import { PersistentProvider, usePersistentContext } from 'persistent-context';

// Wrap your app or component with PersistentProvider
const App = () => {
  return (
    <PersistentProvider storageKey="app-state" storageType="localStorage">
      <YourComponent />
    </PersistentProvider>
  );
};

// Use the context in your components
const YourComponent = () => {
  const { state, setState } = usePersistentContext();

  const handleChange = () => {
    setState({ user: "John Doe" });
  };

  return (
    <div>
      <h1>{state.user || "No user"}</h1>
      <button onClick={handleChange}>Set User</button>
    </div>
  );
};
```

### TypeScript Usage with Generic Types

```tsx
import { PersistentProvider, usePersistentContext } from 'persistent-context';

// Define your state interface
interface UserState {
  user?: string;
  theme?: 'light' | 'dark';
  notifications?: boolean;
}

// Provide type to the provider (with initial state)
const App = () => {
  return (
    <PersistentProvider<UserState> 
      storageKey="user-settings"
      storageType="localStorage"
      initialState={{ theme: 'light', notifications: true }}
    >
      <UserSettings />
    </PersistentProvider>
  );
};

// Use the typed context in your components
const UserSettings = () => {
  const { state, setState } = usePersistentContext<UserState>();

  // Type-safe state usage
  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  return (
    <div>
      <h1>Current Theme: {state.theme}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

## API

### `PersistentProvider`

Component that provides the persistent context.

```tsx
<PersistentProvider<T>
  storageKey?: string;
  storageType?: "localStorage" | "sessionStorage";
  initialState?: T;
>
  {children}
</PersistentProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | `"persistent-context"` | Key used for storing the state in browser storage |
| `storageType` | `"localStorage"` \| `"sessionStorage"` | `"localStorage"` | Storage type to use |
| `initialState` | `T` | `{}` | Initial state to use when no persisted state exists |
| `children` | `React.ReactNode` | (required) | React children |

### `usePersistentContext<T>()`

Hook to access the persistent context state.

```tsx
const { state, setState } = usePersistentContext<T>();
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `state` | `T` | The current state |
| `setState` | `React.Dispatch<React.SetStateAction<T>>` | Function to update the state (supports both direct and functional updates) |

## Example Application

```tsx
import React from 'react';
import { PersistentProvider, usePersistentContext } from 'persistent-context';

interface TodoState {
  todos: Array<{ id: number; text: string; completed: boolean }>;
  filter: 'all' | 'active' | 'completed';
}

const initialState: TodoState = {
  todos: [],
  filter: 'all'
};

const TodoApp = () => {
  return (
    <PersistentProvider<TodoState> 
      storageKey="todo-app"
      initialState={initialState}
    >
      <TodoList />
      <AddTodo />
      <FilterButtons />
    </PersistentProvider>
  );
};

const TodoList = () => {
  const { state } = usePersistentContext<TodoState>();
  
  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true;
  });
  
  return (
    <ul>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

// ... Additional components

export default TodoApp;
```

## Browser Compatibility

Works in all modern browsers that support localStorage/sessionStorage (IE9+).

## License

MIT © [Deiber Chacon](LICENSE)
