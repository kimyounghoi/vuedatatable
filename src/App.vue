<template>
  <div id="app">
    <div style="width:100%">
    <yhtable
      :name="tableName"
      :items="tableData"
      :columns="tableColumns"
      :filter-key="searchQuery"
    ></yhtable>
    </div>
  </div>
</template>

<script>
import yhtable from './components/Yhtable'

export default {
  name: 'App',
  components: {
    yhtable
  },
  data () {
    return {
      tableName: 'test',
      searchQuery: '',
      tableColumns: [
        {key: 'idx', sort: true, name: 'No', width: 60},
        {key: 'name', name: 'Name', width: 100, sort: true, textwrap: 'ellipsis'},
        {key: 'id', width: 200, sort: true, textwrap: 'ellipsis'},
        {key: 'email', width: 200, sort: true},
        {key: 'cellphone', width: 400, align: 'c'}
      ],
      tableData: []
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      for (let i = 1; i <= 1000; i++) {
        this.tableData.push({idx: i, name: 'unknown' + i, id: 'unknofqerqwerqwerqerqwerqwrqwewn_' + i, email: 'unknown_' + i + '@gmail.com', cellphone: '0101234' + i})
      }
      /*
      axios.get('http://10.77.161.116/firstproject/api/userlist')
      .then(res => {
        console.log($.fn.jquery);
        this.gridData = res.data;
      }).catch(e => {
        console.error(e)
      })
      */
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
