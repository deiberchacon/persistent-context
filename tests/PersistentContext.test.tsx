import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import {
  PersistentProvider,
  usePersistentContext,
} from "../src/PersistentContext";

// Test Component
const TestComponent = () => {
  const { state, setState } = usePersistentContext();

  const handleChangeUser = () => {
    setState({ user: "New User" });
  };

  return (
    <div>
      <p data-testid="username">{state.user || "Guest"}</p>
      <button onClick={handleChangeUser}>Change User</button>
    </div>
  );
};

describe("PersistentContext with localStorage and sessionStorage", () => {
  beforeEach(() => {
    // Clear both localStorage and sessionStorage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  it("loads state from localStorage", () => {
    // Arrange: Set initial state in localStorage
    localStorage.setItem(
      "local-storage-key",
      JSON.stringify({ user: "Stored User" })
    );

    // Act: Render the component with PersistentProvider
    render(
      <PersistentProvider
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
      <PersistentProvider
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
      <PersistentProvider
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
      <PersistentProvider
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
});
