<template>
	<QuestionManage :masterId="formData.id" size="small" :isUser="isUser"></QuestionManage>
</template>

<script>
	import QuestionManage from '~/components/affair/question/QuestionManage'
	export default {
		props: ['formData', 'isUser'],
		components: {
			QuestionManage
		}
	}
</script>
