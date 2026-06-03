# 前端设计文档（基于当前已实现后端）

## 1. 文档范围

本文档仅覆盖当前后端已经提供接口支撑的前端模块，不提前设计尚未落地的后端能力。

当前纳入范围的能力：

- 项目创建
- 素材上传
- 项目详情与状态查看
- 剧本解析触发
- 任务日志查看
- 角色档案创建/列表/详情
- 镜头视觉素材生成与查询

当前不纳入范围的能力：

- 语音与字幕
- 背景音乐混合
- 最终视频合成与导出
- 项目级素材批量生成
- 角色编辑、视觉素材人工选中

## 2. 技术选型

- 框架：React 18
- 工程框架：`@umijs/max`
- UI：Ant Design 5 + ProComponents
- 请求层：`umi-request`
- 服务状态管理：`@tanstack/react-query`
- 页面状态：React Hooks
- 表单：Ant Design `Form`
- 文件上传：Ant Design `Upload`

## 3. 前端目标

前端 MVP 的目标不是一次覆盖完整短片生产流程，而是先把“项目创建 -> 素材上传 -> 剧本解析 -> 角色管理 -> 图片生成 -> 结果查看”这条链路打通。

前端需要重点支持：

1. 让用户顺序完成项目初始化
2. 让用户看到每一步后台执行结果
3. 让用户能快速定位失败原因和任务日志
4. 为后续配音、视频合成预留页面结构

## 4. 页面结构

建议采用以下页面结构：

1. `/projects/new`

- 项目创建页
- 用于录入项目名称、描述、风格、目标时长

2. `/projects/:projectId/setup`

- 项目准备页
- 用于上传剧本、人设图、人设文档、风格参考
- 同页展示项目基础状态与素材摘要

3. `/projects/:projectId`

- 项目工作台
- 展示项目详情、项目状态、最近任务、素材摘要
- 提供“触发剧本解析”入口

4. `/projects/:projectId/characters`

- 角色管理页
- 展示角色列表
- 新建角色档案

5. `/projects/:projectId/characters/:characterId`

- 角色详情页
- 展示角色完整人设、参考图、约束信息

6. `/projects/:projectId/shots`

- 镜头列表页
- 当前后端没有单独镜头列表接口，MVP 可先通过项目详情页跳转到镜头操作区域，后续补独立列表接口

7. `/projects/:projectId/shots/:shotId/visual-assets`

- 镜头视觉素材页
- 生成视觉素材
- 查看该镜头已生成素材

8. `/tasks/:taskId/logs`

- 任务日志页
- 查看任务执行日志与错误信息

## 5. 页面职责

### 5.1 项目创建页

功能：

- 新建项目
- 成功后跳转到项目准备页

核心字段：

- `name`
- `description`
- `style_preset`
- `target_duration_sec`

接口：

- `POST /api/v1/projects`

交互要求：

- 项目名重复时提示 `409`
- 创建成功后保存 `project_id`

### 5.2 项目准备页

功能：

- 上传剧本
- 上传人物设定图
- 上传人物设定文档
- 可选上传风格参考图
- 查看当前素材上传结果

接口：

- `POST /api/v1/projects/{project_id}/assets`
- `GET /api/v1/projects/{project_id}`
- `GET /api/v1/projects/{project_id}/status`

交互要求：

- 上传前展示必填说明
- 上传成功后刷新项目详情和状态
- 页面中显示素材摘要：
  - `script_file_count`
  - `persona_doc_count`
  - `character_image_count`
  - `style_reference_count`

### 5.3 项目工作台

功能：

- 查看项目基础信息
- 查看项目状态
- 查看最近任务摘要
- 手动触发剧本解析

接口：

- `GET /api/v1/projects/{project_id}`
- `GET /api/v1/projects/{project_id}/status`
- `POST /api/v1/projects/{project_id}/parse-script`

交互要求：

- 显示项目状态 `created/running/succeeded/failed`
- 若存在最近任务，展示：
  - `task_id`
  - `stage`
  - `status`
  - `error_message`
  - 日志跳转入口
- 点击“触发剧本解析”后展示结果：
  - `task_id`
  - `workflow_status`
  - `shot_count`

### 5.4 角色管理页

功能：

- 查看角色列表
- 创建角色档案

接口：

- `GET /api/v1/projects/{project_id}/characters`
- `POST /api/v1/projects/{project_id}/characters`

创建角色字段：

- `name`
- `persona_text`
- `voice_style`
- `reference_image_asset_ids`
- `prompt_constraints`
- `seed_policy`

交互要求：

- 角色创建表单可分成：
  - 基础信息
  - 参考图选择
  - 提示词约束
  - seed 策略
- 创建成功后刷新列表
- 同项目角色名重复时提示 `409`

### 5.5 角色详情页

功能：

- 查看单个角色完整信息

接口：

- `GET /api/v1/projects/{project_id}/characters/{character_id}`

展示内容：

- 角色名
- 人设文本
- 音色风格
- 参考图列表
- 正向约束
- 负向约束
- seed 策略

### 5.6 镜头视觉素材页

功能：

- 为指定镜头生成图片素材
- 查看当前镜头已生成的图片素材列表

接口：

- `POST /api/v1/projects/{project_id}/shots/{shot_id}/visual-assets`
- `GET /api/v1/projects/{project_id}/shots/{shot_id}/visual-assets`

