(() => {
"use strict";
const SAVE_KEY = "veyra_save_v14_stable";
const $ = (id) =>
document.getElementById(id);
const must = (id) => {
const element =
$(id);
if (!element) {
throw new Error(
`Elemento obrigatório não encontrado: #${id}`
);
}
return element;
};
const canvas =
must("gameCanvas");
const ctx =
canvas.getContext("2d");
const miniCanvas =
must("miniCanvas");
const miniCtx =
miniCanvas.getContext("2d");
const mapCanvas =
must("worldMapCanvas");
const mapCtx =
mapCanvas.getContext("2d");
const screens = {
menu:
must("menuScreen"),
how:
must("howScreen"),
credits:
must("creditsScreen"),
character:
must("characterScreen"),
game:
must("gameScreen")
};

const CHARACTERS = [
{
id: "kaelion",
name: "KAELION",
className: "Mago",
icon: "🧙",
role:
"Magia • Longo alcance",
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
color:
"#e49345",
bg:
"rgba(228,147,69,.16)",
glow:
"rgba(228,147,69,.28)",
skill:
"Raio de Memória"
},
{
id: "theron",
name: "THERON",
className:
"Cavaleiro",
icon: "🛡️",
role:
"Espada • Defesa",
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
color:
"#bfc5ce",
bg:
"rgba(191,197,206,.14)",
glow:
"rgba(191,197,206,.23)",
skill:
"Golpe do Guardião"
},
{
id: "grumgar",
name: "GRUMGAR",
className:
"Troll",
icon: "👹",
role:
"Força • Vida",
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
color:
"#718f51",
bg:
"rgba(113,143,81,.16)",
glow:
"rgba(113,143,81,.24)",
skill:
"Esmagamento"
},
{
id: "lirael",
name: "LIRAEL",
className:
"Fada",
icon: "🧚",
role:
"Velocidade • Cura",
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
color:
"#dd8bd0",
bg:
"rgba(221,139,208,.16)",
glow:
"rgba(221,139,208,.25)",
skill:
"Luz Vital"
},
{
id: "zephyr",
name: "ZEPHYR",
className:
"Transmorfo",
icon: "🦊",
role:
"Adaptação • Equilíbrio",
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
color:
"#8f6bd8",
bg:
"rgba(143,107,216,.16)",
glow:
"rgba(143,107,216,.25)",
skill:
"Forma Adaptativa"
}
];

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
name: "Minério de Ferro",
icon: "⛏️",
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

couro: {
name: "Couro",
icon: "🟫",
category: "materials",
weight: 1,
value: 18
},

fragmentoMemoria: {
name: "Fragmento de Memória",
icon: "🔹",
category: "special",
weight: 1,
value: 55
},

flautaMemoria: {
name: "Flauta da Memória",
icon: "🎶",
category: "special",
weight: 1,
value: 0,
unique: true
},

pao: {
name: "Pão Rústico",
icon: "🥖",
category: "food",
weight: 1,
value: 12,
hunger: 34,
heal: 4
},

carneCaca: {
name: "Carne de Caça",
icon: "🍖",
category: "food",
weight: 1,
value: 24,
hunger: 48,
heal: 8
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

const REGIONS = {

village: {
name:
"VILA DO CREPÚSCULO",
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
name:
"CAVERNA DE FERRO",
width: 2900,
height: 1900,
visual: "iron"
},

ruby: {
name:
"CAVERNA DE RUBI",
width: 3100,
height: 2100,
visual: "ruby"
},

shadow: {
name:
"CAVERNA SOMBRIA",
width: 3000,
height: 2000,
visual: "shadow"
},

fairy: {
name:
"REINO DAS FADAS",
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
name:
"CÂMARA FINAL",
width: 2200,
height: 1500,
visual: "final"
}

};

const state = {

selectedCharacter:
CHARACTERS[0],

player:
null,

running:
false,

paused:
false,

time:
0,

lastTime:
0,

keys:
new Set(),

area:
"village",

camera: {
x: 0,
y: 0
},

world:
createEmptyWorld(
REGIONS.village
),

houseMode:
false,

currentHouse:
null,

houseReturn:
null,

dialogue:
null,

travel:
null,

battle:
null,

questNPC:
null,

shopNPC:
null,

shopMode:
"buy",

inventoryCategory:
"all",

toastTimer:
null,

portalCooldown:
0,

warnedNeedAt:
0,

finalChoiceShown:
false,

pointer: {
x: 0,
y: 0,
worldX: 0,
worldY: 0,
down: false
},

holdAction:
null,

hordeNextAt:
0,

screenFadeTimer:
null

};

function createEmptyWorld(region) {

return {

width: region.width,

height: region.height,

obstacles: [],

buildings: [],

trees: [],

resources: [],

foods: [],

secrets: [],

decorations: [],

trials: [],

hazards: [],

npcs: [],

enemies: [],

drops: [],

portals: [],

particles: [],

effects: []

};

}

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

function distance(a, b) {

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
state.player
?.characterId
) ||
CHARACTERS[0]
);

}

function showScreen(name) {

Object
.values(screens)
.forEach(
screen =>
screen.classList
.remove(
"active"
)
);

screens[name]
.classList
.add(
"active"
);

}

function fadeToScreen(
name,
afterSwitch = null
) {

const fade =
must("uiFade");

clearTimeout(
state.screenFadeTimer
);

fade.classList.add(
"active"
);

state.screenFadeTimer =
setTimeout(
() => {

showScreen(
name
);

if (
typeof afterSwitch ===
"function"
) {

afterSwitch();

}

requestAnimationFrame(
() => {

requestAnimationFrame(
() =>
fade.classList.remove(
"active"
)
);

}
);

},
320
);

}

function showToast(message) {

const toast =
must(
"saveMessage"
);

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

function createCharacterCards() {

const container =
must(
"characterCards"
);

container.innerHTML =
"";

const maximums = {

hp: 180,

magic: 145,

energy: 135,

damage: 39,

defense: 21,

speed: 210

};

const labels = {

hp: "Vida",

magic: "Magia",

energy: "Energia",

damage: "Dano",

defense: "Defesa",

speed: "Velocidade"

};

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

const stats =
[
"hp",
"magic",
"energy",
"damage",
"defense",
"speed"
]
.map(
key => {

const percent =
clamp(
(
character[key] /
maximums[key]
) *
100,
8,
100
);

return `

<div class="char-stat">

<span>
${labels[key]}
</span>

<div class="char-stat-track">

<div
class="char-stat-fill"
style="width:${percent}%"
></div>

</div>

<b>
${character[key]}
</b>

</div>

`;

}
)
.join(
""
);

card.innerHTML = `

<div class="char-art">
${character.icon}
</div>

<h3>
${character.name}
</h3>

<p class="char-classline">
${character.className} — ${character.role}
</p>

<p>
${character.description}
</p>

<div class="char-stats">
${stats}
</div>

<p class="char-story">
${character.story}
</p>

<p class="char-skill">
✦ ${character.skill}
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

must(
"playerName"
).value =
"";

must(
"nameError"
).textContent =
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

fadeToScreen(
"character",
() => {

setTimeout(
() =>
must(
"playerName"
).focus(),
80
);

}
);

}

function createPlayer(
name,
character
) {

state.player = {

name,

characterId:
character.id,

className:
character.className,

icon:
character.icon,

color:
character.color,

x:
380,

y:
260,

radius:
18,

hp:
character.hp,

maxHp:
character.hp,

magic:
character.magic,

maxMagic:
character.magic,

energy:
character.energy,

maxEnergy:
character.energy,

speed:
character.speed,

damage:
character.damage,

defense:
character.defense,

level:
1,

xp:
0,

xpToNext:
100,

money:
35,

hunger:
100,

fatigue:
100,

memory:
0,

inventory: {

madeira: 0,

carvao: 0,

ferro: 0,

ouro: 0,

rubi: 0,

cristal: 0,

essencia: 0,

couro: 0,

fragmentoMemoria: 0,

flautaMemoria: 0,

pao: 2,

carneCaca: 0,

pocao: 2,

elixir: 1,

espadaFerro: 0,

armaduraCouro: 0,

machado: 1

},

equipment: {

weapon:
null,

armor:
null,

tool:
"machado"

},

quest: {

wood: {

state:
"none",

need:
10,

rewardXP:
100,

rewardMoney:
80

},

coal: {

state:
"none",

need:
8,

rewardXP:
130,

rewardMoney:
110

}

},

defeatedBosses:
[],

discoveredBosses:
[],

unlockedAreas:
[
"village"
],

collected:
{},

hellTypesDefeated:
{},

secretsFound:
[],

skyTrial: {

started:
false,

wave:
0,

activeWave:
0,

complete:
false

},

flutePlayed:
false,

checkpoint: {

area:
"village",

x:
480,

y:
610

},

skillCooldowns: {

q: 0,

r: 0,

f: 0

},

damageReduction:
0,

shieldTimer:
0,

stunTimer:
0,

dead:
false,

invincible:
0,

attackCooldown:
0,

adaptiveBuff:
false,

finalChoice:
null,

finalDefeated:
false

};

}

function startGame() {

const input =
must(
"playerName"
);

const name =
input.value
.trim();

if (
name.length <
2
) {

must(
"nameError"
).textContent =
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
state.world
.buildings
.find(
building =>
building.id ===
"home"
);

if (
home
) {

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

must(
"transitionMessage"
).textContent =
"VEYRA";

must(
"transitionScreen"
).classList
.remove(
"hidden"
);

setTimeout(
() => {

must(
"transitionScreen"
).classList
.add(
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

function resetWorld() {

state.world =
createEmptyWorld(
REGIONS[
state.area
]
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

state.world
.obstacles
.push({

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

state.world
.buildings
.push(
building
);

addObstacle(
x - 24,
y - 95,
w + 48,
h + 95,
"building",
{

buildingId:
id

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

alive:
true,

amount:
randomInt(
2,
5
),

respawn:
0

};

state.world
.trees
.push(
tree
);

addObstacle(
x - 30,
y - 38,
60,
76,
"tree",
{

treeId:
id

}
);

return tree;

}

function addResource(
x,
y,
type
) {

state.world
.resources
.push({

id:
uid(
"resource"
),

x,

y,

type,

alive:
true,

amount:
randomInt(
1,
3
),

respawn:
0

});

}

function addFood(
x,
y,
type = "carrot",
extra = {}
) {

state.world.foods.push({

id:
uid(
"food"
),

x,

y,

type,

alive:
true,

respawn:
0,

...extra

});

}

function addSecret(
x,
y,
title,
message,
icon = "✦"
) {

const stableId =

"secret_" +
state.area +
"_" +

title

.normalize(
"NFD"
)

.replace(
/[\u0300-\u036f]/g,
""
)

.toLowerCase()

.replace(
/[^a-z0-9]+/g,
"_"
)

.replace(
/^_|_$/g,
""
);

state.world.secrets.push({

id:
stableId,

x,

y,

title,

message,

icon,

found:
Boolean(
state.player
?.secretsFound
?.includes(
stableId
)
)

});

}

function addDecoration(
type,
x,
y,
extra = {}
) {

state.world.decorations.push({

id:
uid(
"decor"
),

type,

x,

y,

...extra

});

}

function addTrial(
x,
y,
id,
title,
extra = {}
) {

state.world.trials.push({

id,

x,

y,

radius:
38,

title,

...extra

});

}

function addHazard(
x,
y,
radius,
delay,
damage,
extra = {}
) {

state.world.hazards.push({

id:
uid(
"hazard"
),

x,

y,

radius,

delay,

maxDelay:
delay,

damage,

life:
delay +
0.26,

triggered:
false,

color:
"rgba(220,52,45,.22)",

...extra

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

state.world
.npcs
.push({

id:
uid(
"npc"
),

x,

y,

radius:
17,

name,

role,

color,

lines,

...extra

});

}

function addEnemy(enemy) {

if (
enemy.type ===
"progression" &&
state.player
?.defeatedBosses
?.includes(
enemy.id
)
) {

return null;

}

const regionOrder = [

"village",

"forest",

"grove",

"mountains",

"iron",

"ruby",

"shadow",

"fairy",

"sky",

"hell",

"final"

];

const regionIndex =
Math.max(
0,
regionOrder.indexOf(
state.area
)
);

const level =
state.player
?.level ||
1;

const regionScale =
1 +
regionIndex *
0.035;

const levelScale =
1 +
Math.max(
0,
level - 1
) *
0.018;

const baseHp =
enemy.maxHp ||
enemy.hp ||
50;

const scaledHp =
Math.round(
baseHp *
regionScale *
levelScale
);

const scaledDamage =
Math.max(
1,
Math.round(

(
enemy.damage ||
5
) *

(
1 +
regionIndex *
0.025 +
Math.max(
0,
level - 1
) *
0.009
)

)
);

const created = {

state:
"idle",

aggressive:
false,

accepted:
false,

attackTimer:
0,

specialTimer:
random(
1.8,
3.8
),

hitFlash:
0,

stunTimer:
0,

dead:
false,

respawnTimer:
0,

phase:
1,

level:
Math.max(
1,
level +
Math.floor(
regionIndex /
2
)
),

...enemy,

hp:
scaledHp,

maxHp:
scaledHp,

damage:
scaledDamage

};

state.world.enemies.push(
created
);

return created;

}

function addPortal(
x,
y,
w,
h,
target,
requirement,
title,
extra = {}
) {

state.world.portals.push({

id:
uid(
"portal"
),

x,

y,

w,

h,

target,

requirement,

title,

...extra

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
state.world.height -
edge,
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
state.world.width -
edge,
0,
edge,
state.world.height,
"wall"
);

}

function buildWorld() {

resetWorld();

addWorldBounds();

const builders = {

village:
buildVillage,

forest:
buildForest,

grove:
buildGrove,

mountains:
buildMountains,

iron:
buildIron,

ruby:
buildRuby,

shadow:
buildShadow,

fairy:
buildFairy,

sky:
buildSky,

hell:
buildHell,

final:
buildFinal

};

builders[
state.area
]();

must(
"locationLabel"
).textContent =
REGIONS[
state.area
].name;

}

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
merchant:
true
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
questId:
"wood"
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
questId:
"coal"
}
);

addEnemy({

id:
"village_slime",

x:
1260,

y:
760,

name:
"LIMO DA QUIETUDE",

icon:
"🟢",

type:
"normal",

hp:
58,

maxHp:
58,

damage:
8,

speed:
56,

vision:
190,

attackRange:
55,

radius:
18,

color:
"#6c9862",

drop:
"carvao",

dropAmount:
1

});

addEnemy({

id:
"village_wolf",

x:
2190,

y:
1450,

name:
"LOBO ESQUECIDO",

icon:
"🐺",

type:
"normal",

hp:
82,

maxHp:
82,

damage:
12,

speed:
92,

vision:
260,

attackRange:
65,

radius:
21,

color:
"#686d78",

drop:
"carvao",

dropAmount:
1

});

addEnemy({

id:
"village_resource_boss",

x:
2350,

y:
1780,

name:
"CERVO ANCESTRAL",

icon:
"🦌",

type:
"resourceBoss",

hp:
430,

maxHp:
430,

damage:
18,

speed:
64,

vision:
270,

attackRange:
75,

radius:
30,

color:
"#788762",

drop:
"ouro",

dropAmount:
2,

respawnTime:
60

});

addEnemy({

id:
"forest_guardian",

x:
2850,

y:
1090,

name:
"GUARDIÃO DA ESTRADA",

icon:
"👺",

type:
"progression",

hp:
280,

maxHp:
280,

damage:
20,

speed:
56,

vision:
280,

attackRange:
75,

radius:
29,

color:
"#945149",

drop:
"cristal",

dropAmount:
2,

unlock:
"forest"

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

[
[760,1260],
[840,1315],
[920,1265],
[1820,1210],
[1900,1250],
[2000,1220]
]
.forEach(
(
[x,y],
index
) => {

addDecoration(
index % 2
? "flowerPot"
: "barrel",
x,
y
);

}
);

addFood(
1340,
1450,
"carrot",
{
respawnMin: 95,
respawnMax: 145
}
);

addFood(
1425,
1510,
"carrot",
{
respawnMin: 95,
respawnMax: 145
}
);

}

function buildForest() {

const pathY =
x =>
1220 +
Math.sin(
x /
320
) *
150;

for (
let x = 120;
x < 3320;
x += 70
) {

const y =
pathY(
x
);

addDecoration(
"pathStone",
x,
y +
random(
-35,
35
),
{
size:
random(
18,
31
),

angle:
random(
-0.6,
0.6
)
}
);

if (
Math.floor(
x /
70
) %
4 ===
0
) {

addDecoration(
"mushroom",
x +
random(
-70,
70
),
y +
random(
115,
180
),
{
glow:
Math.random() <
0.22
}
);

}

}

let planted =
0;

let tries =
0;

while (
planted <
72 &&
tries <
800
) {

tries++;

const x =
randomInt(
135,
3260
);

const y =
randomInt(
130,
2260
);

if (
Math.abs(
y -
pathY(
x
)
) <
170
) {

continue;

}

addTree(
x,
y,
`forest_tree_${planted}`
);

planted++;

}

[
[430,680],
[760,1850],
[1120,520],
[1510,1930],
[1900,620],
[2240,1840],
[2560,720],
[2860,1650],
[3070,530],
[1680,430],
[980,1540],
[2380,1350]
]
.forEach(
(
[x,y],
index
) => {

addDecoration(
index % 3 ===
0
? "fallenLog"
: "bush",
x,
y
);

}
);

[
[620,1120],
[1040,1335],
[1460,1030],
[2050,1350],
[2470,1020],
[2920,1260]
]
.forEach(
([x,y]) => {

addFood(
x,
y,
"carrot",
{
respawnMin: 95,
respawnMax: 150
}
);

}
);

[
[650,480,"carvao"],
[1230,1880,"carvao"],
[1750,540,"ferro"],
[2170,1830,"carvao"],
[2710,510,"ferro"],
[3030,1830,"carvao"],
[1540,1690,"ferro"],
[2350,440,"carvao"]
]
.forEach(
(
[
x,
y,
type
]
) => {

addResource(
x,
y,
type
);

}
);

addSecret(
420,
2020,
"O Boneco que Lembra",
"Você encontrou um espantalho antigo com o seu nome escrito antes mesmo de você chegar à floresta.",
"🧸"
);

addSecret(
2820,
360,
"Círculo das Raposas",
"Pedras formam um círculo perfeito. No centro há marcas de pequenas patas que desaparecem no nada.",
"🦊"
);

addNPC(
720,
860,
"NARA",
"Guardião da Floresta",
"#7ea56b",
[
"A floresta percebe quem passa por ela.",
"Há árvores que se movem quando ninguém está olhando.",
"A Quietude não mata todas as coisas. Algumas continuam andando sem lembrar por quê.",
"Siga as pedras. Elas foram colocadas antes de os moradores esquecerem o caminho."
]
);

for (
let i = 0;
i < 10;
i++
) {

const boar =
i % 2 ===
0;

addEnemy({

id:
`forest_enemy_${i}`,

x:
randomInt(
520,
2820
),

y:
randomInt(
310,
2060
),

name:
boar
? "JAVALI DA MATA"
: "LOBO FLORESTAL",

icon:
boar
? "🐗"
: "🐺",

type:
"normal",

hp:
boar
? 116
: 102,

maxHp:
boar
? 116
: 102,

damage:
boar
? 16
: 14,

speed:
boar
? 80
: 98,

vision:
275,

attackRange:
66,

radius:
boar
? 24
: 22,

color:
boar
? "#715b43"
: "#67726e",

drop:
boar
? "carneCaca"
: "couro",

dropAmount:
1,

dropChance:
boar
? 0.8
: 0.65,

special:
i >= 6
? "dash"
: null

});

}

addEnemy({

id:
"forest_resource_boss",

x:
2460,

y:
1760,

name:
"CERVO DA LUA VERDE",

icon:
"🦌",

type:
"resourceBoss",

hp:
560,

maxHp:
560,

damage:
23,

speed:
64,

vision:
320,

attackRange:
78,

radius:
33,

color:
"#789066",

drop:
"carneCaca",

dropAmount:
3,

dropChance:
1,

respawnTime:
70,

special:
"natureBurst"

});

addEnemy({

id:
"grove_guardian",

x:
2990,

y:
pathY(
2990
),

name:
"GUARDIÃO DA FLORESTA",

icon:
"🌳",

type:
"progression",

hp:
470,

maxHp:
470,

damage:
26,

speed:
60,

vision:
335,

attackRange:
88,

radius:
36,

color:
"#416d43",

drop:
"fragmentoMemoria",

dropAmount:
2,

unlock:
"grove",

special:
"rootCircle"

});

addPortal(
3260,
pathY(
3260
) -
105,
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

function buildGrove() {

const pathY =
x =>
1120 +
Math.sin(
x /
270
) *
95;

for (
let x = 130;
x < 3100;
x += 62
) {

addDecoration(
"pathStone",
x,
pathY(
x
) +
random(
-24,
24
),
{
size:
random(
16,
27
)
}
);

}

let count =
0;

let guard =
0;

while (
count <
58 &&
guard++ <
700
) {

const x =
randomInt(
130,
3050
);

const y =
randomInt(
130,
2160
);

if (
Math.abs(
y -
pathY(
x
)
) <
145
) {

continue;

}

addTree(
x,
y,
`grove_tree_${count++}`
);

}

for (
let i = 0;
i < 28;
i++
) {

addDecoration(
i % 4 ===
0
? "ancientRoot"
: "flower",
randomInt(
190,
3000
),
randomInt(
180,
2100
),
{
phase:
random(
0,
Math.PI *
2
)
}
);

}

[
[520,920],
[880,1360],
[1380,980],
[2010,1260]
]
.forEach(
([x,y]) => {

addFood(
x,
y,
"carrot",
{
respawnMin: 110,
respawnMax: 160
}
);

}
);

addSecret(
650,
1900,
"Estátua Sem Rosto",
"A estátua perdeu o rosto, mas alguém continua deixando flores frescas aos seus pés.",
"🗿"
);

addNPC(
1340,
780,
"LYRA",
"Druida",
"#829f6f",
[
"Este bosque guarda memórias nas raízes.",
"Quando uma árvore cai, às vezes outra nasce carregando lembranças que não são dela.",
"As montanhas ficam além deste lugar.",
"O Guardião do Bosque não odeia viajantes. Ele só esqueceu a diferença entre ameaça e visita."
]
);

for (
let i = 0;
i < 9;
i++
) {

const deer =
i % 3 ===
0;

addEnemy({

id:
`grove_enemy_${i}`,

x:
randomInt(
430,
2700
),

y:
randomInt(
290,
1960
),

name:
deer
? "CERVO DO BOSQUE"
: "FERA DO BOSQUE",

icon:
deer
? "🦌"
: "🐗",

type:
"normal",

hp:
deer
? 142
: 150,

maxHp:
deer
? 142
: 150,

damage:
deer
? 16
: 19,

speed:
deer
? 92
: 84,

vision:
285,

attackRange:
68,

radius:
24,

color:
deer
? "#8d7959"
: "#60745e",

drop:
deer
? "carneCaca"
: "couro",

dropAmount:
1,

dropChance:
0.75,

special:
i >= 6
? "dash"
: null

});

}

addEnemy({

id:
"mountain_guardian",

x:
2760,

y:
1120,

name:
"GUARDIÃO DO BOSQUE",

icon:
"🌲",

type:
"progression",

hp:
560,

maxHp:
560,

damage:
30,

speed:
59,

vision:
345,

attackRange:
90,

radius:
37,

color:
"#4f744f",

drop:
"fragmentoMemoria",

dropAmount:
2,

unlock:
"mountains",

special:
"leafStorm"

});

addPortal(
3060,
1010,
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

function buildMountains() {

for (
let i = 0;
i < 46;
i++
) {

const type =

i % 7 ===
0
? "iceRock"

: i % 4 ===
0
? "oreRock"

: "snowrock";

addObstacle(
randomInt(
160,
3260
),
randomInt(
150,
2100
),
randomInt(
50,
105
),
randomInt(
38,
76
),
type
);

}

for (
let i = 0;
i < 34;
i++
) {

addDecoration(

i % 5 ===
0
? "snowDrift"
: "windMark",

randomInt(
150,
3300
),

randomInt(
140,
2140
),

{
phase:
random(
0,
Math.PI *
2
)
}

);

}

[
[450,430,"ferro"],
[720,1710,"ferro"],
[1050,650,"ouro"],
[1450,1780,"ferro"],
[1860,530,"ferro"],
[2250,1740,"ouro"],
[2700,610,"ferro"],
[3060,1640,"ferro"],
[1600,1110,"ouro"]
]
.forEach(
(
[
x,
y,
type
]
) => {

addResource(
x,
y,
type
);

}
);

addSecret(
3050,
370,
"Espada Congelada",
"Uma espada sem dono está presa no gelo. O nome no cabo foi raspado muitas vezes.",
"🗡️"
);

addNPC(
760,
930,
"KAEL",
"Montanhista",
"#d2d6d2",
[
"O vento daqui apaga pegadas em minutos.",
"Minérios abaixo da neve ainda reagem à magia.",
"As bestas da montanha servem de alimento, mas caçá-las é arriscado.",
"A Sentinela lança pedras antes de avançar. Quando o chão ficar vermelho, saia do círculo."
]
);

for (
let i = 0;
i < 10;
i++
) {

const deer =
i % 3 ===
0;

addEnemy({

id:
`mountain_enemy_${i}`,

x:
randomInt(
460,
2950
),

y:
randomInt(
280,
1940
),

name:
deer
? "CERVO DA NEVE"
: "BESTA DAS MONTANHAS",

icon:
deer
? "🦌"
: "🐐",

type:
"normal",

hp:
deer
? 168
: 190,

maxHp:
deer
? 168
: 190,

damage:
deer
? 20
: 24,

speed:
deer
? 86
: 74,

vision:
300,

attackRange:
deer
? 70
: 85,

radius:
25,

color:
deer
? "#d7d4c9"
: "#bec5c7",

drop:
deer
? "carneCaca"
: "couro",

dropAmount:
1,

dropChance:
0.8,

special:
deer
? "dash"
: "rockThrow"

});

}

addEnemy({

id:
"iron_guardian",

x:
3000,

y:
1110,

name:
"SENTINELA DAS MONTANHAS",

icon:
"🗿",

type:
"progression",

hp:
700,

maxHp:
700,

damage:
35,

speed:
55,

vision:
365,

attackRange:
96,

radius:
39,

color:
"#697176",

drop:
"fragmentoMemoria",

dropAmount:
3,

unlock:
"iron",

special:
"rockStorm"

});

addPortal(
3300,
1000,
70,
230,
"iron",
() =>
hasDefeatedBoss(
"iron_guardian"
),
"CAVERNA DE FERRO"
);

}

function buildIron() {

for (
let i = 0;
i < 34;
i++
) {

addObstacle(
randomInt(
150,
2700
),
randomInt(
150,
1700
),
randomInt(
50,
90
),
randomInt(
38,
65
),
i % 5 ===
0
? "oreRock"
: "ironrock"
);

}

for (
let i = 0;
i < 30;
i++
) {

addResource(
randomInt(
210,
2630
),
randomInt(
190,
1650
),
i % 7 ===
0
? "ouro"
: "ferro"
);

}

for (
let i = 0;
i < 22;
i++
) {

addDecoration(

i % 4 ===
0
? "mineLantern"

: i % 3 ===
0
? "rail"

: "stalagmite",

randomInt(
190,
2700
),

randomInt(
170,
1700
),

{
phase:
random(
0,
Math.PI *
2
)
}

);

}

addSecret(
520,
1540,
"Capacete Abandonado",
"Há um capacete coberto de poeira. Dentro dele, uma anotação diz apenas: 'não siga a voz da parede'.",
"⛑️"
);

for (
let i = 0;
i < 9;
i++
) {

addEnemy({

id:
`iron_enemy_${i}`,

x:
randomInt(
420,
2300
),

y:
randomInt(
250,
1540
),

name:
"MINEIRO CORROMPIDO",

icon:
"⛏️",

type:
"normal",

hp:
205,

maxHp:
205,

damage:
25,

speed:
65,

vision:
275,

attackRange:
76,

radius:
25,

color:
"#626a6d",

drop:
i % 4 ===
0
? "ouro"
: "ferro",

dropAmount:
1,

dropChance:
0.62,

special:
i >= 5
? "oreBurst"
: null

});

}

addEnemy({

id:
"ruby_guardian",

x:
2450,

y:
950,

name:
"GUARDIÃO DE FERRO",

icon:
"⚙️",

type:
"progression",

hp:
800,

maxHp:
800,

damage:
39,

speed:
56,

vision:
375,

attackRange:
100,

radius:
40,

color:
"#70787d",

drop:
"fragmentoMemoria",

dropAmount:
3,

unlock:
"ruby",

special:
"oreBurst"

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
"CAVERNA DE RUBI"
);

}

function buildRuby() {

for (
let i = 0;
i < 36;
i++
) {

addObstacle(
randomInt(
170,
2880
),
randomInt(
170,
1900
),
randomInt(
48,
92
),
randomInt(
38,
70
),
i % 4 ===
0
? "rubyPillar"
: "rubyrock"
);

}

for (
let i = 0;
i < 34;
i++
) {

addResource(
randomInt(
220,
2860
),
randomInt(
190,
1870
),
i % 8 ===
0
? "ouro"
: "rubi"
);

}

for (
let i = 0;
i < 32;
i++
) {

addDecoration(

i % 3 ===
0
? "crystalPillar"
: "crystalShard",

randomInt(
180,
2920
),

randomInt(
170,
1920
),

{
phase:
random(
0,
Math.PI *
2
)
}

);

}

addSecret(
2700,
420,
"Coração Rubi",
"Um cristal pulsa como um coração. Quando você se aproxima, ele repete uma lembrança que você ainda não viveu.",
"❤️"
);

for (
let i = 0;
i < 10;
i++
) {

addEnemy({

id:
`ruby_enemy_${i}`,

x:
randomInt(
400,
2600
),

y:
randomInt(
260,
1780
),

name:
"CRIATURA RUBI",

icon:
"♦",

type:
"normal",

hp:
242,

maxHp:
242,

damage:
29,

speed:
73,

vision:
292,

attackRange:
82,

radius:
26,

color:
"#a34554",

drop:
"rubi",

dropAmount:
1,

dropChance:
0.7,

special:
i >= 4
? "crystalShot"
: null

});

}

addEnemy({

id:
"shadow_guardian",

x:
2620,

y:
1010,

name:
"GUARDIÃO RUBI",

icon:
"🔴",

type:
"progression",

hp:
920,

maxHp:
920,

damage:
44,

speed:
60,

vision:
390,

attackRange:
104,

radius:
41,

color:
"#a33b4f",

drop:
"fragmentoMemoria",

dropAmount:
3,

unlock:
"shadow",

special:
"crystalRain"

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
"CAVERNA SOMBRIA"
);

}

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

id:
`shadow_enemy_${i}`,

x:
randomInt(
420,
2500
),

y:
randomInt(
260,
1700
),

name:
"SOMBRA ESQUECIDA",

icon:
"👤",

type:
"normal",

hp:
265,

maxHp:
265,

damage:
30,

speed:
79,

vision:
290,

attackRange:
72,

radius:
25,

color:
"#49425f",

drop:
"essencia",

dropAmount:
1

});

}

addEnemy({

id:
"fairy_guardian",

x:
2500,

y:
980,

name:
"GUARDIÃO SOMBRIO",

icon:
"🌑",

type:
"progression",

hp:
930,

maxHp:
930,

damage:
42,

speed:
63,

vision:
360,

attackRange:
94,

radius:
36,

color:
"#42364f",

drop:
"essencia",

dropAmount:
3,

unlock:
"fairy"

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

state.world
.effects
.push({

type:
"flower",

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
Math.PI *
2
)

});

}

for (
let i = 0;
i < 7;
i++
) {

addEnemy({

id:
`fairy_enemy_${i}`,

x:
randomInt(
450,
2700
),

y:
randomInt(
270,
1800
),

name:
"ESPÍRITO FEÉRICO",

icon:
"🦋",

type:
"normal",

hp:
285,

maxHp:
285,

damage:
32,

speed:
93,

vision:
300,

attackRange:
74,

radius:
24,

color:
"#b887be",

drop:
"cristal",

dropAmount:
1

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

id:
"sky_guardian",

x:
2700,

y:
1050,

name:
"GUARDIÃ DOS FIOS",

icon:
"🧚",

type:
"progression",

hp:
1080,

maxHp:
1080,

damage:
44,

speed:
70,

vision:
380,

attackRange:
96,

radius:
37,

color:
"#cb8dd0",

drop:
"essencia",

dropAmount:
4,

unlock:
"sky"

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

function buildSky() {

for (
let i = 0;
i < 30;
i++
) {

addDecoration(

i % 5 ===
0
? "celestialPillar"
: "cloud",

randomInt(
160,
3220
),

randomInt(
140,
2050
),

{
phase:
random(
0,
Math.PI *
2
)
}

);

}

for (
let i = 0;
i < 18;
i++
) {

addResource(
randomInt(
220,
3080
),
randomInt(
180,
1940
),
"cristal"
);

}

addNPC(
1050,
830,
"AERIS",
"Guardião Celeste",
"#c7d4df",
[
"O Céu é preparação, não o fim.",
"Cinco hordas guardam o caminho para aquele que protege a passagem.",
"Vença todas. Depois enfrente o Guardião do Caminho.",
"A Flauta da Memória não abre uma porta. Ela faz o mundo lembrar que uma escada existia."
]
);

for (
let i = 0;
i < 6;
i++
) {

addEnemy({

id:
`sky_patrol_${i}`,

x:
450 +
i *
410,

y:
i % 2
? 520
: 1730,

name:
"SERAFIM ERRANTE",

icon:
"🪽",

type:
"normal",

hp:
335,

maxHp:
335,

damage:
36,

speed:
98,

vision:
325,

attackRange:
82,

radius:
27,

color:
"#d3dde3",

drop:
"cristal",

dropAmount:
1,

dropChance:
0.62,

special:
i >= 3
? "crystalShot"
: null

});

}

addTrial(
1710,
1100,
"sky_hordes",
"ALTAR DAS CINCO HORDAS"
);

if (
!state.player
.skyTrial
?.complete
) {

addDecoration(
"trialAltar",
1710,
1100
);

}

if (
state.player
.skyTrial
?.complete &&
!hasDefeatedBoss(
"path_guardian"
)
) {

spawnPathGuardian();

}

addPortal(
3260,
960,
72,
250,
"hell",
() =>

hasDefeatedBoss(
"path_guardian"
) &&

Boolean(
state.player.flutePlayed
),

"ESCADA DO INFERNO",

{

stairs:
true,

visible:
() =>
Boolean(
state.player.flutePlayed
)

}

);

addSecret(
420,
350,
"Banco nas Nuvens",
"Alguém deixou um banco olhando para o vazio. No encosto está gravado: 'eu esperaria você de novo'.",
"☁️"
);

}

function buildHell() {

for (
let i = 0;
i < 38;
i++
) {

addObstacle(
randomInt(
170,
3380
),
randomInt(
160,
2150
),
randomInt(
55,
105
),
randomInt(
40,
80
),
i % 5 ===
0
? "obsidian"
: "basalt"
);

}

for (
let i = 0;
i < 34;
i++
) {

addDecoration(

i % 4 ===
0
? "lavaPool"

: i % 3 ===
0
? "hellSmoke"

: "emberVent",

randomInt(
160,
3400
),

randomInt(
150,
2200
),

{
phase:
random(
0,
Math.PI *
2
)
}

);

}

const types = [

[
"DEMÔNIO DE CINZA",
"🔥",
"#8c4d3f",
"essencia",
"fireCircle"
],

[
"CÃO DE LAVA",
"🐕",
"#984b31",
"couro",
"dash"
],

[
"ESPECTRO CARMESIM",
"👻",
"#724056",
"essencia",
"shadowBurst"
],

[
"GÁRGULA QUEBRADA",
"🗿",
"#70554a",
"ouro",
"rockThrow"
],

[
"PARASITA DO VAZIO",
"🕷️",
"#4b3551",
"essencia",
"voidCircle"
]

];

types.forEach(
(
[
name,
icon,
color,
drop,
special
],
typeIndex
) => {

for (
let i = 0;
i < 3;
i++
) {

addEnemy({

id:
`hell_${typeIndex}_${i}`,

x:
randomInt(
430,
3020
),

y:
randomInt(
270,
2060
),

name,

icon,

type:
"hell",

hellType:
typeIndex,

hp:
410 +
typeIndex *
42,

maxHp:
410 +
typeIndex *
42,

damage:
39 +
typeIndex *
4,

speed:
82 +
typeIndex *
4,

vision:
360,

attackRange:
84,

radius:
28,

color,

drop,

dropAmount:
1,

dropChance:
0.72,

special

});

}

}
);

addEnemy({

id:
"final_gate_guardian",

x:
3060,

y:
1120,

name:
"GUARDIÃO SUPREMO DO INFERNO",

icon:
"👿",

type:
"progression",

hp:
1750,

maxHp:
1750,

damage:
62,

speed:
76,

vision:
455,

attackRange:
115,

radius:
44,

color:
"#a64139",

drop:
"fragmentoMemoria",

dropAmount:
6,

unlock:
"final",

special:
"infernalStorm"

});

addPortal(
3390,
1010,
70,
230,
"final",
() =>

hasDefeatedBoss(
"final_gate_guardian"
) &&

Object.keys(
state.player
.hellTypesDefeated
).length >=
5,

"CÂMARA FINAL"
);

}

function buildFinal() {

addEnemy({

id:
"other_self",

x:
1550,

y:
750,

name:
"O OUTRO EU",

icon:
"☯",

type:
"final",

hp:
2200,

maxHp:
2200,

damage:
62,

speed:
86,

vision:
650,

attackRange:
112,

radius:
42,

color:
"#b7aaa0",

drop:
"essencia",

dropAmount:
10

});

}

function hasDefeatedBoss(id) {

return Boolean(
state.player
?.defeatedBosses
?.includes(
id
)
);

}

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
rect.x +
rect.w
);

const closestY =
clamp(
cy,
rect.y,
rect.y +
rect.h
);

const dx =
cx -
closestX;

const dy =
cy -
closestY;

return (
dx *
dx +
dy *
dy <
radius *
radius
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

x -
radius >=
room.x +
18 &&

y -
radius >=
room.y +
18 &&

x +
radius <=
room.x +
room.w -
18 &&

y +
radius <=
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

x -
radius <
72 ||

y -
radius <
72 ||

x +
radius >
state.world.width -
72 ||

y +
radius >
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
state.world
.trees
.find(
item =>
item.id ===
obstacle.treeId
);

if (
!tree
?.alive
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
x -
npc.x,
y -
npc.y
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

x -
radius <
72 ||

y -
radius <
72 ||

x +
radius >
state.world.width -
72 ||

y +
radius >
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
state.world
.trees
.find(
item =>
item.id ===
obstacle.treeId
);

if (
!tree
?.alive
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

function getHouseRoom() {

const building =
state.currentHouse;

const w =
clamp(
(
building?.w ||
430
) +
150,
560,
760
);

const h =
clamp(
(
building?.h ||
270
) +
150,
420,
560
);

return {

x:
state.world.width /
2 -
w /
2,

y:
state.world.height /
2 -
h /
2,

w,

h

};

}

function getHouseTheme() {

const themes = {

home: {

wall:
"#4b342b",

floor:
"#9a7452",

trim:
"#d8b87a",

accent:
"#efb05b"

},

elianHome: {

wall:
"#3f3831",

floor:
"#856a50",

trim:
"#cab07e",

accent:
"#6d8790"

},

forge: {

wall:
"#292b2f",

floor:
"#55504a",

trim:
"#a39789",

accent:
"#ff8149"

},

shop: {

wall:
"#3e2e28",

floor:
"#8c6847",

trim:
"#e0bc75",

accent:
"#e8c56f"

},

woodshop: {

wall:
"#453225",

floor:
"#a0784f",

trim:
"#d9b276",

accent:
"#d89c55"

}

};

return (

themes[
state.currentHouse
?.id
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

name:
"ELIAN",

role:
"Morador",

color:
"#d4b27c",

dx:
0.73,

dy:
0.38

},

forge: {

name:
"BORIN",

role:
"Ferreiro",

color:
"#8e8d89",

questId:
"coal",

dx:
0.73,

dy:
0.47

},

shop: {

name:
"DORAN",

role:
"Comerciante",

color:
"#c58a54",

merchant:
true,

dx:
0.72,

dy:
0.34

},

woodshop: {

name:
"BRAN",

role:
"Carpinteiro",

color:
"#8d7053",

questId:
"wood",

dx:
0.73,

dy:
0.43

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
state.world
.npcs
.find(
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

radius:
17,

lines:
original?.lines ||
[
"Bem-vindo."
],

interior:
true

}

];

}

function placePlayerInsideHouse() {

const room =
getHouseRoom();

state.player.x =
room.x +
room.w /
2;

state.player.y =
room.y +
room.h -
64;

state.keys.clear();

updateCamera();

}

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
state.keys.has(
"w"
) ||
state.keys.has(
"arrowup"
)
) {

dy--;

}

if (
state.keys.has(
"s"
) ||
state.keys.has(
"arrowdown"
)
) {

dy++;

}

if (
state.keys.has(
"a"
) ||
state.keys.has(
"arrowleft"
)
) {

dx--;

}

if (
state.keys.has(
"d"
) ||
state.keys.has(
"arrowright"
)
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
state.player.hunger <=
20
) {

speed *=
0.72;

}

if (
!state.houseMode &&
state.player.fatigue <=
20
) {

speed *=
0.72;

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
0.12 *
dt,
0,
100
);

player.fatigue =
clamp(
player.fatigue -
0.09 *
dt,
0,
100
);

player.magic =
clamp(

player.magic +

(
player.hunger >
10
? 1.55
: 0.7
) *
dt,

0,

player.maxMagic

);

player.energy =
clamp(

player.energy +

(
player.fatigue >
10
? 2.7
: 1.1
) *
dt,

0,

player.maxEnergy

);

if (
player.hunger <=
0 ||
player.fatigue <=
0
) {

player.hp =
clamp(
player.hp -
0.045 *
dt,
1,
player.maxHp
);

}

document.body
.classList
.toggle(

"low-needs",

player.hunger <=
16 ||

player.fatigue <=
16

);

const now =
performance.now();

if (
now -
state.warnedNeedAt >
7000
) {

if (
player.hunger <
18
) {

showToast(
"Você está com fome. Procure cenouras, cace ou compre comida."
);

state.warnedNeedAt =
now;

}

else if (
player.fatigue <
18
) {

showToast(
"Você está exausto. Durma na cama da sua casa."
);

state.warnedNeedAt =
now;

}

}

}

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
enemy.respawnTimer <=
0
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

enemy.specialTimer =
Math.max(
0,
(
enemy.specialTimer ||
0
) -
dt
);

enemy.hitFlash =
Math.max(
0,
enemy.hitFlash -
dt
);

enemy.stunTimer =
Math.max(
0,
(
enemy.stunTimer ||
0
) -
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
!state.player
.finalChoice
) {

if (
d <
130 &&
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
d <=
enemy.vision
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

enemy.hp =
Math.min(
enemy.maxHp,
enemy.hp +
enemy.maxHp *
0.18
);

continue;

}

if (
enemy.stunTimer >
0
) {

continue;

}

updateEnemyPhase(
enemy
);

updateEnemySpecial(
enemy
);

if (
d >
enemy.attackRange
) {

const length =
d ||
1;

const slow =
enemy.telegraphing
? 0.28
: 1;

const vx =

(
(
state.player.x -
enemy.x
) /
length
) *

enemy.speed *

slow *

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

slow *

dt;

if (
canEnemyMoveTo(
enemy.x +
vx,
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
enemy.y +
vy,
enemy.radius
)
) {

enemy.y +=
vy;

}

}

else if (
enemy.attackTimer <=
0 &&
!enemy.telegraphing
) {

damagePlayer(
enemy.damage
);

enemy.attackTimer =
Math.max(
0.68,
1.2 -
enemy.phase *
0.08
);

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

function updateEnemyPhase(enemy) {

if (
enemy.type !==
"progression" &&
enemy.type !==
"resourceBoss" &&
enemy.type !==
"final"
) {

enemy.phase =
1;

return;

}

const ratio =
enemy.hp /
enemy.maxHp;

const newPhase =

ratio >
0.72
? 1

: ratio >
0.42
? 2

: 3;

if (
newPhase !==
enemy.phase
) {

enemy.phase =
newPhase;

enemy.specialTimer =
Math.min(
enemy.specialTimer ||
1,
0.8
);

showToast(
`${enemy.name}: fase ${newPhase}.`
);

}

}

function updateEnemySpecial(enemy) {

if (
!enemy.special ||
enemy.specialTimer >
0 ||
enemy.telegraphing
) {

return;

}

const phase =
Math.max(
1,
enemy.phase ||
1
);

const px =
state.player.x;

const py =
state.player.y;

enemy.telegraphing =
true;

const release =
delay => {

setTimeout(
() => {

if (
enemy &&
!enemy.dead
) {

enemy.telegraphing =
false;

}

},
delay *
1000 +
160
);

};

if (

enemy.special ===
"rockThrow" ||

enemy.special ===
"crystalShot"

) {

addHazard(
px,
py,

enemy.special ===
"rockThrow"
? 56
: 48,

0.82,

Math.round(
enemy.damage *
0.95
),

{
sourceId:
enemy.id,

kind:
enemy.special
}
);

release(
0.82
);

enemy.specialTimer =
random(
3.1,
4.6
);

return;

}

if (
enemy.special ===
"dash"
) {

addHazard(
px,
py,
68,
0.62,
Math.round(
enemy.damage *
1.15
),
{
sourceId:
enemy.id,
kind:
"dash"
}
);

const d =
distance(
enemy,
state.player
) ||
1;

const step =
Math.min(
180,
d - 25
);

const nx =

enemy.x +

(
(
px -
enemy.x
) /
d
) *
step;

const ny =

enemy.y +

(
(
py -
enemy.y
) /
d
) *
step;

setTimeout(
() => {

if (
!enemy.dead &&
canEnemyMoveTo(
nx,
ny,
enemy.radius
)
) {

enemy.x =
nx;

enemy.y =
ny;

}

},
540
);

release(
0.62
);

enemy.specialTimer =
random(
3.4,
4.8
);

return;

}

const configs = {

natureBurst: {

radius:
105,

delay:
1,

mult:
1.05,

count:
1

},

rootCircle: {

radius:
78,

delay:
1.05,

mult:
1.10,

count:
2 +
phase

},

leafStorm: {

radius:
66,

delay:
0.9,

mult:
1.05,

count:
2 +
phase

},

rockStorm: {

radius:
72,

delay:
0.92,

mult:
1.15,

count:
2 +
phase *
2

},

oreBurst: {

radius:
70,

delay:
0.88,

mult:
1.10,

count:
2 +
phase

},

crystalRain: {

radius:
64,

delay:
0.76,

mult:
1.14,

count:
3 +
phase *
2

},

fireCircle: {

radius:
75,

delay:
0.8,

mult:
1.12,

count:
2 +
phase

},

shadowBurst: {

radius:
82,

delay:
0.86,

mult:
1.15,

count:
2 +
phase

},

voidCircle: {

radius:
92,

delay:
1,

mult:
1.18,

count:
2 +
phase

},

infernalStorm: {

radius:
78,

delay:
0.68,

mult:
1.22,

count:
4 +
phase *
2

}

};

const config =
configs[
enemy.special
];

if (
config
) {

for (
let i = 0;
i < config.count;
i++
) {

const angle =
random(
0,
Math.PI *
2
);

const spread =

i ===
0
? 0

: random(
50,
190 +
phase *
25
);

addHazard(

px +
Math.cos(
angle
) *
spread,

py +
Math.sin(
angle
) *
spread,

config.radius,

config.delay +
i *
0.055,

Math.round(
enemy.damage *
config.mult
),

{
sourceId:
enemy.id,

kind:
enemy.special
}

);

}

release(
config.delay
);

enemy.specialTimer =
Math.max(
1.8,

random(
3.8,
5.2
) -

phase *
0.45
);

return;

}

enemy.telegraphing =
false;

enemy.specialTimer =
3;

}

function updateHazards(dt) {

for (
const hazard of
state.world.hazards
) {

hazard.delay -=
dt;

hazard.life -=
dt;

if (
!hazard.triggered &&
hazard.delay <=
0
) {

hazard.triggered =
true;

if (

Math.hypot(

state.player.x -
hazard.x,

state.player.y -
hazard.y

) <=

hazard.radius +
state.player.radius

) {

damagePlayer(
hazard.damage
);

}

spawnParticles(

hazard.x,

hazard.y,

hazard.kind
?.includes(
"crystal"
)

? "#ff6d8c"

: "#e85c45",

16

);

}

}

state.world.hazards =
state.world.hazards
.filter(
hazard =>
hazard.life >
0
);

}

function updateFinalBoss(
enemy,
dt
) {

const ratio =
enemy.hp /
enemy.maxHp;

const newPhase =

ratio >
0.8
? 1

: ratio >
0.6
? 2

: ratio >
0.4
? 3

: ratio >
0.2
? 4

: 5;

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

enemy.finalSpecialTimer =
Math.max(

0,

(
enemy.finalSpecialTimer ||
2.2
) -
dt

);

if (
enemy.finalSpecialTimer <=
0
) {

const count =
2 +
newPhase *
2;

const delay =
Math.max(
0.52,
1.02 -
newPhase *
0.08
);

for (
let i = 0;
i < count;
i++
) {

const angle =
random(
0,
Math.PI *
2
);

const spread =

i ===
0
? 0

: random(
55,
245
);

addHazard(

state.player.x +
Math.cos(
angle
) *
spread,

state.player.y +
Math.sin(
angle
) *
spread,

68 +
newPhase *
4,

delay +
i *
0.035,

Math.round(

enemy.damage *

(
0.68 +
newPhase *
0.07
)

),

{
sourceId:
enemy.id,

kind:
"quietudeFinal"
}

);

}

enemy.finalSpecialTimer =
Math.max(
1.6,
4.1 -
newPhase *
0.42
);

}

}

function damagePlayer(amount) {

const player =
state.player;

if (
!player ||
player.invincible >
0 ||
player.dead
) {

return;

}

const armorDefense =

ITEMS[
player.equipment
.armor
]?.defense ||
0;

const rawDamage =
Math.max(

1,

amount -

(
player.defense +
armorDefense
) *
0.35

);

const reduction =
clamp(
player.damageReduction ||
0,
0,
0.72
);

const finalDamage =
Math.max(

1,

Math.round(

rawDamage *

(
1 -
reduction
)

)

);

player.hp =
Math.max(
0,
player.hp -
finalDamage
);

player.invincible =
0.55;

state.world.effects.push({

type:
"damageNumber",

x:
player.x,

y:
player.y -
26,

text:
`-${finalDamage}`,

life:
0.72,

maxLife:
0.72,

color:
"#ff8178"

});

if (
player.hp <=
0
) {

playerDeath();

}

}

function playerDeath() {

state.player.dead =
true;

state.paused =
true;

must(
"deathPanel"
).classList
.remove(
"hidden"
);

}

function respawnPlayer() {

const checkpoint =
state.player
.checkpoint ||
{

area:
"village",

x:
480,

y:
610

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

state.player
.maxHp *
0.7

)

);

state.player.magic =
Math.max(

1,

Math.floor(

state.player
.maxMagic *
0.7

)

);

state.player.energy =
Math.max(

1,

Math.floor(

state.player
.maxEnergy *
0.7

)

);

state.player.money =
Math.floor(

state.player.money *
0.9

);

state.player.dead =
false;

state.player.invincible =
1;

state.paused =
false;

must(
"deathPanel"
).classList
.add(
"hidden"
);

showToast(
"Você retornou ao último ponto seguro."
);

}
  function findNearestEnemy(
range
) {
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

function findEnemyToward(
point,
range,
cone = .72
) {

if (
!point
) {
return findNearestEnemy(
range
);
}

const player =
state.player;

const ax =
point.x -
player.x;

const ay =
point.y -
player.y;

const al =
Math.hypot(
ax,
ay
) || 1;

const aimX =
ax / al;

const aimY =
ay / al;

let best =
null;

let score =
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

const dx =
enemy.x -
player.x;

const dy =
enemy.y -
player.y;

const d =
Math.hypot(
dx,
dy
);

if (
d >
range
) {
continue;
}

const dot =

(
dx /
(
d || 1
)
) *
aimX +

(
dy /
(
d || 1
)
) *
aimY;

if (
dot <
cone
) {
continue;
}

const currentScore =
d -
dot *
45;

if (
currentScore <
score
) {

score =
currentScore;

best =
enemy;

}

}

return best;
}

function createAttackEffect(
point,
range,
color,
ranged = false
) {

const player =
state.player;

const dx =

(
point?.x ??
player.x + 1
) -
player.x;

const dy =

(
point?.y ??
player.y
) -
player.y;

const length =
Math.hypot(
dx,
dy
) || 1;

state.world.effects.push({

type:
ranged
? "playerBolt"
: "playerSlash",

x:
player.x,

y:
player.y,

tx:
player.x +
(
dx /
length
) *
Math.min(
range,
155
),

ty:
player.y +
(
dy /
length
) *
Math.min(
range,
155
),

life:
ranged
? .38
: .18,

maxLife:
ranged
? .38
: .18,

color

});

}

function performAttack(
point = null
) {

const player =
state.player;

if (
!player ||
state.paused ||
state.dialogue ||
state.travel ||
state.battle ||
player.dead ||
state.houseMode
) {
return;
}

if (
player.attackCooldown >
0
) {
return;
}

if (
player.energy <
4
) {

showToast(
"Energia insuficiente."
);

return;

}

const character =
currentCharacter();

const ranged =

character.id ===
"kaelion" ||

character.id ===
"lirael";

const attackRange =
ranged
? 300
: 142;

const worldPoint =
point || {

x:
state.pointer.worldX,

y:
state.pointer.worldY

};

const target =
findEnemyToward(

worldPoint,

attackRange,

ranged
? .58
: .48

);

player.energy =
Math.max(
0,
player.energy - 4
);

player.attackCooldown =
ranged
? .34
: .30;

player.hunger =
Math.max(
0,
player.hunger - .08
);

player.fatigue =
Math.max(
0,
player.fatigue - .12
);

createAttackEffect(
worldPoint,
attackRange,
character.color,
ranged
);

if (
!target
) {
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
]?.damage || 0
);

if (
character.id ===
"grumgar"
) {
damage += 8;
}

if (
character.id ===
"theron"
) {
damage += 4;
}

if (
ranged &&
distance(
target,
player
) >
220
) {
damage *= .92;
}

attackEnemy(
target,
Math.round(
damage
)
);

}

function useClassAbility() {

useSkill(
"q"
);

}

const CLASS_SKILLS = {

kaelion: {

q: {
name:
"Bola de Memória",
level: 1,
cooldown: 2,
costMagic: 15
},

r: {
name:
"Nova Arcana",
level: 5,
cooldown: 6,
costMagic: 30
},

f: {
name:
"Tempestade da Quietude",
level: 10,
cooldown: 12,
costMagic: 55
}

},

theron: {

q: {
name:
"Golpe Pesado",
level: 1,
cooldown: 3,
costEnergy: 10
},

r: {
name:
"Postura do Guardião",
level: 5,
cooldown: 9,
costEnergy: 18
},

f: {
name:
"Juramento de Aço",
level: 10,
cooldown: 15,
costEnergy: 30
}

},

grumgar: {

q: {
name:
"Esmagamento",
level: 1,
cooldown: 4,
costEnergy: 12
},

r: {
name:
"Rugido Ancestral",
level: 5,
cooldown: 8,
costEnergy: 20
},

f: {
name:
"Terremoto",
level: 10,
cooldown: 14,
costEnergy: 34
}

},

lirael: {

q: {
name:
"Flecha Feérica",
level: 1,
cooldown: 1.5,
costMagic: 12
},

r: {
name:
"Luz Vital",
level: 5,
cooldown: 7,
costMagic: 28
},

f: {
name:
"Chuva de Estrelas",
level: 10,
cooldown: 11,
costMagic: 48
}

},

zephyr: {

q: {
name:
"Forma Adaptativa",
level: 1,
cooldown: 7,
costMagic: 12
},

r: {
name:
"Investida Quimérica",
level: 5,
cooldown: 6,
costEnergy: 18
},

f: {
name:
"Forma Perfeita",
level: 10,
cooldown: 15,
costMagic: 42
}

}

};

function getCharacterSkills() {

return (
CLASS_SKILLS[
state.player?.characterId
] ||
CLASS_SKILLS.kaelion
);

}

function updateSkillCooldowns(
dt
) {

if (
!state.player
) {
return;
}

for (
const key of
[
"q",
"r",
"f"
]
) {

state.player
.skillCooldowns[key] =
Math.max(

0,

(
state.player
.skillCooldowns[key] ||
0
) -
dt

);

}

state.player.shieldTimer =
Math.max(

0,

(
state.player.shieldTimer ||
0
) -
dt

);

if (
state.player.shieldTimer <=
0
) {

state.player.damageReduction =
0;

}

}

function useSkill(
key
) {

const player =
state.player;

if (
!player ||
state.paused ||
state.houseMode ||
player.dead
) {
return;
}

const character =
currentCharacter();

const skills =
getCharacterSkills();

const skill =
skills[key];

if (
!skill
) {
return;
}

if (
player.level <
skill.level
) {

showToast(
`${skill.name} é desbloqueada no nível ${skill.level}.`
);

return;

}

if (
(
player.skillCooldowns[key] ||
0
) >
0
) {
return;
}

if (
skill.costMagic &&
player.magic <
skill.costMagic
) {

showToast(
"Magia insuficiente."
);

return;

}

if (
skill.costEnergy &&
player.energy <
skill.costEnergy
) {

showToast(
"Energia insuficiente."
);

return;

}

player.magic =
Math.max(

0,

player.magic -
(
skill.costMagic ||
0
)

);

player.energy =
Math.max(

0,

player.energy -
(
skill.costEnergy ||
0
)

);

player.skillCooldowns[key] =
skill.cooldown;

const point = {

x:
state.pointer.worldX ||
player.x + 1,

y:
state.pointer.worldY ||
player.y

};

const weaponBonus =

ITEMS[
player.equipment.weapon
]?.damage || 0;

const base =
player.damage +
weaponBonus;

/* =============================
KAELION
============================= */

if (
character.id ===
"kaelion"
) {

if (
key ===
"q"
) {

const target =
findEnemyToward(
point,
390,
.48
);

createAttackEffect(
point,
390,
"#f1a354",
true
);

if (
target
) {

if (
target.type ===
"progression" &&
!target.accepted
) {

openBattle(
target
);

}

else {

attackEnemy(

target,

Math.round(

base *
1.45 +
18

)

);

}

}

}

else if (
key ===
"r"
) {

damageEnemiesInRadius(

player.x,
player.y,
175,

Math.round(

base *
1.35 +
22

),

{
stun:
1.1,

color:
"#f0a053"
}

);

}

else {

for (
let i = 0;
i < 7;
i++
) {

const angle =

(
Math.PI *
2 *
i
) /
7;

const x =

player.x +

Math.cos(
angle
) *

random(
70,
210
);

const y =

player.y +

Math.sin(
angle
) *

random(
70,
210
);

state.world.effects.push({

type:
"memoryStrike",

x,

y,

life:
.7,

maxLife:
.7,

color:
"#f4a35d"

});

damageEnemiesInRadius(

x,
y,
78,

Math.round(

base *
1.15 +
24

)

);

}

}

}

/* =============================
THERON
============================= */

else if (
character.id ===
"theron"
) {

if (
key ===
"q"
) {

const target =
findEnemyToward(
point,
165,
.32
);

if (
target
) {

if (
target.type ===
"progression" &&
!target.accepted
) {

openBattle(
target
);

}

else {

attackEnemy(

target,

Math.round(

base *
1.65 +
18

)

);

target.stunTimer =
Math.max(

target.stunTimer ||
0,

.55

);

}

}

createAttackEffect(
point,
165,
"#d5dce2",
false
);

}

else if (
key ===
"r"
) {

player.damageReduction =
.45;

player.shieldTimer =
5.2;

spawnParticles(
player.x,
player.y,
"#ced8e2",
22
);

}

else {

player.damageReduction =
.58;

player.shieldTimer =
7;

damageEnemiesInRadius(

player.x,
player.y,
145,

Math.round(

base *
1.35 +
25

),

{
stun:
.8,

color:
"#f2d48a"
}

);

}

}

/* =============================
GRUMGAR
============================= */

else if (
character.id ===
"grumgar"
) {

if (
key ===
"q"
) {

damageEnemiesInRadius(

player.x,
player.y,
132,

Math.round(

base *
1.7 +
24

),

{
stun:
.45,

color:
"#92a45f"
}

);

}

else if (
key ===
"r"
) {

damageEnemiesInRadius(

player.x,
player.y,
230,

Math.round(

base *
.75 +
12

),

{
stun:
2,

color:
"#7f9454"
}

);

}

else {

for (
let i = 0;
i < 5;
i++
) {

state.world.effects.push({

type:
"shockRing",

x:
player.x,

y:
player.y,

radius:
60 +
i *
42,

life:
.65 +
i *
.08,

maxLife:
.65 +
i *
.08,

color:
"#9f8b61"

});

}

damageEnemiesInRadius(

player.x,
player.y,
295,

Math.round(

base *
1.55 +
38

),

{
stun:
1.25,

color:
"#9f8b61"
}

);

}

}

/* =============================
LIRAEL
============================= */

else if (
character.id ===
"lirael"
) {

if (
key ===
"q"
) {

const target =
findEnemyToward(
point,
430,
.4
);

createAttackEffect(
point,
430,
"#f6a2df",
true
);

if (
target
) {

if (
target.type ===
"progression" &&
!target.accepted
) {

openBattle(
target
);

}

else {

attackEnemy(

target,

Math.round(

base *
1.28 +
18

)

);

}

}

}

else if (
key ===
"r"
) {

player.hp =
Math.min(

player.maxHp,

player.hp +

Math.round(

player.maxHp *
.36

)

);

player.energy =
Math.min(

player.maxEnergy,

player.energy +
25

);

spawnParticles(
player.x,
player.y,
"#ffb7e8",
28
);

}

else {

for (
let i = 0;
i < 8;
i++
) {

const x =
player.x +
random(
-220,
220
);

const y =
player.y +
random(
-220,
220
);

state.world.effects.push({

type:
"memoryStrike",

x,

y,

life:
.75,

maxLife:
.75,

color:
"#ffb6e6"

});

damageEnemiesInRadius(

x,
y,
65,

Math.round(
base +
22
)

);

}

}

}

/* =============================
ZEPHYR
============================= */

else if (
character.id ===
"zephyr"
) {

if (
key ===
"q"
) {

activateAdaptiveForm(
6.5,
24,
6
);

}

else if (
key ===
"r"
) {

const dx =
point.x -
player.x;

const dy =
point.y -
player.y;

const d =
Math.hypot(
dx,
dy
) || 1;

const nx =

player.x +

(
dx /
d
) *
150;

const ny =

player.y +

(
dy /
d
) *
150;

if (
canPlayerMoveTo(
nx,
ny,
player.radius
)
) {

player.x =
nx;

player.y =
ny;

}

damageEnemiesInRadius(

player.x,
player.y,
95,

Math.round(

base *
1.45 +
18

),

{
color:
"#a384e8"
}

);

}

else {

activateAdaptiveForm(
10,
42,
12
);

player.damageReduction =
.28;

player.shieldTimer =
10;

player.hp =
Math.min(

player.maxHp,

player.hp +
28

);

}

}

player.hunger =
Math.max(
0,
player.hunger -
.35
);

player.fatigue =
Math.max(
0,
player.fatigue -
.55
);

showToast(
skill.name
);

}

function activateAdaptiveForm(
duration,
speedBonus,
damageBonus
) {

const player =
state.player;

if (
player.adaptiveBuff
) {
return;
}

player.adaptiveBuff =
true;

player.speed +=
speedBonus;

player.damage +=
damageBonus;

spawnParticles(
player.x,
player.y,
"#9f7ae8",
24
);

setTimeout(
() => {

if (
state.player
?.adaptiveBuff
) {

state.player.speed -=
speedBonus;

state.player.damage -=
damageBonus;

state.player.adaptiveBuff =
false;

}

},
duration *
1000
);

}

function damageEnemiesInRadius(
x,
y,
radius,
damage,
options = {}
) {

for (
const enemy of
state.world.enemies
) {

if (
enemy.dead
) {
continue;
}

if (

Math.hypot(

enemy.x -
x,

enemy.y -
y

) <=

radius +
enemy.radius

) {

if (
enemy.type ===
"progression" &&
!enemy.accepted
) {
continue;
}

attackEnemy(
enemy,
damage
);

if (
options.stun
) {

enemy.stunTimer =
Math.max(

enemy.stunTimer ||
0,

options.stun

);

}

}

}

state.world.effects.push({

type:
"skillRing",

x,

y,

radius,

life:
.48,

maxLife:
.48,

color:
options.color ||
"#fff2b0"

});

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

const finalDamage =
Math.max(
1,
Math.round(
damage
)
);

enemy.hp =
Math.max(
0,
enemy.hp -
finalDamage
);

enemy.hitFlash =
.18;

spawnParticles(

enemy.x,

enemy.y,

finalDamage >=
70

? "#ff8c70"

: "#ffffff",

finalDamage >=
70

? 12

: 8

);

state.world.effects.push({

type:
"damageNumber",

x:
enemy.x,

y:
enemy.y -
enemy.radius -
12,

text:
`-${finalDamage}`,

life:
.72,

maxLife:
.72,

color:

finalDamage >=
100
? "#cf7bff"

: finalDamage >=
70
? "#ff715e"

: finalDamage >=
45
? "#ffad56"

: finalDamage >=
28
? "#ffe16d"

: "#ffffff"

});

if (
enemy.hp <=
0
) {

defeatEnemy(
enemy
);

}

}

function defeatEnemy(
enemy
) {

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

: enemy.horde
? 42 +
enemy.horde *
6

: 30;

const money =

enemy.type ===
"progression"
? 80

: enemy.type ===
"resourceBoss"
? 45

: enemy.type ===
"final"
? 250

: 12;

state.player.xp +=
xp;

state.player.money +=
money;

const shouldDrop =

enemy.drop &&

ITEMS[
enemy.drop
] &&

Math.random() <=
(
enemy.dropChance ??
1
);

if (
shouldDrop
) {

const amount =
enemy.dropAmount ||
1;

addItem(
enemy.drop,
amount
);

state.world.drops.push({

x:
enemy.x,

y:
enemy.y,

type:
enemy.drop,

amount,

life:
18

});

}

if (
enemy.id ===
"path_guardian"
) {

if (
!state.player
.inventory
.flautaMemoria
) {

addItem(
"flautaMemoria",
1
);

}

showToast(
"Você recebeu a Flauta da Memória. Use-a no Céu para revelar a escada."
);

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

state.player
.hellTypesDefeated[
String(
enemy.hellType
)
] =
true;

}

if (
enemy.type ===
"progression"
) {

if (
!state.player
.defeatedBosses
.includes(
enemy.id
)
) {

state.player
.defeatedBosses
.push(
enemy.id
);

}

if (
!state.player
.discoveredBosses
.includes(
enemy.id
)
) {

state.player
.discoveredBosses
.push(
enemy.id
);

}

if (
enemy.unlock &&
!state.player
.unlockedAreas
.includes(
enemy.unlock
)
) {

state.player
.unlockedAreas
.push(
enemy.unlock
);

}

showToast(
`Boss adicionado ao seu Livro: ${enemy.name}.`
);

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

}

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

spawnParticles(
player.x,
player.y,
"#ffe38f",
24
);

if (
player.level ===
5
) {

showToast(
`Nível ${player.level}! Sua habilidade R foi desbloqueada.`
);

}

else if (
player.level ===
10
) {

showToast(
`Nível ${player.level}! Sua habilidade F foi desbloqueada.`
);

}

else {

showToast(
`Você chegou ao nível ${player.level}!`
);

}

}

}

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
state.player
?.inventory
?.[id] ||
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

function harvestTree(
tree
) {

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
count /
4
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

function collectResource(
resource
) {

if (
!resource?.alive
) {
return;
}

const costs = {

carvao:
7,

ferro:
13,

ouro:
24,

rubi:
35,

cristal:
18

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
count /
4
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

function updateResources(
dt
) {

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
tree.respawn <=
0
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
resource.respawn <=
0
) {

resource.alive =
true;

}

}

for (
const food of
state.world.foods
) {

if (
food.alive
) {
continue;
}

food.respawn -=
dt;

if (
food.respawn <=
0
) {

food.alive =
true;

}

}

state.world.drops.forEach(
drop =>
drop.life -=
dt
);

state.world.drops =
state.world.drops.filter(
drop =>
drop.life >
0
);

}

function respawnTree(
tree
) {

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

tries <
60 &&

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

function beginHoldInteraction(
interaction
) {

if (
!interaction ||
![
"tree",
"resource"
].includes(
interaction.type
)
) {

return false;

}

const duration =

interaction.type ===
"tree"

? 2.15

: (
interaction.object.type ===
"rubi"

? 2.8

: 1.75
);

state.holdAction = {

type:
interaction.type,

object:
interaction.object,

elapsed:
0,

duration

};

must(
"holdProgressTitle"
).textContent =

interaction.type ===
"tree"

? "Cortando madeira..."

: `Coletando ${ITEMS[interaction.object.type]?.name || "recurso"}...`;

must(
"holdProgressFill"
).style.width =
"0%";

must(
"holdProgress"
).classList.remove(
"hidden"
);

return true;

}

function cancelHoldInteraction() {

state.holdAction =
null;

must(
"holdProgress"
).classList.add(
"hidden"
);

must(
"holdProgressFill"
).style.width =
"0%";

}

function updateHoldInteraction(
dt
) {

const hold =
state.holdAction;

if (
!hold
) {
return;
}

if (
!state.keys.has(
"e"
) ||
state.paused ||
!hold.object?.alive
) {

cancelHoldInteraction();

return;

}

const maxDistance =

hold.type ===
"tree"

? 78

: 76;

if (
distance(
state.player,
hold.object
) >
maxDistance
) {

cancelHoldInteraction();

return;

}

hold.elapsed +=
dt;

const percent =
clamp(

(
hold.elapsed /
hold.duration
) *
100,

0,
100

);

must(
"holdProgressFill"
).style.width =
`${percent}%`;

if (
hold.elapsed >=
hold.duration
) {

const interaction = {

type:
hold.type,

object:
hold.object

};

cancelHoldInteraction();

if (
interaction.type ===
"tree"
) {

harvestTree(
interaction.object
);

}

else {

collectResource(
interaction.object
);

}

}

}

function eatWorldFood(
food
) {

if (
!food ||
!food.alive
) {
return;
}

food.alive =
false;

food.respawn =
random(

food.respawnMin ||
85,

food.respawnMax ||
140

);

if (
food.type ===
"carrot"
) {

state.player.hunger =
Math.min(
100,
state.player.hunger +
24
);

state.player.hp =
Math.min(

state.player.maxHp,

state.player.hp +
3

);

showToast(
"Você comeu uma cenoura. +24 fome."
);

}

spawnParticles(
food.x,
food.y,
"#f3a34e",
10
);

}

function sleepAtHome() {

if (
!state.houseMode ||
state.currentHouse?.id !==
"home"
) {
return;
}

state.paused =
true;

must(
"transitionMessage"
).textContent =
"VOCÊ DESCANSA...";

must(
"transitionScreen"
).classList.remove(
"hidden"
);

setTimeout(
() => {

state.player.fatigue =
100;

state.player.energy =
state.player.maxEnergy;

state.player.magic =
state.player.maxMagic;

state.player.hp =
Math.min(

state.player.maxHp,

state.player.hp +

Math.round(

state.player.maxHp *
.28

)

);

state.player.hunger =
Math.max(
0,
state.player.hunger -
14
);

must(
"transitionScreen"
).classList.add(
"hidden"
);

state.paused =
false;

showToast(
"Você dormiu. Cansaço recuperado; dormir abriu o apetite."
);

},
950
);

}

function discoverSecret(
secret
) {

if (
!secret ||
secret.found ||
state.player.secretsFound.includes(
secret.id
)
) {
return;
}

secret.found =
true;

state.player.secretsFound.push(
secret.id
);

state.player.memory =
Math.min(
100,
state.player.memory +
3
);

state.player.xp +=
22;

checkLevelUp();

showToast(
`${secret.title}: ${secret.message}`
);

saveGame(
false
);

}

function startSkyTrial() {

const trial =
state.player.skyTrial;

if (
state.area !==
"sky"
) {
return;
}

if (
trial.complete
) {

showToast(
"As cinco hordas já foram vencidas."
);

return;

}

const livingHorde =
state.world.enemies.some(
enemy =>
enemy.horde &&
!enemy.dead
);

if (
livingHorde ||
trial.activeWave
) {

showToast(
"Derrote a horda atual primeiro."
);

return;

}

if (
!trial.started
) {

trial.started =
true;

trial.wave =
0;

}

spawnSkyWave(
trial.wave + 1
);

}

function spawnSkyWave(
wave
) {

const trial =
state.player.skyTrial;

if (
wave <
1 ||
wave >
5
) {
return;
}

trial.activeWave =
wave;

const amount =
3 +
wave *
2;

const centerX =
1710;

const centerY =
1100;

for (
let i = 0;
i < amount;
i++
) {

const angle =

(
Math.PI *
2 *
i
) /
amount;

const radius =
270 +
random(
-35,
55
);

addEnemy({

id:
`sky_horde_${wave}_${Date.now()}_${i}`,

x:
centerX +
Math.cos(
angle
) *
radius,

y:
centerY +
Math.sin(
angle
) *
radius,

name:

wave >=
4

? "SENTINELA CELESTE"

: "SERAFIM DA HORDA",

icon:

wave >=
4

? "⚔️"

: "🪽",

type:
"normal",

horde:
wave,

hp:
150 +
wave *
72,

maxHp:
150 +
wave *
72,

damage:
16 +
wave *
6,

speed:
78 +
wave *
5,

vision:
650,

attackRange:
76,

radius:
25 +
Math.floor(
wave /
3
),

color:

wave >=
4

? "#e5c77e"

: "#cbd7df",

drop:

wave ===
5

? "cristal"

: null,

dropAmount:
1,

special:

wave >=
5

? "crystalRain"

: wave >=
3

? "crystalShot"

: null

});

}

showToast(
`HORDA ${wave}/5 — sobreviva.`
);

}

function updateSkyTrial() {

if (
state.area !==
"sky" ||
!state.player
?.skyTrial
?.started ||
state.player
.skyTrial
.complete
) {
return;
}

const trial =
state.player.skyTrial;

if (
trial.activeWave >
0
) {

const living =
state.world.enemies.some(
enemy =>
enemy.horde ===
trial.activeWave &&
!enemy.dead
);

if (
living
) {
return;
}

trial.wave =
Math.max(
trial.wave,
trial.activeWave
);

trial.activeWave =
0;

saveGame(
false
);

if (
trial.wave >=
5
) {

trial.complete =
true;

showToast(
"As cinco hordas foram vencidas. O Guardião do Caminho surgiu!"
);

spawnPathGuardian();

saveGame(
false
);

return;

}

}

const now =
performance.now();

if (
state.hordeNextAt &&
now <
state.hordeNextAt
) {
return;
}

state.hordeNextAt =
now +
1800;

setTimeout(
() => {

if (
state.area ===
"sky" &&
state.player.skyTrial.started &&
!state.player.skyTrial.complete &&
state.player.skyTrial.activeWave ===
0
) {

spawnSkyWave(
state.player.skyTrial.wave +
1
);

}

},
1700
);

}

function spawnPathGuardian() {

if (

state.world.enemies.some(
enemy =>
enemy.id ===
"path_guardian" &&
!enemy.dead
) ||

hasDefeatedBoss(
"path_guardian"
)

) {
return;
}

addEnemy({

id:
"path_guardian",

x:
2860,

y:
1100,

name:
"GUARDIÃO DO CAMINHO",

icon:
"🪽",

type:
"progression",

hp:
1420,

maxHp:
1420,

damage:
54,

speed:
72,

vision:
430,

attackRange:
108,

radius:
43,

color:
"#d8bd76",

drop:
"flautaMemoria",

dropAmount:
1,

dropChance:
1,

special:
"crystalRain"

});

}

function useMemoryFlute() {

if (
state.area !==
"sky"
) {

showToast(
"A Flauta da Memória só responde no Céu."
);

return;

}

if (
!state.player.inventory.flautaMemoria
) {
return;
}

if (
state.player.flutePlayed
) {

showToast(
"A Escada do Inferno já foi revelada."
);

return;

}

state.player.flutePlayed =
true;

state.paused =
true;

must(
"transitionMessage"
).textContent =
"A MELODIA FAZ O CÉU LEMBRAR DA ESCADA...";

must(
"transitionScreen"
).classList.remove(
"hidden"
);

setTimeout(
() => {

must(
"transitionScreen"
).classList.add(
"hidden"
);

state.paused =
false;

showToast(
"A Escada do Inferno apareceu no extremo leste do Céu."
);

saveGame(
false
);

},
1200
);

}

function getInteraction() {

if (
!state.player
) {
return null;
}

if (
state.houseMode
) {

let best =
null;

let bestDistance =
Infinity;

const room =
getHouseRoom();

if (
state.currentHouse?.id ===
"home"
) {

const bed = {

x:
room.x +
123,

y:
room.y +
102

};

const d =
distance(
state.player,
bed
);

if (
d <=
92
) {

best = {

type:
"sleep",

object:
bed

};

bestDistance =
d;

}

}

for (
const npc of
getInteriorNPCs()
) {

const d =
distance(
state.player,
npc
);

if (
d <=
78 &&
d <
bestDistance
) {

best = {

type:
"npc",

object:
npc

};

bestDistance =
d;

}

}

return (

best ||

{
type:
"exitHouse",

object:
state.currentHouse
}

);

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
d <=
limit &&
d <
bestDistance
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
72
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
78
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
76
)
);

state.world.foods
.filter(
food =>
food.alive
)
.forEach(
food =>
test(
"food",
food,
70
)
);

state.world.secrets
.filter(
secret =>

!secret.found &&

!state.player
.secretsFound
.includes(
secret.id
)

)
.forEach(
secret =>
test(
"secret",
secret,
76
)
);

state.world.trials.forEach(
trial =>
test(
"trial",
trial,
92
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

115

)
);

for (
const building of
state.world.buildings
) {

const door = {

x:
building.x +
building.w /
2,

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
d <=
90 &&
d <
bestDistance
) {

best = {

type:
"house",

object:
building

};

bestDistance =
d;

}

}

return best;

}

function playerAction() {

if (
!state.player ||
state.paused
) {
return;
}

if (
state.dialogue
) {

advanceDialogue();

return;

}

const interaction =
getInteraction();

if (
!interaction
) {
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
"tree" ||
interaction.type ===
"resource"
) {

beginHoldInteraction(
interaction
);

return;

}

if (
interaction.type ===
"food"
) {

eatWorldFood(
interaction.object
);

return;

}

if (
interaction.type ===
"secret"
) {

discoverSecret(
interaction.object
);

return;

}

if (
interaction.type ===
"trial"
) {

if (
interaction.object.id ===
"sky_hordes"
) {

startSkyTrial();

}

return;

}

if (
interaction.type ===
"sleep"
) {

sleepAtHome();

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

return;

}

}

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
building.w /
2,

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
d <
90 &&
d <
best
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

state.paused =
true;

must(
"transitionMessage"
).textContent =
closest.name;

must(
"transitionScreen"
).classList.remove(
"hidden"
);

setTimeout(
() => {

state.houseReturn = {

x:
closest.x +
closest.w /
2,

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

must(
"transitionScreen"
).classList.add(
"hidden"
);

state.paused =
false;

showToast(
`Você entrou em ${closest.name}.`
);

},
360
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
x:
480,

y:
610
};

state.paused =
true;

must(
"transitionMessage"
).textContent =
"VILA DO CREPÚSCULO";

must(
"transitionScreen"
).classList.remove(
"hidden"
);

setTimeout(
() => {

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

must(
"transitionScreen"
).classList.add(
"hidden"
);

state.paused =
false;

updateCamera();

},
340
);

}

function startDialogue(
npc
) {

state.dialogue = {

npc,

lines:
npc.lines.slice(),

index:
0,

typing:
false,

charIndex:
0,

timer:
null

};

must(
"dialogueBox"
).classList.remove(
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

must(
"dialogueSpeaker"
).textContent =
dialogue.npc.name;

must(
"dialogueText"
).textContent =
"";

dialogue.timer =
setInterval(
() => {

dialogue.charIndex++;

must(
"dialogueText"
).textContent =
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

must(
"dialogueText"
).textContent =
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

must(
"dialogueBox"
).classList.add(
"hidden"
);

}

function openQuest(
npc
) {

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

must(
"questTitle"
).textContent =

isWood

? "Madeira para a Vila"

: "Carvão para a Forja";

must(
"questText"
).textContent =

isWood

? "Bran precisa de 10 madeiras para reforçar construções da vila."

: "Borin precisa de 8 carvões para manter a forja funcionando.";

must(
"questStatus"
).textContent =
`Progresso: ${Math.min(
current,
quest.need
)} / ${quest.need}`;

const button =
must(
"questActionBtn"
);

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

must(
"questPanel"
).classList.remove(
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

function openBattle(
enemy
) {

state.battle =
enemy;

state.paused =
true;

if (
enemy.type ===
"progression" &&
!state.player
.discoveredBosses
.includes(
enemy.id
)
) {

state.player
.discoveredBosses
.push(
enemy.id
);

}

must(
"battleIcon"
).textContent =
enemy.icon;

must(
"battleTitle"
).textContent =
enemy.name;

must(
"battleText"
).textContent =

enemy.special

? "Este Guardião possui ataques especiais. Observe os círculos vermelhos no chão e saia da área antes do impacto."

: "Esta criatura guarda o caminho. Ela só ficará agressiva se você aceitar o desafio.";

must(
"battlePanel"
).classList.remove(
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

must(
"battlePanel"
).classList.add(
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

must(
"battlePanel"
).classList.add(
"hidden"
);

}

function checkPortals() {

if (
!state.player ||
state.paused ||
state.houseMode ||
state.portalCooldown >
0
) {
return;
}

for (
const portal of
state.world.portals
) {

if (
typeof portal.visible ===
"function" &&
!portal.visible()
) {
continue;
}

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

if (
portal.stairs &&
!state.player.flutePlayed
) {

showToast(
"O Céu ainda não se lembra desta passagem."
);

}

else {

showToast(
"Este caminho ainda está bloqueado."
);

}

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

function openTravel(
portal
) {

if (
state.travel
) {
return;
}

state.travel =
portal;

state.paused =
true;

must(
"travelText"
).textContent =
`Você encontrou um caminho para ${portal.title}. Deseja continuar?`;

must(
"travelPanel"
).classList.remove(
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

must(
"travelPanel"
).classList.add(
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

must(
"travelPanel"
).classList.add(
"hidden"
);

}

function transitionTo(
target
) {

if (
!REGIONS[target]
) {
return;
}

state.paused =
true;

must(
"transitionMessage"
).textContent =
REGIONS[target].name;

must(
"transitionScreen"
).classList.remove(
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

area:
target,

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
!state.player
.unlockedAreas
.includes(
target
)
) {

state.player
.unlockedAreas
.push(
target
);

}

state.portalCooldown =
1.4;

state.paused =
false;

must(
"transitionScreen"
).classList.add(
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

function openInventory() {

if (
!state.player
) {
return;
}

updateInventory();

must(
"inventoryPanel"
).classList.remove(
"hidden"
);

}

function updateInventory() {

const grid =
must(
"inventoryGrid"
);

grid.innerHTML =
"";

Object
.entries(
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
amount <=
0
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

Object
.entries(
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

must(
"weightText"
).textContent =
`${weight}/100`;

updateEquipment();

}

function useItem(
id
) {

const item =
ITEMS[id];

if (
!item ||
!state.player
) {
return;
}

if (
id ===
"flautaMemoria"
) {

useMemoryFlute();

return;

}

if (
item.category ===
"food"
) {

if (
!removeItem(
id,
1
)
) {
return;
}

state.player.hunger =
Math.min(

100,

state.player.hunger +
(
item.hunger ||
0
)

);

state.player.hp =
Math.min(

state.player.maxHp,

state.player.hp +
(
item.heal ||
0
)

);

showToast(
`${item.name} consumido.`
);

}

else if (
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
must(
"equipmentGrid"
);

const weapon =

ITEMS[
state.player
.equipment.weapon
]?.name ||

"Nenhuma";

const armor =

ITEMS[
state.player
.equipment.armor
]?.name ||

"Nenhuma";

const tool =

ITEMS[
state.player
.equipment.tool
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

function openMap() {

if (
!state.player
) {
return;
}

drawLargeMap();

must(
"mapPanel"
).classList.remove(
"hidden"
);

}

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

const colors = {

village:
"#33483a",

forest:
"#263f2c",

grove:
"#213a2a",

mountains:
"#6f777a",

iron:
"#252a2d",

ruby:
"#3d2028",

shadow:
"#171b29",

fairy:
"#4b3a5d",

sky:
"#7197b5",

hell:
"#391b1c",

final:
"#17161b"

};

mapCtx.fillStyle =
colors[
state.area
] ||
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

mapCtx.globalAlpha =
.35;

state.world.decorations
.filter(
item =>
item.type ===
"pathStone"
)
.forEach(
item => {

mapCtx.fillStyle =
"#c0ad82";

mapCtx.beginPath();

mapCtx.arc(
item.x * sx,
item.y * sy,
2.2,
0,
Math.PI * 2
);

mapCtx.fill();

}
);

mapCtx.globalAlpha =
1;

mapCtx.fillStyle =
"#87664b";

state.world.buildings.forEach(
building => {

mapCtx.fillRect(

building.x *
sx,

building.y *
sy,

Math.max(
4,
building.w *
sx
),

Math.max(
4,
building.h *
sy
)

);

}
);

mapCtx.fillStyle =
"#456947";

state.world.trees
.filter(
tree =>
tree.alive
)
.forEach(
tree => {

mapCtx.fillRect(

tree.x *
sx -
1,

tree.y *
sy -
1,

3,
3

);

}
);

mapCtx.fillStyle =
"#e0bf70";

state.world.npcs.forEach(
npc => {

mapCtx.fillRect(

npc.x *
sx -
3,

npc.y *
sy -
3,

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

const isBoss =

enemy.type ===
"progression" ||

enemy.type ===
"final";

if (
isBoss &&
!state.player.discoveredBosses.includes(
enemy.id
) &&
!state.player.defeatedBosses.includes(
enemy.id
)
) {
return;
}

mapCtx.fillStyle =

isBoss

? "#ef554d"

: "#d38764";

mapCtx.beginPath();

mapCtx.arc(

enemy.x *
sx,

enemy.y *
sy,

isBoss
? 7
: 3.5,

0,

Math.PI *
2

);

mapCtx.fill();

}
);

state.world.portals.forEach(
portal => {

if (
typeof portal.visible ===
"function" &&
!portal.visible()
) {
return;
}

mapCtx.fillStyle =

portal.stairs

? "#f0d28a"

: "#65a9df";

mapCtx.fillRect(

portal.x *
sx,

portal.y *
sy,

Math.max(
4,
portal.w *
sx
),

Math.max(
4,
portal.h *
sy
)

);

}
);

mapCtx.fillStyle =
"#ffffff";

mapCtx.beginPath();

mapCtx.arc(

state.player.x *
sx,

state.player.y *
sy,

7,

0,

Math.PI *
2

);

mapCtx.fill();

mapCtx.fillStyle =
"rgba(8,12,15,.68)";

mapCtx.fillRect(
14,
14,
260,
38
);

mapCtx.fillStyle =
"#f5ddb0";

mapCtx.font =
"bold 17px Georgia";

mapCtx.textAlign =
"left";

mapCtx.fillText(
REGIONS[state.area].name,
27,
39
);

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

const colors = {

village:
"#263c2b",

forest:
"#1f3828",

grove:
"#1c3326",

mountains:
"#666e72",

iron:
"#20272a",

ruby:
"#3c2027",

shadow:
"#151a29",

fairy:
"#493a5b",

sky:
"#7399b8",

hell:
"#371a1b",

final:
"#17161b"

};

miniCtx.fillStyle =
colors[
state.area
] ||
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

building.x *
sx,

building.y *
sy,

building.w *
sx,

building.h *
sy

);

}
);

miniCtx.fillStyle =
"#e0bf70";

state.world.npcs.forEach(
npc => {

miniCtx.fillRect(

npc.x *
sx -
2,

npc.y *
sy -
2,

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

const isBoss =

enemy.type ===
"progression" ||

enemy.type ===
"final";

if (
isBoss &&
!state.player.discoveredBosses.includes(
enemy.id
)
) {
return;
}

miniCtx.fillStyle =

isBoss

? "#ef554d"

: "#d38764";

miniCtx.beginPath();

miniCtx.arc(

enemy.x *
sx,

enemy.y *
sy,

isBoss
? 4
: 2.3,

0,

Math.PI *
2

);

miniCtx.fill();

}
);

state.world.portals.forEach(
portal => {

if (
typeof portal.visible ===
"function" &&
!portal.visible()
) {
return;
}

miniCtx.fillStyle =

portal.stairs

? "#f0d28a"

: "#65a9df";

miniCtx.fillRect(

portal.x *
sx,

portal.y *
sy,

Math.max(
2,
portal.w *
sx
),

Math.max(
2,
portal.h *
sy
)

);

}
);

miniCtx.fillStyle =
"#ffffff";

miniCtx.beginPath();

miniCtx.arc(

state.player.x *
sx,

state.player.y *
sy,

4,

0,

Math.PI *
2

);

miniCtx.fill();

}

function openBook() {

if (
!state.player
) {
return;
}

renderBook();

must(
"bookPanel"
).classList.remove(
"hidden"
);

}

const BOSS_REGISTRY = [

{
id:
"forest_guardian",

name:
"GUARDIÃO DA ESTRADA",

icon:
"👺",

description:
"Antigo protetor da estrada da Vila do Crepúsculo. A Quietude apagou de sua memória quem deveria atravessar e quem deveria ser impedido.",

quote:
"Ele continuou guardando a passagem depois de esquecer o motivo."
},

{
id:
"grove_guardian",

name:
"GUARDIÃO DA FLORESTA",

icon:
"🌳",

description:
"Uma árvore ancestral que sentia cada passo na mata. Suas raízes foram contaminadas por lembranças quebradas e agora atacam tudo que se aproxima.",

quote:
"As raízes lembram o que as folhas esqueceram."
},

{
id:
"mountain_guardian",

name:
"GUARDIÃO DO BOSQUE",

icon:
"🌲",

description:
"Último espírito que separava o Bosque das Montanhas. Seu corpo cresceu ao redor de memórias de viajantes perdidos.",

quote:
"Cada galho carrega um nome que já não possui dono."
},

{
id:
"iron_guardian",

name:
"SENTINELA DAS MONTANHAS",

icon:
"🗿",

description:
"Uma sentinela de pedra moldada por um povo desaparecido. Atira rochas contra intrusos e ainda obedece a uma ordem cujo autor ninguém recorda.",

quote:
"A pedra não esqueceu a ordem. Esqueceu apenas quem a deu."
},

{
id:
"ruby_guardian",

name:
"GUARDIÃO DE FERRO",

icon:
"⚙️",

description:
"Máquina de mineração que aprendeu a defender os túneis quando os mineiros desapareceram. O metal em seu corpo vibra com magia antiga.",

quote:
"Quando o último martelo silenciou, ele continuou trabalhando."
},

{
id:
"shadow_guardian",

name:
"GUARDIÃO RUBI",

icon:
"🔴",

description:
"Uma criatura formada ao redor de um núcleo de rubi vivo. Seus cristais armazenam lembranças como reflexos vermelhos.",

quote:
"O cristal repete tudo — até aquilo que nunca aconteceu."
},

{
id:
"fairy_guardian",

name:
"GUARDIÃO SOMBRIO",

icon:
"🌑",

description:
"Sombra condensada de exploradores esquecidos. Não possui uma única identidade; fala com vozes de pessoas que não existem mais.",

quote:
"Nenhuma sombra nasce sem algo para bloquear a luz."
},

{
id:
"sky_guardian",

name:
"GUARDIÃ DOS FIOS",

icon:
"🧚",

description:
"Uma antiga fada que costurava memórias entre flores e pessoas. Ao se corromper, passou a cortar os fios que antes protegia.",

quote:
"Ela aprendeu tarde demais que lembrar também pode doer."
},

{
id:
"path_guardian",

name:
"GUARDIÃO DO CAMINHO",

icon:
"🪽",

description:
"O último vigilante antes do Inferno. Somente aparece depois das Cinco Hordas e carrega a Flauta da Memória.",

quote:
"A passagem não estava escondida. O mundo havia esquecido que ela existia."
},

{
id:
"final_gate_guardian",

name:
"GUARDIÃO SUPREMO DO INFERNO",

icon:
"👿",

description:
"Uma entidade moldada pela pressão de milhares de memórias destruídas. Protege a Câmara Final e domina ataques infernais em área.",

quote:
"Atrás dele, até o medo parece lembrar do seu nome."
},

{
id:
"other_self",

name:
"O OUTRO EU",

icon:
"☯",

description:
"Uma versão do protagonista de outro universo. Preservou memória demais e concluiu que a única forma de acabar com o sofrimento é apagar tudo.",

quote:
"Se nada for lembrado, nada poderá sofrer."
}

];

function renderBook() {

const book =
must(
"bossBook"
);

book.innerHTML =
"";

BOSS_REGISTRY.forEach(
boss => {

const defeated =

state.player.defeatedBosses.includes(
boss.id
) ||

(
boss.id ===
"other_self" &&
state.player.finalDefeated
);

const discovered =

defeated ||

state.player.discoveredBosses.includes(
boss.id
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
${boss.icon}
</div>

<strong>
${boss.name}
</strong>

<p>
${defeated ? "✓ DERROTADO" : "REGISTRO DESCOBERTO"}
</p>

<p class="boss-lore">
${boss.description}
</p>

<p class="boss-quote">
“${boss.quote}”
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
Encontre este Guardião para revelar seu registro.
</p>

`;

book.appendChild(
entry
);

}
);

const requiredBeforeHell = [

"forest_guardian",

"grove_guardian",

"mountain_guardian",

"iron_guardian",

"ruby_guardian",

"shadow_guardian",

"fairy_guardian",

"sky_guardian",

"path_guardian"

];

if (

requiredBeforeHell.every(
id =>
state.player.defeatedBosses.includes(
id
)
)

) {

const clue =
document.createElement(
"div"
);

clue.className =
"boss-entry";

clue.innerHTML = `

<div class="symbol">
🎶
</div>

<strong>
MEMÓRIA COMPLETA
</strong>

<p class="boss-lore">
A Flauta da Memória deve ser tocada no Céu.
Sua melodia faz o mundo lembrar da Escada do Inferno.
</p>

`;

book.appendChild(
clue
);

}

}

