(() => {
"use strict";

const SAVE_KEY = "veyra_save_v14_stable";

const $ = id => document.getElementById(id);

const must = id => {
const element = $(id);

if (!element) {
throw new Error(
`Elemento obrigatório não encontrado: #${id}`
);
}

return element;
};

const canvas = must("gameCanvas");
const ctx = canvas.getContext("2d");

const miniCanvas = must("miniCanvas");
const miniCtx = miniCanvas.getContext("2d");

const mapCanvas = must("worldMapCanvas");
const mapCtx = mapCanvas.getContext("2d");

const screens = {
menu: must("menuScreen"),
how: must("howScreen"),
credits: must("creditsScreen"),
character: must("characterScreen"),
game: must("gameScreen")
};

/* =====================================================
PERSONAGENS
====================================================== */

const CHARACTERS = [

{
id: "kaelion",
name: "KAELION",
className: "Mago",
icon: "🧙",
role: "Magia • Longo alcance",
description:
"Grande poder mágico, controle à distância e menor resistência física.",
story:
"Estudioso de memórias antigas, Kaelion sente a magia desaparecer junto com as lembranças do mundo.",
hp: 85,
magic: 145,
energy: 115,
speed: 178,
damage: 25,
defense: 5,
color: "#e49345",
bg: "rgba(228,147,69,.16)",
glow: "rgba(228,147,69,.28)",
skill: "Raio de Memória"
},

{
id: "theron",
name: "THERON",
className: "Cavaleiro",
icon: "🛡️",
role: "Espada • Defesa",
description:
"Muita defesa, boa vida e combate corpo a corpo.",
story:
"Theron jurou proteger a Vila do Crepúsculo enquanto ainda houver alguém capaz de lembrar seu nome.",
hp: 145,
magic: 75,
energy: 120,
speed: 145,
damage: 30,
defense: 21,
color: "#bfc5ce",
bg: "rgba(191,197,206,.14)",
glow: "rgba(191,197,206,.23)",
skill: "Golpe do Guardião"
},

{
id: "grumgar",
name: "GRUMGAR",
className: "Troll",
icon: "👹",
role: "Força • Vida",
description:
"Enorme vida e dano físico, porém pouca velocidade.",
story:
"Grumgar deixou as cavernas para descobrir por que criaturas de sua espécie começaram a esquecer suas próprias tribos.",
hp: 180,
magic: 55,
energy: 95,
speed: 112,
damage: 39,
defense: 18,
color: "#718f51",
bg: "rgba(113,143,81,.16)",
glow: "rgba(113,143,81,.24)",
skill: "Esmagamento"
},

{
id: "lirael",
name: "LIRAEL",
className: "Fada",
icon: "🧚",
role: "Velocidade • Cura",
description:
"Muito rápida, mágica e capaz de restaurar vida.",
story:
"Lirael percebeu que flores mágicas paravam de brilhar sempre que uma memória desaparecia.",
hp: 95,
magic: 135,
energy: 135,
speed: 210,
damage: 20,
defense: 7,
color: "#dd8bd0",
bg: "rgba(221,139,208,.16)",
glow: "rgba(221,139,208,.25)",
skill: "Luz Vital"
},

{
id: "zephyr",
name: "ZEPHYR",
className: "Transmorfo",
icon: "🦊",
role: "Adaptação • Equilíbrio",
description:
"Atributos equilibrados e habilidade de adaptação temporária.",
story:
"Zephyr muda de forma para sobreviver, mas teme o dia em que esquecerá qual delas era a sua verdadeira forma.",
hp: 115,
magic: 108,
energy: 112,
speed: 170,
damage: 26,
defense: 13,
color: "#8f6bd8",
bg: "rgba(143,107,216,.16)",
glow: "rgba(143,107,216,.25)",
skill: "Forma Adaptativa"
}

];

/* =====================================================
ITENS
====================================================== */

const ITEMS = {

madeira: {
name: "Madeira",
icon: "🪵",
category: "materials",
weight: 1,
value: 2
},

carvao: {
name: "Carvão",
icon: "⬛",
category: "materials",
weight: 1,
value: 6
},

ferro: {
name: "Ferro",
icon: "⛓️",
category: "materials",
weight: 2,
value: 14
},

ouro: {
name: "Ouro",
icon: "🪙",
category: "materials",
weight: 2,
value: 30
},

rubi: {
name: "Rubi",
icon: "♦",
category: "materials",
weight: 2,
value: 75
},

cristal: {
name: "Cristal",
icon: "💎",
category: "special",
weight: 2,
value: 45
},

essencia: {
name: "Essência da Quietude",
icon: "✦",
category: "special",
weight: 1,
value: 100
},

pocao: {
name: "Poção de Cura",
icon: "🧪",
category: "potions",
weight: 1,
value: 30,
heal: 45
},

elixir: {
name: "Elixir de Energia",
icon: "💙",
category: "potions",
weight: 1,
value: 35,
energy: 50
},

espadaFerro: {
name: "Espada de Ferro",
icon: "⚔️",
category: "weapons",
weight: 4,
value: 140,
damage: 12
},

armaduraCouro: {
name: "Armadura de Couro",
icon: "🥋",
category: "armor",
weight: 5,
value: 110,
defense: 8
},

machado: {
name: "Machado",
icon: "🪓",
category: "tools",
weight: 3,
value: 50
}

};

/* =====================================================
REGIÕES
====================================================== */

const REGIONS = {

village: {
name: "VILA DO CREPÚSCULO",
width: 3200,
height: 2200,
visual: "village"
},

forest: {
name: "FLORESTA",
width: 3400,
height: 2400,
visual: "forest"
},

grove: {
name: "BOSQUE",
width: 3200,
height: 2300,
visual: "grove"
},

mountains: {
name: "MONTANHAS",
width: 3500,
height: 2300,
visual: "mountains"
},

iron: {
name: "CAVERNA DE FERRO",
width: 2900,
height: 1900,
visual: "iron"
},

ruby: {
name: "CAVERNA DE RUBI",
width: 3100,
height: 2100,
visual: "ruby"
},

shadow: {
name: "CAVERNA SOMBRIA",
width: 3000,
height: 2000,
visual: "shadow"
},

fairy: {
name: "REINO DAS FADAS",
width: 3200,
height: 2200,
visual: "fairy"
},

sky: {
name: "CÉU",
width: 3400,
height: 2200,
visual: "sky"
},

hell: {
name: "INFERNO",
width: 3600,
height: 2400,
visual: "hell"
},

final: {
name: "CÂMARA FINAL",
width: 2200,
height: 1500,
visual: "final"
}

};

/* =====================================================
ESTADO
====================================================== */

const state = {

selectedCharacter: CHARACTERS[0],

player: null,

running: false,

paused: false,

time: 0,

lastTime: 0,

keys: new Set(),

area: "village",

camera: {
x: 0,
y: 0
},

world: createEmptyWorld(
REGIONS.village
),

houseMode: false,

currentHouse: null,

houseReturn: null,

dialogue: null,

travel: null,

battle: null,

questNPC: null,

shopNPC: null,

shopMode: "buy",

inventoryCategory: "all",

toastTimer: null,

portalCooldown: 0,

warnedNeedAt: 0,

finalChoiceShown: false

};

/* =====================================================
MUNDO
====================================================== */

function createEmptyWorld(region) {

return {

width: region.width,

height: region.height,

obstacles: [],

buildings: [],

trees: [],

resources: [],

npcs: [],

enemies: [],

drops: [],

portals: [],

particles: [],

effects: []

};

}

/* =====================================================
UTILITÁRIOS
====================================================== */

function clamp(
value,
min,
max
) {

return Math.max(
min,
Math.min(
max,
value
)
);

}

function random(
min,
max
) {

return (
Math.random() *
(max - min) +
min
);

}

function randomInt(
min,
max
) {

return Math.floor(
random(
min,
max + 1
)
);

}

function distance(
a,
b
) {

return Math.hypot(
a.x - b.x,
a.y - b.y
);

}

function uid(prefix) {

return (
`${prefix}_` +
Math.random()
.toString(36)
.slice(2, 9)
);

}

function currentCharacter() {

return (
CHARACTERS.find(
character =>
character.id ===
state.player?.characterId
) ||
CHARACTERS[0]
);

}

function showScreen(name) {

Object
.values(screens)
.forEach(
screen =>
screen.classList.remove(
"active"
)
);

screens[name].classList.add(
"active"
);

}

function showToast(message) {

const toast =
must("saveMessage");

toast.textContent =
message;

toast.classList.add(
"show"
);

clearTimeout(
state.toastTimer
);

state.toastTimer =
setTimeout(
() => {

toast.classList.remove(
"show"
);

},
2200
);

}

/* =====================================================
CANVAS
====================================================== */

function resizeCanvas() {

const ratio =
window.devicePixelRatio ||
1;

canvas.width =
Math.floor(
window.innerWidth *
ratio
);

canvas.height =
Math.floor(
window.innerHeight *
ratio
);

canvas.style.width =
`${window.innerWidth}px`;

canvas.style.height =
`${window.innerHeight}px`;

ctx.setTransform(
ratio,
0,
0,
ratio,
0,
0
);

}

/* =====================================================
SELEÇÃO
====================================================== */

function createCharacterCards() {

const container =
must("characterCards");

container.innerHTML =
"";

CHARACTERS.forEach(
(
character,
index
) => {

const card =
document.createElement(
"button"
);

card.type =
"button";

card.className =
"character-card" +
(
index === 0
? " selected"
: ""
);

card.style.setProperty(
"--char-color",
character.color
);

card.style.setProperty(
"--char-bg",
character.bg
);

card.style.setProperty(
"--char-glow",
character.glow
);

card.innerHTML = `

<div class="char-art">
${character.icon}
</div>

<h3>
${character.name}
</h3>

<p class="role">
${character.className}
—
${character.role}
</p>

<p>
${character.description}
</p>

<p>
${character.story}
</p>

<p>
❤️ ${character.hp}
•
✨ ${character.magic}
•
⚡ ${character.energy}
</p>

<p>
⚔ ${character.damage}
•
🛡 ${character.defense}
•
🏃 ${character.speed}
</p>

<p>
<strong>
${character.skill}
</strong>
</p>

`;

card.addEventListener(
"click",
() => {

state.selectedCharacter =
character;

document
.querySelectorAll(
".character-card"
)
.forEach(
item =>
item.classList.remove(
"selected"
)
);

card.classList.add(
"selected"
);

}
);

container.appendChild(
card
);

}
);

}

function startNewGame() {

must("playerName").value =
"";

must("nameError").textContent =
"";

state.selectedCharacter =
CHARACTERS[0];

document
.querySelectorAll(
".character-card"
)
.forEach(
(
card,
index
) => {

card.classList.toggle(
"selected",
index === 0
);

}
);

showScreen(
"character"
);

setTimeout(
() =>
must("playerName").focus(),
100
);

}

/* =====================================================
JOGADOR
====================================================== */

function createPlayer(
name,
character
) {

state.player = {

name,

characterId: character.id,

className: character.className,

icon: character.icon,

color: character.color,

x: 380,

y: 260,

radius: 18,

hp: character.hp,

maxHp: character.hp,

magic: character.magic,

maxMagic: character.magic,

energy: character.energy,

maxEnergy: character.energy,

speed: character.speed,

damage: character.damage,

defense: character.defense,

level: 1,

xp: 0,

xpToNext: 100,

money: 35,

hunger: 100,

fatigue: 100,

memory: 0,

inventory: {

madeira: 0,

carvao: 0,

ferro: 0,

ouro: 0,

rubi: 0,

cristal: 0,

essencia: 0,

pocao: 2,

elixir: 1,

espadaFerro: 0,

armaduraCouro: 0,

machado: 1

},

equipment: {

weapon: null,

armor: null,

tool: "machado"

},

quest: {

wood: {

state: "none",

need: 10,

rewardXP: 100,

rewardMoney: 80

},

coal: {

state: "none",

need: 8,

rewardXP: 130,

rewardMoney: 110

}

},

defeatedBosses: [],

discoveredBosses: [],

unlockedAreas: [
"village"
],

collected: {},

hellTypesDefeated: {},

checkpoint: {

area: "village",

x: 480,

y: 610

},

dead: false,

invincible: 0,

attackCooldown: 0,

adaptiveBuff: false,

finalChoice: null,

finalDefeated: false

};

}

function startGame() {

const input =
must("playerName");

const name =
input.value.trim();

if (
name.length <
2
) {

must("nameError").textContent =
"Digite um nome com pelo menos 2 caracteres.";

input.focus();

return;

}

createPlayer(
name,
state.selectedCharacter
);

state.area =
"village";

state.houseMode =
false;

state.currentHouse =
null;

state.houseReturn =
null;

state.finalChoiceShown =
false;

buildWorld();

const home =
state.world.buildings.find(
building =>
building.id ===
"home"
);

if (home) {

state.currentHouse =
home;

state.houseMode =
true;

state.houseReturn = {

x:
home.x +
home.w / 2,

y:
home.y +
home.h +
58

};

placePlayerInsideHouse();

}

updateHUD();

showScreen(
"game"
);

state.running =
true;

state.paused =
true;

state.time =
0;

state.lastTime =
performance.now();

must("transitionMessage").textContent =
"VEYRA";

must("transitionScreen")
.classList.remove(
"hidden"
);

setTimeout(
() => {

must("transitionScreen")
.classList.add(
"hidden"
);

state.paused =
false;

showToast(
"Você despertou em casa. Pressione Z para sair."
);

},
700
);

requestAnimationFrame(
gameLoop
);

}

/* =====================================================
WORLD HELPERS
====================================================== */

function resetWorld() {

state.world =
createEmptyWorld(
REGIONS[state.area]
);

}

function addObstacle(
x,
y,
w,
h,
type,
extra = {}
) {

state.world.obstacles.push({

x,
y,
w,
h,
type,

...extra

});

}

function addBuilding(
id,
x,
y,
w,
h,
name,
roof,
color
) {

const building = {

id,
x,
y,
w,
h,
name,
roof,
color

};

state.world.buildings.push(
building
);

addObstacle(
x - 24,
y - 95,
w + 48,
h + 95,
"building",
{
buildingId: id
}
);

return building;

}

function addTree(
x,
y,
id
) {

const tree = {

id,

x,

y,

alive: true,

amount:
randomInt(
2,
5
),

respawn: 0

};

state.world.trees.push(
tree
);

addObstacle(
x - 30,
y - 38,
60,
76,
"tree",
{
treeId: id
}
);

return tree;

}

function addResource(
x,
y,
type
) {

state.world.resources.push({

id: uid(
"resource"
),

x,

y,

type,

alive: true,

amount:
randomInt(
1,
3
),

respawn: 0

});

}

function addNPC(
x,
y,
name,
role,
color,
lines,
extra = {}
) {

state.world.npcs.push({

id: uid(
"npc"
),

x,

y,

radius: 17,

name,

role,

color,

lines,

...extra

});

}

function addEnemy(enemy) {

state.world.enemies.push({

state: "idle",

aggressive: false,

accepted: false,

attackTimer: 0,

hitFlash: 0,

dead: false,

respawnTimer: 0,

phase: 1,

...enemy

});

}

function addPortal(
x,
y,
w,
h,
target,
requirement,
title
) {

state.world.portals.push({

id: uid(
"portal"
),

x,

y,

w,

h,

target,

requirement,

title

});

}

function addWorldBounds() {

const edge =
70;

addObstacle(
0,
0,
state.world.width,
edge,
"wall"
);

addObstacle(
0,
state.world.height - edge,
state.world.width,
edge,
"wall"
);

addObstacle(
0,
0,
edge,
state.world.height,
"wall"
);

addObstacle(
state.world.width - edge,
0,
edge,
state.world.height,
"wall"
);

}

/* =====================================================
MUNDO
====================================================== */

function buildWorld() {

resetWorld();

addWorldBounds();

const builders = {

village: buildVillage,

forest: buildForest,

grove: buildGrove,

mountains: buildMountains,

iron: buildIron,

ruby: buildRuby,

shadow: buildShadow,

fairy: buildFairy,

sky: buildSky,

hell: buildHell,

final: buildFinal

};

builders[
state.area
]();

must("locationLabel").textContent =
REGIONS[state.area].name;

}

/* =====================================================
VILA
====================================================== */

function buildVillage() {

addBuilding(
"home",
270,
280,
430,
270,
"CASA DO AVENTUREIRO",
"#70483a",
"#ae835e"
);

addBuilding(
"elianHome",
830,
260,
350,
260,
"CASA DE ELIAN",
"#604a3d",
"#b48961"
);

addBuilding(
"forge",
2070,
300,
500,
300,
"FORJA DO FERREIRO",
"#484744",
"#8f8172"
);

addBuilding(
"shop",
2500,
1260,
430,
300,
"LOJA DE DORAN",
"#684638",
"#b4865b"
);

addBuilding(
"woodshop",
400,
1560,
450,
300,
"CARPINTARIA",
"#735638",
"#a77c4f"
);

addObstacle(
1465,
870,
270,
215,
"fountain"
);

[
[970,760],
[1100,720],
[1210,1800],
[1850,1630],
[2200,940],
[2740,860],
[650,1160],
[2370,1830]

].forEach(
([x,y]) => {

addObstacle(
x - 30,
y - 23,
60,
46,
"rock"
);

}
);

[
[180,180],
[390,180],
[650,170],
[940,150],
[1320,160],
[1750,160],
[2150,160],
[2600,170],
[2950,180],

[150,700],
[180,1050],
[190,1440],

[250,1960],
[1050,2010],
[1500,1980],
[1950,2020],
[2400,2030],
[2850,1960],

[3040,1710],
[3020,1200],
[3010,650],

[2850,1050],
[2150,750],
[1900,750],
[1150,1000]

].forEach(
(
[x,y],
index
) => {

addTree(
x,
y,
`village_tree_${index}`
);

}
);

addNPC(
1030,
610,
"ELIAN",
"Morador",
"#d4b27c",
[
"A Quietude parece estar chegando mais perto. Ontem eu esqueci o nome da rua onde cresci.",
"Meu pai dizia que a primeira coisa que some não é um lugar. É a lembrança de que ele existia.",
"A estrada leste está estranha. Um Guardião apareceu por lá e não deixa ninguém passar.",
"Se você descobrir alguma coisa fora da vila, volte. Precisamos de histórias novas para não esquecer as antigas."
]
);

addNPC(
1940,
1055,
"MARA",
"Historiadora",
"#b98bc4",
[
"Os registros mais antigos falam da Quietude como se ela já tivesse acontecido antes.",
"Cada pessoa descreve a Quietude de um jeito diferente. Isso é o que mais me assusta.",
"Alguns livros têm páginas inteiras em branco, mas a numeração continua como se algo estivesse faltando.",
"Quando você encontrar algo que não consegue explicar, tente lembrar de cada detalhe antes de voltar."
]
);

addNPC(
2700,
1125,
"DORAN",
"Comerciante",
"#c58a54",
[
"Compro materiais e vendo o que consigo trazer de fora.",
"Uma boa espada não resolve todos os problemas, mas resolve alguns deles bem rápido.",
"Guarde dinheiro para quando realmente precisar. As regiões além da vila não são gentis.",
"Se encontrar cristais ou minérios raros, eu pago bem."
],
{
merchant: true
}
);

addNPC(
1050,
1420,
"BRAN",
"Carpinteiro",
"#8d7053",
[
"Preciso reforçar algumas casas. A madeira anda apodrecendo mais rápido desde que a Quietude chegou.",
"As árvores daqui são estranhas. Algumas voltam a nascer longe do lugar onde caíram.",
"Se puder trazer dez madeiras, eu pago pelo trabalho.",
"Cortar madeira consome magia. Não se esgote por causa de uma árvore."
],
{
questId: "wood"
}
);

addNPC(
2280,
820,
"BORIN",
"Ferreiro",
"#8e8d89",
[
"O fogo da forja ainda lembra como queimar. Por enquanto.",
"Carvão bom está ficando difícil de encontrar.",
"Se trouxer oito carvões, posso compensar seu esforço.",
"Equipamento é investimento. Sobreviver costuma sair mais barato que morrer."
],
{
questId: "coal"
}
);

addEnemy({

id: "village_slime",

x: 1260,

y: 760,

name: "LIMO DA QUIETUDE",

icon: "🟢",

type: "normal",

hp: 58,

maxHp: 58,

damage: 8,

speed: 56,

vision: 190,

attackRange: 55,

radius: 18,

color: "#6c9862",

drop: "carvao",

dropAmount: 1

});

addEnemy({

id: "village_wolf",

x: 2190,

y: 1450,

name: "LOBO ESQUECIDO",

icon: "🐺",

type: "normal",

hp: 82,

maxHp: 82,

damage: 12,

speed: 92,

vision: 260,

attackRange: 65,

radius: 21,

color: "#686d78",

drop: "carvao",

dropAmount: 1

});

addEnemy({

id: "village_resource_boss",

x: 2350,

y: 1780,

name: "CERVO ANCESTRAL",

icon: "🦌",

type: "resourceBoss",

hp: 430,

maxHp: 430,

damage: 18,

speed: 64,

vision: 270,

attackRange: 75,

radius: 30,

color: "#788762",

drop: "ouro",

dropAmount: 2,

respawnTime: 60

});

addEnemy({

id: "forest_guardian",

x: 2850,

y: 1090,

name: "GUARDIÃO DA ESTRADA",

icon: "👺",

type: "progression",

hp: 280,

maxHp: 280,

damage: 20,

speed: 56,

vision: 280,

attackRange: 75,

radius: 29,

color: "#945149",

drop: "cristal",

dropAmount: 2,

unlock: "forest"

});

addPortal(
3060,
1010,
70,
210,
"forest",
() =>
hasDefeatedBoss(
"forest_guardian"
),
"FLORESTA"
);

}

/* =====================================================
FLORESTA
====================================================== */

function buildForest() {

for (
let i = 0;
i < 42;
i++
) {

addTree(
randomInt(
130,
3240
),
randomInt(
130,
2250
),
`forest_tree_${i}`
);

}

for (
let i = 0;
i < 9;
i++
) {

addEnemy({

id: `forest_enemy_${i}`,

x: randomInt(
450,
2900
),

y: randomInt(
300,
2050
),

name:
i % 2
? "LOBO FLORESTAL"
: "JAVALI SOMBRIO",

icon:
i % 2
? "🐺"
: "🐗",

type: "normal",

hp:
100 +
i * 2,

maxHp:
100 +
i * 2,

damage: 14,

speed: 95,

vision: 260,

attackRange: 65,

radius: 22,

color:
i % 2
? "#66716c"
: "#685844",

drop:
i % 3
? "carvao"
: "ferro",

dropAmount: 1

});

}

addNPC(
720,
850,
"NARA",
"Guardião da Floresta",
"#7ea56b",
[
"A floresta percebe quem passa por ela.",
"Há árvores que se movem quando ninguém está olhando.",
"A Quietude não mata todas as coisas. Algumas continuam andando sem lembrar por quê.",
"O caminho adiante só se abre para quem prova que consegue sobreviver aqui."
]
);

addEnemy({

id: "forest_resource_boss",

x: 2450,

y: 1750,

name: "ALCE ANCIÃO",

icon: "🦌",

type: "resourceBoss",

hp: 540,

maxHp: 540,

damage: 22,

speed: 55,

vision: 310,

attackRange: 78,

radius: 32,

color: "#71865d",

drop: "ouro",

dropAmount: 2,

respawnTime: 60

});

addEnemy({

id: "grove_guardian",

x: 2980,

y: 1150,

name: "GUARDIÃO DA FLORESTA",

icon: "🌳",

type: "progression",

hp: 420,

maxHp: 420,

damage: 24,

speed: 60,

vision: 310,

attackRange: 82,

radius: 31,

color: "#4d754b",

drop: "ferro",

dropAmount: 2,

unlock: "grove"

});

addPortal(
3260,
1030,
70,
220,
"grove",
() =>
hasDefeatedBoss(
"grove_guardian"
),
"BOSQUE"
);

}

/* =====================================================
BOSQUE
====================================================== */

function buildGrove() {

for (
let i = 0;
i < 34;
i++
) {

addTree(
randomInt(
130,
3040
),
randomInt(
130,
2150
),
`grove_tree_${i}`
);

}

for (
let i = 0;
i < 8;
i++
) {

addEnemy({

id: `grove_enemy_${i}`,

x: randomInt(
400,
2700
),

y: randomInt(
300,
1950
),

name: "FERA DO BOSQUE",

icon: "🦌",

type: "normal",

hp: 135,

maxHp: 135,

damage: 17,

speed: 86,

vision: 260,

attackRange: 65,

radius: 23,

color: "#60745e",

drop: "ferro",

dropAmount: 1

});

}

addNPC(
1350,
800,
"LYRA",
"Druida",
"#829f6f",
[
"Este bosque guarda memórias nas raízes.",
"Quando uma árvore cai, às vezes outra nasce carregando lembranças que não são dela.",
"As montanhas ficam além deste lugar.",
"Não confunda silêncio com paz."
]
);

addEnemy({

id: "mountain_guardian",

x: 2760,

y: 1110,

name: "GUARDIÃO DO BOSQUE",

icon: "🌲",

type: "progression",

hp: 510,

maxHp: 510,

damage: 28,

speed: 58,

vision: 320,

attackRange: 84,

radius: 32,

color: "#557251",

drop: "ouro",

dropAmount: 2,

unlock: "mountains"

});

addPortal(
3060,
1000,
70,
220,
"mountains",
() =>
hasDefeatedBoss(
"mountain_guardian"
),
"MONTANHAS"
);

}

/* =====================================================
MONTANHAS
====================================================== */

function buildMountains() {

for (
let i = 0;
i < 24;
i++
) {

addObstacle(
randomInt(
180,
3200
),
randomInt(
160,
2100
),
70,
52,
"snowrock"
);

}

for (
let i = 0;
i < 8;
i++
) {

addEnemy({

id: `mountain_enemy_${i}`,

x: randomInt(
450,
2950
),

y: randomInt(
300,
1950
),

name: "BESTA DAS MONTANHAS",

icon: "🐐",

type: "normal",

hp: 160,

maxHp: 160,

damage: 20,

speed: 72,

vision: 265,

attackRange: 68,

radius: 24,

color: "#c7ccca",

drop: "ferro",

dropAmount: 1

});

}

addNPC(
760,
900,
"KAEL",
"Montanhista",
"#d2d6d2",
[
"O vento daqui apaga pegadas em minutos.",
"Há uma passagem antiga na montanha.",
"Minérios abaixo da neve ainda reagem à magia.",
"Não fique parado por muito tempo. Algumas coisas confundem viajantes com pedras."
]
);

addEnemy({

id: "iron_guardian",

x: 3000,

y: 1100,

name: "SENTINELA DAS MONTANHAS",

icon: "🗿",

type: "progression",

hp: 620,

maxHp: 620,

damage: 31,

speed: 54,

vision: 340,

attackRange: 86,

radius: 34,

color: "#72797e",

drop: "ferro",

dropAmount: 3,

unlock: "iron"

});

addPortal(
3300,
1010,
70,
220,
"iron",
() =>
hasDefeatedBoss(
"iron_guardian"
),
"PASSAGEM DA MONTANHA"
);

}

/* =====================================================
FERRO
====================================================== */

function buildIron() {

for (
let i = 0;
i < 24;
i++
) {

addObstacle(
randomInt(
160,
2680
),
randomInt(
160,
1700
),
65,
48,
"ironrock"
);

}

for (
let i = 0;
i < 22;
i++
) {

addResource(
randomInt(
220,
2600
),
randomInt(
200,
1650
),
"ferro"
);

}

for (
let i = 0;
i < 7;
i++
) {

addEnemy({

id: `iron_enemy_${i}`,

x: randomInt(
400,
2300
),

y: randomInt(
260,
1550
),

name: "MINERADOR ESQUECIDO",

icon: "⛏️",

type: "normal",

hp: 180,

maxHp: 180,

damage: 22,

speed: 63,

vision: 250,

attackRange: 70,

radius: 24,

color: "#60686a",

drop: "ferro",

dropAmount: 2

});

}

addEnemy({

id: "ruby_guardian",

x: 2450,

y: 950,

name: "GUARDIÃO DE FERRO",

icon: "⚙️",

type: "progression",

hp: 720,

maxHp: 720,

damage: 35,

speed: 55,

vision: 350,

attackRange: 88,

radius: 35,

color: "#71787c",

drop: "ouro",

dropAmount: 3,

unlock: "ruby"

});

addPortal(
2750,
840,
70,
230,
"ruby",
() =>
hasDefeatedBoss(
"ruby_guardian"
),
"PASSAGEM VERMELHA"
);

}

/* =====================================================
RUBI
====================================================== */

function buildRuby() {

for (
let i = 0;
i < 25;
i++
) {

addObstacle(
randomInt(
180,
2860
),
randomInt(
180,
1900
),
68,
48,
"rubyrock"
);

}

for (
let i = 0;
i < 28;
i++
) {

addResource(
randomInt(
230,
2860
),
randomInt(
190,
1880
),
"rubi"
);

}

for (
let i = 0;
i < 8;
i++
) {

addEnemy({

id: `ruby_enemy_${i}`,

x: randomInt(
400,
2600
),

y: randomInt(
260,
1800
),

name: "CRIATURA RUBI",

icon: "♦",

type: "normal",

hp: 220,

maxHp: 220,

damage: 26,

speed: 71,

vision: 270,

attackRange: 72,

radius: 25,

color: "#a04551",

drop: "rubi",

dropAmount: 1

});

}

addEnemy({

id: "shadow_guardian",

x: 2620,

y: 1010,

name: "GUARDIÃO RUBI",

icon: "🔴",

type: "progression",

hp: 830,

maxHp: 830,

damage: 39,

speed: 59,

vision: 355,

attackRange: 92,

radius: 36,

color: "#a53e51",

drop: "rubi",

dropAmount: 3,

unlock: "shadow"

});

addPortal(
2920,
890,
70,
230,
"shadow",
() =>
hasDefeatedBoss(
"shadow_guardian"
),
"CORREDOR ESCURO"
);

}

/* =====================================================
SOMBRA
====================================================== */

function buildShadow() {

for (
let i = 0;
i < 25;
i++
) {

addObstacle(
randomInt(
170,
2720
),
randomInt(
170,
1800
),
66,
48,
"darkrock"
);

}

for (
let i = 0;
i < 9;
i++
) {

addEnemy({

id: `shadow_enemy_${i}`,

x: randomInt(
420,
2500
),

y: randomInt(
260,
1700
),

name: "SOMBRA ESQUECIDA",

icon: "👤",

type: "normal",

hp: 265,

maxHp: 265,

damage: 30,

speed: 79,

vision: 290,

attackRange: 72,

radius: 25,

color: "#49425f",

drop: "essencia",

dropAmount: 1

});

}

addEnemy({

id: "fairy_guardian",

x: 2500,

y: 980,

name: "GUARDIÃO SOMBRIO",

icon: "🌑",

type: "progression",

hp: 930,

maxHp: 930,

damage: 42,

speed: 63,

vision: 360,

attackRange: 94,

radius: 36,

color: "#42364f",

drop: "essencia",

dropAmount: 3,

unlock: "fairy"

});

addPortal(
2790,
860,
70,
230,
"fairy",
() =>
hasDefeatedBoss(
"fairy_guardian"
),
"LUZ ADIANTE"
);

}

/* =====================================================
FADAS
====================================================== */

function buildFairy() {

for (
let i = 0;
i < 26;
i++
) {

addResource(
randomInt(
200,
3000
),
randomInt(
180,
2000
),
"cristal"
);

}

for (
let i = 0;
i < 22;
i++
) {

state.world.effects.push({

type: "flower",

x:
randomInt(
150,
3050
),

y:
randomInt(
150,
2050
),

phase:
random(
0,
Math.PI * 2
)

});

}

for (
let i = 0;
i < 7;
i++
) {

addEnemy({

id: `fairy_enemy_${i}`,

x: randomInt(
450,
2700
),

y: randomInt(
270,
1800
),

name: "ESPÍRITO FEÉRICO",

icon: "🦋",

type: "normal",

hp: 285,

maxHp: 285,

damage: 32,

speed: 93,

vision: 300,

attackRange: 74,

radius: 24,

color: "#b887be",

drop: "cristal",

dropAmount: 1

});

}

addNPC(
1000,
1000,
"AELIA",
"Habitante das Fadas",
"#d49ad4",
[
"As flores daqui brilham quando alguém lembra de algo importante.",
"A Quietude não gosta de memórias compartilhadas.",
"Há caminhos que só aparecem depois que alguém decide não esquecer.",
"Você trouxe lembranças de lugares que eu nunca vi. Isso já muda este reino."
]
);

addEnemy({

id: "sky_guardian",

x: 2700,

y: 1050,

name: "GUARDIÃ DOS FIOS",

icon: "🧚",

type: "progression",

hp: 1080,

maxHp: 1080,

damage: 44,

speed: 70,

vision: 380,

attackRange: 96,

radius: 37,

color: "#cb8dd0",

drop: "essencia",

dropAmount: 4,

unlock: "sky"

});

addPortal(
3000,
930,
70,
230,
"sky",
() =>
hasDefeatedBoss(
"sky_guardian"
),
"PASSAGEM CELESTE"
);

}

/* =====================================================
CÉU
====================================================== */

function buildSky() {

for (
let i = 0;
i < 20;
i++
) {

addResource(
randomInt(
200,
3200
),
randomInt(
180,
1950
),
"cristal"
);

}

for (
let i = 0;
i < 8;
i++
) {

addEnemy({

id: `sky_enemy_${i}`,

x: randomInt(
500,
2950
),

y: randomInt(
260,
1800
),

name: "SERAFIM CAÍDO",

icon: "🪽",

type: "normal",

hp: 340,

maxHp: 340,

damage: 36,

speed: 101,

vision: 325,

attackRange: 76,

radius: 27,

color: "#cbd7df",

drop: "cristal",

dropAmount: 2

});

}

addNPC(
1200,
850,
"AERIS",
"Guardião Celeste",
"#c7d4df",
[
"Até aqui existem coisas que estão sendo esquecidas.",
"O céu não fica acima de tudo. Algumas coisas ainda estão além dele.",
"A Quietude deixa marcas até onde não há chão.",
"Se continuar, faça isso porque escolheu lembrar — não porque alguém mandou."
]
);

addEnemy({

id: "hell_guardian",

x: 2890,

y: 1100,

name: "SERAFIM DA QUIETUDE",

icon: "☀️",

type: "progression",

hp: 1250,

maxHp: 1250,

damage: 50,

speed: 71,

vision: 400,

attackRange: 102,

radius: 40,

color: "#d1b377",

drop: "essencia",

dropAmount: 4,

unlock: "hell"

});

addPortal(
3220,
990,
70,
230,
"hell",
() =>
hasDefeatedBoss(
"hell_guardian"
),
"PASSAGEM DESCONHECIDA"
);

}

/* =====================================================
INFERNO
====================================================== */

function buildHell() {

for (
let i = 0;
i < 26;
i++
) {

addObstacle(
randomInt(
180,
3380
),
randomInt(
170,
2150
),
70,
50,
"basalt"
);

}

const types = [

[
"DEMÔNIO DE CINZA",
"🔥",
"#8c4d3f",
"essencia"
],

[
"CÃO DE LAVA",
"🐕",
"#984b31",
"ouro"
],

[
"ESPECTRO CARMESIM",
"👻",
"#724056",
"essencia"
],

[
"GÁRGULA QUEBRADA",
"🗿",
"#70554a",
"ouro"
],

[
"PARASITA DO VAZIO",
"🕷️",
"#4b3551",
"essencia"
]

];

types.forEach(
(
[
name,
icon,
color,
drop
],
typeIndex
) => {

for (
let i = 0;
i < 2;
i++
) {

addEnemy({

id:
`hell_${typeIndex}_${i}`,

x:
randomInt(
450,
3000
),

y:
randomInt(
280,
2050
),

name,

icon,

type: "hell",

hellType: typeIndex,

hp:
380 +
typeIndex * 35,

maxHp:
380 +
typeIndex * 35,

damage:
36 +
typeIndex * 3,

speed:
80 +
typeIndex * 4,

vision: 340,

attackRange: 78,

radius: 27,

color,

drop,

dropAmount: 1

});

}

}
);

addEnemy({

id: "final_gate_guardian",

x: 3050,

y: 1120,

name: "SENHOR DA QUIETUDE",

icon: "👿",

type: "progression",

hp: 1550,

maxHp: 1550,

damage: 56,

speed: 76,

vision: 430,

attackRange: 108,

radius: 41,

color: "#a64139",

drop: "essencia",

dropAmount: 6,

unlock: "final"

});

addPortal(
3390,
1010,
70,
230,
"final",
() => {

return (

hasDefeatedBoss(
"final_gate_guardian"
) &&

Object.keys(
state.player
.hellTypesDefeated
).length >= 5

);

},
"PORTA SELADA"
);

}

/* =====================================================
FINAL
====================================================== */

function buildFinal() {

addEnemy({

id: "other_self",

x: 1550,

y: 750,

name: "O OUTRO EU",

icon: "☯",

type: "final",

hp: 2200,

maxHp: 2200,

damage: 62,

speed: 86,

vision: 650,

attackRange: 112,

radius: 42,

color: "#b7aaa0",

drop: "essencia",

dropAmount: 10

});

}

function hasDefeatedBoss(id) {

return Boolean(
state.player
?.defeatedBosses
?.includes(id)
);

}

/* =====================================================
COLISÃO
====================================================== */

function circleRectCollision(
cx,
cy,
radius,
rect
) {

const closestX =
clamp(
cx,
rect.x,
rect.x + rect.w
);

const closestY =
clamp(
cy,
rect.y,
rect.y + rect.h
);

const dx =
cx - closestX;

const dy =
cy - closestY;

return (
dx * dx +
dy * dy <
radius * radius
);

}

function canPlayerMoveTo(
x,
y,
radius
) {

if (
state.houseMode
) {

const room =
getHouseRoom();

const insideRoom = (

x - radius >=
room.x + 18 &&

y - radius >=
room.y + 18 &&

x + radius <=
room.x +
room.w -
18 &&

y + radius <=
room.y +
room.h -
18

);

if (
!insideRoom
) {

return false;

}

for (
const npc of
getInteriorNPCs()
) {

if (

Math.hypot(
x - npc.x,
y - npc.y
) <

radius +
npc.radius +
4

) {

return false;

}

}

return true;

}

if (

x - radius < 72 ||

y - radius < 72 ||

x + radius >
state.world.width -
72 ||

y + radius >
state.world.height -
72

) {

return false;

}

for (
const obstacle of
state.world.obstacles
) {

if (
obstacle.treeId
) {

const tree =
state.world.trees.find(
item =>
item.id ===
obstacle.treeId
);

if (
!tree?.alive
) {

continue;

}

}

if (
circleRectCollision(
x,
y,
radius,
obstacle
)
) {

return false;

}

}

for (
const npc of
state.world.npcs
) {

if (

Math.hypot(
x - npc.x,
y - npc.y
) <

radius +
npc.radius

) {

return false;

}

}

return true;

}

function canEnemyMoveTo(
x,
y,
radius
) {

if (

x - radius < 72 ||

y - radius < 72 ||

x + radius >
state.world.width -
72 ||

y + radius >
state.world.height -
72

) {

return false;

}

for (
const obstacle of
state.world.obstacles
) {

if (
obstacle.treeId
) {

const tree =
state.world.trees.find(
item =>
item.id ===
obstacle.treeId
);

if (
!tree?.alive
) {

continue;

}

}

if (
circleRectCollision(
x,
y,
radius,
obstacle
)
) {

return false;

}

}

return true;

}

/* =====================================================
CASAS
====================================================== */

function getHouseRoom() {

const building =
state.currentHouse;

const w =
clamp(
(building?.w || 430) +
150,
560,
760
);

const h =
clamp(
(building?.h || 270) +
150,
420,
560
);

return {

x:
state.world.width / 2 -
w / 2,

y:
state.world.height / 2 -
h / 2,

w,

h

};

}

function getHouseTheme() {

const themes = {

home: {

wall: "#4b342b",

floor: "#9a7452",

trim: "#d8b87a",

accent: "#efb05b"

},

elianHome: {

wall: "#3f3831",

floor: "#856a50",

trim: "#cab07e",

accent: "#6d8790"

},

forge: {

wall: "#292b2f",

floor: "#55504a",

trim: "#a39789",

accent: "#ff8149"

},

shop: {

wall: "#3e2e28",

floor: "#8c6847",

trim: "#e0bc75",

accent: "#e8c56f"

},

woodshop: {

wall: "#453225",

floor: "#a0784f",

trim: "#d9b276",

accent: "#d89c55"

}

};

return (
themes[
state.currentHouse?.id
] ||
themes.home
);

}

function getInteriorNPCs() {

if (
!state.houseMode ||
!state.currentHouse
) {

return [];

}

const room =
getHouseRoom();

const configs = {

elianHome: {

name: "ELIAN",

role: "Morador",

color: "#d4b27c",

dx: .73,

dy: .38

},

forge: {

name: "BORIN",

role: "Ferreiro",

color: "#8e8d89",

questId: "coal",

dx: .73,

dy: .47

},

shop: {

name: "DORAN",

role: "Comerciante",

color: "#c58a54",

merchant: true,

dx: .72,

dy: .34

},

woodshop: {

name: "BRAN",

role: "Carpinteiro",

color: "#8d7053",

questId: "wood",

dx: .73,

dy: .43

}

};

const config =
configs[
state.currentHouse.id
];

if (
!config
) {

return [];

}

const original =
state.world.npcs.find(
npc =>
npc.name ===
config.name
);

return [

{

...(original || {}),

...config,

id:
"inside_" +
state.currentHouse.id +
"_" +
config.name,

x:
room.x +
room.w *
config.dx,

y:
room.y +
room.h *
config.dy,

radius: 17,

lines:
original?.lines ||
[
"Bem-vindo."
],

interior: true

}

];

}

function placePlayerInsideHouse() {

const room =
getHouseRoom();

state.player.x =
room.x +
room.w / 2;

state.player.y =
room.y +
room.h -
64;

state.keys.clear();

updateCamera();

}

/* =====================================================
MOVIMENTO
====================================================== */

function updateMovement(dt) {

if (
state.paused ||
!state.player
) {

return;

}

let dx =
0;

let dy =
0;

if (
state.keys.has("w") ||
state.keys.has("arrowup")
) {

dy--;

}

if (
state.keys.has("s") ||
state.keys.has("arrowdown")
) {

dy++;

}

if (
state.keys.has("a") ||
state.keys.has("arrowleft")
) {

dx--;

}

if (
state.keys.has("d") ||
state.keys.has("arrowright")
) {

dx++;

}

if (
!dx &&
!dy
) {

return;

}

const length =
Math.hypot(
dx,
dy
) ||
1;

dx /=
length;

dy /=
length;

let speed =
state.houseMode
? 130
: state.player.speed;

if (
!state.houseMode &&
state.player.hunger <= 20
) {

speed *= .72;

}

if (
!state.houseMode &&
state.player.fatigue <= 20
) {

speed *= .72;

}

const step =
speed *
dt;

const nextX =
state.player.x +
dx *
step;

if (
canPlayerMoveTo(
nextX,
state.player.y,
state.player.radius
)
) {

state.player.x =
nextX;

}

const nextY =
state.player.y +
dy *
step;

if (
canPlayerMoveTo(
state.player.x,
nextY,
state.player.radius
)
) {

state.player.y =
nextY;

}

}

/* =====================================================
SOBREVIVÊNCIA
====================================================== */

function updateSurvival(dt) {

if (
state.houseMode ||
state.paused
) {

return;

}

const player =
state.player;

player.hunger =
clamp(
player.hunger -
.25 * dt,
0,
100
);

player.fatigue =
clamp(
player.fatigue -
.2 * dt,
0,
100
);

player.magic =
clamp(
player.magic +
1.7 * dt,
0,
player.maxMagic
);

player.energy =
clamp(
player.energy +
3 * dt,
0,
player.maxEnergy
);

if (
player.hunger <= 0 ||
player.fatigue <= 0
) {

player.hp =
clamp(
player.hp -
.12 * dt,
1,
player.maxHp
);

}

const now =
performance.now();

if (
now -
state.warnedNeedAt >
7000
) {

if (
player.hunger < 18
) {

showToast(
"Você está ficando com fome."
);

state.warnedNeedAt =
now;

}

else if (
player.fatigue < 18
) {

showToast(
"Você está cansado."
);

state.warnedNeedAt =
now;

}

}

}

/* =====================================================
INIMIGOS
====================================================== */

function updateEnemies(dt) {

if (
state.houseMode ||
state.paused
) {

return;

}

for (
const enemy of
state.world.enemies
) {

if (
enemy.dead
) {

if (
enemy.type ===
"resourceBoss"
) {

enemy.respawnTimer -=
dt;

if (
enemy.respawnTimer <= 0
) {

enemy.dead =
false;

enemy.hp =
enemy.maxHp;

enemy.aggressive =
false;

enemy.accepted =
false;

enemy.state =
"idle";

showToast(
`${enemy.name} retornou à região.`
);

}

}

continue;

}

enemy.attackTimer =
Math.max(
0,
enemy.attackTimer -
dt
);

enemy.hitFlash =
Math.max(
0,
enemy.hitFlash -
dt
);

const d =
distance(
enemy,
state.player
);

if (
enemy.type ===
"final" &&
!state.player.finalChoice
) {

if (
d < 130 &&
!state.finalChoiceShown
) {

openFinalChoice();

}

continue;

}

if (
enemy.type ===
"progression" &&
!enemy.accepted
) {

continue;

}

if (
!enemy.aggressive &&
d <= enemy.vision
) {

enemy.aggressive =
true;

enemy.state =
"chasing";

showToast(
`${enemy.name} percebeu você!`
);

}

if (
!enemy.aggressive
) {

continue;

}

if (

d >
enemy.vision *
1.9 &&

enemy.type !==
"hell" &&

enemy.type !==
"final"

) {

enemy.aggressive =
false;

enemy.state =
"idle";

continue;

}

if (
d >
enemy.attackRange
) {

const length =
d || 1;

const vx =
(
(
state.player.x -
enemy.x
) /
length
) *
enemy.speed *
dt;

const vy =
(
(
state.player.y -
enemy.y
) /
length
) *
enemy.speed *
dt;

if (
canEnemyMoveTo(
enemy.x + vx,
enemy.y,
enemy.radius
)
) {

enemy.x +=
vx;

}

if (
canEnemyMoveTo(
enemy.x,
enemy.y + vy,
enemy.radius
)
) {

enemy.y +=
vy;

}

}

else if (
enemy.attackTimer <= 0
) {

damagePlayer(
enemy.damage
);

enemy.attackTimer =
1.15;

}

if (
enemy.type ===
"final"
) {

updateFinalBoss(
enemy,
dt
);

}

}

}

function updateFinalBoss(
enemy,
dt
) {

const ratio =
enemy.hp /
enemy.maxHp;

const newPhase =
ratio > .75
? 1
: ratio > .5
? 2
: ratio > .25
? 3
: 4;

if (
newPhase !==
enemy.phase
) {

enemy.phase =
newPhase;

showToast(
`O Outro Eu mudou de comportamento. Fase ${newPhase}.`
);

}

if (
Math.random() <
dt *
.18 *
newPhase
) {

state.world.effects.push({

type: "dangerOrb",

x:
enemy.x +
random(
-50,
50
),

y:
enemy.y +
random(
-50,
50
),

life: 1.5

});

if (
newPhase === 4 &&
distance(
enemy,
state.player
) < 260
) {

damagePlayer(
10
);

}

}

}

/* =====================================================
DANO
====================================================== */

function damagePlayer(amount) {

const player =
state.player;

if (
!player ||
player.invincible > 0 ||
player.dead
) {

return;

}

const armorDefense =
ITEMS[
player.equipment.armor
]?.defense ||
0;

const finalDamage =
Math.max(
1,
Math.round(

amount -

(
player.defense +
armorDefense
) *
.35

)
);

player.hp =
Math.max(
0,
player.hp -
finalDamage
);

player.invincible =
.65;

showToast(
`Você sofreu ${finalDamage} de dano.`
);

if (
player.hp <= 0
) {

playerDeath();

}

}

function playerDeath() {

state.player.dead =
true;

state.paused =
true;

must("deathPanel")
.classList.remove(
"hidden"
);

}

function respawnPlayer() {

const checkpoint =
state.player.checkpoint ||
{

area: "village",

x: 480,

y: 610

};

state.area =
REGIONS[
checkpoint.area
]
? checkpoint.area
: "village";

state.houseMode =
false;

state.currentHouse =
null;

state.houseReturn =
null;

buildWorld();

state.player.x =
checkpoint.x;

state.player.y =
checkpoint.y;

state.player.hp =
Math.max(
1,
Math.floor(
state.player.maxHp *
.7
)
);

state.player.magic =
Math.max(
1,
Math.floor(
state.player.maxMagic *
.7
)
);

state.player.energy =
Math.max(
1,
Math.floor(
state.player.maxEnergy *
.7
)
);

state.player.money =
Math.floor(
state.player.money *
.9
);

state.player.dead =
false;

state.player.invincible =
1;

state.paused =
false;

must("deathPanel")
.classList.add(
"hidden"
);

showToast(
"Você retornou ao último ponto seguro."
);

}

/* =====================================================
COMBATE
====================================================== */

function findNearestEnemy(range) {

let best =
null;

let bestDistance =
Infinity;

for (
const enemy of
state.world.enemies
) {

if (
enemy.dead
) {

continue;

}

const d =
distance(
enemy,
state.player
);

if (
d <= range &&
d < bestDistance
) {

best =
enemy;

bestDistance =
d;

}

}

return best;

}

function performAttack() {

const player =
state.player;

if (
!player ||
state.paused ||
state.dialogue ||
state.travel ||
state.battle ||
player.dead
) {

return;

}

if (
player.attackCooldown > 0
) {

return;

}

if (
player.energy < 8
) {

showToast(
"Energia insuficiente."
);

return;

}

player.energy -=
8;

player.attackCooldown =
.45;

player.hunger =
Math.max(
0,
player.hunger -
.6
);

player.fatigue =
Math.max(
0,
player.fatigue -
.9
);

const character =
currentCharacter();

const attackRange =

character.id ===
"kaelion" ||

character.id ===
"lirael"

? 250
: 125;

const target =
findNearestEnemy(
attackRange
);

if (
!target
) {

useClassAbility();

return;

}

if (
target.type ===
"progression" &&
!target.accepted
) {

openBattle(
target
);

return;

}

let damage =
player.damage +

(
ITEMS[
player.equipment.weapon
]?.damage ||
0
);

if (
character.id ===
"grumgar"
) {

damage +=
10;

}

if (
character.id ===
"kaelion"
) {

damage +=
5;

}

if (
character.id ===
"theron"
) {

damage +=
5;

}

attackEnemy(
target,
damage
);

}

function useClassAbility() {

const player =
state.player;

const character =
currentCharacter();

if (
character.id ===
"lirael"
) {

if (
player.magic < 14
) {

showToast(
"Magia insuficiente."
);

return;

}

player.magic -=
14;

player.hp =
Math.min(
player.maxHp,
player.hp +
45
);

spawnParticles(
player.x,
player.y,
character.color,
16
);

showToast(
"Lirael usou Luz Vital."
);

return;

}

if (
character.id ===
"zephyr"
) {

if (
player.magic < 12
) {

showToast(
"Magia insuficiente."
);

return;

}

player.magic -=
12;

if (
!player.adaptiveBuff
) {

player.adaptiveBuff =
true;

player.speed +=
22;

player.damage +=
5;

setTimeout(
() => {

if (
state.player?.adaptiveBuff
) {

state.player.speed -=
22;

state.player.damage -=
5;

state.player.adaptiveBuff =
false;

}

},
6500
);

}

spawnParticles(
player.x,
player.y,
character.color,
16
);

showToast(
"Zephyr usou Forma Adaptativa."
);

return;

}

if (
player.magic < 10
) {

showToast(
"Magia insuficiente."
);

return;

}

player.magic -=
10;

spawnParticles(
player.x,
player.y,
character.color,
14
);

showToast(
`${character.skill}.`
);

}

function attackEnemy(
enemy,
damage
) {

if (
!enemy ||
enemy.dead
) {

return;

}

enemy.accepted =
true;

enemy.aggressive =
true;

enemy.state =
"chasing";

enemy.hp =
Math.max(
0,
enemy.hp -
damage
);

enemy.hitFlash =
.18;

spawnParticles(
enemy.x,
enemy.y,
"#ffffff",
8
);

if (
enemy.hp <= 0
) {

defeatEnemy(
enemy
);

}

}

function defeatEnemy(enemy) {

if (
enemy.dead
) {

return;

}

enemy.dead =
true;

enemy.state =
"dead";

const xp =

enemy.type ===
"progression"
? 180

: enemy.type ===
"resourceBoss"
? 120

: enemy.type ===
"hell"
? 60

: enemy.type ===
"final"
? 600

: 30;

const money =

enemy.type ===
"progression"
? 80

: enemy.type ===
"resourceBoss"
? 45

: 12;

state.player.xp +=
xp;

state.player.money +=
money;

if (
enemy.drop &&
ITEMS[enemy.drop]
) {

addItem(
enemy.drop,
enemy.dropAmount ||
1
);

state.world.drops.push({

x: enemy.x,

y: enemy.y,

type: enemy.drop,

amount:
enemy.dropAmount ||
1,

life: 18

});

}

if (
enemy.type ===
"resourceBoss"
) {

enemy.respawnTimer =
enemy.respawnTime ||
60;

}

if (
enemy.type ===
"hell" &&
enemy.hellType !==
undefined
) {

state.player.hellTypesDefeated[
String(
enemy.hellType
)
] = true;

}

if (
enemy.type ===
"progression"
) {

if (
!state.player.defeatedBosses.includes(
enemy.id
)
) {

state.player.defeatedBosses.push(
enemy.id
);

}

if (
!state.player.discoveredBosses.includes(
enemy.id
)
) {

state.player.discoveredBosses.push(
enemy.id
);

}

if (
enemy.unlock &&
!state.player.unlockedAreas.includes(
enemy.unlock
)
) {

state.player.unlockedAreas.push(
enemy.unlock
);

}

}

if (
enemy.type ===
"final"
) {

state.player.finalDefeated =
true;

showEnding(
"Você enfrentou a Quietude e preservou sua própria memória."
);

}

checkLevelUp();

saveGame(
false
);

showToast(
`${enemy.name} derrotado! +${xp} XP`
);

}

/* =====================================================
NÍVEL
====================================================== */

function checkLevelUp() {

const player =
state.player;

while (
player.xp >=
player.xpToNext
) {

player.xp -=
player.xpToNext;

player.level++;

player.xpToNext =
Math.floor(
player.xpToNext *
1.42
);

player.maxHp +=
12;

player.maxMagic +=
8;

player.maxEnergy +=
8;

player.hp =
player.maxHp;

player.magic =
player.maxMagic;

player.energy =
player.maxEnergy;

player.memory =
Math.min(
100,
player.memory +
8
);

showToast(
`Você chegou ao nível ${player.level}!`
);

}

}

/* =====================================================
ITENS
====================================================== */

function addItem(
id,
amount
) {

if (
!ITEMS[id] ||
!state.player
) {

return false;

}

const safeAmount =
Math.max(
0,
Math.floor(
amount
)
);

if (
!safeAmount
) {

return false;

}

if (
state.player.inventory[id] ===
undefined
) {

state.player.inventory[id] =
0;

}

state.player.inventory[id] +=
safeAmount;

return true;

}

function removeItem(
id,
amount
) {

const safeAmount =
Math.max(
0,
Math.floor(
amount
)
);

if (
!safeAmount
) {

return false;

}

const current =
state.player?.inventory?.[id] ||
0;

if (
current <
safeAmount
) {

return false;

}

state.player.inventory[id] =
current -
safeAmount;

return true;

}

/* =====================================================
COLETA
====================================================== */

function harvestTree(tree) {

if (
!tree?.alive
) {

return;

}

const cost =
4;

if (
state.player.magic <
cost
) {

showToast(
"Magia insuficiente para cortar a árvore."
);

return;

}

state.player.magic -=
cost;

state.player.hunger =
Math.max(
0,
state.player.hunger -
1
);

state.player.fatigue =
Math.max(
0,
state.player.fatigue -
2
);

tree.alive =
false;

tree.respawn =
random(
12,
24
);

addItem(
"madeira",
tree.amount
);

const key =
`tree:${state.area}`;

const count =
state.player.collected[key] ||
0;

state.player.collected[key] =
count +
1;

state.player.xp +=
Math.max(
2,
7 -
Math.floor(
count / 4
)
);

spawnParticles(
tree.x,
tree.y,
"#9b7345",
12
);

checkLevelUp();

showToast(
`Madeira coletada: x${tree.amount}`
);

}

function collectResource(resource) {

if (
!resource?.alive
) {

return;

}

const costs = {

carvao: 7,

ferro: 13,

ouro: 24,

rubi: 35,

cristal: 18

};

const cost =
costs[
resource.type
] ||
7;

if (
state.player.magic <
cost
) {

showToast(
"Magia insuficiente para coletar este recurso."
);

return;

}

state.player.magic -=
cost;

state.player.hunger =
Math.max(
0,
state.player.hunger -
1
);

state.player.fatigue =
Math.max(
0,
state.player.fatigue -
2
);

resource.alive =
false;

resource.respawn =
random(
16,
32
);

addItem(
resource.type,
resource.amount
);

const key =
`resource:${state.area}:${resource.type}`;

const count =
state.player.collected[key] ||
0;

state.player.collected[key] =
count +
1;

state.player.xp +=
Math.max(
2,
8 -
Math.floor(
count / 4
)
);

state.player.memory =
Math.min(
100,
state.player.memory +
1
);

checkLevelUp();

showToast(
`${ITEMS[resource.type].name} coletado: x${resource.amount}`
);

}

function updateResources(dt) {

for (
const tree of
state.world.trees
) {

if (
tree.alive
) {

continue;

}

tree.respawn -=
dt;

if (
tree.respawn <= 0
) {

respawnTree(
tree
);

}

}

for (
const resource of
state.world.resources
) {

if (
resource.alive
) {

continue;

}

resource.respawn -=
dt;

if (
resource.respawn <= 0
) {

resource.alive =
true;

}

}

state.world.drops.forEach(
drop => {

drop.life -=
dt;

}
);

state.world.drops =
state.world.drops.filter(
drop =>
drop.life > 0
);

}

function respawnTree(tree) {

let tries =
0;

let x =
tree.x;

let y =
tree.y;

do {

x =
randomInt(
120,
state.world.width -
120
);

y =
randomInt(
120,
state.world.height -
120
);

tries++;

}

while (

tries < 60 &&

!canPlayerMoveTo(
x,
y,
35
)

);

tree.x =
x;

tree.y =
y;

tree.alive =
true;

tree.amount =
randomInt(
2,
5
);

const obstacle =
state.world.obstacles.find(
item =>
item.treeId ===
tree.id
);

if (
obstacle
) {

obstacle.x =
x - 30;

obstacle.y =
y - 38;

}

}

/* =====================================================
INTERAÇÃO
====================================================== */

function getInteraction() {

if (
!state.player
) {

return null;

}

if (
state.houseMode
) {

let nearest =
null;

let best =
Infinity;

getInteriorNPCs().forEach(
npc => {

const d =
distance(
state.player,
npc
);

if (
d <= 78 &&
d < best
) {

nearest =
npc;

best =
d;

}

}
);

if (
nearest
) {

return {

type: "npc",

object: nearest

};

}

return {

type: "exitHouse",

object:
state.currentHouse

};

}

let best =
null;

let bestDistance =
Infinity;

const test = (
type,
object,
limit
) => {

const d =
distance(
state.player,
object
);

if (
d <= limit &&
d < bestDistance
) {

best = {

type,

object

};

bestDistance =
d;

}

};

state.world.npcs.forEach(
npc =>
test(
"npc",
npc,
70
)
);

state.world.trees
.filter(
tree =>
tree.alive
)
.forEach(
tree =>
test(
"tree",
tree,
72
)
);

state.world.resources
.filter(
resource =>
resource.alive
)
.forEach(
resource =>
test(
"resource",
resource,
72
)
);

state.world.enemies
.filter(
enemy =>
!enemy.dead
)
.forEach(
enemy =>
test(

enemy.type ===
"progression"
? "boss"
: "enemy",

enemy,

110

)
);

for (
const building of
state.world.buildings
) {

const door = {

x:
building.x +
building.w / 2,

y:
building.y +
building.h +
18

};

const d =
distance(
state.player,
door
);

if (
d <= 90 &&
d < bestDistance
) {

best = {

type: "house",

object: building

};

bestDistance =
d;

}

}

return best;

}

function playerAction() {

if (
!state.player
) {

return;

}

if (
state.dialogue
) {

advanceDialogue();

return;

}

if (
state.paused
) {

return;

}

const interaction =
getInteraction();

if (
!interaction
) {

performAttack();

return;

}

if (
interaction.type ===
"npc"
) {

if (
interaction.object.merchant
) {

openShop(
interaction.object
);

}

else if (
interaction.object.questId
) {

openQuest(
interaction.object
);

}

else {

startDialogue(
interaction.object
);

}

return;

}

if (
interaction.type ===
"tree"
) {

harvestTree(
interaction.object
);

return;

}

if (
interaction.type ===
"resource"
) {

collectResource(
interaction.object
);

return;

}

if (
interaction.type ===
"boss"
) {

if (
!interaction.object.accepted
) {

openBattle(
interaction.object
);

}

else {

performAttack();

}

return;

}

if (
interaction.type ===
"enemy"
) {

performAttack();

}

}

/* =====================================================
CASAS
====================================================== */

function handleZ() {

if (
state.dialogue
) {

advanceDialogue();

return;

}

if (
state.paused
) {

return;

}

if (
state.houseMode
) {

exitHouse();

return;

}

enterNearestHouse();

}

function enterNearestHouse() {

if (
!state.world.buildings.length
) {

showToast(
"Não há construção para entrar aqui."
);

return;

}

let closest =
null;

let best =
Infinity;

for (
const building of
state.world.buildings
) {

const door = {

x:
building.x +
building.w / 2,

y:
building.y +
building.h +
18

};

const d =
distance(
state.player,
door
);

if (
d < 90 &&
d < best
) {

best =
d;

closest =
building;

}

}

if (
!closest
) {

showToast(
"Aproxime-se da porta."
);

return;

}

state.houseReturn = {

x:
closest.x +
closest.w / 2,

y:
closest.y +
closest.h +
58

};

state.currentHouse =
closest;

state.houseMode =
true;

placePlayerInsideHouse();

showToast(
`Você entrou em ${closest.name}.`
);

}

function exitHouse() {

if (
!state.houseMode
) {

return;

}

const returnPoint =
state.houseReturn ||
{

x: 480,

y: 610

};

state.houseMode =
false;

state.currentHouse =
null;

state.player.x =
returnPoint.x;

state.player.y =
returnPoint.y;

state.houseReturn =
null;

state.keys.clear();

showToast(
"Você saiu da construção."
);

}

/* =====================================================
DIÁLOGOS
====================================================== */

function startDialogue(npc) {

state.dialogue = {

npc,

lines:
npc.lines.slice(),

index: 0,

typing: false,

charIndex: 0,

timer: null

};

must("dialogueBox")
.classList.remove(
"hidden"
);

typeDialogue();

}

function typeDialogue() {

const dialogue =
state.dialogue;

if (
!dialogue
) {

return;

}

clearInterval(
dialogue.timer
);

const line =
dialogue.lines[
dialogue.index
];

dialogue.charIndex =
0;

dialogue.typing =
true;

must("dialogueSpeaker").textContent =
dialogue.npc.name;

must("dialogueText").textContent =
"";

dialogue.timer =
setInterval(
() => {

dialogue.charIndex++;

must("dialogueText").textContent =
line.slice(
0,
dialogue.charIndex
);

if (
dialogue.charIndex >=
line.length
) {

clearInterval(
dialogue.timer
);

dialogue.typing =
false;

}

},
16
);

}

function advanceDialogue() {

const dialogue =
state.dialogue;

if (
!dialogue
) {

return;

}

if (
dialogue.typing
) {

clearInterval(
dialogue.timer
);

must("dialogueText").textContent =
dialogue.lines[
dialogue.index
];

dialogue.typing =
false;

return;

}

dialogue.index++;

if (
dialogue.index >=
dialogue.lines.length
) {

closeDialogue();

return;

}

typeDialogue();

}

function closeDialogue() {

if (
state.dialogue?.timer
) {

clearInterval(
state.dialogue.timer
);

}

state.dialogue =
null;

must("dialogueBox")
.classList.add(
"hidden"
);

}

/* =====================================================
MISSÕES
====================================================== */

function openQuest(npc) {

state.questNPC =
npc;

const quest =
state.player.quest[
npc.questId
];

if (
!quest
) {

return;

}

const isWood =
npc.questId ===
"wood";

const item =
isWood
? "madeira"
: "carvao";

const current =
state.player.inventory[item] ||
0;

must("questTitle").textContent =
isWood
? "Madeira para a Vila"
: "Carvão para a Forja";

must("questText").textContent =
isWood
? "Bran precisa de 10 madeiras para reforçar construções da vila."
: "Borin precisa de 8 carvões para manter a forja funcionando.";

must("questStatus").textContent =
`Progresso: ${Math.min(
current,
quest.need
)} / ${quest.need}`;

const button =
must("questActionBtn");

button.disabled =
quest.state ===
"completed";

button.textContent =
quest.state ===
"none"
? "ACEITAR"
: quest.state ===
"accepted"
? "ENTREGAR"
: "CONCLUÍDA";

must("questPanel")
.classList.remove(
"hidden"
);

}

function executeQuestAction() {

const npc =
state.questNPC;

if (
!npc
) {

return;

}

const quest =
state.player.quest[
npc.questId
];

const item =
npc.questId ===
"wood"
? "madeira"
: "carvao";

if (
quest.state ===
"none"
) {

quest.state =
"accepted";

showToast(
"Missão aceita."
);

openQuest(
npc
);

return;

}

if (
quest.state ===
"accepted"
) {

if (
(
state.player.inventory[item] ||
0
) <
quest.need
) {

showToast(
"Você ainda não possui os materiais necessários."
);

openQuest(
npc
);

return;

}

if (
!removeItem(
item,
quest.need
)
) {

return;

}

quest.state =
"completed";

state.player.xp +=
quest.rewardXP;

state.player.money +=
quest.rewardMoney;

checkLevelUp();

saveGame(
false
);

showToast(
"Missão concluída e recompensa recebida."
);

openQuest(
npc
);

}

}

/* =====================================================
BATALHAS DE PROGRESSÃO
====================================================== */

function openBattle(enemy) {

state.battle =
enemy;

state.paused =
true;

must("battleIcon").textContent =
enemy.icon;

must("battleTitle").textContent =
enemy.name;

must("battleText").textContent =
"Esta criatura guarda o caminho. Ela só ficará agressiva se você aceitar o desafio.";

must("battlePanel")
.classList.remove(
"hidden"
);

}

function acceptBattle() {

if (
!state.battle
) {

return;

}

state.battle.accepted =
true;

state.battle.aggressive =
true;

state.battle.state =
"chasing";

state.battle =
null;

state.paused =
false;

must("battlePanel")
.classList.add(
"hidden"
);

showToast(
"A batalha começou."
);

}

function declineBattle() {

state.battle =
null;

state.paused =
false;

must("battlePanel")
.classList.add(
"hidden"
);

}

/* =====================================================
PORTAIS
====================================================== */

function checkPortals() {

if (
!state.player ||
state.paused ||
state.houseMode ||
state.portalCooldown > 0
) {

return;

}

for (
const portal of
state.world.portals
) {

const inside =

state.player.x >=
portal.x &&

state.player.x <=
portal.x +
portal.w &&

state.player.y >=
portal.y &&

state.player.y <=
portal.y +
portal.h;

if (
!inside
) {

continue;

}

const unlocked =

typeof portal.requirement ===
"function"

? portal.requirement()

: true;

if (
!unlocked
) {

showToast(
"Este caminho ainda está bloqueado."
);

state.player.x =
Math.max(
85,
portal.x -
55
);

state.portalCooldown =
1.2;

return;

}

openTravel(
portal
);

return;

}

}

function openTravel(portal) {

if (
state.travel
) {

return;

}

state.travel =
portal;

state.paused =
true;

must("travelText").textContent =
`Você encontrou um caminho para ${portal.title}. Deseja continuar?`;

must("travelPanel")
.classList.remove(
"hidden"
);

}

function confirmTravel() {

if (
!state.travel
) {

return;

}

const target =
state.travel.target;

state.travel =
null;

must("travelPanel")
.classList.add(
"hidden"
);

transitionTo(
target
);

}

function cancelTravel() {

state.travel =
null;

state.paused =
false;

state.portalCooldown =
1.2;

must("travelPanel")
.classList.add(
"hidden"
);

}

function transitionTo(target) {

if (
!REGIONS[target]
) {

return;

}

state.paused =
true;

must("transitionMessage").textContent =
REGIONS[target].name;

must("transitionScreen")
.classList.remove(
"hidden"
);

setTimeout(
() => {

state.area =
target;

state.houseMode =
false;

state.currentHouse =
null;

state.houseReturn =
null;

state.finalChoiceShown =
false;

buildWorld();

state.player.x =
145;

state.player.y =
state.world.height /
2;

state.player.checkpoint = {

area: target,

x:
state.player.x,

y:
state.player.y

};

state.player.magic =
state.player.maxMagic;

state.player.energy =
state.player.maxEnergy;

if (
!state.player.unlockedAreas.includes(
target
)
) {

state.player.unlockedAreas.push(
target
);

}

state.portalCooldown =
1.4;

state.paused =
false;

must("transitionScreen")
.classList.add(
"hidden"
);

saveGame(
false
);

showToast(
`Você chegou a ${REGIONS[target].name}.`
);

},
650
);

}

/* =====================================================
INVENTÁRIO
====================================================== */

function updateInventory() {

const grid =
must("inventoryGrid");

grid.innerHTML =
"";

Object.entries(
state.player.inventory
)
.forEach(
(
[
id,
amount
]
) => {

if (
amount <= 0
) {

return;

}

const item =
ITEMS[id];

if (
!item
) {

return;

}

if (
state.inventoryCategory !==
"all" &&
item.category !==
state.inventoryCategory
) {

return;

}

const slot =
document.createElement(
"button"
);

slot.type =
"button";

slot.className =
"inventory-item";

slot.innerHTML = `

<span class="icon">
${item.icon}
</span>

<span class="name">
${item.name}
</span>

<span class="count">
x${amount}
</span>

`;

slot.addEventListener(
"click",
() =>
useItem(
id
)
);

grid.appendChild(
slot
);

}
);

if (
!grid.children.length
) {

const empty =
document.createElement(
"div"
);

empty.className =
"muted";

empty.style.gridColumn =
"1 / -1";

empty.style.textAlign =
"center";

empty.style.padding =
"25px";

empty.textContent =
"Nenhum item nesta categoria.";

grid.appendChild(
empty
);

}

let weight =
0;

Object.entries(
state.player.inventory
)
.forEach(
(
[
id,
amount
]
) => {

weight +=

(
ITEMS[id]?.weight ||
0
) *
amount;

}
);

must("weightText").textContent =
`${weight}/100`;

updateEquipment();

}

function useItem(id) {

const item =
ITEMS[id];

if (
!item
) {

return;

}

if (
item.heal
) {

if (
!removeItem(
id,
1
)
) {

return;

}

state.player.hp =
Math.min(
state.player.maxHp,
state.player.hp +
item.heal
);

showToast(
"Poção de cura usada."
);

}

else if (
item.energy
) {

if (
!removeItem(
id,
1
)
) {

return;

}

state.player.energy =
Math.min(
state.player.maxEnergy,
state.player.energy +
item.energy
);

showToast(
"Elixir de energia usado."
);

}

else if (
item.damage
) {

state.player.equipment.weapon =
id;

showToast(
`${item.name} equipada.`
);

}

else if (
item.defense
) {

state.player.equipment.armor =
id;

showToast(
`${item.name} equipada.`
);

}

updateInventory();

updateHUD();

}

function updateEquipment() {

const grid =
must("equipmentGrid");

const weapon =
ITEMS[
state.player.equipment.weapon
]?.name ||
"Nenhuma";

const armor =
ITEMS[
state.player.equipment.armor
]?.name ||
"Nenhuma";

const tool =
ITEMS[
state.player.equipment.tool
]?.name ||
"Nenhuma";

grid.innerHTML = `

<div class="equipment-slot">

Arma

<strong>
${weapon}
</strong>

${
state.player.equipment.weapon
? `

<button
type="button"
data-unequip="weapon"
>
Desequipar
</button>

`
: ""
}

</div>

<div class="equipment-slot">

Armadura

<strong>
${armor}
</strong>

${
state.player.equipment.armor
? `

<button
type="button"
data-unequip="armor"
>
Desequipar
</button>

`
: ""
}

</div>

<div class="equipment-slot">

Ferramenta

<strong>
${tool}
</strong>

</div>

`;

grid
.querySelectorAll(
"[data-unequip]"
)
.forEach(
button => {

button.addEventListener(
"click",
() => {

state.player.equipment[
button.dataset.unequip
] =
null;

updateInventory();

}
);

}
);

}

/* =====================================================
MAPA
====================================================== */

function drawLargeMap() {

const width =
mapCanvas.width;

const height =
mapCanvas.height;

mapCtx.clearRect(
0,
0,
width,
height
);

mapCtx.fillStyle =
"#18231a";

mapCtx.fillRect(
0,
0,
width,
height
);

const sx =
width /
state.world.width;

const sy =
height /
state.world.height;

mapCtx.fillStyle =
"#87664b";

state.world.buildings.forEach(
building => {

mapCtx.fillRect(
building.x * sx,
building.y * sy,
building.w * sx,
building.h * sy
);

}
);

mapCtx.fillStyle =
"#e0bf70";

state.world.npcs.forEach(
npc => {

mapCtx.fillRect(
npc.x * sx - 3,
npc.y * sy - 3,
6,
6
);

}
);

state.world.enemies.forEach(
enemy => {

if (
enemy.dead
) {

return;

}

mapCtx.fillStyle =

enemy.type ===
"progression" ||

enemy.type ===
"final"

? "#ef554d"
: "#d38764";

mapCtx.beginPath();

mapCtx.arc(
enemy.x * sx,
enemy.y * sy,

enemy.type ===
"progression" ||
enemy.type ===
"final"

? 7
: 4,

0,
Math.PI * 2
);

mapCtx.fill();

}
);

mapCtx.fillStyle =
"#65a9df";

state.world.portals.forEach(
portal => {

mapCtx.fillRect(
portal.x * sx,
portal.y * sy,
Math.max(
4,
portal.w * sx
),
Math.max(
4,
portal.h * sy
)
);

}
);

mapCtx.fillStyle =
"#ffffff";

mapCtx.beginPath();

mapCtx.arc(
state.player.x * sx,
state.player.y * sy,
7,
0,
Math.PI * 2
);

mapCtx.fill();

}

function drawMinimap() {

if (
!state.player
) {

return;

}

miniCtx.clearRect(
0,
0,
miniCanvas.width,
miniCanvas.height
);

miniCtx.fillStyle =
"#19241b";

miniCtx.fillRect(
0,
0,
miniCanvas.width,
miniCanvas.height
);

const sx =
miniCanvas.width /
state.world.width;

const sy =
miniCanvas.height /
state.world.height;

miniCtx.fillStyle =
"#82654c";

state.world.buildings.forEach(
building => {

miniCtx.fillRect(
building.x * sx,
building.y * sy,
building.w * sx,
building.h * sy
);

}
);

miniCtx.fillStyle =
"#e0bf70";

state.world.npcs.forEach(
npc => {

miniCtx.fillRect(
npc.x * sx - 2,
npc.y * sy - 2,
4,
4
);

}
);

state.world.enemies.forEach(
enemy => {

if (
enemy.dead
) {

return;

}

miniCtx.fillStyle =

enemy.type ===
"progression" ||

enemy.type ===
"final"

? "#ef554d"
: "#d38764";

miniCtx.beginPath();

miniCtx.arc(
enemy.x * sx,
enemy.y * sy,

enemy.type ===
"progression" ||
enemy.type ===
"final"

? 4
: 2.5,

0,
Math.PI * 2
);

miniCtx.fill();

}
);

miniCtx.fillStyle =
"#65a9df";

state.world.portals.forEach(
portal => {

miniCtx.fillRect(
portal.x * sx,
portal.y * sy,
Math.max(
2,
portal.w * sx
),
Math.max(
2,
portal.h * sy
)
);

}
);

miniCtx.fillStyle =
"#ffffff";

miniCtx.beginPath();

miniCtx.arc(
state.player.x * sx,
state.player.y * sy,
4,
0,
Math.PI * 2
);

miniCtx.fill();

}

/* =====================================================
LIVRO
====================================================== */

const BOSS_REGISTRY = [

[
"forest_guardian",
"GUARDIÃO DA ESTRADA",
"👺"
],

[
"grove_guardian",
"GUARDIÃO DA FLORESTA",
"🌳"
],

[
"mountain_guardian",
"GUARDIÃO DO BOSQUE",
"🌲"
],

[
"iron_guardian",
"SENTINELA DAS MONTANHAS",
"🗿"
],

[
"ruby_guardian",
"GUARDIÃO DE FERRO",
"⚙️"
],

[
"shadow_guardian",
"GUARDIÃO RUBI",
"🔴"
],

[
"fairy_guardian",
"GUARDIÃO SOMBRIO",
"🌑"
],

[
"sky_guardian",
"GUARDIÃ DOS FIOS",
"🧚"
],

[
"hell_guardian",
"SERAFIM DA QUIETUDE",
"☀️"
],

[
"final_gate_guardian",
"SENHOR DA QUIETUDE",
"👿"
],

[
"other_self",
"O OUTRO EU",
"☯"
]

];

function renderBook() {

const book =
must("bossBook");

book.innerHTML =
"";

BOSS_REGISTRY.forEach(
(
[
id,
name,
icon
]
) => {

const defeated =

state.player.defeatedBosses.includes(
id
) ||

(
id ===
"other_self" &&
state.player.finalDefeated
);

const discovered =

defeated ||

state.player.discoveredBosses.includes(
id
);

const entry =
document.createElement(
"div"
);

entry.className =
"boss-entry";

entry.innerHTML =

discovered

? `

<div class="symbol">
${icon}
</div>

<strong>
${name}
</strong>

<p>
${
defeated
? "Derrotado."
: "Registro descoberto."
}
</p>

<p>
“Uma memória registrada
não desaparece tão facilmente.”
</p>

`

: `

<div class="symbol">
?
</div>

<strong>
DESCONHECIDO
</strong>

<p>
Explore Veyra para descobrir
este registro.
</p>

`;

book.appendChild(
entry
);

}
);

}

/* =====================================================
LOJA
====================================================== */

function openShop(npc) {

state.shopNPC =
npc;

state.shopMode =
"buy";

document
.querySelectorAll(
"#shopTabs .tab"
)
.forEach(
tab => {

tab.classList.toggle(
"active",
tab.dataset.shop ===
"buy"
);

}
);

must("shopTitle").textContent =
`LOJA DE ${npc.name}`;

renderShop();

must("shopPanel")
.classList.remove(
"hidden"
);

}

function renderShop() {

const grid =
must("shopGrid");

grid.innerHTML =
"";

if (
state.shopMode ===
"buy"
) {

[
"pocao",
"elixir",
"espadaFerro",
"armaduraCouro"
]
.forEach(
id => {

const item =
ITEMS[id];

const row =
createShopRow(
item,
`Comprar por ${item.value}`,
() => {

if (
state.player.money <
item.value
) {

showToast(
"Dinheiro insuficiente."
);

return;

}

state.player.money -=
item.value;

addItem(
id,
1
);

showToast(
`${item.name} comprado.`
);

renderShop();

updateHUD();

}
);

grid.appendChild(
row
);

}
);

return;

}

Object.entries(
state.player.inventory
)
.forEach(
(
[
id,
amount
]
) => {

if (
amount <= 0 ||
!ITEMS[id]
) {

return;

}

const item =
ITEMS[id];

const price =
Math.max(
1,
Math.floor(
item.value *
.7
)
);

const row =
createShopRow(
item,
`Vender por ${price} • x${amount}`,
() => {

if (
!removeItem(
id,
1
)
) {

return;

}

state.player.money +=
price;

showToast(
`${item.name} vendido.`
);

renderShop();

updateHUD();

}
);

grid.appendChild(
row
);

}
);

if (
!grid.children.length
) {

const empty =
document.createElement(
"p"
);

empty.className =
"muted";

empty.textContent =
"Você não possui itens para vender.";

grid.appendChild(
empty
);

}

}

function createShopRow(
item,
actionText,
onClick
) {

const row =
document.createElement(
"div"
);

row.className =
"shop-row";

row.innerHTML = `

<div class="shop-icon">
${item.icon}
</div>

<div class="shop-info">

<strong>
${item.name}
</strong>

<small>
Peso ${item.weight}
•
Valor base ${item.value}
</small>

</div>

<div class="shop-price">
${actionText}
</div>

<button
class="primary-btn"
type="button"
>
OK
</button>

`;

row
.querySelector(
"button"
)
.addEventListener(
"click",
onClick
);

return row;

}

/* =====================================================
FINAL
====================================================== */

function openFinalChoice() {

state.finalChoiceShown =
true;

state.paused =
true;

const choice =
window.confirm(

"Uma figura idêntica a você oferece uma escolha: aceitar a Quietude Absoluta.\n\nOK = aceitar.\nCancelar = lutar."

);

state.player.finalChoice =
choice
? "join"
: "fight";

state.paused =
false;

if (
choice
) {

showEnding(
"Você escolheu a Quietude Absoluta. Veyra finalmente ficou em silêncio."
);

return;

}

const boss =
state.world.enemies.find(
enemy =>
enemy.id ===
"other_self"
);

if (
boss
) {

boss.accepted =
true;

boss.aggressive =
true;

boss.state =
"chasing";

}

showToast(
"A batalha final começou."
);

}

function showEnding(message) {

state.running =
false;

state.paused =
true;

saveGame(
false
);

must("transitionMessage").textContent =
message;

must("transitionScreen")
.classList.remove(
"hidden"
);

setTimeout(
() => {

must("transitionScreen")
.classList.add(
"hidden"
);

showScreen(
"menu"
);

updateContinueButton();

},
2600
);

}

/* =====================================================
PARTÍCULAS
====================================================== */

function updateVisualEffects(dt) {

state.world.particles =
state.world.particles.filter(
particle => {

particle.x +=
particle.vx *
dt;

particle.y +=
particle.vy *
dt;

particle.vy +=
35 *
dt;

particle.life -=
dt;

return (
particle.life >
0
);

}
);

state.world.effects =
state.world.effects.filter(
effect => {

if (
effect.type ===
"dangerOrb"
) {

effect.life -=
dt;

return (
effect.life >
0
);

}

return true;

}
);

}

function spawnParticles(
x,
y,
color,
amount
) {

for (
let i = 0;
i < amount;
i++
) {

const angle =
random(
0,
Math.PI * 2
);

const speed =
random(
25,
90
);

state.world.particles.push({

x,

y,

vx:
Math.cos(
angle
) *
speed,

vy:
Math.sin(
angle
) *
speed,

life:
random(
.35,
.8
),

color

});

}

}

/* =====================================================
CÂMERA
====================================================== */

function updateCamera() {

if (
!state.player
) {

return;

}

const viewW =
window.innerWidth;

const viewH =
window.innerHeight;

if (
state.houseMode
) {

const room =
getHouseRoom();

state.camera.x =
clamp(

room.x +
room.w / 2 -
viewW / 2,

0,

Math.max(
0,
state.world.width -
viewW
)

);

state.camera.y =
clamp(

room.y +
room.h / 2 -
viewH / 2,

0,

Math.max(
0,
state.world.height -
viewH
)

);

return;

}

state.camera.x =
clamp(

state.player.x -
viewW / 2,

0,

Math.max(
0,
state.world.width -
viewW
)

);

state.camera.y =
clamp(

state.player.y -
viewH / 2,

0,

Math.max(
0,
state.world.height -
viewH
)

);

}

/* =====================================================
HUD
====================================================== */

function updateHUD() {

const player =
state.player;

if (
!player
) {

return;

}

must("hudAvatar").textContent =
player.icon;

must("hudClass").textContent =
player.className;

must("hudName").textContent =
player.name;

must("moneyText").textContent =
player.money;

must("levelText").textContent =
player.level;

must("xpText").textContent =
`${player.xp} / ${player.xpToNext}`;

must("hpText").textContent =
`${Math.ceil(player.hp)}/${player.maxHp}`;

must("magicText").textContent =
`${Math.ceil(player.magic)}/${Math.ceil(player.maxMagic)}`;

must("energyText").textContent =
`${Math.ceil(player.energy)}/${player.maxEnergy}`;

must("hungerText").textContent =
Math.ceil(
player.hunger
);

must("fatigueText").textContent =
Math.ceil(
player.fatigue
);

setBar(
"hpBar",
player.hp,
player.maxHp
);

setBar(
"magicBar",
player.magic,
player.maxMagic
);

setBar(
"energyBar",
player.energy,
player.maxEnergy
);

updateInteractionHint();

}

function setBar(
id,
value,
max
) {

const percentage =

max > 0

? clamp(
(
value /
max
) *
100,
0,
100
)

: 0;

must(id).style.width =
`${percentage}%`;

}

function updateInteractionHint() {

const hint =
must("interactionHint");

if (
!state.player ||
state.paused ||
state.dialogue ||
state.travel ||
state.battle
) {

hint.classList.add(
"hidden"
);

return;

}

const interaction =
getInteraction();

if (
!interaction
) {

hint.classList.add(
"hidden"
);

return;

}

hint.classList.remove(
"hidden"
);

if (
interaction.type ===
"house"
) {

must("interactionKey").textContent =
"Z";

must("interactionText").textContent =
"Entrar";

return;

}

if (
interaction.type ===
"exitHouse"
) {

must("interactionKey").textContent =
"Z";

must("interactionText").textContent =
"Sair";

return;

}

must("interactionKey").textContent =
"E";

const labels = {

npc:

interaction.object.merchant

? "Abrir loja"

: interaction.object.questId

? "Ver missão"

: "Conversar",

tree:
"Cortar árvore",

resource:
`Coletar ${
ITEMS[
interaction.object.type
]?.name ||
"recurso"
}`,

boss:

interaction.object.accepted

? "Atacar"

: "Aceitar batalha",

enemy:
"Atacar"

};

must("interactionText").textContent =
labels[
interaction.type
] ||
"Interagir";

}

/* =====================================================
UPDATE
====================================================== */

function update(dt) {

if (
!state.player
) {

return;

}

state.portalCooldown =
Math.max(
0,
state.portalCooldown -
dt
);

state.player.invincible =
Math.max(
0,
state.player.invincible -
dt
);

state.player.attackCooldown =
Math.max(
0,
state.player.attackCooldown -
dt
);

updateMovement(
dt
);

updateSurvival(
dt
);

updateEnemies(
dt
);

updateResources(
dt
);

updateVisualEffects(
dt
);

checkPortals();

updateCamera();

updateHUD();

if (
!must("mapPanel")
.classList.contains(
"hidden"
)
) {

drawLargeMap();

}

}

function gameLoop(timestamp) {

if (
!state.running
) {

return;

}

const dt =
Math.min(

(
timestamp -
state.lastTime
) /
1000,

.05

);

state.lastTime =
timestamp;

state.time +=
dt;

update(
dt
);

draw();

requestAnimationFrame(
gameLoop
);

}

/* =====================================================
DESENHO
====================================================== */

function draw() {

ctx.clearRect(
0,
0,
window.innerWidth,
window.innerHeight
);

ctx.save();

ctx.translate(
-state.camera.x,
-state.camera.y
);

if (
state.houseMode
) {

drawHouseInterior();

drawPlayer();

drawParticles();

}

else {

drawGround();

drawPaths();

drawAmbientDetails();

drawBuildings();

drawTrees();

drawResources();

drawObstacles();

drawPortals();

drawDrops();

drawEffects();

drawNPCs();

drawEnemies();

drawPlayer();

drawWorldLabels();

drawParticles();

}

ctx.restore();

drawMinimap();

}

function drawGround() {

const visual =
REGIONS[
state.area
].visual;

const colors = {

village: "#536b4b",

forest: "#3e6141",

grove: "#34583a",

mountains: "#92999b",

iron: "#292e31",

ruby: "#48252b",

shadow: "#171d2e",

fairy: "#56436b",

sky: "#92b0c7",

hell: "#45201f",

final: "#18171b"

};

ctx.fillStyle =
colors[
visual
] ||
"#536b4b";

ctx.fillRect(
0,
0,
state.world.width,
state.world.height
);

const tile =
64;

for (
let y = 70;
y < state.world.height - 70;
y += tile
) {

for (
let x = 70;
x < state.world.width - 70;
x += tile
) {

ctx.fillStyle =

(
(
x / tile +
y / tile
) %
2 === 0
)

? "rgba(255,255,255,.014)"

: "rgba(0,0,0,.018)";

ctx.fillRect(
x,
y,
tile,
tile
);

}

}

if (
state.area ===
"village"
) {

ctx.fillStyle =
"rgba(18,22,18,.24)";

ctx.beginPath();

ctx.ellipse(
2700,
1080,
420,
340,
-.1,
0,
Math.PI * 2
);

ctx.fill();

}

}

function drawPaths() {

if (
state.area !==
"village"
) {

return;

}

ctx.fillStyle =
"#b79a68";

ctx.globalAlpha =
.7;

ctx.fillRect(
70,
1080,
state.world.width - 140,
120
);

ctx.fillRect(
1540,
70,
120,
state.world.height - 140
);

ctx.fillRect(
1700,
1110,
1000,
70
);

ctx.fillRect(
600,
1110,
100,
600
);

ctx.globalAlpha =
1;

}

function drawAmbientDetails() {

const visual =
REGIONS[
state.area
].visual;

if (
[
"village",
"forest",
"grove"
].includes(
visual
)
) {

ctx.strokeStyle =
"rgba(30,75,38,.42)";

ctx.lineWidth =
2;

for (
let y = 100;
y < state.world.height - 100;
y += 75
) {

for (
let x = 100;
x < state.world.width - 100;
x += 75
) {

if (
(
x * 7 +
y * 3
) %
13 <
5
) {

ctx.beginPath();

ctx.moveTo(
x,
y + 5
);

ctx.lineTo(
x - 4,
y - 4
);

ctx.moveTo(
x,
y + 5
);

ctx.lineTo(
x + 5,
y - 5
);

ctx.stroke();

}

}

}

}

if (
visual ===
"hell"
) {

ctx.fillStyle =
"rgba(225,70,30,.18)";

for (
let i = 0;
i < 24;
i++
) {

const x =
(
i * 421
) %
state.world.width;

const y =
(
i * 257
) %
state.world.height;

ctx.beginPath();

ctx.arc(
x,
y,
8 +
(
i % 5
),
0,
Math.PI * 2
);

ctx.fill();

}

}

}

/* =====================================================
CONSTRUÇÕES
====================================================== */

function drawBuildings() {

state.world.buildings.forEach(
building => {

ctx.fillStyle =
"rgba(0,0,0,.27)";

ctx.fillRect(
building.x + 13,
building.y + 16,
building.w,
building.h
);

ctx.fillStyle =
building.color;

ctx.fillRect(
building.x,
building.y,
building.w,
building.h
);

ctx.strokeStyle =
"rgba(30,25,20,.45)";

ctx.lineWidth =
4;

ctx.strokeRect(
building.x + 3,
building.y + 3,
building.w - 6,
building.h - 6
);

ctx.fillStyle =
building.roof;

ctx.beginPath();

ctx.moveTo(
building.x - 24,
building.y
);

ctx.lineTo(
building.x +
building.w / 2,
building.y -
95
);

ctx.lineTo(
building.x +
building.w +
24,
building.y
);

ctx.closePath();

ctx.fill();

ctx.fillStyle =
"#452d25";

ctx.fillRect(
building.x +
building.w / 2 -
25,
building.y +
building.h -
70,
50,
70
);

ctx.fillStyle =
"#dbc77d";

ctx.fillRect(
building.x + 35,
building.y + 60,
50,
42
);

ctx.fillRect(
building.x +
building.w -
85,
building.y + 60,
50,
42
);

ctx.font =
"bold 12px Georgia";

ctx.textAlign =
"center";

ctx.fillStyle =
"#f1e0ba";

ctx.fillText(
building.name,
building.x +
building.w / 2,
building.y +
building.h +
27
);

}
);

}

/* =====================================================
INTERIORES
====================================================== */

function drawHouseInterior() {

const building =
state.currentHouse;

const room =
getHouseRoom();

const theme =
getHouseTheme();

const id =
building?.id ||
"home";

ctx.fillStyle =
"#141210";

ctx.fillRect(
0,
0,
state.world.width,
state.world.height
);

ctx.fillStyle =
theme.wall;

ctx.fillRect(
room.x - 24,
room.y - 24,
room.w + 48,
room.h + 48
);

ctx.fillStyle =
theme.floor;

ctx.fillRect(
room.x,
room.y,
room.w,
room.h
);

ctx.strokeStyle =
"rgba(45,28,20,.22)";

ctx.lineWidth =
1;

for (
let y =
room.y + 28;
y <
room.y + room.h;
y += 28
) {

ctx.beginPath();

ctx.moveTo(
room.x,
y
);

ctx.lineTo(
room.x + room.w,
y
);

ctx.stroke();

}

ctx.strokeStyle =
theme.trim;

ctx.lineWidth =
6;

ctx.strokeRect(
room.x,
room.y,
room.w,
room.h
);

/* CASA DO JOGADOR */

if (
id ===
"home"
) {

ctx.fillStyle =
"#4b3026";

ctx.fillRect(
room.x + 48,
room.y + 55,
150,
92
);

ctx.fillStyle =
"#d9c8a4";

ctx.fillRect(
room.x + 58,
room.y + 64,
130,
70
);

ctx.fillStyle =
"#783d36";

ctx.fillRect(
room.x +
room.w / 2 -
100,
room.y +
room.h / 2 -
55,
200,
110
);

ctx.fillStyle =
"#563824";

ctx.fillRect(
room.x +
room.w / 2 -
65,
room.y +
room.h / 2 -
24,
130,
48
);

ctx.fillStyle =
"#44322d";

ctx.fillRect(
room.x +
room.w -
140,
room.y + 45,
88,
105
);

ctx.fillStyle =
"#f48a42";

ctx.beginPath();

ctx.arc(
room.x +
room.w -
96,
room.y +
112,
20,
0,
Math.PI * 2
);

ctx.fill();

}

/* CASA DE ELIAN */

else if (
id ===
"elianHome"
) {

ctx.fillStyle =
"#49372f";

ctx.fillRect(
room.x + 45,
room.y + 55,
130,
82
);

ctx.fillStyle =
"#b9aa91";

ctx.fillRect(
room.x + 55,
room.y + 65,
110,
62
);

ctx.fillStyle =
"#4c3326";

ctx.fillRect(
room.x +
room.w -
160,
room.y + 45,
112,
155
);

ctx.fillStyle =
"#c0a36b";

for (
let i = 0;
i < 4;
i++
) {

ctx.fillRect(
room.x +
room.w -
150,
room.y +
64 +
i * 34,
92,
5
);

}

ctx.fillStyle =
"#5a402d";

ctx.fillRect(
room.x +
room.w / 2 -
85,
room.y +
room.h / 2 -
35,
170,
70
);

ctx.fillStyle =
"#eadcae";

ctx.fillRect(
room.x +
room.w / 2 -
34,
room.y +
room.h / 2 -
18,
68,
34
);

}

/* FORJA */

else if (
id ===
"forge"
) {

ctx.fillStyle =
"#2f2f31";

ctx.fillRect(
room.x + 48,
room.y + 50,
150,
145
);

ctx.fillStyle =
"#ff7846";

ctx.beginPath();

ctx.arc(
room.x + 123,
room.y + 135,
38,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
"#ffd06a";

ctx.beginPath();

ctx.arc(
room.x + 123,
room.y + 135,
19,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
"#24282c";

ctx.fillRect(
room.x +
room.w / 2 -
55,
room.y +
room.h / 2 -
16,
110,
32
);

ctx.fillRect(
room.x +
room.w / 2 -
18,
room.y +
room.h / 2 +
16,
36,
58
);

}

/* LOJA */

else if (
id ===
"shop"
) {

ctx.fillStyle =
"#4c3225";

ctx.fillRect(
room.x + 42,
room.y + 42,
150,
155
);

ctx.fillRect(
room.x +
room.w -
192,
room.y + 42,
150,
155
);

ctx.fillStyle =
"#caa463";

for (
let i = 0;
i < 4;
i++
) {

ctx.fillRect(
room.x + 52,
room.y +
62 +
i * 34,
130,
5
);

ctx.fillRect(
room.x +
room.w -
182,
room.y +
62 +
i * 34,
130,
5
);

}

ctx.fillStyle =
"#5f3d29";

ctx.fillRect(
room.x +
room.w * .47,
room.y +
room.h * .48,
room.w * .45,
62
);

ctx.strokeStyle =
theme.accent;

ctx.lineWidth =
3;

ctx.strokeRect(
room.x +
room.w * .47,
room.y +
room.h * .48,
room.w * .45,
62
);

ctx.font =
"20px Arial";

ctx.textAlign =
"center";

[
"🧪",
"💙",
"⚔️",
"🥋"
].forEach(
(
icon,
index
) => {

ctx.fillText(
icon,
room.x +
75 +
(
index % 2
) *
72,
room.y +
90 +
Math.floor(
index / 2
) *
70
);

}
);

}

/* CARPINTARIA */

else if (
id ===
"woodshop"
) {

for (
let i = 0;
i < 4;
i++
) {

ctx.fillStyle =
i % 2
? "#6d472b"
: "#7c5130";

ctx.fillRect(
room.x + 50,
room.y +
55 +
i * 34,
165,
24
);

}

ctx.fillStyle =
"#5b3c27";

ctx.fillRect(
room.x +
room.w / 2 -
100,
room.y +
room.h / 2 -
35,
200,
70
);

ctx.font =
"30px Arial";

ctx.textAlign =
"center";

ctx.fillText(
"🪓",
room.x +
room.w / 2,
room.y +
room.h / 2 +
14
);

ctx.fillStyle =
"#b07e4d";

for (
let i = 0;
i < 5;
i++
) {

ctx.fillRect(
room.x +
room.w -
185,
room.y +
65 +
i * 28,
135,
16
);

}

}

ctx.fillStyle =
"#3b241c";

ctx.fillRect(
room.x +
room.w / 2 -
34,
room.y +
room.h -
16,
68,
22
);

ctx.fillStyle =
"#ead9b5";

ctx.font =
"bold 19px Georgia";

ctx.textAlign =
"center";

ctx.fillText(
building?.name ||
"INTERIOR",
room.x +
room.w / 2,
room.y -
42
);

ctx.font =
"11px Arial";

ctx.fillText(
"[Z] SAIR",
room.x +
room.w / 2,
room.y +
room.h +
35
);

drawInteriorNPCs();

}

function drawInteriorNPCs() {

getInteriorNPCs().forEach(
npc => {

ctx.fillStyle =
"rgba(0,0,0,.25)";

ctx.beginPath();

ctx.ellipse(
npc.x,
npc.y + 20,
19,
7,
0,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
npc.color ||
"#c9ae82";

ctx.beginPath();

ctx.arc(
npc.x,
npc.y,
17,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
"#29272a";

ctx.beginPath();

ctx.arc(
npc.x,
npc.y - 8,
9,
0,
Math.PI * 2
);

ctx.fill();

ctx.textAlign =
"center";

ctx.font =
"bold 12px Arial";

ctx.fillStyle =
"#f5e5be";

ctx.fillText(
npc.name,
npc.x,
npc.y - 31
);

ctx.font =
"10px Arial";

ctx.fillStyle =
"#d1c5af";

ctx.fillText(
npc.role,
npc.x,
npc.y + 37
);

}
);

}

/* =====================================================
ÁRVORES
====================================================== */

function drawTrees() {

state.world.trees.forEach(
tree => {

if (
!tree.alive
) {

return;

}

const sway =
Math.sin(
state.time *
1.7 +
tree.x
) *
2;

ctx.fillStyle =
"rgba(0,0,0,.22)";

ctx.beginPath();

ctx.ellipse(
tree.x,
tree.y + 28,
34,
11,
0,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
"#684a30";

ctx.fillRect(
tree.x - 9,
tree.y,
18,
42
);

ctx.fillStyle =
"#305c36";

ctx.beginPath();

ctx.arc(
tree.x + sway,
tree.y - 14,
34,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
"#447a45";

ctx.beginPath();

ctx.arc(
tree.x - 14 + sway,
tree.y - 27,
24,
0,
Math.PI * 2
);

ctx.arc(
tree.x + 14 + sway,
tree.y - 27,
25,
0,
Math.PI * 2
);

ctx.fill();

if (
distance(
tree,
state.player
) <
85
) {

ctx.strokeStyle =
"#d8bc73";

ctx.lineWidth =
2;

ctx.beginPath();

ctx.arc(
tree.x,
tree.y - 10,
40,
0,
Math.PI * 2
);

ctx.stroke();

}

}
);

}

/* =====================================================
RECURSOS
====================================================== */

function drawResources() {

const icons = {

ferro: "⛓️",

rubi: "♦",

cristal: "💎",

ouro: "🪙",

carvao: "⬛"

};

state.world.resources.forEach(
resource => {

if (
!resource.alive
) {

return;

}

ctx.font =
"20px Arial";

ctx.textAlign =
"center";

ctx.fillText(
icons[
resource.type
] ||
"✦",
resource.x,
resource.y + 7
);

}
);

}

/* =====================================================
OBSTÁCULOS
====================================================== */

function drawObstacles() {

state.world.obstacles.forEach(
obstacle => {

if (
obstacle.type ===
"building" ||
obstacle.type ===
"tree"
) {

return;

}

if (
obstacle.type ===
"wall"
) {

ctx.fillStyle =
"#424a46";

ctx.fillRect(
obstacle.x,
obstacle.y,
obstacle.w,
obstacle.h
);

return;

}

if (
obstacle.type ===
"fountain"
) {

ctx.fillStyle =
"#89877c";

ctx.beginPath();

ctx.ellipse(
obstacle.x +
obstacle.w / 2,
obstacle.y +
obstacle.h / 2,
obstacle.w / 2,
obstacle.h / 2,
0,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
"#5b98aa";

ctx.beginPath();

ctx.ellipse(
obstacle.x +
obstacle.w / 2,
obstacle.y +
obstacle.h / 2,
obstacle.w / 2 -
22,
obstacle.h / 2 -
22,
0,
0,
Math.PI * 2
);

ctx.fill();

return;

}

const colors = {

rock: "#737771",

snowrock: "#bec5c7",

ironrock: "#666c6f",

rubyrock: "#73384b",

darkrock: "#34364e",

basalt: "#443437"

};

ctx.fillStyle =
colors[
obstacle.type
] ||
"#737771";

ctx.beginPath();

ctx.ellipse(
obstacle.x +
obstacle.w / 2,
obstacle.y +
obstacle.h / 2,
obstacle.w / 2,
obstacle.h / 2,
-.12,
0,
Math.PI * 2
);

ctx.fill();

}
);

}

/* =====================================================
NPCs
====================================================== */

function drawNPCs() {

state.world.npcs.forEach(
npc => {

ctx.fillStyle =
"rgba(0,0,0,.23)";

ctx.beginPath();

ctx.ellipse(
npc.x,
npc.y + 19,
18,
7,
0,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
npc.color;

ctx.beginPath();

ctx.arc(
npc.x,
npc.y,
17,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
"#28272b";

ctx.beginPath();

ctx.arc(
npc.x,
npc.y - 8,
9,
0,
Math.PI * 2
);

ctx.fill();

ctx.textAlign =
"center";

ctx.font =
"bold 12px Arial";

ctx.fillStyle =
"#f0dfb8";

ctx.fillText(
npc.name,
npc.x,
npc.y - 30
);

ctx.font =
"10px Arial";

ctx.fillStyle =
"#cac3b0";

ctx.fillText(
npc.role,
npc.x,
npc.y + 36
);

}
);

}

/* =====================================================
INIMIGOS
====================================================== */

function drawEnemies() {

state.world.enemies.forEach(
enemy => {

if (
enemy.dead
) {

return;

}

if (
enemy.aggressive
) {

ctx.strokeStyle =
"rgba(220,60,55,.11)";

ctx.lineWidth =
2;

ctx.beginPath();

ctx.arc(
enemy.x,
enemy.y,
enemy.vision,
0,
Math.PI * 2
);

ctx.stroke();

}

ctx.fillStyle =
"rgba(0,0,0,.3)";

ctx.beginPath();

ctx.ellipse(
enemy.x,
enemy.y +
enemy.radius,
enemy.radius *
1.1,
enemy.radius *
.42,
0,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
enemy.hitFlash > 0
? "#fff"
: enemy.color;

ctx.beginPath();

if (
enemy.type ===
"progression" ||
enemy.type ===
"final"
) {

ctx.moveTo(
enemy.x,
enemy.y -
enemy.radius
);

ctx.lineTo(
enemy.x +
enemy.radius,
enemy.y
);

ctx.lineTo(
enemy.x,
enemy.y +
enemy.radius
);

ctx.lineTo(
enemy.x -
enemy.radius,
enemy.y
);

ctx.closePath();

}

else {

ctx.arc(
enemy.x,
enemy.y,
enemy.radius,
0,
Math.PI * 2
);

}

ctx.fill();

ctx.strokeStyle =

enemy.type ===
"progression" ||

enemy.type ===
"final"

? "#e0ae63"
: "#d0bd78";

ctx.lineWidth =

enemy.type ===
"progression" ||

enemy.type ===
"final"

? 3
: 1.5;

ctx.stroke();

ctx.font =

enemy.type ===
"progression" ||

enemy.type ===
"final"

? "24px Arial"
: "19px Arial";

ctx.textAlign =
"center";

ctx.fillText(
enemy.icon,
enemy.x,
enemy.y + 7
);

ctx.font =
"bold 11px Arial";

ctx.fillStyle =

enemy.type ===
"progression" ||

enemy.type ===
"final"

? "#ffcc8a"
: "#ede2c2";

ctx.fillText(
enemy.name,
enemy.x,
enemy.y +
enemy.radius +
17
);

const barWidth =
enemy.radius *
2.5;

ctx.fillStyle =
"#211f1d";

ctx.fillRect(
enemy.x -
barWidth / 2,
enemy.y -
enemy.radius -
13,
barWidth,
5
);

ctx.fillStyle =
"#b84e48";

ctx.fillRect(
enemy.x -
barWidth / 2,
enemy.y -
enemy.radius -
13,
barWidth *
clamp(
enemy.hp /
enemy.maxHp,
0,
1
),
5
);

}
);

}

/* =====================================================
PORTAIS
====================================================== */

function drawPortals() {

state.world.portals.forEach(
portal => {

const unlocked =

typeof portal.requirement ===
"function"

? portal.requirement()

: true;

ctx.fillStyle =
unlocked
? "rgba(76,150,198,.20)"
: "rgba(80,80,80,.15)";

ctx.fillRect(
portal.x,
portal.y,
portal.w,
portal.h
);

ctx.strokeStyle =
unlocked
? "#8fbcd0"
: "#686963";

ctx.lineWidth =
2;

ctx.strokeRect(
portal.x,
portal.y,
portal.w,
portal.h
);

ctx.textAlign =
"center";

ctx.font =
"bold 12px Georgia";

ctx.fillStyle =
unlocked
? "#e3d19f"
: "#94948b";

ctx.fillText(
unlocked
? "CONTINUAR"
: "BLOQUEADO",
portal.x +
portal.w / 2,
portal.y -
10
);

}
);

}

/* =====================================================
DROPS / EFEITOS
====================================================== */

function drawDrops() {

const icons = {

madeira: "🪵",

carvao: "⬛",

ferro: "⛓️",

ouro: "🪙",

rubi: "♦",

cristal: "💎",

essencia: "✦"

};

state.world.drops.forEach(
drop => {

ctx.font =
"19px Arial";

ctx.textAlign =
"center";

ctx.fillText(
icons[
drop.type
] ||
"✦",
drop.x,
drop.y
);

}
);

}

function drawEffects() {

state.world.effects.forEach(
effect => {

if (
effect.type ===
"flower"
) {

const alpha =
.4 +
(
Math.sin(
state.time *
2 +
effect.phase
) +
1
) *
.16;

ctx.fillStyle =
`rgba(236,187,255,${alpha})`;

ctx.beginPath();

ctx.arc(
effect.x,
effect.y,
4,
0,
Math.PI * 2
);

ctx.fill();

}

else if (
effect.type ===
"dangerOrb"
) {

ctx.fillStyle =
"rgba(220,150,255,.8)";

ctx.beginPath();

ctx.arc(
effect.x,
effect.y,
7,
0,
Math.PI * 2
);

ctx.fill();

}

}
);

}

/* =====================================================
JOGADOR
====================================================== */

function drawPlayer() {

const player =
state.player;

if (
!player
) {

return;

}

if (

player.invincible >
0 &&

Math.floor(
player.invincible *
10
) %
2 === 0

) {

return;

}

ctx.fillStyle =
"rgba(0,0,0,.28)";

ctx.beginPath();

ctx.ellipse(
player.x,
player.y + 20,
21,
8,
0,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
player.color;

ctx.beginPath();

ctx.arc(
player.x,
player.y,
player.radius,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
"#e5c3a2";

ctx.beginPath();

ctx.arc(
player.x,
player.y - 12,
10,
0,
Math.PI * 2
);

ctx.fill();

ctx.fillStyle =
"#2d241f";

ctx.beginPath();

ctx.arc(
player.x,
player.y - 16,
10,
Math.PI,
Math.PI * 2
);

ctx.fill();

ctx.textAlign =
"center";

ctx.font =
"bold 13px Arial";

ctx.fillStyle =
"#fff0c8";

ctx.fillText(
player.name,
player.x,
player.y - 40
);

}

function drawWorldLabels() {

if (
state.area ===
"village"
) {

ctx.textAlign =
"center";

ctx.font =
"bold 22px Georgia";

ctx.fillStyle =
"rgba(255,229,172,.78)";

ctx.fillText(
"PRAÇA DA VILA",
1600,
840
);

ctx.font =
"14px Georgia";

ctx.fillStyle =
"rgba(255,255,255,.58)";

ctx.fillText(
"A Quietude ainda não alcançou este lugar por completo...",
1600,
865
);

ctx.font =
"bold 14px Georgia";

ctx.fillStyle =
"rgba(220,210,190,.55)";

ctx.fillText(
"TERRAS TOCADAS PELO VAZIO",
2700,
1040
);

}

}

function drawParticles() {

state.world.particles.forEach(
particle => {

ctx.globalAlpha =
clamp(
particle.life /
.8,
0,
1
);

ctx.fillStyle =
particle.color;

ctx.fillRect(
particle.x,
particle.y,
4,
4
);

}
);

ctx.globalAlpha =
1;

}

/* =====================================================
SALVAMENTO
====================================================== */

function saveGame(
showMessage = true
) {

if (
!state.player
) {

return;

}

try {

const save = {

version: 14,

area:
state.area,

player:
state.player,

houseMode:
state.houseMode,

currentHouseId:
state.currentHouse?.id ||
null,

houseReturn:
state.houseReturn,

savedAt:
new Date().toISOString()

};

localStorage.setItem(
SAVE_KEY,
JSON.stringify(
save
)
);

if (
showMessage
) {

showToast(
"Jogo salvo com sucesso."
);

}

updateContinueButton();

}

catch (
error
) {

console.error(
"Erro ao salvar:",
error
);

if (
showMessage
) {

showToast(
"Não foi possível salvar o jogo."
);

}

}

}

function loadGame() {

try {

const raw =
localStorage.getItem(
SAVE_KEY
);

if (
!raw
) {

return false;

}

const save =
JSON.parse(
raw
);

if (
!save?.player
) {

return false;

}

const character =
CHARACTERS.find(
item =>
item.id ===
save.player.characterId
);

if (
!character
) {

return false;

}

state.player =
save.player;

state.area =
REGIONS[
save.area
]
? save.area
: "village";

repairLoadedPlayer(
character
);

state.houseMode =
false;

state.currentHouse =
null;

state.houseReturn =
null;

state.dialogue =
null;

state.travel =
null;

state.battle =
null;

state.finalChoiceShown =
Boolean(
state.player.finalChoice
);

buildWorld();

if (

save.houseMode &&

state.area ===
"village" &&

save.currentHouseId

) {

const savedHouse =
state.world.buildings.find(
building =>
building.id ===
save.currentHouseId
);

if (
savedHouse
) {

state.houseMode =
true;

state.currentHouse =
savedHouse;

state.houseReturn =
save.houseReturn ||
{

x:
savedHouse.x +
savedHouse.w / 2,

y:
savedHouse.y +
savedHouse.h +
58

};

placePlayerInsideHouse();

}

}

if (
!state.houseMode
) {

state.player.x =
clamp(
Number(
state.player.x
) ||
480,
90,
state.world.width -
90
);

state.player.y =
clamp(
Number(
state.player.y
) ||
610,
90,
state.world.height -
90
);

}

updateHUD();

showScreen(
"game"
);

state.running =
true;

state.paused =
false;

state.lastTime =
performance.now();

requestAnimationFrame(
gameLoop
);

showToast(
"Jogo carregado."
);

return true;

}

catch (
error
) {

console.error(
"Save inválido:",
error
);

try {

localStorage.removeItem(
SAVE_KEY
);

}

catch {

}

return false;

}

}

function repairLoadedPlayer(character) {

const player =
state.player;

player.inventory =
player.inventory ||
{};

Object.keys(
ITEMS
)
.forEach(
id => {

const value =
Number(
player.inventory[id]
);

player.inventory[id] =

Number.isFinite(
value
) &&
value >= 0

? Math.floor(
value
)

: 0;

}
);

player.equipment =
player.equipment ||
{

weapon: null,

armor: null,

tool: "machado"

};

player.quest =
player.quest ||
{};

player.quest.wood =
player.quest.wood ||
{

state: "none",

need: 10,

rewardXP: 100,

rewardMoney: 80

};

player.quest.coal =
player.quest.coal ||
{

state: "none",

need: 8,

rewardXP: 130,

rewardMoney: 110

};

player.defeatedBosses =

Array.isArray(
player.defeatedBosses
)

? player.defeatedBosses

: [];

player.discoveredBosses =

Array.isArray(
player.discoveredBosses
)

? player.discoveredBosses

: [];

player.unlockedAreas =

Array.isArray(
player.unlockedAreas
)

? player.unlockedAreas

: [
"village"
];

player.collected =
player.collected ||
{};

player.hellTypesDefeated =
player.hellTypesDefeated ||
{};

player.checkpoint =
player.checkpoint ||
{

area: "village",

x: 480,

y: 610

};

player.maxHp =
Math.max(
1,
Number(
player.maxHp
) ||
character.hp
);

player.hp =
clamp(
Number(
player.hp
) ||
player.maxHp,
0,
player.maxHp
);

player.maxMagic =
Math.max(
1,
Number(
player.maxMagic
) ||
character.magic
);

player.magic =
clamp(
Number(
player.magic
) ||
player.maxMagic,
0,
player.maxMagic
);

player.maxEnergy =
Math.max(
1,
Number(
player.maxEnergy
) ||
character.energy
);

player.energy =
clamp(
Number(
player.energy
) ||
player.maxEnergy,
0,
player.maxEnergy
);

player.hunger =
clamp(
Number(
player.hunger
) ||
100,
0,
100
);

player.fatigue =
clamp(
Number(
player.fatigue
) ||
100,
0,
100
);

player.money =
Math.max(
0,
Math.floor(
Number(
player.money
) ||
0
)
);

player.level =
Math.max(
1,
Math.floor(
Number(
player.level
) ||
1
)
);

player.xp =
Math.max(
0,
Math.floor(
Number(
player.xp
) ||
0
)
);

player.xpToNext =
Math.max(
1,
Math.floor(
Number(
player.xpToNext
) ||
100
)
);

player.radius =
18;

player.invincible =
0;

player.attackCooldown =
0;

player.dead =
false;

player.adaptiveBuff =
false;

}

function hasSave() {

try {

return Boolean(
localStorage.getItem(
SAVE_KEY
)
);

}

catch {

return false;

}

}

function updateContinueButton() {

const available =
hasSave();

must("continueBtn").disabled =
!available;

must("continueHint").textContent =
available
? "Existe um jogo salvo neste navegador."
: "Nenhum jogo salvo encontrado.";

}

/* =====================================================
PAINÉIS
====================================================== */

function closeAllPanels() {

document
.querySelectorAll(
".modal"
)
.forEach(
modal =>
modal.classList.add(
"hidden"
)
);

closeDialogue();

state.travel =
null;

state.battle =
null;

state.questNPC =
null;

state.shopNPC =
null;

state.paused =
false;

}

function returnToMenu() {

if (
state.player
) {

saveGame(
false
);

}

state.running =
false;

state.paused =
false;

state.keys.clear();

closeAllPanels();

showScreen(
"menu"
);

updateContinueButton();

}

function togglePanel(
panelId,
onOpen
) {

const panel =
must(
panelId
);

const opening =
panel.classList.contains(
"hidden"
);

closeOverlayPanelsExcept(
panelId
);

if (
opening
) {

if (
onOpen
) {

onOpen();

}

panel.classList.remove(
"hidden"
);

}

else {

panel.classList.add(
"hidden"
);

}

}

function closeOverlayPanelsExcept(
exceptionId = null
) {

[
"inventoryPanel",
"mapPanel",
"bookPanel",
"shopPanel",
"questPanel"
]
.forEach(
id => {

if (
id !==
exceptionId
) {

must(id)
.classList.add(
"hidden"
);

}

}
);

}

/* =====================================================
TECLADO
====================================================== */

function handleKeyDown(event) {

const key =
event.key.toLowerCase();

const movementKeys = [

"w",
"a",
"s",
"d",
"arrowup",
"arrowdown",
"arrowleft",
"arrowright"

];

if (
movementKeys.includes(
key
)
) {

event.preventDefault();

state.keys.add(
key
);

return;

}

if (
event.repeat
) {

return;

}

if (
event.key ===
"Enter" &&
state.dialogue
) {

event.preventDefault();

advanceDialogue();

return;

}

if (
key ===
"e"
) {

event.preventDefault();

playerAction();

return;

}

if (
key ===
"z"
) {

event.preventDefault();

handleZ();

return;

}

if (
key ===
"i" &&
screens.game.classList.contains(
"active"
)
) {

event.preventDefault();

togglePanel(
"inventoryPanel",
updateInventory
);

return;

}

if (
key ===
"m" &&
screens.game.classList.contains(
"active"
)
) {

event.preventDefault();

togglePanel(
"mapPanel",
drawLargeMap
);

return;

}

if (
key ===
"l" &&
screens.game.classList.contains(
"active"
)
) {

event.preventDefault();

togglePanel(
"bookPanel",
renderBook
);

return;

}

if (
key ===
"1" &&
state.player
) {

event.preventDefault();

useItem(
"pocao"
);

return;

}

if (
key ===
"2" &&
state.player
) {

event.preventDefault();

useItem(
"elixir"
);

return;

}

if (
key ===
"escape"
) {

if (
state.dialogue
) {

closeDialogue();

return;

}

if (
state.travel
) {

cancelTravel();

return;

}

if (
state.battle
) {

declineBattle();

return;

}

const openPanel =

[
"inventoryPanel",
"mapPanel",
"bookPanel",
"shopPanel",
"questPanel"
]

.map(
id =>
must(id)
)

.find(
panel =>
!panel.classList.contains(
"hidden"
)
);

if (
openPanel
) {

openPanel.classList.add(
"hidden"
);

return;

}

if (
screens.game.classList.contains(
"active"
)
) {

returnToMenu();

}

}

}

/* =====================================================
BOTÕES
====================================================== */

function bindClick(
id,
handler
) {

must(id).addEventListener(
"click",
handler
);

}

function bindEvents() {

bindClick(
"newGameBtn",
startNewGame
);

bindClick(
"continueBtn",
() => {

if (
!loadGame()
) {

updateContinueButton();

}

}
);

bindClick(
"howToBtn",
() =>
showScreen(
"how"
)
);

bindClick(
"creditsBtn",
() =>
showScreen(
"credits"
)
);

bindClick(
"closeHowBtn",
() =>
showScreen(
"menu"
)
);

bindClick(
"closeCreditsBtn",
() =>
showScreen(
"menu"
)
);

bindClick(
"backMenuBtn",
() =>
showScreen(
"menu"
)
);

bindClick(
"startGameBtn",
startGame
);

bindClick(
"saveBtn",
() =>
saveGame(
true
)
);

bindClick(
"menuBtn",
returnToMenu
);

bindClick(
"inventoryBtn",
() =>
togglePanel(
"inventoryPanel",
updateInventory
)
);

bindClick(
"mapBtn",
() =>
togglePanel(
"mapPanel",
drawLargeMap
)
);

bindClick(
"bookBtn",
() =>
togglePanel(
"bookPanel",
renderBook
)
);

bindClick(
"travelYes",
confirmTravel
);

bindClick(
"travelNo",
cancelTravel
);

bindClick(
"battleAccept",
acceptBattle
);

bindClick(
"battleDecline",
declineBattle
);

bindClick(
"respawnBtn",
respawnPlayer
);

bindClick(
"questActionBtn",
executeQuestAction
);

must("playerName")
.addEventListener(
"keydown",
event => {

if (
event.key ===
"Enter"
) {

startGame();

}

}
);

document
.querySelectorAll(
"[data-close]"
)
.forEach(
button => {

button.addEventListener(
"click",
() => {

const target =
button.dataset.close;

if (
$(target)
) {

$(target)
.classList.add(
"hidden"
);

}

}
);

}
);

document
.querySelectorAll(
"#inventoryTabs .tab"
)
.forEach(
tab => {

tab.addEventListener(
"click",
() => {

document
.querySelectorAll(
"#inventoryTabs .tab"
)
.forEach(
item =>
item.classList.remove(
"active"
)
);

tab.classList.add(
"active"
);

state.inventoryCategory =
tab.dataset.cat;

updateInventory();

}
);

}
);

document
.querySelectorAll(
"#shopTabs .tab"
)
.forEach(
tab => {

tab.addEventListener(
"click",
() => {

document
.querySelectorAll(
"#shopTabs .tab"
)
.forEach(
item =>
item.classList.remove(
"active"
)
);

tab.classList.add(
"active"
);

state.shopMode =
tab.dataset.shop;

renderShop();

}
);

}
);

window.addEventListener(
"keydown",
handleKeyDown
);

window.addEventListener(
"keyup",
event =>
state.keys.delete(
event.key.toLowerCase()
)
);

window.addEventListener(
"blur",
() =>
state.keys.clear()
);

window.addEventListener(
"resize",
resizeCanvas
);

}

/* =====================================================
INICIALIZAÇÃO
====================================================== */

function initialize() {

createCharacterCards();

resizeCanvas();

bindEvents();

updateContinueButton();

}

initialize();

})();
