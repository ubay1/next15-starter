---
trigger: model_decision
description: When writing Flutter or Dart code, working on mobile UI, using BLoC for state management, or building Flutter widgets
---

## Flutter Idioms and Patterns (BLoC + Clean Architecture)

### Core Philosophy

Flutter is a UI toolkit first — performance is a first-class concern. `const` widgets and immutable data keep the render tree efficient. **BLoC** (`flutter_bloc`) is the canonical state management solution: separates business logic from UI, testable without `BuildContext`, predictable unidirectional data flow (Event → BLoC → State).

**Clean Architecture** is mandatory. All features must follow the three-layer structure: `data/` → `domain/` → `presentation/`. Business logic lives in `domain/usecases/`, I/O operations live in `data/datasource/`, and UI lives in `presentation/`.

**Dependency Injection** uses **get_it** as a service locator. All dependencies are registered in `injection_container.dart` and resolved via `sl<T>()`.

**Key dependencies:**

```yaml
# pubspec.yaml
dependencies:
  flutter_bloc: ^8.1.1
  equatable: ^2.0.5
  dartz: ^0.10.1
  get_it: ^8.0.2
  auto_route: ^8.1.4
  dio: ^5.4.0
  retrofit: ^4.0.3
  freezed_annotation: ^2.2.0
  hive: ^2.2.3

dev_dependencies:
  flutter_lints: ^5.0.0
  freezed: ^2.3.2
  json_serializable: ^6.6.1
  auto_route_generator: ^8.0.0
  retrofit_generator: ^8.0.6
  build_runner: ^2.3.3
```

> **Scope:** This file covers Flutter/Dart *coding idioms*. For file and folder layout, see `project-structure-flutter-mobile.md`. For test naming, see `testing-strategy.md`. For general error handling principles, see `error-handling-principles.md`.

---

### `const` Constructors — Everywhere

Make every widget `const` when possible. `const` widgets are created once and never rebuilt unless their inputs change — this is Flutter's most impactful performance optimization.

```dart
// ✅ const constructor — widget is rebuild-safe
class TaskCard extends StatelessWidget {
    const TaskCard({super.key, required this.task});
    final Task task;
    // ...
}

// Usage — compile-time constant
const TaskCard(task: myTask)

// ❌ Missing const — rebuilt on every parent rebuild
TaskCard(task: myTask)
```

**Rules:**
- Every `StatelessWidget` that has no mutable state must have a `const` constructor
- Pass `const` keyword at the call site, not just the definition
- Lint rule `prefer_const_constructors` should be enabled in `analysis_options.yaml`

---

### Widget Decomposition

Large `build` methods are the primary source of performance problems and unmaintainable UI code.

1. **Extract a new widget when a subtree has distinct responsibilities**
   ```dart
   // ❌ Everything in one build method
   @override
   Widget build(BuildContext context) {
       return Column(children: [
           // 30 lines of header...
           // 50 lines of list...
           // 20 lines of footer...
       ]);
   }

   // ✅ Each subtree is a named widget with a const constructor
   @override
   Widget build(BuildContext context) {
       return Column(children: [
           const TaskHeader(),
           const TaskList(),
           const TaskFooter(),
       ]);
   }
   ```

2. **Never use builder methods (`_buildHeader()`) as a substitute for extracting widgets**
   - Builder methods do not benefit from `const` and always rerun on parent rebuild
   - Extract a proper `StatelessWidget` instead

3. **Keep `build` methods under ~30 lines** — if longer, decompose

---

### Immutable Data with `equatable` and `freezed`

Domain models use **`equatable`** for value equality. Data models (request/response DTOs) may use **`freezed`** for code generation.

```dart
// domain/entities/banner_entity.dart — Domain entity with equatable
class BannerEntity extends Equatable {
    final bool success;
    final String code;
    final String message;
    final List<DataBannerEntity> data;

    const BannerEntity({
        required this.success,
        required this.code,
        required this.message,
        required this.data,
    });

    @override
    List<Object?> get props => [success, code, message, data];
}
```

