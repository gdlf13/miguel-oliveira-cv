# Website CV — Miguel Oliveira

Website pessoal / CV online com portfolio de projectos.

**Stack:** Next.js 16 + Tailwind CSS 4 + TypeScript
**Deploy:** Vercel (CI/CD automático via GitHub)

## Executar localmente

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Estrutura

```
src/
├── app/
│   ├── layout.tsx      ← metadata, SEO, fonts
│   ├── page.tsx        ← página principal (single-page)
│   └── globals.css     ← estilos globais, dark mode, animações
├── components/
│   ├── Header.tsx      ← nav fixa com dark mode toggle
│   ├── Hero.tsx        ← nome, tagline, foto, CTAs
│   ├── Highlights.tsx  ← bullets de destaques
│   ├── Projects.tsx    ← grid de cartões de projectos
│   ├── ProjectCard.tsx ← cartão individual
│   ├── ThemeToggle.tsx ← botão dark/light mode
│   └── Footer.tsx      ← contactos e links
└── data/
    └── projects.ts     ← dados dos 10 projectos
```

## Manutenção

### Alterar texto
- Editar os ficheiros em `src/components/` (Hero.tsx, Highlights.tsx, etc.)
- O texto está directamente nos componentes, em PT-PT

### Trocar imagens dos projectos
1. Colocar a nova imagem (PNG/JPG, 1600x900 recomendado) em `public/images/projects/`
2. Em `src/data/projects.ts`, alterar o campo `image` do projecto correspondente
3. Exemplo: `image: "/images/projects/jogaletras.png"`

### Adicionar um novo projecto
1. Em `src/data/projects.ts`, adicionar um novo objecto ao array `projects`:
```ts
{
  slug: "nome-do-projecto",
  title: "Nome do Projecto",
  description: "Descrição curta em 1 frase.",
  category: "Educação", // ou "Agentes", "Dados", "Apps"
  github: "https://github.com/gdlf13/nome-repo",
  demo: null, // ou URL da demo
  image: "/images/projects/nome-do-projecto.svg",
}
```
2. Colocar a imagem/thumbnail correspondente em `public/images/projects/`

### Actualizar o CV
1. Substituir o ficheiro `public/cv/CV_MiguelOliveira_2026.pdf` pelo novo
2. Se o nome do ficheiro mudar, actualizar o link em:
   - `src/components/Hero.tsx` (botão "Ver CV")
   - `src/components/Header.tsx` (link "CV" na nav)

### Alterar a foto de perfil
1. Substituir `public/images/profile.png` pela nova foto
2. Formato recomendado: quadrado (pelo menos 400x400px)

### Dark mode
- O toggle está no header (ícone sol/lua)
- Cores do dark mode definidas em `src/app/globals.css` (classe `.dark`)

## Deploy via Vercel

1. Criar repositório no GitHub e fazer push
2. Em [vercel.com](https://vercel.com), importar o repositório
3. O deploy é automático a cada push para `main`
4. Para domínio personalizado: Settings > Domains no painel Vercel