function openShop(
npc
) {

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

must(
"shopTitle"
).textContent =
`LOJA DE ${npc.name}`;

renderShop();

must(
"shopPanel"
).classList.remove(
"hidden"
);

}

function renderShop() {

const grid =
must(
"shopGrid"
);

grid.innerHTML =
"";

if (
state.shopMode ===
"buy"
) {

[
"pao",
"carneCaca",
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
amount <=
0 ||
!ITEMS[id] ||
ITEMS[id].unique
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

function showEnding(
message
) {

state.running =
false;

state.paused =
true;

saveGame(
false
);

must(
"transitionMessage"
).textContent =
message;

must(
"transitionScreen"
).classList.remove(
"hidden"
);

setTimeout(
() => {

must(
"transitionScreen"
).classList.add(
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

function updateVisualEffects(
dt
) {

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
Number.isFinite(
effect.life
)
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

function updateHUD() {

const player =
state.player;

if (
!player
) {
return;
}

must(
"hudAvatar"
).textContent =
player.icon;

must(
"hudClass"
).textContent =
player.className;

must(
"hudName"
).textContent =
player.name;

must(
"moneyText"
).textContent =
player.money;

must(
"levelText"
).textContent =
player.level;

must(
"xpText"
).textContent =
`${player.xp} / ${player.xpToNext}`;

must(
"hpText"
).textContent =
`${Math.ceil(player.hp)}/${player.maxHp}`;

must(
"magicText"
).textContent =
`${Math.ceil(player.magic)}/${Math.ceil(player.maxMagic)}`;

must(
"energyText"
).textContent =
`${Math.ceil(player.energy)}/${player.maxEnergy}`;

must(
"hungerText"
).textContent =
Math.ceil(
player.hunger
);

must(
"fatigueText"
).textContent =
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

function updateSkillHUD() {

if (
!state.player
) {
return;
}

const skills =
getCharacterSkills();

[
[
"q",
"skillQName",
"skillQCooldown"
],
[
"r",
"skillRName",
"skillRCooldown"
],
[
"f",
"skillFName",
"skillFCooldown"
]
]
.forEach(
(
[
key,
nameId,
cooldownId
]
) => {

const skill =
skills[key];

const slot =
document.querySelector(
`[data-skill-slot="${key}"]`
);

const cooldown =
state.player.skillCooldowns[key] ||
0;

must(
nameId
).textContent =
skill.name;

const locked =
state.player.level <
skill.level;

slot?.classList.toggle(
"locked",
locked
);

slot?.classList.toggle(
"cooldown",
!locked &&
cooldown >
0
);

if (
locked
) {

must(
cooldownId
).textContent =
`NÍVEL ${skill.level}`;

}

else if (
cooldown >
0
) {

must(
cooldownId
).textContent =
`${cooldown.toFixed(1)}s`;

}

else {

must(
cooldownId
).textContent =
"PRONTA";

}

}
);

}

function setBar(
id,
value,
max
) {

const percentage =

max >
0

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

must(
id
).style.width =
`${percentage}%`;

}

function updateInteractionHint() {

const hint =
must(
"interactionHint"
);

if (

!state.player ||

state.paused ||

state.dialogue ||

state.travel ||

state.battle ||

state.holdAction

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

must(
"interactionKey"
).textContent =
"Z";

must(
"interactionText"
).textContent =
"Entrar";

return;

}

if (
interaction.type ===
"exitHouse"
) {

must(
"interactionKey"
).textContent =
"Z";

must(
"interactionText"
).textContent =
"Sair";

return;

}

must(
"interactionKey"
).textContent =
"E";

const labels = {

npc:

interaction.object.merchant

? "Abrir loja"

: interaction.object.questId

? "Ver missão"

: "Conversar",

tree:
"Segure para cortar",

resource:
`Segure para coletar ${ITEMS[interaction.object.type]?.name || "recurso"}`,

food:

interaction.object.type ===
"carrot"

? "Comer cenoura"

: "Comer",

secret:
"Investigar",

trial:
"Iniciar próxima horda",

sleep:
"Dormir",

boss:

interaction.object.accepted

? "Boss em combate"

: "Aceitar batalha",

enemy:
"Inimigo — ataque com clique"

};

must(
"interactionText"
).textContent =

labels[
interaction.type
] ||

"Interagir";

}

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

updateSkillCooldowns(
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

updateHazards(
dt
);

updateHoldInteraction(
dt
);

updateSkyTrial();

updateVisualEffects(
dt
);

checkPortals();

updateCamera();

updateHUD();

updateSkillHUD();

if (

state.pointer.down &&

state.player.attackCooldown <=
0 &&

screens.game.classList.contains(
"active"
)

) {

performAttack({

x:
state.pointer.worldX,

y:
state.pointer.worldY

});

}

if (
!must(
"mapPanel"
).classList.contains(
"hidden"
)
) {

drawLargeMap();

}

}

function gameLoop(
timestamp
) {

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

0.05

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

drawDecorations();

drawBuildings();

drawTrees();

drawResources();

drawFoods();

drawSecrets();

drawObstacles();

drawPortals();

drawDrops();

drawHazards();

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

village:
"#536b4b",

forest:
"#3e6141",

grove:
"#34583a",

mountains:
"#92999b",

iron:
"#292e31",

ruby:
"#48252b",

shadow:
"#171d2e",

fairy:
"#56436b",

sky:
"#92b0c7",

hell:
"#45201f",

final:
"#18171b"

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
y <
state.world.height -
70;
y +=
tile
) {

for (
let x = 70;
x <
state.world.width -
70;
x +=
tile
) {

ctx.fillStyle =

(
(
x /
tile +
y /
tile
) %
2 ===
0
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
-0.1,
0,
Math.PI *
2
);

ctx.fill();

}

}

function drawPaths() {

if (
state.area ===
"village"
) {

ctx.fillStyle =
"#b79a68";

ctx.globalAlpha =
0.7;

ctx.fillRect(
70,
1080,
state.world.width -
140,
120
);

ctx.fillRect(
1540,
70,
120,
state.world.height -
140
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

return;

}

if (

state.area ===
"forest" ||

state.area ===
"grove"

) {

const baseY =

state.area ===
"forest"

? 1220

: 1120;

const divisor =

state.area ===
"forest"

? 320

: 270;

const amplitude =

state.area ===
"forest"

? 150

: 95;

ctx.lineCap =
"round";

ctx.lineJoin =
"round";

ctx.strokeStyle =

state.area ===
"forest"

? "rgba(112,102,75,.44)"

: "rgba(124,113,81,.40)";

ctx.lineWidth =
120;

ctx.beginPath();

for (
let x = 90;
x <=
state.world.width -
90;
x +=
35
) {

const y =

baseY +

Math.sin(
x /
divisor
) *

amplitude;

if (
x ===
90
) {

ctx.moveTo(
x,
y
);

}

else {

ctx.lineTo(
x,
y
);

}

}

ctx.stroke();

ctx.strokeStyle =
"rgba(205,188,145,.16)";

ctx.lineWidth =
2;

ctx.stroke();

}

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
]
.includes(
visual
)
) {

ctx.strokeStyle =
"rgba(30,75,38,.42)";

ctx.lineWidth =
2;

for (
let y = 100;
y <
state.world.height -
100;
y +=
75
) {

for (
let x = 100;
x <
state.world.width -
100;
x +=
75
) {

if (
(
x *
7 +
y *
3
) %
13 <
5
) {

ctx.beginPath();

ctx.moveTo(
x,
y +
5
);

ctx.lineTo(
x -
4,
y -
4
);

ctx.moveTo(
x,
y +
5
);

ctx.lineTo(
x +
5,
y -
5
);

ctx.stroke();

}

}

}

if (

visual ===
"forest" ||

visual ===
"grove"

) {

ctx.fillStyle =
"rgba(205,235,180,.13)";

for (
let i = 0;
i <
38;
i++
) {

const x =

(
i *
293 +
state.time *
13
) %

state.world.width;

const y =

(
i *
177 +

Math.sin(
state.time +
i
) *
18
) %

state.world.height;

ctx.beginPath();

ctx.arc(
x,
y,
2 +
(
i %
3
),
0,
Math.PI *
2
);

ctx.fill();

}

}

}

if (
visual ===
"mountains"
) {

ctx.strokeStyle =
"rgba(255,255,255,.28)";

ctx.lineWidth =
2;

for (
let i = 0;
i <
28;
i++
) {

const x =

(
i *
191 +
state.time *
65
) %

state.world.width;

const y =

(
i *
127 +
state.time *
16
) %

state.world.height;

ctx.beginPath();

ctx.moveTo(
x,
y
);

ctx.lineTo(
x +
48,
y -
9
);

ctx.stroke();

}

}

if (

visual ===
"iron" ||

visual ===
"ruby" ||

visual ===
"shadow"

) {

const color =

visual ===
"ruby"

? "rgba(255,65,85,.18)"

: visual ===
"iron"

? "rgba(190,200,210,.10)"

: "rgba(90,100,180,.10)";

ctx.fillStyle =
color;

for (
let i = 0;
i <
24;
i++
) {

const x =
(
i *
347
) %
state.world.width;

const y =
(
i *
229
) %
state.world.height;

const pulse =

3 +

Math.sin(
state.time *
2 +
i
) *
2;

ctx.beginPath();

ctx.arc(
x,
y,
5 +
pulse,
0,
Math.PI *
2
);

ctx.fill();

}

}

if (
visual ===
"sky"
) {

ctx.fillStyle =
"rgba(255,255,255,.28)";

for (
let i = 0;
i <
34;
i++
) {

const x =

(
i *
311 +
state.time *
(
8 +
i %
4
)
) %

state.world.width;

const y =

(
i *
171
) %

state.world.height;

ctx.beginPath();

ctx.ellipse(
x,
y,
42 +
(
i %
4
) *
14,
17 +
(
i %
3
) *
6,
0,
0,
Math.PI *
2
);

ctx.fill();

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
i <
32;
i++
) {

const x =
(
i *
421
) %
state.world.width;

const y =
(
i *
257
) %
state.world.height;

ctx.beginPath();

ctx.arc(
x,
y,
8 +
(
i %
5
),
0,
Math.PI *
2
);

ctx.fill();

}

}

}

function drawDecorations() {

for (
const decoration of
state.world.decorations
) {

const {
type,
x,
y
} =
decoration;

if (
type ===
"pathStone"
) {

const size =
decoration.size ||
22;

ctx.save();

ctx.translate(
x,
y
);

ctx.rotate(
decoration.angle ||
0
);

ctx.fillStyle =
"rgba(137,137,126,.78)";

ctx.beginPath();

ctx.ellipse(
0,
0,
size,
size *
0.55,
0,
0,
Math.PI *
2
);

ctx.fill();

ctx.restore();

}

else if (
type ===
"mushroom"
) {

ctx.fillStyle =

decoration.glow

? "rgba(143,220,255,.8)"

: "#d5c9a5";

ctx.fillRect(
x -
2,
y,
4,
7
);

ctx.fillStyle =

decoration.glow

? "#7bdcff"

: "#b5665e";

ctx.beginPath();

ctx.arc(
x,
y -
2,
6,
Math.PI,
Math.PI *
2
);

ctx.fill();

}

else if (
type ===
"bush"
) {

ctx.fillStyle =
"#365d3c";

for (
let i = 0;
i <
3;
i++
) {

ctx.beginPath();

ctx.arc(
x -
13 +
i *
13,
y,
14,
0,
Math.PI *
2
);

ctx.fill();

}

}

else if (
type ===
"fallenLog"
) {

ctx.strokeStyle =
"#6f4b31";

ctx.lineWidth =
14;

ctx.beginPath();

ctx.moveTo(
x -
28,
y +
5
);

ctx.lineTo(
x +
30,
y -
8
);

ctx.stroke();

}

else if (

type ===
"flower" ||

type ===
"flowerPot"

) {

ctx.fillStyle =

type ===
"flowerPot"

? "#9b6847"

: "#f09ac9";

ctx.beginPath();

ctx.arc(
x,
y,
type ===
"flowerPot"

? 7

: 4,
0,
Math.PI *
2
);

ctx.fill();

}

else if (
type ===
"ancientRoot"
) {

ctx.strokeStyle =
"#6d5036";

ctx.lineWidth =
7;

ctx.beginPath();

ctx.moveTo(
x -
35,
y
);

ctx.quadraticCurveTo(
x,
y -
28,
x +
36,
y +
4
);

ctx.stroke();

}

else if (
type ===
"snowDrift"
) {

ctx.fillStyle =
"rgba(245,248,250,.48)";

ctx.beginPath();

ctx.ellipse(
x,
y,
48,
16,
-0.12,
0,
Math.PI *
2
);

ctx.fill();

}

else if (
type ===
"windMark"
) {

ctx.strokeStyle =
"rgba(255,255,255,.22)";

ctx.lineWidth =
2;

ctx.beginPath();

ctx.moveTo(
x -
28,
y
);

ctx.lineTo(
x +
30,
y -
6
);

ctx.stroke();

}

else if (
type ===
"mineLantern"
) {

const glow =

0.45 +

Math.sin(
state.time *
4 +
x
) *
0.12;

ctx.fillStyle =
`rgba(255,187,94,${glow})`;

ctx.beginPath();

ctx.arc(
x,
y,
9,
0,
Math.PI *
2
);

ctx.fill();

ctx.strokeStyle =
"#574535";

ctx.strokeRect(
x -
7,
y -
11,
14,
22
);

}

else if (
type ===
"rail"
) {

ctx.strokeStyle =
"#4b4d4d";

ctx.lineWidth =
4;

ctx.beginPath();

ctx.moveTo(
x -
42,
y -
8
);

ctx.lineTo(
x +
42,
y -
8
);

ctx.moveTo(
x -
42,
y +
8
);

ctx.lineTo(
x +
42,
y +
8
);

ctx.stroke();

}

else if (
type ===
"stalagmite"
) {

ctx.fillStyle =
"#4e5557";

ctx.beginPath();

ctx.moveTo(
x -
10,
y +
14
);

ctx.lineTo(
x,
y -
26
);

ctx.lineTo(
x +
12,
y +
14
);

ctx.closePath();

ctx.fill();

}

else if (

type ===
"crystalPillar" ||

type ===
"crystalShard"

) {

const big =
type ===
"crystalPillar";

const h =
big
? 46
: 24;

const w =
big
? 17
: 9;

ctx.fillStyle =
`rgba(224,55,84,${
0.62 +
Math.sin(
state.time *
3 +
decoration.phase
) *
0.18
})`;

ctx.beginPath();

ctx.moveTo(
x,
y -
h
);

ctx.lineTo(
x +
w,
y
);

ctx.lineTo(
x,
y +
7
);

ctx.lineTo(
x -
w,
y
);

ctx.closePath();

ctx.fill();

}

else if (
type ===
"celestialPillar"
) {

ctx.fillStyle =
"rgba(245,238,211,.78)";

ctx.fillRect(
x -
14,
y -
42,
28,
84
);

ctx.fillStyle =
"#d4b762";

ctx.fillRect(
x -
20,
y -
48,
40,
8
);

ctx.fillRect(
x -
20,
y +
40,
40,
8
);

}

else if (
type ===
"cloud"
) {

ctx.fillStyle =
"rgba(255,255,255,.35)";

for (
let i = 0;
i <
3;
i++
) {

ctx.beginPath();

ctx.arc(
x -
18 +
i *
18,
y,
18 +
i *
3,
0,
Math.PI *
2
);

ctx.fill();

}

}

else if (
type ===
"trialAltar"
) {

ctx.fillStyle =
"#e2d294";

ctx.beginPath();

ctx.arc(
x,
y,
36,
0,
Math.PI *
2
);

ctx.fill();

ctx.fillStyle =
"#658cb7";

ctx.beginPath();

ctx.arc(
x,
y,
19,
0,
Math.PI *
2
);

ctx.fill();

}

else if (
type ===
"lavaPool"
) {

ctx.fillStyle =
`rgba(241,76,25,${
0.38 +
Math.sin(
state.time *
2 +
decoration.phase
) *
0.08
})`;

ctx.beginPath();

ctx.ellipse(
x,
y,
55,
30,
-0.2,
0,
Math.PI *
2
);

ctx.fill();

}

else if (
type ===
"emberVent"
) {

ctx.fillStyle =
"rgba(255,132,56,.55)";

for (
let i = 0;
i <
4;
i++
) {

ctx.beginPath();

ctx.arc(

x +
Math.sin(
state.time *
3 +
i
) *
10,

y -
(
(
state.time *
30 +
i *
13
) %
30
),

2 +
i %
2,

0,

Math.PI *
2

);

ctx.fill();

}

}

else if (
type ===
"hellSmoke"
) {

ctx.fillStyle =
"rgba(30,24,28,.28)";

for (
let i = 0;
i <
3;
i++
) {

ctx.beginPath();

ctx.arc(

x +
Math.sin(
state.time +
i
) *
12,

y -
i *
13,

13 +
i *
4,

0,

Math.PI *
2

);

ctx.fill();

}

}

else if (
type ===
"barrel"
) {

ctx.fillStyle =
"#765033";

ctx.fillRect(
x -
10,
y -
14,
20,
28
);

ctx.strokeStyle =
"#342820";

ctx.strokeRect(
x -
10,
y -
14,
20,
28
);

}

}

}

function drawFoods() {

for (
const food of
state.world.foods
) {

if (
!food.alive
) {
continue;
}

ctx.font =
"23px Arial";

ctx.textAlign =
"center";

ctx.fillText(

food.type ===
"carrot"

? "🥕"

: "🍖",

food.x,

food.y +
8

);

}

}

function drawSecrets() {

for (
const secret of
state.world.secrets
) {

if (

secret.found ||

state.player.secretsFound.includes(
secret.id
)

) {
continue;
}

const pulse =

0.55 +

Math.sin(
state.time *
3 +
secret.x
) *
0.2;

ctx.globalAlpha =
pulse;

ctx.font =
"25px Arial";

ctx.textAlign =
"center";

ctx.fillText(
secret.icon,
secret.x,
secret.y
);

ctx.globalAlpha =
1;

}

}

function drawHazards() {

for (
const hazard of
state.world.hazards
) {

const warning =
!hazard.triggered;

ctx.fillStyle =

warning

? "rgba(225,43,36,.16)"

: "rgba(255,107,49,.36)";

ctx.strokeStyle =

warning

? "rgba(255,64,52,.88)"

: "rgba(255,196,91,.95)";

ctx.lineWidth =

warning

? 3

: 5;

ctx.beginPath();

ctx.arc(
hazard.x,
hazard.y,
hazard.radius,
0,
Math.PI *
2
);

ctx.fill();

ctx.stroke();

if (
warning
) {

const progress =
clamp(

1 -
hazard.delay /
hazard.maxDelay,

0,

1

);

ctx.strokeStyle =
"#fff0b8";

ctx.lineWidth =
3;

ctx.beginPath();

ctx.arc(

hazard.x,

hazard.y,

hazard.radius -
7,

-Math.PI /
2,

-Math.PI /
2 +
Math.PI *
2 *
progress

);

ctx.stroke();

}

}

}

function drawBuildings() {

state.world.buildings.forEach(
building => {

ctx.fillStyle =
"rgba(0,0,0,.27)";

ctx.fillRect(
building.x +
13,
building.y +
16,
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
building.x +
3,
building.y +
3,
building.w -
6,
building.h -
6
);

ctx.fillStyle =
building.roof;

ctx.beginPath();

ctx.moveTo(
building.x -
24,
building.y
);

ctx.lineTo(
building.x +
building.w /
2,
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
building.w /
2 -
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
building.x +
35,
building.y +
60,
50,
42
);

ctx.fillRect(
building.x +
building.w -
85,
building.y +
60,
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
building.w /
2,
building.y +
building.h +
27
);

}
);

}

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
room.x -
24,
room.y -
24,
room.w +
48,
room.h +
48
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
room.y +
28;
y <
room.y +
room.h;
y +=
28
) {

ctx.beginPath();

ctx.moveTo(
room.x,
y
);

ctx.lineTo(
room.x +
room.w,
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

if (
id ===
"home"
) {

ctx.fillStyle =
"#4b3026";

ctx.fillRect(
room.x +
48,
room.y +
55,
150,
92
);

ctx.fillStyle =
"#d9c8a4";

ctx.fillRect(
room.x +
58,
room.y +
64,
130,
70
);

ctx.fillStyle =
"#783d36";

ctx.fillRect(
room.x +
room.w /
2 -
100,
room.y +
room.h /
2 -
55,
200,
110
);

ctx.fillStyle =
"#563824";

ctx.fillRect(
room.x +
room.w /
2 -
65,
room.y +
room.h /
2 -
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
room.y +
45,
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
Math.PI *
2
);

ctx.fill();

}

else if (
id ===
"elianHome"
) {

ctx.fillStyle =
"#49372f";

ctx.fillRect(
room.x +
45,
room.y +
55,
130,
82
);

ctx.fillStyle =
"#b9aa91";

ctx.fillRect(
room.x +
55,
room.y +
65,
110,
62
);

ctx.fillStyle =
"#4c3326";

ctx.fillRect(
room.x +
room.w -
160,
room.y +
45,
112,
155
);

ctx.fillStyle =
"#c0a36b";

for (
let i = 0;
i <
4;
i++
) {

ctx.fillRect(
room.x +
room.w -
150,
room.y +
64 +
i *
34,
92,
5
);

}

ctx.fillStyle =
"#5a402d";

ctx.fillRect(
room.x +
room.w /
2 -
85,
room.y +
room.h /
2 -
35,
170,
70
);

ctx.fillStyle =
"#eadcae";

ctx.fillRect(
room.x +
room.w /
2 -
34,
room.y +
room.h /
2 -
18,
68,
34
);

}

else if (
id ===
"forge"
) {

ctx.fillStyle =
"#2f2f31";

ctx.fillRect(
room.x +
48,
room.y +
50,
150,
145
);

ctx.fillStyle =
"#ff7846";

ctx.beginPath();

ctx.arc(
room.x +
123,
room.y +
135,
38,
0,
Math.PI *
2
);

ctx.fill();

ctx.fillStyle =
"#ffd06a";

ctx.beginPath();

ctx.arc(
room.x +
123,
room.y +
135,
19,
0,
Math.PI *
2
);

ctx.fill();

ctx.fillStyle =
"#24282c";

ctx.fillRect(
room.x +
room.w /
2 -
55,
room.y +
room.h /
2 -
16,
110,
32
);

ctx.fillRect(
room.x +
room.w /
2 -
18,
room.y +
room.h /
2 +
16,
36,
58
);

}

else if (
id ===
"shop"
) {

ctx.fillStyle =
"#4c3225";

ctx.fillRect(
room.x +
42,
room.y +
42,
150,
155
);

ctx.fillRect(
room.x +
room.w -
192,
room.y +
42,
150,
155
);

ctx.fillStyle =
"#caa463";

for (
let i = 0;
i <
4;
i++
) {

ctx.fillRect(
room.x +
52,
room.y +
62 +
i *
34,
130,
5
);

ctx.fillRect(
room.x +
room.w -
182,
room.y +
62 +
i *
34,
130,
5
);

}

ctx.fillStyle =
"#5f3d29";

ctx.fillRect(
room.x +
room.w *
0.47,
room.y +
room.h *
0.48,
room.w *
0.45,
62
);

ctx.strokeStyle =
theme.accent;

ctx.lineWidth =
3;

ctx.strokeRect(
room.x +
room.w *
0.47,
room.y +
room.h *
0.48,
room.w *
0.45,
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
]
.forEach(
(
icon,
index
) => {

ctx.fillText(
icon,
room.x +
75 +
(
index %
2
) *
72,
room.y +
90 +
Math.floor(
index /
2
) *
70
);

}
);

}

else if (
id ===
"woodshop"
) {

for (
let i = 0;
i <
4;
i++
) {

ctx.fillStyle =

i %
2

? "#6d472b"

: "#7c5130";

ctx.fillRect(
room.x +
50,
room.y +
55 +
i *
34,
165,
24
);

}

ctx.fillStyle =
"#5b3c27";

ctx.fillRect(
room.x +
room.w /
2 -
100,
room.y +
room.h /
2 -
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
room.w /
2,
room.y +
room.h /
2 +
14
);

ctx.fillStyle =
"#b07e4d";

for (
let i = 0;
i <
5;
i++
) {

ctx.fillRect(
room.x +
room.w -
185,
room.y +
65 +
i *
28,
135,
16
);

}

}

ctx.fillStyle =
"#3b241c";

ctx.fillRect(
room.x +
room.w /
2 -
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
room.w /
2,
room.y -
42
);

ctx.font =
"11px Arial";

ctx.fillText(
"[Z] SAIR",
room.x +
room.w /
2,
room.y +
room.h +
35
);

drawInteriorNPCs();

}

function drawInteriorNPCs() {

getInteriorNPCs()
.forEach(
npc => {

ctx.fillStyle =
"rgba(0,0,0,.25)";

ctx.beginPath();

ctx.ellipse(
npc.x,
npc.y +
20,
19,
7,
0,
0,
Math.PI *
2
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
Math.PI *
2
);

ctx.fill();

ctx.fillStyle =
"#29272a";

ctx.beginPath();

ctx.arc(
npc.x,
npc.y -
8,
9,
0,
Math.PI *
2
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
npc.y -
31
);

ctx.font =
"10px Arial";

ctx.fillStyle =
"#d1c5af";

ctx.fillText(
npc.role,
npc.x,
npc.y +
37
);

}
);

}

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
tree.y +
28,
34,
11,
0,
0,
Math.PI *
2
);

ctx.fill();

ctx.fillStyle =
"#684a30";

ctx.fillRect(
tree.x -
9,
tree.y,
18,
42
);

ctx.fillStyle =
"#305c36";

ctx.beginPath();

ctx.arc(
tree.x +
sway,
tree.y -
14,
34,
0,
Math.PI *
2
);

ctx.fill();

ctx.fillStyle =
"#447a45";

ctx.beginPath();

ctx.arc(
tree.x -
14 +
sway,
tree.y -
27,
24,
0,
Math.PI *
2
);

ctx.arc(
tree.x +
14 +
sway,
tree.y -
27,
25,
0,
Math.PI *
2
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
tree.y -
10,
40,
0,
Math.PI *
2
);

ctx.stroke();

}

}
);

}

function drawResources() {

state.world.resources.forEach(
resource => {

if (
!resource.alive
) {
return;
}

if (
resource.type ===
"ferro"
) {

ctx.fillStyle =
"#596267";

ctx.beginPath();

ctx.moveTo(
resource.x -
13,
resource.y +
8
);

ctx.lineTo(
resource.x -
7,
resource.y -
10
);

ctx.lineTo(
resource.x +
5,
resource.y -
14
);

ctx.lineTo(
resource.x +
14,
resource.y +
4
);

ctx.lineTo(
resource.x +
5,
resource.y +
13
);

ctx.closePath();

ctx.fill();

ctx.fillStyle =
"#aebbc1";

ctx.beginPath();

ctx.arc(
resource.x -
3,
resource.y -
3,
4,
0,
Math.PI *
2
);

ctx.arc(
resource.x +
6,
resource.y +
4,
3,
0,
Math.PI *
2
);

ctx.fill();

return;

}

const icons = {

rubi:
"♦",

cristal:
"💎",

ouro:
"🪙",

carvao:
"⬛"

};

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

resource.y +
7

);

}
);

}

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
obstacle.w /
2,
obstacle.y +
obstacle.h /
2,
obstacle.w /
2,
obstacle.h /
2,
0,
0,
Math.PI *
2
);

ctx.fill();

ctx.fillStyle =
"#5b98aa";

ctx.beginPath();

ctx.ellipse(
obstacle.x +
obstacle.w /
2,
obstacle.y +
obstacle.h /
2,
obstacle.w /
2 -
22,
obstacle.h /
2 -
22,
0,
0,
Math.PI *
2
);

ctx.fill();

return;

}

