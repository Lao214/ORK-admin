<template>
	<div>
		<el-form :inline="true">
			<el-form-item>
				<!-- <el-button type="primary" @click="dialogVisible = true">新增</el-button> -->
				<!-- <el-button type="primary" @click="openDad">新增OKR</el-button> -->
				<el-button type="primary" @click="open">新增KR</el-button>
			</el-form-item>
		</el-form>

		<!-- default-expand-all	是否默认展开所有节点 -->
		<el-table v-loading='tableloading' :data="tableData" style="width: 100%;margin-bottom: 20px;" row-key="id" border stripe default-expand-all
			:tree-props="{children: 'children', hasChildren: 'hasChildren'}">
			<el-table-column prop="name" label="OKR内容" sortable width="800">
			</el-table-column>
			<el-table-column prop="qty" label="年度目标">
			</el-table-column>
			<el-table-column prop="currentQty" label="当前进度">
			</el-table-column>
			<el-table-column prop="deptName" label="部门">
			</el-table-column>
			<el-table-column prop="deptId" label="部门id">
			</el-table-column>
			<el-table-column prop="icon" label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
					<!-- divider是分割线 -->
					<el-divider direction="vertical"></el-divider>
					<template>
						<el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">
							<el-button type="text" slot="reference">删除</el-button>
						</el-popconfirm>
					</template>
				</template>
			</el-table-column>
		</el-table>

		<!--新增、编辑对话框-->
		<el-dialog title="提示" :visible.sync="dialogVisible" width="600px" :before-close="handleClose" v-loading='diaglogloading'>
			<el-dialog
      width="30%"
      title="添加新OKR"
      :visible.sync="innerVisible"
      append-to-body>
				<el-form :model="editFormOkr" :rules="editFormRules" ref="editFormOkr" label-width="100px" class="demo-editForm">
					<el-form-item label="请输入OKR" prop="name" label-width="100px">
						<el-input v-model="editFormOkr.name" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="部门" prop="deptName" label-width="100px">
						<el-input v-model="editFormOkr.deptName" :disabled="true" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitFormOkr('editFormOkr')">立即创建</el-button>
						<el-button @click="resetForm('editFormOkr')">重置</el-button>
					</el-form-item>
				</el-form>
    	</el-dialog>
			<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
				<el-form-item label="上级OKR" prop="parentId" v-if="isShowChoose">
					<el-select v-model="editForm.parentId" placeholder="请选择上级OKR">
						<template v-for="item in tableData">
							<el-option :label="item.name" :value="item.id"></el-option>
							<!-- <template v-for="child in item.children">
								<el-option :label="child.name" :value="child.id">
									<span>{{ "- " + child.name }}</span>
								</el-option>
							</template> -->
						</template>
					</el-select>
				<el-button type="primary" @click="innerVisible = true" style="margin-left: 2rem;" v-if="showAdd">添新OKR</el-button>

				</el-form-item>
				<el-form-item label="KR内容" prop="name" label-width="100px">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="年度目标" prop="qty" label-width="100px">
					<el-input v-model="editForm.qty" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="当前进度" prop="currentQty" label-width="100px">
					<el-input v-model="editForm.currentQty" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门" prop="deptName" label-width="100px">
					<el-input v-model="editForm.deptName" :disabled="true" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('editForm')">立即创建</el-button>
					<el-button @click="resetForm('editForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 新增父okr -->
		<el-dialog title="提示" :visible.sync="DadDialogVisible" width="600px">
			<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">
				<el-form-item label="请输入OKR" prop="name" label-width="100px">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门" prop="deptName" label-width="100px">
					<el-input v-model="editForm.deptName" :disabled="true" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('editForm')">立即创建</el-button>
					<el-button @click="resetForm('editForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

	</div>

</template>

