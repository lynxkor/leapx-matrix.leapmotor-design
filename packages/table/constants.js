export const LAYOUT_MIN = { label: '最紧凑', value: 1 }
export const LAYOUT_DEFAULT = { label: '适中', value: 2 }
export const LAYOUT_CUSTOM = { label: '自定义', value: 3 }

export const LAYOUTS = [LAYOUT_MIN, LAYOUT_DEFAULT, LAYOUT_CUSTOM]

export const DEFAULT_CONFIG = {
  autoWrap: false,
  layout: LAYOUT_CUSTOM.value,
  columnConfig: [],
  isOperateFixed: true
}

export const COL_TYPE_OPERATE = 'operate'
