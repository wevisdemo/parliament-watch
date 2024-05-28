import rawProvince from './provinces.csv?raw';
import { Table, Column, parseCSVFromString } from 'sheethuahua';

const provinceTable = Table({
	ProvinceNameThai: Column.String(),
	Region_RDPB: Column.String()
});

const provinces = await parseCSVFromString(rawProvince, provinceTable);

export const provinceRegionMap = new Map<string, string>(
	provinces.map(({ ProvinceNameThai, Region_RDPB }) => [
		ProvinceNameThai.replace('จังหวัด', ''),
		Region_RDPB
	])
);
