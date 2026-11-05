import { faReact } from '@fortawesome/free-brands-svg-icons/faReact';
import { faTypescript } from '@fortawesome/free-brands-svg-icons/faTypescript';
import { faNodeJs } from '@fortawesome/free-brands-svg-icons/faNodeJs';

const technologies = [
  { name: 'React', icon: faReact },
  { name: 'TypeScript', icon: faTypescript },
  { name: 'Node.js', icon: faNodeJs },
  { name: 'Firebase', icon: 'firebase' },
  { name: 'Supabase', icon: 'supabase' },
  { name: 'Vercel', icon: 'vercel' },
  { name: 'APIs e integrações', icon: 'api' },
] as const;

function TechnologyIcon({ icon }: { icon: (typeof technologies)[number]['icon'] }) {
  if (typeof icon !== 'string') {
    const [width, height, , , path] = icon.icon;
    return <svg viewBox={`0 0 ${width} ${height}`} fill="currentColor" aria-hidden="true"><path d={path as string} /></svg>;
  }
  if (icon === 'firebase') return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 24.6 9.6 2.8l5.1 9.6 3.6-6.8L27 24.6 16 30 5 24.6Z" fill="currentColor"/><path d="m5 24.6 9.7-12.2L16 30 5 24.6Z" fill="currentColor" opacity=".6"/><path d="m16 30 2.3-24.4L27 24.6 16 30Z" fill="currentColor" opacity=".8"/></svg>;
  if (icon === 'supabase') return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M17.9 2.5c.9-1.1 2.7-.5 2.7.9v12.1h7.1c1.3 0 2 1.5 1.2 2.5L14.1 29.5c-1 1.1-2.7.4-2.7-1V16.5H4.3c-1.3 0-2-1.6-1.1-2.5L17.9 2.5Z" fill="currentColor"/></svg>;
  if (icon === 'vercel') return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 3 31 29H1L16 3Z" fill="currentColor"/></svg>;
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="7" cy="16" r="3"/><circle cx="25" cy="7" r="3"/><circle cx="25" cy="25" r="3"/><path d="m10 14.7 12-6M10 17.3l12 6"/></svg>;
}

export default function TechnologyMarquee() {
  return <div className="pg-stack" role="group" aria-label="Tecnologias utilizadas">
    <div className="pg-stack-track">
      {[0, 1].map(copy => <div className="pg-stack-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {technologies.map(({ name, icon }) => <span className="pg-stack-icon" key={name} title={name}><TechnologyIcon icon={icon}/><span>{name}</span></span>)}
      </div>)}
    </div>
  </div>;
}
