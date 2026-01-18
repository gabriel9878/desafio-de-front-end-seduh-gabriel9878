# Weather App – Desafio de Front-end SEDUH

Aplicação de previsão do tempo desenvolvida em **Next.js 15** utilizando a **WeatherAPI**.  
O foco principal foi entregar uma experiência consistente entre diferentes dispositivos, com atenção à responsividade, boa composição visual e qualidade de código (testes automatizados).

> Este repositório também é publicado via **GitHub Pages**, onde este próprio `README.md` pode ser consultado juntamente com o link da aplicação em produção.

---

## 🔗 Links

- **Aplicação em produção:**  
  https://desafio-de-front-end-seduh-gabriel9878.vercel.app

- **GitHub Pages (documentação / README):**  
  https://gabriel9878.github.io/desafio-de-front-end-seduh/

---

## ✨ Funcionalidades

- Tela inicial com **lista de cidades** disponíveis.
- **Página de detalhes** para cada cidade, exibindo:
  - Temperatura atual em destaque.
  - Máxima e mínima do dia (ajustadas com base na temperatura atual).
  - Ícone principal que varia conforme:
    - Código de condição da WeatherAPI.
    - Se é dia ou noite.
  - Previsão em 4 períodos:
    - **Dawn**, **Morning**, **Afternoon**, **Night**.
  - Informações adicionais:
    - Velocidade do vento (Wind speed)
    - Nascer do sol (Sunrise)
    - Pôr do sol (Sunset)
    - Umidade (Humidity)

---

## 🧱 Tecnologias

- **Next.js 15** (App Router, TypeScript)
- **React 18**
- **Tailwind CSS**
- **lucide-react** (ícones)
- **Jest + React Testing Library** (testes)
- **WeatherAPI** (fonte dos dados de clima)

---

## 🧩 Arquitetura geral

### Páginas principais

- `app/page.tsx`  
  Página inicial com a listagem das cidades.

- `app/city/[city]/page.tsx`  
  Rota dinâmica para cada cidade:
  - Lê o slug da cidade (`[city]`).
  - Busca os dados na WeatherAPI **no servidor**.
  - Monta o objeto de clima tipado (`WeatherData`).
  - Renderiza o componente `WeatherDetailsPage`.
  - Trata falhas de requisição, exibindo uma tela de erro amigável.

### Componente de detalhes

- `app/components/WeatherDetailsPage.tsx`  
  Responsável pela parte visual da página de detalhes:

  - Nome da cidade e condição (`Sunny`, `Cloudy`, etc.).
  - Temperatura atual com destaque.
  - Ícone principal de condição:
    - Função `getLucideIconForCondition(code, isDay)` mapeia os códigos da WeatherAPI para ícones de sol, lua, nuvens, chuva, neve ou nevoeiro, diferenciando dia/noite.
  - Cálculo da **máxima e mínima exibidas** para evitar inconsistências visuais:
    ```ts
    const displayMax = Math.max(current.temp_c, today.day.maxtemp_c);
    const displayMin = Math.min(current.temp_c, today.day.mintemp_c);
    ```
    Dessa forma, se a temperatura atual ultrapassar a máxima prevista, a UI mostra essa nova máxima observada.

  - **Layout responsivo**:
    - **Telas com menor largura (mobiles, ex.: iPhone SE)**  
      - Períodos do dia:
        - Distribuição em **3 + 1** (três cartões na primeira linha e um cartão centralizado logo abaixo).
      - Bloco de detalhes (vento, sunrise, sunset, umidade):
        - Layout em **2 x 2** (duas colunas por duas linhas).
      - Ícone principal:
        - Tamanho reduzido (~90px) para garantir que tudo caiba na tela sem necessidade de rolagem vertical.
    - **Telas maiores (tablets e desktops)**  
      - Períodos do dia:
        - Distribuição em **4 colunas em uma única linha**.
      - Bloco de detalhes:
        - Quatro colunas em uma única linha.
      - Conteúdo centralizado verticalmente no viewport, resultando em um cartão bem equilibrado visualmente em iPad/desktop.

---

## 🔐 Variáveis de ambiente

