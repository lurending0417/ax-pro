<template>
	<MeetManage :masterId="formData.id" size="small" :isUser="isUser"></MeetManage>
</template>

<script>
	import MeetManage from '~/components/affair/meet/MeetManage'
	export default {
		props: ['formData', 'isUser'],
		components: {
			MeetManage
		}
	}
</script>
