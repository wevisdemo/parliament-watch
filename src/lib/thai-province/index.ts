import { csvParse, autoType } from 'd3';
import { z } from 'zod';
import rawProvince from './provinces.csv?raw';

const provinceSchema = z.array(
	z.object({
		ProvinceNameThai: z.string(),
		Region_RDPB: z.string()
	})
);

const provinces = provinceSchema.parse(csvParse(rawProvince, autoType));

export const provinceRegionMap = new Map<string, string>(
	provinces.map(({ ProvinceNameThai, Region_RDPB }) => [
		ProvinceNameThai.replace('จังหวัด', ''),
		Region_RDPB
	])
);
