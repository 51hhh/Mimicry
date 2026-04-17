# Mimicry CI/CD & 自动更新指南

## 概述

| 流水线 | 文件 | 触发条件 | 用途 |
|--------|------|----------|------|
| Release | `release.yml` | `push tags: v*.*.*` | 正式发布，多平台交叉编译 |
| CI Check | `build.yml` | PR to main / 手动 | 编译验证 + 测试 |
| Frontend Check | `frontend-check.yml` | PR（路径过滤） | Prettier + ESLint + TypeScript |
| Clippy Lint | `lint-clippy.yml` | PR（路径过滤） | Rust clippy 静态分析 |

## Release 流水线架构

```
push tag v*.*.*
     │
     ▼
┌─────────────┐
│ check-version│  ← 校验 tag 来自 main + 版本号一致
└──────┬──────┘
       │
       ▼
┌─────────────┐
│build-sidecar│  Win x64/ARM64 + Linux x64 (PyInstaller)
└──────┬──────┘
       │
       ├───────────────────┐
       ▼                   ▼
┌─────────────┐   ┌──────────────────┐
│   release   │   │ release-linux-arm│
│ Win x64     │   │ ARM64 (deb+rpm)  │
│ Win ARM64   │   │ ARMv7 (deb+rpm)  │
│ Linux x64   │   └──────────────────┘
│ (NSIS/deb/  │
│  AppImage)  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ update-release  │  ← 提取 Changelog，Draft → Publish
└─────────────────┘
```

### 构建矩阵

| Job | Target | Runner | 产物 |
|-----|--------|--------|------|
| release | x86_64-pc-windows-msvc | windows-latest | NSIS |
| release | aarch64-pc-windows-msvc | windows-latest | NSIS |
| release | x86_64-unknown-linux-gnu | ubuntu-22.04 | deb + AppImage |
| release-linux-arm | aarch64-unknown-linux-gnu | ubuntu-22.04 | deb + rpm |
| release-linux-arm | armv7-unknown-linux-gnueabihf | ubuntu-22.04 | deb + rpm |

## 发布步骤

### 1. 更新 CHANGELOG.md

```markdown
## v0.x.x

### 🚀 新功能
- 功能描述

### 🐞 修复
- 修复描述
```

### 2. 同步版本号

三个文件中的版本号必须一致：
- `package.json` → `"version": "0.x.x"`
- `src-tauri/tauri.conf.json` → `"version": "0.x.x"`
- `src-tauri/Cargo.toml` → `version = "0.x.x"`

### 3. 提交并推送 Tag

```bash
git add -A
git commit -m "release: v0.x.x"
git push origin main
git tag v0.x.x
git push origin v0.x.x
```

Tag 包含 `-rc` 后缀（如 `v0.2.0-rc1`）时自动标记为 prerelease。

## CI Check 流水线

PR 或手动触发时运行：
- Windows x64 + Ubuntu x64 双平台验证
- `pnpm typecheck` + `pnpm lint` 前端检查
- `pytest sidecar/tests/` Python 测试
- `tauri-action` 构建但不创建 release
- Rust 编译缓存（`Swatinem/rust-cache`）

## Frontend Check 流水线

PR 时自动检测前端文件变更（`src/**`, `*.vue`, `*.ts` 等），仅在有变更时运行：
- Prettier 格式检查
- ESLint 代码规范
- TypeScript 类型检查

## Clippy Lint 流水线

PR 时自动检测 `src-tauri/` 变更，仅在有 Rust 代码变更时运行：
- `cargo clippy` 静态分析（Windows + Linux）

## 自动更新

### 工作原理

1. 应用启动时通过 `@tauri-apps/plugin-updater` 请求 `latest.json`
2. 对比当前版本号与远程版本
3. 有新版本时弹出更新通知
4. 用户确认后下载并安装

### 更新支持矩阵

| 平台 | 格式 | 自动更新 |
|------|------|----------|
| Windows x64/ARM64 | NSIS | ✅ |
| Linux x64 | AppImage | ✅ |
| Linux x64 | deb | ❌ 引导到 Release |
| Linux ARM64/ARMv7 | deb/rpm | ❌ 引导到 Release |

### Endpoint

```
https://github.com/51hhh/Mimicry/releases/latest/download/latest.json
```

## 签名密钥

### 生成

```bash
pnpm tauri signer generate -w ~/.tauri/mimicry.key
```

### 配置 GitHub Secrets

在仓库 Settings → Secrets and variables → Actions 中添加：

| Secret | 值 |
|--------|-----|
| `TAURI_SIGNING_PRIVATE_KEY` | `~/.tauri/mimicry.key` 文件内容 |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | 密码（空密码则留空） |

公钥已配置在 `src-tauri/tauri.conf.json` → `plugins.updater.pubkey` 中。

### 密钥备份

- 私钥位置：`~/.tauri/mimicry.key`
- 公钥位置：`~/.tauri/mimicry.key.pub`
- **私钥丢失 = 所有已安装客户端无法自动更新**，务必安全备份

## 缓存策略

| 类型 | Action | 分组 |
|------|--------|------|
| Rust 编译 | Swatinem/rust-cache@v2 | OS + target |
| pnpm 依赖 | actions/cache@v4 | pnpm-lock.yaml hash |

## 本地开发

```bash
# 前端开发
pnpm dev

# Tauri 开发
pnpm tauri dev

# Sidecar 测试
cd sidecar && python -m pytest tests/ -v

# 完整构建
pnpm tauri build

# 代码检查
pnpm lint        # ESLint
pnpm format:check # Prettier
pnpm typecheck   # TypeScript
```
