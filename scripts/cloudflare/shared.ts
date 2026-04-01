import Cloudflare from 'cloudflare';

const BULK_OPERATION_POLL_INTERVAL_MS = 2_000;
const BULK_OPERATION_TIMEOUT_MS = 60_000;

export function getRequiredEnv(name: string): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export function getCloudflareEnv() {
	return {
		apiToken: getRequiredEnv('CLOUDFLARE_API_TOKEN'),
		accountId: getRequiredEnv('CLOUDFLARE_ACCOUNT_ID'),
		listId: getRequiredEnv('CLOUDFLARE_RUNNER_IP_LIST_ID')
	};
}

export function getRunnerListComment(): string {
	const runId = getRequiredEnv('GITHUB_RUN_ID');
	const repository = getRequiredEnv('GITHUB_REPOSITORY');

	return `GitHub Actions runner for ${repository} run ${runId}`;
}

export async function getRunnerIp(): Promise<string> {
	const response = await fetch('https://api.ipify.org');

	if (!response.ok) {
		throw new Error(`Failed to retrieve runner IP: ${response.status} ${response.statusText}`);
	}

	return response.text();
}

export function createClient(apiToken: string): Cloudflare {
	return new Cloudflare({ apiToken });
}

export async function waitForBulkOperation(
	client: Cloudflare,
	accountId: string,
	operationId: string
): Promise<void> {
	const deadline = Date.now() + BULK_OPERATION_TIMEOUT_MS;

	while (Date.now() < deadline) {
		const operation = await client.rules.lists.bulkOperations.get(operationId, {
			account_id: accountId
		});

		if (operation.status === 'completed') {
			return;
		}

		if (operation.status === 'failed') {
			throw new Error(`Cloudflare list update failed: ${operation.error}`);
		}

		await new Promise((resolve) => setTimeout(resolve, BULK_OPERATION_POLL_INTERVAL_MS));
	}

	throw new Error(`Timed out waiting for Cloudflare bulk operation ${operationId}`);
}