A chave da WeatherAPI não está fixa no código; é controlada por variável de ambiente.

### Desenvolvimento local

Crie um arquivo `.env.local` na raiz do projeto:

```bash
WEATHER_API_KEY=SEU_TOKEN_DA_WEATHERAPI_AQUI
```

No arquivo `app/city/[city]/page.tsx`, a chave é lida assim:

```ts
const API_KEY = process.env.WEATHER_API_KEY;
```

Como a busca é feita no servidor, essa chave **não é exposta no cliente**.

### Produção (Vercel)

1. Acesse o projeto na Vercel.
2. Vá em **Settings → Environment Variables**.
3. Crie a variável:
   - Name: `WEATHER_API_KEY`
   - Value: a mesma chave usada localmente.
4. Efetue um redeploy.

---

## 🧪 Testes

### Stack de testes

- **Jest**
- **@testing-library/react**
- **@testing-library/jest-dom**

### Como rodar

```bash
npm test
```

### Cobertura

#### CitySelectionPage

Arquivo: `__tests__/CitySelectionPage.test.tsx`

- Garante que todas as cidades passadas via prop são renderizadas corretamente na tela inicial.

#### WeatherDetailsPage

Arquivo: `__tests__/WeatherDetailsPage.test.tsx`

- Utiliza um helper `buildWeather` para montar objetos de clima fake.
- Verifica que:
  - Cidade e condição são exibidas.
  - Labels de períodos (`Dawn`, `Morning`, `Afternoon`, `Night`) aparecem.
  - Labels de detalhes (`Wind speed`, `Sunrise`, `Sunset`, `Humidity`) aparecem.
  - Valores de vento, sunrise, sunset e umidade são exibidos.
  - A lógica de máximas/mínimas usa corretamente:
    - `displayMax = max(temp_atual, max_prevista)`
    - `displayMin = min(temp_atual, min_prevista)`
- Exercita múltiplos cenários de condição (códigos da WeatherAPI):
  - Ensolarado.
  - Nublado.
  - Chuva.
  - Nevoeiro.
  - Neve.
  - Noite limpa.

---

## ▶️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm

### Passos

1. Clonar o repositório:

   ```bash
   git clone https://github.com/<seu-usuario>/<seu-repo>.git
   cd <seu-repo>
   ```

2. Instalar dependências:

   ```bash
   npm install
   ```

3. Criar o `.env.local` com a chave da WeatherAPI:

   ```bash
   WEATHER_API_KEY=SEU_TOKEN_DA_WEATHERAPI_AQUI
   ```

4. Rodar em modo desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse: http://localhost:3000

5. Executar a suíte de testes:

   ```bash
   npm test
   ```

---

## 🚀 Deploy

### Vercel (aplicação)

A aplicação Next.js é hospedada na **Vercel**, com deploy contínuo a partir deste repositório GitHub:

- Build: `next build`
- Output: `.next`
- Variáveis de ambiente configuradas em **Settings → Environment Variables**.

Cada push no branch principal gera um novo deploy.

### GitHub Pages (documentação + link para a app)

O repositório também está publicado via **GitHub Pages**.  
Nele, o conteúdo principal é este `README.md` (ou página equivalente), contendo:

- Descrição do projeto.
- Tecnologias e arquitetura.
- Instruções de execução.
- **Link direto para a aplicação em produção hospedada na Vercel.**

Isso atende à exigência de utilização de GitHub Pages, mantendo ao mesmo tempo a aplicação em um ambiente ideal para Next.js.

---

## 📚 Scripts

No `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "jest"
  }
}
```

- `npm run dev` – modo desenvolvimento.
- `npm run build` – build de produção.
- `npm start` – servidor em modo produção.
- `npm test` – execução dos testes unitários.

---

## ✅ Observações finais

- Projeto desenvolvido como solução para o **desafio de front-end da SEDUH**.
- Foco em:
  - Responsividade real entre devices (principalmente telas menores).
  - UX coerente na exibição de temperaturas máximas e mínimas.
  - Organização de código e testes automatizados.
- A estrutura atual facilita a inclusão de novas cidades e a evolução futura da interface (mais dias de previsão, novos temas, etc.).
