import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  FileCheck2,
  Globe2,
  GraduationCap,
  Home,
  Landmark,
  Plane,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  'graduation-cap': GraduationCap,
  'badge-check': BadgeCheck,
  briefcase: BriefcaseBusiness,
  home: Home,
  users: Users,
  plane: Plane,
  building: Building2,
  'trending-up': TrendingUp,
  landmark: Landmark,
  'file-check': FileCheck2,
  globe: Globe2,
};

export function ServiceIcon({ name, size = 21, className }: { name: string; size?: number; className?: string }) {
  const Icon = icons[name] || Globe2;
  return <Icon size={size} strokeWidth={1.8} className={className} aria-hidden="true" />;
}
