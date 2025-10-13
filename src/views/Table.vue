<template>
  <div class="m-table">
    <vxe-table
      ref="tableRef"
      v-loading="loading"
      is-checkbox
      show-index
      is-page
      :option-obj="optionObj"
      :get-config="getConfig"
      :save-or-update="saveOrUpdate"
      @paginationChange="paginationChange"
      @handleSelect="handleSelectionChange"
    />
  </div>
</template>

<script>
import VxeTable from '../../packages/table/index.vue'

const size = 500
const mockConfig = {
  data: null
}

export default {
  name: 'ViewsVxeTable',
  components: { VxeTable },
  data () {
    return {
      loading: false,
      optionObj: {
        id: 'DemoTable',
        dataList: [],
        form: {
          page: 1,
          size
        },
        dataProp: [
          { props: 'id', label: 'ID', width: 300, visible: true },
          { props: 'name', label: 'Name', visible: true, mask: true, getValue: row => row.fullName },
          ...Array.from(Array(40), (_, i) => {
            return {
              props: `test${i}`,
              label: `test${i}`,
              visible: true
            }
          }),
          {
            props: 'operate',
            label: 'Operate',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: () => {
                alert('编辑')
              },
              type: 'primary',
              show: row => {
                return row.id < 400
              }
            }, {
              name: '详情',
              click: () => {
                alert('详情')
              },
              show: row => {
                return row.id === 1
              }
            }, {
              name: '删除',
              type: 'danger',
              click: () => {
                alert('删除')
              },
              show: row => {
                return row.id === 2
              }
            }, {
              name: '测试一',
              click: () => {
                alert('测试一')
              },
              type: 'primary',
              show: row => {
                return row.id < 400
              }
            }, {
              name: '测试二',
              click: () => {
                alert('测试二')
              },
              type: 'primary',
              show: row => {
                return row.id < 200
              }
            }, {
              name: '测试三',
              click: () => {
                alert('测试三')
              },
              type: 'primary',
              show: row => {
                return row.id < 400
              }
            }]
          }
        ],
        total: 0
      },
      queryParams: {
        pageNum: 1,
        size
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    paginationChange (page, num) {
      this.queryParams.pageNum = page
      this.queryParams.size = num
      this.getData()
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      console.log(selection)
    },
    getData () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.optionObj.dataList = [
          {
            id: 1,
            name: '张**',
            fullName: '张三',
            ...Array.from(Array(40), (_, i) => i)
              .reduce((acc, num) => {
                acc[`test${num}`] = `测试${num}`
                return acc
              }, {})
          },
          {
            id: 2,
            name: '李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四',
            ...Array.from(Array(40), (_, i) => i)
              .reduce((acc, num) => {
                acc[`test${num}`] = `测试${num}`
                return acc
              }, {})
          },
          {
            id: 3,
            name: '王五',
            ...Array.from(Array(40), (_, i) => i)
              .reduce((acc, num) => {
                acc[`test${num}`] = `测试${num}`
                return acc
              }, {})
          },
          ...Array.from(Array(497), (_, i) => {
            return {
              id: i + 4,
              name: '姓名' + i,
              ...Array.from(Array(40), (_, i) => i)
                .reduce((acc, num) => {
                  acc[`test${num}`] = `测试${num}`
                  return acc
                }, {})
            }
          }),
        ]
        this.optionObj.total = 500
      })
    },
    getConfig () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(mockConfig)
        }, 300)
      })
    },
    saveOrUpdate (data) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          mockConfig.data = data
          resolve()
        }, 300)
      })
    }
  }
}
</script>

<style lang="scss">
.m-table {
  height: 500px;
}
</style>
