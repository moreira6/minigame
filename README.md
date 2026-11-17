# PlayLab — Arcade Educativo

Portal responsivo de minigames educativos feito com React + Vite, pronto para publicar na Vercel.

## Jogos incluídos
- Desafio Relâmpago: perguntas de conhecimentos gerais.
- Batalha Matemática: operações com dificuldade crescente.
- Memória Cósmica: encontre os pares.
- Palavra Embaralhada: descubra palavras organizando letras.

## Recursos
- XP, níveis, progresso e conquistas.
- Progresso salvo no navegador (localStorage).
- Filtros por categoria.
- Layout responsivo para computador, tablet e celular.
- Sem banco de dados ou variáveis de ambiente obrigatórias.

## Executar localmente
Requer Node.js 18 ou superior.

```bash
npm install
npm run dev
```

## Publicar na Vercel
1. Extraia o ZIP.
2. Envie a pasta para um repositório GitHub.
3. Na Vercel, escolha **Add New → Project** e importe o repositório.
4. Framework: Vite (detecção automática).
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Clique em Deploy.

Também é possível importar o projeto pela CLI da Vercel.

## Personalização
As perguntas ficam no array `QUESTIONS` e as palavras no array `WORDS`, em `src/main.jsx`.
O progresso é local ao navegador/dispositivo. Para sincronizar turmas e alunos entre dispositivos, será necessário adicionar autenticação e banco de dados.
