<script>
	import '../styles/carbon/pre-compiled.css';
	import '../styles/carbon/colors.scss';
	import '../styles/index.css';
	import NavigationBar from '$components/NavigationBar/NavigationBar.svelte';
	import { InlineNotification } from 'carbon-components-svelte';
</script>

<NavigationBar />
<slot />
<InlineNotification
	class="fixed z-50 w-full left-0 bottom-0 m-0 max-w-none min-w-0"
	lowContrast
	kind="warning-alt"
	title="คำเตือน:"
	subtitle="เว็บไซต์นี้อยู่ระหว่างการพัฒนา ข้อมูลทั้งหมดบนเว็บไซต์ถูกสมมุติขึ้นเป็นการชั่วคราวเท่านั้น ไม่สามารถใช้อ้างอิงได้ในทุกกรณี"
	hideCloseButton
/>