```dart
// data/model/response/banner_response.dart — DTO with freezed/json_serializable
@freezed
class BannerResponse with _$BannerResponse {
    const factory BannerResponse({
        bool? success,
        String? code,
        String? message,
        List<DataBanner>? data,
    }) = _BannerResponse;

    factory BannerResponse.fromJson(Map<String, dynamic> json) =>
        _$BannerResponseFromJson(json);
}
```

**Rules:**
- Domain entities extend `Equatable` with `const` constructors
- DTOs (request/response) may use `freezed` with `json_serializable`
- Never expose mutable fields on domain models
- Run `dart run build_runner build` after changing freezed/json_serializable models

---

### BLoC Pattern — State Management

**BLoC (`flutter_bloc`) is the only state management solution** used in this project. Do not introduce Riverpod, Provider (as state management), or GetX.

#### BLoC Structure

Every BLoC consists of three parts, using `part` directives:

```dart
// presentation/bloc/banner_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';

part '../event/banner_event.dart';
part '../state/banner_state.dart';

class BannerBloc extends Bloc<BannerEvent, BannerState> {
  final DoGetBanner _doGetBanner;

  BannerBloc(this._doGetBanner) : super(const BannerState()) {
    on<DataBannerEvent>(_doGetDataBanner);
  }

  Future<void> _doGetDataBanner(
    DataBannerEvent event,
    Emitter<BannerState> emit,
  ) async {
    try {
      emit(state.copyWith(isloading: true, errorMessage: null, bannerData: null));

      final result = await _doGetBanner(
        BannerParams(isForceRefresh: event.isForceRefresh, frame_code: event.frameCode),
      );

      result.fold(
        (failure) {
          final errorResponse = (failure as BuletinFailure).errorResponse;
          emit(state.copyWith(
            isloading: false,
            errorMessage: ErrorEntity(
              success: false,
              code: errorResponse?.code ?? appErrorCode,
              message: errorResponse?.message ?? '',
            ),
          ));
        },
        (data) {
          emit(state.copyWith(isloading: false, bannerData: data.data));
        },
      );
    } catch (e) {
      emit(state.copyWith(isloading: false, errorMessage: genericErrorEntityV2));
    }
  }
}
```

#### Event Definition

```dart
// presentation/event/banner_event.dart
part of '../bloc/banner_bloc.dart';

abstract class BannerEvent extends Equatable {
  const BannerEvent();

  @override
  List<Object?> get props => [];
}

class DataBannerEvent extends BannerEvent {
  final bool isForceRefresh;
  final String frameCode;

  const DataBannerEvent({required this.isForceRefresh, required this.frameCode});

  @override
  List<Object?> get props => [isForceRefresh, frameCode];
}
```

#### State Definition

```dart
// presentation/state/banner_state.dart
part of '../bloc/banner_bloc.dart';

class BannerState extends Equatable {
  final bool isloading;
  final ErrorEntity? errorMessage;
  final List<DataBannerEntity>? bannerData;

  const BannerState({
    this.isloading = false,
    this.errorMessage,
    this.bannerData,
  });

  BannerState copyWith({
    bool? isloading,
    ErrorEntity? errorMessage,
    List<DataBannerEntity>? bannerData,
  }) {
    return BannerState(
      isloading: isloading ?? this.isloading,
      errorMessage: errorMessage,  // intentionally nullable
      bannerData: bannerData ?? this.bannerData,
    );
  }

  @override
  List<Object?> get props => [isloading, errorMessage, bannerData];
}
```

#### BLoC in Widgets — `BlocProvider` and `BlocBuilder`

```dart
// ✅ Provide a BLoC to its subtree
BlocProvider(
  create: (_) => sl<BannerBloc>()..add(const DataBannerEvent(
    isForceRefresh: false,
    frameCode: 'home',
  )),
  child: const BannerWidget(),
)

// ✅ Build UI based on BLoC state
BlocBuilder<BannerBloc, BannerState>(
  builder: (context, state) {
    if (state.isloading) return const ShimmerLoading();
    if (state.errorMessage != null) return ErrorWidget(state.errorMessage!);
    return BannerList(data: state.bannerData ?? []);
  },
)

// ✅ Listen for side effects (snackbars, navigation)
BlocListener<BannerBloc, BannerState>(
  listenWhen: (previous, current) => previous.errorMessage != current.errorMessage,
  listener: (context, state) {
    if (state.errorMessage != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.errorMessage!.message)),
      );
    }
  },
  child: const BannerWidget(),
)

// ❌ Never call context.read<Bloc>() inside build — use BlocBuilder instead
// ❌ Never use BlocBuilder when you only need side effects — use BlocListener
```