const colors = {

rock:
"#737771",

snowrock:
"#bec5c7",

iceRock:
"#a9cad9",

oreRock:
"#59636a",

ironrock:
"#666c6f",

rubyrock:
"#73384b",

rubyPillar:
"#8e2d48",

darkrock:
"#34364e",

basalt:
"#443437",

obsidian:
"#241f29"

};

ctx.fillStyle =

colors[
obstacle.type
] ||

"#737771";

ctx.beginPath();

ctx.ellipse(
obstacle.x +
obstacle.w /
2,
obstacle.y +
obstacle.h /
2,
obstacle.w /
2,
obstacle.h /
2,
-0.12,
0,
Math.PI *
2
);

ctx.fill();

if (

obstacle.type ===
"oreRock" ||

obstacle.type ===
"rubyPillar"

) {

ctx.strokeStyle =

obstacle.type ===
"rubyPillar"

? "#e15271"

: "#c5d1d4";

ctx.lineWidth =
3;

ctx.beginPath();

ctx.moveTo(
obstacle.x +
obstacle.w *
0.25,
obstacle.y +
obstacle.h *
0.7
);

ctx.lineTo(
obstacle.x +
obstacle.w *
0.5,
obstacle.y +
obstacle.h *
0.3
);

ctx.lineTo(
obstacle.x +
obstacle.w *
0.72,
obstacle.y +
obstacle.h *
0.58
);

ctx.stroke();

}

}
);

}

