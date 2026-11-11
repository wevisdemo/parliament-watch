import type { ProposerProps } from '$components/Proposer/Proposer.svelte';
import { formatThaiDate } from '$lib/date';
import { billStatusProperty } from '$lib/politigraph/bill/status';
import type { BillStatus } from '$lib/politigraph/genql';
import { DefaultVoteOption } from '$models/voting';

type Clause = string | false | null | undefined;

const joinClauses = (...clauses: Clause[]) => clauses.filter(Boolean).join(' ');

const formatShortDate = (date: string) => formatThaiDate(date, { shortMonth: true });

interface Membership {
	end_date: string | null;
	post: { role: string; organization: { classification: string; name: string } };
}

const isParty = ({ post }: Membership) => post.organization.classification === 'POLITICAL_PARTY';

export function describePolitician(memberships: Membership[]): string {
	const current = memberships.filter(({ end_date }) => !end_date);
	const position = current.find((m) => !isParty(m))?.post.role;
	const party = current.find(isParty)?.post.organization.name;

	return joinClauses(
		position,
		party && `พรรค${party}`,
		'ดูประวัติการดำรงตำแหน่ง การลงมติ และสถิติการขาดประชุม'
	);
}

export function describeBill(
	{
		status,
		categories,
		proposal_date
	}: { status: BillStatus; categories: string[] | null; proposal_date: string | null },
	proposer: ProposerProps['proposer']
): string {
	const proposerName = proposer?.name || (proposer?.type === 'PEOPLE' ? 'ประชาชน' : undefined);

	return joinClauses(
		`สถานะ: ${billStatusProperty[status].label}`,
		!!categories?.length && `หมวด${categories.join(', ')}`,
		proposerName && `เสนอโดย ${proposerName}`,
		proposal_date && `เมื่อ ${formatShortDate(proposal_date)}`,
		'ติดตามความคืบหน้าในสภา'
	);
}

export function describeVoting(
	{
		result,
		start_date,
		organizations
	}: { result: string | null; start_date: string | null; organizations: { name: string }[] },
	results: { option: unknown; total: number }[]
): string {
	const countOf = (option: DefaultVoteOption) => {
		const total = results.find((r) => r.option === option)?.total;
		return total !== undefined && `${option} ${total.toLocaleString()}`;
	};

	return joinClauses(
		result && `มติ${result}`,
		start_date && `เมื่อ ${formatShortDate(start_date)}`,
		organizations.length > 0 && `ใน${organizations.map(({ name }) => name).join(' และ ')}`,
		countOf(DefaultVoteOption.Agreed),
		countOf(DefaultVoteOption.Disagreed),
		countOf(DefaultVoteOption.Abstain),
		'ดูผลรายพรรคและรายคน'
	);
}

export function describeAssembly(foundingDate: string | null, totalMembers: number): string {
	return joinClauses(
		foundingDate && `เริ่มวาระ ${formatShortDate(foundingDate)}`,
		totalMembers > 0 && `สมาชิก ${totalMembers.toLocaleString()} คน`,
		'ดูสัดส่วนพรรค การลงมติล่าสุด และร่างกฎหมายที่เสนอ'
	);
}

export function describeBillsInTerm(
	term: number | null,
	totalCount: number,
	byStatus: { status: BillStatus; count: number }[]
): string {
	const countOf = (status: BillStatus) => {
		const count = byStatus.find((group) => group.status === status)?.count;
		return count !== undefined && `${billStatusProperty[status].label} ${count.toLocaleString()}`;
	};

	return joinClauses(
		`ร่างกฎหมายในสภาผู้แทนราษฎร ชุดที่ ${term}`,
		`ทั้งหมด ${totalCount.toLocaleString()} ฉบับ`,
		countOf('ENACTED'),
		countOf('IN_PROGRESS'),
		countOf('REJECTED')
	);
}