#### MultiBlocProvider

```dart
// ✅ Provide multiple BLoCs at once
MultiBlocProvider(
  providers: [
    BlocProvider(create: (_) => sl<HomeBloc>()..add(const LoadHome())),
    BlocProvider(create: (_) => sl<BannerBloc>()),
    BlocProvider(create: (_) => sl<FeatureBloc>()),
  ],
  child: const HomeScreen(),
)
```

---

### Dependency Injection with `get_it`

**get_it** is the service locator used for all dependency injection. The global instance is `sl`.

```dart
// core/resources/injector/injection_container.dart
import 'package:get_it/get_it.dart';

final sl = GetIt.I;

Future<void> init() async {
  // Datasources
  sl.registerLazySingleton<HomeDatasource>(
    () => HomeDatasourceImpl(sl()),
  );

  // Repositories
  sl.registerLazySingleton<HomeRepository>(
    () => HomeRepositoryImpl(sl()),
  );

  // Usecases
  sl.registerLazySingleton(() => DoGetBanner(sl()));

  // BLoCs — use registerFactory so each screen gets a fresh instance
  sl.registerFactory(() => BannerBloc(sl()));
}
```

**Rules:**
- **Datasources, Repositories, Usecases** → `registerLazySingleton` (shared across app)
- **BLoCs** → `registerFactory` (fresh instance per screen to avoid stale state)
- Never create BLoC instances directly in widgets — always resolve via `sl<T>()`
- Registration order: Datasource → Repository → UseCase → BLoC

---

### UseCase Pattern

All business operations go through a UseCase class. This is the Clean Architecture expression of the Testability-First principle.

```dart
// core/core.dart — Base UseCase contract
abstract class UseCase<Type, Params> {
  Future<Either<Failure, Type>> call(Params params);
}

class NoParams extends Equatable {
  @override
  List<Object?> get props => [];
}
```

```dart
// domain/usecases/do_get_banner.dart — Concrete UseCase
class DoGetBanner implements UseCase<BannerEntity, BannerParams> {
  final HomeRepository _repository;

  DoGetBanner(this._repository);

  @override
  Future<Either<Failure, BannerEntity>> call(BannerParams params) async {
    final result = await _repository.doGetBanner(params);
    return result.fold(
      (l) => Left(l),
      (r) => Right(BannerEntity(
        success: r.success ?? false,
        code: r.code ?? appErrorCode,
        message: r.message ?? '',
        data: r.data?.map((e) => DataBannerEntity(/* ... */)).toList() ?? [],
      )),
    );
  }
}

class BannerParams extends Equatable {
  final String frame_code;
  final bool isForceRefresh;

  const BannerParams({required this.isForceRefresh, required this.frame_code});

  @override
  List<Object?> get props => [frame_code, isForceRefresh];
}
```

**Rules:**
- One UseCase per business operation
- UseCase receives repository via constructor injection
- UseCase returns `Either<Failure, T>` (from `dartz`)
- Params class extends `Equatable`; use `NoParams` for parameterless operations
- UseCase transforms data model (Response DTO) → domain entity

---

### Repository & Datasource Pattern

All data access goes through an abstract repository. This is the Dart expression of the Testability-First architecture (see `architectural-pattern.md`).

```dart
// domain/repository/home_repository.dart — Abstract interface
abstract class HomeRepository {
  Future<Either<Failure, BannerResponse>> doGetBanner(BannerParams params);
  Future<Either<Failure, BuletinResponse>> doGetBuletin(BuletinParams params);
}
```

```dart
// data/repositories/home_repository_impl.dart — Implementation
class HomeRepositoryImpl implements HomeRepository {
  final HomeDatasource _datasource;

  HomeRepositoryImpl(this._datasource);

  @override
  Future<Either<Failure, BannerResponse>> doGetBanner(BannerParams params) {
    return _datasource.doGetBanner(
      BannerRequest(frameCode: params.frame_code),
      params.isForceRefresh,
    );
  }
}
```

