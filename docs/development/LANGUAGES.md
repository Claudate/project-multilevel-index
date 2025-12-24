# 支持的编程语言

项目多级索引系统现已支持 **10 种主流编程语言**！

---

## 完整语言列表

| # | 语言 | 模板文件 | 注释风格 | 主流框架 |
|---|------|---------|---------|---------|
| 1 | **JavaScript/TypeScript** | [javascript.md](skills/project-multilevel-index/templates/javascript.md) | JSDoc `/** */` | Express, React, Next.js |
| 2 | **Python** | [python.md](skills/project-multilevel-index/templates/python.md) | Docstring `"""` | Flask, FastAPI, Django |
| 3 | **Java/Kotlin** | [java.md](skills/project-multilevel-index/templates/java.md) | JavaDoc `/** */` | Spring Boot, JPA, Hibernate |
| 4 | **Rust** | [rust.md](skills/project-multilevel-index/templates/rust.md) | Module doc `//!` | Actix-web, Rocket, Tokio |
| 5 | **Go** | [go.md](skills/project-multilevel-index/templates/go.md) | Line comment `//` | Gin, Echo, GORM |
| 6 | **C/C++** | [cpp.md](skills/project-multilevel-index/templates/cpp.md) | Doxygen `/** */` | Qt, Boost, Modern C++ |
| 7 | **PHP** | [php.md](skills/project-multilevel-index/templates/php.md) | PHPDoc `/** */` | Laravel, Symfony |
| 8 | **Ruby** | [ruby.md](skills/project-multilevel-index/templates/ruby.md) | YARD `##` | Rails, Sinatra, Grape |
| 9 | **Swift** | [swift.md](skills/project-multilevel-index/templates/swift.md) | Swift Doc `///` | SwiftUI, UIKit, Combine |
| 10 | **C#** | [csharp.md](skills/project-multilevel-index/templates/csharp.md) | XML Doc `///` | .NET, ASP.NET Core, EF Core |

---

## 每个模板包含

每个语言模板都提供：

✅ **基础语法示例** - 文件头注释的标准格式
✅ **完整项目示例** - Model, Service, Controller 三层架构
✅ **框架特定用法** - 主流框架的最佳实践
✅ **设计模式示例** - Repository, Service, Middleware 等
✅ **测试示例** - 单元测试和集成测试

---

## 模板文件大小

| 语言 | 文件大小 | 示例数量 |
|------|---------|---------|
| JavaScript/TypeScript | ~2.5 KB | 3 个 (Basic, Express, React) |
| Python | ~3.0 KB | 4 个 (Basic, Flask, FastAPI, Model) |
| Java/Kotlin | ~4.5 KB | 5 个 (Service, Controller, Entity, Repository, Kotlin) |
| Rust | ~4.0 KB | 4 个 (Basic, Actix-web, Library, Cache) |
| Go | ~5.0 KB | 5 个 (Basic, Gin, Service, Model, Repository) |
| C/C++ | ~5.5 KB | 6 个 (Header, Implementation, Service, Qt, CMake) |
| PHP | ~4.5 KB | 5 个 (Basic, Laravel, Model, Repository, Middleware) |
| Ruby | ~5.0 KB | 6 个 (Basic, Rails, Model, Service, Grape API, RSpec) |
| Swift | ~6.0 KB | 6 个 (Service, SwiftUI, ViewModel, Model, Repository, Tests) |
| C# | ~6.5 KB | 6 个 (Service, Controller, Model, Repository, Middleware, Tests) |

**总计**: ~46 KB 的高质量模板代码！

---

## 如何使用模板

### 1. 查看模板

所有模板位于：
```
skills/project-multilevel-index/templates/
```

### 2. 插件自动选择

运行 `/init-index` 时，插件会根据文件扩展名自动选择正确的模板：

```
.js/.jsx/.ts/.tsx  → javascript.md
.py                → python.md
.java/.kt          → java.md
.rs                → rust.md
.go                → go.md
.cpp/.c/.h/.hpp    → cpp.md
.php               → php.md
.rb                → ruby.md
.swift             → swift.md
.cs                → csharp.md
```

### 3. 手动参考

您也可以直接查看模板文件，作为编写文件头注释的参考。

---

## 扩展性

### 添加新语言

如果您需要支持其他语言，只需：

1. 在 `skills/project-multilevel-index/templates/` 创建新模板文件
2. 按照现有模板的格式编写
3. 在 `SKILL.md` 中添加语言识别规则

### 贡献模板

欢迎提交 PR 添加更多语言支持！

---

## 语言覆盖率

这 10 种语言覆盖了：

- 🌐 **Web 开发**: JavaScript, TypeScript, PHP, Ruby, Python
- 📱 **移动开发**: Swift, Kotlin, Java
- 🖥️ **系统编程**: Rust, Go, C, C++
- 🏢 **企业应用**: Java, C#, Python
- 🚀 **高性能**: Rust, Go, C++
- ☁️ **云原生**: Go, Rust, Python, Java

**几乎涵盖所有主流开发场景！**

---

**让任何语言的项目都能拥有分形自指文档系统！** 🎼
