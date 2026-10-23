import ArrowIcon from "./ArrowIcon";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons/faWhatsapp";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons/faLinkedinIn";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { BRAND, contactLink } from "../lib/brand";

const icons = {
  WhatsApp: faWhatsapp,
  LinkedIn: faLinkedinIn,
  GitHub: faGithub,
  Instagram: faInstagram,
};
export type SocialName = keyof typeof icons;
export function SocialIcon({ name }: { name: SocialName }) {
  const [width, height, , , path] = icons[name].icon;
  return (
    <svg
      width="20"
      height="20"
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {(Array.isArray(path) ? path : [path]).map((d, i) => (
        <path d={d} key={i} />
      ))}
    </svg>
  );
}
export default function SocialLinks({
  className = "",
}: {
  className?: string;
}) {
  const links = [
    ["WhatsApp", contactLink()],
    ["LinkedIn", BRAND.linkedin],
    ["GitHub", BRAND.github],
    ["Instagram", BRAND.instagram],
  ] as const;
  return (
    <nav
      className={`social-links ${className}`}
      aria-label="Contato e redes sociais"
    >
      {links.map(([name, href]) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Abrir ${name}`}
        >
          <span className="social-icon" aria-hidden="true">
            <SocialIcon name={name} />
          </span>
          <span>{name}</span>
          <span className="social-arrow" aria-hidden="true">
            <ArrowIcon />
          </span>
        </a>
      ))}
    </nav>
  );
}
