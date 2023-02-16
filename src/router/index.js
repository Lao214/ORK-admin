import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'
import User from '../views/sys/User.vue'
import Role from '../views/sys/Role.vue'
import Menu from '../views/sys/Menu.vue'
import List from '../views/okr/List.vue'

import axios from "../axios";
import store from "../store"
import el from "element-ui/src/locale/lang/el";

Vue.use(VueRouter)

//定义routes路由的集合，数组类型
const routes = [
	//单个路由均为对象类型
	{
		path: '/',
		name: 'Home',
		component: Home,
		children: [
			{
				path: '/index',
				name: 'Index',
				meta: {
					title: "首页"
				},
				component: Index
			},
			{
				path: '/userCenter',
				name: 'UserCenter',
				meta: {
					title: "个人中心"
				},
				component: () => import('@/views/UserCenter.vue')
			},
			// {
			// 	path: '/sys/users',
			// 	name: 'SysUser',
			// 	component: User
			// },
			// {
			// 	path: '/sys/roles',
			// 	name: 'SysRole',
			// 	component: Role
			// },
			// {
			// 	path: '/sys/menus',
			// 	name: 'SysMenu',
			// 	component: Menu
			// },
			{
				path: '/okr/list/:id',
				component: List,
				// name:'List'
			}

		]
	},

	//可以配置重定向 重定向实际上是当匹配到路径符合条件的时候去执行对应的路由，当然这个时候的url上面的地址显示的是对应的路由，页面也是对应的路由页面；
	// {path:'',redirect:"page1"},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/Login.vue')
	},
]

//实例化VueRouter并将routes添加进去
const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

//router.beforeEach是一个全局前置守卫
router.beforeEach((to, from, next) => {

	let hasRoute = store.state.menus.hasRoutes

	let token = localStorage.getItem("token")

	if (to.path == '/login') {
		next()

	} else if (!token) {
		next({ path: '/login' })


	} else if (token && !hasRoute) {
		axios.get("/sys/menu/nav", {
			headers: {
				Authorization: localStorage.getItem("token")
			}
		}).then(res => {

			console.log(res.data.data)

			// 拿到menuList
			store.commit("setMenuList", res.data.data.nav)

			// 拿到用户权限
			store.commit("setPermList", res.data.data.authoritys)

			console.log(store.state.menus.menuList)

			// 动态绑定路由
			let newRoutes = router.options.routes

			res.data.data.nav.forEach(menu => {
				if (menu.children) {
					menu.children.forEach(e => {

						// 转成路由
						let route = menuToRoute(e)

						// 吧路由添加到路由管理中
						if (route) {
							newRoutes[0].children.push(route)
						}

					})
				}
			})

			console.log("newRoutes")
			console.log(newRoutes)
			router.addRoutes(newRoutes)

			hasRoute = true
			store.commit("changeRouteStatus", hasRoute)
		})
	}



	next()
})


// 导航转成路由
const menuToRoute = (menu) => {

	if (!menu.component) {
		return null
	}

	let route = {
		name: menu.name,
		path: menu.path,
		meta: {
			icon: menu.icon,
			title: menu.title
		}
	}
	route.component = () => import('@/views/' + menu.component + '.vue')
	return route
}

//抛出这个这个实例对象方便外部读取以及访问
export default router
