import {
	createClient,
	getCloudflareEnv,
	getRunnerIp,
	getRunnerListComment,
	waitForBulkOperation
} from './shared.js';

async function main(): Promise<void> {
	const { apiToken, accountId, listId } = getCloudflareEnv();

	const runnerIp = await getRunnerIp();
	const runnerListComment = getRunnerListComment();
	const client = createClient(apiToken);
	const items = await client.rules.lists.items.list(listId, {
		account_id: accountId,
		search: runnerIp
	});

	const matchingItems: Array<{ id: string }> = [];

	for await (const item of items) {
		if ('ip' in item && item.ip === runnerIp && item.comment === runnerListComment) {
			matchingItems.push({ id: item.id });
		}
	}

	if (matchingItems.length === 0) {
		console.log(`No Cloudflare list item found for runner IP ${runnerIp}`);
		return;
	}

	const result = await client.rules.lists.items.delete(listId, {
		account_id: accountId,
		items: matchingItems as never
	});

	await waitForBulkOperation(client, accountId, result.operation_id);
	console.log(`Removed runner IP ${runnerIp} from Cloudflare list ${listId}`);
}

await main();
