<template>
	<el-menu
			:default-active="this.$store.state.menus.editableTabsValue"
			class="el-menu-vertical-demo"
			background-color="#545c64"
			text-color="#fff"
			active-text-color="#ffd04b"
			>

		<router-link to="/index">
			<el-menu-item index="Index"  @click="selectMenu({name: 'Index', title: '首页'})">
				<template slot="title">
					<i class="el-icon-s-home"></i>
					<span slot="title">首页</span>
				</template>
			</el-menu-item>
		</router-link>

		<el-submenu :index="menu.name" v-for="menu in menuList">
			<template slot="title">
				<i :class="menu.icon"></i>
				<span>{{menu.title}}</span>
			</template>

			<router-link :to="item.path" v-for="item in menu.children" v-if="item.path!=undefined">
				<el-menu-item :index="item.name" @click="selectMenu(item)">
					<template slot="title">
						<i :class="item.icon"></i>
						<span slot="title">{{item.title}}</span>
					</template>
				</el-menu-item>
			</router-link>

		</el-submenu>

	</el-menu>
</template>

<script>
	export default {
		name: "SideMenu",
		data() {
			return {
				path:'',
				id:''
			}
		},
		computed:  {
			menuList: {
				get() {
					return this.$store.state.menus.menuList
				}
			},
			// id:{
			// 	get(){
			// 		return this.path
			// 	}
			// }
		},
		methods: {
			selectMenu(item) {
				console.log('item',item)
				this.$store.commit("addTab", item)
			// 	this.$axios.get(`/okr/list/1`)
      //   .then(function(resp){
      //   console.log('res，我在sidemenu.vue',resp)
      //   // _this.okrAll=resp.data.data.okrAll
      //   // console.log('okrall，我在list.vue',_this.okrAll)
      //   // _this.dept=resp.data.data.Dept
      // })
			},
		}
	}
</script>

<style scoped>
	.el-menu-vertical-demo {
		height: 100%;
	}
	a{
    text-decoration: none;
  }
	.el-menu{
		border-right: 0px;
	}
	.el-menu-item{
		padding: 0 20px!important;
	}
</style>