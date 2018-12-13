<template>
	<SeriesCourseManage :masterId="formData.id" size="small" :isUser="isUser"></SeriesCourseManage>
</template>

<script>
	import SeriesCourseManage from '~/components/affair/course/SeriesCourseManage'
	export default {
		props: ['formData', 'isUser'],
		components: {
			SeriesCourseManage
		}
	}
</script>
