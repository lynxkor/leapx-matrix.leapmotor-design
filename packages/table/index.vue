<template>
  <div class="m-vxe-table" style="min-height: 100px; height: 100%;">
    <div class="m-vxe-table-options">
      <el-button class="m-vxe-table-options-btn" size="small" @click="handleCentralizedClick" v-if="centralized">
        <i class="iconfont" :class="{'icon-lxppc-tablelayout': !isCentralizedView, 'icon-lxppc-centerlayout': isCentralizedView}"/>
      </el-button>
      <el-button class="m-vxe-table-options-btn" size="small" @click="optionDialogVisible = true" v-if="showTableSetting">
        <i class="iconfont icon-lxppc-settings" />
      </el-button>
    </div>
    <div
      :style="tableContainerStyle"
      v-if="!isCentralizedView"
    >
      <vxe-table
        v-if="isFirstMixConfig && !optionLoading"
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
        :cell-config="{height: 44}"
        :row-class-name="rowClassName"
        :sort-config="{ remote: true, multiple: true }"
        max-height="100%"
        min-height="0"
        border="inner"
        stripe
        :row-config="{isHover: true}"
        @checkbox-change="selectChangeEvent"
        @checkbox-all="selectChangeEvent"
        @radio-change="radioChangeEvent"
        @sort-change="sortChangeEvent"
        @resizable-change="onColumnResize"
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
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :show-overflow="item.type !== COL_TYPE_OPERATE && !config.autoWrap"
          :sortable="item.sortable"
          :resizable="item.type !== COL_TYPE_OPERATE"
        >
          <template #default="{ row, rowIndex }">
            <template v-if="item.buttons">
              <span
                :set="row.tempData = {
                  visibleButtonLength: 0,
                  loopButtonIndex: 0
                }"
                :class="{'u-lp-table-operation': item.type === COL_TYPE_OPERATE}"
              >
                <template v-for="(button, buttonIndex) in item.buttons">
                  <el-popconfirm
                    :key="button.name"
                    v-if="button.popconfirmTitle && row.cols[item.props].buttons[buttonIndex].show && (row.cols[item.props].showLength <= maxButtonVisibleLength || row.tempData.visibleButtonLength < (maxButtonVisibleLength - 1))"
                    :title="button.popconfirmTitle"
                    :disabled="row.cols[item.props].buttons[buttonIndex].disabled"
                    @confirm="() => !(row.cols[item.props].buttons[buttonIndex].disabled) && button.click(rowIndex, row)"
                  >
                    <span
                      slot="reference"
                      :class="['u-lp-table-button', button.type ? `z-${button.type}`: '', {
                        'z-ellipsis': item.type !== COL_TYPE_OPERATE,
                        'button-operation': item.type !== COL_TYPE_OPERATE,
                        'z-disabled': row.cols[item.props].buttons[buttonIndex].disabled
                      }]"
                    >
                      {{ button.name || row[item.props] }}
                    </span>
                  </el-popconfirm>
                  <span
                    v-else-if="row.cols[item.props].buttons[buttonIndex].show && (row.cols[item.props].showLength <= maxButtonVisibleLength || row.tempData.visibleButtonLength < (maxButtonVisibleLength - 1))"
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
              </span>
            </template>
            <template v-else-if="item[COL_PARAMS_MASK]">
              <span>{{ row[item.props].masked ? row[item.props].value : row[item.props].fullValue }}</span>
              <svg v-if="row[item.props].value" class="icon u-mask-icon" aria-hidden="true" @click="doMaskCol(row, item.props)">
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
        background
        layout="total, prev, pager, next, sizes, jumper"
        :page-sizes="pageSizes"
        :total="optionObj.total"
        @size-change="handleSizeChange"
        @current-change="pageChange"
      />
    </div>
    <div class="m-centralized-view" v-else>
      <div class="m-centralized-view-left">
        <template v-if="optionObj.dataList.length">
          <ul class="centralized-view-list">
            <li v-for="(item, index) in optionObj.dataList" :key="index" :class="centralizedSel.id === item.id ? 'active': ''" @click="centralizedListSelect(item)">
              <div class="list-title" :title="item[centralizedList[0].props]" v-if="centralizedList[0]">{{ item[centralizedList[0].props] }}</div>
              <div class="list-sub" :title="item[centralizedList[1].props]" v-if="centralizedList[1]">{{ item[centralizedList[1].props] }}</div>
              <div class="list-tip" :title="item[centralizedList[2].props]" v-if="centralizedList[2]">{{ item[centralizedList[2].props] }}</div>
            </li>
          </ul>
          <div class="centralized-view-paging">
            <i class="icon-lxppc-left iconfont" :class="{disabled: currentPage <= 1}" @click="pageChange(+currentPage - 1)"></i>
            <span>
              <input min="1" :max="totalPage" type="number" v-model="currentPage" @change="handleCustomPageChange" />
              <i class="paging-split">/</i>
              {{ totalPage }}
            </span>
            <i class="icon-lxppc-right iconfont" :class="{disabled: currentPage >= totalPage}" @click="pageChange(+currentPage + 1)"></i>
          </div>
        </template>
        <div class="centralized-view-empty" v-else>
          暂无数据
        </div>
      </div>
      <div class="m-centralized-view-right">
        <slot name="centralizedViewSlot" v-if="optionObj.dataList.length"></slot>
        <div class="centralized-view-empty" v-else>
          <img :src="require('./empty.png')" />
          <p>暂无数据</p>
        </div>
      </div>
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
import { deepClone, debounce } from '../utils/index'

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
    },
    showTableSetting: { // 是否展示表格设置按钮
      type: Boolean,
      default: true
    },
    centralized: { // 是否展示集中视图功能
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isCentralizedView: false, // 是否是集中视图
      centralizedSel: {},
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
      currentPage: this.optionObj?.form?.page || 1,
      lastColumnWidth: 'auto' // 最后一列动态宽度
    }
  },
  computed: {
    tableContainerStyle () {
      return {
        height: this.isPage ? 'calc(100% - 50px)' : '100%',
      }
    },
    list () {
      const visibleColumns = this.optionObj.dataProp.filter((_, index) => {
        const col = this.config.columnConfig[index] || {}
        return col.type === COL_TYPE_OPERATE || col.visible
      })

      // 找出除操作列外的最后一列
      const nonOperateColumns = visibleColumns.filter(item => item.type !== COL_TYPE_OPERATE)
      const lastNonOperateColumn = nonOperateColumns[nonOperateColumns.length - 1]

      return visibleColumns.map(col => {
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

        // 如果是除操作列外的最后一列，设置为动态宽度
        if (col === lastNonOperateColumn) {
          col.layoutWidth = this.lastColumnWidth
          col.minWidth = 100 // 设置最小宽度保证内容显示
        }

        return col
      })
    },
    centralizedList () {
      const res = this.list.filter(item => item.centralized)
      return res.length > 0 ? res.slice(0, 3) : this.list.slice(0, 3)
    },
    totalPage () {
      return Math.ceil(this.optionObj.total / this.optionObj.form.size)
    }
  },
  watch: {
    'optionObj.dataList': {
      handler (val) {
        if (this.isConfigReady && val.length !== 0) {
          this.mixConfig(val)
          this.centralizedSel = val[0]
          this.$emit('listSelect', val[0])
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
  mounted () {
    this.initTableWidthCalculation()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.debouncedCalculateLastColumnWidth)
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
    centralizedListSelect (row) {
      // console.log('sortList', sortList)
      this.centralizedSel = row
      this.$emit('listSelect', row)
    },
    handleCustomPageChange (e) {
      let v = e.target.value
      if (v > this.totalPage) {
        v = this.totalPage
      }
      if (v < 1) {
        v = 1
      }
      this.currentPage = v
      this.pageChange(v)
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
      return this.config.columnConfig.reduce((acc, item) => {
        if (item.visible && item.type !== COL_TYPE_OPERATE) {
          acc.set(item.props, item.label)
        }
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
      this.optionObj.dataProp.find(item => item.props === colKey).getValue(cloneRow).then(val => {
        row[colKey].fullValue = val
        row[colKey].masked = false
      })
    },
    // 初始化表格宽度计算
    initTableWidthCalculation () {
      this.$nextTick(() => {
        this.calculateLastColumnWidth()

        // 监听窗口大小变化
        window.addEventListener('resize', this.debouncedCalculateLastColumnWidth)

        // 监听表格数据变化
        this.$watch('optionObj.dataList', this.calculateLastColumnWidth, { deep: true })

        // 监听配置变化
        this.$watch('config', this.calculateLastColumnWidth, { deep: true })
      })
    },
    // 计算最后一列宽度
    calculateLastColumnWidth () {
      if (!this.$refs.tableRef || !this.isFirstMixConfig) return

      this.$nextTick(() => {
        const tableEl = this.$refs.tableRef.$el
        if (!tableEl) return

        const tableWidth = tableEl.offsetWidth
        if (!tableWidth) return

        // 计算除最后一列外的所有非操作列的总宽度
        const visibleColumns = this.list.filter(item => item.type !== COL_TYPE_OPERATE)
        if (visibleColumns.length <= 1) {
          this.lastColumnWidth = 'auto'
          return
        }

        const otherColumns = visibleColumns.slice(0, -1)

        let totalWidth = 0
        otherColumns.forEach(col => {
          if (col.layoutWidth && col.layoutWidth !== 'auto') {
            const width = parseInt(col.layoutWidth) || 100
            totalWidth += width
          } else {
            totalWidth += 100 // 默认宽度
          }
        })

        // 计算操作列宽度（如果有）
        const operateColumn = this.list.find(item => item.type === COL_TYPE_OPERATE)
        if (operateColumn) {
          totalWidth += 120 // 操作列默认宽度
        }

        // 计算剩余宽度，确保不小于最小宽度
        const remainingWidth = Math.max(tableWidth - totalWidth - 36, 200) // 减去边框等间距
        this.lastColumnWidth = `${remainingWidth}`
      })
    },
    // 列宽调整事件
    onColumnResize () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.calculateLastColumnWidth()
        }, 100)
      })
    },
    debouncedCalculateLastColumnWidth: debounce(function () {
      this.calculateLastColumnWidth()
    }, 300),
    handleCentralizedClick () {
      const nextValue = !this.isCentralizedView
      this.$emit('centralizedClick', nextValue)
      this.$emit('paginationChange', 'size', 20)
      this.$emit('paginationChange', 'page', 1)
      this.isCentralizedView = nextValue
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
  // .u-lp-table-operation {
  //   padding: 0px 8px;
  // }
  .u-lp-table-button {
    margin-right: 8px;
    cursor: pointer;
    box-sizing: border-box;

    &.z-ellipsis {
      display: inline;
      &:hover {
        text-decoration: underline;
      }
    }

    &:last-child {
      margin-right: 0;
    }

    &.z-primary {
      color: #009100;

      &:hover {
        color: #008200;
        text-decoration: underline;
      }
    }

    &.z-success {
      color: #009100;

      &:hover {
        color: #008200;
        text-decoration: underline;
      }
    }

    &.z-warning {
      color: #C8A12B;

      &:hover {
        color: #B49127;
        text-decoration: underline;
      }
    }

    &.z-danger {
      color: #B91919;

      &:hover {
        color: #A61616;
        text-decoration: underline;
      }
    }

    &.z-info {
      color: #4C4CD6;

      &:hover {
        color: #4444C0;
        text-decoration: underline;
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
    top: -45px;
    &-btn {
      padding: 6px 8px;
      font-size: 16px;
    }
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
      color: #008200;
      text-decoration: underline;
    }
  }

  &.z-success {
    color: #009100;

    &:hover {
      color: #008200;
      text-decoration: underline;
    }
  }

  &.z-warning {
    color: #C8A12B;

    &:hover {
      color: #B49127;
      text-decoration: underline;
    }
  }

  &.z-danger {
    color: #B91919;

    &:hover {
      color: #A61616;
      text-decoration: underline;
    }
  }

  &.z-info {
    color: #4C4CD6;

    &:hover {
      color: #4444C0;
      text-decoration: underline;
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

// 集中视图样式
.m-centralized-view {
  height: 100%;
  border-top: 1px solid #E6E6E5;
  display: flex;
  &-left {
    width: 220px;
    border-right: 1px solid #E6E6E5;
    padding: 12px 0px 12px 0;
    padding-bottom: 50px;
    position: relative;
    .centralized-view-paging{
      height: 48px;
      padding-right: 12px;
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #3B3E3B;
      input {
        width: 56px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #E6E6E5;
        text-align: center;
      }
      .iconfont {
        font-size: 16px;
        cursor: pointer;
        &.disabled{
          color: #CECFCE;
          cursor: not-allowed;
          pointer-events: none;
        }
      }
      .paging-split{
        margin: 0 8px;
      }
    }
    .centralized-view-empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #9D9F9D;
    }
    .centralized-view-list {
      overflow-y: auto;
      height: 100%;
      padding-right: 12px;
      &::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }
      &::-webkit-scrollbar-track {
        background: #fff;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background: #E6E6E5;
        border-radius: 10px;
        border: 2px solid #fff;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: #CECFCE;
      }
      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        &.active {
          background: #E6F4E6;
          .list-title,.list-sub,.list-tip {
            color: #009100;
          }
        }
        &>div{
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .list-title {
        font-size: 14px;
        color: #3B3E3B;
        line-height: 22px;
      }
      .list-sub{
        font-size: 12px;
        color: #3B3E3B;
        line-height: 20px;
      }
      .list-tip {
        font-size: 12px;
        line-height: 20px;
        color: #9D9F9D;
      }
    }
  }
  &-right {
    flex: 1;
    position: relative;
    overflow-y: auto;
    .centralized-view-empty{
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      text-align: center;
      font-size: 14px;
      color: #9D9F9D;
    }
  }
}
</style>

<!-- 原功能待补充评估
1. handlerowClick行点击事件，如有使用，需要补充该逻辑;
2. 限制选中条数
3. button使用function？
-->
