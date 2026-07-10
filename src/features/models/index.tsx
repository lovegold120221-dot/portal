import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import {
  Brain,
  Cpu,
  Wrench,
  FlaskConical,
  Eye,
  Terminal,
  Cog,
  Sparkles,
  Zap,
  Star,
  Rocket,
  Orbit,
  Microchip,
  Shield,
  Key,
  Server,
  Monitor,
  Database,
  Cloud,
  SearchCode,
  CheckCircle,
  TestTube,
  GitMerge,
  Image,
  Bug,
  Accessibility,
  FileText,
  Workflow,
  Package,
  Palette,
  Layout,
  Camera,
  MessageSquare,
  Filter,
  Type,
  DraftingCompass,
  Hammer,
  Scan,
  Compass,
  ClipboardList,
  RefreshCw,
  Box,
  Video,
  Lock,
  Layers,
  ScrollText,
  GitBranch,
} from 'lucide-react'
import { type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

type Model = {
  name: string
  tag: string
  size: string
  context: string
  capabilities: string[]
  category: string
  description: string
  ollamaUrl: string
  icon: LucideIcon
}

const models: Model[] = [
  {
    name: 'eburon-pro',
    tag: 'latest',
    size: '9.6GB',
    context: '128K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'core',
    description:
      'General-purpose AI agent with vision, tool use, and reasoning.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-pro',
    icon: Sparkles,
  },
  {
    name: 'eburon-pro-autonomous',
    tag: 'latest',
    size: '9.6GB',
    context: '128K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'core',
    description: 'Autonomous mode with self-directed task execution.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-pro-autonomous',
    icon: Zap,
  },
  {
    name: 'alpha',
    tag: 'latest',
    size: '7.2GB',
    context: '96K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'core',
    description: 'Lightweight general model for everyday tasks.',
    ollamaUrl: 'https://ollama.com/eburonpro/alpha',
    icon: Star,
  },
  {
    name: 'beta',
    tag: 'latest',
    size: '4.8GB',
    context: '64K',
    capabilities: ['thinking'],
    category: 'core',
    description: 'Fast, efficient model for quick reasoning tasks.',
    ollamaUrl: 'https://ollama.com/eburonpro/beta',
    icon: Rocket,
  },
  {
    name: 'alphard',
    tag: 'latest',
    size: '12.8GB',
    context: '128K',
    capabilities: ['vision', 'thinking'],
    category: 'core',
    description: 'High-capacity model for complex reasoning and analysis.',
    ollamaUrl: 'https://ollama.com/eburonpro/alphard',
    icon: Orbit,
  },
  {
    name: 'mantis',
    tag: 'latest',
    size: '3.2GB',
    context: '32K',
    capabilities: ['thinking'],
    category: 'core',
    description: 'Minimal footprint for edge and embedded use.',
    ollamaUrl: 'https://ollama.com/eburonpro/mantis',
    icon: Microchip,
  },
  {
    name: 'eburon-admin-engineer',
    tag: 'latest',
    size: '4.2GB',
    context: '64K',
    capabilities: ['vision', 'thinking'],
    category: 'engineering',
    description:
      'Admin panel design, RBAC, and system configuration specialist.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-admin-engineer',
    icon: Shield,
  },
  {
    name: 'eburon-auth-engineer',
    tag: 'latest',
    size: '3.8GB',
    context: '64K',
    capabilities: ['vision', 'thinking'],
    category: 'engineering',
    description:
      'Authentication, OAuth, and authorization architecture expert.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-auth-engineer',
    icon: Key,
  },
  {
    name: 'eburon-backend-engineer',
    tag: 'latest',
    size: '5.1GB',
    context: '96K',
    capabilities: ['vision', 'thinking'],
    category: 'engineering',
    description: 'Server-side logic, API design, and database integration.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-backend-engineer',
    icon: Server,
  },
  {
    name: 'eburon-frontend-engineer',
    tag: 'latest',
    size: '4.5GB',
    context: '64K',
    capabilities: ['vision', 'thinking'],
    category: 'engineering',
    description: 'UI component development and responsive design specialist.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-frontend-engineer',
    icon: Monitor,
  },
  {
    name: 'eburon-database-architect',
    tag: 'latest',
    size: '4.0GB',
    context: '64K',
    capabilities: ['vision', 'thinking'],
    category: 'engineering',
    description: 'Schema design, query optimization, and data modeling expert.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-database-architect',
    icon: Database,
  },
  {
    name: 'eburon-devops-engineer',
    tag: 'latest',
    size: '4.6GB',
    context: '64K',
    capabilities: ['vision', 'thinking'],
    category: 'engineering',
    description: 'CI/CD, infrastructure-as-code, and deployment automation.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-devops-engineer',
    icon: Cloud,
  },
  {
    name: 'eburon-build-validator',
    tag: 'latest',
    size: '2.8GB',
    context: '32K',
    capabilities: ['vision', 'thinking'],
    category: 'quality',
    description: 'Build configuration validation and dependency checking.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-build-validator',
    icon: SearchCode,
  },
  {
    name: 'eburon-dod-checker',
    tag: 'latest',
    size: '2.4GB',
    context: '32K',
    capabilities: ['vision', 'thinking'],
    category: 'quality',
    description: 'Definition of Done compliance verification.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-dod-checker',
    icon: CheckCircle,
  },
  {
    name: 'eburon-automated-qa',
    tag: 'latest',
    size: '3.6GB',
    context: '64K',
    capabilities: ['vision', 'thinking'],
    category: 'quality',
    description: 'End-to-end test generation and quality assurance.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-automated-qa',
    icon: TestTube,
  },
  {
    name: 'eburon-conflict-checker',
    tag: 'latest',
    size: '2.2GB',
    context: '32K',
    capabilities: ['vision', 'thinking'],
    category: 'quality',
    description: 'Merge conflict detection and resolution planning.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-conflict-checker',
    icon: GitMerge,
  },
  {
    name: 'eburon-visual-regression-tester-vision',
    tag: 'latest',
    size: '3.4GB',
    context: '64K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'quality',
    description: 'Visual diff and UI regression testing with screenshots.',
    ollamaUrl:
      'https://ollama.com/eburonpro/eburon-visual-regression-tester-vision',
    icon: Image,
  },
  {
    name: 'eburon-qa-engineer-vision',
    tag: 'latest',
    size: '4.0GB',
    context: '64K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'quality',
    description: 'Comprehensive QA with visual testing and browser automation.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-qa-engineer-vision',
    icon: Bug,
  },
  {
    name: 'eburon-accessibility-auditor-vision',
    tag: 'latest',
    size: '3.2GB',
    context: '64K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'quality',
    description: 'WCAG compliance auditing with visual analysis.',
    ollamaUrl:
      'https://ollama.com/eburonpro/eburon-accessibility-auditor-vision',
    icon: Accessibility,
  },
  {
    name: 'eburon-unit-test-writer',
    tag: 'latest',
    size: '3.0GB',
    context: '48K',
    capabilities: ['vision', 'thinking'],
    category: 'development',
    description: 'Unit test generation with coverage optimization.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-unit-test-writer',
    icon: FileText,
  },
  {
    name: 'eburon-integration-test-writer',
    tag: 'latest',
    size: '3.4GB',
    context: '64K',
    capabilities: ['vision', 'thinking'],
    category: 'development',
    description: 'Integration test creation for API and service boundaries.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-integration-test-writer',
    icon: Workflow,
  },
  {
    name: 'eburon-integration-assembler',
    tag: 'latest',
    size: '3.6GB',
    context: '64K',
    capabilities: ['vision', 'thinking'],
    category: 'development',
    description: 'Service integration and API composition specialist.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-integration-assembler',
    icon: GitBranch,
  },
  {
    name: 'eburon-release-manager',
    tag: 'latest',
    size: '3.0GB',
    context: '48K',
    capabilities: ['vision', 'thinking'],
    category: 'development',
    description:
      'Release planning, changelog generation, and version management.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-release-manager',
    icon: Layers,
  },
  {
    name: 'eburon-docs-writer',
    tag: 'latest',
    size: '2.6GB',
    context: '48K',
    capabilities: ['vision', 'thinking'],
    category: 'development',
    description: 'Technical documentation, API reference, and guides writer.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-docs-writer',
    icon: ScrollText,
  },
  {
    name: 'eburon-ui-designer-vision',
    tag: 'latest',
    size: '4.4GB',
    context: '64K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'design',
    description: 'UI/UX design with visual mockup and prototype generation.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-ui-designer-vision',
    icon: Palette,
  },
  {
    name: 'eburon-admin-designer-vision',
    tag: 'latest',
    size: '4.2GB',
    context: '64K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'design',
    description: 'Admin dashboard and internal tool design specialist.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-admin-designer-vision',
    icon: Layout,
  },
  {
    name: 'eburon-screenshot-analyst-vision',
    tag: 'latest',
    size: '3.0GB',
    context: '48K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'design',
    description: 'Screenshot analysis and UI element extraction.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-screenshot-analyst-vision',
    icon: Camera,
  },
  {
    name: 'eburon-prompt-builder',
    tag: 'latest',
    size: '2.4GB',
    context: '32K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Prompt engineering and optimization assistant.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-prompt-builder',
    icon: MessageSquare,
  },
  {
    name: 'eburon-prompt-classifier',
    tag: 'latest',
    size: '1.8GB',
    context: '32K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Prompt categorization and routing specialist.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-prompt-classifier',
    icon: Filter,
  },
  {
    name: 'eburon-prompt-clarifier',
    tag: 'latest',
    size: '2.0GB',
    context: '32K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Ambiguity detection and prompt refinement.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-prompt-clarifier',
    icon: Type,
  },
  {
    name: 'eburon-blueprint-creator',
    tag: 'latest',
    size: '3.8GB',
    context: '64K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Architecture blueprint and system design generation.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-blueprint-creator',
    icon: DraftingCompass,
  },
  {
    name: 'eburon-blueprint-governor',
    tag: 'latest',
    size: '3.2GB',
    context: '64K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Blueprint validation and architecture governance.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-blueprint-governor',
    icon: Hammer,
  },
  {
    name: 'eburon-feasibility-scanner',
    tag: 'latest',
    size: '2.6GB',
    context: '48K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Technical feasibility assessment and risk analysis.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-feasibility-scanner',
    icon: Scan,
  },
  {
    name: 'eburon-capability-scanner',
    tag: 'latest',
    size: '2.4GB',
    context: '32K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Skill and capability gap analysis for projects.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-capability-scanner',
    icon: Compass,
  },
  {
    name: 'eburon-plan-checker',
    tag: 'latest',
    size: '2.2GB',
    context: '32K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Implementation plan review and consistency checking.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-plan-checker',
    icon: ClipboardList,
  },
  {
    name: 'eburon-gap-filler',
    tag: 'latest',
    size: '3.0GB',
    context: '48K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Requirement gap identification and specification completion.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-gap-filler',
    icon: RefreshCw,
  },
  {
    name: 'eburon-task-packet-generator',
    tag: 'latest',
    size: '2.8GB',
    context: '48K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Task decomposition and work packet generation.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-task-packet-generator',
    icon: Box,
  },
  {
    name: 'eburon-invalidation-monitor',
    tag: 'latest',
    size: '2.0GB',
    context: '32K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Cache invalidation and state consistency monitoring.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-invalidation-monitor',
    icon: Eye,
  },
  {
    name: 'eburon-packaging-worker',
    tag: 'latest',
    size: '2.6GB',
    context: '48K',
    capabilities: ['vision', 'thinking'],
    category: 'ai',
    description: 'Build packaging, bundling, and artifact generation.',
    ollamaUrl: 'https://ollama.com/eburonpro/eburon-packaging-worker',
    icon: Package,
  },
  {
    name: 'media-pipe-eburon',
    tag: 'latest',
    size: '5.6GB',
    context: '96K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'media',
    description: 'Media processing pipeline with video and audio analysis.',
    ollamaUrl: 'https://ollama.com/eburonpro/media-pipe-eburon',
    icon: Video,
  },
  {
    name: 'media-pipe-eburon-sandbox-worker',
    tag: 'latest',
    size: '4.8GB',
    context: '64K',
    capabilities: ['vision', 'tools', 'thinking'],
    category: 'media',
    description: 'Isolated sandbox for media processing and transformation.',
    ollamaUrl: 'https://ollama.com/eburonpro/media-pipe-eburon-sandbox-worker',
    icon: Lock,
  },
]

const categories = [
  { value: 'all', label: 'All Models', icon: Brain },
  { value: 'core', label: 'Core', icon: Cpu },
  { value: 'engineering', label: 'Engineering', icon: Terminal },
  { value: 'quality', label: 'Quality', icon: FlaskConical },
  { value: 'development', label: 'Development', icon: Cog },
  { value: 'design', label: 'Design', icon: Eye },
  { value: 'ai', label: 'AI Tooling', icon: Wrench },
  { value: 'media', label: 'Media', icon: Cpu },
]

const capColors: Record<string, string> = {
  vision:
    'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  tools: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  thinking:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
}

export function Models() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = models
    .filter((m) => category === 'all' || m.category === category)
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
              <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Models</h1>
            <p className='text-muted-foreground'>
              Eburon Pro model catalog — pull and run with Ollama.
            </p>
          </div>
        </div>

        <div className='mt-6'>
          <Tabs value={category} onValueChange={setCategory}>
            <div className='sticky top-0 z-10 -mx-6 flex items-center justify-between bg-background px-6 py-2'>
              <TabsList>
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className='gap-2'
                  >
                    <cat.icon className='size-4' />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Input
                placeholder='Search models...'
                className='h-9 w-56'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Separator className='my-4 shadow-sm' />

            <div className='max-h-[calc(100vh-320px)] overflow-y-auto'>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {filtered.map((model) => (
                  <Card key={model.name} className='hover:shadow-md'>
                    <CardHeader className='p-4 pb-2'>
                      <div className='flex items-start justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 p-2 text-white'>
                            <model.icon className='size-5' />
                          </div>
                          <div>
                            <CardTitle className='text-sm font-semibold'>
                              {model.name}
                            </CardTitle>
                            <CardDescription className='text-xs'>
                              {model.size} · {model.context} context
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='size-8'
                          asChild
                        >
                          <a
                            href={model.ollamaUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <ExternalLink className='size-4' />
                          </a>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className='p-4 pt-2'>
                      <p className='mb-3 text-xs text-muted-foreground'>
                        {model.description}
                      </p>
                      <div className='flex flex-wrap gap-1.5'>
                        {model.capabilities.map((cap) => (
                          <Badge
                            key={cap}
                            variant='outline'
                            className={`text-[10px] ${capColors[cap] || ''}`}
                          >
                            {cap}
                          </Badge>
                        ))}
                      </div>
                      <div className='mt-3'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='w-full text-xs'
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `ollama run eburonpro/${model.name}`
                            )
                          }}
                        >
                          <Terminal className='me-1.5 size-3' />
                          ollama run eburonpro/{model.name}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className='py-12 text-center text-sm text-muted-foreground'>
                  No models found.
                </div>
              )}
            </div>
          </Tabs>
        </div>
              </div>
      </Main>
    </>
  )
}
