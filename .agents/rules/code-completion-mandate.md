---
trigger: always
description: Before marking any code task as complete, run automated quality checks and remediate all issues
---

## Code Completion Mandate

### Universal Requirement

**Before marking any code task as complete, you MUST run automated quality checks and remediate all issues.**

This is NOT OPTIONAL. Delivering code without validation violates the Rugged Software Constitution @rugged-software-constitution.md.

### The Completion Checklist

Every code generation task follows this workflow:

1. **Generate** - Write the code based on requirements
2. **Validate** - Run language-appropriate quality checks (see below)
3. **Remediate** - Fix all detected issues
4. **Verify** - Re-run checks to confirm fixes
5. **Deliver** - Mark task complete only after all checks pass

**Never skip validation "to save time." Validation IS the work.**

### Language-Specific Quality Commands

| Language             | Idiom File                         | Commands Section                 |
| -------------------- | ---------------------------------- | -------------------------------- |
| **Flutter / Dart**   | @flutter-idioms-and-patterns.md    | § Linting and Formatting         |
| **Go**               | @go-idioms-and-patterns.md         | § Formatting and Static Analysis |
| **TypeScript / Vue** | @typescript-idioms-and-patterns.md | § Formatting and Static Analysis |
| **Vue 3**            | @vue-idioms-and-patterns.md        | § Linting and Type Checking      |
| **Rust**             | @rust-idioms-and-patterns.md       | § Clippy and Formatting          |

#### Flutter / Dart Commands

```bash
# Static analysis — must pass with zero issues
flutter analyze

# Format code — must match
dart format --set-exit-if-changed .

# Run all tests
flutter test

# Code generation (after changing freezed/json_serializable/auto_route/retrofit)
dart run build_runner build --delete-conflicting-outputs
```

### Failure Protocol

**If any quality check fails:**

1. Read the error output completely
2. Fix the identified issues in the code
3. Re-run the failing command
4. Do not proceed until all checks pass

> Never disable a lint rule or suppress a warning to make checks pass. Fix the root cause.

### Related Principles
- Rugged Software Constitution @rugged-software-constitution.md
- Code Idioms and Conventions @code-idioms-and-conventions.md