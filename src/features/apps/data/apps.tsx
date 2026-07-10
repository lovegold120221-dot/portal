import {
  Brain,
  Mic,
  MessageSquare,
  Sparkles,
  Bot,
  GraduationCap,
  AudioLines,
  Database,
  Boxes,
  Network,
  Orbit,
  Scan,
  ScanText,
} from 'lucide-react'
import {
  IconSlack,
  IconGithub,
  IconNotion,
  IconFigma,
  IconStripe,
  IconGmail,
  IconDiscord,
} from '@/assets/brand-icons'

type Download = { label: string; url: string | null }

export type EburonApp = {
  name: string
  logo?: React.ReactNode
  icon: string
  desc: string
  color: string
  url: string
  downloads: Download[]
  developers?: string[]
  status?: string
}

const defaultDownloads = (slug: string): Download[] => [
  {
    label: 'macOS (Apple Silicon)',
    url: `https://eburon.ai/download/${slug}/mac-arm`,
  },
  {
    label: 'macOS (Intel)',
    url: `https://eburon.ai/download/${slug}/mac-intel`,
  },
  {
    label: 'Debian / Ubuntu',
    url: `https://eburon.ai/download/${slug}/debian`,
  },
  { label: 'Windows', url: `https://eburon.ai/download/${slug}/windows` },
  { label: 'APK', url: null },
]

export const eburonApps: EburonApp[] = [
  {
    name: 'Eburon Chat',
    logo: <MessageSquare className='size-5' />,
    icon: 'MessageSquare',
    desc: 'Enterprise messaging and collaboration with AI assistants.',
    color:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    url: 'https://chat.eburon.ai/',
    downloads: defaultDownloads('chat'),
    developers: ['Emil Alvaro'],
    status: 'Stable',
   },
   {
    name: 'Eburon Dual',
    logo: <Boxes className='size-5' />,
    icon: 'Boxes',
    desc: 'Synchronized dual-environment workspace for parallel AI workflows.',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    url: 'https://dual.eburon.ai/',
    downloads: defaultDownloads('dual'),
    developers: ['Emil Alvaro'],
    status: 'Beta',
   },
   {
    name: 'Eburon Class',
    logo: <GraduationCap className='size-5' />,
    icon: 'GraduationCap',
    desc: 'AI-powered learning platform with adaptive tutoring and courses.',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
    url: 'https://class.eburon.ai/',
    downloads: defaultDownloads('class'),
    developers: ['Emil Alvaro'],
    status: 'Stable',
   },
   {
    name: 'Eburon Humanoid',
    logo: <Bot className='size-5' />,
    icon: 'Bot',
    desc: 'Humanoid robotics control and embodied AI orchestration suite.',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
    url: 'https://humanoid.eburon.ai/',
    downloads: defaultDownloads('humanoid'),
    developers: ['Emil Alvaro'],
    status: 'Alpha',
   },
   {
    name: 'Eburon App',
    logo: <Brain className='size-5' />,
    icon: 'Brain',
    desc: 'Core AI engine powering intelligent automation across your workflow.',
    color:
      'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
    url: 'https://app.eburon.ai/',
    downloads: defaultDownloads('app'),
    developers: ['Emil Alvaro'],
    status: 'Stable',
   },
   {
    name: 'Eburon Echo',
    logo: <AudioLines className='size-5' />,
    icon: 'AudioLines',
    desc: 'Text-to-speech and voice synthesis with production-grade quality.',
    color:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    url: 'https://echo.eburon.ai/',
    downloads: defaultDownloads('echo'),
    developers: ['Emil Alvaro'],
    status: 'Stable',
   },
   {
    name: 'Eburon Beatrice',
    logo: <Sparkles className='size-5' />,
    icon: 'Sparkles',
    desc: 'Creative studio for generative media, design, and rapid prototyping.',
    color:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    url: 'https://beatrice.eburon.ai/',
    downloads: defaultDownloads('beatrice'),
    developers: ['Emil Alvaro'],
    status: 'Beta',
   },
   {
    name: 'Eburon Miko',
    logo: <Mic className='size-5' />,
    icon: 'Mic',
    desc: 'Conversational voice agent with real-time multilingual translation.',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    url: 'https://eburon.ai/miko/',
    downloads: defaultDownloads('miko'),
    developers: ['Emil Alvaro'],
    status: 'Stable',
   },
   {
    name: 'Eburon RAG Data',
    logo: <Database className='size-5' />,
    icon: 'Database',
    desc: 'Retrieval-augmented generation and knowledge base management.',
    color:
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    url: 'https://ragdata.eburon.ai/',
    downloads: defaultDownloads('ragdata'),
    developers: ['Emil Alvaro'],
    status: 'Stable',
   },
   {
    name: 'Eburon API',
    logo: <Network className='size-5' />,
    icon: 'Network',
    desc: 'Developer API gateway for model inference and integrations.',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    url: 'https://api.eburon.ai/',
    downloads: defaultDownloads('api'),
    developers: ['Emil Alvaro'],
    status: 'Stable',
   },
   {
    name: 'Eburon Orbit',
    logo: <Orbit className='size-5' />,
    icon: 'Orbit',
    desc: 'Mission control for orchestrating agents, tasks, and deployments.',
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
    url: 'https://orbit.eburon.ai/',
    downloads: defaultDownloads('orbit'),
    developers: ['Emil Alvaro'],
    status: 'Beta',
   },
   {
    name: 'Eburon Scanner',
    logo: <Scan className='size-5' />,
    icon: 'Scan',
    desc: 'AI-powered codebase scanning for security, quality, and compliance.',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
    url: 'https://eburon.ai/scanner/',
    downloads: defaultDownloads('scanner'),
    developers: ['Emil Alvaro'],
    status: 'Alpha',
   },
   {
    name: 'Eburon OCR',
    logo: <ScanText className='size-5' />,
    icon: 'ScanText',
    desc: 'Optical character recognition and document digitization with AI.',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    url: 'https://eburon.ai/ocr/',
    downloads: defaultDownloads('ocr'),
    developers: ['Emil Alvaro'],
    status: 'Alpha',
   },
]

export const services = [
  {
    name: 'Slack',
    logo: <IconSlack />,
    connected: true,
    desc: 'Integrate Slack for efficient team communication.',
  },
  {
    name: 'GitHub',
    logo: <IconGithub />,
    connected: true,
    desc: 'Streamline code management with GitHub integration.',
  },
  {
    name: 'Notion',
    logo: <IconNotion />,
    connected: true,
    desc: 'Effortlessly sync Notion pages for seamless collaboration.',
  },
  {
    name: 'Figma',
    logo: <IconFigma />,
    connected: true,
    desc: 'View and collaborate on Figma designs in one place.',
  },
  {
    name: 'Stripe',
    logo: <IconStripe />,
    connected: false,
    desc: 'Easily manage Stripe transactions and payments.',
  },
  {
    name: 'Gmail',
    logo: <IconGmail />,
    connected: true,
    desc: 'Access and manage Gmail messages effortlessly.',
  },
  {
    name: 'Discord',
    logo: <IconDiscord />,
    connected: false,
    desc: 'Connect with Discord for seamless team communication.',
  },
]
