import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Gamepad2, Trophy, Star, Zap, Home, Volume2, VolumeX, RotateCcw, ArrowLeft, Lock, Medal, Sparkles, Brain, Calculator, BookOpen, Puzzle } from 'lucide-react';
import './style.css';

const GAMES = [
  {id:'quiz', name:'Desafio Relâmpago', desc:'Responda e avance no placar.', icon:'⚡', color:'orange', category:'Conhecimentos', levels:['Iniciante','Explorador','Mestre']},
  {id:'math', name:'Batalha Matemática', desc:'Resolva operações contra o relógio.', icon:'🧮', color:'blue', category:'Matemática', levels:['Iniciante','Explorador','Mestre']},
  {id:'memory', name:'Memória Cósmica', desc:'Encontre todos os pares.', icon:'🧠', color:'purple', category:'Memória', levels:['Iniciante','Explorador','Mestre']},
  {id:'words', name:'Palavra Embaralhada', desc:'Organize as letras e descubra a palavra.', icon:'🔤', color:'green', category:'Português', levels:['Iniciante','Explorador','Mestre']}
];
const QUESTIONS = [
  {q:'Qual planeta é conhecido como Planeta Vermelho?',a:['Vênus','Marte','Júpiter','Saturno'],c:1},
  {q:'Quantos lados tem um hexágono?',a:['5','6','7','8'],c:1},
  {q:'Qual é o maior oceano da Terra?',a:['Atlântico','Índico','Pacífico','Ártico'],c:2},
  {q:'Qual destes animais é um mamífero?',a:['Tubarão','Sapo','Golfinho','Pinguim'],c:2},
  {q:'Quanto é 1 quilômetro?',a:['10 metros','100 metros','1.000 metros','10.000 metros'],c:2},
  {q:'Qual é a estrela mais próxima da Terra?',a:['Sirius','Sol','Vega','Polar'],c:1},
  {q:'Em que continente fica o Brasil?',a:['Europa','Ásia','América do Sul','África'],c:2},
  {q:'Qual órgão bombeia o sangue?',a:['Pulmão','Coração','Fígado','Rim'],c:1},
  {q:'Qual é o resultado de 9 × 8?',a:['64','72','81','86'],c:1},
  {q:'Qual é o plural de “cidadão”?',a:['Cidadões','Cidadães','Cidadãos','Cidadãeses'],c:2}
];
const WORDS = ['ESCOLA','PLANETA','JANELA','ABACAXI','FLORESTA','AMIZADE','ELEFANTE','BIBLIOTECA','BORBOLETA','ASTRONAUTA'];
const LEVELS = ['Iniciante','Explorador','Mestre'];
const shuffle = arr => [...arr].sort(() => Math.random() - .5);
const getInitial = () => { try { return JSON.parse(localStorage.getItem('playlab-progress')) || {}; } catch { return {}; } };