```dart
// data/datasource/home_datasource.dart — Abstract datasource
abstract class HomeDatasource {
  Future<Either<Failure, BannerResponse>> doGetBanner(
    BannerRequest request,
    bool isForceRefresh,
  );
}
```

```dart
// data/datasource/home_datasource_impl.dart — Implementation (Dio/Retrofit)
class HomeDatasourceImpl implements HomeDatasource {
  final RestClient _restClient;

  HomeDatasourceImpl(this._restClient);

  @override
  Future<Either<Failure, BannerResponse>> doGetBanner(
    BannerRequest request,
    bool isForceRefresh,
  ) async {
    try {
      final response = await _restClient.getBanner(request);
      return Right(response);
    } on DioException catch (e) {
      return Left(BuletinFailure(
        exception: e,
        errorResponse: ErrorResponse.fromDioException(e),
      ));
    }
  }
}
```

**Rules:**
- Repository abstract class lives in `domain/repository/`
- Repository implementation lives in `data/repositories/`
- Datasource abstract class lives in `data/datasource/`
- Datasource implementation lives in `data/datasource/` (suffixed `_impl`)
- Datasource wraps API calls in try-catch, returns `Either<Failure, Response>`
- Repository delegates to datasource, may add caching logic

---

### Error Handling — `dartz Either` + `Failure` Hierarchy

The project uses `dartz` `Either<Failure, T>` for functional error handling. Every I/O operation returns `Either` — never throws.

```dart
// core/error/failures.dart — Failure hierarchy
abstract class Failure {}

class NetworkFailure extends Failure {}

class BuletinFailure extends Failure {
  final DioException? exception;
  final String? otherException;
  final ErrorResponse? errorResponse;

  BuletinFailure({this.exception, this.otherException, required this.errorResponse});
}

class GeneralFailure extends Failure {
  final DioException? exception;
  final String? otherException;
  final ErrorResponse? errorResponse;

  GeneralFailure({this.exception, this.otherException, this.errorResponse});
}
```

**Rules:**
- All I/O operations return `Either<Failure, T>` — never throw exceptions from repositories
- Each feature domain has its own `Failure` subclass (e.g., `BuletinFailure`, `LoginFailure`)
- `Failure` carries optional `DioException` and `ErrorResponse` for context
- BLoC handlers `fold` the `Either` to emit success/error states
- Wrap fold in `try-catch` as a safety net for unexpected errors

---

### Navigation with `auto_route`

**`auto_route` is the canonical navigation library.**

```dart
// core/routes/router.dart
@AutoRouterConfig()
class AppRouter extends RootStackRouter {
  @override
  List<AutoRoute> get routes => [
    AutoRoute(page: SplashRoute.page, initial: true),
    AutoRoute(page: HomeRoute.page),
    AutoRoute(page: LoginRoute.page),
    // ...
  ];
}
```

```dart
// Navigate
context.router.push(HomeRoute());
context.router.push(BannerDetailRoute(id: bannerId));
context.router.maybePop(); // safe pop

// Replace current route
context.router.replace(LoginRoute());

// ❌ Never use Navigator.push directly — always use auto_route
```

**Rules:**
- All screens are annotated with `@RoutePage()`
- Routes are defined in `core/routes/router.dart`
- Generated file: `router.gr.dart` — run `build_runner` after adding routes
- Use `context.router.push()` for navigation, `context.router.maybePop()` for back

---

### Dart Language Idioms

1. **Null safety — use `?.`, `??`, and `??=` idiomatically**
   ```dart
   final city = user?.address?.city ?? 'Unknown';
   cache ??= await compute(); // assign only if null
   ```

2. **Use `late` only for fields initialized before first use that cannot be `final`**
   - Prefer `final` fields initialized in the constructor
   - `late` without initialization is an unsafe nullable escape hatch

