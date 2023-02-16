<template>
	<div>
		<!-- header -->
		<el-form ref="searchForm" :model="searchForm" label-width="100px" style="margin-top:20px;">
			<el-row>
				<el-col :span="6">
					<el-form-item label="请选择部门" prop="deptId">
						<el-select v-model="searchForm.deptId" filterable clearable placeholder="请选择">
							<el-option v-for="(item, key) in deptList" :key="key" :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="请选择年份" prop="year">
						<!-- <el-select v-model="searchForm.year" filterable clearable placeholder="请选择">
              <el-option
                v-for="(item, key) in yearList"
                :key="key"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
						<el-date-picker v-model="searchForm.year" type="year" placeholder="选择年" format="yyyy年" value-format="yyyy">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="请选择月份" prop="month">
						<!-- <el-select v-model="searchForm.month" filterable clearable placeholder="请选择">
              <el-option
                v-for="(item, key) in monthList"
                :key="key"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
						<el-date-picker v-model="searchForm.month" type="month" placeholder="选择月" format="MM 月" value-format="M">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-row style="float:right;padding-bottom:10px">
			<el-button icon="el-icon-search" type="primary" round @click="getOkrList()">查询</el-button>
			<!-- <el-button icon="el-icon-refresh-left" type="warning" round plain @click="resetForm('searchForm')">重置</el-button> -->
			<el-button icon="el-icon-document-add" type="success" round @click="open">新增</el-button>
			<!-- <el-button icon="el-icon-document-remove" type="danger" round @click="BatchDelete()">批量删除</el-button> -->
		</el-row>

		<!-- main -->
		<!-- stripe是斑马纹 border是带边框 sortable是排序-->
		<el-table :data="tableData" style="width: 100%" border stripe v-loading='loading'>
			<el-table-column prop="year" label="年份" sortable width="180px">
			</el-table-column>
			<el-table-column prop="month" label="月份" sortable width="180px">
			</el-table-column>
			<el-table-column prop="content" label="OKR内容" sortable>
			</el-table-column>
			<el-table-column prop="ratio" label="分数" sortable width="180px">
			</el-table-column>
			<el-table-column prop="created" label="创建时间" sortable width="180px">
			</el-table-column>
			<el-table-column prop="icon" label="操作" width="250px">
				<template slot-scope="scope">
					<el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
					<el-divider direction="vertical"></el-divider>
					<template>
						<el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">
							<el-button type="text" slot="reference">删除</el-button>
						</el-popconfirm>
					</template>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑对话框-->
		<el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
			<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
				<!-- 编辑 -->
				<div v-if="showYear">
					<el-form-item label="部门" prop="deptName" label-width="100px">
						<el-input v-model="editForm.deptName" autocomplete="off" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="年份" prop="year" label-width="100px">
						<el-input v-model="editForm.year" autocomplete="off" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="月份" prop="month" label-width="100px">
						<el-input v-model="editForm.month" autocomplete="off" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="OKR内容" prop="content" label-width="100px">
						<el-input v-model="editForm.content" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="分数" prop="ratio" label-width="100px">
						<el-input v-model="editForm.ratio" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitForm('editForm')">立即创建</el-button>
						<el-button @click="resetForm('editForm')">重置</el-button>
					</el-form-item>
				</div>
				<!-- 新增 -->
				<div v-else>
					<el-form-item label="部门" prop="deptName" label-width="100px" v-if="arrDept">
						<el-input v-model="editForm.deptName" :disabled="true" label-width="100px" type="text"></el-input>
					</el-form-item>
					<el-form-item label="部门" prop="deptName" label-width="100px" v-else>
						<el-select v-model="editForm.deptName" filterable clearable placeholder="请选择">
							<el-option v-for="(item, key) in adminDeptArr" :key='key' :label="item.name" :value="item.id" />
						</el-select>
					</el-form-item>
					<el-form-item label="请选择年份" prop="year" label-width="100px">
						<el-input v-model="editForm.year" autocomplete="off" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="请选择月份" prop="month" label-width="100px">
						<el-input v-model="editForm.month" autocomplete="off" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="OKR内容" prop="content" label-width="100px">
						<el-input v-model="editForm.content" autocomplete="off">
						</el-input>
					</el-form-item>
					<el-form-item label="分数" prop="ratio" label-width="100px">
						<el-input v-model="editForm.ratio" autocomplete="off" placeholder="分数要在0-1分之间"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="submitAddForm('editForm')">立即创建</el-button>
						<el-button @click="resetForm('editForm')">重置</el-button>
					</el-form-item>
				</div>

			</el-form>
		</el-dialog>


	</div>

</template>