function App(){
  const [progress,setProgress] = useState(getInitial);
  const [screen,setScreen] = useState('home');
  const [game,setGame] = useState(null);
  const [level,setLevel] = useState(0);
  const [sound,setSound] = useState(true);
  const [toast,setToast] = useState('');
  const [filter,setFilter] = useState('Todos');
  useEffect(()=>{localStorage.setItem('playlab-progress',JSON.stringify(progress));},[progress]);
  const xp = progress.xp || 0;
  const unlocked = Math.max(1,Math.min(3,1+Math.floor((xp||0)/100)));
  const achievements = [
    {id:'first',name:'Primeira partida',desc:'Complete seu primeiro jogo',icon:'🎮',ok:(progress.plays||0)>=1},
    {id:'five',name:'Jogador dedicado',desc:'Complete 5 partidas',icon:'🕹️',ok:(progress.plays||0)>=5},
    {id:'hundred',name:'Centenário',desc:'Acumule 100 pontos de XP',icon:'💯',ok:xp>=100},
    {id:'perfect',name:'Sem erros',desc:'Termine uma partida sem errar',icon:'💎',ok:!!progress.perfect},
    {id:'all',name:'Explorador',desc:'Jogue os 4 minigames',icon:'🌎',ok:(progress.played||[]).length>=4}
  ];
  const notify = msg => {setToast(msg);setTimeout(()=>setToast(''),2300);};
  const finish = (score,perfect=false) => {
    const earned = Math.max(10,score);
    setProgress(p=>({...p,xp:(p.xp||0)+earned,plays:(p.plays||0)+1,perfect:perfect||p.perfect,played:[...new Set([...(p.played||[]),game.id])]}));
    setScreen('result'); setResultScore(earned);
  };
  const [resultScore,setResultScore] = useState(0);
  const start = (g,l=0) => {setGame(g);setLevel(l);setScreen('game');};
  const filtered = GAMES.filter(g=>filter==='Todos'||g.category===filter);
  return <div className="app-shell">
    <header className="topbar"><button className="brand" onClick={()=>setScreen('home')}><span className="brand-mark"><Gamepad2/></span><span>PLAY<span className="brand-accent">LAB</span><small>ARCADE EDUCATIVO</small></span></button>
      <div className="top-stats"><div className="stat-pill"><Zap size={16}/><b>{xp}</b><span>XP</span></div><div className="stat-pill"><Trophy size={16}/><b>{achievements.filter(a=>a.ok).length}</b><span>CONQUISTAS</span></div><button className="icon-btn" aria-label="Alternar som" onClick={()=>setSound(!sound)}>{sound?<Volume2/>:<VolumeX/>}</button></div>
    </header>
    {screen==='home' && <main className="container">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> SEU PRÓXIMO NÍVEL COMEÇA AQUI</div><h1>Aprender pode ser<br/><span>uma aventura.</span></h1><p>Entre no jogo, supere desafios e desbloqueie novas conquistas. Cada partida é uma oportunidade de evoluir!</p><button className="primary-btn" onClick={()=>document.getElementById('games').scrollIntoView({behavior:'smooth'})}>JOGAR AGORA <span>↗</span></button></div><div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="planet">🚀</div><div className="float-card fc-one">⭐ + XP</div><div className="float-card fc-two">🏆 LEVEL UP!</div><div className="spark s1">✦</div><div className="spark s2">✧</div></div></section>
      <section className="progress-strip"><div><span className="muted-label">NÍVEL ATUAL</span><strong className="level-name">{LEVELS[unlocked-1]}</strong></div><div className="progress-track-wrap"><div className="progress-caption"><span>PROGRESSO PARA O PRÓXIMO NÍVEL</span><b>{xp%100}/100 XP</b></div><div className="progress-track"><div style={{width:`${xp%100}%`}}/></div></div><div className="level-badge">LVL {unlocked}</div></section>
      <section id="games" className="section"><div className="section-head"><div><div className="eyebrow">ESCOLHA SUA MISSÃO</div><h2>Área de jogos <span>▸</span></h2></div><span className="section-count">04 JOGOS DISPONÍVEIS</span></div>
        <div className="filters">{['Todos','Conhecimentos','Matemática','Memória','Português'].map(f=><button key={f} className={filter===f?'filter active':'filter'} onClick={()=>setFilter(f)}>{f}</button>)}</div>
        <div className="game-grid">{filtered.map((g,i)=><article className={`game-card ${g.color}`} key={g.id}><div className="game-card-top"><span className="game-icon">{g.icon}</span><span className="game-tag">{g.category}</span></div><h3>{g.name}</h3><p>{g.desc}</p><div className="card-bottom"><span>{(progress.played||[]).includes(g.id)?'↻ JOGAR NOVAMENTE':'▶ INICIAR MISSÃO'}</span><button aria-label={`Jogar ${g.name}`} onClick={()=>start(g)}>↗</button></div><div className="card-decoration">{String(i+1).padStart(2,'0')}</div></article>)}</div>
      </section>
      <section className="section achievements"><div className="section-head"><div><div className="eyebrow">SUAS VITÓRIAS</div><h2>Mural de conquistas <span>▸</span></h2></div><span className="section-count">{achievements.filter(a=>a.ok).length}/{achievements.length} DESBLOQUEADAS</span></div><div className="achievement-grid">{achievements.map(a=><div className={`achievement ${a.ok?'earned':''}`} key={a.id}><div className="achievement-icon">{a.ok?a.icon:'🔒'}</div><div><b>{a.name}</b><small>{a.desc}</small></div>{a.ok&&<Medal size={17}/>}</div>)}</div></section>
      <footer>PLAYLAB © 2026 <span>FEITO PARA APRENDER JOGANDO ✦</span></footer>
    </main>}
    {screen==='game' && <GameScreen game={game} level={level} onBack={()=>setScreen('home')} onFinish={finish} notify={notify}/>}
    {screen==='result' && <main className="result-screen"><div className="result-card"><div className="result-trophy">🏆</div><div className="eyebrow">MISSÃO CONCLUÍDA</div><h1>Mandou muito bem!</h1><p>Você terminou <b>{game?.name}</b>.</p><div className="earned-xp">+{resultScore} <span>XP</span></div><p className="muted">Continue jogando para desbloquear novos níveis e conquistas.</p><div className="result-actions"><button className="primary-btn" onClick={()=>start(game,level)}>JOGAR DE NOVO ↻</button><button className="secondary-btn" onClick={()=>setScreen('home')}>VOLTAR AO ARCADE</button></div></div></main>}
    {toast&&<div className="toast">{toast}</div>}
  </div>
}

