<template>
  <div id="app">
    <yhtable
      :name="tableName"
      :items="tableData"
      :columns="tableColumns"
      :filter-key="searchQuery"
      :options="scrollOptions"
    ></yhtable>
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
        {key: 'idx', sort: true, name: 'No', width: 50},
        {key: 'name', name: 'Name', width: 200, sort: true, textwrap: 'ellipsis'},
        {key: 'id', width: 100, sort: true, textwrap: 'ellipsis'},
        {key: 'email', sort: true},
        {key: 'cellphone', width: 150}
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
