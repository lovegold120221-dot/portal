export type ServiceAvailability = 'installed' | 'beta' | 'alpha' | 'official'

export type Service = {
  slug: string
  name: string
  description: string
  availability: ServiceAvailability
  official: boolean
  /** Our app connection state. false = not yet connected (shows "Connect"). */
  connected: boolean
}

/**
 * Supabase integrations / wrappers available to connect from the platform.
 * These mirror the Supabase integration catalog. They are not connected yet
 * (connected: false) — the "Connect" action will be wired to Supabase soon.
 */
export const supabaseIntegrations: Service[] = [
  {
    slug: 'data_api',
    name: 'Data API',
    description: 'Auto-generate an API directly from your database schema.',
    availability: 'installed',
    official: true,
    connected: false,
  },
  {
    slug: 'vault',
    name: 'Vault',
    description: 'Application level encryption for your project.',
    availability: 'beta',
    official: true,
    connected: false,
  },
  {
    slug: 'airtable_wrapper',
    name: 'Airtable Wrapper',
    description: 'No-code database and spreadsheet platform.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'auth0_wrapper',
    name: 'Auth0 Wrapper',
    description: 'Identity and access management platform.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'bigquery_wrapper',
    name: 'BigQuery Wrapper',
    description: 'Serverless data warehouse and analytics.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'cal_wrapper',
    name: 'Cal.com Wrapper',
    description: 'Cal.com is a scheduling platform.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'calendly_wrapper',
    name: 'Calendly Wrapper',
    description: 'Calendly is a scheduling platform.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'clerk_wrapper',
    name: 'Clerk Wrapper',
    description: 'User Management Platform.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'clickhouse_wrapper',
    name: 'ClickHouse Wrapper',
    description: 'Column-oriented analytics database.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'cfd1_wrapper',
    name: 'Cloudflare D1 Wrapper',
    description:
      'Read and write data from Cloudflare D1 databases using the Wasm FDW.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'cognito_wrapper',
    name: 'Cognito Wrapper',
    description: 'AWS user authentication and authorization.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'cron',
    name: 'Cron',
    description: 'Schedule recurring Jobs in Postgres.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'database_webhooks',
    name: 'Database Webhooks',
    description:
      'Send real-time data from your database to another system when a table event occurs.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'firebase_wrapper',
    name: 'Firebase Wrapper',
    description: 'Backend-as-a-Service with real-time database.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'graphiql',
    name: 'GraphiQL',
    description: 'Run GraphQL queries through our interactive in-browser IDE.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'hubspot_wrapper',
    name: 'HubSpot Wrapper',
    description: 'Query and sync HubSpot CRM data using the Wasm FDW.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'iceberg_wrapper',
    name: 'Iceberg Wrapper',
    description: 'Iceberg is a data warehouse.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'logflare_wrapper',
    name: 'Logflare Wrapper',
    description: 'Log management and analytics service.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'mssql_wrapper',
    name: 'Microsoft SQL Server Wrapper',
    description: 'Microsoft SQL Server database.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'notion_wrapper',
    name: 'Notion Wrapper',
    description:
      'Notion provides a versatile, ready-to-use solution for managing your data.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'orb_wrapper',
    name: 'Orb Wrapper',
    description: 'Usage-based billing and metering platform.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'paddle_wrapper',
    name: 'Paddle Wrapper',
    description: 'Subscription billing and payments platform.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'queues',
    name: 'Queues',
    description: 'Lightweight message queue in Postgres.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'redis_wrapper',
    name: 'Redis Wrapper',
    description: 'In-memory data structure store.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 's3_vectors_wrapper',
    name: 'S3 Vectors Wrapper',
    description: 'Cloud storage service for high-dimensional vectors.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 's3_wrapper',
    name: 'S3 Wrapper',
    description: 'Cloud object storage service.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'slack_wrapper',
    name: 'Slack Wrapper',
    description:
      'Query Slack workspaces, channels, messages, users, files, and more via the Slack API.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'snowflake_wrapper',
    name: 'Snowflake Wrapper',
    description: 'Cloud data warehouse platform.',
    availability: 'official',
    official: true,
    connected: false,
  },
  {
    slug: 'stripe_sync_engine',
    name: 'Stripe Sync Engine',
    description:
      'Continuously sync your payments, customer, and other data from Stripe to your Postgres database.',
    availability: 'alpha',
    official: true,
    connected: false,
  },
  {
    slug: 'stripe_wrapper',
    name: 'Stripe Wrapper',
    description: 'Payment processing and subscription management.',
    availability: 'official',
    official: true,
    connected: false,
  },
]
