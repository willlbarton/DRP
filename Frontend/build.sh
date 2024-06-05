#!/bin/bash

# Run TypeScript compilation
tsc

# Run ESLint but do not exit on warnings
eslint . --ext ts,tsx --report-unused-disable-directives || true

# Run the Vite build
vite build