function drawNPCs() {

state.world.npcs.forEach(
npc => {

ctx.fillStyle =
"rgba(0,0,0,.23)";

ctx.beginPath();

ctx.ellipse(
npc.x,
npc.y +
19,
18,
7,
0,
0,
Math.PI *
2
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
Math.PI *
2
);

ctx.fill();

ctx.fillStyle =
"#28272b";

ctx.beginPath();

ctx.arc(
npc.x,
npc.y -
8,
9,
0,
Math.PI *
2
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
npc.y -
30
);

ctx.font =
"10px Arial";

ctx.fillStyle =
"#cac3b0";

ctx.fillText(
npc.role,
npc.x,
npc.y +
36
);

}
);

}

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
"rgba(220,60,55,.09)";

ctx.lineWidth =
2;

ctx.beginPath();

ctx.arc(
enemy.x,
enemy.y,
Math.min(
enemy.vision,
230
),
0,
Math.PI *
2
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
0.42,
0,
0,
Math.PI *
2
);

ctx.fill();

drawEnemyBody(
enemy
);

ctx.font =

enemy.type ===
"progression" ||

enemy.type ===
"final"

? "bold 11px Arial"

: "10px Arial";

ctx.textAlign =
"center";

ctx.fillStyle =

enemy.type ===
"progression" ||

