import { BrainCircuit, Briefcase, Cloud, Gauge, Network, ShieldCheck, Layers, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  'system-design': Network,
  'devops-cloud': Cloud,
  cybersecurity: ShieldCheck,
  'ai-engineering': BrainCircuit,
  'observability-reliability': Gauge,
  'product-business': Briefcase,
};

export function PillarIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = ICONS[slug] ?? Layers;
  return <Icon className={className} aria-hidden />;
}
