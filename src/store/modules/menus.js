import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
	state: {

		menuList: [],
		permList: [],

		hasRoutes: false,

		//进行全局状态的管理,editableTabsValue是激活哪个tab
		editableTabsValue: 'Index',
		//默认只要显示首页就可以了（其实我觉得还得默认显示属于自己部门的okr
		editableTabs: [
			{
				title: '首页',
				name: 'Index',
			},
		]
	},
	mutations: {
		setMenuList(state, menus) {
			state.menuList = menus
		},
		setPermList(state, perms) {
			state.permList = perms
		},
		changeRouteStatus(state, hasRoutes) {
			state.hasRoutes = hasRoutes
		},

		//放在这里才可以直接给edittableTabs数组增加数据
		addTab(state, tab) {

			//判定数组是否已经有了，有了就不要重复出现了
			let index = state.editableTabs.findIndex(e => e.name === tab.name)
			//等于-1说明没找到，那就添加
			if (index === -1) {
				state.editableTabs.push({
					title: tab.title,
					name: tab.name,
				});
			}
			//当前的值就会指向新传入的tab的name
			state.editableTabsValue = tab.name;
		},

		resetState: (state) => {
			state.menuList = []
			state.permList = []

			state.hasRoutes = false
			state.editableTabsValue = 'Index'
			state.editableTabs = [{
				title: '首页',
				name: 'Index',
			}]
		}

	},
	actions: {
	},

}