enemy.type ===
"final"

? "#ffcc8a"

: "#ede2c2";

ctx.fillText(
`${enemy.name}  Nv.${enemy.level || 1}`,
enemy.x,
enemy.y +
enemy.radius +
18
);

const barWidth =
enemy.radius *
2.6;

ctx.fillStyle =
"#211f1d";

ctx.fillRect(
enemy.x -
barWidth /
2,
enemy.y -
enemy.radius -
14,
barWidth,
6
);

ctx.fillStyle =

enemy.type ===
"progression"

? "#d05049"

: "#b84e48";

ctx.fillRect(
enemy.x -
barWidth /
2,
enemy.y -
enemy.radius -
14,
barWidth *
clamp(
enemy.hp /
enemy.maxHp,
0,
1
),
6
);

}
);

}

function drawEnemyBody(
enemy
) {

const flash =

enemy.hitFlash >
0

? "#ffffff"

: enemy.color;

const isTree =

enemy.id ===
"grove_guardian" ||

enemy.id ===
"mountain_guardian";

if (
isTree
) {

ctx.fillStyle =

enemy.hitFlash >
0

? "#fff"

: "#6e4c31";

ctx.fillRect(
enemy.x -
10,
enemy.y -
5,
20,
enemy.radius +
26
);

ctx.fillStyle =
flash;

for (
let i = 0;
i <
5;
i++
) {

const angle =

-Math.PI /
2 +

i *
(
Math.PI *
2 /
5
);

ctx.beginPath();

ctx.arc(

enemy.x +
Math.cos(
angle
) *
22,

enemy.y -
12 +
Math.sin(
angle
) *
18,

enemy.radius *
0.62,

0,

Math.PI *
2

);

ctx.fill();

}

ctx.fillStyle =
"#ffc76d";

ctx.beginPath();

ctx.arc(
enemy.x -
7,
enemy.y -
10,
3,
0,
Math.PI *
2
);

ctx.arc(
enemy.x +
7,
enemy.y -
10,
3,
0,
Math.PI *
2
);

ctx.fill();

return;

}

const isStone =

enemy.id ===
"iron_guardian" ||

enemy.id ===
"ruby_guardian" ||

enemy.name.includes(
"MINEIRO"
);

if (
isStone
) {

ctx.fillStyle =
flash;

ctx.beginPath();

ctx.moveTo(
enemy.x,
enemy.y -
enemy.radius
);

ctx.lineTo(
enemy.x +
enemy.radius *
0.9,
enemy.y -
4
);

ctx.lineTo(
enemy.x +
enemy.radius *
0.65,
enemy.y +
enemy.radius
);

ctx.lineTo(
enemy.x -
enemy.radius *
0.65,
enemy.y +
enemy.radius
);

ctx.lineTo(
enemy.x -
enemy.radius *
0.9,
enemy.y -
4
);

ctx.closePath();

ctx.fill();

if (
enemy.name.includes(
"MINEIRO"
)
) {

ctx.font =
"22px Arial";

ctx.textAlign =
"center";

ctx.fillText(
"⛏️",
enemy.x,
enemy.y +
7
);

}

else {

ctx.fillStyle =

enemy.id ===
"ruby_guardian"

? "#ff7a8d"

: "#cfb577";

ctx.fillRect(
enemy.x -
4,
enemy.y -
5,
8,
10
);

}

return;

}

ctx.fillStyle =
flash;

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
Math.PI *
2
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

? "25px Arial"

: "19px Arial";

ctx.textAlign =
"center";

ctx.fillText(
enemy.icon,
enemy.x,
enemy.y +
7
);

}

