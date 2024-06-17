import type { StaticImageResolver } from '$lib/datasheets/image';
import { Table, Column, type RowType } from 'sheethuahua';

const DEFAULT_PARTY_COLOR = '#F4F4F4';

export const partyTable = Table('Parties', {
	name: Column.String(),
	color: Column.OptionalString()
});

export const transformParty = (
	{ name, color }: RowType<typeof partyTable>,
	imageResolver: StaticImageResolver
) => ({
	name,
	color: color ?? DEFAULT_PARTY_COLOR,
	logo: imageResolver.resolve(`${name}.webp`)
});

export type Party = ReturnType<typeof transformParty>;
