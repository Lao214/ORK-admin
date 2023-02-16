<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
	export default {
		name: "App",
		watch: {
			$route(to, from) {

				console.log("to,我在app.vue呢")
				console.log(to)

				if (to.path != '/login') {
					let obj = {
						name: to.name,
						title: to.meta.title,
						id: to.path.split("/").pop()
					}
					console.log('obj.id',obj.id)//拿到id了55
					this.$store.commit("addTab", obj)
				}

			}
		}
	}

</script>

<style>
	html, body, #app {
		font-family: 'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
		height: 100%;
		padding: 0;
		margin: 0;
		font-size: 15px;
	}
</style>
