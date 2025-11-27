<template>
  <el-dialog
    class="option-modal-wrapper"
    title="表格设置"
    :visible.sync="dialogVisible"
    width="800px"
    append-to-body
    @closed="onClosed"
    @opened="onOpened"
  >
    <span>基础设置</span>
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="表格内容折行" prop="autoWrap">
            <el-switch v-model="form.autoWrap" /><span>（开启后页面内容将换行显示完整）</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表格紧凑度" prop="layout">
            <el-radio-group v-model="form.layout">
              <el-radio
                v-for="item of LAYOUTS"
                :key="item.value"
                :label="item.value"
                name="layout"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="操作列固定" prop="isOperateFixed">
            <el-switch v-model="form.isOperateFixed" /><span>（开启后操作列在右边固定展示）</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <p>自定义显示列：下方表头字段会按照从左往右，从上往下的排序逻辑排布</p>
    <el-row>
      <el-col :span="10">
        <el-input
          v-model="colLabel"
          size="mini"
          clearable
          prefix-icon="el-icon-search"
          placeholder="搜索列名称"
        />
      </el-col>
      <el-col v-if="!colLabel" :span="10" :offset="4">
        <div class="m-multi-cols">
          <span>批量控制：</span>
          <el-checkbox v-model="checkAll" :indeterminate="isCheckIndeterminate" @change="handleCheckAllChange">全部显示</el-checkbox>
          <el-checkbox v-model="notCheckAll" :indeterminate="isNoCheckIndeterminate" @change="handlenotCheckAllChange">全部隐藏</el-checkbox>
        </div>
      </el-col>
    </el-row>
    <div class="m-cols">
      <el-checkbox-group v-model="checkedCols" @change="handleCheckedColsChange">
        <div ref="grid" class="grid-container">
          <div v-for="col in filteredCols" :key="col.props" class="grid-item">
            <svg class="icon u-move-icon" aria-hidden="true">
              <use xlink:href="#icon-leapmotor-design-move"></use>
            </svg><el-checkbox :key="col.props" :label="col.props" :disabled="col.disabled">{{ col.label }}</el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="submit">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Sortable from 'sortablejs'
import { LAYOUTS, COL_TYPE_OPERATE } from './constants'

export default {
  name: 'VxeTableOptionModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: null,
      LAYOUTS,
      colLabel: '',
      checkAll: false,
      notCheckAll: false,
      isCheckIndeterminate: true,
      isNoCheckIndeterminate: true,
      checkedCols: null,
      dialogVisible: false,
      COL_TYPE_OPERATE,
      isInit: false
    }
  },
  computed: {
    filteredCols () {
      return this.form.columnConfig.filter(item => {
        return item.type !== COL_TYPE_OPERATE && item.label.toLowerCase().indexOf(this.colLabel.toLowerCase()) !== -1
      })
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val

      if (!this.isInit && val) {
        this.init()
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.form = {
        autoWrap: this.config.autoWrap,
        layout: this.config.layout,
        columnConfig: this.config.columnConfig.map(item => {
          return {
            ...item
          }
        }),
        isOperateFixed: this.config.isOperateFixed
      }

      this.checkedCols = this.config.columnConfig.filter(item => item.visible).map(item => item.props)

      this.updateCheck()
    },
    initSortable () {
      const grid = this.$refs.grid
      new Sortable(grid, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt

          // 1. 获取当前可见列（参与排序的列）
          const visibleCols = [...this.filteredCols] // 复制避免响应式干扰

          // 2. 在可见列子集中调整顺序（关键修正）
          const movedItem = visibleCols.splice(oldIndex, 1)[0]
          visibleCols.splice(newIndex, 0, movedItem)

          // 3. 重建完整数组（核心修正）
          const newColumnConfig = []
          let visibleIndex = 0

          this.form.columnConfig.forEach(col => {
            // 参与排序的列：用排序后的可见列替换
            if (visibleCols.some(c => c.props === col.props)) {
              newColumnConfig.push(visibleCols[visibleIndex++])
            } else {
              // 隐藏列：保持原位置
              newColumnConfig.push(col)
            }
          })

          // 4. 更新数据
          this.form.columnConfig = newColumnConfig
          console.log('newColumnConfig', newColumnConfig)
        }
      })
    },
    submit () {
      this.$emit('submit', this.form)
    },
    cancel () {
      this.$emit('cancel')
    },
    onClosed () {
      this.init()
      this.$emit('cancel')
    },
    handleCheckedColsChange (values) {
      console.log('handleCheckedColsChange', values)
      for (let index = 0; index < this.form.columnConfig.length; index++) {
        const item = this.form.columnConfig[index]
        item.visible = values.includes(item.props)
      }

      this.updateCheck()
    },
    handleCheckAllChange (values) {
      console.log('handleCheckAllChange', values)
      this.checkedCols = []
      for (let index = 0; index < this.form.columnConfig.length; index++) {
        const item = this.form.columnConfig[index]
        item.visible = true
        this.checkedCols.push(item.props)
      }

      this.updateCheck()
    },
    handlenotCheckAllChange (values) {
      console.log('handlenotCheckAllChange', values)
      this.checkedCols = []
      for (let index = 0; index < this.form.columnConfig.length; index++) {
        const item = this.form.columnConfig[index]
        if (item.disabled) {
          item.visible = true
          this.checkedCols.push(item.props)
        } else {
          item.visible = false
        }
      }

      this.updateCheck()
    },
    onOpened () {
      this.initSortable()
    },
    updateCheck () {
      this.$nextTick(() => {
        const checkAll = this.form.columnConfig.every(item => item.disabled || item.visible)
        const notCheckAll = this.form.columnConfig.every(item => item.disabled || !item.visible)

        this.checkAll = checkAll
        this.notCheckAll = notCheckAll

        this.isCheckIndeterminate = !checkAll && !notCheckAll
        this.isNoCheckIndeterminate = !checkAll && !notCheckAll
      })
    }
  }
}
</script>

<style lang="scss">
.option-modal-wrapper {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(5, 18%);
    gap: 10px;
  }

  .grid-item {
    padding: 2px 5px;

    .el-checkbox {
      width: calc(100% - 20px);
    }

    .el-checkbox__label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 93%;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .sortable-ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  p {
    margin-top: 0;
  }

  .m-cols {
    padding-top: 10px;
  }

  .m-multi-cols {
    line-height: 28px;
  }

  .u-move-icon {
    width: 16px;
    height: 22px;
    display: inline-block;
    vertical-align: top;
    margin-right: 4px;
    cursor: move;
  }
}
</style>
