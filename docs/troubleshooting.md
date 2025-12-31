# 问题排查与解决方案

## 🚨 当前问题：Access denied 权限错误

### 错误描述

运行应用时在控制台看到如下错误：

```
Access denied. One of the following scopes is required: [contact:user.employee_id:readonly]
```

### 问题原因

这个错误表明飞书应用缺少必需的 `contact:user.employee_id:readonly` 权限。虽然应用代码中已经在授权 scope 中包含了这个权限，但**必须在飞书开放平台后台为应用开通这个权限**。

### 🔧 解决步骤

#### 第一步：登录飞书开放平台

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 使用企业管理员账号登录

#### 第二步：找到您的应用

1. 在应用列表中找到您创建的应用
2. 点击应用卡片进入应用管理页面

#### 第三步：开通权限

1. 在左侧菜单中点击「权限管理」
2. 在搜索框中搜索：`contact:user.employee_id:readonly`
3. 找到「通过手机号或邮箱获取用户 ID」权限
4. 点击「开通」按钮
5. 如果需要审批，请联系管理员进行审批

#### 第四步：验证其他必需权限

确保以下所有权限都已开通：

- ✅ `contact:user.employee_id:readonly` - 获取用户 employeeID
- ✅ `docs:doc` - 查看、评论和导出文档
- ✅ `docs:document.media:download` - 下载文档中的媒体文件
- ✅ `docs:document:export` - 导出文档为其他格式
- ✅ `docx:document` - 访问新版文档
- ✅ `drive:drive` - 查看云盘信息
- ✅ `drive:file` - 查看云盘文件
- ✅ `drive:file:download` - 下载云盘文件
- ✅ `wiki:wiki` - 查看、编辑和管理知识库
- ✅ `offline_access` - 获取 refresh token

#### 第五步：重新授权

权限配置完成后：

1. 在应用中点击右上角头像，选择「退出登录」
2. 重新进入应用，会自动跳转到授权页面
3. 扫码完成新的授权流程
4. 授权成功后即可正常使用

### 📝 权限开通详细说明

如果您是第一次配置飞书应用权限，建议查看完整的权限配置指南：

👉 [飞书应用权限配置指南](./permission-setup.md)

---

## 其他常见问题

### 问题：无法加载文件列表

**症状**：
- 登录成功后看不到云盘文件
- 知识库列表为空
- 提示"加载失败"

**可能原因**：
1. 用户没有访问权限
2. 网络连接问题
3. Token 已过期

**解决方案**：
1. 确认用户账号有权访问对应的云盘或知识库
2. 检查网络连接是否正常
3. 尝试重新登录

### 问题：下载任务失败

**症状**：
- 任务显示"失败"状态
- 下载进度停止
- 提示"导出失败"

**可能原因**：
1. 文件权限不足
2. 导出格式不支持
3. 网络中断

**解决方案**：
1. 确认有权限下载该文件
2. 尝试更换导出格式
3. 使用"重试"功能重新下载

### 问题：Token 过期

**症状**：
- 突然跳转到登录页面
- 提示"Token expired"
- API 调用失败

**解决方案**：
1. 应用会自动尝试刷新 Token
2. 如果自动刷新失败，请重新登录
3. 确保应用配置中的 `offline_access` 权限已开通

### 问题：重定向 URL 错误

**症状**：
- 授权后浏览器显示"无法访问此网站"
- 回调失败

**解决方案**：
1. 检查飞书应用的「安全设置」
2. 确认已添加以下重定向 URL：
   - `http://localhost:3000/callback`
   - `http://localhost:3001/callback`
3. 保存配置后重新授权

---

## 📊 错误代码对照表

| 错误代码 | 含义 | 解决方案 |
|---------|------|---------|
| 400 | 请求参数错误或权限不足 | 检查权限配置 |
| 401 | 未授权或 Token 无效 | 重新登录 |
| 403 | 禁止访问 | 检查文件权限 |
| 404 | 资源不存在 | 确认文件未被删除 |
| 429 | 请求频率过高 | 稍后重试 |
| 500 | 服务器错误 | 联系飞书客服 |

---

## 🔍 调试技巧

### 查看详细日志

1. 开发模式运行应用：
```bash
npm run tauri dev
```

2. 按 F12 打开开发者工具
3. 查看 Console 标签页的日志输出
4. 查看 Network 标签页的网络请求

### 清除缓存

如果遇到奇怪的问题，可以尝试清除缓存：

1. 在应用中退出登录
2. 关闭应用
3. 删除以下文件（如果存在）：
   - Windows: `%APPDATA%\com.ytcheng.feishu_docs_export\`
   - macOS: `~/Library/Application Support/com.ytcheng.feishu_docs_export/`
   - Linux: `~/.local/share/com.ytcheng.feishu_docs_export/`
4. 重新启动应用

### 检查数据库

应用使用 SQLite 数据库存储任务信息：

**数据库位置**：
- 开发模式：`src-tauri/.data/feishu_docs_export.db`
- 生产模式：应用数据目录下

可以使用 SQLite 工具（如 DB Browser for SQLite）查看数据库内容。

---

## 📞 需要更多帮助？

如果以上方案都无法解决您的问题：

1. 📋 [提交 Issue](https://github.com/ytcheng/feishu_docs_export/issues/new)
   - 请附上详细的错误信息
   - 提供控制台日志截图
   - 说明您的操作系统和应用版本

2. 📚 查看相关文档：
   - [权限配置指南](./permission-setup.md)
   - [飞书开放平台文档](https://open.feishu.cn/document/)

3. 🔍 搜索已有的 Issues：
   - 可能有其他用户遇到过类似问题
   - 查看解决方案和讨论

---

**最后更新**: 2025-12-31
