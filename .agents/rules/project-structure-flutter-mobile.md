---
trigger: model_decision
description: When working on a Flutter or React Native mobile application, setting up mobile project structure
---

## Flutter/Mobile Layout — Clean Architecture

Use this structure for the Satu Sehat Flutter mobile application. The project follows **Clean Architecture** with three layers per feature: `data/`, `domain/`, and `presentation/`.

```
lib/
  core/                             # Foundational concerns (the "Framework")
    config/                         # App configuration
      bloc/                         # Config BLoC
    constant/                       # App-wide constants
    data/                           # Core data utilities
      data_parse/                   # Data parsing helpers
      model/                       # Shared data models
    entity/                         # Core entities (ErrorEntity, etc.)
    enums/                          # Enumerations
    env/                            # Environment config (envied)
    error/                          # Error classes
      error.dart                    # Error utilities
      failures.dart                 # Failure class hierarchy
    flavor/                         # Build flavor config
    helpers/                        # Utility helpers
      dynamic_link/                 # Deep link handling
      firebase_messaging/           # Push notification
      health/                       # Health kit integration
      hive/                         # Hive local DB helpers
      notification/                 # Local notification
    model/                          # Core models
    resources/                      # Shared resources
      injector/
        injection_container.dart    # get_it DI registration
      interceptor/                  # Dio interceptors
      network/                      # RestClient (Retrofit)
    routes/                         # Navigation
      router.dart                   # auto_route config
      router.gr.dart                # Generated routes
    utils/                          # Pure utility functions
    widgets/                        # Shared UI components

  features/                         # Business Features (Clean Architecture)
    home/                           # Home feature example
      # --- Data Layer ---
      data/
        datasource/
          home_datasource.dart      # Abstract datasource interface
          home_datasource_impl.dart # Implementation (Dio/REST calls)
        model/
          request/                  # Request DTOs
            banner_request.dart
          response/                 # Response DTOs (freezed/json_serializable)
            banner_response.dart
        repositories/
          home_repository_impl.dart # Repository implementation

      # --- Domain Layer ---
      domain/
        entities/                   # Domain entities (equatable)
          banner_entity.dart
        repository/
          home_repository.dart      # Abstract repository interface
        usecases/                   # Business operations
          do_get_banner.dart        # UseCase<BannerEntity, BannerParams>
          do_get_buletin.dart

      # --- Presentation Layer ---
      presentation/
        bloc/                       # BLoC classes
          banner_bloc.dart
          home_bloc.dart
        event/                      # BLoC events
          banner_event.dart
        state/                      # BLoC states
          banner_state.dart
        pages/                      # Full screens (route targets)
          home_page.dart
        widget/                     # Feature-specific widgets
          banner_card.dart

    auth/                           # Authentication feature
      login/
        data/datasource/
        data/repositories/
        domain/repository/
        domain/usecases/
        presentation/bloc/
        ...
      register/
        ...

    daily/                          # Daily health features
      diary_kesehatan/
      pkg/
      child_growth/
      ...

  generated/                        # Auto-generated files (intl, etc.)
  l10n/                             # Localization

  main.dart                         # Production entry point
  main_dev.dart                     # Development flavor
  main_staging.dart                 # Staging flavor
  main_pre_release.dart             # Pre-release flavor

test/                               # Test directory (mirrors lib/ layout)
  features/
    home/
      presentation/
        bloc/
          banner_bloc_test.dart     # BLoC unit tests
      domain/
        usecases/
          do_get_banner_test.dart   # UseCase unit tests

assets/                             # Static assets
  svg/
  png/
  webp/
```

**Key patterns:**
- `data/datasource/` — Abstract interface + `_impl` implementation (Dio/Retrofit calls)
- `data/model/request/` + `data/model/response/` — DTOs for API communication
- `data/repositories/` — Repository implementation (delegates to datasource)
- `domain/repository/` — Abstract repository interface
- `domain/entities/` — Domain models (extend `Equatable`)
- `domain/usecases/` — `UseCase<T, Params>` classes, each one business operation
- `presentation/bloc/` + `event/` + `state/` — BLoC with `part` directives
- `presentation/pages/` — Full screen widgets (route targets)
- `presentation/widget/` — Feature-specific reusable widgets

**DI registration order** (in `injection_container.dart`):
1. Core services (Dio, RestClient, Hive, etc.)
2. Datasources (`registerLazySingleton`)
3. Repositories (`registerLazySingleton`)
4. Usecases (`registerLazySingleton`)
5. BLoCs (`registerFactory`)

**Codegen artifacts:**
- `*.g.dart` — generated by `json_serializable`, `retrofit_generator`, `auto_route_generator`
- `*.freezed.dart` — generated by `freezed`
- `router.gr.dart` — generated by `auto_route`
- Run `dart run build_runner build --delete-conflicting-outputs` after changes

**Test location:**
Tests live in the `test/` directory, mirroring the `lib/` layout.
- **Naming:** `*_test.dart` (unit), `*_integration_test.dart` (integration)
- **Discovery:** `flutter test` (runs all tests in `test/`)
- **Structure:** Mirror the feature directory structure from `lib/`

**Layer dependency rules:**
```
presentation/ → domain/ (ONLY — never import data/ directly)
domain/       → (no dependencies on data/ or presentation/)
data/         → domain/ (implements abstract interfaces)
```

### Related Principles
- Project Structure @project-structure.md (core philosophy)
- Flutter Idioms and Patterns @flutter-idioms-and-patterns.md (BLoC patterns, widget idioms)
