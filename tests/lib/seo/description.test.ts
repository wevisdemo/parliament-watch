import {
	describeAssembly,
	describeBill,
	describeBillsInTerm,
	describePolitician,
	describeVoting
} from '$lib/seo/description';
import { DefaultVoteOption } from '$models/voting';
import { describe, expect, it } from 'vitest';

const membership = (
	classification: string,
	name: string,
	role: string,
	end_date: string | null
) => ({
	end_date,
	posts: [{ role, organizations: [{ classification, name }] }]
});

describe('describePolitician', () => {
	it('starts with the current position and party', () => {
		expect(
			describePolitician([
				membership('HOUSE_OF_REPRESENTATIVE', 'สภาผู้แทนราษฎร ชุดที่ 26', 'สส.บัญชีรายชื่อ', null),
				membership('POLITICAL_PARTY', 'เก่า', 'สมาชิก', '2020-01-01'),
				membership('POLITICAL_PARTY', 'ตัวอย่าง', 'สมาชิก', null)
			])
		).toBe('สส.บัญชีรายชื่อ พรรคตัวอย่าง ดูประวัติการดำรงตำแหน่ง การลงมติ และสถิติการขาดประชุม');
	});

	it('drops the position and party when nothing is current', () => {
		expect(
			describePolitician([membership('HOUSE_OF_SENATE', 'วุฒิสภา', 'สว.', '2024-01-01')])
		).toBe('ดูประวัติการดำรงตำแหน่ง การลงมติ และสถิติการขาดประชุม');
	});
});

describe('describeBill', () => {
	it('lists status, category, proposer and date', () => {
		expect(
			describeBill(
				{ status: 'IN_PROGRESS', categories: ['เศรษฐกิจ'], proposal_date: '2025-01-01' },
				{ type: 'ASSEMBLY', id: 'cabinet', name: 'คณะรัฐมนตรี', founding_date: null }
			)
		).toBe(
			'สถานะ: กำลังดำเนินการ หมวดเศรษฐกิจ เสนอโดย คณะรัฐมนตรี เมื่อ 1 ม.ค. 2568 ติดตามความคืบหน้าในสภา'
		);
	});

	it('drops missing category, proposer and date', () => {
		expect(
			describeBill({ status: 'ENACTED', categories: [], proposal_date: null }, undefined)
		).toBe('สถานะ: ออกเป็นกฎหมาย ติดตามความคืบหน้าในสภา');
	});

	it('falls back to ประชาชน for an unnamed people proposer', () => {
		expect(
			describeBill(
				{ status: 'REJECTED', categories: null, proposal_date: null },
				{ type: 'PEOPLE', name: '', signatoryCount: 10000 }
			)
		).toBe('สถานะ: ตกไป เสนอโดย ประชาชน ติดตามความคืบหน้าในสภา');
	});
});

describe('describeVoting', () => {
	it('drops a missing result and options without counts', () => {
		expect(
			describeVoting({ result: null, start_date: '2025-01-01', organizations: [] }, [
				{ option: DefaultVoteOption.Agreed, total: 1 }
			])
		).toBe('เมื่อ 1 ม.ค. 2568 เห็นด้วย 1 ดูผลรายพรรคและรายคน');
	});
});

describe('describeAssembly', () => {
	it('drops a missing start date and zero members', () => {
		expect(describeAssembly(null, 0)).toBe('ดูสัดส่วนพรรค การลงมติล่าสุด และร่างกฎหมายที่เสนอ');
	});
});

describe('describeBillsInTerm', () => {
	it('lists counts by status in a fixed order, dropping absent ones', () => {
		expect(
			describeBillsInTerm(26, 1200, [
				{ status: 'IN_PROGRESS', count: 900 },
				{ status: 'MERGED', count: 50 },
				{ status: 'ENACTED', count: 250 }
			])
		).toBe(
			'ร่างกฎหมายในสภาผู้แทนราษฎร ชุดที่ 26 ทั้งหมด 1,200 ฉบับ ออกเป็นกฎหมาย 250 กำลังดำเนินการ 900'
		);
	});
});
