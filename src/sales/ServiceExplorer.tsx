import { useState } from 'react';
import ArrowIcon from '../components/ArrowIcon';
import { contactLink } from '../lib/brand';
const services = [
 {name:'Landing pages', goal:'Apresente sua oferta. Facilite a decisão.', text:'Para campanhas, lançamentos e serviços que precisam de uma página com foco. Mensagem, argumentos e contato organizados na ordem certa.', image:'/assets/projetos/bitto-landing/capturas/desktop-1.webp', example:'BITTO Landing Page', items:['Estrutura da oferta','Design responsivo','Contato e integrações']},
 {name:'Sites institucionais', goal:'Sua marca, apresentada com confiança.', text:'Um lugar próprio para mostrar quem você é, o que oferece e por que faz sentido conversar com sua empresa.', image:'/assets/projetos/bagagemdev/capturas/desktop-1.webp', example:'Bagagem Dev · referência de interface', items:['Identidade da marca','Serviços e conteúdos','Estrutura para buscas']},
 {name:'Sistemas web', goal:'Menos tarefas soltas. Mais organização.', text:'Painéis, áreas de acesso e fluxos pensados para o seu dia a dia. O escopo parte da rotina que você quer simplificar.', image:'/assets/projetos/bitto/galeria/desktop-1.webp', example:'BITTO Sistema', items:['Fluxos sob medida','Dados organizados','Integrações definidas no escopo']}
];
export default function ServiceExplorer(){
 const [selected,setSelected]=useState(0); const service=services[selected];
 return <div className="service-explorer">
  <div className="service-options" role="group" aria-label="Conhecer os serviços">{services.map((s,i)=><button type="button" key={s.name} aria-pressed={i===selected} aria-controls="service-preview" onClick={()=>setSelected(i)}>{s.name}<ArrowIcon direction="right" /></button>)}</div>
  <div className="service-preview" id="service-preview" aria-live="polite">
   <div className="service-preview-copy" key={service.name}><h3>{service.goal}</h3><p>{service.text}</p><ul>{service.items.map(item=><li key={item}>{item}</li>)}</ul><a className="studio-button" href={contactLink('Olá Pedro, quero conversar sobre '+service.name.toLowerCase()+'.')} target="_blank" rel="noopener noreferrer">Quero essa solução <span><ArrowIcon /></span></a></div>
   <figure key={service.image}><img src={service.image} alt={service.example} width="1400" height="900" loading="lazy" /><figcaption>{service.example}</figcaption></figure>
  </div>
 </div>;
}
