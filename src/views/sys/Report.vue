<template>
  <div>
    <div style="margin-top: 2rem;">
      <el-button type="primary" icon="el-icon-search" style="margin-bottom: 2rem;" @click="getAllList()">查询所有人员</el-button>
      <el-button type="primary" icon="el-icon-search" style="margin-bottom: 2rem;" @click="getList()">筛选心理健康程度较差的</el-button>
      <el-button @click="exportExcel" type="primary">导出</el-button>

    </div>
    <div>
      <el-table :data="tableData" border stripe style="width: 100%;margin: auto;" ref="report-table">
        <el-table-column
          type="index"
          width="40">
        </el-table-column>
        <el-table-column 
          prop="refnm1" 
          label="姓名" 
          width="70">
        </el-table-column>
        <el-table-column prop="result2" label="心理健康程度" width="90">
        </el-table-column>
        <el-table-column prop="createTime"   sortable label="问卷填写时间" width="180">
        </el-table-column>
        <el-table-column prop="refnm2" label="性别" width="120">
        </el-table-column>
        <el-table-column prop="refnm3" label="年龄段" width="150">
        </el-table-column>
        <el-table-column prop="refnm4" label="学历" width="150">
        </el-table-column>
        <el-table-column prop="result1" label="性格取向" width="180">
        </el-table-column>
        <el-table-column prop="result3" label="职业兴趣（实际型）" width="180">
        </el-table-column>
        <el-table-column prop="result4" label="职业兴趣（艺术型）" width="180">
        </el-table-column>
        <el-table-column prop="result5" label="职业兴趣（社会型）" width="180">
        </el-table-column>
        <el-table-column prop="result6" label="职业兴趣（传统型）" width="180">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import reportApi from '@/api/reportApi.js'
import sickApi from '@/api/sickApi.js'
import FileSaver from "file-saver";
import * as XLSX from 'xlsx'

export default {
  name: 'Report',

  data() {
      return {
        tableData: []
      }
    },
    created() {
      this.getAllList()
      // axios.get('https://tduck-api-new.foxconnedu.com/evaluate/get/sick').then(res=>{
      //     console.log(res,'res')
      //   })
      // https://ques-api.foxconnedu.com/evaluate/get/sic
      // evaluate/get/a7378a8b499b4fbc923334bb0683c518
    },
    methods: {
      //获取数据
      getAllList() {
        reportApi.getAllList().then(res => {
          console.log(res, 'res')
          this.tableData = res.data
          console.log(this.tableData, 'tableData')
        })
      },
      getList(){
        sickApi.getList().then(res => {
          console.log(res, 'res')
          this.tableData = res.data.data
          console.log(this.tableData, 'table1')
        })
      },
      exportExcel(excelName) {
        //excelName --设置导出的excel名称
        //report-table --对应的要导出的el-table的ref名称
        try {
          const $e = this.$refs['report-table'].$el;
          // 如果表格加了fixed属性，则导出的文件会生产两份一样的数据，所以可在这里判断一下
          let $table = $e.querySelector('.el-table__fixed');
          if (!$table) {
            $table = $e;
          }
          // 为了返回单元格原始字符串，设置{ raw: true }
          const wb = XLSX.utils.table_to_book($table, { raw: true });
          const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
          FileSaver.saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            `${excelName}.xlsx`,
          );
        } catch (e) {
          if (typeof console !== 'undefined') console.error(e);
        }
      },
    },
};
</script>

<style lang="scss" scoped>

</style>