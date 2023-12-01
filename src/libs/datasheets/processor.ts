import { csv, autoType } from 'd3';
import { type AnyZodObject, type ZodEffects, z } from 'zod';

export const removeNullProperties = (row: object) =>
	Object.entries(row).reduce<{ [key: string]: unknown }>(
		(output, [key, value]) => (value !== null ? { ...output, [key]: value } : output),
		{}
	);

export async function fetchAndParseSheet<Input extends AnyZodObject, Output>(
	sheet: string,
	rowSchema: ZodEffects<Input, Output>
) {
	const data = await csv(
		`https://docs.google.com/spreadsheets/d/1SbX2kgAGsslbhGuB-EI_YdSAnIt3reU1_OEtWmDVOVk/gviz/tq?tqx=out:csv&sheet=${sheet}`,
		(row) => removeNullProperties(autoType(row))
	);

	return z.array(rowSchema).parse(data);
}