3. **Extension methods for adding behaviour to types you don't own**
   ```dart
   extension TaskStatusLabel on TaskStatus {
       String get label => switch (this) {
           TaskStatus.pending => 'Pending',
           TaskStatus.done => 'Done',
       };
   }
   ```

4. **Use `switch` expressions (Dart 3+) for exhaustive pattern matching**
   ```dart
   final label = status switch {
       TaskStatus.pending => 'Pending',
       TaskStatus.done => 'Done',
       // Compiler error if a case is missing
   };
   ```

5. **Avoid `dynamic` — it is the Dart equivalent of TypeScript's `any`**

---

### Testing

> Test naming and pyramid proportions are defined in `testing-strategy.md`. This section covers Flutter/BLoC test patterns.

#### Unit Test BLoCs with `bloc_test`

```dart
import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

// Mock the usecase
class MockDoGetBanner extends Mock implements DoGetBanner {}

void main() {
  late BannerBloc bloc;
  late MockDoGetBanner mockDoGetBanner;

  setUp(() {
    mockDoGetBanner = MockDoGetBanner();
    bloc = BannerBloc(mockDoGetBanner);
  });

  tearDown(() => bloc.close());

  blocTest<BannerBloc, BannerState>(
    'emits [loading, loaded] when DataBannerEvent is added',
    build: () {
      when(mockDoGetBanner(any)).thenAnswer(
        (_) async => Right(BannerEntity(/* ... */)),
      );
      return bloc;
    },
    act: (bloc) => bloc.add(const DataBannerEvent(
      isForceRefresh: false,
      frameCode: 'home',
    )),
    expect: () => [
      const BannerState(isloading: true),
      isA<BannerState>().having((s) => s.isloading, 'isloading', false),
    ],
  );
}
```

#### Unit Test Usecases

```dart
void main() {
  late DoGetBanner useCase;
  late MockHomeRepository mockRepository;

  setUp(() {
    mockRepository = MockHomeRepository();
    useCase = DoGetBanner(mockRepository);
  });

  test('returns BannerEntity on success', () async {
    when(mockRepository.doGetBanner(any)).thenAnswer(
      (_) async => Right(BannerResponse(success: true, data: [])),
    );

    final result = await useCase(const BannerParams(
      isForceRefresh: false,
      frame_code: 'home',
    ));

    expect(result.isRight(), true);
  });
}
```

#### Widget Tests

```dart
testWidgets('shows banner list', (tester) async {
  await tester.pumpWidget(
    MaterialApp(
      home: BlocProvider<BannerBloc>.value(
        value: mockBannerBloc,
        child: const BannerWidget(),
      ),
    ),
  );
  expect(find.byType(BannerCard), findsWidgets);
});
```

---

### Anti-Patterns — NEVER DO THIS

| Anti-Pattern | Why | Correct Approach |
|---|---|---|
| `BlocProvider(create: (_) => BannerBloc(DoGetBanner(...)))` | Creates usecase on the fly bypassing DI | `BlocProvider(create: (_) => sl<BannerBloc>())` |
| Business logic in `build()` | Violates separation | Put logic in UseCase/BLoC |
| Deep widget nesting (\>5 levels in one `build`) | Unreadable, untestable | Extract widgets |
| `setState` for global state | Does not scale | Use BLoC |
| `dynamic` types everywhere | No type safety | Use proper types |
| Hardcoded strings in UI | No i18n support | Use `S.of(context).*` |
| Raw `Navigator.push` | Bypasses auto_route | `context.router.push(...)` |
| `throw` from repository/datasource | Breaks Either pattern | Return `Left(Failure(...))` |
| BLoC as `registerLazySingleton` | Stale state across screens | Use `registerFactory` |
| Import from `data/` layer in `presentation/` | Domain boundary violation | Only use `domain/` entities in `presentation/` |

---

### Linting and Formatting

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

**Lint configuration:** `analysis_options.yaml` includes `package:flutter_lints/flutter.yaml`.

---

### Related Principles
- Architectural Patterns — Testability-First Design @architectural-pattern.md
- Project Structure (Flutter) @project-structure-flutter-mobile.md
- Testing Strategy @testing-strategy.md
- Error Handling Principles @error-handling-principles.md
- Code Organization Principles @code-organization-principles.md
