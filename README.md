# leapmotor-design

一个基于 Vue 的富交互、轻量级、高性能的前端组件库

## 安装
在使用的项目中新增.npmrc文件
```sh
# .npmrc 文件内容

# 设置私有仓库的别名
@leapmotor:registry=http://10.192.1.190:8081/repository/group_npm

# 设置默认的npm registry（可选，如果你希望公共包从官方源下载）
registry=https://registry.npmmirror.com/

```
执行安装命令
```sh
npm i -D @leapmotor/design
```

## 开发
```bash
# 配置项目
npm link

# 进入项目目录
cd xxxx

# 引用项目设置软链接
npm link @leapmotor/design

# 取消引用项目软链接
npm unlink @leapmotor/design
```

## 组件列表

| Type     | Name                                                                                                                    | Description          | Author                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------- | -------------------------- |
| 逻辑模块 | [BaseUploader](https://git-external.leapmotor.com/business-front/webx/leapmotor-design/-/blob/main/doc/BaseUploader.md)  |  抽象上传组件         |  pan_ji2@leapmotor.com     |
| 逻辑模块 | [OssUploader](https://git-external.leapmotor.com/business-front/webx/leapmotor-design/-/blob/main/doc/OssUploader.md)    |  Oss 上传组件         |  pan_ji2@leapmotor.com     |
| UI模块   | [Theme](https://git-external.leapmotor.com/business-front/webx/leapmotor-design/-/blob/main/doc/Theme.md)               |  Theme 主题色         |  pan_ji2@leapmotor.com     |
| 逻辑模块 | [Validator](https://git-external.leapmotor.com/business-front/webx/leapmotor-design/-/blob/main/doc/Validator.md)        |  Validator 组件      |  pan_ji2@leapmotor.com     |
| UI模块   | [Table](https://git-external.leapmotor.com/business-front/webx/leapmotor-design/-/blob/main/doc/Table.md)                  |  Table 表格          |  pan_ji2@leapmotor.com     |

<!-- module list -->
Issue 反馈： [点此](https://git-external.leapmotor.com/business-front/webx/leapmotor-design/-/issues)

## 发布命令
```sh
npm publish --registry=http://10.192.1.190:8081/repository/npm_it/
```
