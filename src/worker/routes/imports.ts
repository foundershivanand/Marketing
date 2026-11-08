import { Hono } from 'hono';
import { getDatabase } from '../../lib/database/db';
import { DestinationsRepository } from '../../lib/database/destinations.repo';
import { GitHubImporter } from '../../lib/importers/github-importer';
import { logAudit } from '../../lib/audit/logger';

export const importsRouter = new Hono();

importsRouter.post('/github', async (c) => {
  const db = getDatabase(c.env);
  const repo = new DestinationsRepository(db);
  const importer = new GitHubImporter(repo);

  let customMarkdown: string | undefined;
  try {
    const body = await c.req.json();
    customMarkdown = body?.markdown;
  } catch {
    // Empty body or not JSON, proceed with live fetch
  }

  const result = await importer.importFromGitHub(customMarkdown);

  await logAudit(db, {
    action: 'github_import_executed',
    resourceType: 'destinations',
    details: { imported: result.imported, errors: result.errors.length },
  });

  return c.json({
    success: true,
    result,
  });
});
