# 文件头注释示例 (File Header Examples)

[简体中文](#简体中文) | [English](#english)

---

## 简体中文

本文档提供所有支持语言的文件头注释示例和模板。

---

## 目录

1. [文件头格式说明](#文件头格式说明)
2. [JavaScript / TypeScript](#javascript--typescript)
3. [Python](#python)
4. [Java / Kotlin](#java--kotlin)
5. [Rust](#rust)
6. [Go](#go)
7. [C / C++](#c--c)
8. [PHP](#php)
9. [Ruby](#ruby)
10. [Swift](#swift)
11. [C#](#c-1)

---

## 文件头格式说明

每个文件头注释包含三个核心字段：

### Input（输入/依赖）
列出该文件依赖的外部模块、包、文件：
- 第三方库（如 `express`, `bcrypt`）
- 本地模块（如 `./models/User`, `../utils/logger`）
- 系统库（如 `fs`, `path`）

### Output（输出/导出）
列出该文件对外提供的接口：
- 导出的类（如 `UserService 类`）
- 导出的函数（如 `createUser()`, `validateEmail()`）
- 导出的常量（如 `API_KEY`, `MAX_RETRIES`）
- API 路由（如 `POST /api/users`, `GET /api/profile`）

### Pos（定位/位置）
描述文件在项目架构中的角色：
- **层级**: API层、业务层、数据层、工具层等
- **功能**: 简短描述（1-2句话）
- **示例**: `API层-用户控制器，处理用户相关HTTP请求`

---

## JavaScript / TypeScript

### 示例 1: Express 控制器

```typescript
/**
 * Input: express, bcrypt, ./models/User, ./middleware/auth
 * Output: router (Express Router), POST /login, POST /register, GET /profile
 * Pos: API层-认证控制器，处理用户认证相关的HTTP请求
 *
 * 本注释在文件修改时自动更新
 */

import express from 'express';
import bcrypt from 'bcrypt';
import { User } from './models/User';
import { authMiddleware } from './middleware/auth';

const router = express.Router();

router.post('/login', async (req, res) => {
  // ...
});

router.post('/register', async (req, res) => {
  // ...
});

router.get('/profile', authMiddleware, async (req, res) => {
  // ...
});

export default router;
```

### 示例 2: React 组件

```typescript
/**
 * Input: react, ./hooks/useAuth, ./components/Button, ./styles/Login.module.css
 * Output: LoginForm 组件 (default export)
 * Pos: UI层-登录表单组件，处理用户登录交互
 *
 * 本注释在文件修改时自动更新
 */

import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Button } from './components/Button';
import styles from './styles/Login.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* ... */}
    </form>
  );
}
```

### 示例 3: 工具函数

```typescript
/**
 * Input: crypto, ./config/constants
 * Output: hashPassword(), verifyPassword(), generateToken()
 * Pos: 工具层-加密工具，提供密码哈希和令牌生成功能
 *
 * 本注释在文件修改时自动更新
 */

import crypto from 'crypto';
import { SALT_ROUNDS } from './config/constants';

export function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, 'salt', SALT_ROUNDS, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  const inputHash = hashPassword(password);
  return inputHash === hash;
}

export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
```

---

## Python

### 示例 1: Flask 应用

```python
"""
Input: flask, sqlalchemy, .models.User, .schemas.UserSchema
Output: app (Flask应用), /api/users (路由), UserController 类
Pos: API层-用户控制器，处理用户相关HTTP请求

本注释在文件修改时自动更新
"""

from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from .models import User
from .schemas import UserSchema

app = Blueprint('users', __name__)
user_schema = UserSchema()

@app.route('/api/users', methods=['GET'])
def get_users():
    """获取所有用户"""
    users = User.query.all()
    return jsonify(user_schema.dump(users, many=True))

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id: int):
    """获取单个用户"""
    user = User.query.get_or_404(user_id)
    return jsonify(user_schema.dump(user))

class UserController:
    """用户控制器类"""

    def __init__(self, db: Session):
        self.db = db

    def create_user(self, data: dict) -> User:
        user = User(**data)
        self.db.add(user)
        self.db.commit()
        return user
```

### 示例 2: Django 模型

```python
"""
Input: django.db, django.contrib.auth.models
Output: User 模型, UserProfile 模型
Pos: 数据层-用户模型，定义用户数据结构和ORM映射

本注释在文件修改时自动更新
"""

from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """扩展的用户模型"""
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    bio = models.TextField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

class UserProfile(models.Model):
    """用户配置模型"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    theme = models.CharField(max_length=20, default='light')
    language = models.CharField(max_length=10, default='en')
    notifications_enabled = models.BooleanField(default=True)

    class Meta:
        db_table = 'user_profiles'
```

---

## Java / Kotlin

### 示例 1: Spring Boot 控制器

```java
/**
 * Input: org.springframework.web, com.example.service.UserService, com.example.model.User
 * Output: UserController 类, GET /api/users, POST /api/users, PUT /api/users/{id}
 * Pos: API层-用户控制器，处理用户相关的REST请求
 *
 * 本注释在文件修改时自动更新
 */

package com.example.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.service.UserService;
import com.example.model.User;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.create(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.update(id, user);
    }
}
```

### 示例 2: Kotlin 数据类

```kotlin
/**
 * Input: kotlinx.serialization, java.time.LocalDateTime
 * Output: User 数据类, UserRole 枚举, UserDto 数据类
 * Pos: 数据层-用户模型，定义用户数据结构
 *
 * 本注释在文件修改时自动更新
 */

package com.example.model

import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class User(
    val id: Long? = null,
    val username: String,
    val email: String,
    val role: UserRole,
    val createdAt: LocalDateTime = LocalDateTime.now()
)

enum class UserRole {
    ADMIN,
    USER,
    GUEST
}

data class UserDto(
    val username: String,
    val email: String
)
```

---

## Rust

### 示例 1: Actix Web 处理器

```rust
//! Input: actix_web, sqlx, crate::models::User, crate::db::DbPool
//! Output: pub fn configure_routes(), pub async fn get_users(), pub async fn create_user()
//! Pos: API层-用户路由处理器，处理用户相关的HTTP请求
//!
//! 本注释在文件修改时自动更新

use actix_web::{web, HttpResponse, Responder};
use sqlx::PgPool;
use crate::models::User;
use crate::db::DbPool;

pub fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/users")
            .route("", web::get().to(get_users))
            .route("", web::post().to(create_user))
            .route("/{id}", web::get().to(get_user))
    );
}

pub async fn get_users(pool: web::Data<DbPool>) -> impl Responder {
    let users = sqlx::query_as::<_, User>("SELECT * FROM users")
        .fetch_all(pool.get_ref())
        .await;

    match users {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn create_user(
    user: web::Json<User>,
    pool: web::Data<DbPool>
) -> impl Responder {
    // Implementation...
    HttpResponse::Created().json(user.into_inner())
}
```

### 示例 2: 数据模型

```rust
//! Input: serde, sqlx, chrono
//! Output: pub struct User, pub struct NewUser, pub enum UserRole
//! Pos: 数据层-用户模型，定义用户数据结构和序列化逻辑
//!
//! 本注释在文件修改时自动更新

use serde::{Serialize, Deserialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i64,
    pub username: String,
    pub email: String,
    pub role: UserRole,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewUser {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "user_role", rename_all = "lowercase")]
pub enum UserRole {
    Admin,
    User,
    Guest,
}
```

---

## Go

### 示例 1: HTTP 处理器

```go
//! Input: net/http, encoding/json, github.com/gorilla/mux, ./models, ./services
//! Output: UserHandler 结构体, GetUsers(), CreateUser(), UpdateUser()
//! Pos: API层-用户处理器，处理用户相关的HTTP请求
//!
//! 本注释在文件修改时自动更新

package handlers

import (
    "encoding/json"
    "net/http"
    "github.com/gorilla/mux"
    "yourapp/models"
    "yourapp/services"
)

type UserHandler struct {
    service *services.UserService
}

func NewUserHandler(service *services.UserService) *UserHandler {
    return &UserHandler{service: service}
}

func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
    users, err := h.service.FindAll()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var user models.User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    created, err := h.service.Create(&user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteStatus(http.StatusCreated)
    json.NewEncoder(w).Encode(created)
}
```

---

## C / C++

### 示例: C++ 头文件

```cpp
/**
 * Input: <string>, <vector>, <memory>, "database.h"
 * Output: User 类, UserRepository 类, UserRole 枚举
 * Pos: 数据层-用户模型和仓储，定义用户数据结构和数据访问接口
 *
 * 本注释在文件修改时自动更新
 */

#ifndef USER_H
#define USER_H

#include <string>
#include <vector>
#include <memory>
#include "database.h"

enum class UserRole {
    ADMIN,
    USER,
    GUEST
};

class User {
private:
    int id;
    std::string username;
    std::string email;
    UserRole role;

public:
    User(const std::string& username, const std::string& email, UserRole role);

    int getId() const { return id; }
    std::string getUsername() const { return username; }
    std::string getEmail() const { return email; }
    UserRole getRole() const { return role; }

    void setUsername(const std::string& username);
    void setEmail(const std::string& email);
};

class UserRepository {
private:
    std::shared_ptr<Database> db;

public:
    UserRepository(std::shared_ptr<Database> database);

    std::vector<User> findAll();
    std::unique_ptr<User> findById(int id);
    User create(const User& user);
    void update(int id, const User& user);
    void remove(int id);
};

#endif // USER_H
```

---

## PHP

### 示例 1: Laravel 控制器

```php
<?php
/**
 * Input: Illuminate\Http, App\Models\User, App\Services\UserService
 * Output: UserController 类, index(), store(), show(), update(), destroy()
 * Pos: API层-用户控制器，处理用户资源的CRUD操作
 *
 * 本注释在文件修改时自动更新
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(): JsonResponse
    {
        $users = $this->userService->getAllUsers();
        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        $user = $this->userService->createUser($validated);
        return response()->json($user, 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->findUserById($id);
        return response()->json($user);
    }
}
```

---

## Ruby

### 示例: Rails 控制器

```ruby
##
# Input: rails, active_record, ./models/user, ./services/user_service
# Output: UsersController 类, index, create, show, update, destroy
# Pos: API层-用户控制器，处理用户资源的RESTful操作
#
# 本注释在文件修改时自动更新

class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show]

  # GET /users
  def index
    @users = User.all
    render json: @users
  end

  # GET /users/:id
  def show
    render json: @user
  end

  # POST /users
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/:id
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
```

---

## Swift

### 示例: SwiftUI 视图

```swift
/**
 * Input: SwiftUI, Combine, ./ViewModels/UserViewModel, ./Models/User
 * Output: UserListView 结构体 (SwiftUI View)
 * Pos: UI层-用户列表视图，显示和管理用户列表
 *
 * 本注释在文件修改时自动更新
 */

import SwiftUI
import Combine

struct UserListView: View {
    @StateObject private var viewModel = UserViewModel()
    @State private var showingAddUser = false

    var body: some View {
        NavigationView {
            List(viewModel.users) { user in
                NavigationLink(destination: UserDetailView(user: user)) {
                    UserRow(user: user)
                }
            }
            .navigationTitle("Users")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingAddUser = true }) {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingAddUser) {
                AddUserView()
            }
            .onAppear {
                viewModel.fetchUsers()
            }
        }
    }
}

struct UserRow: View {
    let user: User

    var body: some View {
        HStack {
            Text(user.username)
                .font(.headline)
            Spacer()
            Text(user.email)
                .font(.subheadline)
                .foregroundColor(.gray)
        }
    }
}
```

---

## C#

### 示例: ASP.NET Core 控制器

```csharp
/**
 * Input: Microsoft.AspNetCore.Mvc, MyApp.Models, MyApp.Services
 * Output: UserController 类, GetUsers(), GetUser(), CreateUser(), UpdateUser(), DeleteUser()
 * Pos: API层-用户控制器，提供用户资源的REST API
 *
 * 本注释在文件修改时自动更新
 */

using Microsoft.AspNetCore.Mvc;
using MyApp.Models;
using MyApp.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(UserDto userDto)
        {
            var user = await _userService.CreateUserAsync(userDto);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDto userDto)
        {
            await _userService.UpdateUserAsync(id, userDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
    }
}
```

---

## 相关文档

- [EXAMPLES.md](EXAMPLES.md) - 完整使用示例
- [COMMANDS.md](COMMANDS.md) - 命令详细说明
- [templates/](skills/project-multilevel-index/templates/) - 官方模板文件

---

## English

This document provides file header comment examples and templates for all supported languages.

## Supported Languages (10+)

- ✅ JavaScript / TypeScript
- ✅ Python
- ✅ Java / Kotlin
- ✅ Rust
- ✅ Go
- ✅ C / C++
- ✅ PHP
- ✅ Ruby
- ✅ Swift
- ✅ C#

## Header Format

Each file header contains three core fields:

### Input (Dependencies)
List external modules, packages, files that this file depends on.

### Output (Exports)
List interfaces this file provides to others.

### Pos (Position)
Describe the file's role in project architecture.

For complete examples, see the Chinese section above or visit [templates/](skills/project-multilevel-index/templates/).

---

## Related Documentation

- [EXAMPLES.md](EXAMPLES.md) - Complete usage examples
- [COMMANDS.md](COMMANDS.md) - Command reference
- [templates/](skills/project-multilevel-index/templates/) - Official template files
