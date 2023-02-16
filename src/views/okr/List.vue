<template>
  <div style="background-color: white;width: 90%;margin: 10px auto ;" >
    <!-- ref="homePage" -->
    <el-row type="flex" justify="space-around" :gutter="30">
      <!-- left -->
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <el-card class="box-card" style="height: 400px;">
            <div slot="header" class="clearfix">
              <span style="font-size: 1rem;font-weight: bold;">TEAM</span>
            </div>
            <div style="width: 100px;margin: 30px auto;">
              <el-avatar src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" :size="50"
                style="width: 100px;height: 100px;"></el-avatar>
            </div>
            <div style="text-align: center;">
              <span style="font-size: 1.2rem;">{{dept}}</span>
            </div>
          </el-card>
        </div>
      </el-col>
      <!-- center -->
      <el-col :span="19">
        <div class="grid-content bg-purple-light" v-loading='OKRloading'>
          <!-- 测试写一下for循环 -->
          <el-card v-for="(okr,index) in okrAll" class="box-card" style="margin-top: 15px;" :key='index'>
            <div slot="header" class="clearfix">
              <span style="font-weight: bold;font-size:medium;">OKR {{okr.ordernum}}</span> <br>
              <span>
                <p style="font-size:medium;">{{okr.name}}</p>
              </span>

              <el-progress :text-inside="true" :stroke-width="26" :percentage="okr.complete"></el-progress>
            </div>
            <div class="text item" style="padding: 10px;">
              <el-collapse v-model="actives">
                <el-collapse-item v-for="(list,index) in okr.children" :name="index" :key="index">
                  <template slot="title">
                    <p style="font-size:0.9rem">KR{{list.ordernum}} : {{list.name}}</p>
                  </template>
                  <!-- <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteTab(index)" style="float: right;"></el-button> -->
                  <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="edit(list.id)"
                    style="float: right;margin-right: 5px;"></el-button>

                  <div></div>
                  <div>年度目标：{{list.qty}} {{list.unit}}</div>
                  <div>当前进度：{{list.currentQty}}</div>
                  <div> KR 权重：{{list.ratio}}%</div>
                  <div><a :href="list.statAddress" target="_blank" style="text-decoration:none;color:#303133">点我
                      查看更新记录</a></div>


                  <div style="width: 80%;margin:auto">
                    <el-progress :text-inside="true" :stroke-width="18" size='mini' :percentage="list.complete"
                      status="warning"></el-progress>
                  </div>

                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </div>
      </el-col>
      <!-- <el-col :span="7">
        <div>
          <h3 class="title-progress">PROGRESS FOR PERIOD</h3>
          <el-card>
            <div class="left-card-progress">
              <el-progress type="circle" :percentage="50"></el-progress>
            </div>
            <div class="block">
              <el-timeline>
                <el-timeline-item v-for="(activity, index) in activities" :key="index" :icon="activity.icon"
                  :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp">
                  {{activity.content}}
                </el-timeline-item>
              </el-timeline>
            </div>
            <div>
            </div>
          </el-card>
        </div>
      </el-col> -->
    </el-row>

    <el-dialog title="修改数据" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">

      <el-form :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="OKR內容" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="年度目标" prop="qty" label-width="100px">
          <el-input v-model="editForm.qty" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="当前進度" prop="currentQty" label-width="100px">
          <el-input v-model.number="editForm.currentQty" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import listApi from '@/api/listApi'

  export default {
    name: 'List',
    components: {
    },
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('当前进度不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value > this.editForm.qty) {
              callback(new Error('不能大于年度目标'));
            } else if (value <= this.currentValue) {
              callback(new Error('不能小于当前已有进度'));
            }
            else {
              callback();
            }
          }
        }, 1000);
      }
      return {
        OKRloading:false,
        editForm: {},
        activeNames: ['1', '0', '2', '3'],
        actives: [0, 1, 2, 3, 4, 5],
        editTab: false,
        dialogVisible: false,
        drawer: false,
        table: false,
        activeNames: ['1'],
        currentDate: new Date(),
        clientHeight: '',
        activities: [{
          content: '完成okr1',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more'
        }, {
          content: '完成okr2',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87'
        }, {
          content: '完成okr3-1',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        }, {
          content: '完成okr3-2',
          timestamp: '2018-04-03 20:46'
        }],
        active: 0,
        input: '',
        id: '',
        dept: '',

        okrAll: [],
        currentValue: 0,

        rules: {
          currentQty: [
            { validator: checkAge, trigger: 'blur' },
            { required: true, message: '不能大于年度目标数值', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      // 获取浏览器可视区域高度
      this.clientHeight = `${document.documentElement.clientHeight}`
      //document.body.clientWidth;
      //console.log(self.clientHeight);
      window.onresize = function temp() {
        this.clientHeight = `${document.documentElement.clientHeight}`;
      };

      this.getOkr();
    },
    watch: {
      // 如果 `clientHeight` 发生改变，这个函数就会运行
      clientHeight: function () {
        this.changeFixed(this.clientHeight)
      },

      $route: 'getOkr'

      // $route(to,from){
      // this.id=to.params.name
      // console.log('to,我在list',to)
      // var id=to.path.split('/').pop()
      // console.log('idhh',id)
      // this.id=id
      // console.log("dept",this.dept)

      // const _this=this//_this代表当前vue对象
      // let id=this.id
      // console.log('woshiid',id)
      // this.$axios.get(`/okr/list/${id}`)
      //   .then(function(resp){
      //   console.log('res，我在list.vue',resp)
      //   _this.okrAll=resp.data.data.okrAll
      //   console.log('okrall，我在list.vue',_this.okrAll)
      //   _this.dept=resp.data.data.Dept
      // })

      // },
    },

    methods: {
      handleChange(val) {
        console.log("val", val);
      },
      changeFixed(clientHeight) { //动态修改样式
        // console.log(clientHeight);
        // console.log(this.$refs.homePage.$el.style.height);
        this.$refs.homePage.$el.style.height = clientHeight - 20 + 'px';
      },
      next() {
        if (this.active++ > 2) this.active = 0;
      },

      getUrl(id) {
        return this.okrAll[id].statAddress
      },
      getOkr() {
        this.OKRloading=true
        console.log(this.$route.params, 'this.$route.params')
        listApi.okr(this.$route.params.id).then(resp => {
          console.log('res，我在getokr().vue', resp)
          this.okrAll = resp.data.data.okrAll
          console.log('okrall，我getokr().vue', this.okrAll)
          this.dept = resp.data.data.Dept
          console.log('idaaaaa', this.$route.params.id)
        this.OKRloading=false

        })
      },

      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => { });
      },

      edit(id) {
        this.$axios.get('/okr/okrbyid/' + id).then(res => {
          this.editForm = res.data.data
          this.dialogVisible = true
          console.log('hi,我是edit（）中的editform', this.editForm)
          this.currentValue = this.editForm.currentQty
        })
      },

      submitForm(formName) {
        this.$confirm('是否确认修改？')
          .then(_ => {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$axios.post('/okr/' + (this.editForm.id ? 'updateOKR' : 'save'), this.editForm)
                  .then(res => {

                    this.$message({
                      showClose: true,
                      message: '恭喜你，操作成功',
                      type: 'success',
                      onClose: () => {
                        this.getOkr()
                      }
                    });

                    this.dialogVisible = false
                  })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          })
          .catch(_ => { });


      },

      editHandle(index) {
        this.$axios.get('/okr/okrbyid/' + this.okrAll[index].id).then(res => {
          this.editForm = res.data.data
          console.log('this.okrAll[id].id', this.okrAll[index].id)
          console.log('this.editForm', this.editForm)
          this.dialogVisible = true
        })
      },

      deleteTab(index) {
        this.$confirm('将要删除当前目标, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(this.logMessage);
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false
        this.editForm = {}
      },

      // 工具方法
      isEmpty(str) {
        return str === null || str.replace(/ /g, "").length === 0;
      },
      sendMsg(msg, level, time) {
        this.$message({
          message: msg,
          type: level,
          duration: time,
        });
      },
      logMessage(msg) {
        console.log(msg);
      }
    },

    mounted() {
      this.getOkr()
    },
    created() {
      // const _this=this//_this代表当前vue对象
      //   let id=this.id
      //   console.log('woshiid',id)
      //   this.$axios.get(`/okr/list/${id}`)
      //     .then(function(resp){
      //     console.log('res，我在list.vue',resp)
      //     _this.okrAll=resp.data.data.okrAll
      //     console.log('okrall，我在list.vue',_this.okrAll)
      //     _this.dept=resp.data.data.Dept
      //   })
      // this.id=1
      // this.actives
    },


  }
</script>

<style scoped>
  .el-main {
    padding: 10px !important;
    /* position: absolute;
      left: 200px;
      right: 0;
      top: 60px;
      bottom: 0;
      overflow-y: scroll; */

    /*隐藏el-main的滚动条*/
    /* overflow: hidden; */

    /* height: 80%; */
  }

  .el-header {
    background-color: rgb(31, 28, 70);
    /* color: #333; */
    /* line-height: 60px; */
    position: relative;
    width: 100%;
    height: 60px;
  }



  .el-row {
    margin-bottom: 20px;

    /* &:last-child {
    margin-bottom: 0;
  } */
    /* 这样写会报错 &号代表上一级，为sass的写法*/
  }

  .el-row :last-child {
    margin-bottom: 0;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    height: 200px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
    height: 300px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 100%;
  }

  .el-collapse {
    border-top: none;
  }

  .el-card__header {
    border-bottom: 0px solid !important;
  }

  .el-card__body {
    padding: 5px !important;
  }

  .clearfix {
    line-height: 2rem;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .el-progress-circle {
    width: 250px !important;
    height: 250px !important;

  }

  .left-card-progress {
    width: 250px;
    margin: auto;
    margin-bottom: 30px;
    margin-top: 20px;
  }

  .block {
    width: 300px;
    margin: auto;
  }

  .title-progress {
    text-align: center;
    font-size: 2rem;
  }

  .el-dropdown {
    vertical-align: top;
  }

  .el-dropdown+.el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }



  .okr-edit {
    float: right;
    margin-bottom: 10px;
  }
</style>