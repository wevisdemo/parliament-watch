import { fetchAndParseSheet } from './processor';
import { assemblySchema } from '../../models/assembly';

export const fetchAssemblies = () => fetchAndParseSheet('Assemblies', assemblySchema);
