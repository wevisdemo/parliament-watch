import { readdirSync } from 'fs';
import { join } from 'path';

const STATIC_FOLDER = 'static';

export class StaticImageResolver {
	basePath: string;
	images: string[];
	placeholder: string;

	constructor(basePath: string, placeholder = '_placeholder.webp') {
		this.basePath = basePath;
		this.images = readdirSync(join(STATIC_FOLDER, basePath));

		if (!this.images.includes(placeholder)) {
			throw `Placeholder image: ${placeholder} not found`;
		}

		this.placeholder = join(basePath, placeholder);
	}

	resolve(name: string) {
		if (this.images.includes(name)) {
			return join(this.basePath, name);
		}

		return this.placeholder;
	}
}
