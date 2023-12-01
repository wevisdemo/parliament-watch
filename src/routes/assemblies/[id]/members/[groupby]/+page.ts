import { error, redirect } from '@sveltejs/kit';
import { GroupByOption } from './groupby-options.js';
import type { ComponentProps } from 'svelte';
import type PoliticianProfile from '$components/PoliticianProfile/PoliticianProfile.svelte';
import {
	bhumjaithaiParty,
	democratsParty,
	movingForwardParty,
	pheuThaiParty
} from '../../../../../mocks/data/party.js';
import { assemblies } from '../../../../../libs/datasheets/index.js';
import { AssemblyName } from '$models/assembly.js';

interface PoliticianGroup {
	name: string;
	icon?: string;
	members: PoliticianSummary[];
}

export type PoliticianGroupBy =
	| PoliticianGroup[]
	| {
			name: string;
			subgroups: PoliticianGroup[];
	  }[];

interface PoliticianSummary extends Omit<ComponentProps<PoliticianProfile>, 'isLarge'> {
	candidateType?: 'แบ่งเขต' | 'บัญชีรายชื่อ';
}

export function load({ params }) {
	const assembly = assemblies.find(({ id }) => id === params.id);

	if (!assembly) {
		throw error(404, `Assembly ${params.id} not found`);
	}

	const isSenates = assembly.name === AssemblyName.Senates;

	switch (params.groupby) {
		case GroupByOption.Party: {
			const groups: PoliticianGroupBy = [
				{
					name: 'ฝ่ายรัฐบาล',
					subgroups: [
						{
							name: pheuThaiParty.name,
							icon: pheuThaiParty.logo,
							members: mockPoliticianSummaries(20, () => ({ party: pheuThaiParty }))
						},
						{
							name: bhumjaithaiParty.name,
							icon: bhumjaithaiParty.logo,
							members: mockPoliticianSummaries(15, () => ({ party: bhumjaithaiParty }))
						}
					]
				},
				{
					name: 'ฝ่ายค้าน',
					subgroups: [
						{
							name: movingForwardParty.name,
							icon: movingForwardParty.logo,
							members: mockPoliticianSummaries(10, () => ({ party: movingForwardParty }))
						},
						{
							name: democratsParty.name,
							icon: democratsParty.logo,
							members: mockPoliticianSummaries(5, () => ({ party: democratsParty }))
						}
					]
				}
			];

			return { groups };
		}

		case GroupByOption.Province: {
			const groups: PoliticianGroupBy = [
				{
					name: 'ภาคกลาง',
					subgroups: [
						{
							name: 'กรุงเทพมหานคร',
							members: mockPoliticianSummaries(20, (i) => ({ role: `กรุงเทพมหานคร เขต ${i + 1}` }))
						},
						{
							name: 'กำแพงเพชร',
							members: mockPoliticianSummaries(20, (i) => ({ role: `กำแพงเพชร เขต ${i + 1}` }))
						}
					]
				},
				{
					name: 'ภาคเหนือ',
					subgroups: [
						{
							name: 'เชียงราย',
							members: mockPoliticianSummaries(7, (i) => ({ role: `กรุงเทพมหานคร เขต ${i + 1}` }))
						},
						{
							name: 'เชียงใหม่',
							members: mockPoliticianSummaries(10, (i) => ({ role: `กำแพงเพชร เขต ${i + 1}` }))
						}
					]
				}
			];

			return { groups };
		}

		case GroupByOption.Origin: {
			const groups: PoliticianGroupBy = [
				{
					name: 'โดยตำแหน่ง',
					members: mockPoliticianSummaries(20, () => ({ role: 'โดยตำแหน่ง', party: undefined }))
				},
				{
					name: 'เลือกโดยคสช',
					members: mockPoliticianSummaries(10, () => ({ role: 'เลือกโดยคสช', party: undefined }))
				},
				{
					name: 'เลือกกันเอง',
					members: mockPoliticianSummaries(5, () => ({ role: 'เลือกกันเอง', party: undefined }))
				}
			];

			return { groups };
		}

		case GroupByOption.Sex: {
			return {
				groups: mockPoliticianGroupsWithSubgroups(['ชาย', 'หญิง', 'ไม่มีข้อมูล'], isSenates)
			};
		}

		case GroupByOption.Age: {
			return {
				groups: mockPoliticianGroupsWithSubgroups(
					['Silent Gen', 'Baby Boomers', 'Gen X', 'Gen Y', 'Gen Z', 'ไม่พบข้อมูล'],
					isSenates
				)
			};
		}

		case GroupByOption.Education: {
			return {
				groups: mockPoliticianGroupsWithSubgroups(
					['ต่ำกว่าปริญญาตรี', 'ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก', 'สถาบันทหาร', 'ไม่พบข้อมูล'],
					isSenates
				)
			};
		}

		case GroupByOption.Assets: {
			return {
				groups: mockPoliticianGroupsWithSubgroups(
					[
						'ต่ำกว่า 1 ล้านบาท',
						'1-10 ล้านบาท',
						'10-100 ล้านบาท',
						'100-1000 ล้านบาท',
						'1000 ล้านบาทขึ้นไป',
						'ไม่พบข้อมูล'
					],
					isSenates
				)
			};
		}

		default:
			throw redirect(307, `/assemblies/${params.id}/members/party`);
	}
}

const mockPoliticianSummaries = (
	amount: number,
	overwrite?: (i: number) => Partial<PoliticianSummary>
): PoliticianSummary[] =>
	new Array(amount).fill(null).map((_, i) => {
		const [firstname, lastname] =
			i % 2 ? ['กมนทรรศน์', 'กิตติสุนทรสกุล'] : ['สง่าเนตร', 'กิตติสุนทรสกุล'];

		return {
			id: `${firstname}-${lastname}`,
			firstname,
			lastname,
			avatar: 'https://via.placeholder.com/64',
			party: [movingForwardParty, democratsParty, pheuThaiParty, bhumjaithaiParty][i % 4],
			role: 'สส. บัญชีรายชื่อ',
			isActive: Math.random() > 0.05,
			...(overwrite ? overwrite(i) : {})
		};
	});

const mockPoliticianGroupsWithSubgroups = (
	names: string[],
	isSenates: boolean
): PoliticianGroupBy =>
	names.map((name) => ({
		name,
		subgroups: mockPartySubgroups(isSenates)
	}));

const mockPartySubgroups = (isSenates: boolean): PoliticianGroup[] =>
	(isSenates
		? ['โดยตำแหน่ง', 'เลือกโดยคสช', 'เลือกกันเอง'].map((name) => ({
				name,
				members: mockPoliticianSummaries(randomIntBetween(5, 10), () => ({
					party: undefined,
					role: name
				}))
		  }))
		: [movingForwardParty, democratsParty, pheuThaiParty, bhumjaithaiParty].map((party) => ({
				name: party.name,
				icon: party.logo,
				members: mockPoliticianSummaries(randomIntBetween(5, 10), () => ({ party }))
		  }))
	)
		.filter(({ members }) => members.length > 0)
		.sort((a, z) => z.members.length - a.members.length);

const randomIntBetween = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;