function drawPortals() {

state.world.portals.forEach(
portal => {

if (

typeof portal.visible ===
"function" &&

!portal.visible()

) {
return;
}

const unlocked =

typeof portal.requirement ===
"function"

? portal.requirement()

: true;

if (
portal.stairs
) {

ctx.fillStyle =

unlocked

? "rgba(235,218,166,.80)"

: "rgba(90,90,90,.35)";

for (
let i = 0;
i <
8;
i++
) {

ctx.fillRect(

portal.x -
i *
7,

portal.y +
portal.h -
25 -
i *
22,

portal.w +
i *
14,

13

);

}

ctx.fillStyle =
"#fff0bd";

ctx.font =
"bold 13px Georgia";

ctx.textAlign =
"center";

ctx.fillText(
"ESCADA DO INFERNO",
portal.x +
portal.w /
2,
portal.y -
18
);

return;

}

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
portal.w /
2,

portal.y -
10

);

}
);

}

function drawDrops() {

state.world.drops.forEach(
drop => {

const item =
ITEMS[
drop.type
];

if (
!item
) {
return;
}

ctx.font =
"20px Arial";

ctx.textAlign =
"center";

ctx.fillText(
item.icon,
drop.x,
drop.y
);

}
);

}

function drawEffects() {

state.world.effects.forEach(
effect => {

const alpha =

Number.isFinite(
effect.maxLife
)

? clamp(
effect.life /
effect.maxLife,
0,
1
)

: 1;

if (
effect.type ===
"flower"
) {

ctx.fillStyle =
`rgba(236,187,255,${
0.4 +
(
Math.sin(
state.time *
2 +
effect.phase
) +
1
) *
0.16
})`;

ctx.beginPath();

ctx.arc(
effect.x,
effect.y,
4,
0,
Math.PI *
2
);

ctx.fill();

}

else if (
effect.type ===
"damageNumber"
) {

ctx.globalAlpha =
alpha;

ctx.fillStyle =
effect.color;

ctx.font =
"bold 16px Arial";

ctx.textAlign =
"center";

ctx.fillText(
effect.text,
effect.x,
effect.y -
(
1 -
alpha
) *
30
);

ctx.globalAlpha =
1;

}

else if (

effect.type ===
"playerSlash" ||

effect.type ===
"playerBolt"

) {

ctx.globalAlpha =
alpha;

ctx.strokeStyle =
effect.color;

ctx.lineWidth =

effect.type ===
"playerBolt"

? 5

: 7;

ctx.beginPath();

ctx.moveTo(
effect.x,
effect.y
);

ctx.lineTo(
effect.tx,
effect.ty
);

ctx.stroke();

ctx.globalAlpha =
1;

}

else if (

effect.type ===
"skillRing" ||

effect.type ===
"shockRing"

) {

ctx.globalAlpha =
alpha;

ctx.strokeStyle =
effect.color;

ctx.lineWidth =
5;

ctx.beginPath();

ctx.arc(
effect.x,
effect.y,
effect.radius *
(
1 +
(
1 -
alpha
) *
0.12
),
0,
Math.PI *
2
);

ctx.stroke();

ctx.globalAlpha =
1;

}

else if (
effect.type ===
"memoryStrike"
) {

ctx.globalAlpha =
alpha;

ctx.fillStyle =
effect.color;

ctx.beginPath();

ctx.arc(
effect.x,
effect.y,
18 +
(
1 -
alpha
) *
22,
0,
Math.PI *
2
);

ctx.fill();

ctx.globalAlpha =
1;

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
Math.PI *
2
);

ctx.fill();

}

}
);

}

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
2 ===
0

) {
return;
}

