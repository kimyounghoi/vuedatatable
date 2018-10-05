<template>
  <div class="yhtable-wrap">
    <div id="yhtable-header-div" class="yhtable-header-div" style="overflow-x:hidden">
      <div>
      <table :id="name" class="yhtable">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key"
            @click="sortBy(column)"
            :style="[column.width ? {width:column.width + 'px'} : '']"
            :class="[{active: sortKey == column.key}, {'yhtable-th-sortable': column.sort},
            {'yhtable-content-align-c': column.align == 'c'},
            {'yhtable-content-align-l': column.align == 'l'},
            {'yhtable-content-align-r': column.align == 'r'},
            ]">
            {{ column.name || column.key }}
            <span v-if="column.sort" class="arrow" :class="sortOrders[column.key] > 0 ? 'asc' : 'dsc'">
            </span>
          </th>
          <!--
          <th class="yhtable-empty-th"></th>
        -->
        </tr>
      </thead>
      </table>
      </div>
    </div>
    <div v-slimscroll="vscrollOptions" id="yhtable-body-div" style="height:400px; overflowX:scroll" class="yhtable-body-div" @scroll.self="handlerScroll()">
      <!--
    <div id="yhtable-body-div" style="height:400px; overflowY:scroll" class="yhtable-body-div" @scroll.self="handlerScroll()">
  -->
      <div>
        <div :style="topBufferStyle"></div>
        <div>
          <table class="yhtable">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key"
                :style="[column.width ? {width:column.width + 'px'} : '']">
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in activeItems" :key="entry.idx" :class="{'yhtable-row-even': index % 2, 'yhtable-row-odd': !(index % 2)}">
              <td v-for="column in columns" :key="column.key">
                <div :style="[column.width ? {width:column.width + 'px'} : '']"
                     :class="[column.textwrap == 'linebreak' ? 'yhtable-content-wrap' : 'yhtable-content-ellipsis']">
                     {{entry[column.key]}}
                </div>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
        <div :style="bottomBufferStyle"></div>
      </div>
    </div>
</div>
</template>

<script>
import jQuery from 'jquery'

