export type Message = {
  id: string;
  from: 'professor' | 'aluno';
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  name: string;
  role: 'professor' | 'aluno';
  avatar: string;
  lastMessage: string;
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    id: '1',
    name: 'Prof. Carlos Silva',
    role: 'professor',
    avatar: '👨🏫',
    lastMessage: 'Não esqueçam da prova amanhã!',
    messages: [
      { id: 'm1', from: 'professor', text: 'Olá turma! Tudo bem?', time: '09:00' },
      { id: 'm2', from: 'aluno', text: 'Tudo sim, professor!', time: '09:05' },
      { id: 'm3', from: 'professor', text: 'Não esqueçam da prova amanhã!', time: '09:10' },
    ],
  },
  {
    id: '2',
    name: 'Prof. Ana Souza',
    role: 'professor',
    avatar: '👩🏫',
    lastMessage: 'Enviei o material no grupo.',
    messages: [
      { id: 'm1', from: 'professor', text: 'Bom dia! Enviei o material no grupo.', time: '08:30' },
      { id: 'm2', from: 'aluno', text: 'Obrigado, professora!', time: '08:45' },
    ],
  },
  {
    id: '3',
    name: 'João Aluno',
    role: 'aluno',
    avatar: '🎓',
    lastMessage: 'Professor, tenho uma dúvida.',
    messages: [
      { id: 'm1', from: 'aluno', text: 'Professor, tenho uma dúvida sobre o exercício 3.', time: '14:00' },
      { id: 'm2', from: 'professor', text: 'Claro, pode perguntar!', time: '14:05' },
    ],
  },
  {
    id: '4',
    name: 'Maria Aluna',
    role: 'aluno',
    avatar: '📚',
    lastMessage: 'Entendi, obrigada!',
    messages: [
      { id: 'm1', from: 'aluno', text: 'Professora, quando é a entrega do trabalho?', time: '10:00' },
      { id: 'm2', from: 'professor', text: 'Na sexta-feira até as 18h.', time: '10:15' },
      { id: 'm3', from: 'aluno', text: 'Entendi, obrigada!', time: '10:16' },
    ],
  },
];
