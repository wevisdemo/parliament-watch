import {
	createClient,
	getCloudflareEnv,
	getRunnerListComment,
	getRunnerIp,
	waitForBulkOperation
} from './shared.js';

async function main(): Promise<void> {
	const { apiToken, accountId, listId } = getCloudflareEnv();

	const runnerIp = await getRunnerIp();
	const client = createClient(apiToken);
	const result = await client.rules.lists.items.create(listId, {
		account_id: accountId,
		body: [
			{
				ip: runnerIp,
				comment: getRunnerListComment()
			}
		]
	});

	await waitForBulkOperation(client, accountId, result.operation_id);
	console.log(`Added runner IP ${runnerIp} to Cloudflare list ${listId}`);
}

await main();
