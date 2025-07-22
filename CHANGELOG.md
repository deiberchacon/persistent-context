# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-07-22

### Added
- Client side support for SSR frameworks

### Changed
- Hydration-safe state initialization

## [1.1.0] - 2025-03-18

### Added
- TypeScript generic support for better type safety
- Added `initialState` prop to `PersistentProvider`
- ESM/CJS dual package support
- Source maps for better debugging
- Added error handling for storage operations
- Added comprehensive test coverage

### Changed
- Moved React to peerDependencies
- Improved TypeScript typings
- Updated documentation with TypeScript examples
- Enhanced test suite with more edge cases

### Fixed
- Proper handling of storage errors

## [1.0.0] - Initial Release

### Added
- Basic implementation of `PersistentProvider` and `usePersistentContext`
- Support for both localStorage and sessionStorage
- Basic documentation and examples 