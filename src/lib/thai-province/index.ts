import rawProvince from './provinces.csv?raw';
import { csvParse, autoType } from 'd3';
import { z } from 'zod';

const provinceSchema = z.array(
	z.object({
		ProvinceNameThai: z.string().trim(),
		Region_RDPB: z.string().trim()
	})
);

const provinces = provinceSchema.parse(csvParse(rawProvince, autoType));

export const provinceRegionMap = new Map<string, string>(
	provinces.map(({ ProvinceNameThai, Region_RDPB }) => [
		ProvinceNameThai.replace('จังหวัด', ''),
		Region_RDPB
	])
);