export default {
  name: 'yhtable',
  props: {
    name: String,
    items: Array,
    columns: Array,
    filterKey: String,
    blockFactor: {
      type: Number,
      default: 0.5
    }
  },
  data () {
    const sortOrders = {}
    this.columns.forEach(c => {
      sortOrders[c.key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      activeItems: [],
      sortedItems: [],
      scrollTimeout: null,
      topBufferStyle: {
        height: 0
      },
      bottomBufferStyle: {
        height: 0
      },
      preStart: 0,
      preEnd: 0,
      bodyDiv: null,
      vscrollOptions: {
        height: 400,
        size: '3px',
        color: 'black',
        alwaysVisible: true,
        railVisible: true,
        railColor: '#FFF',
        wheelStep: 1,
        axis: 'both'
      }
    }
  },
  mounted: function () {
    this.bodyDiv = document.getElementById('yhtable-body-div')

    jQuery('#yhtable-body-div').addClass('yhtable-scroll')

    const headerDiv = document.getElementById('yhtable-header-div')
    this.computeDisplayItems()
    jQuery(this.bodyDiv).on('scroll', function () {
      jQuery(headerDiv).scrollLeft(jQuery(this).scrollLeft())
    })
  },
  computed: {
    filteredData () {
      const sortKey = this.sortKey
      const filterKey = this.filterKey && this.filterKey.toLowerCase()
      const order = this.sortOrders[sortKey] || 1
      let data = this.items
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(c => {
            return String(row[c.key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    },
    blockSize () {
      return this.vscrollOptions.height * this.blockFactor
    },
    preloadSize () {
      return this.vscrollOptions.height
    },
    totalScrollableHeight () {
      return this.items.length * 20
    }
  },
  watch: {
    items () {
      this.computeDisplayItems()
    },
    containerHeight () {
      this.computeDisplayItems()
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (column) {
      if (column.sort) {
        this.sortKey = column.key
        this.sortOrders[column.key] = this.sortOrders[column.key] * -1
        const sortKey = this.sortKey
        const filterKey = this.filterKey && this.filterKey.toLowerCase()
        const order = this.sortOrders[sortKey] || 1
        let data = this.items
        if (filterKey) {
          data = data.filter(function (row) {
            return Object.keys(row).some(c => {
              return String(row[c.key]).toLowerCase().indexOf(filterKey) > -1
            })
          })
        }
        if (sortKey) {
          data = data.slice().sort(function (a, b) {
            a = a[sortKey]
            b = b[sortKey]
            return (a === b ? 0 : a > b ? 1 : -1) * order
          })
          this.sortedItems = data
        }
      }
      this.computeDisplayItems()
    },
    handlerScroll () {
      this.computeDisplayItems()
    },
    computeDisplayItems () {
      const scrollTop = this.bodyDiv.scrollTop || 0
      const blockNumber = this.blockSize === 0 ? 0 : Math.floor(scrollTop / this.blockSize)
      const blockStart = this.blockSize * blockNumber
      const blockEnd = blockStart + this.blockSize
      const apertureTop = Math.max(0, blockStart - this.preloadSize)
      const apertureBottom = Math.min(this.totalScrollableHeight, blockEnd + this.preloadSize)
      const displayIndexStart = Math.floor(apertureTop / 20)
      const nonZeroIndex = Math.ceil(apertureBottom / 20)
      const displayIndexEnd = nonZeroIndex > 0 ? nonZeroIndex - 1 : nonZeroIndex

      if ((displayIndexStart === this.preStart && displayIndexEnd === this.preEnd) && !this.sortKey) {
        return
      }

      this.preStart = displayIndexStart
      this.preEnd = displayIndexEnd
      if (this.sortKey) {
        this.activeItems = this.sortedItems.slice(displayIndexStart, displayIndexEnd + 1)
      } else {
        this.activeItems = this.items.slice(displayIndexStart, displayIndexEnd + 1)
      }
      this.topBufferStyle.height = displayIndexStart * 20 + 'px'
      this.bottomBufferStyle.height = Math.max(0, (this.items.length - displayIndexEnd - 1) * 20) + 'px'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.yhtable-wrap {
  border-bottom: 1px solid #cbcbcb;
}
table {
  width: 100%;
  display: table;
  border: 1px solid #cbcbcb;
}

th {-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}

.yhtable th, td {
  height: 20px;
}
.yhtable-body-div table th {
  border-width: 0px;
  margin: 0;
  padding: 0px;
  height: 0px;
}

.yhtable-body-div table {
  border-top: 0px !important;
}

th.active {
  color: #000;
}

th.active .arrow {
  opacity: 1;
}

.yhtable {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

.yhtable thead {
  background-color: #e0e0e0;
  color: #57606f;
  vertical-align: bottom;
}
.yhtable tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
.yhtable td:first-child, yhtable th:first-child {
  border-left-width: 0;
}
.yhtable td, .yhtable th {
  border-width: 0 0 0 1px;
  margin: 0;
  /*padding: .5em .5em;*/
}
.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.36;
}
.yhtable-th-sortable {
  cursor: pointer;
}
.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #2f3542;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #2f3542;
}
.yhtable-content-ellipsis {
  text-overflow: ellipsis; overflow:hidden;white-space: nowrap;
}
.yhtable-content-wrap {
  word-wrap: break-word;
}
.yhtable-row-odd {
  background: #fff;
}
.yhtable-row-even {
  background: #f5f6fa;
}
.yhtable-empty-th {
  width: 15px;
  border-left:0px !important;
}
.yhtable-content-align-l {
  text-align: left;
}
.yhtable-content-align-r {
  text-align: right;
}
.yhtable-content-align-c {
  text-align: center;
}
.yhtable-scroll {
  overflow-y: hidden !important;
  overflow-x: auto !important;
}
</style>