<script>
	import okrApi from '@/api/okrApi'

	export default {
		name: "Okr",
		data() {
			return {
				dialogVisible: false,
				DadDialogVisible: false,
				innerVisible: false,

				editForm: {},
				editFormOkr:{},
				editFormRules: {
					parentId: [
						{ required: true, message: '请选择上级菜单', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					perms: [
						{ required: true, message: '请输入权限编码', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择状态', trigger: 'blur' }
					],
					orderNum: [
						{ required: true, message: '请填入排序号', trigger: 'blur' }
					],
					statu: [
						{ required: true, message: '请选择状态', trigger: 'blur' }
					]
				},
				tableData: [],
				deptData: '',
				isShowChoose: true,
				showAdd:true,
				tableloading: false,
				diaglogloading:false,

			}
		},
		created() {
			this.getMenuTree()
		},
		methods: {
			getMenuTree() {
				this.tableloading= true
				this.diaglogloading=true
				this.$axios.get('/okr/list/menu/2021').then(res => {
					console.log(res, '/okr/list/menu/2021')
					// tableData拿到所有okr，这个api已经是做了id，就是如果是admin，就会出来所有okr，如果是员工，就只会出现归属部门的okr
					this.tableData = res.data.data
					console.log('tableData', this.tableData)
					this.tableloading= false
					this.diaglogloading=false
				})
				
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// this.editForm.deptId = this.deptId
						this.$axios.post('/okr/' + (this.editForm.id ? 'updateOKR' : 'saveOKR'), this.editForm)
							.then(res => {
								this.$message({
									showClose: true,
									message: '恭喜你，操作成功',
									type: 'success',
									onClose: () => {
										this.getMenuTree()
										
									}
								});
								this.dialogVisible = false
								this.DadDialogVisible = false
								this.tableloading=true
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			submitFormOkr(formName) {
				this.diaglogloading=true

				this.editFormOkr.parentId=0
				this.editFormOkr.deptId=this.deptId
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// this.editForm.deptId = this.deptId
						this.$axios.post('/okr/' + (this.editFormOkr.id ? 'updateOKR' : 'saveOKR'), this.editFormOkr)
							.then(res => {
								this.$message({
									showClose: true,
									message: '恭喜你，操作成功',
									type: 'success',
									onClose: () => {
										
									}
								});
								this.getMenuTree();
								this.innerVisible = false
								// this.DadDialogVisible = false
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				this.diaglogloading=false
				// this.$refs.editForm.resetFields()

			},
			editHandle(id) {
				this.showAdd=false
				this.$axios.get('/okr/okrbyid/' + id).then(res => {
					
					this.editForm = res.data.data
					// this.deptId=this.editForm.deptId
					console.log('editForm', this.editForm)
					if (this.editForm.parentId == 0) {
						this.isShowChoose = false
					}else{
						this.isShowChoose = true
					}
					this.dialogVisible = true
				})
			},
			// openDad() {

			// 	this.$axios.get('/okrdept/listbyidauto').then(res => {
			// 		console.log(res, 'res')
			// 		this.editForm.qty = null

			// 		this.deptData = res.data.data
			// 		this.deptId = res.data.data.id
			// 		this.editForm.deptName = res.data.data.name
			// 		this.editForm.parentId = 0

			// 		this.DadDialogVisible = true
			// 	})
			// },
			open() {
				// this.$refs.editForm.resetFields()
				this.isShowChoose = true
				this.showAdd= true

				this.$axios.get('/okrdept/listbyidauto').then(res => {
					console.log('res,/okrdept/listbyidauto', res)
					this.deptData = res.data.data.name
					console.log('deptData', this.deptData)

					this.deptId = res.data.data.id
					this.editForm.deptId=this.deptId
					this.editForm.deptName = res.data.data.name
					this.editFormOkr.deptName =res.data.data.name
					this.dialogVisible = true
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.dialogVisible = false
				this.editForm = {}
			},
			handleClose() {
				this.resetForm('editForm')
			},
			delHandle(id) {
				this.$axios.post("/sys/menu/delete/" + id).then(res => {
					this.$message({
						showClose: true,
						message: '恭喜你，操作成功',
						type: 'success',
						onClose: () => {
							this.getMenuTree()
						}
					});

				})
			},
			handleChange(value) {
				console.log(value);
			},

		}
	}
</script>

<style scoped>

</style>