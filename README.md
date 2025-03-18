# Persistent Context

A React context provider for persisting state in `localStorage` or `sessionStorage`.

## Installation

To install the package, run:

```bash
npm install persistent-context
```

## Usage

### 1. Wrap your app with `PersistentProvider`

To start using the context, wrap your app with the `PersistentProvider` component. You can choose the storage type (`localStorage` or `sessionStorage`) and the storage key.

```javascript
import { PersistentProvider } from "persistent-context";

const App = () => {
  return (
    <PersistentProvider storageKey="app-state" storageType="localStorage">
      <YourComponent />
    </PersistentProvider>
  );
};
```

### 2. Use the `usePersistentContext` hook to access and update the state

Inside your components, you can access and modify the persisted state using the usePersistentContext hook.

```javascript
import { usePersistentContext } from "persistent-context";

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

## API

### `PersistentProvider`

- `storageKey`: The key under which the state is saved in `localStorage` or `sessionStorage`. Default is `"persistent-context"`.
- `storageType`: Choose either `"localStorage"` or `"sessionStorage"` for where the state should be stored. Default is `"localStorage"`.

### `usePersistentContext`

- Returns an object with:
  - `state`: The current state.
  - `setState`: A function to update the state.

## Example

Here’s a full example using `PersistentProvider` and `usePersistentContext`:

```javascript
import React from "react";
import { PersistentProvider, usePersistentContext } from "persistent-context";

const App = () => {
  return (
    <PersistentProvider storageKey="user-state" storageType="sessionStorage">
      <UserProfile />
    </PersistentProvider>
  );
};

const UserProfile = () => {
  const { state, setState } = usePersistentContext();

  const updateUser = () => {
    setState({ user: "Jane Doe" });
  };

  return (
    <div>
      <h1>{state.user || "Guest"}</h1>
      <button onClick={updateUser}>Set User</button>
    </div>
  );
};

export default App;
```
