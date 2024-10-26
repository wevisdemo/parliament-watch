<script lang="ts">
	import PromiseList from './PromiseList.svelte';
	import { PromiseStatus, type PromiseSummary } from '$models/promise';
	export let Hst;

	let statusOptions = [
		{ label: 'notStarted', value: PromiseStatus.notStarted },
		{ label: 'inProgress', value: PromiseStatus.inProgress },
		{ label: 'clarifying', value: PromiseStatus.clarifying },
		{ label: 'fulfilled', value: PromiseStatus.fulfilled },
		{ label: 'unhonored', value: PromiseStatus.unhonored }
	];
	let date1 = '2024-10-24T00:00:00.000Z';
	let date2 = '2024-10-15T00:00:00.000Z';
	let date3 = '2024-10-10T00:00:00.000Z';
	let date4 = '2024-04-24T00:00:00.000Z';
	let date5 = '2024-06-24T00:00:00.000Z';
	let summary1 = {
		id: '1',
		statements: [
			'1 กีฬา 1 รัฐวิสาหกิจพลัส (OSOS) จับคู่รัฐวิสาหกิจที่มีกำไรและหน่วยงานรัฐ-เอกชนมาสนับสนุนสมาคมกีฬา'
		],
		party: {
			name: 'เพื่อไทย',
			color: '#F41724',
			logo: '/images/parties/เพื่อไทย.webp'
		},
		keywords: ['Soft Power', 'THACCA', 'กีฬา'],
		categories: ['วัฒนธรรม'],
		status: PromiseStatus.fulfilled
	};
	let summary2 = {
		id: '2',
		statements: [
			'เพิ่มโอกาสให้หนังไทย รัฐจะสนับสนุนหนังอิสระ เพื่อให้หนังอิสระเป็นพื้นที่ทดลองเทคนิคการเล่าเรื่องแนวใหม่ บ่มเพาะฝีมือ สร้างความหลากหลาย และเป็น R&D ให้หนังกระแสหลัก รัฐจะช่วยขยายตลาดหนังไทย และสนับสนุนหนังไทยไปเทศกาลภาพยนตร์ระดับโลก'
		],
		party: {
			name: 'เพื่อไทย',
			color: '#F41724',
			logo: '/images/parties/เพื่อไทย.webp'
		},
		keywords: ['Soft Power', 'THACCA', 'ภาพยนตร์', 'หนัง'],
		categories: ['วัฒนธรรม'],
		status: PromiseStatus.inProgress
	};
	let summary3 = {
		id: '3',
		statements: [
			'โรงเรียน 2 ภาษาในทุกท้องถิ่น สอนภาษาต่างประเทศ เช่น ภาษาอังกฤษและภาษาจีน ตั้งแต่ ป.1 ใช้ครูต่างประเทศสอนเสริมร่วมกับครูไทย ทั้งในห้องเรียนและออนไลน์'
		],
		party: {
			name: 'เพื่อไทย',
			color: '#F41724',
			logo: '/images/parties/เพื่อไทย.webp'
		},
		keywords: ['นโยบายการศึกษา'],
		categories: ['การศึกษา'],
		status: PromiseStatus.notStarted
	};
	let summary4 = {
		id: '4',
		statements: [
			'งานออกแบบไทยสู่เวทีโลก THACCA จะตั้งร้านเพื่อขายสินค้าไทย โดยเฉพาะสินค้าออกแบบ/แฟชันไทย และสินค้า OTOP ณ ใจกลางมหานครใหญ่ทั่วโลก'
		],
		party: {
			name: 'เพื่อไทย',
			color: '#F41724',
			logo: '/images/parties/เพื่อไทย.webp'
		},
		keywords: ['OTOP', 'THACCA', 'Soft Power'],
		categories: ['วัฒนธรรม', 'เศรษฐกิจ'],
		status: PromiseStatus.clarifying
	};
	let summary5 = {
		id: '5',
		statements: ['Free tablet for all” โครงการ 1 นักเรียน 1 แท็บเล็ต และ โครงการ 1 ครู 1 แท็บเล็ต'],
		party: {
			name: 'เพื่อไทย',
			color: '#F41724',
			logo: '/images/parties/เพื่อไทย.webp'
		},
		keywords: ['ฟรีแท็บเล็ต'],
		categories: ['การศึกษา', 'เทคโนโลยี'],
		status: PromiseStatus.unhonored
	};
	$: summaries = [
		{
			...summary1,
			latestProgressDate: new Date(date1)
		},
		{
			...summary2,
			latestProgressDate: new Date(date2)
		},
		{
			...summary3,
			latestProgressDate: new Date(date3)
		},
		{
			...summary4,
			latestProgressDate: new Date(date4)
		},
		{
			...summary5,
			latestProgressDate: new Date(date5)
		}
	];
</script>

<Hst.Story title="PromiseList">
	<PromiseList {summaries} />

	<svelte:fragment slot="controls">
		<Hst.Select title="status1" bind:value={summary1.status} options={statusOptions} />
		<Hst.Json title="statements1" bind:value={summary1.statements} />
		<Hst.Json title="keywords1" bind:value={summary1.keywords} />
		<Hst.Json title="categories1" bind:value={summary1.categories} />
		<Hst.Json title="party1" bind:value={summary1.party} />
		<Hst.Text title="latestProgressDate1" bind:value={date1} />

		<Hst.Select title="status2" bind:value={summary2.status} options={statusOptions} />
		<Hst.Json title="statements2" bind:value={summary2.statements} />
		<Hst.Json title="keywords2" bind:value={summary2.keywords} />
		<Hst.Json title="categories2" bind:value={summary2.categories} />
		<Hst.Json title="party2" bind:value={summary2.party} />
		<Hst.Text title="latestProgressDate2" bind:value={date2} />

		<Hst.Select title="status3" bind:value={summary3.status} options={statusOptions} />
		<Hst.Json title="statements3" bind:value={summary3.statements} />
		<Hst.Json title="keywords3" bind:value={summary3.keywords} />
		<Hst.Json title="categories3" bind:value={summary3.categories} />
		<Hst.Json title="party3" bind:value={summary3.party} />
		<Hst.Text title="latestProgressDate3" bind:value={date3} />

		<Hst.Select title="status4" bind:value={summary4.status} options={statusOptions} />
		<Hst.Json title="statements4" bind:value={summary4.statements} />
		<Hst.Json title="keywords4" bind:value={summary4.keywords} />
		<Hst.Json title="categories4" bind:value={summary4.categories} />
		<Hst.Json title="party4" bind:value={summary4.party} />
		<Hst.Text title="latestProgressDate4" bind:value={date4} />

		<Hst.Select title="status5" bind:value={summary5.status} options={statusOptions} />
		<Hst.Json title="statements5" bind:value={summary5.statements} />
		<Hst.Json title="keywords5" bind:value={summary5.keywords} />
		<Hst.Json title="categories5" bind:value={summary5.categories} />
		<Hst.Json title="party5" bind:value={summary5.party} />
		<Hst.Text title="latestProgressDate5" bind:value={date5} />
	</svelte:fragment>
</Hst.Story>
