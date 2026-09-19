# Acopiara / CE — cartografia de domicílios, população e eleitorado

Site estático. Não há build, não há dependências, não há servidor: são arquivos HTML
autocontidos que funcionam abrindo direto no navegador ou publicados em qualquer
hospedagem de arquivos estáticos.

## Estrutura

    index.html          página inicial
    painel/             painel completo (domicílios, população, eleitores, eleições, Censo)
    planta/             planta urbana por rua
    quadrantes/         residências por quadrante
    docs/               as duas pranchas em PDF
    vercel.json         cabeçalhos e URLs limpas (só usado pela Vercel)

## Publicar na Vercel a partir do GitHub

1. No GitHub, crie um repositório novo — pode ser privado.
2. Envie o conteúdo desta pasta para a raiz do repositório.
   Pelo navegador: "Add file" → "Upload files" → arraste tudo → "Commit changes".
   Pelo terminal:

       git init
       git add .
       git commit -m "cartografia de Acopiara"
       git branch -M main
       git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
       git push -u origin main

3. Em vercel.com, entre com a conta do GitHub, clique em "Add New… → Project",
   escolha o repositório e confirme. Não altere nada nas configurações:
   Framework Preset = "Other", Build Command vazio, Output Directory vazio.
4. Publica em cerca de um minuto. Cada `git push` republica sozinho.

## Alternativas, se preferir

- **Vercel sem GitHub**: em vercel.com/new existe a opção de arrastar a pasta.
  Ou, com Node instalado, rode `npx vercel` dentro desta pasta.
- **GitHub Pages**: envie para o repositório e ative em Settings → Pages →
  Source: "Deploy from a branch" → branch `main`, pasta `/ (root)`. Gratuito e sem
  precisar de outra conta.
- **Netlify Drop**: app.netlify.com/drop aceita arrastar a pasta sem criar conta,
  bom para um teste rápido.

## Antes de trocar de endereço, atenção

As correções de posição das urnas feitas no painel ficam salvas no **navegador**, presas
ao endereço onde o painel estava aberto. Elas **não** acompanham a mudança de domínio.
Se você já corrigiu pinos, abra o painel no endereço antigo, clique em
"Copiar correções feitas" e guarde o texto antes de migrar.

O botão de GPS só funciona em páginas https. Vercel, GitHub Pages e Netlify servem
https por padrão, então funciona nos três.

## Licenças

Dados de origem pública: IBGE (Censo 2022, CNEFE, Malha Territorial), TSE (dados abertos,
pleitos de 2022 e 2024), OpenStreetMap e Google Open Buildings v3.

As camadas do OpenStreetMap e do Google Open Buildings são distribuídas sob **ODbL**, que
exige atribuição e compartilhamento nos mesmos termos. A atribuição já consta no rodapé de
todas as páginas — mantenha-a. Se o repositório for público, o conteúdo derivado dessas
bases fica sujeito às mesmas condições.
