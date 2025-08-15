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

const size = 20
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
          { props: 'name', label: 'Name', visible: true },
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
              type: 'primary'
            }, {
              name: '详情',
              click: () => {
                alert('详情')
              },
              show: row => {
                return row.id === 1
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
            name: '张三'
          },
          {
            id: '22222222222222222222222222222222222222222222222',
            name: '李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四'
          }
        ]
        this.optionObj.total = 2
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
