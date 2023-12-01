import { fetchAndParseSheet } from './processor';
import { assemblySchema } from '../../models/assembly';

export const assemblies = await fetchAndParseSheet('Assemblies', assemblySchema);
