# LearnWave 🌊

App de comunicação educacional que conecta professores e alunos via chat, desenvolvido com React Native + Expo.

---

## Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Git](https://git-scm.com/)
- Expo Go no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)) **ou** um emulador configurado

---

## Como rodar

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd LearnWave
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o projeto

```bash
npx expo start
```

### 4. Abra no dispositivo

Após iniciar, o terminal exibirá um QR Code. Escolha uma das opções:

| Opção | Como abrir |
|---|---|
| 📱 Celular físico | Escaneie o QR Code com o app **Expo Go** |
| 🤖 Android Emulator | Pressione `a` no terminal |
| 🍎 iOS Simulator | Pressione `i` no terminal |
| 🌐 Navegador (Web) | Pressione `w` no terminal |

---

## Fluxo do app

```
Tela Inicial
├── Entrar → Login
│   ├── Professor → Lista de alunos → Chat
│   └── Aluno    → Lista de professores → Chat
└── Sobre Nós
```

---

## Estrutura de pastas

```
app/
├── index.tsx           # Tela inicial
├── login.tsx           # Login com seleção de perfil
├── sobre.tsx           # Sobre Nós
├── professor/
│   └── chat.tsx        # Lista de alunos (perfil professor)
├── aluno/
│   └── chat.tsx        # Lista de professores (perfil aluno)
└── chat/
    └── [id].tsx        # Conversa individual
constants/
├── theme.ts            # Paleta de cores e tokens de design
└── mock-data.ts        # Dados de exemplo
```

---

## Tecnologias

- [Expo](https://expo.dev) ~54
- [React Native](https://reactnative.dev) 0.81
- [Expo Router](https://docs.expo.dev/router/introduction/) — navegação baseada em arquivos
- TypeScript

---

Desenvolvido pela turma **INF3BM — 2025**
