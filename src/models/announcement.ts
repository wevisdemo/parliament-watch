export interface Announcement {
	title?: string;
	text: string;
	dateStart: Date;
	dateEnd: Date;
	link?: string;
	bgColor?: `bg-${string}`;
	iconType?: 'info' | 'help' | 'warning' | 'success';
}
