### Table
#### Table Attributes
| 参数 | 说明 | 类型 | 默认值 | 是否必填 |
| -------- | -------- | -------- | -------- | -------- |
| optionObj| 表格配置项| object | - | 是 |
| isCheckbox | 是否显示复选框 | boolean | false | 否 |
| isRadio | 是否显示单选框 | boolean | false | 否 |
| checkboxFixed | 是否固定选框，单选多选 | boolean | false | 否 |
| showIndex | 是否显示序号 | boolean | false | 否 |
| indexFixed | 是否固定序号 | boolean | false | 否 |
| isPage | 是否显示分页 | boolean | false | 否 |
| pageSizes | 每页条数可选值 | array | [10, 20, 50, 100] | 否 |
| getConfig | 获取表格配置项，在此处调用后端接口，返回Promise | function | - | 否 |
| saveOrUpdate | 保存或更新，在此处调用后端接口，返回Promise | function | - | 否 |
| maxButtonVisibleLength | 最多显示的按钮数量 | number | 3 | 否 |

#### optionObj
| 字段 | 说明 | 类型 | 默认值 | 是否必填 | 可选值 |
| -------- | -------- | -------- | -------- | -------- | -------- |
| dataList | 表格数据 | array | - | 是 | - |
| form | 表单配置项 | object | - | 否 | - |
| form.page | 页码 | number | 1 | 否 | - |
| form.pageSize | 每页条数 | number | 20 | 否 | - |
| dataProp | 表格数据字段 | array | - | 是 | - |
| dataProp.props | key | string | - | 是 | - |
| dataProp.label | 表头 | string | - | 是 | - |
| dataProp.visible | 是否显示 | boolean | true | 否 | - |
| dataProp.disabled | 禁止变更显示状态 | boolean | false | 否 | - |
| dataProp.width | 列宽 | number | - | 否 | - |
| dataProp.mask | 是否脱敏字段，会显示小眼睛，需搭配getValue使用 | boolean | false | 否 | - |
| dataProp.getValue | 获取脱敏字段值，同步方法，暂不支持异步返回结果 | function | - | 否 | - |
| type | 列类型 | string | - | 否 | operate: 按钮操作列 |
| buttons | 按钮配置项 | array | - | 否 | - |
| total | 总数 | number | - | 是 | - |

#### button
| 字段 | 说明 | 类型 | 默认值 | 是否必填 | 可选值 |
| -------- | -------- | -------- | -------- | -------- | -------- |
| name | 按钮名称 | string | - | 是 | - |
| click | 按钮点击事件 | function | - | 是 | - |
| type | 按钮类型 | string | - | 否 | 参考el-button |
| show | 是否显示 | function | true | 否 | - |
