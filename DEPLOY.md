# Como fazer Deploy na Vercel

A maneira mais fácil e recomendada de colocar seu projeto online é usando a integração da Vercel com o GitHub.

## Pré-requisitos

1.  Uma conta no [GitHub](https://github.com/).
2.  Uma conta na [Vercel](https://vercel.com/).
3.  Git instalado no seu computador.

## Passo 1: Enviar o código para o GitHub

1.  Crie um **novo repositório** no GitHub (pode ser público ou privado).
2.  No terminal do seu projeto (`onescan`), inicialize o git e envie os arquivos:

```bash
git init
git add .
git commit -m "Primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
git push -u origin main
```
*(Substitua a URL pelo link do seu repositório)*

## Passo 2: Importar na Vercel

1.  Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2.  Clique em **"Add New..."** -> **"Project"**.
3.  Na lista "Import Git Repository", encontre o seu projeto e clique em **"Import"**.

## Passo 3: Configuração e Deploy

1.  **Framework Preset:** A Vercel deve detectar automaticamente como **Vite**. Se não, selecione "Vite".
2.  **Root Directory:** Deixe como `./`.
3.  **Build Command:** `npm run build` (Padrão).
4.  **Output Directory:** `dist` (Padrão).
5.  **Install Command:** `npm install` (Padrão).
6.  Clique em **"Deploy"**.

## Passo 4: Finalização

-   Aguarde alguns segundos/minutos.
-   Quando terminar, você receberá uma URL (ex: `onescan.vercel.app`).
-   Acesse o link no seu celular para testar a câmera e instalar o PWA!

> **Nota:** Como a API Key do Gemini é salva no navegador do usuário (LocalStorage), você **não** precisa configurar Variáveis de Ambiente (Environment Variables) no painel da Vercel para isso. Cada usuário inserirá sua própria chave.