function GameScreen({game,level,onBack,onFinish,notify}){
  const [step,setStep]=useState(0),[score,setScore]=useState(0),[errors,setErrors]=useState(0),[selected,setSelected]=useState(null);
  const [questions,setQuestions]=useState(()=>shuffle(QUESTIONS).slice(0,level===0?5:level===1?7:10));
  const [pairs,setPairs]=useState(()=>shuffle(['🚀','🌈','🐱','🍉','⚽','🦋'].slice(0,level===0?4:6).flatMap((x,i)=>[{id:i*2,v:x},{id:i*2+1,v:x}])));
  const [flipped,setFlipped]=useState([]),[matched,setMatched]=useState([]),[word,setWord]=useState(''),[letters,setLetters]=useState([]);
  const total=game.id==='memory'?pairs.length/2:game.id==='words'?5:questions.length;
  const q=questions[step];
  const math=useMemo(()=>{let a=Math.floor(Math.random()*(level===0?10:level===1?30:100))+1,b=Math.floor(Math.random()*(level===0?10:level===1?20:50))+1;return {a,b,op:level===0?'+':level===1?['+','-'][Math.floor(Math.random()*2)]:['+','-','×'][Math.floor(Math.random()*3)]};},[step,game.id,level]);
  const answer=math.op==='+'?math.a+math.b:math.op==='-'?Math.abs(math.a-math.b):math.a*math.b;
  const wordTarget=WORDS[(step+(level*3))%WORDS.length];
  useEffect(()=>{if(game.id==='words')setLetters(shuffle(wordTarget.split('')));},[step,game.id]);
  const correct=()=>{setScore(s=>s+20);setSelected('correct');setTimeout(()=>{if(step+1>=total)onFinish(score+20,errors===0);else{setStep(s=>s+1);setSelected(null);}},650);};
  const wrong=()=>{setErrors(e=>e+1);setSelected('wrong');setTimeout(()=>setSelected(null),650);};
  const choose=(v,c)=>{if(selected)return;c?correct():wrong();};
  const memoryFlip=id=>{if(flipped.includes(id)||matched.includes(id)||flipped.length===2)return;const next=[...flipped,id];setFlipped(next);if(next.length===2){const [a,b]=next.map(i=>pairs.find(p=>p.id===i));if(a.v===b.v){setTimeout(()=>{const m=[...matched,...next];setMatched(m);setFlipped([]);if(m.length===pairs.length)onFinish(score+40,errors===0);},450);setScore(s=>s+20);}else{setTimeout(()=>setFlipped([]),750);setErrors(e=>e+1);}}};
  const submitWord=()=>{if(word===wordTarget){setWord('');correct();}else wrong();};
  const title=game.name;
  return <main className="play-area"><div className="play-top"><button className="back-btn" onClick={onBack}><ArrowLeft size={17}/> SAIR DO JOGO</button><span className="play-level">FASE {level+1} · {LEVELS[level].toUpperCase()}</span></div><div className="play-card"><div className="play-heading"><span className="game-icon large">{game.icon}</span><div><div className="eyebrow">MINIGAME</div><h1>{title}</h1></div></div><div className="play-progress"><div style={{width:`${game.id==='memory'?matched.length/pairs.length*100:step/total*100}%`}}/></div><div className="play-meta"><span>DESAFIO {Math.min(step+1,total)} / {total}</span><b>⭐ {score} PONTOS</b></div>
    {game.id==='quiz'&&<div className="challenge"><h2>{q.q}</h2><div className="answer-grid">{q.a.map((a,i)=><button key={a} className={`answer ${selected&&i===q.c?'right':selected==='wrong'&&selected===a?'incorrect':''}`} onClick={()=>choose(a,i===q.c)}><span>{['A','B','C','D'][i]}</span>{a}</button>)}</div></div>}
    {game.id==='math'&&<div className="challenge"><div className="math-equation">{math.a} <span>{math.op}</span> {math.b} <span>=</span> ?</div><div className="answer-grid">{shuffle([answer,answer+2,Math.max(0,answer-3),answer+5]).map((v,i)=><button className="answer" key={`${step}-${v}-${i}`} onClick={()=>choose(v,v===answer)}>{v}</button>)}</div></div>}
    {game.id==='memory'&&<div className="memory-grid">{pairs.map(p=><button key={p.id} className={`memory-tile ${flipped.includes(p.id)||matched.includes(p.id)?'revealed':''}`} onClick={()=>memoryFlip(p.id)}>{flipped.includes(p.id)||matched.includes(p.id)?p.v:'?'}</button>)}</div>}
    {game.id==='words'&&<div className="challenge"><h2>Organize as letras e descubra a palavra!</h2><div className="word-slots">{letters.map((l,i)=><button key={i} onClick={()=>setWord(w=>w+l)}>{l}</button>)}</div><div className="word-answer">{word.split('').map((l,i)=><button key={i} onClick={()=>setWord(w=>w.slice(0,i)+w.slice(i+1))}>{l}</button>)}</div><button className="primary-btn submit-word" onClick={submitWord}>CONFIRMAR PALAVRA</button><button className="secondary-btn" onClick={()=>setWord('')}>LIMPAR</button></div>}
    {selected==='correct'&&<div className="feedback good">✨ Resposta correta! Muito bem!</div>}{selected==='wrong'&&<div className="feedback bad">Quase! Tente novamente.</div>}
  </div></main>
}

createRoot(document.getElementById('root')).render(<App/>);
