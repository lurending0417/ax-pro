<template>
	<div>
		<!--<div id="editor">-->
			<!--Here goes the initial content of the editor.-->
		<!--</div>-->
		<textarea name="content" id="editor">
			&lt;p&gt;Here goes the initial content of the editor.&lt;/p&gt;
		</textarea>
		<div style="height: 200px;background-color: bisquek;"></div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				editorConfig: {
				}
			}
		},
		mounted() {
//			CkEditor.create( document.querySelector( '#editor' ) , this.editorConfig)
//				.then( editor => {
//					console.log( editor );
//				} )
//				.catch( error => {
//					console.error( error );
//				} );

			ClassicEditor
				.create( document.querySelector( '#editor' ) )
				.then( editor => {
					console.log( editor );
				} )
				.catch( error => {
					console.error( error );
				} );
		}
	}
</script>
