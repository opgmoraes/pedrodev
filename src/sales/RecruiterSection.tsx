import ArrowIcon from "../components/ArrowIcon";
import { BRAND } from "../lib/brand";
import { faJs } from "@fortawesome/free-brands-svg-icons/faJs";
import { faReact } from "@fortawesome/free-brands-svg-icons/faReact";
import { faHtml5 } from "@fortawesome/free-brands-svg-icons/faHtml5";
import { faCss3Alt } from "@fortawesome/free-brands-svg-icons/faCss3Alt";
import { faNodeJs } from "@fortawesome/free-brands-svg-icons/faNodeJs";
import { faGitAlt } from "@fortawesome/free-brands-svg-icons/faGitAlt";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";

type Technology = { name: string; icon?: typeof faReact; glyph?: string };
const groups: {title: string; items: Technology[]}[] = [
  {title: "Front-end", items: [{name:"JavaScript",icon:faJs},{name:"TypeScript",glyph:"TS"},{name:"React",icon:faReact},{name:"HTML",icon:faHtml5},{name:"CSS",icon:faCss3Alt},{name:"Tailwind",glyph:"≈"}]},
  {title: "Back-end & dados", items: [{name:"Node.js",icon:faNodeJs},{name:"Express",glyph:"ex"},{name:"Firebase",glyph:"FB"},{name:"Supabase",glyph:"SB"},{name:"SQLite",glyph:"SQL"}]},
  {title: "Ferramentas", items: [{name:"Git",icon:faGitAlt},{name:"GitHub",icon:faGithub},{name:"Vercel",glyph:"▲"},{name:"APIs REST",glyph:"{}"},{name:"Integrações IA",glyph:"AI"}]},
];

export default function RecruiterSection() {
  return (
    <section className="recruiter-section recruiter-compact studio-section" id="recrutadores" aria-labelledby="recruiter-title">
      <span id="sobre" className="studio-anchor" />
      <div>
        <div className="recruiter-intro">
          <div>
            <p className="studio-eyebrow">Quem desenvolve seu projeto</p>
            <h2 id="recruiter-title">Você conversa com<br /><em>quem faz acontecer.</em></h2>
          </div>
          <div className="recruiter-summary">
            <p>Sou Pedro Gomes, desenvolvedor web formado em Análise e Desenvolvimento de Sistemas, em Luziânia, GO. Cuido da interface, do código e das integrações do seu projeto. Você fala comigo para alinhar o que precisa e acompanhar cada etapa.</p>
            <a className="studio-text-link" href={BRAND.linkedin} target="_blank" rel="noopener noreferrer">Conhecer meu trabalho no LinkedIn <span aria-hidden="true"><ArrowIcon /></span></a>
          </div>
        </div>
        <div className="tech-groups" aria-label="Tecnologias e ferramentas">
          {groups.map(group => (
            <div className="tech-group" key={group.title}>
              <h3>{group.title}</h3>
              <ul>{group.items.map(tech => (
                <li key={tech.name}>
                  {tech.icon ? <svg viewBox={`0 0 ${tech.icon.icon[0]} ${tech.icon.icon[1]}`} aria-hidden="true"><path d={tech.icon.icon[4] as string} /></svg> : <span className="tech-glyph" aria-hidden="true">{tech.glyph}</span>}
                  <span>{tech.name}</span>
                </li>
              ))}</ul>
            </div>
          ))}
        </div>
        <div className="recruiter-contact">
          <p>Do primeiro contato à entrega.<br /><strong>Vamos construir seu projeto.</strong></p>
          <div className="recruiter-actions">
            <a className="studio-button" href="https://wa.me/5561936182176" target="_blank" rel="noopener noreferrer">Falar com Pedro <span aria-hidden="true"><ArrowIcon /></span></a>
            <a className="recruiter-email" href={`mailto:${BRAND.email}?subject=Projeto%20de%20desenvolvimento`}>Enviar e-mail <span aria-hidden="true"><ArrowIcon /></span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
