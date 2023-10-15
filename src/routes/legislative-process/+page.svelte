<script land="ts">
	import dayjs from 'dayjs';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import 'dayjs/locale/th';

	dayjs.extend(buddhistEra);
	dayjs.locale('th');
</script>

<div class="flex flex-col w-full">
	<header class="bg-teal-20">
		<div class="w-full max-w-[800px] px-10 py-10 md:py-20 mx-auto">
			<h1 class="fluid-heading-05 mb-4">ร่างกฎหมายกลายเป็นกฎหมายได้อย่างไร</h1>
			<p>
				<span class="text-text-primary font-bold">อัปเดตล่าสุด :</span>
				<span class="text-helper-text-01">{dayjs(new Date()).format('DD MMM BBBB')}</span>
			</p>
		</div>
	</header>
	<div
		class="w-full max-w-[800px] flex flex-col gap-10 px-4 md:px-10 py-8 bg-ui-01 md:bg-white mx-auto"
	>
		<section class="flex flex-col gap-4 bg-white px-4 md:px-0 py-8 md:py-0">
			<h1 class="fluid-heading-05 text-text-primary mb-4">แนะนำภาพรวม</h1>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">กฎหมายสำเร็จได้อย่างไร</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">กฎหมายในเว็บไซต์นี้</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">ประเภทของกฎหมาย</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">สถานะของกฎหมาย</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
		</section>
		<section class="flex flex-col gap-4 bg-white px-4 md:px-0 py-8 md:py-0">
			<h1 class="fluid-heading-05 text-text-primary mb-4">ขั้นตอนของกฎหมาย</h1>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">ที่มาของกฎหมาย</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">ขั้นตอนโดยย่อ</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">ขั้นตอนโดยละเอียด</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
		</section>
		<section class="flex flex-col gap-4 bg-white px-4 md:px-0 py-8 md:py-0">
			<h1 class="fluid-heading-05 text-text-primary mb-4">ประเภทของการลงมติ</h1>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">ประเภทของการลงมติ</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">ผลของการลงมติ</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">การลงมติอื่นๆ</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
		</section>
		<section class="flex flex-col gap-4 bg-white px-4 md:px-0 py-8 md:py-0">
			<h1 class="fluid-heading-05 text-text-primary mb-4">ส.ส. และ ส.ว. ทำอะไรบ้างในสภา</h1>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">หน้าที่ของ ส.ส.</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">หน้าที่ของ ส.ว.</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
			<div>
				<h2 class="fluid-heading-04 text-text-primary mb-4">หน้าที่ของสภาร่วม (ส.ส. + ส.ว.)</h2>
				<hr class="border-0 border-solid border-gray-20 border-t w-full box-border" />
			</div>
		</section>
	</div>
</div>