ctx.fillStyle =
"rgba(0,0,0,.28)";

ctx.beginPath();

ctx.ellipse(
player.x,
player.y +
20,
21,
8,
0,
0,
Math.PI *
2
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
Math.PI *
2
);

ctx.fill();

ctx.fillStyle =
"#e5c3a2";

ctx.beginPath();

ctx.arc(
player.x,
player.y -
12,
10,
0,
Math.PI *
2
);

ctx.fill();

ctx.fillStyle =
"#2d241f";

ctx.beginPath();

ctx.arc(
player.x,
player.y -
16,
10,
Math.PI,
Math.PI *
2
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
player.y -
40
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
0.8,
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

version:
15,

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
new Date()
.toISOString()

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
savedHouse.w /
2,

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

function repairLoadedPlayer(
character
) {

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
value >=
0

? Math.floor(
value
)

: 0;

}
);

player.equipment =

player.equipment ||

{

weapon:
null,

armor:
null,

tool:
"machado"

};

player.quest =
player.quest ||
{};

player.quest.wood =

player.quest.wood ||

{

state:
"none",

need:
10,

rewardXP:
100,

rewardMoney:
80

};

player.quest.coal =

player.quest.coal ||

{

state:
"none",

need:
8,

rewardXP:
130,

rewardMoney:
110

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

player.secretsFound =

Array.isArray(
player.secretsFound
)

? player.secretsFound

: [];

player.collected =
player.collected ||
{};

player.hellTypesDefeated =
player.hellTypesDefeated ||
{};

player.skyTrial =

player.skyTrial ||

{

started:
false,

wave:
0,

activeWave:
0,

complete:
false

};

player.skyTrial.activeWave =
0;

player.flutePlayed =
Boolean(
player.flutePlayed
);

player.skillCooldowns =

player.skillCooldowns ||

{

q:
0,

r:
0,

f:
0

};

for (
const key of
[
"q",
"r",
"f"
]
) {

player.skillCooldowns[key] =
0;

}

player.damageReduction =
0;

player.shieldTimer =
0;

player.stunTimer =
0;

player.checkpoint =

player.checkpoint ||

{

area:
"village",

x:
480,

y:
610

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

player.memory =
clamp(
Number(
player.memory
) ||
0,
0,
100
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

must(
"continueBtn"
).disabled =
!available;

must(
"continueHint"
).textContent =

available

? "Existe um jogo salvo neste navegador."

: "Nenhum jogo salvo encontrado.";

}

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

state.pointer.down =
false;

state.keys.clear();

cancelHoldInteraction();

closeAllPanels();

fadeToScreen(
"menu",
() => {

updateContinueButton();

}
);

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

must(
id
).classList.add(
"hidden"
);

}

}
);

}

