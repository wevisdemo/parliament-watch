import { describe, expect, it } from 'vitest';
import { removeNullProperties } from '../../datasheets/processor';

describe('removeNullProperties', () => {
	it('should remove null property from the object', () => {
		const object = {
			a: '',
			b: 1,
			c: false,
			d: null,
			e: new Date()
		};

		const { d, ...expectOutput } = object;

		const output = removeNullProperties(object);

		expect(output).toEqual(expectOutput);
	});
});
