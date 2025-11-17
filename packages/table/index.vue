<template>
  <div class="m-vxe-table" style="min-height: 100px; height: 100%;">
    <div class="m-vxe-table-options">
      <el-button type="text" size="mini" @click="optionDialogVisible = true">
        <i class="el-icon-setting" />
        <span>表格设置</span>
      </el-button>
    </div>
    <div
      v-loading="optionLoading"
      :style="tableContainerStyle"
    >
      <vxe-table
        v-if="isFirstMixConfig"
        v-loading="loading"
        :id="tableCode"
        ref="tableRef"
        :show-header-overflow="false"
        :data="optionObj.dataList"
        :size="config.layout === LAYOUT_MIN.value ? 'mini' : 'medium'"
        :column-config="{ resizable: config.layout === LAYOUT_CUSTOM.value, autoOptions: { isCalcHeader: false, isCalcBody: true, isCalcFooter: true } }"
        :custom-config="customConfig"
        :virtual-y-config="{enabled: true, gt: 99, mode: 'wheel', oSize: 3}"
        :virtual-x-config="{enabled: !config.autoWrap, gt: 10}"
        :radio-config="{strict: false}"
        :row-class-name="rowClassName"
        :sort-config="{ remote: true, multiple: true }"
        max-height="100%"
        border="inner"
        stripe
        :row-config="{isHover: true}"
        @checkbox-change="selectChangeEvent"
        @checkbox-all="selectChangeEvent"
        @radio-change="radioChangeEvent"
        @sort-change="sortChangeEvent"
      >
        <vxe-column v-if="isCheckbox" :resizable="false" :fixed="checkboxFixed ? 'left' : ''" type="checkbox" width="40" />
        <vxe-column v-else-if="isRadio" :resizable="false" :fixed="checkboxFixed ? 'left' : ''" type="radio" width="40" />
        <vxe-column v-if="showIndex" :resizable="false" :fixed="indexFixed ? 'left' : ''" type="seq" min-width="50" width="auto" align="center" />
        <vxe-column
          v-for="item in list"
          :key="item.props"
          :field="item.props"
          :title="item.label"
          :width="item.type === COL_TYPE_OPERATE ? 'auto' : item.layoutWidth"
          :fixed="item.type === COL_TYPE_OPERATE ? (config.isOperateFixed ? 'right' : '') : item.fixed"
          :align="item.align || 'center'"
          :show-overflow="item.type !== COL_TYPE_OPERATE && !config.autoWrap"
          :sortable="item.sortable"
        >
          <template #default="{ row, rowIndex }">
            <template v-if="item.buttons">
              <div
                :set="row.tempData = {
                  visibleButtonLength: 0,
                  loopButtonIndex: 0
                }"
              >
                <template v-for="(button, buttonIndex) in item.buttons">
                  <span
                    v-if="row.cols[item.props].buttons[buttonIndex].show && (row.cols[item.props].showLength <= maxButtonVisibleLength || row.tempData.visibleButtonLength < (maxButtonVisibleLength - 1))"
                    type="text"
                    :key="buttonIndex"
                    :set="row.tempData = {
                      visibleButtonLength: row.tempData.visibleButtonLength + 1,
                      loopButtonIndex: buttonIndex
                    }"
                    :class="['u-lp-table-button', button.type ? `z-${button.type}`: '', {
                      'z-ellipsis': item.type !== COL_TYPE_OPERATE,
                      'z-disabled': row.cols[item.props].buttons[buttonIndex].disabled
                    }]"
                    @click="() => !(row.cols[item.props].buttons[buttonIndex].disabled) && button.click(rowIndex, row)"
                  >
                    {{ button.name || row[item.props] }}
                  </span>
                </template>
                <vxe-button
                  v-if="row.cols[item.props].showLength > maxButtonVisibleLength"
                  class="u-button-more"
                  mode="text"
                  content="更多"
                >
                  <template #dropdowns>
                    <template v-for="(button, buttonIndex) in item.buttons.slice(row.tempData.loopButtonIndex + 1)">
                      <div
                        v-if="row.cols[item.props].buttons[row.tempData.loopButtonIndex + 1 + buttonIndex].show"
                        :key="`more${buttonIndex}`"
                        :class="['u-lp-table-button', button.type ? `z-${button.type}`: '', {
                          'z-ellipsis': item.type !== COL_TYPE_OPERATE,
                          'z-disabled': row.cols[item.props].buttons[row.tempData.loopButtonIndex + 1 + buttonIndex].disabled
                        }]"
                        @click="() => !(row.cols[item.props].buttons[row.tempData.loopButtonIndex + 1 + buttonIndex].disabled) && button.click(rowIndex, row)"
                      >
                        {{ button.name || row[item.props] }}
                      </div>
                    </template>
                  </template>
                </vxe-button>
              </div>
            </template>
            <template v-else-if="item[COL_PARAMS_MASK]">
              <span>{{ row[item.props].masked ? row[item.props].value : row[item.props].fullValue }}</span>
              <svg class="icon u-mask-icon" aria-hidden="true" @click="doMaskCol(row, item.props)">
                <use v-if="row[item.props].masked" xlink:href="#icon-leapmotor-design-eye-open"></use>
                <use v-else xlink:href="#icon-leapmotor-design-eye-close"></use>
              </svg>
            </template>
            <span v-else>
              {{ row[item.props] }}
            </span>
          </template>
        </vxe-column>
        <template #empty>
          <div class="m-vxe-table-empty">
            <img :src="require('./empty.png')" />
            <p>暂无数据</p>
          </div>
        </template>
      </vxe-table>
      <el-pagination
        v-if="isPage"
        style="float: right; padding-top: 16px;"
        :current-page.sync="currentPage"
        :page-size="optionObj.form.size"
        layout="sizes, total, prev, pager, next, jumper"
        :page-sizes="pageSizes"
        :total="optionObj.total"
        @size-change="handleSizeChange"
        @current-change="pageChange"
      />
    </div>
    <option-modal
      :visible="optionDialogVisible"
      :config="config"
      :loading="optionLoading"
      @submit="handleOptionSubmit"
      @cancel="handleOptionCancel"
    />
  </div>
