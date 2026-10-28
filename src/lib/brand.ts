export const BRAND = {
  name: "Pedro Gomes",
  email: "pedrogm.dev@gmail.com",
  phone: "5561936182176",
  instagram: "https://www.instagram.com/pedrogm.dev/",
  linkedin: "https://www.linkedin.com/in/pedrogmdev",
  github: "https://github.com/opgmoraes",
  cinematic: "/assets/perfil/pedro-natural-v2.webp",
  cutout: "/assets/perfil/pedro-recortado.webp",
  photo: "/assets/perfil/foto-perfil.jpg",
};
export const contactLink = (
  message = "Olá Pedro, quero conversar sobre um projeto.",
) => `https://wa.me/${BRAND.phone}?text=${encodeURIComponent(message)}`;
export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