<script>
	export default {
		name: "Index",
		data() {
			return {
				name: '',
				id: '',
				year: '',
				month: '',
				loading: false,
				showYear: true,
				typeList: {},
				adminDeptArr: [],
				searchForm: {
					deptId: '',
					year: '',
					month: '',
				},
				dialogVisible: false,
				editForm: {

				},
				editFormRules: {
					// ratio: [
					// 	{required: true, message: '分数要在0-1分之间', trigger: 'blur',min:0,max:1}
					// ]
				},
				tableData: [],
				deptList: [],

				arrDept: true
			}
		},
		created() {
			this.getMenuTree()
			this.addDate()
		},
		methods: {

			getMenuTree() {
				this.$axios.get('/okrdept/listall').then(res => {
					this.deptList = res.data.data
					console.log('this.deptList', this.deptList)
				})

				this.$axios.get('/okrdept/listbyidauto')
					.then(res => {
						console.log('/okrdept/listbyidauto', res)
						if (res.data.data instanceof Array) {
							this.adminDeptArr = res.data.data;
							this.arrDept = false
						} else {
							this.name = res.data.data.name
							this.id = res.data.data.id
							this.arrDept = true
						}

						console.log('name', this.name)
						console.log('adminDeptArr', this.adminDeptArr)

						// this.editForm.deptName=name

						// this.editForm.deptId=id

					})
			},
			//编辑
			submitForm(formName) {
				console.log('editform', this.editForm)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/okr-new/' + (this.editForm.id ? 'updateOKR' : 'saveOKR'), this.editForm)
							.then(res => {

								this.$message({
									showClose: true,
									message: '恭喜你，操作成功',
									type: 'success',
									onClose: () => {
										this.getOkrList()
									}
								});

								this.dialogVisible = false
								// this.$refs.dialogVisible.resetFields();
								this.loading = true

							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				// this.tableloading=false
				// this.$refs.editForm.resetFields();
			},
			submitAddForm(formName) {
				console.log('editform add', this.editForm)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/okr-new/' + (this.editForm.id ? 'updateOKR' : 'saveOKR'), this.editForm)
							.then(res => {

								this.$message({
									showClose: true,
									message: '恭喜你，操作成功',
									type: 'success',
									onClose: () => {
										this.getOkrList()
									}
								});

								this.dialogVisible = false
								this.loading = true

							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			editHandle(id) {
				this.showYear = true
				this.$axios.get(`/okr-new/okrbyid/${id}`).then(res => {
					this.editForm = res.data.data

					this.dialogVisible = true
				})
			},
			// 重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.dialogVisible = false
				this.editForm = {}
			},
			handleClose() {
				this.resetForm('editForm')
			},
			delHandle(id) {
				this.$axios.post("/okr-new/delete/" + id)
					.then(res => {
						this.$message({
							showClose: true,
							message: '恭喜你，操作成功',
							type: 'success',
							onClose: () => {
								// this.loading=true
								this.getOkrList()
							}
						});
						this.loading = true

					})

			},
			getOkrList() {
				// this.loading=true
				let deptId = this.searchForm.deptId
				let year = this.searchForm.year
				let month = this.searchForm.month
				//傻逼才会写'/okr-new/list/'+this.searchForm.deptId+'/'+this.searchForm.year+'/'+this.searchForm.month',对我是大傻逼
				this.$axios.get(`/okr-new/list/${deptId}/${year}/${month}`)
					.then(res => {
						// console.log('你居然成功了！？')
						this.tableData = res.data.data.okrAll
						// console.log('看看拿对了没',this.tableData)
						// console.log('看看是什么',res)
						// console.log('看看是什么',res.data.data.okrAll)

						this.loading = false

					})


			},
			addOkr() {

			},
			open() {
				this.showYear = false
        var date = new Date();
				this.editForm = {
					content: "",
					 deptId: 0, 
					 deptName: '', 
					 ratio: 0, 
					 month: date.getMonth() + 1, 
					 year: date.getFullYear()
				}



				if (this.adminDeptArr.length < 1) {
					this.editForm.deptName = this.name
					this.editForm.deptId = this.id
				}
				// else{
				// 	this.editForm.deptId=this.id
				// }
		

				this.dialogVisible = true


			},
			addDate() {
				var nowDate = new Date();
				console.log('now', nowDate)
				var date = {
					year: nowDate.getFullYear(),
					month: nowDate.getMonth() + 1,
					day: nowDate.getDate()
				}
				var systemDate = date.year + '-' + 0 + date.month + '-' + 0 + date.day;
				console.log('systemDate', systemDate);

				this.year = date.year
				this.month = date.month
				// this.editForm.year=date.year
				// this.editForm.month=date.month
			}
		}
	}
</script>

<style scoped>

</style>