</template>

<script>
import OptionModal from './optionModal'
import { LAYOUT_MIN, LAYOUT_DEFAULT, LAYOUT_CUSTOM, DEFAULT_CONFIG, COL_TYPE_OPERATE, COL_PARAMS_MASK } from './constants'
import { deepClone } from '../utils/index'

export default {
  components: {
    OptionModal
  },
  props: {
    optionObj: {
      type: Object,
      default: () => {}
    },
    isCheckbox: {
      type: Boolean,
      default: false
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    checkboxFixed: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    indexFixed: {
      type: Boolean,
      default: false
    },
    isPage: {
      type: Boolean,
      default: false
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    },
    rowClassName: {
      type: [String, Function],
      default: null
    },
    getConfig: {
      type: Function,
      default: () => {}
    },
    saveOrUpdate: {
      type: Function,
      default: () => {}
    },
    maxButtonVisibleLength: {
      type: Number,
      default: 3
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      optionDialogVisible: false,
      config: deepClone(DEFAULT_CONFIG),
      resizableData: {},
      optionLoading: true,
      saveLoading: false,
      LAYOUT_MIN,
      LAYOUT_CUSTOM,
      customConfig: {
        storage: true,
        updateStore: ({ storeData }) => {
          // 模拟异步，实现服务端保存
          this.updateStorageData(storeData.resizableData, this.config)
        }
      },
      COL_TYPE_OPERATE,
      COL_PARAMS_MASK,
      tableCode: this.optionObj.id,
      isConfigReady: false,
      isFirstMixConfig: false,
      currentPage: this.optionObj?.form?.page || 1
    }
  },
  computed: {
    tableContainerStyle () {
      return {
        height: this.isPage ? 'calc(100% - 50px)' : '100%'
      }
    },
    list () {
      return this.optionObj.dataProp.filter((_, index) => {
        const col = this.config.columnConfig[index]
        return col.type === COL_TYPE_OPERATE || col.visible
      }).map(col => {
        if (this.config.layout === LAYOUT_MIN.value) {
          col.layoutWidth = 72
        } else if (this.config.layout === LAYOUT_DEFAULT.value) {
          col.layoutWidth = 100
        } else {
          if (this.resizableData && this.resizableData[col.props]) {
            col.layoutWidth = this.resizableData[col.props]
          } else {
            col.layoutWidth = col.width || 'auto'
          }
        }

        return col
      })
    }
  },
  watch: {
    'optionObj.dataList': {
      handler (val) {
        if (this.isConfigReady && val.length !== 0) {
          this.mixConfig(val)
        }
      }
    },
    'optionObj.form.page': {
      handler (val) {
        this.currentPage = val
      }
    },
  },
  created () {
    this.getStorageData()
  },
  methods: {
    handleSizeChange (e) {
      this.$emit('paginationChange', 'size', e)
    },
    pageChange (e) {
      this.$emit('paginationChange', 'page', e)
    },
    selectChangeEvent () {
      this.$emit('handleSelect', this.$refs.tableRef.getCheckboxRecords())
    },
    radioChangeEvent () {
      this.$emit('handleSelect', this.$refs.tableRef.getRadioRecord())
    },
    sortChangeEvent ({ sortList }) {
      // console.log('sortList', sortList)
      this.$emit('sortChange', sortList)
    },
    handleOptionSubmit (config) {
      this.optionLoading = true
      this.saveLoading = true
      Object.assign(this.config, config)

      this.updateStorageData({}, this.config)
        .then(() => {
          this.sortArray(this.optionObj.dataProp, config.columnConfig)
          this.optionDialogVisible = false
        })
        .catch(() => {
          this.$message.error('保存失败')
        })
        .finally(() => {
          this.optionLoading = false
          this.saveLoading = false
        })
    },
    handleOptionCancel () {
      this.optionDialogVisible = false
    },
    getStorageData () {
      this.optionLoading = true

      return this.getConfig({ tableCode: this.tableCode }).then(res => {
        // const data = JSON.parse(localStorage.getItem(`table_${this.tableCode}`)) || { tableCode: this.tableCode, config: { }}
        const data = res.data || {}
        Object.assign(this.config, data.config)
        Object.assign(this.resizableData, data.resizableData)

        // 清除远端中存在但被前端代码已经删除掉的key
        this.config.columnConfig = this.config.columnConfig.filter(column => this.optionObj.dataProp.findIndex(data => data.props === column.props) !== -1)

        if (this.optionObj.dataProp.length !== this.config.columnConfig.length) {
          // 如果表格字段更新过，需要更新最新的代码配置
          // 筛选出远程中不存在的字段
          const dataProp = this.optionObj.dataProp.filter(data => this.config.columnConfig.findIndex(column => data.props === column.props) === -1)

          this.config.columnConfig = [...this.config.columnConfig, ...dataProp.map(item => {
            const configItem = this.config.columnConfig.find(el => el.props === item.props)
            if (configItem) {
              if (item.disabled) {
                configItem.visible = item.visible
                configItem.disabled = item.disabled
              }
              return configItem
            } else {
              return item
            }
          })]

          console.log(this.config.columnConfig)
        }

        this.sortArray(this.optionObj.dataProp, this.config.columnConfig)
        // 排序完之后，还要更新配置项
        this.config.columnConfig.forEach((configItem, index) => {
          const item = this.optionObj.dataProp[index]
          if (item.disabled) {
            configItem.visible = item.visible
            configItem.disabled = item.disabled
          }
        })

        if (!this.isFirstMixConfig /* && this.optionObj.dataList?.length !== 0 */) {
          this.mixConfig(this.optionObj.dataList)
        }

        this.isConfigReady = true
        this.optionLoading = false
      })

      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     const data = JSON.parse(localStorage.getItem(`table_${this.tableCode}`)) || { tableCode: this.tableCode, config: { }}
      //     Object.assign(this.config, data.config)

      //     if (this.optionObj.dataProp.length !== this.config.columnConfig.length) {
      //       // 如果表格字段更新过，需要更新最新的代码配置，清空老的内容
      //       this.config.columnConfig = this.optionObj.dataProp.map(item => {
      //         const configItem = this.config.columnConfig.find(el => el.props === item.props)
      //         if (configItem) {
      //           if (item.disabled) {
      //             configItem.visible = item.visible
      //             configItem.disabled = item.disabled
      //           }
      //           return configItem
      //         } else {
      //           return item
      //         }
      //       })
      //     } else {
      //       this.sortArray(this.optionObj.dataProp, this.config.columnConfig)
      //       // 排序完之后，还要更新配置项
      //       this.config.columnConfig.forEach((configItem, index) => {
      //         const item = this.optionObj.dataProp[index]
      //         if (item.disabled) {
      //           configItem.visible = item.visible
      //           configItem.disabled = item.disabled
      //         }
      //       })
      //     }

      //     this.optionLoading = false
      //     resolve()
      //   }, 0)
      // })
    },
    updateStorageData (resizableData, config) {
      Object.assign(this.config, config)
      Object.assign(this.resizableData, resizableData)

      // localStorage.setItem(`table_${this.optionObj.id}`, JSON.stringify({
      //   resizableData: this.resizableData,
      //   config: this.config
      // }))
      return this.saveOrUpdate({
        tableCode: this.tableCode,
        resizableData: this.resizableData,
        config: this.config
      })
    },
    sortArray (a, b) {
    // 创建一个以 id 为键的对象映射
      const map = new Map()
      b.forEach((item, index) => {
        map.set(item.props, index)
      })

      // 根据数组 b 的顺序对数组 a 进行排序
      return a.sort((itemA, itemB) => {
        const indexA = map.get(itemA.props)
        const indexB = map.get(itemB.props)

        if (indexA !== undefined && indexB !== undefined) {
          return indexA - indexB
        } else if (indexA) {
          return -1 // 如果 a 中的元素在 b 中存在，则排在前面
        } else if (indexB) {
          return 1 // 如果 b 中的元素在 a 中存在，则排在后面
        } else {
          return 0 // 如果两者都不在 b 中，则保持原顺序
        }
      })
    },
    handleCommand ({ rowIndex, row, button }) {
      button.click(rowIndex, row)
    },
    mixConfig (list) {
      this.isFirstMixConfig = true
      // 避免虚拟滚动时重复执行方法带来消耗
      list.forEach(item => {
        item.cols = {}

        this.optionObj.dataProp.forEach(prop => {
          let buttons
          // 拼接按钮
          if (prop.buttons) {
            let showLength = 0
            buttons = prop.buttons.map(button => {
              const temp = {}
              if (button.show) {
                temp.show = !button.show || button.show(item)
              } else {
                temp.show = true
              }

              temp.show && showLength++

              if (button.disabled) {
                temp.disabled = typeof button.disabled === 'function' && button.disabled(item)
              } else {
                temp.disabled = false
              }

              return temp
            })

            item.cols[prop.props] = {
              buttons,
              showLength
            }
          } else if (prop[COL_PARAMS_MASK]) {
            item[prop.props] = {
              value: item[prop.props],
              masked: true
            }
          }
        })
      })

      // console.log(list)
    },
    getVisibleCols () {
      return this.config.columnConfig.filter(item => item.visible).reduce((acc, item) => {
        acc.set(item.props, item.label)
        return acc
      }, new Map())
    },
    doMaskCol (row, colKey) {
      if (!row[colKey].masked) {
        row[colKey].masked = true
        return
      }

      const cloneRow = deepClone(row)
      cloneRow[colKey] = row[colKey].value
      row[colKey].fullValue = this.optionObj.dataProp.find(item => item.props === colKey).getValue(cloneRow)
      row[colKey].masked = false
    }
  }
}
</script>

<style lang="scss">
.m-vxe-table {
  position: relative;
  &-empty {
    padding: 20px 0;
    color: #9D9F9D;
  }
  .u-mask-icon {
    vertical-align: text-top;
    font-size: 20px;
    margin-left: 10px;
    cursor: pointer;
  }

  .u-lp-table-button {
    margin-right: 8px;
    cursor: pointer;
    box-sizing: border-box;

    &.z-ellipsis {
      display: inline;
    }

    &:last-child {
      margin-right: 0;
    }

    &.z-primary {
      color: #009100;

      &:hover {
        color: rgba($color: #009100, $alpha: 0.8);
      }
    }

    &.z-success {
      color: #009100;

      &:hover {
        color: rgba($color: #009100, $alpha: 0.8);
      }
    }

    &.z-warning {
      color: #C8A12B;

      &:hover {
        color: rgba($color: #C8A12B, $alpha: 0.8);
      }
    }

    &.z-danger {
      color: #B91919;

      &:hover {
        color: rgba($color: #B91919, $alpha: 0.8);
      }
    }

    &.z-info {
      color: #4C4CD6;

      &:hover {
        color: rgba($color: #4C4CD6, $alpha: 0.8);
      }
    }

    &.z-disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  .m-vxe-table-options {
    position: absolute;
    right: 0;
    top: -36px;
  }

  .u-button-more {
    vertical-align: bottom;
    height: 22px;

    .vxe-button.type--text {
      padding: 0;
      vertical-align: baseline;

      span {
        line-height: 22px;
        height: 22px;
      }
    }
  }

  .size--mini {
    .vxe-button--dropdown-arrow {
      font-size: 10px;
    }
  }
}

.u-lp-table-button {
  margin-right: 8px;
  cursor: pointer;
  box-sizing: border-box;
  display: inline-block;

  &.z-ellipsis {
    display: inline;
  }

  &:last-child {
    margin-right: 0;
  }

  &.z-primary {
    color: #009100;

    &:hover {
      color: rgba($color: #009100, $alpha: 0.8);
    }
  }

  &.z-success {
    color: #009100;

    &:hover {
      color: rgba($color: #009100, $alpha: 0.8);
    }
  }

  &.z-warning {
    color: #C8A12B;

    &:hover {
      color: rgba($color: #C8A12B, $alpha: 0.8);
    }
  }

  &.z-danger {
    color: #B91919;

    &:hover {
      color: rgba($color: #B91919, $alpha: 0.8);
    }
  }

  &.z-info {
    color: #4C4CD6;

    &:hover {
      color: rgba($color: #4C4CD6, $alpha: 0.8);
    }
  }

  &.z-disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.vxe-button--dropdown-panel .u-lp-table-button {
  display: block;
  margin-right: 0;
  line-height: 28px;
  padding: 0 16px;
  font-size: 14px;
  // margin-bottom: 2px;

  &:hover {
    background-color: #f5f5f5;
  }
}

/* 在全局样式中添加 */
.vxe-table--render-wrapper {
  transform: translateZ(0);
  will-change: transform;
}

.vxe-table--body-wrapper {
  transform: translateZ(0);
}
</style>

<!-- 原功能待补充评估
1. handlerowClick行点击事件，如有使用，需要补充该逻辑;
2. 限制选中条数
3. button使用function？
-->