生成表单字段：

- `provider`
- `resolution`
- `override_prompt`

当前固定支持：

- `provider = qwen-image-2.0`
- `resolution` 可选：
  - `360p`
  - `480p`
  - `720p`
  - `1080p`

展示内容：

- 素材图片预览
- `provider`
- `resolution`
- `prompt_used`
- `seed`
- `file_path`

交互要求：

- 生成成功后刷新素材列表
- 同时提示该次生成已写入任务日志

### 5.7 任务日志页

功能：

- 查看任务执行日志
- 查看任务错误摘要

接口：

- `GET /api/v1/tasks/{task_id}/logs`

展示内容：

- `task_id`
- `project_id`
- `stage`
- `status`
- `retry_count`
- `error_code`
- `error_message`
- `log_content`

交互要求：

- `log_content` 采用等宽字体和可滚动代码块展示
- 若任务或日志不存在，展示空状态或错误提示

## 6. API 映射

### 6.1 项目接口

- `POST /api/v1/projects`
- `GET /api/v1/projects/{project_id}`
- `GET /api/v1/projects/{project_id}/status`
- `POST /api/v1/projects/{project_id}/assets`
- `POST /api/v1/projects/{project_id}/parse-script`

### 6.2 角色接口

- `POST /api/v1/projects/{project_id}/characters`
- `GET /api/v1/projects/{project_id}/characters`
- `GET /api/v1/projects/{project_id}/characters/{character_id}`

### 6.3 视觉生成接口

- `POST /api/v1/projects/{project_id}/shots/{shot_id}/visual-assets`
- `GET /api/v1/projects/{project_id}/shots/{shot_id}/visual-assets`

### 6.4 任务接口

- `GET /api/v1/tasks/{task_id}/logs`

## 7. 前端数据模型建议

建议在前端 `src/services/types.ts` 中定义这些核心类型：

### 7.1 Project

- `project_id`
- `name`
- `description`
- `target_duration_sec`
- `style_preset`
- `status`
- `created_at`
- `updated_at`

### 7.2 ProjectStatus

- `project_id`
- `status`
- `current_stage`
- `progress`
- `retry_count`
- `last_error_code`
- `last_error_message`
- `updated_at`

### 7.3 CharacterProfile

- `character_id`
- `project_id`
- `name`
- `persona_text`
- `voice_style`
- `reference_image_paths`
- `prompt_constraints`
- `seed_policy`

### 7.4 VisualAsset

- `asset_id`
- `project_id`
- `shot_id`
- `asset_type`
- `provider`
- `resolution`
- `file_path`
- `prompt_used`
- `seed`
- `is_selected`

### 7.5 TaskLog

- `task_id`
- `project_id`
- `stage`
- `status`
- `retry_count`
- `error_code`
- `error_message`
- `log_file_path`
- `log_content`

## 8. 推荐组件拆分

### 8.1 页面级组件

- `ProjectCreatePage`
- `ProjectSetupPage`
- `ProjectDashboardPage`
- `CharacterListPage`
- `CharacterDetailPage`
- `ShotVisualAssetPage`
- `TaskLogPage`

### 8.2 业务组件

- `ProjectBasicForm`
- `ProjectAssetUploadPanel`
- `ProjectStatusCard`
- `LatestTaskCard`
- `CharacterFormDrawer`
- `CharacterConstraintEditor`
- `VisualGenerateForm`
- `VisualAssetGallery`
- `TaskLogViewer`

## 9. 状态管理建议

建议按“服务端状态优先”的思路组织：

1. React Query 管理服务端数据

- 项目详情
- 项目状态
- 角色列表
- 角色详情
- 镜头视觉素材列表
- 任务日志

2. 本地状态仅管理页面交互

- 表单输入
- 当前选中的文件
- Drawer / Modal 开关
- 当前激活 tab

推荐 query key：

- `["project", projectId]`
- `["project-status", projectId]`
- `["characters", projectId]`
- `["character", projectId, characterId]`
- `["visual-assets", projectId, shotId]`
- `["task-log", taskId]`

## 10. 页面流程建议

推荐前端默认流程：

1. 创建项目
2. 上传素材
3. 进入项目工作台
4. 触发剧本解析
5. 创建角色档案
6. 为镜头生成图片素材
7. 查看任务日志和结果

## 11. 异常处理建议

统一处理：

- `400`：参数错误，表单内提示
- `404`：资源不存在，页面空状态
- `409`：冲突提示，例如项目名重复、角色名重复
- `500`：通用错误提示

建议前端统一封装：

- `code === 0` 视为业务成功
- 否则显示 `message`
- 若后端使用 `HTTPException.detail`，优先展示 `detail`

## 12. 当前已知限制

1. 后端暂未提供“项目镜头列表”独立接口

- 前端短期内需要从剧本解析结果或后续补充接口中获取 `shot_id`

2. 视觉生成目前只支持单镜头单次生成

- 没有批量生成接口

3. 角色档案目前没有编辑接口

4. 素材目前仅本地文件存储

- 前端展示图片时，后续可能需要补静态资源访问方案

## 13. 后续前端扩展方向

在后端接口补齐后，前端可继续扩展：

1. 镜头列表与分镜编辑页
2. 角色档案编辑页
3. 视觉素材人工选中页
4. 语音字幕工作台
5. 最终视频预览与导出页
