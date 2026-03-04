<script lang="ts">
	import { InlineNotification, NotificationActionButton } from 'carbon-components-svelte';
</script>

<InlineNotification
	class="m-0 min-w-0 max-w-none"
	hideCloseButton
	lowContrast
	kind="info"
	subtitle="การประเมินพฤติกรรมการลงมติไม่สามารถพิจารณาได้จากชื่อมติเพียงอย่างเดียว จำเป็นต้องพิจารณาเนื้อหาของมติประกอบ และศึกษาที่มาและข้อจำกัดของข้อมูลก่อนนำไปใช้อ้างอิง"
>
	<svelte:fragment slot="actions">
		<NotificationActionButton href="/about#เกี่ยวกับข้อมูลในเว็บไซต์">
			อ่านรายละเอียด
		</NotificationActionButton>
	</svelte:fragment>
</InlineNotification>
