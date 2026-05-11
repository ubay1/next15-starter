# 🤖 .agents — AI Agent Configuration

Konfigurasi ini membantu AI coding assistant (Gemini, Claude, Cursor, dll.) memahami arsitektur dan konvensi project **Satu Sehat Mobile** sehingga code yang dihasilkan **konsisten** dengan codebase existing.

> **Sumber:** [awesome-agv](https://github.com/irahardianto/awesome-agv) v1.2.2, dikustomisasi untuk project ini.

---

## 📁 Struktur

```
.agents/
├── rules/          # 42 aturan — dibaca otomatis oleh AI
├── skills/         # 8 kemampuan spesial — diaktifkan saat dibutuhkan
├── workflows/      # 12 proses kerja — dipanggil via slash command
└── README.md       # Dokumen ini
```

---

## 📏 Rules (Otomatis Aktif)

Rules dibaca **otomatis** setiap kali AI membantu coding. Tidak perlu dipanggil manual.

### Rules Utama untuk Project Ini

| Rule | Fungsi |
|---|---|
| `flutter-idioms-and-patterns.md` | **BLoC**, get_it, auto_route, dartz Either, equatable, freezed |
| `project-structure-flutter-mobile.md` | Clean Architecture: `data/` → `domain/` → `presentation/` |
| `architectural-pattern.md` | I/O behind interfaces, pure business logic, dependency injection |
| `code-completion-mandate.md` | Wajib `flutter analyze` + `flutter test` sebelum deliver |
| `testing-strategy.md` | Test pyramid, naming convention, bloc_test patterns |
| `security-mandate.md` | Validasi input, fail closed, defense in depth |
| `error-handling-principles.md` | Error propagation, dartz Either pattern |
| `logging-and-observability-mandate.md` | Logging wajib di setiap operation entry point |
| `rule-priority.md` | Prioritas saat rules konflik: Security > Testability > YAGNI |

### Rules Kondisional (Auto-Load Berdasarkan Konteks)

Rules ini dimuat otomatis saat AI mendeteksi konteks yang relevan:

| Konteks | Rule yang Dimuat |
|---|---|
| Menulis Dart/Flutter code | `flutter-idioms-and-patterns.md` |
| Membuat API call | `api-design-principles.md` |
| Menangani error | `error-handling-principles.md` |
| Menulis test | `testing-strategy.md` |
| Setup CI/CD | `ci-cd-principles.md` |
| Performance tuning | `performance-optimization-principles.md` |
| Database/local storage | `database-design-principles.md` |
| Security-sensitive code | `security-principles.md` |

---

## 🔄 Workflows (Slash Commands)

Ketik slash command di chat untuk mengaktifkan workflow. Workflow adalah proses multi-step yang terstruktur.

### Workflow Utama

#### `/orchestrator` — Build Fitur Lengkap
Proses paling komprehensif. Gunakan untuk fitur baru.

```
Research → Implement (TDD) → Integrate → Verify → Ship
```

**Contoh:**
```
/orchestrator tambahkan fitur push notification untuk reminder PKG
```

---

#### `/quick-fix` — Bug Fix Cepat
Tanpa fase research, langsung diagnosa dan fix.

```
Diagnose → Fix + Test → Verify + Commit
```

**Contoh:**
```
/quick-fix gambar banner 403 error saat load dari cache
```

---

#### `/audit` — Code Review Terstruktur
Review code terhadap seluruh rules: security, reliability, testability, observability.

**Contoh:**
```
/audit review kualitas fitur boarding page
/audit cek semua BLoC di fitur home
```

---

#### `/refactor` — Refactoring Aman
Restructure code dengan test coverage, tanpa mengubah behavior.

**Contoh:**
```
/refactor extract business logic dari home_bloc.dart ke usecase terpisah
```

---

#### `/deploy` — Build & Deploy ke Firebase
Build Flutter app dan deploy ke Firebase App Distribution via Fastlane.

**Parameter:**
- **Environment:** `dev`, `pre`, `staging`
- **Platform:** `ios`, `android`, `both`
- **Version:** `major.minor.patch+buildNumber`

**Contoh:**
```
/deploy environment: dev, platform: ios, version: 8.7.0+682
/deploy environment: staging, platform: both, version: 8.7.0+683
```

---

### Workflow Fase Individual

Bisa dipakai terpisah tanpa `/orchestrator`:

| Command | Fase | Kegunaan |
|---|---|---|
| `/1-research` | Research | Riset codebase, dokumentasi, dan define scope |
| `/2-implement` | Implement | TDD cycle: Red → Green → Refactor |
| `/3-integrate` | Integrate | Test adapter dengan real infrastructure |
| `/4-verify` | Verify | Full lint + test + build validation |
| `/5-commit` | Ship | Git commit dengan conventional format |

### Workflow Spesial

| Command | Kegunaan |
|---|---|
| `/e2e-test` | End-to-end testing |
| `/perf-optimize` | Profile-driven performance optimization |

---

## 🛠️ Skills (Diaktifkan Saat Dibutuhkan)

Skills adalah kemampuan spesial yang AI aktifkan secara otomatis berdasarkan situasi.

| Skill | Kapan Aktif | Kegunaan |
|---|---|---|
| **mobile-design** | Saat membuat UI mobile | Desain premium, platform-native, adaptive layout |
| **debugging-protocol** | Saat bug kompleks | Systematic debugging: hipotesis → validasi → root cause |
| **code-review** | Saat `/audit` | Structured review terhadap semua rules |
| **sequential-thinking** | Saat masalah kompleks | Multi-step reasoning dengan backtracking |
| **guardrails** | Sebelum deliver code | Pre-flight checklist + self-review |
| **adr** | Saat keputusan arsitektur | Architecture Decision Record |
| **perf-optimization** | Saat `/perf-optimize` | Profile-driven optimization |
| **frontend-design** | Saat membuat web UI | Web UI design (kurang relevan untuk Flutter) |

---

## 🏗️ Arsitektur Project yang Didokumentasikan

Rules telah dikustomisasi untuk arsitektur berikut:

```
┌─────────────────────────────────────────────────┐
│                  Presentation                    │
│   BLoC + Event + State + Pages + Widget          │
│   (flutter_bloc, auto_route)                     │
├─────────────────────────────────────────────────┤
│                    Domain                        │
│   UseCase + Repository (abstract) + Entity       │
│   (dartz Either, equatable)                      │
├─────────────────────────────────────────────────┤
│                     Data                         │
│   Datasource + Repository (impl) + Model (DTO)  │
│   (Dio/Retrofit, Hive, freezed)                  │
├─────────────────────────────────────────────────┤
│                     Core                         │
│   DI (get_it) + Routes + Error + Config + Utils  │
│   (envied, Datadog, Firebase)                    │
└─────────────────────────────────────────────────┘
```

### Tech Stack yang Dikenali

| Aspek | Library |
|---|---|
| State Management | `flutter_bloc` (BLoC) |
| Dependency Injection | `get_it` |
| Navigation | `auto_route` |
| Error Handling | `dartz` (Either/Left/Right) |
| Models | `equatable` + `freezed` |
| Networking | `Dio` + `Retrofit` |
| Local Storage | `Hive` + `SharedPreferences` |
| Observability | `Datadog` |
| Env Config | `envied` |
| Build Deploy | `Fastlane` → Firebase App Distribution |

---

## 💡 Tips Penggunaan Optimal

### 1. Untuk Fitur Baru → `/orchestrator`
AI akan riset dulu, lalu implement dengan TDD, baru verify. Hasilnya lebih konsisten.

### 2. Untuk Bug Fix → `/quick-fix`
Skip research, langsung diagnosa dan fix. Cepat dan fokus.

### 3. Sebutkan File/Fitur Spesifik
```
✅ "audit boarding_bloc.dart"
❌ "cek code"
```

### 4. Tanpa Slash Command Juga Jalan
Rules tetap dibaca otomatis. Slash command hanya menambah struktur workflow.

### 5. Setelah Coding → `/audit`
Minta AI review code-nya sendiri terhadap semua 42 rules.

### 6. Sebelum Release → `/deploy`
Build dan deploy ke Firebase langsung dari chat.

---

## 🔧 Maintenance

### Menambah Rule Baru
Buat file `.md` di `.agents/rules/` — otomatis terbaca.

### Menambah Workflow Baru
Buat file `.md` di `.agents/workflows/` dengan format:
```yaml
---
description: Deskripsi singkat workflow
---
# Judul Workflow
## Steps
...
```

### Update Rules
Edit file `.md` yang relevan langsung. Perubahan langsung berlaku di session berikutnya.

### Re-install dari Upstream
```bash
npx awesome-agv
```
> ⚠️ Ini akan **overwrite** semua customisasi. Backup dulu jika ada perubahan.

---

## 📄 Lisensi

Konfigurasi ini berdasarkan [awesome-agv](https://github.com/irahardianto/awesome-agv).
Customisasi untuk project Satu Sehat Mobile oleh tim development.