function handleKeyDown(
event
) {

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
key ===
"e"
) {

event.preventDefault();

state.keys.add(
"e"
);

if (
!event.repeat
) {

playerAction();

}

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
"z"
) {

event.preventDefault();

handleZ();

return;

}

if (

[
"q",
"r",
"f"
]
.includes(
key
) &&

screens.game.classList.contains(
"active"
)

) {

event.preventDefault();

useSkill(
key
);

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
"3" &&
state.player
) {

event.preventDefault();

if (
state.player.inventory.carneCaca >
0
) {

useItem(
"carneCaca"
);

}

else {

useItem(
"pao"
);

}

return;

}

if (

key ===
"4" &&

state.player
?.inventory
?.flautaMemoria >
0

) {

event.preventDefault();

useMemoryFlute();

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
must(
id
)
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

function bindClick(
id,
handler
) {

must(
id
).addEventListener(
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

const fade =
must(
"uiFade"
);

fade.classList.add(
"active"
);

setTimeout(
() => {

if (
!loadGame()
) {

updateContinueButton();

}

requestAnimationFrame(
() =>
fade.classList.remove(
"active"
)
);

},
280
);

}
);

bindClick(
"howToBtn",
() =>
fadeToScreen(
"how"
)
);

bindClick(
"creditsBtn",
() =>
fadeToScreen(
"credits"
)
);

bindClick(
"closeHowBtn",
() =>
fadeToScreen(
"menu"
)
);

bindClick(
"closeCreditsBtn",
() =>
fadeToScreen(
"menu"
)
);

bindClick(
"backMenuBtn",
() =>
fadeToScreen(
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

must(
"playerName"
).addEventListener(
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
$(
target
)
) {

$(
target
).classList.add(
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
event => {

const key =
event.key.toLowerCase();

state.keys.delete(
key
);

if (
key ===
"e"
) {

cancelHoldInteraction();

}

}
);

window.addEventListener(
"blur",
() => {

state.keys.clear();

state.pointer.down =
false;

cancelHoldInteraction();

}
);

window.addEventListener(
"mouseup",
event => {

if (
event.button ===
0
) {

state.pointer.down =
false;

}

}
);

canvas.addEventListener(
"pointermove",
event => {

const rect =
canvas.getBoundingClientRect();

state.pointer.x =
event.clientX -
rect.left;

state.pointer.y =
event.clientY -
rect.top;

state.pointer.worldX =
state.pointer.x +
state.camera.x;

state.pointer.worldY =
state.pointer.y +
state.camera.y;

}
);

canvas.addEventListener(
"pointerdown",
event => {

if (
event.button !==
0
) {
return;
}

event.preventDefault();

const rect =
canvas.getBoundingClientRect();

state.pointer.x =
event.clientX -
rect.left;

state.pointer.y =
event.clientY -
rect.top;

state.pointer.worldX =
state.pointer.x +
state.camera.x;

state.pointer.worldY =
state.pointer.y +
state.camera.y;

state.pointer.down =
true;

performAttack({

x:
state.pointer.worldX,

y:
state.pointer.worldY

});

}
);

canvas.addEventListener(
"pointerup",
event => {

if (
event.button ===
0
) {

state.pointer.down =
false;

}

}
);

canvas.addEventListener(
"contextmenu",
event =>
event.preventDefault()
);

window.addEventListener(
"resize",
resizeCanvas
);

}

function initialize() {

createCharacterCards();

resizeCanvas();

bindEvents();

updateContinueButton();

}

initialize();

})();
