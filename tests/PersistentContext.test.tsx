import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  PersistentProvider,
  usePersistentContext,
} from "../src/PersistentContext";

// Define type for test
interface TestState {
  user?: string;
  count?: number;
}

// Test Component with typed context
const TestComponent = () => {
  const { state, setState } = usePersistentContext<TestState>();

  const handleChangeUser = () => {
    setState({ ...state, user: "New User" });
  };

  const handleIncrement = () => {
    setState((prevState) => ({
      ...prevState,
      count: (prevState.count || 0) + 1,
    }));
  };

  return (
    <div>
      <p data-testid="username">{state.user || "Guest"}</p>
      <p data-testid="count">{state.count || 0}</p>
      <button onClick={handleChangeUser}>Change User</button>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

describe("PersistentContext with localStorage and sessionStorage", () => {
  beforeEach(() => {
    // Clear both localStorage and sessionStorage before each test
    localStorage.clear();
    sessionStorage.clear();
    
    // Mock console.error to prevent error output during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error
    jest.restoreAllMocks();
  });

  it("loads state from localStorage", () => {
    // Arrange: Set initial state in localStorage
    localStorage.setItem(
      "local-storage-key",
      JSON.stringify({ user: "Stored User" })
    );

    // Act: Render the component with PersistentProvider
    render(
      <PersistentProvider<TestState>
        storageKey="local-storage-key"
        storageType="localStorage"
      >
        <TestComponent />
      </PersistentProvider>
    );

    // Assert: Verify if the state was correctly loaded from localStorage
    expect(screen.getByTestId("username")).toHaveTextContent("Stored User");
  });

  it("saves state to localStorage", () => {
    // Arrange: Render the component with PersistentProvider
    render(
      <PersistentProvider<TestState>
        storageKey="local-storage-key"
        storageType="localStorage"
      >
        <TestComponent />
      </PersistentProvider>
    );

    // Act: Simulate the button click to change the user state
    act(() => {
      fireEvent.click(screen.getByText("Change User"));
    });

    // Assert: Verify that the state has been saved to localStorage
    expect(localStorage.getItem("local-storage-key")).toBe(
      JSON.stringify({ user: "New User" })
    );
  });

  it("loads state from sessionStorage", () => {
    // Arrange: Set initial state in sessionStorage
    sessionStorage.setItem(
      "session-storage-key",
      JSON.stringify({ user: "Session User" })
    );

    // Act: Render the component with PersistentProvider
    render(
      <PersistentProvider<TestState>
        storageKey="session-storage-key"
        storageType="sessionStorage"
      >
        <TestComponent />
      </PersistentProvider>
    );

    // Assert: Verify if the state was correctly loaded from sessionStorage
    expect(screen.getByTestId("username")).toHaveTextContent("Session User");
  });

  it("saves state to sessionStorage", () => {
    // Arrange: Render the component with PersistentProvider
    render(
      <PersistentProvider<TestState>
        storageKey="session-storage-key"
        storageType="sessionStorage"
      >
        <TestComponent />
      </PersistentProvider>
    );

    // Act: Simulate the button click to change the user state
    act(() => {
      fireEvent.click(screen.getByText("Change User"));
    });

    // Assert: Verify that the state has been saved to sessionStorage
    expect(sessionStorage.getItem("session-storage-key")).toBe(
      JSON.stringify({ user: "New User" })
    );
  });

  it("uses initialState when no stored state exists", () => {
    // Act: Render the component with PersistentProvider and initialState
    render(
      <PersistentProvider<TestState>
        storageKey="init-test"
        initialState={{ user: "Initial User", count: 5 }}
      >
        <TestComponent />
      </PersistentProvider>
    );

    // Assert: Verify the state shows the initial values
    expect(screen.getByTestId("username")).toHaveTextContent("Initial User");
    expect(screen.getByTestId("count")).toHaveTextContent("5");
  });

  it("correctly updates state using functional updates", () => {
    // Arrange: Render the component with PersistentProvider
    render(
      <PersistentProvider<TestState>
        storageKey="functional-updates"
        initialState={{ count: 0 }}
      >
        <TestComponent />
      </PersistentProvider>
    );

    // Act: Simulate multiple increments 
    act(() => {
      fireEvent.click(screen.getByText("Increment"));
      fireEvent.click(screen.getByText("Increment"));
      fireEvent.click(screen.getByText("Increment"));
    });

    // Assert: Verify count was updated correctly
    expect(screen.getByTestId("count")).toHaveTextContent("3");
    expect(localStorage.getItem("functional-updates")).toBe(
      JSON.stringify({ count: 3 })
    );
  });

  it("handles storage errors gracefully", () => {
    // Arrange: Mock storage.getItem to throw error
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage error");
    });

    // Act: Render the component
    render(
      <PersistentProvider<TestState>
        initialState={{ user: "Fallback User" }}
      >
        <TestComponent />
      </PersistentProvider>
    );

    // Assert: Verify fallback to initialState
    expect(screen.getByTestId("username")).toHaveTextContent("Fallback User");
    expect(console.error).toHaveBeenCalledWith(
      "Error retrieving state from storage:",
      expect.any(Error)
    );
  });

  it("throws error when hook is used outside provider", () => {
    // Arrange & Act & Assert
    expect(() => {
      render(<TestComponent />);
    }).toThrow("usePersistentContext must be used within a PersistentProvider");
  });
});
