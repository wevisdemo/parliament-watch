import rawProvince from './provinces.csv?raw';
import { Column, parseCsv, asString, Tuple, createTransformer } from 'sheethuahua';

const provinceTable = Tuple([
	Column(
		'ProvinceNameThai',
		createTransformer({ decode: (province) => province.replace('จังหวัด', '') })
	),
	Column('Region_RDPB', asString())
]);

export const provinceRegionMap = new Map(parseCsv(rawProvince, provinceTable));
