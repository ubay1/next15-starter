---
description: Build and deploy iOS/Android to Firebase App Distribution
---

# Deploy Workflow

Build Flutter app and deploy to Firebase App Distribution via Fastlane.

## Prerequisites
- Xcode installed and configured (for iOS)
- Firebase CLI installed at `/usr/local/bin/firebase`
- Fastlane installed (`bundle install` in ios/ and android/)
- Valid signing certificates (iOS) and keystore (Android)

## Parameters

Before starting, confirm with the user:
1. **Environment**: `dev`, `pre` (pre-release), or `staging`
2. **Platform**: `ios`, `android`, or `both`
3. **Version**: e.g., `8.7.0+681` (format: `major.minor.patch+buildNumber`)

## Phases

### Phase 1: Clean & Prepare
// turbo-all

```bash
# 1. Clean previous build artifacts
flutter clean

# 2. Get dependencies
flutter pub get

# 3. Run code generation
dart run build_runner build --delete-conflicting-outputs
```

### Phase 2: Update Release Notes

Ask user for release notes content, then write to `release_notes.txt`:

```bash
# Example — the user provides the actual content
echo "Bug fixes and improvements" > release_notes.txt
```

### Phase 3: Build

#### iOS Build
```bash
# DEV
flutter build ipa --flavor dev --build-number=<BUILD_NUMBER> --build-name=<VERSION> -t lib/main_dev.dart --export-options-plist=ios/ExportOptions.plist

# PRE-RELEASE
flutter build ipa --flavor pre --build-number=<BUILD_NUMBER> --build-name=<VERSION> -t lib/main_pre_release.dart --export-options-plist=ios/ExportOptions.plist

# STAGING
flutter build ipa --flavor staging --build-number=<BUILD_NUMBER> --build-name=<VERSION> -t lib/main_staging.dart --export-options-plist=ios/ExportOptions.plist
```

#### Android Build
```bash
# DEV
flutter build apk --flavor dev --build-number=<BUILD_NUMBER> --build-name=<VERSION> -t lib/main_dev.dart

# PRE-RELEASE
flutter build apk --flavor pre --build-number=<BUILD_NUMBER> --build-name=<VERSION> -t lib/main_pre_release.dart

# STAGING
flutter build apk --flavor staging --build-number=<BUILD_NUMBER> --build-name=<VERSION> -t lib/main_staging.dart
```

### Phase 4: Deploy to Firebase

#### iOS Deploy
```bash
cd ios && bundle exec fastlane deploy_firebase_dev      # for dev
cd ios && bundle exec fastlane deploy_firebase_pre      # for pre-release
cd ios && bundle exec fastlane deploy_firebase_staging   # for staging
```

#### Android Deploy
```bash
cd android && bundle exec fastlane deploy_firebase_dev      # for dev
cd android && bundle exec fastlane deploy_firebase_pre      # for pre-release
cd android && bundle exec fastlane deploy_firebase_staging   # for staging
```

### Phase 5: Verify

1. Check Fastlane output for successful upload
2. Confirm the build appears in Firebase App Distribution console
3. Report version, build number, and Firebase link to user

## Environment ↔ Fastlane Lane Mapping

| Environment | iOS Lane | Android Lane | Entry Point | Tester Groups |
|---|---|---|---|---|
| dev | `deploy_firebase_dev` | `deploy_firebase_dev` | `main_dev.dart` | alpha-tester |
| pre | `deploy_firebase_pre` | `deploy_firebase_pre` | `main_pre_release.dart` | alpha-tester, product |
| staging | `deploy_firebase_staging` | `deploy_firebase_staging` | `main_staging.dart` | alpha-tester, product, security, pusdatin, tribe |

## Build Artifact Paths

| Platform | Flavor | Path |
|---|---|---|
| iOS | all | `build/ios/ipa/satu_sehat_app.ipa` |
| Android | dev | `build/app/outputs/apk/dev/release/app-dev-release.apk` |
| Android | pre | `build/app/outputs/apk/pre/release/app-pre-release.apk` |
| Android | staging | `build/app/outputs/apk/staging/release/app-staging-release.apk` |

## Quick Usage Examples

Deploy dev iOS:
> `/deploy` environment: dev, platform: ios, version: 8.7.0+682

Deploy both platforms staging:
> `/deploy` environment: staging, platform: both, version: 8.7.0+682
