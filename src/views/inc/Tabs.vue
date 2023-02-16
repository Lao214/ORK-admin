<template>
	<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
		<el-tab-pane
				v-for="(item, index) in editableTabs"
				:key="item.name"
				:label="item.title"
				:name="item.name"
		>

		</el-tab-pane>
	</el-tabs>
</template>

<script>
	export default {
		name: "Tabs",
		data() {
			return {
				// editableTabsValue、editableTabs这两个要放在状态里进行管理，
				//这两个值放在这里直接return值也不对，因为获取一次之后无法监听后面有新的动态页生成，所以要用computed的方法动态监听值的变化
				// editableTabsValue: this.$store.state.menus.editableTabsValue,
				// editableTabs: this.$store.state.menus.editableTabs
			}
		},
		computed: {
			//要放在computed里面监听数据，get\set要一起写的
			editableTabs: {
				get() {
					return this.$store.state.menus.editableTabs
				},
				set(val) {
					this.$store.state.menus.editableTabs = val
				}
			},
			editableTabsValue: {
				get() {
					return this.$store.state.menus.editableTabsValue
				},
				set(val) {
					this.$store.state.menus.editableTabsValue = val
				}
			},
		},
		watch:{
			$route(to,from){
      console.log('to,我在tab',to)
			var id=to.path.split('/').pop()
      console.log('id,我在tab',id)
			}
		},
		methods: {

			removeTab(targetName) {
				let tabs = this.editableTabs;
				let activeName = this.editableTabsValue;

				if (activeName === 'Index') {
					return
				}

				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}

				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.name !== targetName);

				this.$router.push({name: activeName})
				// this.$router.push({name: activeName}).catch(()=>{})

			},
			 
			clickTab (target) {
				// console.log('试试看router是什么内容',params)
				console.log('target是个啥？',target)
				console.log('target.name是个啥？',target.name)
				console.log('我看看this.$route.params',this.$route.params)
				this.$router.push(
					{
						name: target.name,
						params:{
							id:1
						}
					}
				)
				// this.$router.push({name: target.name}).catch(()=>{})
				console.log('router是啥？',this.$route.path)
			}
		}
	}
</script>

<style scoped>

</style>