(() => {
"use strict";

/* =========================================================
   VEYRA — A QUIETUDE
   SCRIPT PRINCIPAL
   Versão pós-playtest
========================================================= */

const SAVE_KEY = "veyra_save_v16_playtest";

const $ = (id) => {
    return document.getElementById(id);
};

const must = (id) => {
    const element = $(id);

    if (!element) {
        throw new Error(
            `Elemento obrigatório não encontrado: #${id}`
        );
    }

    return element;
};

/* =========================================================
   CANVAS
========================================================= */

const canvas = must("gameCanvas");
const ctx = canvas.getContext("2d");

const miniCanvas = must("miniCanvas");
const miniCtx = miniCanvas.getContext("2d");

const mapCanvas = must("worldMapCanvas");
const mapCtx = mapCanvas.getContext("2d");

/* =========================================================
   TELAS
========================================================= */

const screens = {
    menu: must("menuScreen"),
    how: must("howScreen"),
    credits: must("creditsScreen"),
    character: must("characterScreen"),
    game: must("gameScreen")
};

/* =========================================================
   PERSONAGENS
========================================================= */

const CHARACTERS = [
    {
        id: "kaelion",
        name: "KAELION",
        className: "Mago",
        icon: "🧙",
        role: "Magia • Longo alcance",

        description:
            "Grande poder mágico, ataques à distância e controle de área.",

        story:
            "Estudioso de memórias antigas, Kaelion sente a magia desaparecer junto com as lembranças do mundo.",

        hp: 85,
        magic: 145,
        energy: 115,
        speed: 178,
        damage: 25,
        defense: 5,

        color: "#e49345",
        secondaryColor: "#ffd070",

        bg: "rgba(228,147,69,.16)",
        glow: "rgba(228,147,69,.30)",

        skill: "Bola de Memória"
    },

    {
        id: "theron",
        name: "THERON",
        className: "Cavaleiro",
        icon: "🛡️",
        role: "Espada • Defesa",

        description:
            "Muita defesa, excelente resistência e forte combate corpo a corpo.",

        story:
            "Theron jurou proteger a Vila do Crepúsculo enquanto ainda houver alguém capaz de lembrar seu nome.",

        hp: 145,
        magic: 75,
        energy: 120,
        speed: 145,
        damage: 30,
        defense: 21,

        color: "#bfc5ce",
        secondaryColor: "#eef3ff",

        bg: "rgba(191,197,206,.14)",
        glow: "rgba(191,197,206,.28)",

        skill: "Golpe Pesado"
    },

    {
        id: "grumgar",
        name: "GRUMGAR",
        className: "Troll",
        icon: "👹",
        role: "Força • Vida",

        description:
            "Vida extremamente alta, ataques pesados e grande força física.",

        story:
            "Grumgar deixou as cavernas para descobrir por que criaturas de sua espécie começaram a esquecer suas próprias tribos.",

        hp: 180,
        magic: 55,
        energy: 95,
        speed: 112,
        damage: 39,
        defense: 18,

        color: "#718f51",
        secondaryColor: "#bbd47d",

        bg: "rgba(113,143,81,.16)",
        glow: "rgba(113,143,81,.28)",

        skill: "Esmagamento"
    },

    {
        id: "lirael",
        name: "LIRAEL",
        className: "Fada",
        icon: "🧚",
        role: "Velocidade • Cura",

        description:
            "Muito rápida, poderosa com magia e capaz de restaurar a própria vida.",

        story:
            "Lirael percebeu que flores mágicas paravam de brilhar sempre que uma memória desaparecia.",

        hp: 95,
        magic: 135,
        energy: 135,
        speed: 210,
        damage: 20,
        defense: 7,

        color: "#dd8bd0",
        secondaryColor: "#ffd0f1",

        bg: "rgba(221,139,208,.16)",
        glow: "rgba(221,139,208,.30)",

        skill: "Flecha Feérica"
    },

    {
        id: "zephyr",
        name: "ZEPHYR",
        className: "Transmorfo",
        icon: "🦊",
        role: "Adaptação • Equilíbrio",

        description:
            "Equilibrado e capaz de mudar temporariamente seus atributos.",

        story:
            "Zephyr muda de forma para sobreviver, mas teme o dia em que esquecerá qual delas era sua verdadeira forma.",

        hp: 115,
        magic: 108,
        energy: 112,
        speed: 170,
        damage: 26,
        defense: 13,

        color: "#8f6bd8",
        secondaryColor: "#c7a8ff",

        bg: "rgba(143,107,216,.16)",
        glow: "rgba(143,107,216,.30)",

        skill: "Forma Adaptativa"
    }
];

/* =========================================================
   ITENS
========================================================= */

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
        hunger: 30,
        heal: 4
    },

    carneCaca: {
        name: "Carne de Caça",
        icon: "🍖",
        category: "food",
        weight: 1,
        value: 24,
        hunger: 44,
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

/* =========================================================
   REGIÕES
========================================================= */

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

/* =========================================================
   ORDEM DAS REGIÕES
========================================================= */

const REGION_ORDER = [
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

/* =========================================================
   ESTADO GLOBAL
========================================================= */

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

    finalChoiceShown: false,

    pointer: {
        x: 0,
        y: 0,
        worldX: 0,
        worldY: 0,
        down: false
    },

    holdAction: null,

    hordeNextAt: 0,

    screenFadeTimer: null,

    fountainDrops: [],

    ambientTimer: 0
};

/* =========================================================
   CRIAÇÃO DO MUNDO
========================================================= */

function createEmptyWorld(region) {
    return {
        width: region.width,
        height: region.height,

        obstacles: [],
        interiorObstacles: [],

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

/* =========================================================
   UTILIDADES
========================================================= */

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

function lerp(
    from,
    to,
    amount
) {
    return (
        from +
        (
            to -
            from
        ) *
        amount
    );
}

function random(
    min,
    max
) {
    return (
        Math.random() *
        (
            max -
            min
        ) +
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
        a.x -
        b.x,
        a.y -
        b.y
    );
}

function uid(prefix) {
    return (
        `${prefix}_` +
        Math.random()
            .toString(36)
            .slice(
                2,
                10
            )
    );
}

function normalizeVector(
    x,
    y
) {
    const length =
        Math.hypot(
            x,
            y
        ) || 1;

    return {
        x:
            x /
            length,

        y:
            y /
            length
    };
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

function getRegionIndex(
    regionId = state.area
) {
    return Math.max(
        0,
        REGION_ORDER.indexOf(
            regionId
        )
    );
}

function getPreviousRegion(
    regionId = state.area
) {
    const index =
        REGION_ORDER.indexOf(
            regionId
        );

    if (
        index <=
        0
    ) {
        return null;
    }

    return REGION_ORDER[
        index -
        1
    ];
}

function getNextRegion(
    regionId = state.area
) {
    const index =
        REGION_ORDER.indexOf(
            regionId
        );

    if (
        index <
        0 ||
        index >=
        REGION_ORDER.length -
        1
    ) {
        return null;
    }

    return REGION_ORDER[
        index +
        1
    ];
}

/* =========================================================
   TELAS
========================================================= */

function showScreen(name) {
    Object
        .values(
            screens
        )
        .forEach(
            screen =>
                screen
                    .classList
                    .remove(
                        "active"
                    )
        );

    screens[
        name
    ].classList.add(
        "active"
    );
}

function fadeToScreen(
    name,
    afterSwitch = null
) {
    const fade =
        must(
            "uiFade"
        );

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
                            () => {
                                fade.classList.remove(
                                    "active"
                                );
                            }
                        );
                    }
                );
            },
            320
        );
}

/* =========================================================
   MENSAGENS
========================================================= */

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

/* =========================================================
   CANVAS
========================================================= */

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

/* =========================================================
   SELEÇÃO DE PERSONAGEM
========================================================= */

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
                    index ===
                    0
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

            const stats = [
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
                                    character[
                                        key
                                    ] /
                                    maximums[
                                        key
                                    ]
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
                    ${character.className}
                    —
                    ${character.role}
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
                                item
                                    .classList
                                    .remove(
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

/* =========================================================
   NOVO JOGO
========================================================= */

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
                    index ===
                    0
                );
            }
        );

    fadeToScreen(
        "character",
        () => {
            setTimeout(
                () => {
                    must(
                        "playerName"
                    ).focus();
                },
                80
            );
        }
    );
}

/* =========================================================
   CRIAÇÃO DO PLAYER
========================================================= */

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

        secondaryColor:
            character.secondaryColor,

        x: 380,
        y: 260,

        radius: 18,

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

        secretsFound: [],

        skyTrial: {
            started: false,
            wave: 0,
            activeWave: 0,
            complete: false
        },

        flutePlayed: false,

        checkpoint: {
            area: "village",
            x: 480,
            y: 610
        },

        skillCooldowns: {
            q: 0,
            r: 0,
            f: 0
        },

        damageReduction: 0,

        shieldTimer: 0,

        stunTimer: 0,

        dead: false,

        invincible: 0,

        attackCooldown: 0,

        adaptiveBuff: false,

        finalChoice: null,

        finalDefeated: false,

        lastRegion:
            "village"
    };
}

/* =========================================================
   COMEÇAR O JOGO
========================================================= */

function startGame() {
    const input =
        must(
            "playerName"
        );

    const name =
        input
            .value
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
                home.w /
                2,

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
                "Você despertou em casa. A cama serve para descansar."
            );
        },
        700
    );

    requestAnimationFrame(
        gameLoop
    );
}

/* =========================================================
   RESET DO MUNDO
========================================================= */

function resetWorld() {
    state.world =
        createEmptyWorld(
            REGIONS[
                state.area
            ]
        );
}

/* =========================================================
   OBJETOS DO MUNDO
========================================================= */

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

function addInteriorObstacle(
    x,
    y,
    w,
    h,
    type,
    extra = {}
) {
    state.world
        .interiorObstacles
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

        alive: true,

        amount:
            randomInt(
                2,
                5
            ),

        respawn: 0
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
    state.world
        .foods
        .push({
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

    state.world
        .secrets
        .push({
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
    state.world
        .decorations
        .push({
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
    state.world
        .trials
        .push({
            id,
            x,
            y,

            radius: 38,

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
    state.world
        .hazards
        .push({
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
                0.32,

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

            radius: 17,

            name,
            role,
            color,
            lines,

            ...extra
        });
}

/* =========================================================
   INIMIGOS
========================================================= */

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

    const regionIndex =
        getRegionIndex();

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
            level -
            1
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
                        level -
                        1
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

        dashState:
            null,

        telegraphing:
            false,

        ...enemy,

        hp:
            scaledHp,

        maxHp:
            scaledHp,

        damage:
            scaledDamage
    };

    state.world
        .enemies
        .push(
            created
        );

    return created;
}

/* =========================================================
   PORTAIS
========================================================= */

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
    state.world
        .portals
        .push({
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

function addReturnPortal(
    target,
    title = null
) {
    if (
        !target ||
        !REGIONS[
            target
        ]
    ) {
        return;
    }

    addPortal(
        80,
        state.world.height /
        2 -
        110,
        70,
        220,

        target,

        () => true,

        title ||
        `VOLTAR PARA ${REGIONS[target].name}`,

        {
            returnPortal:
                true,

            entrySide:
                "right"
        }
    );
}

/* =========================================================
   LIMITES DO MAPA
========================================================= */

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

/* =========================================================
   CONSTRUIR REGIÃO
========================================================= */

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

    const builder =
        builders[
            state.area
        ];

    if (
        typeof builder !==
        "function"
    ) {
        throw new Error(
            `Construtor da região não encontrado: ${state.area}`
        );
    }

    builder();

    must(
        "locationLabel"
    ).textContent =
        REGIONS[
            state.area
        ].name;
}

/* =========================================================
   VILA DO CREPÚSCULO
========================================================= */

function buildVillage() {
    addBuilding(
        "home",
        260,
        270,
        430,
        270,
        "CASA DO AVENTUREIRO",
        "#70483a",
        "#ae835e"
    );

    addBuilding(
        "elianHome",
        835,
        255,
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
        2490,
        1310,
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

    /*
        Fonte reposicionada para ficar
        realmente central na praça.
    */

    addObstacle(
        1460,
        900,
        280,
        210,
        "fountain"
    );

    addDecoration(
        "fountainPillar",
        1600,
        995
    );

    addDecoration(
        "fountainWater",
        1600,
        995
    );

    /*
        Pedras decorativas.
    */

    [
        [960, 770],
        [1100, 730],
        [1220, 1810],
        [1860, 1640],
        [2210, 930],
        [2740, 880],
        [650, 1170],
        [2380, 1840]
    ]
        .forEach(
            ([x, y]) => {
                addObstacle(
                    x - 30,
                    y - 23,
                    60,
                    46,
                    "rock"
                );
            }
        );

    /*
        Árvores.
    */

    [
        [180, 180],
        [390, 180],
        [650, 170],
        [940, 150],
        [1320, 160],
        [1750, 160],
        [2150, 160],
        [2600, 170],
        [2950, 180],

        [150, 700],
        [180, 1050],
        [190, 1440],

        [250, 1960],
        [1050, 2010],
        [1500, 1980],
        [1950, 2020],
        [2400, 2030],
        [2850, 1960],

        [3040, 1710],
        [3020, 1200],
        [3010, 650],

        [1150, 1000],
        [1860, 720],
        [2180, 720]
    ]
        .forEach(
            (
                [x, y],
                index
            ) => {
                addTree(
                    x,
                    y,
                    `village_tree_${index}`
                );
            }
        );

    /*
        Elian fica do lado de fora.
    */

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

    /*
        Historiadora.
    */

    addNPC(
        1930,
        1090,
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

    /*
        DORAN FOI REMOVIDO DA RUA.

        Ele será criado somente pelo
        getInteriorNPCs() quando o jogador
        estiver dentro da loja.
    */

    /*
        Bran continua perto da carpintaria.
    */

    addNPC(
        1060,
        1430,
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

    /*
        Borin continua próximo da forja,
        mas não em cima de boss.
    */

    addNPC(
        2260,
        760,
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

    /*
        Inimigos comuns.
    */

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
            1,

        dropChance:
            0.55
    });

    addEnemy({
        id:
            "village_wolf",

        x:
            2180,

        y:
            1470,

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
            "couro",

        dropAmount:
            1,

        dropChance:
            0.65
    });

    addEnemy({
        id:
            "village_resource_boss",

        x:
            2310,

        y:
            1820,

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
            290,

        attackRange:
            75,

        radius:
            30,

        color:
            "#788762",

        drop:
            "carneCaca",

        dropAmount:
            3,

        dropChance:
            1,

        respawnTime:
            60,

        special:
            "natureBurst"
    });

    /*
        Boss principal da saída.
        Agora possui habilidade especial.
    */

    addEnemy({
        id:
            "forest_guardian",

        x:
            2830,

        y:
            1090,

        name:
            "GUARDIÃO DA ESTRADA",

        icon:
            "👺",

        type:
            "progression",

        hp:
            320,

        maxHp:
            320,

        damage:
            21,

        speed:
            63,

        vision:
            350,

        attackRange:
            82,

        radius:
            31,

        color:
            "#945149",

        drop:
            "cristal",

        dropAmount:
            2,

        dropChance:
            1,

        unlock:
            "forest",

        special:
            "memoryWave"
    });

    /*
        Portal para floresta.
    */

    addPortal(
        3060,
        1000,
        70,
        220,

        "forest",

        () =>
            hasDefeatedBoss(
                "forest_guardian"
            ),

        "FLORESTA",

        {
            entrySide:
                "left"
        }
    );

    /*
        Decoração da praça.
    */

    [
        [760, 1260],
        [840, 1315],
        [920, 1265],
        [1820, 1210],
        [1900, 1250],
        [2000, 1220]
    ]
        .forEach(
            (
                [x, y],
                index
            ) => {
                addDecoration(
                    index %
                    2
                        ? "flowerPot"
                        : "barrel",

                    x,
                    y
                );
            }
        );

    /*
        Comida rara na vila.

        A cenoura agora recupera menos fome.
    */

    addFood(
        1340,
        1450,
        "carrot",
        {
            hunger:
                12,

            respawnMin:
                110,

            respawnMax:
                170
        }
    );

    addFood(
        1425,
        1510,
        "carrot",
        {
            hunger:
                12,

            respawnMin:
                110,

            respawnMax:
                170
        }
    );
}

/* =========================================================
   FLORESTA
========================================================= */

function buildForest() {
    /*
        Portal de retorno.
    */

    addReturnPortal(
        "village",
        "VOLTAR PARA A VILA"
    );

    const pathY =
        x =>
            1220 +
            Math.sin(
                x /
                320
            ) *
            150;

    /*
        Caminho de pedra.
    */

    for (
        let x = 180;
        x <
        3280;
        x +=
        62
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
                -34,
                34
            ),
            {
                size:
                    random(
                        18,
                        33
                    ),

                angle:
                    random(
                        -0.65,
                        0.65
                    )
            }
        );

        if (
            Math.floor(
                x /
                62
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
                    110,
                    180
                ),
                {
                    glow:
                        Math.random() <
                        0.28
                }
            );
        }
    }

    /*
        Árvores mais densas ao redor
        do caminho.
    */

    let planted =
        0;

    let tries =
        0;

    while (
        planted <
        88 &&
        tries <
        1000
    ) {
        tries++;

        const x =
            randomInt(
                155,
                3270
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
            165
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

    /*
        Troncos, arbustos e decoração.
    */

    [
        [430, 680],
        [760, 1850],
        [1120, 520],
        [1510, 1930],
        [1900, 620],
        [2240, 1840],
        [2560, 720],
        [2860, 1650],
        [3070, 530],
        [1680, 430],
        [980, 1540],
        [2380, 1350]
    ]
        .forEach(
            (
                [x, y],
                index
            ) => {
                addDecoration(
                    index %
                    3 ===
                    0
                        ? "fallenLog"
                        : "bush",

                    x,
                    y
                );
            }
        );

    /*
        Cenouras mais raras.
    */

    [
        [620, 1120],
        [1040, 1335],
        [2050, 1350],
        [2920, 1260]
    ]
        .forEach(
            ([x, y]) => {
                addFood(
                    x,
                    y,
                    "carrot",
                    {
                        hunger:
                            12,

                        respawnMin:
                            130,

                        respawnMax:
                            190
                    }
                );
            }
        );

    /*
        Minérios.
    */

    [
        [650, 480, "carvao"],
        [1230, 1880, "carvao"],
        [1750, 540, "ferro"],
        [2170, 1830, "carvao"],
        [2710, 510, "ferro"],
        [3030, 1830, "carvao"],
        [1540, 1690, "ferro"],
        [2350, 440, "carvao"]
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

    /*
        Easter eggs.
    */

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

    /*
        NPC.
    */

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

    /*
        Javalis e lobos.
    */

    for (
        let i = 0;
        i <
        12;
        i++
    ) {
        const boar =
            i %
            2 ===
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
                    ? 0.82
                    : 0.65,

            special:
                i >=
                7
                    ? "dash"
                    : null
        });
    }

    /*
        Cervo raro.
    */

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

    /*
        Guardião da Floresta.
    */

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
            520,

        maxHp:
            520,

        damage:
            28,

        speed:
            62,

        vision:
            370,

        attackRange:
            92,

        radius:
            38,

        color:
            "#416d43",

        drop:
            "fragmentoMemoria",

        dropAmount:
            2,

        dropChance:
            1,

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

        "BOSQUE",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   BOSQUE
========================================================= */

function buildGrove() {
    addReturnPortal(
        "forest",
        "VOLTAR PARA A FLORESTA"
    );

    /*
        Caminho diferente da floresta:
        duas curvas que se encontram.
    */

    const pathY =
        x =>
            1110 +
            Math.sin(
                x /
                230
            ) *
            115 +
            Math.sin(
                x /
                83
            ) *
            22;

    for (
        let x = 170;
        x <
        3100;
        x +=
        58
    ) {
        addDecoration(
            "pathStone",
            x,
            pathY(
                x
            ) +
            random(
                -26,
                26
            ),
            {
                size:
                    random(
                        15,
                        29
                    ),

                moss:
                    true
            }
        );
    }

    /*
        Pequena bifurcação.
    */

    for (
        let i = 0;
        i <
        18;
        i++
    ) {
        addDecoration(
            "pathStone",

            1330 +
            i *
            42,

            1080 +
            i *
            29,

            {
                size:
                    random(
                        15,
                        24
                    ),

                moss:
                    true
            }
        );
    }

    let count =
        0;

    let guard =
        0;

    while (
        count <
        68 &&
        guard++ <
        900
    ) {
        const x =
            randomInt(
                140,
                3040
            );

        const y =
            randomInt(
                140,
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
            `grove_tree_${count}`
        );

        count++;
    }

    for (
        let i = 0;
        i <
        36;
        i++
    ) {
        addDecoration(
            i %
            5 ===
            0
                ? "ancientRoot"
                : i %
                  3 ===
                  0
                ? "glowingFlower"
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

    /*
        Pouca comida.
    */

    [
        [520, 920],
        [1380, 980],
        [2010, 1260]
    ]
        .forEach(
            ([x, y]) => {
                addFood(
                    x,
                    y,
                    "carrot",
                    {
                        hunger:
                            12,

                        respawnMin:
                            145,

                        respawnMax:
                            210
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

    addSecret(
        2460,
        410,

        "Árvore dos Nomes",

        "Centenas de nomes foram entalhados na casca. Alguns desaparecem enquanto você observa.",

        "🌳"
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
        i <
        10;
        i++
    ) {
        const deer =
            i %
            3 ===
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
                0.76,

            special:
                i >=
                6
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
            610,

        maxHp:
            610,

        damage:
            31,

        speed:
            61,

        vision:
            380,

        attackRange:
            94,

        radius:
            39,

        color:
            "#4f744f",

        drop:
            "fragmentoMemoria",

        dropAmount:
            2,

        dropChance:
            1,

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

        "MONTANHAS",

        {
            entrySide:
                "left"
        }
    );
}
   /* =========================================================
   MONTANHAS
========================================================= */

function buildMountains() {
    addReturnPortal(
        "grove",
        "VOLTAR PARA O BOSQUE"
    );

    /*
        Trilha principal das montanhas.
    */

    const mountainPathY =
        x =>
            1140 +
            Math.sin(
                x /
                360
            ) *
            105;

    for (
        let x = 180;
        x <
        3360;
        x +=
        72
    ) {
        addDecoration(
            "mountainPath",
            x,
            mountainPathY(
                x
            ) +
            random(
                -30,
                30
            ),
            {
                size:
                    random(
                        22,
                        38
                    ),

                angle:
                    random(
                        -0.5,
                        0.5
                    )
            }
        );
    }

    /*
        Rochas variadas.
    */

    for (
        let i = 0;
        i <
        54;
        i++
    ) {
        const type =
            i %
            8 ===
            0
                ? "iceRock"
                : i %
                  5 ===
                  0
                ? "oreRock"
                : i %
                  3 ===
                  0
                ? "darkMountainRock"
                : "snowrock";

        let x;
        let y;
        let attempts =
            0;

        do {
            x =
                randomInt(
                    170,
                    3320
                );

            y =
                randomInt(
                    150,
                    2130
                );

            attempts++;
        }
        while (
            Math.abs(
                y -
                mountainPathY(
                    x
                )
            ) <
                105 &&
            attempts <
                40
        );

        addObstacle(
            x,
            y,
            randomInt(
                48,
                108
            ),
            randomInt(
                36,
                78
            ),
            type
        );
    }

    /*
        Pequenas árvores resistentes
        das montanhas.
    */

    for (
        let i = 0;
        i <
        18;
        i++
    ) {
        addDecoration(
            "mountainPine",

            randomInt(
                250,
                3200
            ),

            randomInt(
                210,
                2040
            ),

            {
                scale:
                    random(
                        0.75,
                        1.2
                    )
            }
        );
    }

    /*
        Neve e vento.
    */

    for (
        let i = 0;
        i <
        42;
        i++
    ) {
        addDecoration(
            i %
            5 ===
            0
                ? "snowDrift"
                : "windMark",

            randomInt(
                150,
                3330
            ),

            randomInt(
                140,
                2150
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

    /*
        Minérios espalhados.
    */

    [
        [450, 430, "ferro"],
        [720, 1710, "ferro"],
        [1050, 650, "ouro"],
        [1450, 1780, "ferro"],
        [1860, 530, "ferro"],
        [2250, 1740, "ouro"],
        [2700, 610, "ferro"],
        [3060, 1640, "ferro"],
        [1600, 1110, "ouro"],
        [1180, 430, "ferro"],
        [2440, 420, "ouro"],
        [2890, 1940, "ferro"]
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

    /*
        Easter eggs.
    */

    addSecret(
        3050,
        370,

        "Espada Congelada",

        "Uma espada sem dono está presa no gelo. O nome no cabo foi raspado muitas vezes.",

        "🗡️"
    );

    addSecret(
        460,
        1920,

        "Pegadas Impossíveis",

        "As pegadas começam no meio da neve, seguem por alguns metros e simplesmente terminam.",

        "👣"
    );

    /*
        NPC montanhista.
    */

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

    /*
        Bestas e cervos.
    */

    for (
        let i = 0;
        i <
        12;
        i++
    ) {
        const deer =
            i %
            3 ===
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
                310,

            attackRange:
                deer
                    ? 70
                    : 90,

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

    /*
        Boss das montanhas.
    */

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
            760,

        maxHp:
            760,

        damage:
            37,

        speed:
            59,

        vision:
            410,

        attackRange:
            105,

        radius:
            41,

        color:
            "#697176",

        drop:
            "fragmentoMemoria",

        dropAmount:
            3,

        dropChance:
            1,

        unlock:
            "iron",

        special:
            "rockStorm"
    });

    /*
        Próxima região.
    */

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

        "CAVERNA DE FERRO",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   CAVERNA DE FERRO
========================================================= */

function buildIron() {
    addReturnPortal(
        "mountains",
        "VOLTAR PARA AS MONTANHAS"
    );

    /*
        Estrada de mineração.
    */

    for (
        let x = 180;
        x <
        2760;
        x +=
        78
    ) {
        addDecoration(
            "rail",
            x,
            960 +
            Math.sin(
                x /
                280
            ) *
            90,
            {
                angle:
                    Math.sin(
                        x /
                        420
                    ) *
                    0.1
            }
        );
    }

    /*
        Rochas e paredes.
    */

    for (
        let i = 0;
        i <
        40;
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
                95
            ),

            randomInt(
                38,
                70
            ),

            i %
            5 ===
            0
                ? "oreRock"
                : "ironrock"
        );
    }

    /*
        Minério abundante.
    */

    for (
        let i = 0;
        i <
        34;
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

            i %
            8 ===
            0
                ? "ouro"
                : "ferro"
        );
    }

    /*
        Decoração da mina.
    */

    for (
        let i = 0;
        i <
        34;
        i++
    ) {
        const type =
            i %
            7 ===
            0
                ? "mineCart"
                : i %
                  5 ===
                  0
                ? "mineLantern"
                : i %
                  3 ===
                  0
                ? "woodSupport"
                : "stalagmite";

        addDecoration(
            type,

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

    addSecret(
        2290,
        340,

        "A Parede que Sussurra",

        "Por alguns segundos você ouve seu próprio nome vindo de dentro da pedra.",

        "👂"
    );

    /*
        Mineiros corrompidos.
    */

    for (
        let i = 0;
        i <
        11;
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
                290,

            attackRange:
                78,

            radius:
                25,

            color:
                "#626a6d",

            drop:
                i %
                4 ===
                0
                    ? "ouro"
                    : "ferro",

            dropAmount:
                1,

            dropChance:
                0.64,

            special:
                i >=
                5
                    ? "oreBurst"
                    : null
        });
    }

    /*
        Guardião de Ferro.
    */

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
            860,

        maxHp:
            860,

        damage:
            41,

        speed:
            58,

        vision:
            420,

        attackRange:
            106,

        radius:
            42,

        color:
            "#70787d",

        drop:
            "fragmentoMemoria",

        dropAmount:
            3,

        dropChance:
            1,

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

        "CAVERNA DE RUBI",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   CAVERNA DE RUBI
========================================================= */

function buildRuby() {
    addReturnPortal(
        "iron",
        "VOLTAR PARA A CAVERNA DE FERRO"
    );

    /*
        Cristais gigantes.
    */

    for (
        let i = 0;
        i <
        42;
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
                76
            ),

            i %
            4 ===
            0
                ? "rubyPillar"
                : "rubyrock"
        );
    }

    /*
        Recursos.
    */

    for (
        let i = 0;
        i <
        38;
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

            i %
            8 ===
            0
                ? "ouro"
                : "rubi"
        );
    }

    /*
        Fragmentos luminosos.
    */

    for (
        let i = 0;
        i <
        46;
        i++
    ) {
        addDecoration(
            i %
            4 ===
            0
                ? "crystalPillar"
                : i %
                  3 ===
                  0
                ? "crystalCluster"
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

    addSecret(
        580,
        1760,

        "Reflexo Incorreto",

        "Seu reflexo em um rubi se move um instante antes de você.",

        "♦"
    );

    /*
        Criaturas rubi.
    */

    for (
        let i = 0;
        i <
        12;
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
                305,

            attackRange:
                84,

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
                i >=
                4
                    ? "crystalShot"
                    : null
        });
    }

    /*
        Guardião Rubi.
    */

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
            990,

        maxHp:
            990,

        damage:
            46,

        speed:
            62,

        vision:
            430,

        attackRange:
            110,

        radius:
            43,

        color:
            "#a33b4f",

        drop:
            "fragmentoMemoria",

        dropAmount:
            3,

        dropChance:
            1,

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

        "CAVERNA SOMBRIA",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   CAVERNA SOMBRIA
========================================================= */

function buildShadow() {
    addReturnPortal(
        "ruby",
        "VOLTAR PARA A CAVERNA DE RUBI"
    );

    /*
        Rochas escuras.
    */

    for (
        let i = 0;
        i <
        34;
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

            randomInt(
                52,
                92
            ),

            randomInt(
                38,
                68
            ),

            "darkrock"
        );
    }

    /*
        Névoa e olhos distantes.
    */

    for (
        let i = 0;
        i <
        34;
        i++
    ) {
        addDecoration(
            i %
            7 ===
            0
                ? "shadowEye"
                : "shadowMist",

            randomInt(
                170,
                2830
            ),

            randomInt(
                150,
                1880
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
        510,
        410,

        "A Voz sem Corpo",

        "Algo atrás de você sussurra uma frase que sua mãe diria, mas ao virar não existe ninguém.",

        "👁️"
    );

    addSecret(
        2500,
        1690,

        "Porta que Não Existe",

        "Há marcas de dobradiças na parede, embora nenhuma porta tenha sido construída ali.",

        "🚪"
    );

    for (
        let i = 0;
        i <
        11;
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
                310,

            attackRange:
                75,

            radius:
                25,

            color:
                "#49425f",

            drop:
                "essencia",

            dropAmount:
                1,

            dropChance:
                0.68,

            special:
                i >=
                5
                    ? "shadowBurst"
                    : null
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
            1030,

        maxHp:
            1030,

        damage:
            44,

        speed:
            66,

        vision:
            420,

        attackRange:
            100,

        radius:
            38,

        color:
            "#42364f",

        drop:
            "essencia",

        dropAmount:
            3,

        dropChance:
            1,

        unlock:
            "fairy",

        special:
            "voidCircle"
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

        "REINO DAS FADAS",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   REINO DAS FADAS
========================================================= */

function buildFairy() {
    addReturnPortal(
        "shadow",
        "VOLTAR PARA A CAVERNA SOMBRIA"
    );

    /*
        Caminhos luminosos.
    */

    for (
        let x = 170;
        x <
        3060;
        x +=
        68
    ) {
        addDecoration(
            "fairyPath",
            x,
            1120 +
            Math.sin(
                x /
                300
            ) *
            135,
            {
                phase:
                    x /
                    100
            }
        );
    }

    /*
        Flores e cristais.
    */

    for (
        let i = 0;
        i <
        36;
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
        i <
        52;
        i++
    ) {
        addDecoration(
            i %
            5 ===
            0
                ? "fairyTree"
                : i %
                  3 ===
                  0
                ? "glowingFlower"
                : "fairyFlower",

            randomInt(
                150,
                3050
            ),

            randomInt(
                150,
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

    /*
        Partículas ambientais.
    */

    for (
        let i = 0;
        i <
        30;
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

    addSecret(
        420,
        1830,

        "Flor que Diz seu Nome",

        "Quando você toca as pétalas, a flor pronuncia seu nome com uma voz que parece ser a sua.",

        "🌸"
    );

    addSecret(
        2820,
        380,

        "Pequena Casa Vazia",

        "Uma casa minúscula possui uma cama arrumada e uma refeição ainda quente. Ninguém aparece.",

        "🏠"
    );

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

    for (
        let i = 0;
        i <
        9;
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
                320,

            attackRange:
                78,

            radius:
                24,

            color:
                "#b887be",

            drop:
                "cristal",

            dropAmount:
                1,

            dropChance:
                0.7,

            special:
                i >=
                4
                    ? "fairyBurst"
                    : null
        });
    }

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
            1160,

        maxHp:
            1160,

        damage:
            47,

        speed:
            73,

        vision:
            440,

        attackRange:
            102,

        radius:
            39,

        color:
            "#cb8dd0",

        drop:
            "essencia",

        dropAmount:
            4,

        dropChance:
            1,

        unlock:
            "sky",

        special:
            "fairyStorm"
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

        "PASSAGEM CELESTE",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   CÉU
========================================================= */

function buildSky() {
    addReturnPortal(
        "fairy",
        "VOLTAR PARA O REINO DAS FADAS"
    );

    /*
        Nuvens, ruínas e pilares.
    */

    for (
        let i = 0;
        i <
        44;
        i++
    ) {
        addDecoration(
            i %
            6 ===
            0
                ? "celestialPillar"
                : i %
                  4 ===
                  0
                ? "skyRuin"
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

    /*
        Caminho celestial até o altar.
    */

    for (
        let x = 180;
        x <
        3150;
        x +=
        82
    ) {
        addDecoration(
            "skyPath",

            x,

            1110 +
            Math.sin(
                x /
                340
            ) *
            80,

            {
                phase:
                    x /
                    180
            }
        );
    }

    for (
        let i = 0;
        i <
        20;
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

    /*
        Patrulhas.
    */

    for (
        let i = 0;
        i <
        7;
        i++
    ) {
        addEnemy({
            id:
                `sky_patrol_${i}`,

            x:
                450 +
                i *
                390,

            y:
                i %
                2
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
                345,

            attackRange:
                84,

            radius:
                27,

            color:
                "#d3dde3",

            drop:
                "cristal",

            dropAmount:
                1,

            dropChance:
                0.63,

            special:
                i >=
                3
                    ? "crystalShot"
                    : null
        });
    }

    /*
        Altar das hordas.
    */

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

    /*
        Escada do Inferno.

        Só aparece depois da Flauta.
    */

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
                state.player
                    .flutePlayed
            ),

        "ESCADA DO INFERNO",

        {
            stairs:
                true,

            entrySide:
                "left",

            visible:
                () =>
                    Boolean(
                        state.player
                            .flutePlayed
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

    addSecret(
        2770,
        1840,

        "Sino sem Som",

        "O sino se move com o vento, mas não produz nenhum som. Mesmo assim, você tem certeza de ter ouvido algo.",

        "🔔"
    );
}

/* =========================================================
   INFERNO
========================================================= */

function buildHell() {
    addReturnPortal(
        "sky",
        "SUBIR DE VOLTA AO CÉU"
    );

    /*
        Rochas e formações infernais.
    */

    for (
        let i = 0;
        i <
        48;
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
                110
            ),

            randomInt(
                40,
                82
            ),

            i %
            5 ===
            0
                ? "obsidian"
                : "basalt"
        );
    }

    /*
        Lagos de lava, fumaça, caveiras etc.
    */

    for (
        let i = 0;
        i <
        50;
        i++
    ) {
        const type =
            i %
            8 ===
            0
                ? "hellBones"
                : i %
                  6 ===
                  0
                ? "lavaPool"
                : i %
                  4 ===
                  0
                ? "hellSmoke"
                : "emberVent";

        addDecoration(
            type,

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

    /*
        Caminho de pedra negra.
    */

    for (
        let x = 190;
        x <
        3420;
        x +=
        75
    ) {
        addDecoration(
            "hellPath",

            x,

            1190 +
            Math.sin(
                x /
                260
            ) *
            125,

            {
                size:
                    random(
                        22,
                        36
                    )
            }
        );
    }

    addSecret(
        450,
        2050,

        "Nome Gravado na Cinza",

        `Entre milhares de nomes está escrito "${state.player.name}". A inscrição parece muito mais antiga que você.`,

        "🔥"
    );

    addSecret(
        3030,
        390,

        "Trono Vazio",

        "Um trono destruído possui marcas de garras em ambos os braços. Alguma coisa esteve sentada aqui por muito tempo.",

        "👑"
    );

    /*
        Cinco tipos obrigatórios de criaturas.
    */

    const types = [
        {
            name:
                "DEMÔNIO DE CINZA",

            icon:
                "🔥",

            color:
                "#8c4d3f",

            drop:
                "essencia",

            special:
                "fireCircle"
        },

        {
            name:
                "CÃO DE LAVA",

            icon:
                "🐕",

            color:
                "#984b31",

            drop:
                "couro",

            special:
                "dash"
        },

        {
            name:
                "ESPECTRO CARMESIM",

            icon:
                "👻",

            color:
                "#724056",

            drop:
                "essencia",

            special:
                "shadowBurst"
        },

        {
            name:
                "GÁRGULA QUEBRADA",

            icon:
                "🗿",

            color:
                "#70554a",

            drop:
                "ouro",

            special:
                "rockThrow"
        },

        {
            name:
                "PARASITA DO VAZIO",

            icon:
                "🕷️",

            color:
                "#4b3551",

            drop:
                "essencia",

            special:
                "voidCircle"
        }
    ];

    types.forEach(
        (
            info,
            typeIndex
        ) => {
            for (
                let i = 0;
                i <
                4;
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

                    name:
                        info.name,

                    icon:
                        info.icon,

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
                        380,

                    attackRange:
                        88,

                    radius:
                        28,

                    color:
                        info.color,

                    drop:
                        info.drop,

                    dropAmount:
                        1,

                    dropChance:
                        0.73,

                    special:
                        info.special
                });
            }
        }
    );

    /*
        Guardião Supremo.
    */

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
            1850,

        maxHp:
            1850,

        damage:
            64,

        speed:
            78,

        vision:
            500,

        attackRange:
            120,

        radius:
            46,

        color:
            "#a64139",

        drop:
            "fragmentoMemoria",

        dropAmount:
            6,

        dropChance:
            1,

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

        "CÂMARA FINAL",

        {
            entrySide:
                "left"
        }
    );
}

/* =========================================================
   CÂMARA FINAL
========================================================= */

function buildFinal() {
    addReturnPortal(
        "hell",
        "VOLTAR PARA O INFERNO"
    );

    /*
        Arena.
    */

    for (
        let i = 0;
        i <
        12;
        i++
    ) {
        const angle =
            (
                Math.PI *
                2 *
                i
            ) /
            12;

        addDecoration(
            "finalPillar",

            1100 +
            Math.cos(
                angle
            ) *
            580,

            750 +
            Math.sin(
                angle
            ) *
            450,

            {
                phase:
                    angle
            }
        );
    }

    for (
        let i = 0;
        i <
        28;
        i++
    ) {
        addDecoration(
            "memoryShard",

            randomInt(
                220,
                2000
            ),

            randomInt(
                180,
                1320
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
            10,

        dropChance:
            1,

        special:
            "finalMemoryStorm"
    });
}

/* =========================================================
   BOSS DERROTADO
========================================================= */

function hasDefeatedBoss(id) {
    return Boolean(
        state.player
            ?.defeatedBosses
            ?.includes(
                id
            )
    );
}

/* =========================================================
   COLISÃO CÍRCULO / RETÂNGULO
========================================================= */

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

/* =========================================================
   TAMANHO DO INTERIOR
========================================================= */

function getHouseRoom() {
    const building =
        state.currentHouse;

    const w =
        clamp(
            (
                building
                    ?.w ||
                430
            ) +
            150,
            560,
            760
        );

    const h =
        clamp(
            (
                building
                    ?.h ||
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

/* =========================================================
   TEMAS DOS INTERIORES
========================================================= */

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

/* =========================================================
   NPCS INTERNOS
========================================================= */

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
                0.72,

            dy:
                0.40,

            lines: [
                "Esta casa parece menor a cada semana. Talvez seja só impressão.",

                "Algumas coisas aqui pertenciam à minha família. O problema é que já não lembro a quem.",

                "Se a Quietude continuar avançando, até estas paredes podem esquecer que são uma casa."
            ]
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
                0.72,

            dy:
                0.44,

            lines: [
                "Cuidado com a fornalha. Ela não perdoa distração.",

                "O ferro daqui reage de forma estranha aos fragmentos de memória.",

                "Se trouxer carvão, eu consigo manter isto funcionando por mais algum tempo."
            ]
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
                0.34,

            lines: [
                "Bem-vindo. Aqui dentro pelo menos ninguém tenta te matar enquanto escolhe uma poção.",

                "Compro materiais e vendo o que consigo trazer de fora.",

                "Se encontrar itens valiosos, pode vender tudo de uma vez pelo balcão."
            ]
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
                0.43,

            lines: [
                "Madeira boa está ficando mais difícil de reconhecer.",

                "Já aconteceu de eu cortar uma tábua e esquecer de qual árvore ela veio.",

                "Se tiver madeira sobrando, sempre encontro alguma utilidade."
            ]
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

    /*
        Procura um NPC externo com o
        mesmo nome somente quando existe.

        Doran não existe mais fora,
        então utiliza as falas do config.
    */

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
            ...(
                original ||
                {}
            ),

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
                config.lines ||
                original
                    ?.lines ||
                [
                    "Bem-vindo."
                ],

            interior:
                true
        }
    ];
}

/* =========================================================
   COLISÕES DOS MÓVEIS
========================================================= */

function rebuildInteriorCollisions() {
    state.world
        .interiorObstacles =
        [];

    if (
        !state.houseMode ||
        !state.currentHouse
    ) {
        return;
    }

    const room =
        getHouseRoom();

    const id =
        state.currentHouse.id;

    /*
        CASA DO JOGADOR
    */

    if (
        id ===
        "home"
    ) {
        /*
            Cama.
        */

        addInteriorObstacle(
            room.x +
            48,

            room.y +
            55,

            150,
            92,

            "bed"
        );

        /*
            Mesa.
        */

        addInteriorObstacle(
            room.x +
            room.w /
            2 -
            70,

            room.y +
            room.h /
            2 -
            30,

            140,
            60,

            "table"
        );

        /*
            Lareira.
        */

        addInteriorObstacle(
            room.x +
            room.w -
            145,

            room.y +
            42,

            98,
            120,

            "fireplace"
        );
    }

    /*
        CASA DO ELIAN
    */

    else if (
        id ===
        "elianHome"
    ) {
        addInteriorObstacle(
            room.x +
            45,

            room.y +
            55,

            130,
            82,

            "bed"
        );

        addInteriorObstacle(
            room.x +
            room.w -
            165,

            room.y +
            45,

            120,
            160,

            "bookshelf"
        );

        addInteriorObstacle(
            room.x +
            room.w /
            2 -
            90,

            room.y +
            room.h /
            2 -
            38,

            180,
            76,

            "desk"
        );
    }

    /*
        FORJA
    */

    else if (
        id ===
        "forge"
    ) {
        /*
            Fornalha.
        */

        addInteriorObstacle(
            room.x +
            43,

            room.y +
            45,

            160,
            155,

            "furnace"
        );

        /*
            Bigorna.
        */

        addInteriorObstacle(
            room.x +
            room.w /
            2 -
            62,

            room.y +
            room.h /
            2 -
            22,

            124,
            90,

            "anvil"
        );

        /*
            Bancada.
        */

        addInteriorObstacle(
            room.x +
            room.w -
            205,

            room.y +
            room.h -
            145,

            155,
            70,

            "forgeBench"
        );
    }

    /*
        LOJA
    */

    else if (
        id ===
        "shop"
    ) {
        /*
            Estante esquerda.
        */

        addInteriorObstacle(
            room.x +
            42,

            room.y +
            42,

            150,
            155,

            "shopShelf"
        );

        /*
            Estante direita.
        */

        addInteriorObstacle(
            room.x +
            room.w -
            192,

            room.y +
            42,

            150,
            155,

            "shopShelf"
        );

        /*
            Balcão.
        */

        addInteriorObstacle(
            room.x +
            room.w *
            0.47,

            room.y +
            room.h *
            0.48,

            room.w *
            0.45,

            62,

            "counter"
        );
    }

    /*
        CARPINTARIA
    */

    else if (
        id ===
        "woodshop"
    ) {
        addInteriorObstacle(
            room.x +
            45,

            room.y +
            48,

            180,
            155,

            "woodPile"
        );

        addInteriorObstacle(
            room.x +
            room.w /
            2 -
            105,

            room.y +
            room.h /
            2 -
            40,

            210,
            80,

            "workbench"
        );

        addInteriorObstacle(
            room.x +
            room.w -
            195,

            room.y +
            58,

            150,
            160,

            "boards"
        );
    }
}

/* =========================================================
   PLAYER DENTRO DA CASA
========================================================= */

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

    rebuildInteriorCollisions();

    updateCamera();
}

/* =========================================================
   COLISÃO DO PLAYER
========================================================= */

function canPlayerMoveTo(
    x,
    y,
    radius
) {
    /*
        INTERIOR
    */

    if (
        state.houseMode
    ) {
        const room =
            getHouseRoom();

        const insideRoom =
            (
                x -
                radius >=
                room.x +
                18
            ) &&
            (
                y -
                radius >=
                room.y +
                18
            ) &&
            (
                x +
                radius <=
                room.x +
                room.w -
                18
            ) &&
            (
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

        /*
            Colisão com móveis.
        */

        for (
            const obstacle of
            state.world
                .interiorObstacles
        ) {
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

        /*
            Colisão com NPC interno.
        */

        for (
            const npc of
            getInteriorNPCs()
        ) {
            if (
                Math.hypot(
                    x -
                    npc.x,
                    y -
                    npc.y
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

    /*
        LIMITES EXTERNOS
    */

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

    /*
        Obstáculos externos.
    */

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

    /*
        NPCs externos.
    */

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

/* =========================================================
   COLISÃO DOS INIMIGOS
========================================================= */

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
   /* =========================================================
   MOVIMENTO DO PLAYER
========================================================= */

function updateMovement(dt) {
    if (
        state.paused ||
        !state.player ||
        state.player.dead
    ) {
        return;
    }

    let dx = 0;
    let dy = 0;

    if (
        state.keys.has("w") ||
        state.keys.has("arrowup")
    ) {
        dy -= 1;
    }

    if (
        state.keys.has("s") ||
        state.keys.has("arrowdown")
    ) {
        dy += 1;
    }

    if (
        state.keys.has("a") ||
        state.keys.has("arrowleft")
    ) {
        dx -= 1;
    }

    if (
        state.keys.has("d") ||
        state.keys.has("arrowright")
    ) {
        dx += 1;
    }

    if (
        dx === 0 &&
        dy === 0
    ) {
        return;
    }

    const direction =
        normalizeVector(
            dx,
            dy
        );

    let speed =
        state.houseMode
            ? 132
            : state.player.speed;

    /*
        Fome e cansaço reduzem a velocidade,
        mas não deixam o personagem completamente
        inútil.
    */

    if (
        !state.houseMode &&
        state.player.hunger <= 20
    ) {
        speed *= 0.78;
    }

    if (
        !state.houseMode &&
        state.player.fatigue <= 20
    ) {
        speed *= 0.78;
    }

    const step =
        speed *
        dt;

    const nextX =
        state.player.x +
        direction.x *
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
        direction.y *
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

/* =========================================================
   FOME / CANSAÇO / REGENERAÇÃO
========================================================= */

function updateSurvival(dt) {
    if (
        state.houseMode ||
        state.paused ||
        !state.player ||
        state.player.dead
    ) {
        return;
    }

    const player =
        state.player;

    /*
        A fome cai lentamente.
    */

    player.hunger =
        clamp(
            player.hunger -
            0.105 *
            dt,
            0,
            100
        );

    /*
        Cansaço cai um pouco mais devagar.
    */

    player.fatigue =
        clamp(
            player.fatigue -
            0.078 *
            dt,
            0,
            100
        );

    /*
        Regeneração natural.
    */

    const magicRecovery =
        player.hunger > 15
            ? 1.55
            : 0.72;

    const energyRecovery =
        player.fatigue > 15
            ? 2.7
            : 1.1;

    player.magic =
        clamp(
            player.magic +
            magicRecovery *
            dt,
            0,
            player.maxMagic
        );

    player.energy =
        clamp(
            player.energy +
            energyRecovery *
            dt,
            0,
            player.maxEnergy
        );

    /*
        Consequência de fome extrema.
    */

    if (
        player.hunger <= 0
    ) {
        player.hp =
            Math.max(
                1,
                player.hp -
                0.5 *
                dt
            );
    }

    /*
        Consequência de exaustão extrema.
    */

    if (
        player.fatigue <= 0
    ) {
        player.energy =
            Math.max(
                0,
                player.energy -
                0.7 *
                dt
            );
    }

    document.body.classList.toggle(
        "low-needs",
        player.hunger <= 16 ||
        player.fatigue <= 16
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
                "Você está com fome. Cace, encontre comida ou volte à vila."
            );

            state.warnedNeedAt =
                now;
        }

        else if (
            player.fatigue <
            18
        ) {
            showToast(
                "Você está exausto. Volte para sua casa e durma na cama."
            );

            state.warnedNeedAt =
                now;
        }
    }
}

/* =========================================================
   DORMIR
========================================================= */

function sleepAtHome() {
    if (
        !state.houseMode ||
        state.currentHouse?.id !== "home"
    ) {
        showToast(
            "Você só pode dormir na sua própria cama."
        );

        return;
    }

    state.paused =
        true;

    state.keys.clear();

    state.pointer.down =
        false;

    cancelHoldInteraction();

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
            const player =
                state.player;

            player.fatigue =
                100;

            player.energy =
                player.maxEnergy;

            player.magic =
                player.maxMagic;

            player.hp =
                Math.min(
                    player.maxHp,
                    player.hp +
                    Math.round(
                        player.maxHp *
                        0.32
                    )
                );

            /*
                Dormir recupera energia,
                mas aumenta a fome.
            */

            player.hunger =
                Math.max(
                    0,
                    player.hunger -
                    10
                );

            must(
                "transitionScreen"
            ).classList.add(
                "hidden"
            );

            state.paused =
                false;

            showToast(
                "Você descansou. Energia, magia e cansaço foram recuperados."
            );

            saveGame(
                false
            );
        },
        1050
    );
}

/* =========================================================
   ATUALIZAÇÃO DOS COOLDOWNS
========================================================= */

function updateSkillCooldowns(dt) {
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
            .skillCooldowns[
                key
            ] =
            Math.max(
                0,
                (
                    state.player
                        .skillCooldowns[
                            key
                        ] ||
                    0
                ) -
                dt
            );
    }

    state.player.attackCooldown =
        Math.max(
            0,
            state.player.attackCooldown -
            dt
        );

    state.player.invincible =
        Math.max(
            0,
            state.player.invincible -
            dt
        );

    state.player.shieldTimer =
        Math.max(
            0,
            (
                state.player
                    .shieldTimer ||
                0
            ) -
            dt
        );

    if (
        state.player.shieldTimer <= 0
    ) {
        state.player.damageReduction =
            0;
    }
}

/* =========================================================
   ENCONTRAR INIMIGO MAIS PRÓXIMO
========================================================= */

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

/* =========================================================
   INIMIGO NA DIREÇÃO DO MOUSE
========================================================= */

function findEnemyToward(
    point,
    range,
    cone = 0.72
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

    const aimX =
        point.x -
        player.x;

    const aimY =
        point.y -
        player.y;

    const aimLength =
        Math.hypot(
            aimX,
            aimY
        ) || 1;

    const normalizedAimX =
        aimX /
        aimLength;

    const normalizedAimY =
        aimY /
        aimLength;

    let best =
        null;

    let bestScore =
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
                    d ||
                    1
                )
            ) *
            normalizedAimX +
            (
                dy /
                (
                    d ||
                    1
                )
            ) *
            normalizedAimY;

        if (
            dot <
            cone
        ) {
            continue;
        }

        const score =
            d -
            dot *
            48;

        if (
            score <
            bestScore
        ) {
            bestScore =
                score;

            best =
                enemy;
        }
    }

    return best;
}

/* =========================================================
   EFEITO DO ATAQUE BÁSICO
========================================================= */

function createAttackEffect(
    point,
    range,
    color,
    ranged = false
) {
    const player =
        state.player;

    const character =
        currentCharacter();

    const dx =
        (
            point?.x ??
            player.x +
            1
        ) -
        player.x;

    const dy =
        (
            point?.y ??
            player.y
        ) -
        player.y;

    const direction =
        normalizeVector(
            dx,
            dy
        );

    const targetX =
        player.x +
        direction.x *
        Math.min(
            range,
            ranged
                ? 230
                : 110
        );

    const targetY =
        player.y +
        direction.y *
        Math.min(
            range,
            ranged
                ? 230
                : 110
        );

    /*
        Cada classe recebe um ataque
        visual diferente.
    */

    if (
        character.id ===
        "kaelion"
    ) {
        state.world.effects.push({
            type:
                "magicProjectile",

            x:
                player.x,

            y:
                player.y,

            startX:
                player.x,

            startY:
                player.y,

            tx:
                targetX,

            ty:
                targetY,

            progress:
                0,

            speed:
                8.5,

            life:
                0.42,

            maxLife:
                0.42,

            color:
                character.color,

            secondary:
                character.secondaryColor
        });

        spawnParticles(
            player.x,
            player.y,
            character.secondaryColor,
            5
        );
    }

    else if (
        character.id ===
        "theron"
    ) {
        state.world.effects.push({
            type:
                "swordArc",

            x:
                player.x,

            y:
                player.y,

            angle:
                Math.atan2(
                    direction.y,
                    direction.x
                ),

            radius:
                58,

            life:
                0.22,

            maxLife:
                0.22,

            color:
                character.secondaryColor
        });
    }

    else if (
        character.id ===
        "grumgar"
    ) {
        state.world.effects.push({
            type:
                "heavySmash",

            x:
                targetX,

            y:
                targetY,

            radius:
                50,

            life:
                0.30,

            maxLife:
                0.30,

            color:
                character.secondaryColor
        });

        spawnParticles(
            targetX,
            targetY,
            "#80643e",
            9
        );
    }

    else if (
        character.id ===
        "lirael"
    ) {
        state.world.effects.push({
            type:
                "fairyProjectile",

            x:
                player.x,

            y:
                player.y,

            startX:
                player.x,

            startY:
                player.y,

            tx:
                targetX,

            ty:
                targetY,

            progress:
                0,

            speed:
                10,

            life:
                0.38,

            maxLife:
                0.38,

            color:
                character.color,

            secondary:
                character.secondaryColor
        });

        spawnParticles(
            player.x,
            player.y,
            "#ffc7f0",
            6
        );
    }

    else {
        state.world.effects.push({
            type:
                "clawArc",

            x:
                player.x,

            y:
                player.y,

            angle:
                Math.atan2(
                    direction.y,
                    direction.x
                ),

            radius:
                62,

            life:
                0.24,

            maxLife:
                0.24,

            color:
                character.secondaryColor
        });

        spawnParticles(
            player.x +
            direction.x *
            35,
            player.y +
            direction.y *
            35,
            character.color,
            6
        );
    }
}

/* =========================================================
   ATAQUE BÁSICO DO PLAYER
========================================================= */

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
        3
    ) {
        if (
            state.pointer.down
        ) {
            showToast(
                "Você está sem energia para atacar."
            );
        }

        return;
    }

    const character =
        currentCharacter();

    const ranged =
        character.id === "kaelion" ||
        character.id === "lirael";

    const attackRange =
        ranged
            ? 330
            : character.id === "grumgar"
            ? 150
            : 142;

    const worldPoint =
        point ||
        {
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
                ? 0.50
                : 0.38
        );

    /*
        Ataque segurando mouse continua funcionando,
        mas respeita o cooldown.
    */

    player.energy =
        Math.max(
            0,
            player.energy -
            (
                character.id ===
                "grumgar"
                    ? 4
                    : 3
            )
        );

    const cooldownByClass = {
        kaelion:
            0.38,

        theron:
            0.34,

        grumgar:
            0.52,

        lirael:
            0.29,

        zephyr:
            0.32
    };

    player.attackCooldown =
        cooldownByClass[
            character.id
        ] ||
        0.35;

    player.hunger =
        Math.max(
            0,
            player.hunger -
            0.035
        );

    player.fatigue =
        Math.max(
            0,
            player.fatigue -
            0.055
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

    /*
        Boss de progressão ainda precisa
        ser aceito antes do primeiro dano.
    */

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
            8;
    }

    else if (
        character.id ===
        "theron"
    ) {
        damage +=
            4;
    }

    else if (
        character.id ===
        "lirael"
    ) {
        damage -=
            2;
    }

    if (
        ranged &&
        distance(
            target,
            player
        ) >
        250
    ) {
        damage *=
            0.92;
    }

    attackEnemy(
        target,
        Math.round(
            damage
        )
    );
}

/* =========================================================
   SISTEMA DE HABILIDADES
========================================================= */

const CLASS_SKILLS = {
    kaelion: {
        q: {
            name:
                "Bola de Memória",

            level:
                1,

            cooldown:
                2.2,

            costMagic:
                15
        },

        r: {
            name:
                "Nova Arcana",

            level:
                5,

            cooldown:
                6,

            costMagic:
                30
        },

        f: {
            name:
                "Tempestade da Quietude",

            level:
                10,

            cooldown:
                12,

            costMagic:
                55
        }
    },

    theron: {
        q: {
            name:
                "Golpe Pesado",

            level:
                1,

            cooldown:
                3,

            costEnergy:
                10
        },

        r: {
            name:
                "Postura do Guardião",

            level:
                5,

            cooldown:
                9,

            costEnergy:
                18
        },

        f: {
            name:
                "Juramento de Aço",

            level:
                10,

            cooldown:
                15,

            costEnergy:
                30
        }
    },

    grumgar: {
        q: {
            name:
                "Esmagamento",

            level:
                1,

            cooldown:
                4,

            costEnergy:
                12
        },

        r: {
            name:
                "Rugido Ancestral",

            level:
                5,

            cooldown:
                8,

            costEnergy:
                20
        },

        f: {
            name:
                "Terremoto",

            level:
                10,

            cooldown:
                14,

            costEnergy:
                34
        }
    },

    lirael: {
        q: {
            name:
                "Flecha Feérica",

            level:
                1,

            cooldown:
                1.5,

            costMagic:
                12
        },

        r: {
            name:
                "Luz Vital",

            level:
                5,

            cooldown:
                7,

            costMagic:
                28
        },

        f: {
            name:
                "Chuva de Estrelas",

            level:
                10,

            cooldown:
                11,

            costMagic:
                48
        }
    },

    zephyr: {
        q: {
            name:
                "Forma Adaptativa",

            level:
                1,

            cooldown:
                7,

            costMagic:
                12
        },

        r: {
            name:
                "Investida Quimérica",

            level:
                5,

            cooldown:
                6,

            costEnergy:
                18
        },

        f: {
            name:
                "Forma Perfeita",

            level:
                10,

            cooldown:
                15,

            costMagic:
                42
        }
    }
};

/* =========================================================
   HABILIDADES DO PERSONAGEM ATUAL
========================================================= */

function getCharacterSkills() {
    return (
        CLASS_SKILLS[
            state.player
                ?.characterId
        ] ||
        CLASS_SKILLS.kaelion
    );
}

/* =========================================================
   USAR HABILIDADE
========================================================= */

function useSkill(key) {
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
        skills[
            key
        ];

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
            player.skillCooldowns[
                key
            ] ||
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

    player.skillCooldowns[
        key
    ] =
        skill.cooldown;

    const point = {
        x:
            state.pointer.worldX ||
            player.x +
            1,

        y:
            state.pointer.worldY ||
            player.y
    };

    const weaponBonus =
        ITEMS[
            player.equipment.weapon
        ]?.damage ||
        0;

    const base =
        player.damage +
        weaponBonus;

    /*
        ============================================
        KAELION
        ============================================
    */

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
                    420,
                    0.42
                );

            state.world.effects.push({
                type:
                    "bigMemoryOrb",

                x:
                    player.x,

                y:
                    player.y,

                tx:
                    point.x,

                ty:
                    point.y,

                life:
                    0.55,

                maxLife:
                    0.55,

                color:
                    "#f1a354",

                secondary:
                    "#ffd998"
            });

            spawnParticles(
                player.x,
                player.y,
                "#ffca79",
                14
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
                            1.48 +
                            20
                        )
                    );

                    spawnParticles(
                        target.x,
                        target.y,
                        "#ffb85d",
                        16
                    );
                }
            }
        }

        else if (
            key ===
            "r"
        ) {
            for (
                let i = 0;
                i <
                3;
                i++
            ) {
                state.world.effects.push({
                    type:
                        "skillRing",

                    x:
                        player.x,

                    y:
                        player.y,

                    radius:
                        75 +
                        i *
                        45,

                    life:
                        0.60 +
                        i *
                        0.08,

                    maxLife:
                        0.60 +
                        i *
                        0.08,

                    color:
                        i %
                        2 ===
                        0
                            ? "#e49345"
                            : "#ffd070"
                });
            }

            damageEnemiesInRadius(
                player.x,
                player.y,
                185,
                Math.round(
                    base *
                    1.38 +
                    24
                ),
                {
                    stun:
                        1.1,

                    color:
                        "#f0a053"
                }
            );

            spawnParticles(
                player.x,
                player.y,
                "#ffd070",
                30
            );
        }

        else if (
            key ===
            "f"
        ) {
            for (
                let i = 0;
                i <
                10;
                i++
            ) {
                const angle =
                    random(
                        0,
                        Math.PI *
                        2
                    );

                const spread =
                    random(
                        60,
                        240
                    );

                const x =
                    player.x +
                    Math.cos(
                        angle
                    ) *
                    spread;

                const y =
                    player.y +
                    Math.sin(
                        angle
                    ) *
                    spread;

                state.world.effects.push({
                    type:
                        "memoryStrike",

                    x,
                    y,

                    life:
                        0.8,

                    maxLife:
                        0.8,

                    color:
                        i %
                        2
                            ? "#ffac5c"
                            : "#ffe2a1"
                });

                damageEnemiesInRadius(
                    x,
                    y,
                    76,
                    Math.round(
                        base *
                        1.12 +
                        26
                    )
                );
            }
        }
    }

    /*
        ============================================
        THERON
        ============================================
    */

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
                    175,
                    0.28
                );

            state.world.effects.push({
                type:
                    "swordArc",

                x:
                    player.x,

                y:
                    player.y,

                angle:
                    Math.atan2(
                        point.y -
                        player.y,
                        point.x -
                        player.x
                    ),

                radius:
                    90,

                life:
                    0.34,

                maxLife:
                    0.34,

                color:
                    "#f4f7ff",

                heavy:
                    true
            });

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
                            1.7 +
                            20
                        )
                    );

                    target.stunTimer =
                        Math.max(
                            target.stunTimer ||
                            0,
                            0.65
                        );
                }
            }
        }

        else if (
            key ===
            "r"
        ) {
            player.damageReduction =
                0.45;

            player.shieldTimer =
                5.5;

            state.world.effects.push({
                type:
                    "shieldAura",

                x:
                    player.x,

                y:
                    player.y,

                life:
                    5.5,

                maxLife:
                    5.5,

                color:
                    "#dbe8f4"
            });

            spawnParticles(
                player.x,
                player.y,
                "#ced8e2",
                28
            );
        }

        else if (
            key ===
            "f"
        ) {
            player.damageReduction =
                0.58;

            player.shieldTimer =
                7;

            for (
                let i = 0;
                i <
                4;
                i++
            ) {
                state.world.effects.push({
                    type:
                        "skillRing",

                    x:
                        player.x,

                    y:
                        player.y,

                    radius:
                        70 +
                        i *
                        40,

                    life:
                        0.7 +
                        i *
                        0.1,

                    maxLife:
                        0.7 +
                        i *
                        0.1,

                    color:
                        "#f4dd9b"
                });
            }

            damageEnemiesInRadius(
                player.x,
                player.y,
                155,
                Math.round(
                    base *
                    1.4 +
                    28
                ),
                {
                    stun:
                        0.95,

                    color:
                        "#f2d48a"
                }
            );
        }
    }

    /*
        ============================================
        GRUMGAR
        ============================================
    */

    else if (
        character.id ===
        "grumgar"
    ) {
        if (
            key ===
            "q"
        ) {
            state.world.effects.push({
                type:
                    "groundCrack",

                x:
                    player.x,

                y:
                    player.y,

                radius:
                    140,

                life:
                    0.55,

                maxLife:
                    0.55,

                color:
                    "#8b774e"
            });

            damageEnemiesInRadius(
                player.x,
                player.y,
                138,
                Math.round(
                    base *
                    1.75 +
                    26
                ),
                {
                    stun:
                        0.55,

                    color:
                        "#92a45f"
                }
            );

            spawnParticles(
                player.x,
                player.y,
                "#765739",
                24
            );
        }

        else if (
            key ===
            "r"
        ) {
            state.world.effects.push({
                type:
                    "roarWave",

                x:
                    player.x,

                y:
                    player.y,

                radius:
                    250,

                life:
                    0.75,

                maxLife:
                    0.75,

                color:
                    "#b5d072"
            });

            damageEnemiesInRadius(
                player.x,
                player.y,
                240,
                Math.round(
                    base *
                    0.78 +
                    14
                ),
                {
                    stun:
                        2,

                    color:
                        "#7f9454"
                }
            );
        }

        else if (
            key ===
            "f"
        ) {
            for (
                let i = 0;
                i <
                6;
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
                        55 +
                        i *
                        46,

                    life:
                        0.70 +
                        i *
                        0.08,

                    maxLife:
                        0.70 +
                        i *
                        0.08,

                    color:
                        "#a58d5e"
                });
            }

            damageEnemiesInRadius(
                player.x,
                player.y,
                310,
                Math.round(
                    base *
                    1.58 +
                    42
                ),
                {
                    stun:
                        1.35,

                    color:
                        "#9f8b61"
                }
            );

            spawnParticles(
                player.x,
                player.y,
                "#896740",
                38
            );
        }
    }

    /*
        ============================================
        LIRAEL
        ============================================
    */

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
                    450,
                    0.38
                );

            state.world.effects.push({
                type:
                    "fairyArrow",

                x:
                    player.x,

                y:
                    player.y,

                tx:
                    point.x,

                ty:
                    point.y,

                life:
                    0.48,

                maxLife:
                    0.48,

                color:
                    "#f6a2df"
            });

            spawnParticles(
                player.x,
                player.y,
                "#ffc7ee",
                10
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
                            1.3 +
                            19
                        )
                    );

                    spawnParticles(
                        target.x,
                        target.y,
                        "#ffabdf",
                        15
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
                        0.38
                    )
                );

            player.energy =
                Math.min(
                    player.maxEnergy,
                    player.energy +
                    25
                );

            state.world.effects.push({
                type:
                    "healingAura",

                x:
                    player.x,

                y:
                    player.y,

                radius:
                    90,

                life:
                    1.1,

                maxLife:
                    1.1,

                color:
                    "#ffb7e8"
            });

            spawnParticles(
                player.x,
                player.y,
                "#ffb7e8",
                36
            );
        }

        else if (
            key ===
            "f"
        ) {
            for (
                let i = 0;
                i <
                11;
                i++
            ) {
                const x =
                    player.x +
                    random(
                        -230,
                        230
                    );

                const y =
                    player.y +
                    random(
                        -230,
                        230
                    );

                state.world.effects.push({
                    type:
                        "fairyStar",

                    x,
                    y,

                    life:
                        0.85,

                    maxLife:
                        0.85,

                    color:
                        i %
                        2
                            ? "#ffb6e6"
                            : "#d3bcff"
                });

                damageEnemiesInRadius(
                    x,
                    y,
                    68,
                    Math.round(
                        base +
                        24
                    )
                );
            }
        }
    }

    /*
        ============================================
        ZEPHYR
        ============================================
    */

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

            state.world.effects.push({
                type:
                    "transformAura",

                x:
                    player.x,

                y:
                    player.y,

                life:
                    1.1,

                maxLife:
                    1.1,

                color:
                    "#a384e8"
            });
        }

        else if (
            key ===
            "r"
        ) {
            const direction =
                normalizeVector(
                    point.x -
                    player.x,
                    point.y -
                    player.y
                );

            /*
                Investida visualmente animada,
                evitando aparência de teleporte.
            */

            startPlayerDash(
                direction.x,
                direction.y,
                185,
                0.24,
                () => {
                    damageEnemiesInRadius(
                        player.x,
                        player.y,
                        100,
                        Math.round(
                            base *
                            1.48 +
                            20
                        ),
                        {
                            color:
                                "#a384e8"
                        }
                    );
                }
            );
        }

        else if (
            key ===
            "f"
        ) {
            activateAdaptiveForm(
                10,
                42,
                12
            );

            player.damageReduction =
                0.28;

            player.shieldTimer =
                10;

            player.hp =
                Math.min(
                    player.maxHp,
                    player.hp +
                    28
                );

            state.world.effects.push({
                type:
                    "transformAura",

                x:
                    player.x,

                y:
                    player.y,

                life:
                    1.7,

                maxLife:
                    1.7,

                color:
                    "#c7a8ff",

                ultimate:
                    true
            });

            spawnParticles(
                player.x,
                player.y,
                "#b993ff",
                40
            );
        }
    }

    player.hunger =
        Math.max(
            0,
            player.hunger -
            0.25
        );

    player.fatigue =
        Math.max(
            0,
            player.fatigue -
            0.38
        );

    showToast(
        skill.name
    );
}

/* =========================================================
   FORMA ADAPTATIVA
========================================================= */

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
        28
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

/* =========================================================
   INVESTIDA DO PLAYER
========================================================= */

function startPlayerDash(
    dirX,
    dirY,
    distanceAmount,
    duration,
    onComplete = null
) {
    if (
        state.player.playerDash
    ) {
        return;
    }

    state.player.playerDash = {
        dirX,
        dirY,

        remaining:
            distanceAmount,

        speed:
            distanceAmount /
            duration,

        onComplete
    };

    state.world.effects.push({
        type:
            "dashTrail",

        owner:
            "player",

        x:
            state.player.x,

        y:
            state.player.y,

        life:
            duration,

        maxLife:
            duration,

        color:
            currentCharacter()
                .secondaryColor
    });
}

/* =========================================================
   ATUALIZA INVESTIDA DO PLAYER
========================================================= */

function updatePlayerDash(dt) {
    const dash =
        state.player
            ?.playerDash;

    if (
        !dash
    ) {
        return;
    }

    const move =
        Math.min(
            dash.remaining,
            dash.speed *
            dt
        );

    const nextX =
        state.player.x +
        dash.dirX *
        move;

    const nextY =
        state.player.y +
        dash.dirY *
        move;

    let moved =
        false;

    if (
        canPlayerMoveTo(
            nextX,
            state.player.y,
            state.player.radius
        )
    ) {
        state.player.x =
            nextX;

        moved =
            true;
    }

    if (
        canPlayerMoveTo(
            state.player.x,
            nextY,
            state.player.radius
        )
    ) {
        state.player.y =
            nextY;

        moved =
            true;
    }

    dash.remaining -=
        move;

    if (
        Math.random() <
        0.65
    ) {
        spawnParticles(
            state.player.x,
            state.player.y,
            currentCharacter()
                .color,
            2
        );
    }

    if (
        dash.remaining <=
        0 ||
        !moved
    ) {
        const callback =
            dash.onComplete;

        state.player.playerDash =
            null;

        if (
            typeof callback ===
            "function"
        ) {
            callback();
        }
    }
}

/* =========================================================
   DANO EM ÁREA
========================================================= */

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
            0.48,

        maxLife:
            0.48,

        color:
            options.color ||
            "#fff2b0"
    });
}

/* =========================================================
   DANO NO INIMIGO
========================================================= */

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
        0.18;

    spawnParticles(
        enemy.x,
        enemy.y,

        finalDamage >= 70
            ? "#ff8c70"
            : "#ffffff",

        finalDamage >= 70
            ? 14
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
            0.72,

        maxLife:
            0.72,

        color:
            finalDamage >= 100
                ? "#cf7bff"
                : finalDamage >= 70
                ? "#ff715e"
                : finalDamage >= 45
                ? "#ffad56"
                : finalDamage >= 28
                ? "#ffe16d"
                : "#ffffff"
    });

    if (
        enemy.hp <= 0
    ) {
        defeatEnemy(
            enemy
        );
    }
}

/* =========================================================
   IA DOS INIMIGOS
========================================================= */

function updateEnemies(dt) {
    if (
        state.houseMode ||
        state.paused ||
        !state.player
    ) {
        return;
    }

    for (
        const enemy of
        state.world.enemies
    ) {
        /*
            Respawn de boss de recurso.
        */

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

                    enemy.specialTimer =
                        random(
                            1.5,
                            3
                        );

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

        /*
            Atualiza investida em andamento.
        */

        if (
            enemy.dashState
        ) {
            updateEnemyDash(
                enemy,
                dt
            );

            continue;
        }

        const d =
            distance(
                enemy,
                state.player
            );

        /*
            Chefe final.
        */

        if (
            enemy.type ===
            "final" &&
            !state.player.finalChoice
        ) {
            if (
                d <
                145 &&
                !state.finalChoiceShown
            ) {
                openFinalChoice();
            }

            continue;
        }

        /*
            Boss de progressão não inicia batalha
            sozinho antes da confirmação,
            mas continua visível.
        */

        if (
            enemy.type ===
            "progression" &&
            !enemy.accepted
        ) {
            continue;
        }

        /*
            Detecção.
        */

        if (
            !enemy.aggressive &&
            d <=
            enemy.vision
        ) {
            enemy.aggressive =
                true;

            enemy.state =
                "chasing";

            if (
                enemy.type ===
                "resourceBoss" ||
                enemy.type ===
                "hell"
            ) {
                showToast(
                    `${enemy.name} percebeu você!`
                );
            }
        }

        if (
            !enemy.aggressive
        ) {
            continue;
        }

        /*
            Se jogador fugir muito longe,
            criatura comum desiste.
        */

        if (
            d >
            enemy.vision *
            2.05 &&
            enemy.type !== "hell" &&
            enemy.type !== "final" &&
            enemy.type !== "progression"
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
                    0.14
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

        /*
            Habilidades agora realmente são
            verificadas enquanto o boss persegue.
        */

        updateEnemySpecial(
            enemy
        );

        /*
            Enquanto avisa um ataque,
            inimigo fica mais lento.
        */

        const speedMultiplier =
            enemy.telegraphing
                ? 0.20
                : 1;

        /*
            Aproximação normal.
        */

        if (
            d >
            enemy.attackRange
        ) {
            const direction =
                normalizeVector(
                    state.player.x -
                    enemy.x,
                    state.player.y -
                    enemy.y
                );

            const move =
                enemy.speed *
                speedMultiplier *
                dt;

            const nextX =
                enemy.x +
                direction.x *
                move;

            const nextY =
                enemy.y +
                direction.y *
                move;

            if (
                canEnemyMoveTo(
                    nextX,
                    enemy.y,
                    enemy.radius
                )
            ) {
                enemy.x =
                    nextX;
            }

            if (
                canEnemyMoveTo(
                    enemy.x,
                    nextY,
                    enemy.radius
                )
            ) {
                enemy.y =
                    nextY;
            }
        }

        /*
            Ataque corpo a corpo.
        */

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
                    1.18 -
                    enemy.phase *
                    0.07
                );

            state.world.effects.push({
                type:
                    "enemyHit",

                x:
                    state.player.x,

                y:
                    state.player.y,

                life:
                    0.24,

                maxLife:
                    0.24,

                color:
                    enemy.color
            });
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

/* =========================================================
   FASES DOS BOSSES
========================================================= */

function updateEnemyPhase(enemy) {
    if (
        enemy.type !== "progression" &&
        enemy.type !== "resourceBoss" &&
        enemy.type !== "final"
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
                0.65
            );

        state.world.effects.push({
            type:
                "bossPhase",

            x:
                enemy.x,

            y:
                enemy.y,

            radius:
                enemy.radius *
                3.5,

            life:
                0.8,

            maxLife:
                0.8,

            color:
                enemy.color
        });

        spawnParticles(
            enemy.x,
            enemy.y,
            enemy.color,
            28
        );

        showToast(
            `${enemy.name}: FASE ${newPhase}`
        );
    }
}

/* =========================================================
   COMEÇAR INVESTIDA DE INIMIGO
========================================================= */

function startEnemyDash(
    enemy,
    targetX,
    targetY,
    distanceAmount = 170,
    duration = 0.30
) {
    if (
        enemy.dashState
    ) {
        return;
    }

    const direction =
        normalizeVector(
            targetX -
            enemy.x,
            targetY -
            enemy.y
        );

    enemy.dashState = {
        dirX:
            direction.x,

        dirY:
            direction.y,

        remaining:
            distanceAmount,

        speed:
            distanceAmount /
            duration,

        hit:
            false
    };

    state.world.effects.push({
        type:
            "enemyDashTrail",

        enemy,

        life:
            duration,

        maxLife:
            duration,

        color:
            enemy.color
    });
}

/* =========================================================
   INVESTIDA ANIMADA DO INIMIGO
========================================================= */

function updateEnemyDash(
    enemy,
    dt
) {
    const dash =
        enemy.dashState;

    if (
        !dash
    ) {
        return;
    }

    const move =
        Math.min(
            dash.remaining,
            dash.speed *
            dt
        );

    const nextX =
        enemy.x +
        dash.dirX *
        move;

    const nextY =
        enemy.y +
        dash.dirY *
        move;

    let moved =
        false;

    if (
        canEnemyMoveTo(
            nextX,
            enemy.y,
            enemy.radius
        )
    ) {
        enemy.x =
            nextX;

        moved =
            true;
    }

    if (
        canEnemyMoveTo(
            enemy.x,
            nextY,
            enemy.radius
        )
    ) {
        enemy.y =
            nextY;

        moved =
            true;
    }

    dash.remaining -=
        move;

    if (
        Math.random() <
        0.5
    ) {
        spawnParticles(
            enemy.x,
            enemy.y,
            enemy.color,
            2
        );
    }

    if (
        !dash.hit &&
        distance(
            enemy,
            state.player
        ) <=
        enemy.radius +
        state.player.radius +
        8
    ) {
        dash.hit =
            true;

        damagePlayer(
            Math.round(
                enemy.damage *
                1.15
            )
        );
    }

    if (
        dash.remaining <=
        0 ||
        !moved
    ) {
        enemy.dashState =
            null;
    }
}

/* =========================================================
   HABILIDADES DOS INIMIGOS
========================================================= */

function updateEnemySpecial(enemy) {
    if (
        !enemy.special ||
        enemy.specialTimer >
        0 ||
        enemy.telegraphing ||
        enemy.dashState
    ) {
        return;
    }

    const phase =
        Math.max(
            1,
            enemy.phase ||
            1
        );

    const playerX =
        state.player.x;

    const playerY =
        state.player.y;

    /*
        INVESTIDA
    */

    if (
        enemy.special ===
        "dash"
    ) {
        enemy.telegraphing =
            true;

        state.world.effects.push({
            type:
                "dashWarning",

            x:
                enemy.x,

            y:
                enemy.y,

            tx:
                playerX,

            ty:
                playerY,

            life:
                0.68,

            maxLife:
                0.68,

            color:
                "#ff5b50"
        });

        setTimeout(
            () => {
                if (
                    enemy.dead
                ) {
                    return;
                }

                enemy.telegraphing =
                    false;

                startEnemyDash(
                    enemy,
                    state.player.x,
                    state.player.y,
                    190,
                    0.34
                );
            },
            680
        );

        enemy.specialTimer =
            random(
                3.5,
                5
            );

        return;
    }

    /*
        PEDRA LANÇADA
    */

    if (
        enemy.special ===
        "rockThrow"
    ) {
        enemy.telegraphing =
            true;

        addHazard(
            playerX,
            playerY,
            60,
            0.92,
            Math.round(
                enemy.damage *
                0.95
            ),
            {
                sourceId:
                    enemy.id,

                kind:
                    "rockThrow"
            }
        );

        state.world.effects.push({
            type:
                "rockProjectile",

            x:
                enemy.x,

            y:
                enemy.y,

            tx:
                playerX,

            ty:
                playerY,

            life:
                0.92,

            maxLife:
                0.92,

            color:
                "#8d8275"
        });

        setTimeout(
            () => {
                if (
                    !enemy.dead
                ) {
                    enemy.telegraphing =
                        false;
                }
            },
            980
        );

        enemy.specialTimer =
            random(
                3.1,
                4.5
            );

        return;
    }

    /*
        TIRO DE CRISTAL
    */

    if (
        enemy.special ===
        "crystalShot"
    ) {
        enemy.telegraphing =
            true;

        addHazard(
            playerX,
            playerY,
            49,
            0.72,
            Math.round(
                enemy.damage *
                0.92
            ),
            {
                sourceId:
                    enemy.id,

                kind:
                    "crystalShot"
            }
        );

        state.world.effects.push({
            type:
                "crystalProjectile",

            x:
                enemy.x,

            y:
                enemy.y,

            tx:
                playerX,

            ty:
                playerY,

            life:
                0.72,

            maxLife:
                0.72,

            color:
                "#ff6685"
        });

        setTimeout(
            () => {
                if (
                    !enemy.dead
                ) {
                    enemy.telegraphing =
                        false;
                }
            },
            790
        );

        enemy.specialTimer =
            random(
                2.8,
                4.2
            );

        return;
    }

    /*
        CONFIGURAÇÕES DE ATAQUES EM ÁREA.
    */

    const configs = {
        memoryWave: {
            radius:
                76,

            delay:
                0.95,

            mult:
                1.05,

            count:
                2 +
                phase,

            spread:
                135,

            color:
                "#d86161"
        },

        natureBurst: {
            radius:
                105,

            delay:
                1,

            mult:
                1.05,

            count:
                1,

            spread:
                0,

            color:
                "#8eb566"
        },

        rootCircle: {
            radius:
                80,

            delay:
                1.02,

            mult:
                1.1,

            count:
                2 +
                phase,

            spread:
                150,

            color:
                "#5e8a54"
        },

        leafStorm: {
            radius:
                67,

            delay:
                0.88,

            mult:
                1.05,

            count:
                3 +
                phase,

            spread:
                180,

            color:
                "#759865"
        },

        rockStorm: {
            radius:
                73,

            delay:
                0.90,

            mult:
                1.15,

            count:
                3 +
                phase *
                2,

            spread:
                210,

            color:
                "#887f72"
        },

        oreBurst: {
            radius:
                72,

            delay:
                0.86,

            mult:
                1.1,

            count:
                3 +
                phase,

            spread:
                165,

            color:
                "#919b9f"
        },

        crystalRain: {
            radius:
                65,

            delay:
                0.74,

            mult:
                1.14,

            count:
                4 +
                phase *
                2,

            spread:
                220,

            color:
                "#ef5476"
        },

        shadowBurst: {
            radius:
                84,

            delay:
                0.86,

            mult:
                1.15,

            count:
                3 +
                phase,

            spread:
                180,

            color:
                "#76528e"
        },

        voidCircle: {
            radius:
                94,

            delay:
                1,

            mult:
                1.18,

            count:
                2 +
                phase,

            spread:
                170,

            color:
                "#51336e"
        },

        fairyBurst: {
            radius:
                68,

            delay:
                0.78,

            mult:
                1.05,

            count:
                2 +
                phase,

            spread:
                160,

            color:
                "#df95dd"
        },

        fairyStorm: {
            radius:
                62,

            delay:
                0.72,

            mult:
                1.15,

            count:
                4 +
                phase *
                2,

            spread:
                225,

            color:
                "#dda1e8"
        },

        fireCircle: {
            radius:
                78,

            delay:
                0.80,

            mult:
                1.12,

            count:
                2 +
                phase,

            spread:
                150,

            color:
                "#ff6e3c"
        },

        infernalStorm: {
            radius:
                80,

            delay:
                0.66,

            mult:
                1.22,

            count:
                5 +
                phase *
                2,

            spread:
                250,

            color:
                "#ff583c"
        },

        finalMemoryStorm: {
            radius:
                84,

            delay:
                0.62,

            mult:
                1.25,

            count:
                6 +
                phase *
                3,

            spread:
                270,

            color:
                "#bc8cff"
        }
    };

    const config =
        configs[
            enemy.special
        ];

    if (
        !config
    ) {
        enemy.specialTimer =
            3;

        return;
    }

    enemy.telegraphing =
        true;

    for (
        let i = 0;
        i <
        config.count;
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
                    config.spread
                );

        const x =
            playerX +
            Math.cos(
                angle
            ) *
            spread;

        const y =
            playerY +
            Math.sin(
                angle
            ) *
            spread;

        addHazard(
            x,
            y,
            config.radius,
            config.delay +
            i *
            0.045,
            Math.round(
                enemy.damage *
                config.mult
            ),
            {
                sourceId:
                    enemy.id,

                kind:
                    enemy.special,

                color:
                    config.color
            }
        );
    }

    state.world.effects.push({
        type:
            "enemyCast",

        x:
            enemy.x,

        y:
            enemy.y,

        radius:
            enemy.radius *
            2.2,

        life:
            config.delay,

        maxLife:
            config.delay,

        color:
            config.color
    });

    setTimeout(
        () => {
            if (
                !enemy.dead
            ) {
                enemy.telegraphing =
                    false;
            }
        },
        config.delay *
        1000 +
        130
    );

    enemy.specialTimer =
        Math.max(
            1.7,
            random(
                3.7,
                5.1
            ) -
            phase *
            0.42
        );
}

/* =========================================================
   ATAQUES DO BOSS FINAL
========================================================= */

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
        enemy.finalPhase
    ) {
        enemy.finalPhase =
            newPhase;

        showToast(
            `O OUTRO EU — FASE ${newPhase}`
        );

        spawnParticles(
            enemy.x,
            enemy.y,
            "#c296ff",
            40
        );
    }

    enemy.finalSpecialTimer =
        Math.max(
            0,
            (
                enemy.finalSpecialTimer ||
                2.4
            ) -
            dt
        );

    if (
        enemy.finalSpecialTimer >
        0 ||
        enemy.telegraphing
    ) {
        return;
    }

    const count =
        3 +
        newPhase *
        2;

    const delay =
        Math.max(
            0.48,
            0.95 -
            newPhase *
            0.07
        );

    for (
        let i = 0;
        i <
        count;
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
                    60,
                    250
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
            0.04,

            Math.round(
                enemy.damage *
                (
                    0.65 +
                    newPhase *
                    0.07
                )
            ),

            {
                sourceId:
                    enemy.id,

                kind:
                    "quietudeFinal",

                color:
                    "#a66aff"
            }
        );
    }

    enemy.finalSpecialTimer =
        Math.max(
            1.5,
            4 -
            newPhase *
            0.44
        );
}

/* =========================================================
   ATUALIZAR ÁREAS DE PERIGO
========================================================= */

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
            hazard.delay <= 0
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

            const particleColor =
                hazard.kind
                    ?.includes(
                        "crystal"
                    )
                    ? "#ff6d8c"
                    : hazard.kind
                        ?.includes(
                            "fairy"
                        )
                    ? "#e8a6ff"
                    : hazard.kind
                        ?.includes(
                            "void"
                        )
                    ? "#8a55a8"
                    : hazard.kind
                        ?.includes(
                            "fire"
                        )
                    ? "#ff6e37"
                    : hazard.kind ===
                        "quietudeFinal"
                    ? "#c07cff"
                    : "#e85c45";

            spawnParticles(
                hazard.x,
                hazard.y,
                particleColor,
                18
            );

            state.world.effects.push({
                type:
                    "hazardImpact",

                x:
                    hazard.x,

                y:
                    hazard.y,

                radius:
                    hazard.radius,

                life:
                    0.28,

                maxLife:
                    0.28,

                color:
                    particleColor
            });
        }
    }

    state.world.hazards =
        state.world.hazards.filter(
            hazard =>
                hazard.life >
                0
        );
}

/* =========================================================
   DANO NO PLAYER
========================================================= */

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
            player.equipment.armor
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

    state.world.effects.push({
        type:
            "playerDamageFlash",

        x:
            player.x,

        y:
            player.y,

        life:
            0.22,

        maxLife:
            0.22,

        color:
            "#ff5a53"
    });

    if (
        player.hp <= 0
    ) {
        playerDeath();
    }
}

/* =========================================================
   MORTE
========================================================= */

function playerDeath() {
    if (
        state.player.dead
    ) {
        return;
    }

    state.player.dead =
        true;

    state.paused =
        true;

    state.pointer.down =
        false;

    state.keys.clear();

    cancelHoldInteraction();

    must(
        "deathPanel"
    ).classList.remove(
        "hidden"
    );
}

/* =========================================================
   RESPAWN
========================================================= */

function respawnPlayer() {
    const checkpoint =
        state.player.checkpoint ||
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
                state.player.maxHp *
                0.7
            )
        );

    state.player.magic =
        Math.max(
            1,
            Math.floor(
                state.player.maxMagic *
                0.7
            )
        );

    state.player.energy =
        Math.max(
            1,
            Math.floor(
                state.player.maxEnergy *
                0.7
            )
        );

    state.player.hunger =
        Math.max(
            28,
            state.player.hunger
        );

    state.player.fatigue =
        Math.max(
            28,
            state.player.fatigue
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
    ).classList.add(
        "hidden"
    );

    updateCamera();

    showToast(
        "Você retornou ao último ponto seguro."
    );
}

/* =========================================================
   DERROTAR INIMIGO
========================================================= */

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

    enemy.aggressive =
        false;

    enemy.telegraphing =
        false;

    enemy.dashState =
        null;

    spawnParticles(
        enemy.x,
        enemy.y,
        enemy.color ||
        "#ffffff",
        enemy.type ===
        "progression"
            ? 38
            : 18
    );

    state.world.effects.push({
        type:
            "enemyDeath",

        x:
            enemy.x,

        y:
            enemy.y,

        radius:
            enemy.radius *
            2.6,

        life:
            0.65,

        maxLife:
            0.65,

        color:
            enemy.color ||
            "#ffffff"
    });

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

    /*
        DROP AGORA NÃO ENTRA AUTOMATICAMENTE.

        Ele aparece no chão e o jogador
        deve aproximar e apertar E.
    */

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

        createWorldDrop(
            enemy.x,
            enemy.y,
            enemy.drop,
            amount,
            {
                source:
                    enemy.name
            }
        );
    }

    /*
        Guardião do Caminho.
    */

    if (
        enemy.id ===
        "path_guardian"
    ) {
        createWorldDrop(
            enemy.x +
            24,
            enemy.y,
            "flautaMemoria",
            1,
            {
                permanent:
                    true,

                source:
                    enemy.name
            }
        );

        showToast(
            "A Flauta da Memória caiu no chão. Aproxime-se e pressione E."
        );
    }

    /*
        Boss de recurso volta depois.
    */

    if (
        enemy.type ===
        "resourceBoss"
    ) {
        enemy.respawnTimer =
            enemy.respawnTime ||
            60;
    }

    /*
        Tipos do Inferno.
    */

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

    /*
        Bosses de progressão.
    */

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
            `Boss derrotado: ${enemy.name}. Registro atualizado no Livro.`
        );
    }

    /*
        Boss final.
    */

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

/* =========================================================
   CRIAR DROP NO CHÃO
========================================================= */

function createWorldDrop(
    x,
    y,
    type,
    amount = 1,
    extra = {}
) {
    if (
        !ITEMS[
            type
        ]
    ) {
        return null;
    }

    const drop = {
        id:
            uid(
                "drop"
            ),

        x:
            x +
            random(
                -13,
                13
            ),

        y:
            y +
            random(
                -13,
                13
            ),

        type,

        amount:
            Math.max(
                1,
                Math.floor(
                    amount
                )
            ),

        life:
            extra.permanent
                ? Infinity
                : 60,

        bobOffset:
            random(
                0,
                Math.PI *
                2
            ),

        collected:
            false,

        permanent:
            Boolean(
                extra.permanent
            ),

        source:
            extra.source ||
            null
    };

    state.world.drops.push(
        drop
    );

    return drop;
}

/* =========================================================
   COLETAR DROP
========================================================= */

function collectWorldDrop(drop) {
    if (
        !drop ||
        drop.collected
    ) {
        return;
    }

    if (
        !ITEMS[
            drop.type
        ]
    ) {
        drop.collected =
            true;

        return;
    }

    if (
        ITEMS[
            drop.type
        ].unique &&
        (
            state.player.inventory[
                drop.type
            ] ||
            0
        ) >
        0
    ) {
        showToast(
            "Você já possui este item especial."
        );

        return;
    }

    addItem(
        drop.type,
        drop.amount
    );

    drop.collected =
        true;

    spawnParticles(
        drop.x,
        drop.y,
        "#ffe4a0",
        12
    );

    const item =
        ITEMS[
            drop.type
        ];

    showToast(
        `${item.name} coletado: x${drop.amount}`
    );

    if (
        drop.type ===
        "flautaMemoria"
    ) {
        showToast(
            "Flauta da Memória obtida. Ela parece reagir ao Céu."
        );
    }

    saveGame(
        false
    );
}

/* =========================================================
   ATUALIZAR DROPS
========================================================= */

function updateWorldDrops(dt) {
    for (
        const drop of
        state.world.drops
    ) {
        if (
            drop.collected
        ) {
            continue;
        }

        if (
            Number.isFinite(
                drop.life
            )
        ) {
            drop.life -=
                dt;
        }
    }

    state.world.drops =
        state.world.drops.filter(
            drop =>
                !drop.collected &&
                (
                    !Number.isFinite(
                        drop.life
                    ) ||
                    drop.life >
                    0
                )
        );
}

/* =========================================================
   LEVEL UP
========================================================= */

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

        player.damage +=
            2;

        player.defense +=
            1;

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

        state.world.effects.push({
            type:
                "levelUp",

            x:
                player.x,

            y:
                player.y,

            radius:
                140,

            life:
                1.2,

            maxLife:
                1.2,

            color:
                "#ffe38f"
        });

        spawnParticles(
            player.x,
            player.y,
            "#ffe38f",
            36
        );

        if (
            player.level ===
            5
        ) {
            showToast(
                "NÍVEL 5! Sua habilidade R foi desbloqueada."
            );
        }

        else if (
            player.level ===
            10
        ) {
            showToast(
                "NÍVEL 10! Sua habilidade F foi desbloqueada."
            );
        }

        else {
            showToast(
                `Você chegou ao nível ${player.level}!`
            );
        }
    }
}

/* =========================================================
   INVENTÁRIO - ADICIONAR ITEM
========================================================= */

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
        state.player
            .inventory[
                id
            ] ===
        undefined
    ) {
        state.player
            .inventory[
                id
            ] =
            0;
    }

    if (
        ITEMS[id].unique &&
        state.player
            .inventory[
                id
            ] >
        0
    ) {
        return false;
    }

    state.player
        .inventory[
            id
        ] +=
        safeAmount;

    return true;
}

/* =========================================================
   INVENTÁRIO - REMOVER ITEM
========================================================= */

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
            ?.[
                id
            ] ||
        0;

    if (
        current <
        safeAmount
    ) {
        return false;
    }

    state.player
        .inventory[
            id
        ] =
        current -
        safeAmount;

    return true;
}

/* =========================================================
   COLETA DE ÁRVORE
========================================================= */

function harvestTree(tree) {
    if (
        !tree
            ?.alive
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
            0.75
        );

    state.player.fatigue =
        Math.max(
            0,
            state.player.fatigue -
            1.5
        );

    tree.alive =
        false;

    tree.respawn =
        random(
            18,
            30
        );

    addItem(
        "madeira",
        tree.amount
    );

    const key =
        `tree:${state.area}`;

    const count =
        state.player
            .collected[
                key
            ] ||
        0;

    state.player
        .collected[
            key
        ] =
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

    /*
        Mais efeito de madeira.
    */

    for (
        let i = 0;
        i <
        3;
        i++
    ) {
        state.world.effects.push({
            type:
                "woodChunk",

            x:
                tree.x +
                random(
                    -15,
                    15
                ),

            y:
                tree.y +
                random(
                    -10,
                    10
                ),

            vx:
                random(
                    -55,
                    55
                ),

            vy:
                random(
                    -85,
                    -30
                ),

            life:
                random(
                    0.6,
                    0.9
                ),

            maxLife:
                0.9,

            color:
                "#9b7345"
        });
    }

    spawnParticles(
        tree.x,
        tree.y,
        "#9b7345",
        18
    );

    checkLevelUp();

    showToast(
        `Madeira coletada: x${tree.amount}`
    );
}

/* =========================================================
   COLETA DE MINÉRIO
========================================================= */

function collectResource(
    resource
) {
    if (
        !resource
            ?.alive
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
            0.8
        );

    state.player.fatigue =
        Math.max(
            0,
            state.player.fatigue -
            1.7
        );

    resource.alive =
        false;

    resource.respawn =
        random(
            24,
            40
        );

    addItem(
        resource.type,
        resource.amount
    );

    const key =
        `resource:${state.area}:${resource.type}`;

    const count =
        state.player
            .collected[
                key
            ] ||
        0;

    state.player
        .collected[
            key
        ] =
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

    state.world.effects.push({
        type:
            "resourceBreak",

        x:
            resource.x,

        y:
            resource.y,

        life:
            0.55,

        maxLife:
            0.55,

        color:
            resource.type ===
            "rubi"
                ? "#ff5677"
                : resource.type ===
                  "ouro"
                ? "#f6cd57"
                : resource.type ===
                  "cristal"
                ? "#b995ff"
                : "#aeb8bd"
    });

    spawnParticles(
        resource.x,
        resource.y,
        resource.type ===
        "rubi"
            ? "#ff6685"
            : resource.type ===
              "ouro"
            ? "#ffd86a"
            : resource.type ===
              "cristal"
            ? "#bea3ff"
            : "#a9b4b9",
        18
    );

    checkLevelUp();

    showToast(
        `${ITEMS[resource.type].name} coletado: x${resource.amount}`
    );
}

/* =========================================================
   COLETA SEGURANDO E
========================================================= */

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
            ? 2.2
            : interaction.object.type ===
              "rubi"
            ? 2.9
            : interaction.object.type ===
              "ouro"
            ? 2.35
            : 1.8;

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
            : `Coletando ${
                ITEMS[
                    interaction.object.type
                ]?.name ||
                "recurso"
            }...`;

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

/* =========================================================
   CANCELAR COLETA
========================================================= */

function cancelHoldInteraction() {
    state.holdAction =
        null;

    const panel =
        $(
            "holdProgress"
        );

    if (
        panel
    ) {
        panel.classList.add(
            "hidden"
        );
    }

    const fill =
        $(
            "holdProgressFill"
        );

    if (
        fill
    ) {
        fill.style.width =
            "0%";
    }
}

/* =========================================================
   ATUALIZAR COLETA SEGURANDO E
========================================================= */

function updateHoldInteraction(dt) {
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
        !hold.object
            ?.alive
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

    /*
        Pequenas partículas enquanto coleta.
    */

    if (
        Math.random() <
        0.08
    ) {
        spawnParticles(
            hold.object.x,
            hold.object.y,
            hold.type ===
            "tree"
                ? "#b48555"
                : "#c7ced0",
            2
        );
    }

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

/* =========================================================
   COMER CENOURA DO CHÃO
========================================================= */

function eatWorldFood(food) {
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
            120,
            food.respawnMax ||
            180
        );

    if (
        food.type ===
        "carrot"
    ) {
        const hungerGain =
            food.hunger ||
            12;

        state.player.hunger =
            Math.min(
                100,
                state.player.hunger +
                hungerGain
            );

        state.player.hp =
            Math.min(
                state.player.maxHp,
                state.player.hp +
                2
            );

        showToast(
            `Você comeu uma cenoura. +${hungerGain} fome.`
        );

        spawnParticles(
            food.x,
            food.y,
            "#f3a34e",
            11
        );
    }
}

/* =========================================================
   ATUALIZAR RECURSOS / COMIDA
========================================================= */

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

    updateWorldDrops(
        dt
    );
}

/* =========================================================
   RESPAWN DE ÁRVORE
========================================================= */

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
        state.world
            .obstacles
            .find(
                item =>
                    item.treeId ===
                    tree.id
            );

    if (
        obstacle
    ) {
        obstacle.x =
            x -
            30;

        obstacle.y =
            y -
            38;
    }
}

/* =========================================================
   EASTER EGG / SEGREDO
========================================================= */

function discoverSecret(secret) {
    if (
        !secret ||
        secret.found ||
        state.player
            .secretsFound
            .includes(
                secret.id
            )
    ) {
        return;
    }

    secret.found =
        true;

    state.player
        .secretsFound
        .push(
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

    state.world.effects.push({
        type:
            "secretReveal",

        x:
            secret.x,

        y:
            secret.y,

        radius:
            100,

        life:
            1.15,

        maxLife:
            1.15,

        color:
            "#e7ca83"
    });

    spawnParticles(
        secret.x,
        secret.y,
        "#e7ca83",
        25
    );

    checkLevelUp();

    showToast(
        `${secret.title}: ${secret.message}`
    );

    saveGame(
        false
    );
}

/* =========================================================
   PARTÍCULAS
========================================================= */

function spawnParticles(
    x,
    y,
    color,
    amount
) {
    for (
        let i = 0;
        i <
        amount;
        i++
    ) {
        const angle =
            random(
                0,
                Math.PI *
                2
            );

        const speed =
            random(
                25,
                95
            );

        state.world
            .particles
            .push({
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
                        0.35,
                        0.85
                    ),

                maxLife:
                    0.85,

                size:
                    random(
                        2,
                        5
                    ),

                color
            });
    }
}

/* =========================================================
   ATUALIZAR PARTÍCULAS E EFEITOS
========================================================= */

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
                    32 *
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
                /*
                    Alguns efeitos ambientais
                    não possuem life.
                */

                if (
                    !Number.isFinite(
                        effect.life
                    )
                ) {
                    return true;
                }

                effect.life -=
                    dt;

                /*
                    Movimento de pedaço de madeira.
                */

                if (
                    effect.type ===
                    "woodChunk"
                ) {
                    effect.x +=
                        effect.vx *
                        dt;

                    effect.y +=
                        effect.vy *
                        dt;

                    effect.vy +=
                        120 *
                        dt;
                }

                return (
                    effect.life >
                    0
                );
            }
        );
}
   /* =========================================================
   INTERAÇÃO MAIS PRÓXIMA
========================================================= */

function getInteraction() {
    if (
        !state.player
    ) {
        return null;
    }

    /*
        =====================================================
        INTERIOR DAS CASAS
        =====================================================
    */

    if (
        state.houseMode
    ) {
        let best =
            null;

        let bestDistance =
            Infinity;

        const room =
            getHouseRoom();

        /*
            Cama da casa do jogador.
        */

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
                    101
            };

            const d =
                distance(
                    state.player,
                    bed
                );

            if (
                d <=
                105
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

        /*
            NPCs internos.
        */

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
                82 &&
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

        /*
            Porta de saída.
        */

        const door = {
            x:
                room.x +
                room.w /
                2,

            y:
                room.y +
                room.h -
                15
        };

        const doorDistance =
            distance(
                state.player,
                door
            );

        if (
            doorDistance <=
                88 &&
            doorDistance <
                bestDistance
        ) {
            best = {
                type:
                    "exitHouse",

                object:
                    state.currentHouse
            };
        }

        return best;
    }

    /*
        =====================================================
        MUNDO EXTERNO
        =====================================================
    */

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

    /*
        NPC.
    */

    state.world.npcs.forEach(
        npc => {
            test(
                "npc",
                npc,
                74
            );
        }
    );

    /*
        Árvores.
    */

    state.world.trees
        .filter(
            tree =>
                tree.alive
        )
        .forEach(
            tree => {
                test(
                    "tree",
                    tree,
                    80
                );
            }
        );

    /*
        Minérios.
    */

    state.world.resources
        .filter(
            resource =>
                resource.alive
        )
        .forEach(
            resource => {
                test(
                    "resource",
                    resource,
                    78
                );
            }
        );

    /*
        Comida.
    */

    state.world.foods
        .filter(
            food =>
                food.alive
        )
        .forEach(
            food => {
                test(
                    "food",
                    food,
                    72
                );
            }
        );

    /*
        Drops de inimigos.
    */

    state.world.drops
        .filter(
            drop =>
                !drop.collected
        )
        .forEach(
            drop => {
                test(
                    "drop",
                    drop,
                    82
                );
            }
        );

    /*
        Segredos.
    */

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
            secret => {
                test(
                    "secret",
                    secret,
                    78
                );
            }
        );

    /*
        Altares.
    */

    state.world.trials.forEach(
        trial => {
            test(
                "trial",
                trial,
                95
            );
        }
    );

    /*
        Bosses.
    */

    state.world.enemies
        .filter(
            enemy =>
                !enemy.dead &&
                enemy.type ===
                "progression"
        )
        .forEach(
            enemy => {
                test(
                    "boss",
                    enemy,
                    120
                );
            }
        );

    /*
        Casas.
    */

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
                92 &&
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

/* =========================================================
   AÇÃO DO PLAYER
========================================================= */

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

    /*
        NPC.
    */

    if (
        interaction.type ===
        "npc"
    ) {
        if (
            interaction.object
                .merchant
        ) {
            openShop(
                interaction.object
            );
        }

        else if (
            interaction.object
                .questId
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

    /*
        Árvore/minério.
    */

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

    /*
        Drop.
    */

    if (
        interaction.type ===
        "drop"
    ) {
        collectWorldDrop(
            interaction.object
        );

        return;
    }

    /*
        Comida.
    */

    if (
        interaction.type ===
        "food"
    ) {
        eatWorldFood(
            interaction.object
        );

        return;
    }

    /*
        Segredo.
    */

    if (
        interaction.type ===
        "secret"
    ) {
        discoverSecret(
            interaction.object
        );

        return;
    }

    /*
        Horda do Céu.
    */

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

    /*
        Dormir.
    */

    if (
        interaction.type ===
        "sleep"
    ) {
        sleepAtHome();

        return;
    }

    /*
        Boss.
    */

    if (
        interaction.type ===
        "boss"
    ) {
        if (
            !interaction.object
                .accepted
        ) {
            openBattle(
                interaction.object
            );
        }

        return;
    }

    /*
        Sair da casa.
    */

    if (
        interaction.type ===
        "exitHouse"
    ) {
        exitHouse();
    }
}

/* =========================================================
   BOTÃO Z
========================================================= */

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
        const interaction =
            getInteraction();

        if (
            interaction?.type ===
            "exitHouse"
        ) {
            exitHouse();
        }

        else {
            showToast(
                "Aproxime-se da porta para sair."
            );
        }

        return;
    }

    enterNearestHouse();
}

/* =========================================================
   ENTRAR EM CASA
========================================================= */

function enterNearestHouse() {
    if (
        !state.world
            .buildings
            .length
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
                92 &&
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

    state.pointer.down =
        false;

    state.keys.clear();

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

            if (
                closest.id ===
                "home"
            ) {
                showToast(
                    "Sua cama fica no canto superior esquerdo. Aproxime-se e pressione E para dormir."
                );
            }

            else {
                showToast(
                    `Você entrou em ${closest.name}.`
                );
            }
        },
        390
    );
}

/* =========================================================
   SAIR DA CASA
========================================================= */

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

    state.pointer.down =
        false;

    state.keys.clear();

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

            state.world
                .interiorObstacles =
                [];

            state.player.x =
                returnPoint.x;

            state.player.y =
                returnPoint.y;

            state.houseReturn =
                null;

            must(
                "transitionScreen"
            ).classList.add(
                "hidden"
            );

            state.paused =
                false;

            updateCamera();
        },
        360
    );
}

/* =========================================================
   DIÁLOGO
========================================================= */

function startDialogue(npc) {
    state.pointer.down =
        false;

    state.dialogue = {
        npc,

        lines:
            Array.isArray(
                npc.lines
            )
                ? npc.lines.slice()
                : [
                    "..."
                ],

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
        ] ||
        "...";

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

/* =========================================================
   MISSÕES
========================================================= */

function openQuest(npc) {
    state.questNPC =
        npc;

    state.pointer.down =
        false;

    const quest =
        state.player
            .quest[
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
        state.player
            .inventory[
                item
            ] ||
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
            ? "Bran precisa de 10 madeiras para reforçar construções da Vila do Crepúsculo."
            : "Borin precisa de 8 carvões para manter a forja acesa.";

    must(
        "questStatus"
    ).textContent =
        `Progresso: ${
            Math.min(
                current,
                quest.need
            )
        } / ${quest.need}`;

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
        state.player
            .quest[
                npc.questId
            ];

    if (
        !quest
    ) {
        return;
    }

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

        saveGame(
            false
        );

        return;
    }

    if (
        quest.state ===
        "accepted"
    ) {
        if (
            (
                state.player
                    .inventory[
                        item
                    ] ||
                0
            ) <
            quest.need
        ) {
            showToast(
                "Você ainda não possui todos os materiais."
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

        showToast(
            "Missão concluída! Recompensa recebida."
        );

        saveGame(
            false
        );

        openQuest(
            npc
        );
    }
}

/* =========================================================
   BATALHAS DE BOSSES
========================================================= */

function openBattle(enemy) {
    if (
        !enemy ||
        enemy.dead
    ) {
        return;
    }

    state.battle =
        enemy;

    state.paused =
        true;

    state.pointer.down =
        false;

    state.keys.clear();

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

    must(
        "battleIcon"
    ).textContent =
        enemy.icon;

    must(
        "battleTitle"
    ).textContent =
        enemy.name;

    let description =
        "Esta criatura protege a passagem e ficará agressiva quando o desafio começar.";

    if (
        enemy.special
    ) {
        description =
            "Este Guardião possui habilidades especiais. Observe os avisos vermelhos no chão e saia das áreas antes do impacto.";
    }

    if (
        enemy.id ===
        "forest_guardian"
    ) {
        description =
            "O antigo Guardião da Estrada esqueceu quem deveria proteger. Ele usa ondas de energia e persegue qualquer um que aceite o desafio.";
    }

    else if (
        enemy.id ===
        "grove_guardian"
    ) {
        description =
            "As raízes do Guardião da Floresta foram corrompidas. Seus círculos de raízes surgem sob os pés do jogador.";
    }

    else if (
        enemy.id ===
        "iron_guardian"
    ) {
        description =
            "A Sentinela das Montanhas controla a própria pedra. Observe os círculos antes da chuva de rochas.";
    }

    else if (
        enemy.id ===
        "final_gate_guardian"
    ) {
        description =
            "O Guardião Supremo domina o Inferno. Conforme perde vida, seus ataques se tornam mais numerosos e rápidos.";
    }

    must(
        "battleText"
    ).textContent =
        description;

    must(
        "battlePanel"
    ).classList.remove(
        "hidden"
    );

    saveGame(
        false
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

    state.battle.specialTimer =
        Math.min(
            state.battle.specialTimer ||
            1.5,
            1.5
        );

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

/* =========================================================
   CINCO HORDAS DO CÉU
========================================================= */

function startSkyTrial() {
    if (
        state.area !==
        "sky"
    ) {
        return;
    }

    const trial =
        state.player.skyTrial;

    if (
        trial.complete
    ) {
        showToast(
            "As cinco hordas já foram derrotadas."
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
        trial.wave +
        1
    );
}

function spawnSkyWave(wave) {
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
        i <
        amount;
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
                wave >= 4
                    ? "SENTINELA CELESTE"
                    : "SERAFIM DA HORDA",

            icon:
                wave >= 4
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
                680,

            attackRange:
                78,

            radius:
                25 +
                Math.floor(
                    wave /
                    3
                ),

            color:
                wave >= 4
                    ? "#e5c77e"
                    : "#cbd7df",

            drop:
                wave ===
                5
                    ? "cristal"
                    : null,

            dropAmount:
                1,

            dropChance:
                0.55,

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
        `HORDA ${wave}/5 — sobreviva!`
    );

    saveGame(
        false
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

        state.hordeNextAt =
            performance.now() +
            1800;
    }

    if (
        trial.activeWave ===
            0 &&
        trial.wave <
            5 &&
        state.hordeNextAt &&
        performance.now() >=
            state.hordeNextAt
    ) {
        state.hordeNextAt =
            0;

        spawnSkyWave(
            trial.wave +
            1
        );
    }
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
            1480,

        maxHp:
            1480,

        damage:
            55,

        speed:
            74,

        vision:
            450,

        attackRange:
            110,

        radius:
            44,

        color:
            "#d8bd76",

        /*
            A flauta é criada manualmente
            após a morte para impedir
            drop duplo.
        */

        drop:
            null,

        dropAmount:
            0,

        special:
            "crystalRain"
    });
}

/* =========================================================
   FLAUTA DA MEMÓRIA
========================================================= */

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
        !state.player
            .inventory
            .flautaMemoria
    ) {
        showToast(
            "Você ainda não possui a Flauta da Memória."
        );

        return;
    }

    if (
        state.player
            .flutePlayed
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

    state.pointer.down =
        false;

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
        1300
    );
}

/* =========================================================
   PORTAIS
========================================================= */

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
            typeof portal
                .requirement ===
            "function"
                ? portal.requirement()
                : true;

        if (
            !unlocked
        ) {
            showToast(
                portal.stairs
                    ? "A passagem ainda não foi revelada."
                    : "Este caminho continua bloqueado."
            );

            /*
                Afasta do portal.
            */

            if (
                portal.x <
                state.world.width /
                2
            ) {
                state.player.x =
                    portal.x +
                    portal.w +
                    55;
            }

            else {
                state.player.x =
                    portal.x -
                    55;
            }

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

    state.pointer.down =
        false;

    state.keys.clear();

    must(
        "travelText"
    ).textContent =
        portal.returnPortal
            ? `Deseja retornar para ${REGIONS[portal.target].name}?`
            : `Você encontrou um caminho para ${portal.title}. Deseja continuar?`;

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

    const portal =
        state.travel;

    const target =
        portal.target;

    state.travel =
        null;

    must(
        "travelPanel"
    ).classList.add(
        "hidden"
    );

    transitionTo(
        target,
        portal
    );
}

function cancelTravel() {
    const portal =
        state.travel;

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

    if (
        portal
    ) {
        if (
            portal.x <
            state.world.width /
            2
        ) {
            state.player.x =
                portal.x +
                portal.w +
                55;
        }

        else {
            state.player.x =
                portal.x -
                55;
        }
    }
}

/* =========================================================
   MUDAR DE REGIÃO
========================================================= */

function transitionTo(
    target,
    portal = null
) {
    if (
        !REGIONS[
            target
        ]
    ) {
        return;
    }

    const oldArea =
        state.area;

    state.paused =
        true;

    state.pointer.down =
        false;

    state.keys.clear();

    cancelHoldInteraction();

    must(
        "transitionMessage"
    ).textContent =
        REGIONS[
            target
        ].name;

    must(
        "transitionScreen"
    ).classList.remove(
        "hidden"
    );

    setTimeout(
        () => {
            state.player.lastRegion =
                oldArea;

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

            /*
                Portal de avanço:
                entra pela esquerda.

                Portal de retorno:
                entra pela direita.
            */

            const arrivalSide =
                portal
                    ?.entrySide ||
                "left";

            if (
                arrivalSide ===
                "right"
            ) {
                state.player.x =
                    state.world.width -
                    165;
            }

            else {
                state.player.x =
                    165;
            }

            state.player.y =
                state.world.height /
                2;

            /*
                Evita nascer exatamente
                dentro de obstáculo.
            */

            let safety =
                0;

            while (
                !canPlayerMoveTo(
                    state.player.x,
                    state.player.y,
                    state.player.radius
                ) &&
                safety <
                30
            ) {
                state.player.y +=
                    28;

                if (
                    state.player.y >
                    state.world.height -
                    150
                ) {
                    state.player.y =
                        state.world.height /
                        2 -
                        safety *
                        12;
                }

                safety++;
            }

            state.player.checkpoint = {
                area:
                    target,

                x:
                    state.player.x,

                y:
                    state.player.y
            };

            /*
                Entrar em região nova recupera
                um pouco, mas não enche a vida.
            */

            state.player.magic =
                Math.min(
                    state.player.maxMagic,
                    state.player.magic +
                    state.player.maxMagic *
                    0.25
                );

            state.player.energy =
                Math.min(
                    state.player.maxEnergy,
                    state.player.energy +
                    state.player.maxEnergy *
                    0.30
                );

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
                1.5;

            state.paused =
                false;

            must(
                "transitionScreen"
            ).classList.add(
                "hidden"
            );

            updateCamera();

            saveGame(
                false
            );

            showToast(
                `Você chegou a ${REGIONS[target].name}.`
            );
        },
        670
    );
}

/* =========================================================
   INVENTÁRIO
========================================================= */

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

    Object.entries(
        state.player.inventory
    ).forEach(
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
                ITEMS[
                    id
                ];

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
                () => {
                    useItem(
                        id
                    );
                }
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
    ).forEach(
        (
            [
                id,
                amount
            ]
        ) => {
            weight +=
                (
                    ITEMS[
                        id
                    ]?.weight ||
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

/* =========================================================
   USAR ITEM
========================================================= */

function useItem(id) {
    const item =
        ITEMS[
            id
        ];

    if (
        !item ||
        !state.player
    ) {
        return;
    }

    if (
        (
            state.player
                .inventory[
                    id
                ] ||
            0
        ) <=
        0
    ) {
        return;
    }

    /*
        Flauta.
    */

    if (
        id ===
        "flautaMemoria"
    ) {
        useMemoryFlute();

        return;
    }

    /*
        Comida.
    */

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

    /*
        Poção.
    */

    else if (
        item.heal
    ) {
        if (
            state.player.hp >=
            state.player.maxHp
        ) {
            showToast(
                "Sua vida já está cheia."
            );

            return;
        }

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

        spawnParticles(
            state.player.x,
            state.player.y,
            "#ff7777",
            18
        );

        showToast(
            "Poção de cura usada."
        );
    }

    /*
        Energia.
    */

    else if (
        item.energy
    ) {
        if (
            state.player.energy >=
            state.player.maxEnergy
        ) {
            showToast(
                "Sua energia já está cheia."
            );

            return;
        }

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

    /*
        Arma.
    */

    else if (
        item.damage
    ) {
        state.player
            .equipment
            .weapon =
            id;

        showToast(
            `${item.name} equipada.`
        );
    }

    /*
        Armadura.
    */

    else if (
        item.defense
    ) {
        state.player
            .equipment
            .armor =
            id;

        showToast(
            `${item.name} equipada.`
        );
    }

    updateInventory();

    updateHUD();

    saveGame(
        false
    );
}

/* =========================================================
   EQUIPAMENTOS
========================================================= */

function updateEquipment() {
    const grid =
        must(
            "equipmentGrid"
        );

    const weapon =
        ITEMS[
            state.player
                .equipment
                .weapon
        ]?.name ||
        "Nenhuma";

    const armor =
        ITEMS[
            state.player
                .equipment
                .armor
        ]?.name ||
        "Nenhuma";

    const tool =
        ITEMS[
            state.player
                .equipment
                .tool
        ]?.name ||
        "Nenhuma";

    grid.innerHTML = `
        <div class="equipment-slot">

            Arma

            <strong>
                ${weapon}
            </strong>

            ${
                state.player
                    .equipment
                    .weapon
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
                state.player
                    .equipment
                    .armor
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
                        state.player
                            .equipment[
                                button.dataset
                                    .unequip
                            ] =
                            null;

                        updateInventory();

                        saveGame(
                            false
                        );
                    }
                );
            }
        );
}

/* =========================================================
   LOJA
========================================================= */

function openShop(npc) {
    state.shopNPC =
        npc;

    state.shopMode =
        "buy";

    state.pointer.down =
        false;

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

/* =========================================================
   RENDERIZAR LOJA
========================================================= */

function renderShop() {
    const grid =
        must(
            "shopGrid"
        );

    grid.innerHTML =
        "";

    /*
        COMPRAR.
    */

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
        ].forEach(
            id => {
                const item =
                    ITEMS[
                        id
                    ];

                const row =
                    createShopRow(
                        item,

                        `Comprar por ${item.value} moedas`,

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

                            saveGame(
                                false
                            );
                        }
                    );

                grid.appendChild(
                    row
                );
            }
        );

        return;
    }

    /*
        =====================================================
        VENDER TUDO
        =====================================================
    */

    const sellAllWrap =
        document.createElement(
            "div"
        );

    sellAllWrap.className =
        "sell-all-row";

    const sellAllButton =
        document.createElement(
            "button"
        );

    sellAllButton.type =
        "button";

    sellAllButton.className =
        "primary-btn sell-all-btn";

    const sellable =
        getSellAllValue();

    sellAllButton.textContent =
        sellable.value >
        0
            ? `VENDER TUDO • ${sellable.value} MOEDAS`
            : "NADA PARA VENDER";

    sellAllButton.disabled =
        sellable.value <=
        0;

    sellAllButton.addEventListener(
        "click",
        sellAllItems
    );

    sellAllWrap.appendChild(
        sellAllButton
    );

    grid.appendChild(
        sellAllWrap
    );

    /*
        Venda individual.
    */

    let itemCount =
        0;

    Object.entries(
        state.player.inventory
    ).forEach(
        (
            [
                id,
                amount
            ]
        ) => {
            if (
                amount <=
                0 ||
                !ITEMS[
                    id
                ]
            ) {
                return;
            }

            const item =
                ITEMS[
                    id
                ];

            /*
                Não vende:
                - itens únicos;
                - ferramenta principal;
                - arma equipada;
                - armadura equipada.
            */

            if (
                item.unique ||
                id ===
                    state.player
                        .equipment
                        .tool ||
                id ===
                    state.player
                        .equipment
                        .weapon ||
                id ===
                    state.player
                        .equipment
                        .armor
            ) {
                return;
            }

            itemCount++;

            const price =
                Math.max(
                    1,
                    Math.floor(
                        item.value *
                        0.7
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

                        saveGame(
                            false
                        );
                    }
                );

            grid.appendChild(
                row
            );
        }
    );

    if (
        itemCount ===
        0
    ) {
        const empty =
            document.createElement(
                "p"
            );

        empty.className =
            "muted";

        empty.style.textAlign =
            "center";

        empty.textContent =
            "Você não possui itens comuns disponíveis para venda.";

        grid.appendChild(
            empty
        );
    }
}

/* =========================================================
   CALCULAR VENDA TOTAL
========================================================= */

function getSellAllValue() {
    let value =
        0;

    let amount =
        0;

    const items =
        [];

    Object.entries(
        state.player.inventory
    ).forEach(
        (
            [
                id,
                count
            ]
        ) => {
            if (
                count <=
                0
            ) {
                return;
            }

            const item =
                ITEMS[
                    id
                ];

            if (
                !item
            ) {
                return;
            }

            if (
                item.unique ||
                id ===
                    state.player
                        .equipment
                        .tool ||
                id ===
                    state.player
                        .equipment
                        .weapon ||
                id ===
                    state.player
                        .equipment
                        .armor
            ) {
                return;
            }

            /*
                Mantém poções e comida.
                Vender tudo é principalmente
                para materiais e especiais comuns.
            */

            const allowedCategories = [
                "materials",
                "special"
            ];

            if (
                !allowedCategories
                    .includes(
                        item.category
                    )
            ) {
                return;
            }

            const unitPrice =
                Math.max(
                    1,
                    Math.floor(
                        item.value *
                        0.7
                    )
                );

            value +=
                unitPrice *
                count;

            amount +=
                count;

            items.push({
                id,
                count
            });
        }
    );

    return {
        value,
        amount,
        items
    };
}

/* =========================================================
   VENDER TUDO
========================================================= */

function sellAllItems() {
    const data =
        getSellAllValue();

    if (
        data.value <=
        0 ||
        !data.items.length
    ) {
        showToast(
            "Você não possui materiais disponíveis para vender."
        );

        return;
    }

    data.items.forEach(
        entry => {
            state.player
                .inventory[
                    entry.id
                ] =
                Math.max(
                    0,
                    (
                        state.player
                            .inventory[
                                entry.id
                            ] ||
                        0
                    ) -
                    entry.count
                );
        }
    );

    state.player.money +=
        data.value;

    showToast(
        `${data.amount} itens vendidos por ${data.value} moedas.`
    );

    renderShop();

    updateHUD();

    saveGame(
        false
    );
}

/* =========================================================
   LINHA DA LOJA
========================================================= */

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

/* =========================================================
   LIVRO DOS GUARDIÕES
========================================================= */

const BOSS_REGISTRY = [
    {
        id:
            "forest_guardian",

        name:
            "GUARDIÃO DA ESTRADA",

        icon:
            "👺",

        description:
            "Um antigo protetor da estrada da Vila do Crepúsculo. A Quietude apagou de sua memória quem deveria atravessar e quem deveria ser impedido.",

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
            "Último espírito que separava o Bosque das Montanhas. Seu corpo cresceu ao redor das lembranças de viajantes que nunca voltaram.",

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
            "Uma sentinela construída por um povo desaparecido. Ainda cumpre uma ordem antiga e lança pedras contra quem tenta alcançar as cavernas.",

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
            "Uma máquina de mineração que começou a defender os túneis quando seus criadores desapareceram. Ainda trabalha para mestres que já não existem.",

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
            "Uma criatura formada ao redor de um núcleo de rubi vivo. O cristal parece armazenar acontecimentos de diferentes momentos ao mesmo tempo.",

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
            "Uma sombra condensada formada por lembranças de exploradores esquecidos. Sua voz muda porque nenhuma identidade dentro dela permanece completa.",

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
            "Uma antiga fada que costurava lembranças entre flores e pessoas. Depois de ser corrompida, passou a cortar os mesmos fios que antes protegia.",

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
            "O último vigilante do Céu. Somente surge depois das Cinco Hordas e protege a Flauta da Memória.",

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
            "Uma entidade criada pela pressão de milhares de memórias destruídas. Seus ataques cobrem enormes regiões do chão conforme a luta avança.",

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
            "Uma versão do protagonista proveniente de outra possibilidade. Ele preservou memória demais e passou a acreditar que esquecer tudo seria uma forma de impedir sofrimento.",

        quote:
            "Se nada for lembrado, nada poderá sofrer."
    }
];

/* =========================================================
   ABRIR LIVRO
========================================================= */

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
                state.player
                    .defeatedBosses
                    .includes(
                        boss.id
                    ) ||
                (
                    boss.id ===
                        "other_self" &&
                    state.player
                        .finalDefeated
                );

            const discovered =
                defeated ||
                state.player
                    .discoveredBosses
                    .includes(
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
                            ${
                                defeated
                                    ? "✓ DERROTADO"
                                    : "REGISTRO DESCOBERTO"
                            }
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

    if (
        state.player
            .inventory
            .flautaMemoria >
        0
    ) {
        const flute =
            document.createElement(
                "div"
            );

        flute.className =
            "boss-entry special-book-entry";

        flute.innerHTML = `
            <div class="symbol">
                🎶
            </div>

            <strong>
                FLAUTA DA MEMÓRIA
            </strong>

            <p class="boss-lore">
                A Flauta deve ser tocada no Céu.
                Sua música faz Veyra lembrar da escada que leva ao Inferno.
            </p>
        `;

        book.appendChild(
            flute
        );
    }
}

/* =========================================================
   MAPA
========================================================= */

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

    /*
        Caminhos agora aparecem no mapa.
    */

    mapCtx.save();

    mapCtx.globalAlpha =
        0.72;

    for (
        const decoration of
        state.world.decorations
    ) {
        if (
            [
                "pathStone",
                "mountainPath",
                "fairyPath",
                "skyPath",
                "hellPath",
                "rail"
            ].includes(
                decoration.type
            )
        ) {
            const pathColors = {
                pathStone:
                    "#c1ad7b",

                mountainPath:
                    "#d0cbc0",

                fairyPath:
                    "#e4a9e9",

                skyPath:
                    "#edf1da",

                hellPath:
                    "#80605a",

                rail:
                    "#858d91"
            };

            mapCtx.fillStyle =
                pathColors[
                    decoration.type
                ] ||
                "#b0a47f";

            mapCtx.beginPath();

            mapCtx.arc(
                decoration.x *
                sx,
                decoration.y *
                sy,
                decoration.type ===
                    "pathStone"
                    ? 2.7
                    : 2.2,
                0,
                Math.PI *
                2
            );

            mapCtx.fill();
        }
    }

    mapCtx.restore();

    /*
        Casas.
    */

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

    /*
        Árvores.
    */

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

    /*
        NPC.
    */

    mapCtx.fillStyle =
        "#e0bf70";

    state.world.npcs.forEach(
        npc => {
            mapCtx.beginPath();

            mapCtx.arc(
                npc.x *
                sx,

                npc.y *
                sy,

                3.5,

                0,

                Math.PI *
                2
            );

            mapCtx.fill();
        }
    );

    /*
        Drops.
    */

    state.world.drops
        .filter(
            drop =>
                !drop.collected
        )
        .forEach(
            drop => {
                mapCtx.fillStyle =
                    drop.type ===
                    "flautaMemoria"
                        ? "#ffef9a"
                        : "#f1cc71";

                mapCtx.beginPath();

                mapCtx.arc(
                    drop.x *
                    sx,
                    drop.y *
                    sy,
                    drop.type ===
                        "flautaMemoria"
                        ? 5
                        : 3,
                    0,
                    Math.PI *
                    2
                );

                mapCtx.fill();
            }
        );

    /*
        Inimigos e bosses.
    */

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
                !state.player
                    .discoveredBosses
                    .includes(
                        enemy.id
                    ) &&
                !state.player
                    .defeatedBosses
                    .includes(
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
                    : 3,

                0,

                Math.PI *
                2
            );

            mapCtx.fill();
        }
    );

    /*
        Portais.
    */

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
                portal.returnPortal
                    ? "#d8b86f"
                    : portal.stairs
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

    /*
        Player.
    */

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

    /*
        Legenda.
    */

    mapCtx.fillStyle =
        "rgba(8,12,15,.78)";

    mapCtx.fillRect(
        14,
        14,
        330,
        70
    );

    mapCtx.fillStyle =
        "#f5ddb0";

    mapCtx.font =
        "bold 17px Georgia";

    mapCtx.textAlign =
        "left";

    mapCtx.fillText(
        REGIONS[
            state.area
        ].name,
        27,
        39
    );

    mapCtx.font =
        "12px Arial";

    mapCtx.fillStyle =
        "#d5d3ca";

    mapCtx.fillText(
        "● Você  ● NPC  ● Boss  ● Drop  ▮ Passagem",
        27,
        63
    );
}

/* =========================================================
   MINIMAPA
========================================================= */

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

    /*
        Caminhos.
    */

    miniCtx.globalAlpha =
        0.62;

    state.world.decorations.forEach(
        decoration => {
            if (
                [
                    "pathStone",
                    "mountainPath",
                    "fairyPath",
                    "skyPath",
                    "hellPath",
                    "rail"
                ].includes(
                    decoration.type
                )
            ) {
                miniCtx.fillStyle =
                    "#c6b38a";

                miniCtx.fillRect(
                    decoration.x *
                    sx,
                    decoration.y *
                    sy,
                    2,
                    2
                );
            }
        }
    );

    miniCtx.globalAlpha =
        1;

    /*
        Casas.
    */

    miniCtx.fillStyle =
        "#82654c";

    state.world.buildings.forEach(
        building => {
            miniCtx.fillRect(
                building.x *
                sx,

                building.y *
                sy,

                Math.max(
                    3,
                    building.w *
                    sx
                ),

                Math.max(
                    3,
                    building.h *
                    sy
                )
            );
        }
    );

    /*
        NPC.
    */

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

    /*
        Drops.
    */

    miniCtx.fillStyle =
        "#f3d16e";

    state.world.drops.forEach(
        drop => {
            if (
                drop.collected
            ) {
                return;
            }

            miniCtx.beginPath();

            miniCtx.arc(
                drop.x *
                sx,

                drop.y *
                sy,

                drop.type ===
                    "flautaMemoria"
                    ? 4
                    : 2.2,

                0,

                Math.PI *
                2
            );

            miniCtx.fill();
        }
    );

    /*
        Inimigos.
    */

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
                !state.player
                    .discoveredBosses
                    .includes(
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
                    : 2,

                0,

                Math.PI *
                2
            );

            miniCtx.fill();
        }
    );

    /*
        Portais.
    */

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
                portal.returnPortal
                    ? "#d5ba75"
                    : portal.stairs
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

    /*
        Player.
    */

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

/* =========================================================
   ESCOLHA FINAL
========================================================= */

function openFinalChoice() {
    if (
        state.finalChoiceShown
    ) {
        return;
    }

    state.finalChoiceShown =
        true;

    state.paused =
        true;

    state.pointer.down =
        false;

    const choice =
        window.confirm(
            "O Outro Eu oferece a Quietude Absoluta.\n\nOK = aceitar a Quietude.\nCancelar = rejeitar e lutar."
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

        boss.specialTimer =
            1;
    }

    showToast(
        "A batalha final começou."
    );
}

/* =========================================================
   FINAL
========================================================= */

function showEnding(message) {
    state.running =
        false;

    state.paused =
        true;

    state.pointer.down =
        false;

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
        2800
    );
}

/* =========================================================
   SAVES ANTIGOS COMPATÍVEIS
========================================================= */

const LEGACY_SAVE_KEYS = [
    "veyra_save_v15",
    "veyra_save_v14_stable"
];

/* =========================================================
   PEGAR SAVE DISPONÍVEL
========================================================= */

function getAvailableSaveRaw() {
    try {
        const current =
            localStorage.getItem(
                SAVE_KEY
            );

        if (
            current
        ) {
            return {
                key:
                    SAVE_KEY,

                raw:
                    current
            };
        }

        for (
            const key of
            LEGACY_SAVE_KEYS
        ) {
            const raw =
                localStorage.getItem(
                    key
                );

            if (
                raw
            ) {
                return {
                    key,
                    raw
                };
            }
        }
    }

    catch (
        error
    ) {
        console.error(
            "Erro ao procurar save:",
            error
        );
    }

    return null;
}

/* =========================================================
   SALVAR
========================================================= */

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
                16,

            area:
                state.area,

            player:
                state.player,

            houseMode:
                state.houseMode,

            currentHouseId:
                state.currentHouse
                    ?.id ||
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

/* =========================================================
   CARREGAR
========================================================= */

function loadGame() {
    try {
        const available =
            getAvailableSaveRaw();

        if (
            !available
        ) {
            return false;
        }

        const save =
            JSON.parse(
                available.raw
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
                    save.player
                        .characterId
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

        state.holdAction =
            null;

        state.pointer.down =
            false;

        state.finalChoiceShown =
            Boolean(
                state.player
                    .finalChoice
            );

        buildWorld();

        /*
            Restaurar interior.
        */

        if (
            save.houseMode &&
            state.area ===
                "village" &&
            save.currentHouseId
        ) {
            const savedHouse =
                state.world
                    .buildings
                    .find(
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

            /*
                Caso save tenha ficado
                dentro de obstáculo.
            */

            if (
                !canPlayerMoveTo(
                    state.player.x,
                    state.player.y,
                    state.player.radius
                )
            ) {
                state.player.x =
                    165;

                state.player.y =
                    state.world.height /
                    2;
            }
        }

        /*
            Migração automática de save antigo.
        */

        if (
            available.key !==
            SAVE_KEY
        ) {
            saveGame(
                false
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

        updateCamera();

        requestAnimationFrame(
            gameLoop
        );

        showToast(
            available.key ===
                SAVE_KEY
                ? "Jogo carregado."
                : "Save antigo carregado e atualizado."
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

        return false;
    }
}

/* =========================================================
   REPARAR SAVE ANTIGO
========================================================= */

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
    ).forEach(
        id => {
            const value =
                Number(
                    player.inventory[
                        id
                    ]
                );

            player.inventory[
                id
            ] =
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

    /*
        Nunca restaura inimigos temporários
        da horda anterior.
    */

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
        player.skillCooldowns[
            key
        ] =
            0;
    }

    player.damageReduction =
        0;

    player.shieldTimer =
        0;

    player.stunTimer =
        0;

    player.playerDash =
        null;

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
            Number.isFinite(
                Number(
                    player.hunger
                )
            )
                ? Number(
                    player.hunger
                )
                : 100,
            0,
            100
        );

    player.fatigue =
        clamp(
            Number.isFinite(
                Number(
                    player.fatigue
                )
            )
                ? Number(
                    player.fatigue
                )
                : 100,
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

    player.secondaryColor =
        character.secondaryColor;

    player.lastRegion =
        player.lastRegion ||
        "village";

    /*
        Verifica equipamentos que
        não existem mais.
    */

    if (
        player.equipment.weapon &&
        !ITEMS[
            player.equipment.weapon
        ]
    ) {
        player.equipment.weapon =
            null;
    }

    if (
        player.equipment.armor &&
        !ITEMS[
            player.equipment.armor
        ]
    ) {
        player.equipment.armor =
            null;
    }

    if (
        !ITEMS[
            player.equipment.tool
        ]
    ) {
        player.equipment.tool =
            "machado";
    }
}

/* =========================================================
   EXISTE SAVE?
========================================================= */

function hasSave() {
    return Boolean(
        getAvailableSaveRaw()
    );
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
   /* =========================================================
   CÂMERA
========================================================= */

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
                room.w /
                2 -
                viewW /
                2,

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
                room.h /
                2 -
                viewH /
                2,

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
            viewW /
            2,

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
            viewH /
            2,

            0,

            Math.max(
                0,
                state.world.height -
                viewH
            )
        );
}

/* =========================================================
   BARRAS
========================================================= */

function setBar(
    id,
    value,
    max
) {
    const percent =
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
        `${percent}%`;
}

/* =========================================================
   HUD
========================================================= */

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
        `${Math.ceil(
            player.hp
        )}/${player.maxHp}`;

    must(
        "magicText"
    ).textContent =
        `${Math.ceil(
            player.magic
        )}/${Math.ceil(
            player.maxMagic
        )}`;

    must(
        "energyText"
    ).textContent =
        `${Math.ceil(
            player.energy
        )}/${player.maxEnergy}`;

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

    updateSkillHUD();

    updateInteractionHint();
}

/* =========================================================
   HUD DAS HABILIDADES
========================================================= */

function updateSkillHUD() {
    if (
        !state.player
    ) {
        return;
    }

    const skills =
        getCharacterSkills();

    const data = [
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
    ];

    data.forEach(
        (
            [
                key,
                nameId,
                cooldownId
            ]
        ) => {
            const skill =
                skills[
                    key
                ];

            const slot =
                document.querySelector(
                    `[data-skill-slot="${key}"]`
                );

            if (
                !skill
            ) {
                return;
            }

            const cooldown =
                state.player
                    .skillCooldowns[
                        key
                    ] ||
                0;

            must(
                nameId
            ).textContent =
                skill.name;

            const locked =
                state.player.level <
                skill.level;

            if (
                slot
            ) {
                slot.classList.toggle(
                    "locked",
                    locked
                );

                slot.classList.toggle(
                    "cooldown",
                    !locked &&
                    cooldown >
                    0
                );
            }

            /*
                Cor própria da classe.
            */

            if (
                slot
            ) {
                slot.style.setProperty(
                    "--skill-color",
                    currentCharacter()
                        .color
                );

                slot.style.setProperty(
                    "--skill-secondary",
                    currentCharacter()
                        .secondaryColor
                );
            }

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
                    `${cooldown.toFixed(
                        1
                    )}s`;
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

/* =========================================================
   EXISTE ALGUM PAINEL ABERTO?
========================================================= */

function isGameplayOverlayOpen() {
    const ids = [
        "inventoryPanel",
        "mapPanel",
        "bookPanel",
        "shopPanel",
        "questPanel"
    ];

    return ids.some(
        id => {
            const panel =
                $(
                    id
                );

            return (
                panel &&
                !panel.classList.contains(
                    "hidden"
                )
            );
        }
    );
}

/* =========================================================
   DICA DE INTERAÇÃO
========================================================= */

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
        state.holdAction ||
        isGameplayOverlayOpen()
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
            `Entrar em ${interaction.object.name}`;

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
            "Sair da construção";

        return;
    }

    must(
        "interactionKey"
    ).textContent =
        "E";

    if (
        interaction.type ===
        "npc"
    ) {
        if (
            interaction.object
                .merchant
        ) {
            must(
                "interactionText"
            ).textContent =
                `Comprar e vender com ${interaction.object.name}`;
        }

        else if (
            interaction.object
                .questId
        ) {
            must(
                "interactionText"
            ).textContent =
                `Falar com ${interaction.object.name}`;
        }

        else {
            must(
                "interactionText"
            ).textContent =
                `Conversar com ${interaction.object.name}`;
        }

        return;
    }

    if (
        interaction.type ===
        "tree"
    ) {
        must(
            "interactionText"
        ).textContent =
            "Segure E para cortar madeira";

        return;
    }

    if (
        interaction.type ===
        "resource"
    ) {
        must(
            "interactionText"
        ).textContent =
            `Segure E para coletar ${
                ITEMS[
                    interaction.object
                        .type
                ]?.name ||
                "recurso"
            }`;

        return;
    }

    if (
        interaction.type ===
        "drop"
    ) {
        const item =
            ITEMS[
                interaction.object
                    .type
            ];

        must(
            "interactionText"
        ).textContent =
            `Pegar ${
                item?.name ||
                "item"
            } x${interaction.object.amount}`;

        return;
    }

    if (
        interaction.type ===
        "food"
    ) {
        must(
            "interactionText"
        ).textContent =
            interaction.object
                .type ===
                "carrot"
                ? "Comer cenoura"
                : "Comer";

        return;
    }

    if (
        interaction.type ===
        "secret"
    ) {
        must(
            "interactionText"
        ).textContent =
            "Investigar";

        return;
    }

    if (
        interaction.type ===
        "trial"
    ) {
        const wave =
            Math.min(
                5,
                (
                    state.player
                        .skyTrial
                        .wave ||
                    0
                ) +
                1
            );

        must(
            "interactionText"
        ).textContent =
            state.player
                .skyTrial
                .complete
                ? "Cinco hordas concluídas"
                : `Iniciar Horda ${wave}/5`;

        return;
    }

    if (
        interaction.type ===
        "sleep"
    ) {
        must(
            "interactionText"
        ).textContent =
            "DORMIR E DESCANSAR";

        return;
    }

    if (
        interaction.type ===
        "boss"
    ) {
        must(
            "interactionText"
        ).textContent =
            interaction.object
                .accepted
                ? "Guardião em combate"
                : `Desafiar ${interaction.object.name}`;
    }
}

/* =========================================================
   FECHAR PAINÉIS
========================================================= */

function closeOverlayPanelsExcept(
    exceptionId = null
) {
    const ids = [
        "inventoryPanel",
        "mapPanel",
        "bookPanel",
        "shopPanel",
        "questPanel"
    ];

    ids.forEach(
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

function togglePanel(
    panelId,
    onOpen = null
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
            typeof onOpen ===
            "function"
        ) {
            onOpen();
        }

        panel.classList.remove(
            "hidden"
        );

        state.pointer.down =
            false;

        state.keys.clear();
    }

    else {
        panel.classList.add(
            "hidden"
        );
    }
}

function closeAllPanels() {
    [
        "inventoryPanel",
        "mapPanel",
        "bookPanel",
        "shopPanel",
        "questPanel",
        "battlePanel",
        "travelPanel",
        "deathPanel"
    ].forEach(
        id => {
            const element =
                $(
                    id
                );

            if (
                element
            ) {
                element.classList.add(
                    "hidden"
                );
            }
        }
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
}

/* =========================================================
   VOLTAR PARA O MENU
========================================================= */

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

/* =========================================================
   UPDATE PRINCIPAL
========================================================= */

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

    updateSkillCooldowns(
        dt
    );

    /*
        Dash do player precisa continuar
        durante o movimento normal.
    */

    updatePlayerDash(
        dt
    );

    const overlay =
        isGameplayOverlayOpen();

    if (
        !overlay
    ) {
        updateMovement(
            dt
        );

        updateSurvival(
            dt
        );

        updateEnemies(
            dt
        );

        updateHazards(
            dt
        );

        updateHoldInteraction(
            dt
        );

        updateSkyTrial();

        checkPortals();
    }

    updateResources(
        dt
    );

    updateVisualEffects(
        dt
    );

    updateCamera();

    updateHUD();

    /*
        Segurar mouse continua atacando
        automaticamente respeitando cooldown.
    */

    if (
        !overlay &&
        state.pointer.down &&
        state.player
            .attackCooldown <=
            0 &&
        screens.game
            .classList
            .contains(
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

/* =========================================================
   LOOP
========================================================= */

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

/* =========================================================
   DESENHAR JOGO
========================================================= */

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

        drawEffects();

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

/* =========================================================
   CHÃO
========================================================= */

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

    /*
        Textura suave.
    */

    const tile =
        72;

    for (
        let y = 80;
        y <
        state.world.height -
        70;
        y +=
        tile
    ) {
        for (
            let x = 80;
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
                    ? "rgba(255,255,255,.012)"
                    : "rgba(0,0,0,.017)";

            ctx.fillRect(
                x,
                y,
                tile,
                tile
            );
        }
    }

    /*
        Montanhas.
    */

    if (
        visual ===
        "mountains"
    ) {
        ctx.fillStyle =
            "rgba(230,238,240,.20)";

        for (
            let i = 0;
            i <
            18;
            i++
        ) {
            ctx.beginPath();

            ctx.ellipse(
                180 +
                i *
                205,

                260 +
                (
                    i %
                    3
                ) *
                620,

                90,

                30,

                -0.2,

                0,

                Math.PI *
                2
            );

            ctx.fill();
        }
    }

    /*
        Caverna rubi.
    */

    if (
        visual ===
        "ruby"
    ) {
        const glow =
            0.08 +
            (
                Math.sin(
                    state.time *
                    2
                ) +
                1
            ) *
            0.025;

        ctx.fillStyle =
            `rgba(255,55,85,${glow})`;

        ctx.fillRect(
            0,
            0,
            state.world.width,
            state.world.height
        );
    }

    /*
        Reino das Fadas.
    */

    if (
        visual ===
        "fairy"
    ) {
        const glow =
            ctx.createRadialGradient(
                state.world.width /
                2,

                state.world.height /
                2,

                100,

                state.world.width /
                2,

                state.world.height /
                2,

                1300
            );

        glow.addColorStop(
            0,
            "rgba(236,185,255,.12)"
        );

        glow.addColorStop(
            1,
            "rgba(100,80,160,0)"
        );

        ctx.fillStyle =
            glow;

        ctx.fillRect(
            0,
            0,
            state.world.width,
            state.world.height
        );
    }

    /*
        Inferno.
    */

    if (
        visual ===
        "hell"
    ) {
        ctx.fillStyle =
            `rgba(255,76,24,${
                0.035 +
                (
                    Math.sin(
                        state.time *
                        2.5
                    ) +
                    1
                ) *
                0.012
            })`;

        ctx.fillRect(
            0,
            0,
            state.world.width,
            state.world.height
        );
    }

    /*
        Câmara final.
    */

    if (
        visual ===
        "final"
    ) {
        const gradient =
            ctx.createRadialGradient(
                1100,
                750,
                100,
                1100,
                750,
                850
            );

        gradient.addColorStop(
            0,
            "rgba(130,90,170,.13)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,.4)"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            state.world.width,
            state.world.height
        );
    }
}

/* =========================================================
   CAMINHOS GRANDES
========================================================= */

function drawPaths() {
    if (
        state.area ===
        "village"
    ) {
        ctx.fillStyle =
            "#b79a68";

        ctx.globalAlpha =
            0.70;

        /*
            Caminho horizontal principal.
        */

        ctx.fillRect(
            70,
            1040,
            state.world.width -
            140,
            145
        );

        /*
            Caminho vertical da praça.
        */

        ctx.fillRect(
            1525,
            70,
            150,
            state.world.height -
            140
        );

        /*
            Ramificações.
        */

        ctx.fillRect(
            520,
            1080,
            110,
            550
        );

        ctx.fillRect(
            2250,
            1080,
            105,
            410
        );

        ctx.fillRect(
            2570,
            1080,
            105,
            350
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
                : 1110;

        const divisor =
            state.area ===
            "forest"
                ? 320
                : 230;

        const amplitude =
            state.area ===
            "forest"
                ? 150
                : 115;

        ctx.lineCap =
            "round";

        ctx.lineJoin =
            "round";

        ctx.strokeStyle =
            state.area ===
            "forest"
                ? "rgba(114,101,70,.46)"
                : "rgba(118,108,77,.38)";

        ctx.lineWidth =
            state.area ===
            "forest"
                ? 115
                : 92;

        ctx.beginPath();

        for (
            let x = 90;
            x <=
            state.world.width -
            90;
            x +=
            35
        ) {
            const extra =
                state.area ===
                "grove"
                    ? Math.sin(
                        x /
                        83
                    ) *
                    22
                    : 0;

            const y =
                baseY +
                Math.sin(
                    x /
                    divisor
                ) *
                amplitude +
                extra;

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

        if (
            state.area ===
            "grove"
        ) {
            /*
                Bifurcação.
            */

            ctx.strokeStyle =
                "rgba(118,108,77,.32)";

            ctx.lineWidth =
                62;

            ctx.beginPath();

            ctx.moveTo(
                1320,
                1080
            );

            ctx.quadraticCurveTo(
                1620,
                1270,
                2050,
                1640
            );

            ctx.stroke();
        }
    }
}

/* =========================================================
   AMBIENTE
========================================================= */

function drawAmbientDetails() {
    const visual =
        REGIONS[
            state.area
        ].visual;

    /*
        Grama.
    */

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
            "rgba(25,73,36,.35)";

        ctx.lineWidth =
            2;

        for (
            let y = 105;
            y <
            state.world.height -
            100;
            y +=
            85
        ) {
            for (
                let x = 105;
                x <
                state.world.width -
                100;
                x +=
                85
            ) {
                if (
                    (
                        x *
                        7 +
                        y *
                        3
                    ) %
                    13 <
                    6
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
    }

    /*
        Vagalumes.
    */

    if (
        visual ===
        "forest" ||
        visual ===
        "grove"
    ) {
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
                    (
                        7 +
                        i %
                        4
                    )
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
                    24 +
                    state.world.height
                ) %
                state.world.height;

            const alpha =
                0.15 +
                (
                    Math.sin(
                        state.time *
                        3 +
                        i
                    ) +
                    1
                ) *
                0.14;

            ctx.fillStyle =
                `rgba(217,245,163,${alpha})`;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
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

    /*
        Vento nas montanhas.
    */

    if (
        visual ===
        "mountains"
    ) {
        ctx.strokeStyle =
            "rgba(255,255,255,.23)";

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
                    72
                ) %
                state.world.width;

            const y =
                (
                    i *
                    127 +
                    state.time *
                    12
                ) %
                state.world.height;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x +
                52,
                y -
                8
            );

            ctx.stroke();
        }
    }

    /*
        Poeira da mina.
    */

    if (
        visual ===
        "iron" ||
        visual ===
        "ruby" ||
        visual ===
        "shadow"
    ) {
        for (
            let i = 0;
            i <
            28;
            i++
        ) {
            const x =
                (
                    i *
                    347 +
                    state.time *
                    4
                ) %
                state.world.width;

            const y =
                (
                    i *
                    229 -
                    state.time *
                    8 +
                    state.world.height
                ) %
                state.world.height;

            ctx.fillStyle =
                visual ===
                "ruby"
                    ? "rgba(255,95,115,.15)"
                    : visual ===
                      "shadow"
                    ? "rgba(130,105,190,.11)"
                    : "rgba(215,220,220,.08)";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                2 +
                i %
                3,
                0,
                Math.PI *
                2
            );

            ctx.fill();
        }
    }

    /*
        Estrelas e poeira feérica.
    */

    if (
        visual ===
        "fairy"
    ) {
        for (
            let i = 0;
            i <
            34;
            i++
        ) {
            const x =
                (
                    i *
                    271 +
                    Math.sin(
                        state.time +
                        i
                    ) *
                    30 +
                    state.world.width
                ) %
                state.world.width;

            const y =
                (
                    i *
                    189 -
                    state.time *
                    (
                        5 +
                        i %
                        4
                    ) +
                    state.world.height
                ) %
                state.world.height;

            ctx.fillStyle =
                i %
                2
                    ? "rgba(255,190,240,.35)"
                    : "rgba(190,220,255,.30)";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                2.5,
                0,
                Math.PI *
                2
            );

            ctx.fill();
        }
    }

    /*
        Nuvens do Céu.
    */

    if (
        visual ===
        "sky"
    ) {
        ctx.fillStyle =
            "rgba(255,255,255,.17)";

        for (
            let i = 0;
            i <
            20;
            i++
        ) {
            const x =
                (
                    i *
                    311 +
                    state.time *
                    (
                        7 +
                        i %
                        5
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
                55 +
                i %
                4 *
                15,
                19 +
                i %
                3 *
                5,
                0,
                0,
                Math.PI *
                2
            );

            ctx.fill();
        }
    }

    /*
        Brasas.
    */

    if (
        visual ===
        "hell"
    ) {
        for (
            let i = 0;
            i <
            40;
            i++
        ) {
            const x =
                (
                    i *
                    421 +
                    Math.sin(
                        i
                    ) *
                    60
                ) %
                state.world.width;

            const y =
                (
                    i *
                    257 -
                    state.time *
                    (
                        10 +
                        i %
                        6
                    ) +
                    state.world.height
                ) %
                state.world.height;

            ctx.fillStyle =
                `rgba(255,115,45,${
                    0.22 +
                    (
                        Math.sin(
                            state.time *
                            4 +
                            i
                        ) +
                        1
                    ) *
                    0.12
                })`;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                2 +
                i %
                3,
                0,
                Math.PI *
                2
            );

            ctx.fill();
        }
    }
}

/* =========================================================
   DECORAÇÕES
========================================================= */

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

        /*
            Pedras dos caminhos.
        */

        if (
            type ===
            "pathStone" ||
            type ===
            "mountainPath" ||
            type ===
            "hellPath"
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
                type ===
                "hellPath"
                    ? "rgba(75,60,59,.82)"
                    : type ===
                      "mountainPath"
                    ? "rgba(190,192,188,.84)"
                    : decoration.moss
                    ? "rgba(124,132,103,.82)"
                    : "rgba(137,137,126,.78)";

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

        /*
            Cogumelos.
        */

        else if (
            type ===
            "mushroom"
        ) {
            const glow =
                decoration.glow
                    ? 0.62 +
                      Math.sin(
                          state.time *
                          3 +
                          x
                      ) *
                      0.18
                    : 1;

            ctx.globalAlpha =
                glow;

            ctx.fillStyle =
                "#e4d9b5";

            ctx.fillRect(
                x -
                2,
                y,
                4,
                8
            );

            ctx.fillStyle =
                decoration.glow
                    ? "#75ddff"
                    : "#b86660";

            ctx.beginPath();

            ctx.arc(
                x,
                y -
                2,
                7,
                Math.PI,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.globalAlpha =
                1;
        }

        /*
            Arbusto.
        */

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

        /*
            Tronco caído.
        */

        else if (
            type ===
            "fallenLog"
        ) {
            ctx.strokeStyle =
                "#6f4b31";

            ctx.lineWidth =
                14;

            ctx.lineCap =
                "round";

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

            ctx.lineCap =
                "butt";
        }

        /*
            Flores.
        */

        else if (
            type ===
            "flower" ||
            type ===
            "fairyFlower" ||
            type ===
            "glowingFlower"
        ) {
            const glowing =
                type ===
                "glowingFlower";

            const pulse =
                glowing
                    ? 0.65 +
                      Math.sin(
                          state.time *
                          3 +
                          decoration.phase
                      ) *
                      0.20
                    : 1;

            ctx.globalAlpha =
                pulse;

            ctx.strokeStyle =
                "#498451";

            ctx.lineWidth =
                2;

            ctx.beginPath();

            ctx.moveTo(
                x,
                y +
                7
            );

            ctx.lineTo(
                x,
                y
            );

            ctx.stroke();

            ctx.fillStyle =
                glowing
                    ? "#c6ecff"
                    : type ===
                      "fairyFlower"
                    ? "#f4a8e4"
                    : "#ef9ac9";

            for (
                let i = 0;
                i <
                5;
                i++
            ) {
                const angle =
                    (
                        Math.PI *
                        2 *
                        i
                    ) /
                    5;

                ctx.beginPath();

                ctx.arc(
                    x +
                    Math.cos(
                        angle
                    ) *
                    4,

                    y +
                    Math.sin(
                        angle
                    ) *
                    4,

                    3,

                    0,

                    Math.PI *
                    2
                );

                ctx.fill();
            }

            ctx.fillStyle =
                "#ffe37e";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                2.2,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.globalAlpha =
                1;
        }

        /*
            Vaso.
        */

        else if (
            type ===
            "flowerPot"
        ) {
            ctx.fillStyle =
                "#9b6847";

            ctx.fillRect(
                x -
                8,
                y -
                1,
                16,
                12
            );

            ctx.font =
                "19px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                "🌼",
                x,
                y
            );
        }

        /*
            Barril.
        */

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

            ctx.lineWidth =
                2;

            ctx.strokeRect(
                x -
                10,
                y -
                14,
                20,
                28
            );

            ctx.beginPath();

            ctx.moveTo(
                x -
                10,
                y -
                5
            );

            ctx.lineTo(
                x +
                10,
                y -
                5
            );

            ctx.moveTo(
                x -
                10,
                y +
                6
            );

            ctx.lineTo(
                x +
                10,
                y +
                6
            );

            ctx.stroke();
        }

        /*
            Raiz.
        */

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

        /*
            Pinheiro das montanhas.
        */

        else if (
            type ===
            "mountainPine"
        ) {
            const scale =
                decoration.scale ||
                1;

            ctx.fillStyle =
                "#654f3b";

            ctx.fillRect(
                x -
                4 *
                scale,
                y,
                8 *
                scale,
                27 *
                scale
            );

            ctx.fillStyle =
                "#475e54";

            for (
                let i = 0;
                i <
                3;
                i++
            ) {
                const yy =
                    y -
                    42 *
                    scale +
                    i *
                    16 *
                    scale;

                ctx.beginPath();

                ctx.moveTo(
                    x,
                    yy -
                    25 *
                    scale
                );

                ctx.lineTo(
                    x -
                    (
                        24 -
                        i *
                        3
                    ) *
                    scale,
                    yy +
                    20 *
                    scale
                );

                ctx.lineTo(
                    x +
                    (
                        24 -
                        i *
                        3
                    ) *
                    scale,
                    yy +
                    20 *
                    scale
                );

                ctx.closePath();

                ctx.fill();
            }

            ctx.fillStyle =
                "rgba(240,245,246,.38)";

            ctx.beginPath();

            ctx.moveTo(
                x,
                y -
                67 *
                scale
            );

            ctx.lineTo(
                x -
                14 *
                scale,
                y -
                30 *
                scale
            );

            ctx.lineTo(
                x +
                10 *
                scale,
                y -
                35 *
                scale
            );

            ctx.closePath();

            ctx.fill();
        }

        /*
            Neve.
        */

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

        /*
            Marca de vento.
        */

        else if (
            type ===
            "windMark"
        ) {
            const offset =
                Math.sin(
                    state.time *
                    2 +
                    decoration.phase
                ) *
                6;

            ctx.strokeStyle =
                "rgba(255,255,255,.20)";

            ctx.lineWidth =
                2;

            ctx.beginPath();

            ctx.moveTo(
                x -
                28 +
                offset,
                y
            );

            ctx.lineTo(
                x +
                30 +
                offset,
                y -
                6
            );

            ctx.stroke();
        }

        /*
            Trilho.
        */

        else if (
            type ===
            "rail"
        ) {
            ctx.save();

            ctx.translate(
                x,
                y
            );

            ctx.rotate(
                decoration.angle ||
                0
            );

            ctx.strokeStyle =
                "#4b4d4d";

            ctx.lineWidth =
                4;

            ctx.beginPath();

            ctx.moveTo(
                -42,
                -8
            );

            ctx.lineTo(
                42,
                -8
            );

            ctx.moveTo(
                -42,
                8
            );

            ctx.lineTo(
                42,
                8
            );

            ctx.stroke();

            ctx.strokeStyle =
                "#604b38";

            ctx.lineWidth =
                5;

            for (
                let i = -32;
                i <=
                32;
                i +=
                16
            ) {
                ctx.beginPath();

                ctx.moveTo(
                    i,
                    -13
                );

                ctx.lineTo(
                    i,
                    13
                );

                ctx.stroke();
            }

            ctx.restore();
        }

        /*
            Lanterna da mina.
        */

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

            const gradient =
                ctx.createRadialGradient(
                    x,
                    y,
                    1,
                    x,
                    y,
                    55
                );

            gradient.addColorStop(
                0,
                `rgba(255,187,94,${glow})`
            );

            gradient.addColorStop(
                1,
                "rgba(255,150,55,0)"
            );

            ctx.fillStyle =
                gradient;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                55,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.fillStyle =
                "#ffd074";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                8,
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

        /*
            Carrinho de mina.
        */

        else if (
            type ===
            "mineCart"
        ) {
            ctx.fillStyle =
                "#52575b";

            ctx.beginPath();

            ctx.moveTo(
                x -
                24,
                y -
                15
            );

            ctx.lineTo(
                x +
                24,
                y -
                15
            );

            ctx.lineTo(
                x +
                17,
                y +
                10
            );

            ctx.lineTo(
                x -
                17,
                y +
                10
            );

            ctx.closePath();

            ctx.fill();

            ctx.fillStyle =
                "#292d30";

            ctx.beginPath();

            ctx.arc(
                x -
                13,
                y +
                14,
                6,
                0,
                Math.PI *
                2
            );

            ctx.arc(
                x +
                13,
                y +
                14,
                6,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.font =
                "16px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                "⛏️",
                x,
                y -
                1
            );
        }

        /*
            Suporte de madeira da mina.
        */

        else if (
            type ===
            "woodSupport"
        ) {
            ctx.strokeStyle =
                "#6f5035";

            ctx.lineWidth =
                9;

            ctx.beginPath();

            ctx.moveTo(
                x -
                28,
                y +
                40
            );

            ctx.lineTo(
                x -
                28,
                y -
                30
            );

            ctx.lineTo(
                x +
                28,
                y -
                30
            );

            ctx.lineTo(
                x +
                28,
                y +
                40
            );

            ctx.stroke();
        }

        /*
            Estalagmite.
        */

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

        /*
            Cristais.
        */

        else if (
            type ===
            "crystalPillar" ||
            type ===
            "crystalShard" ||
            type ===
            "crystalCluster"
        ) {
            const big =
                type ===
                "crystalPillar";

            const cluster =
                type ===
                "crystalCluster";

            const pulse =
                0.60 +
                Math.sin(
                    state.time *
                    3 +
                    decoration.phase
                ) *
                0.15;

            const drawCrystal =
                (
                    cx,
                    cy,
                    w,
                    h
                ) => {
                    ctx.fillStyle =
                        `rgba(226,65,92,${pulse})`;

                    ctx.beginPath();

                    ctx.moveTo(
                        cx,
                        cy -
                        h
                    );

                    ctx.lineTo(
                        cx +
                        w,
                        cy
                    );

                    ctx.lineTo(
                        cx,
                        cy +
                        8
                    );

                    ctx.lineTo(
                        cx -
                        w,
                        cy
                    );

                    ctx.closePath();

                    ctx.fill();

                    ctx.strokeStyle =
                        "rgba(255,170,185,.45)";

                    ctx.lineWidth =
                        1;

                    ctx.stroke();
                };

            if (
                cluster
            ) {
                drawCrystal(
                    x -
                    10,
                    y +
                    4,
                    8,
                    24
                );

                drawCrystal(
                    x +
                    3,
                    y,
                    10,
                    34
                );

                drawCrystal(
                    x +
                    14,
                    y +
                    5,
                    6,
                    20
                );
            }

            else {
                drawCrystal(
                    x,
                    y,
                    big
                        ? 17
                        : 9,
                    big
                        ? 46
                        : 24
                );
            }
        }

        /*
            Névoa sombria.
        */

        else if (
            type ===
            "shadowMist"
        ) {
            ctx.fillStyle =
                "rgba(93,74,130,.12)";

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
                        i +
                        decoration.phase
                    ) *
                    16,

                    y -
                    i *
                    8,

                    20 +
                    i *
                    6,

                    0,

                    Math.PI *
                    2
                );

                ctx.fill();
            }
        }

        /*
            Olho na escuridão.
        */

        else if (
            type ===
            "shadowEye"
        ) {
            const blink =
                (
                    Math.sin(
                        state.time *
                        1.5 +
                        decoration.phase
                    ) +
                    1
                ) /
                2;

            ctx.save();

            ctx.translate(
                x,
                y
            );

            ctx.scale(
                1,
                0.25 +
                blink *
                0.75
            );

            ctx.fillStyle =
                "rgba(160,124,210,.48)";

            ctx.beginPath();

            ctx.ellipse(
                0,
                0,
                15,
                8,
                0,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.fillStyle =
                "#18131f";

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                4,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.restore();
        }

        /*
            Caminho feérico.
        */

        else if (
            type ===
            "fairyPath"
        ) {
            ctx.fillStyle =
                `rgba(244,190,255,${
                    0.25 +
                    (
                        Math.sin(
                            state.time *
                            3 +
                            decoration.phase
                        ) +
                        1
                    ) *
                    0.12
                })`;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                8,
                0,
                Math.PI *
                2
            );

            ctx.fill();
        }

        /*
            Árvore feérica.
        */

        else if (
            type ===
            "fairyTree"
        ) {
            ctx.fillStyle =
                "#72576e";

            ctx.fillRect(
                x -
                7,
                y -
                5,
                14,
                45
            );

            const pulse =
                0.60 +
                Math.sin(
                    state.time *
                    2 +
                    decoration.phase
                ) *
                0.15;

            ctx.fillStyle =
                `rgba(225,150,235,${pulse})`;

            for (
                let i = 0;
                i <
                4;
                i++
            ) {
                const angle =
                    (
                        Math.PI *
                        2 *
                        i
                    ) /
                    4;

                ctx.beginPath();

                ctx.arc(
                    x +
                    Math.cos(
                        angle
                    ) *
                    18,

                    y -
                    20 +
                    Math.sin(
                        angle
                    ) *
                    12,

                    20,

                    0,

                    Math.PI *
                    2
                );

                ctx.fill();
            }
        }

        /*
            Caminho celestial.
        */

        else if (
            type ===
            "skyPath"
        ) {
            const pulse =
                0.45 +
                Math.sin(
                    state.time *
                    2 +
                    decoration.phase
                ) *
                0.10;

            ctx.fillStyle =
                `rgba(250,245,211,${pulse})`;

            ctx.beginPath();

            ctx.ellipse(
                x,
                y,
                27,
                13,
                0,
                0,
                Math.PI *
                2
            );

            ctx.fill();
        }

        /*
            Nuvem.
        */

        else if (
            type ===
            "cloud"
        ) {
            ctx.fillStyle =
                "rgba(255,255,255,.34)";

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

        /*
            Pilar celestial.
        */

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

        /*
            Ruína celestial.
        */

        else if (
            type ===
            "skyRuin"
        ) {
            ctx.fillStyle =
                "rgba(221,221,205,.68)";

            ctx.fillRect(
                x -
                28,
                y -
                8,
                56,
                16
            );

            ctx.fillRect(
                x -
                18,
                y -
                34,
                13,
                26
            );

            ctx.fillRect(
                x +
                8,
                y -
                45,
                13,
                37
            );
        }

        /*
            Altar.
        */

        else if (
            type ===
            "trialAltar"
        ) {
            const pulse =
                0.72 +
                Math.sin(
                    state.time *
                    3
                ) *
                0.12;

            ctx.fillStyle =
                `rgba(226,210,148,${pulse})`;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                38,
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
                20,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.strokeStyle =
                "#e9ddaa";

            ctx.lineWidth =
                2;

            for (
                let i = 0;
                i <
                5;
                i++
            ) {
                const angle =
                    (
                        Math.PI *
                        2 *
                        i
                    ) /
                    5 -
                    Math.PI /
                    2;

                ctx.beginPath();

                ctx.arc(
                    x +
                    Math.cos(
                        angle
                    ) *
                    27,

                    y +
                    Math.sin(
                        angle
                    ) *
                    27,

                    3.5,

                    0,

                    Math.PI *
                    2
                );

                ctx.stroke();
            }
        }

        /*
            Lava.
        */

        else if (
            type ===
            "lavaPool"
        ) {
            const pulse =
                0.40 +
                Math.sin(
                    state.time *
                    2 +
                    decoration.phase
                ) *
                0.08;

            ctx.fillStyle =
                `rgba(241,76,25,${pulse})`;

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

            ctx.strokeStyle =
                "rgba(255,184,57,.38)";

            ctx.lineWidth =
                3;

            ctx.beginPath();

            ctx.ellipse(
                x +
                Math.sin(
                    state.time
                ) *
                5,
                y,
                32,
                13,
                0.2,
                0,
                Math.PI *
                2
            );

            ctx.stroke();
        }

        /*
            Vent de brasas.
        */

        else if (
            type ===
            "emberVent"
        ) {
            ctx.fillStyle =
                "rgba(255,132,56,.55)";

            for (
                let i = 0;
                i <
                5;
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
                            34 +
                            i *
                            13
                        ) %
                        34
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

        /*
            Fumaça.
        */

        else if (
            type ===
            "hellSmoke"
        ) {
            ctx.fillStyle =
                "rgba(25,21,25,.29)";

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

        /*
            Ossos.
        */

        else if (
            type ===
            "hellBones"
        ) {
            ctx.font =
                "25px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                "☠️",
                x,
                y
            );
        }

        /*
            Pilares finais.
        */

        else if (
            type ===
            "finalPillar"
        ) {
            const pulse =
                0.35 +
                (
                    Math.sin(
                        state.time *
                        2 +
                        decoration.phase
                    ) +
                    1
                ) *
                0.08;

            ctx.fillStyle =
                "#3c3544";

            ctx.fillRect(
                x -
                18,
                y -
                60,
                36,
                120
            );

            ctx.fillStyle =
                `rgba(184,130,225,${pulse})`;

            ctx.fillRect(
                x -
                7,
                y -
                48,
                14,
                96
            );
        }

        /*
            Fragmentos de memória.
        */

        else if (
            type ===
            "memoryShard"
        ) {
            const floatY =
                Math.sin(
                    state.time *
                    2 +
                    decoration.phase
                ) *
                8;

            ctx.save();

            ctx.translate(
                x,
                y +
                floatY
            );

            ctx.rotate(
                state.time *
                0.4 +
                decoration.phase
            );

            ctx.fillStyle =
                "rgba(193,148,238,.45)";

            ctx.beginPath();

            ctx.moveTo(
                0,
                -14
            );

            ctx.lineTo(
                8,
                0
            );

            ctx.lineTo(
                0,
                14
            );

            ctx.lineTo(
                -8,
                0
            );

            ctx.closePath();

            ctx.fill();

            ctx.restore();
        }

        /*
            PILAR DA FONTE.
        */

        else if (
            type ===
            "fountainPillar"
        ) {
            ctx.fillStyle =
                "#a3a39a";

            ctx.fillRect(
                x -
                18,
                y -
                66,
                36,
                66
            );

            ctx.fillStyle =
                "#b8b8ae";

            ctx.beginPath();

            ctx.ellipse(
                x,
                y -
                65,
                28,
                10,
                0,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.fillStyle =
                "#d0c5a4";

            ctx.beginPath();

            ctx.arc(
                x,
                y -
                81,
                11,
                0,
                Math.PI *
                2
            );

            ctx.fill();
        }

        /*
            ÁGUA DA FONTE.
        */

        else if (
            type ===
            "fountainWater"
        ) {
            for (
                let i = 0;
                i <
                5;
                i++
            ) {
                const angle =
                    (
                        Math.PI *
                        2 *
                        i
                    ) /
                    5;

                const startX =
                    x +
                    Math.cos(
                        angle
                    ) *
                    9;

                const startY =
                    y -
                    68;

                const targetX =
                    x +
                    Math.cos(
                        angle
                    ) *
                    65;

                const targetY =
                    y -
                    4;

                const sway =
                    Math.sin(
                        state.time *
                        4 +
                        i
                    ) *
                    4;

                ctx.strokeStyle =
                    "rgba(142,211,238,.68)";

                ctx.lineWidth =
                    3;

                ctx.beginPath();

                ctx.moveTo(
                    startX,
                    startY
                );

                ctx.quadraticCurveTo(
                    (
                        startX +
                        targetX
                    ) /
                    2 +
                    sway,

                    startY -
                    13,

                    targetX,
                    targetY
                );

                ctx.stroke();

                /*
                    Gotinhas.
                */

                const t =
                    (
                        state.time *
                        1.5 +
                        i *
                        0.17
                    ) %
                    1;

                const dropX =
                    (
                        1 -
                        t
                    ) *
                    (
                        1 -
                        t
                    ) *
                    startX +
                    2 *
                    (
                        1 -
                        t
                    ) *
                    t *
                    (
                        (
                            startX +
                            targetX
                        ) /
                        2 +
                        sway
                    ) +
                    t *
                    t *
                    targetX;

                const dropY =
                    (
                        1 -
                        t
                    ) *
                    (
                        1 -
                        t
                    ) *
                    startY +
                    2 *
                    (
                        1 -
                        t
                    ) *
                    t *
                    (
                        startY -
                        13
                    ) +
                    t *
                    t *
                    targetY;

                ctx.fillStyle =
                    "rgba(190,230,245,.85)";

                ctx.beginPath();

                ctx.arc(
                    dropX,
                    dropY,
                    2.5,
                    0,
                    Math.PI *
                    2
                );

                ctx.fill();
            }
        }
    }
}

/* =========================================================
   CASAS EXTERNAS
========================================================= */

function drawBuildings() {
    for (
        const building of
        state.world.buildings
    ) {
        /*
            Sombra.
        */

        ctx.fillStyle =
            "rgba(0,0,0,.25)";

        ctx.fillRect(
            building.x +
            14,
            building.y +
            17,
            building.w,
            building.h
        );

        /*
            Corpo.
        */

        ctx.fillStyle =
            building.color;

        ctx.fillRect(
            building.x,
            building.y,
            building.w,
            building.h
        );

        ctx.strokeStyle =
            "rgba(40,30,22,.45)";

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

        /*
            Telhado.
        */

        ctx.fillStyle =
            building.roof;

        ctx.beginPath();

        ctx.moveTo(
            building.x -
            25,
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
            25,
            building.y
        );

        ctx.closePath();

        ctx.fill();

        /*
            Porta.
        */

        ctx.fillStyle =
            "#452d25";

        ctx.fillRect(
            building.x +
            building.w /
            2 -
            27,
            building.y +
            building.h -
            72,
            54,
            72
        );

        ctx.fillStyle =
            "#d4b66c";

        ctx.beginPath();

        ctx.arc(
            building.x +
            building.w /
            2 +
            16,
            building.y +
            building.h -
            35,
            3,
            0,
            Math.PI *
            2
        );

        ctx.fill();

        /*
            Janelas.
        */

        ctx.fillStyle =
            "#d8c279";

        ctx.fillRect(
            building.x +
            35,
            building.y +
            60,
            52,
            43
        );

        ctx.fillRect(
            building.x +
            building.w -
            87,
            building.y +
            60,
            52,
            43
        );

        ctx.strokeStyle =
            "rgba(70,48,30,.5)";

        ctx.lineWidth =
            2;

        [
            building.x +
            61,

            building.x +
            building.w -
            61
        ].forEach(
            cx => {
                ctx.beginPath();

                ctx.moveTo(
                    cx,
                    building.y +
                    60
                );

                ctx.lineTo(
                    cx,
                    building.y +
                    103
                );

                ctx.stroke();
            }
        );

        /*
            Cada casa ganha identidade.
        */

        ctx.textAlign =
            "center";

        if (
            building.id ===
            "home"
        ) {
            ctx.font =
                "27px Arial";

            ctx.fillText(
                "🏠",
                building.x +
                building.w /
                2,
                building.y +
                44
            );

            ctx.font =
                "19px Arial";

            ctx.fillText(
                "🌼",
                building.x +
                110,
                building.y +
                building.h -
                20
            );

            ctx.fillText(
                "🌼",
                building.x +
                building.w -
                110,
                building.y +
                building.h -
                20
            );
        }

        else if (
            building.id ===
            "elianHome"
        ) {
            ctx.font =
                "25px Arial";

            ctx.fillText(
                "📚",
                building.x +
                building.w /
                2,
                building.y +
                42
            );
        }

        else if (
            building.id ===
            "forge"
        ) {
            ctx.font =
                "30px Arial";

            ctx.fillText(
                "⚒️",
                building.x +
                building.w /
                2,
                building.y +
                44
            );

            /*
                Chaminé.
            */

            ctx.fillStyle =
                "#45423f";

            ctx.fillRect(
                building.x +
                building.w -
                105,
                building.y -
                70,
                43,
                75
            );

            for (
                let i = 0;
                i <
                3;
                i++
            ) {
                ctx.fillStyle =
                    `rgba(70,70,70,${
                        0.18 -
                        i *
                        0.04
                    })`;

                ctx.beginPath();

                ctx.arc(
                    building.x +
                    building.w -
                    83 +
                    Math.sin(
                        state.time +
                        i
                    ) *
                    10,

                    building.y -
                    86 -
                    i *
                    18,

                    17 +
                    i *
                    6,

                    0,

                    Math.PI *
                    2
                );

                ctx.fill();
            }
        }

        else if (
            building.id ===
            "shop"
        ) {
            ctx.font =
                "29px Arial";

            ctx.fillText(
                "🛒",
                building.x +
                building.w /
                2,
                building.y +
                44
            );

            ctx.fillStyle =
                "#b88751";

            ctx.fillRect(
                building.x +
                90,
                building.y +
                118,
                building.w -
                180,
                14
            );

            ctx.font =
                "18px Arial";

            ctx.fillText(
                "🍞   🧪   ⚔️",
                building.x +
                building.w /
                2,
                building.y +
                130
            );
        }

        else if (
            building.id ===
            "woodshop"
        ) {
            ctx.font =
                "30px Arial";

            ctx.fillText(
                "🪚",
                building.x +
                building.w /
                2,
                building.y +
                44
            );

            ctx.font =
                "19px Arial";

            ctx.fillText(
                "🪵 🪵 🪵",
                building.x +
                105,
                building.y +
                building.h -
                18
            );
        }

        /*
            Nome.
        */

        ctx.font =
            "bold 12px Georgia";

        ctx.fillStyle =
            "#f1e0ba";

        ctx.fillText(
            building.name,
            building.x +
            building.w /
            2,
            building.y +
            building.h +
            29
        );
    }
}

/* =========================================================
   INTERIORES
========================================================= */

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

    /*
        Fundo externo escuro.
    */

    ctx.fillStyle =
        "#12100f";

    ctx.fillRect(
        0,
        0,
        state.world.width,
        state.world.height
    );

    /*
        Parede.
    */

    ctx.fillStyle =
        theme.wall;

    ctx.fillRect(
        room.x -
        25,
        room.y -
        25,
        room.w +
        50,
        room.h +
        50
    );

    /*
        Piso.
    */

    ctx.fillStyle =
        theme.floor;

    ctx.fillRect(
        room.x,
        room.y,
        room.w,
        room.h
    );

    /*
        Tábuas.
    */

    ctx.strokeStyle =
        "rgba(45,28,20,.23)";

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

    /*
        =====================================================
        CASA DO JOGADOR
        =====================================================
    */

    if (
        id ===
        "home"
    ) {
        /*
            Cama.
        */

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
            "#e3d6bc";

        ctx.fillRect(
            room.x +
            58,
            room.y +
            64,
            130,
            70
        );

        ctx.fillStyle =
            "#76564c";

        ctx.fillRect(
            room.x +
            58,
            room.y +
            64,
            130,
            25
        );

        /*
            Lua de descanso acima.
        */

        ctx.font =
            "24px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "💤",
            room.x +
            123,
            room.y +
            43
        );

        /*
            Tapete.
        */

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

        /*
            Mesa.
        */

        ctx.fillStyle =
            "#563824";

        ctx.fillRect(
            room.x +
            room.w /
            2 -
            70,
            room.y +
            room.h /
            2 -
            30,
            140,
            60
        );

        ctx.font =
            "19px Arial";

        ctx.fillText(
            "📖 🕯️",
            room.x +
            room.w /
            2,
            room.y +
            room.h /
            2 +
            7
        );

        /*
            Lareira.
        */

        ctx.fillStyle =
            "#44322d";

        ctx.fillRect(
            room.x +
            room.w -
            145,
            room.y +
            42,
            98,
            120
        );

        const flame =
            18 +
            Math.sin(
                state.time *
                6
            ) *
            4;

        ctx.fillStyle =
            "#f48a42";

        ctx.beginPath();

        ctx.ellipse(
            room.x +
            room.w -
            96,
            room.y +
            120,
            20,
            flame,
            0,
            0,
            Math.PI *
            2
        );

        ctx.fill();

        ctx.fillStyle =
            "#ffd45f";

        ctx.beginPath();

        ctx.ellipse(
            room.x +
            room.w -
            96,
            room.y +
            126,
            9,
            flame *
            0.6,
            0,
            0,
            Math.PI *
            2
        );

        ctx.fill();

        /*
            Decoração.
        */

        ctx.font =
            "22px Arial";

        ctx.fillText(
            "🪴",
            room.x +
            room.w -
            210,
            room.y +
            85
        );
    }

    /*
        =====================================================
        CASA DO ELIAN
        =====================================================
    */

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

        /*
            Estante.
        */

        ctx.fillStyle =
            "#4c3326";

        ctx.fillRect(
            room.x +
            room.w -
            165,
            room.y +
            45,
            120,
            160
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
                155,
                room.y +
                65 +
                i *
                34,
                100,
                5
            );
        }

        ctx.font =
            "18px Arial";

        for (
            let i = 0;
            i <
            4;
            i++
        ) {
            ctx.fillText(
                i %
                2
                    ? "📕📘"
                    : "📗📙",

                room.x +
                room.w -
                105,

                room.y +
                60 +
                i *
                34
            );
        }

        /*
            Mesa.
        */

        ctx.fillStyle =
            "#5a402d";

        ctx.fillRect(
            room.x +
            room.w /
            2 -
            90,
            room.y +
            room.h /
            2 -
            38,
            180,
            76
        );

        ctx.font =
            "22px Arial";

        ctx.fillText(
            "📜 ✒️",
            room.x +
            room.w /
            2,
            room.y +
            room.h /
            2 +
            8
        );
    }

    /*
        =====================================================
        FORJA
        =====================================================
    */

    else if (
        id ===
        "forge"
    ) {
        /*
            Fornalha.
        */

        ctx.fillStyle =
            "#2c2d30";

        ctx.fillRect(
            room.x +
            43,
            room.y +
            45,
            160,
            155
        );

        const furnaceGlow =
            0.7 +
            Math.sin(
                state.time *
                6
            ) *
            0.12;

        const glow =
            ctx.createRadialGradient(
                room.x +
                123,
                room.y +
                135,
                10,

                room.x +
                123,
                room.y +
                135,
                95
            );

        glow.addColorStop(
            0,
            `rgba(255,122,49,${furnaceGlow})`
        );

        glow.addColorStop(
            1,
            "rgba(255,90,30,0)"
        );

        ctx.fillStyle =
            glow;

        ctx.beginPath();

        ctx.arc(
            room.x +
            123,
            room.y +
            135,
            95,
            0,
            Math.PI *
            2
        );

        ctx.fill();

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
            18,
            0,
            Math.PI *
            2
        );

        ctx.fill();

        /*
            Bigorna.
        */

        ctx.fillStyle =
            "#24282c";

        ctx.fillRect(
            room.x +
            room.w /
            2 -
            62,
            room.y +
            room.h /
            2 -
            22,
            124,
            34
        );

        ctx.fillRect(
            room.x +
            room.w /
            2 -
            20,
            room.y +
            room.h /
            2 +
            12,
            40,
            56
        );

        ctx.font =
            "27px Arial";

        ctx.fillText(
            "🔨",
            room.x +
            room.w /
            2,
            room.y +
            room.h /
            2 -
            26
        );

        /*
            Bancada de ferramentas.
        */

        ctx.fillStyle =
            "#5e4530";

        ctx.fillRect(
            room.x +
            room.w -
            205,
            room.y +
            room.h -
            145,
            155,
            70
        );

        ctx.font =
            "24px Arial";

        ctx.fillText(
            "⚒️ 🗜️ 🪛",
            room.x +
            room.w -
            128,
            room.y +
            room.h -
            100
        );

        /*
            Minérios.
        */

        ctx.font =
            "20px Arial";

        ctx.fillText(
            "⛏️ ⚙️ 🪨",
            room.x +
            room.w -
            125,
            room.y +
            70
        );
    }

    /*
        =====================================================
        LOJA
        =====================================================
    */

    else if (
        id ===
        "shop"
    ) {
        /*
            Estantes.
        */

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

        /*
            Produtos.
        */

        ctx.font =
            "23px Arial";

        ctx.fillText(
            "🥖  🍖",
            room.x +
            117,
            room.y +
            91
        );

        ctx.fillText(
            "🧪  💙",
            room.x +
            117,
            room.y +
            127
        );

        ctx.fillText(
            "📦  🪙",
            room.x +
            117,
            room.y +
            163
        );

        ctx.fillText(
            "⚔️  🥋",
            room.x +
            room.w -
            117,
            room.y +
            91
        );

        ctx.fillText(
            "🪓  🛡️",
            room.x +
            room.w -
            117,
            room.y +
            127
        );

        ctx.fillText(
            "💎  ♦️",
            room.x +
            room.w -
            117,
            room.y +
            163
        );

        /*
            Balcão.
        */

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

        ctx.fillText(
            "💰",
            room.x +
            room.w *
            0.69,
            room.y +
            room.h *
            0.48 +
            39
        );
    }

    /*
        =====================================================
        CARPINTARIA
        =====================================================
    */

    else if (
        id ===
        "woodshop"
    ) {
        /*
            Madeira.
        */

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

        /*
            Bancada.
        */

        ctx.fillStyle =
            "#5b3c27";

        ctx.fillRect(
            room.x +
            room.w /
            2 -
            105,
            room.y +
            room.h /
            2 -
            40,
            210,
            80
        );

        ctx.font =
            "29px Arial";

        ctx.fillText(
            "🪚 🪓 🔨",
            room.x +
            room.w /
            2,
            room.y +
            room.h /
            2 +
            12
        );

        /*
            Tábuas.
        */

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

    /*
        Porta.
    */

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
        "[Z] SAIR PELA PORTA",
        room.x +
        room.w /
        2,
        room.y +
        room.h +
        35
    );

    drawInteriorNPCs();
}

/* =========================================================
   NPCS INTERNOS
========================================================= */

function drawInteriorNPCs() {
    for (
        const npc of
        getInteriorNPCs()
    ) {
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
            "#e4c29d";

        ctx.beginPath();

        ctx.arc(
            npc.x,
            npc.y -
            8,
            10,
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
            13,
            10,
            Math.PI,
            Math.PI *
            2
        );

        ctx.fill();

        /*
            Ícone do trabalho.
        */

        ctx.font =
            "17px Arial";

        ctx.textAlign =
            "center";

        if (
            npc.merchant
        ) {
            ctx.fillText(
                "💰",
                npc.x,
                npc.y -
                41
            );
        }

        else if (
            npc.questId ===
            "coal"
        ) {
            ctx.fillText(
                "⚒️",
                npc.x,
                npc.y -
                41
            );
        }

        else if (
            npc.questId ===
            "wood"
        ) {
            ctx.fillText(
                "🪚",
                npc.x,
                npc.y -
                41
            );
        }

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
            27
        );

        ctx.font =
            "10px Arial";

        ctx.fillStyle =
            "#d1c5af";

        ctx.fillText(
            npc.role,
            npc.x,
            npc.y +
            38
        );
    }
}

/* =========================================================
   ÁRVORES
========================================================= */

function drawTrees() {
    for (
        const tree of
        state.world.trees
    ) {
        if (
            !tree.alive
        ) {
            continue;
        }

        const sway =
            Math.sin(
                state.time *
                1.7 +
                tree.x
            ) *
            2.2;

        /*
            Sombra.
        */

        ctx.fillStyle =
            "rgba(0,0,0,.22)";

        ctx.beginPath();

        ctx.ellipse(
            tree.x,
            tree.y +
            30,
            36,
            11,
            0,
            0,
            Math.PI *
            2
        );

        ctx.fill();

        /*
            Tronco.
        */

        ctx.fillStyle =
            "#684a30";

        ctx.fillRect(
            tree.x -
            9,
            tree.y -
            1,
            18,
            44
        );

        /*
            Copa.
        */

        ctx.fillStyle =
            state.area ===
            "grove"
                ? "#315c3c"
                : "#305c36";

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
            state.area ===
            "grove"
                ? "#44754b"
                : "#447a45";

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

        /*
            Folhas pequenas.
        */

        ctx.fillStyle =
            "rgba(135,174,100,.35)";

        ctx.beginPath();

        ctx.arc(
            tree.x -
            18,
            tree.y -
            18,
            6,
            0,
            Math.PI *
            2
        );

        ctx.arc(
            tree.x +
            21,
            tree.y -
            35,
            5,
            0,
            Math.PI *
            2
        );

        ctx.fill();

        /*
            Contorno de interação.
        */

        if (
            distance(
                tree,
                state.player
            ) <
            82
        ) {
            ctx.strokeStyle =
                "rgba(237,205,129,.72)";

            ctx.lineWidth =
                2;

            ctx.beginPath();

            ctx.arc(
                tree.x,
                tree.y -
                10,
                41,
                0,
                Math.PI *
                2
            );

            ctx.stroke();
        }
    }
}

/* =========================================================
   RECURSOS
========================================================= */

function drawResources() {
    for (
        const resource of
        state.world.resources
    ) {
        if (
            !resource.alive
        ) {
            continue;
        }

        const pulse =
            0.85 +
            Math.sin(
                state.time *
                3 +
                resource.x
            ) *
            0.08;

        ctx.save();

        ctx.translate(
            resource.x,
            resource.y
        );

        ctx.scale(
            pulse,
            pulse
        );

        if (
            resource.type ===
            "ferro"
        ) {
            ctx.fillStyle =
                "#596267";

            ctx.beginPath();

            ctx.moveTo(
                -14,
                9
            );

            ctx.lineTo(
                -7,
                -11
            );

            ctx.lineTo(
                6,
                -15
            );

            ctx.lineTo(
                15,
                5
            );

            ctx.lineTo(
                5,
                14
            );

            ctx.closePath();

            ctx.fill();

            ctx.fillStyle =
                "#aebbc1";

            ctx.beginPath();

            ctx.arc(
                -3,
                -3,
                4,
                0,
                Math.PI *
                2
            );

            ctx.arc(
                6,
                4,
                3,
                0,
                Math.PI *
                2
            );

            ctx.fill();
        }

        else if (
            resource.type ===
            "carvao"
        ) {
            ctx.fillStyle =
                "#25282b";

            ctx.beginPath();

            ctx.moveTo(
                -13,
                8
            );

            ctx.lineTo(
                -9,
                -10
            );

            ctx.lineTo(
                7,
                -14
            );

            ctx.lineTo(
                15,
                2
            );

            ctx.lineTo(
                8,
                13
            );

            ctx.closePath();

            ctx.fill();
        }

        else if (
            resource.type ===
            "ouro"
        ) {
            ctx.fillStyle =
                "#d8b44d";

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                12,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.fillStyle =
                "#ffdf74";

            ctx.beginPath();

            ctx.arc(
                -3,
                -3,
                4,
                0,
                Math.PI *
                2
            );

            ctx.fill();
        }

        else if (
            resource.type ===
            "rubi"
        ) {
            ctx.fillStyle =
                "#d4425f";

            ctx.beginPath();

            ctx.moveTo(
                0,
                -17
            );

            ctx.lineTo(
                13,
                -3
            );

            ctx.lineTo(
                7,
                14
            );

            ctx.lineTo(
                -7,
                14
            );

            ctx.lineTo(
                -13,
                -3
            );

            ctx.closePath();

            ctx.fill();

            ctx.strokeStyle =
                "#ff9cad";

            ctx.stroke();
        }

        else if (
            resource.type ===
            "cristal"
        ) {
            ctx.fillStyle =
                "#a985e5";

            ctx.beginPath();

            ctx.moveTo(
                0,
                -18
            );

            ctx.lineTo(
                11,
                0
            );

            ctx.lineTo(
                0,
                16
            );

            ctx.lineTo(
                -11,
                0
            );

            ctx.closePath();

            ctx.fill();
        }

        ctx.restore();
    }
}

/* =========================================================
   COMIDAS NO CHÃO
========================================================= */

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

        const bob =
            Math.sin(
                state.time *
                3 +
                food.x
            ) *
            3;

        ctx.font =
            "24px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            food.type ===
            "carrot"
                ? "🥕"
                : "🍖",

            food.x,

            food.y +
            8 +
            bob
        );
    }
}

/* =========================================================
   SEGREDOS
========================================================= */

function drawSecrets() {
    for (
        const secret of
        state.world.secrets
    ) {
        if (
            secret.found ||
            state.player
                .secretsFound
                .includes(
                    secret.id
                )
        ) {
            continue;
        }

        const pulse =
            0.48 +
            Math.sin(
                state.time *
                3 +
                secret.x
            ) *
            0.22;

        ctx.globalAlpha =
            pulse;

        ctx.font =
            "26px Arial";

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

/* =========================================================
   OBSTÁCULOS
========================================================= */

function drawObstacles() {
    for (
        const obstacle of
        state.world.obstacles
    ) {
        if (
            obstacle.type ===
            "building" ||
            obstacle.type ===
            "tree" ||
            obstacle.type ===
            "wall"
        ) {
            continue;
        }

        /*
            Fonte.
        */

        if (
            obstacle.type ===
            "fountain"
        ) {
            const centerX =
                obstacle.x +
                obstacle.w /
                2;

            const centerY =
                obstacle.y +
                obstacle.h /
                2;

            /*
                Sombra.
            */

            ctx.fillStyle =
                "rgba(0,0,0,.18)";

            ctx.beginPath();

            ctx.ellipse(
                centerX +
                7,
                centerY +
                9,
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

            /*
                Pedra.
            */

            ctx.fillStyle =
                "#98978e";

            ctx.beginPath();

            ctx.ellipse(
                centerX,
                centerY,
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

            /*
                Água.
            */

            const waterPulse =
                0.47 +
                Math.sin(
                    state.time *
                    2
                ) *
                0.05;

            ctx.fillStyle =
                `rgba(84,164,190,${waterPulse})`;

            ctx.beginPath();

            ctx.ellipse(
                centerX,
                centerY,
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

            /*
                Ondas.
            */

            ctx.strokeStyle =
                "rgba(205,236,245,.35)";

            ctx.lineWidth =
                2;

            for (
                let i = 0;
                i <
                3;
                i++
            ) {
                const radius =
                    22 +
                    (
                        (
                            state.time *
                            24 +
                            i *
                            28
                        ) %
                        75
                    );

                ctx.beginPath();

                ctx.ellipse(
                    centerX,
                    centerY,
                    radius *
                    1.3,
                    radius *
                    0.72,
                    0,
                    0,
                    Math.PI *
                    2
                );

                ctx.stroke();
            }

            continue;
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

            darkMountainRock:
                "#66696c",

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

        /*
            Detalhes de minério.
        */

        if (
            obstacle.type ===
            "oreRock" ||
            obstacle.type ===
            "rubyPillar" ||
            obstacle.type ===
            "iceRock"
        ) {
            ctx.strokeStyle =
                obstacle.type ===
                "rubyPillar"
                    ? "#e15271"
                    : obstacle.type ===
                      "iceRock"
                    ? "#d8f4ff"
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
}

/* =========================================================
   NPCS EXTERNOS
========================================================= */

function drawNPCs() {
    for (
        const npc of
        state.world.npcs
    ) {
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
            "#e4c29d";

        ctx.beginPath();

        ctx.arc(
            npc.x,
            npc.y -
            8,
            10,
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
            13,
            10,
            Math.PI,
            Math.PI *
            2
        );

        ctx.fill();

        /*
            Ícone de missão.
        */

        if (
            npc.questId
        ) {
            const quest =
                state.player
                    .quest[
                        npc.questId
                    ];

            ctx.font =
                "bold 22px Arial";

            ctx.textAlign =
                "center";

            ctx.fillStyle =
                quest?.state ===
                "completed"
                    ? "#7dd88c"
                    : "#ffd868";

            ctx.fillText(
                quest?.state ===
                "completed"
                    ? "✓"
                    : "!",

                npc.x,

                npc.y -
                44
            );
        }

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
            29
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
}

/* =========================================================
   HAZARDS
========================================================= */

function drawHazards() {
    for (
        const hazard of
        state.world.hazards
    ) {
        const warning =
            !hazard.triggered;

        const pulse =
            0.75 +
            Math.sin(
                state.time *
                9
            ) *
            0.15;

        ctx.fillStyle =
            warning
                ? `rgba(225,43,36,${
                    0.10 *
                    pulse
                })`
                : "rgba(255,107,49,.30)";

        ctx.strokeStyle =
            warning
                ? "rgba(255,64,52,.90)"
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

            /*
                Círculo fechando.
            */

            ctx.strokeStyle =
                "#fff0b8";

            ctx.lineWidth =
                3;

            ctx.beginPath();

            ctx.arc(
                hazard.x,
                hazard.y,
                Math.max(
                    6,
                    hazard.radius *
                    (
                        1 -
                        progress *
                        0.80
                    )
                ),
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            /*
                Contador externo.
            */

            ctx.strokeStyle =
                "rgba(255,220,150,.68)";

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

/* =========================================================
   INIMIGOS
========================================================= */

function drawEnemies() {
    for (
        const enemy of
        state.world.enemies
    ) {
        if (
            enemy.dead
        ) {
            continue;
        }

        /*
            Sombra.
        */

        ctx.fillStyle =
            "rgba(0,0,0,.30)";

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

        /*
            Aura de boss.
        */

        if (
            enemy.type ===
            "progression" ||
            enemy.type ===
            "final"
        ) {
            const aura =
                0.15 +
                (
                    Math.sin(
                        state.time *
                        3 +
                        enemy.x
                    ) +
                    1
                ) *
                0.05;

            ctx.strokeStyle =
                `rgba(255,190,100,${aura})`;

            ctx.lineWidth =
                3;

            ctx.beginPath();

            ctx.arc(
                enemy.x,
                enemy.y,
                enemy.radius *
                1.55,
                0,
                Math.PI *
                2
            );

            ctx.stroke();
        }

        drawEnemyBody(
            enemy
        );

        /*
            Nome.
        */

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
            19
        );

        /*
            Barra de vida.
        */

        const barWidth =
            Math.max(
                42,
                enemy.radius *
                2.7
            );

        ctx.fillStyle =
            "#211f1d";

        ctx.fillRect(
            enemy.x -
            barWidth /
            2,
            enemy.y -
            enemy.radius -
            15,
            barWidth,
            7
        );

        ctx.fillStyle =
            enemy.type ===
            "progression" ||
            enemy.type ===
            "final"
                ? "#d05049"
                : "#b84e48";

        ctx.fillRect(
            enemy.x -
            barWidth /
            2,
            enemy.y -
            enemy.radius -
            15,
            barWidth *
            clamp(
                enemy.hp /
                enemy.maxHp,
                0,
                1
            ),
            7
        );

        /*
            Fase do boss.
        */

        if (
            (
                enemy.type ===
                "progression" ||
                enemy.type ===
                "final"
            ) &&
            enemy.phase >
            1
        ) {
            ctx.font =
                "bold 9px Arial";

            ctx.fillStyle =
                "#f4c36f";

            ctx.fillText(
                `FASE ${enemy.phase}`,
                enemy.x,
                enemy.y -
                enemy.radius -
                22
            );
        }
    }
}

/* =========================================================
   CORPO DOS INIMIGOS
========================================================= */

function drawEnemyBody(enemy) {
    const flash =
        enemy.hitFlash >
        0
            ? "#ffffff"
            : enemy.color;

    /*
        Guardiões árvore.
    */

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
                ? "#ffffff"
                : "#6e4c31";

        ctx.fillRect(
            enemy.x -
            10,
            enemy.y -
            4,
            20,
            enemy.radius +
            28
        );

        ctx.fillStyle =
            flash;

        for (
            let i = 0;
            i <
            6;
            i++
        ) {
            const angle =
                -Math.PI /
                2 +
                i *
                (
                    Math.PI *
                    2 /
                    6
                );

            ctx.beginPath();

            ctx.arc(
                enemy.x +
                Math.cos(
                    angle
                ) *
                23,

                enemy.y -
                12 +
                Math.sin(
                    angle
                ) *
                18,

                enemy.radius *
                0.57,

                0,

                Math.PI *
                2
            );

            ctx.fill();
        }

        /*
            Olhos.
        */

        ctx.fillStyle =
            "#ffc76d";

        ctx.beginPath();

        ctx.arc(
            enemy.x -
            7,
            enemy.y -
            9,
            3,
            0,
            Math.PI *
            2
        );

        ctx.arc(
            enemy.x +
            7,
            enemy.y -
            9,
            3,
            0,
            Math.PI *
            2
        );

        ctx.fill();

        /*
            Raízes.
        */

        ctx.strokeStyle =
            "#60452f";

        ctx.lineWidth =
            5;

        ctx.beginPath();

        ctx.moveTo(
            enemy.x -
            6,
            enemy.y +
            enemy.radius
        );

        ctx.lineTo(
            enemy.x -
            30,
            enemy.y +
            enemy.radius +
            16
        );

        ctx.moveTo(
            enemy.x +
            6,
            enemy.y +
            enemy.radius
        );

        ctx.lineTo(
            enemy.x +
            30,
            enemy.y +
            enemy.radius +
            16
        );

        ctx.stroke();

        return;
    }

    /*
        Guardião de pedra / mineiros.
    */

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

        ctx.strokeStyle =
            "#33383b";

        ctx.lineWidth =
            3;

        ctx.stroke();

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
                5,
                enemy.y -
                5,
                10,
                11
            );
        }

        return;
    }

    /*
        Guardião final.
    */

    if (
        enemy.id ===
        "other_self"
    ) {
        ctx.fillStyle =
            flash;

        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.radius,
            0,
            Math.PI *
            2
        );

        ctx.fill();

        ctx.strokeStyle =
            "#c29aff";

        ctx.lineWidth =
            4;

        ctx.stroke();

        ctx.fillStyle =
            "#e5c7a9";

        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y -
            14,
            11,
            0,
            Math.PI *
            2
        );

        ctx.fill();

        ctx.fillStyle =
            "#201b25";

        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y -
            19,
            11,
            Math.PI,
            Math.PI *
            2
        );

        ctx.fill();

        ctx.font =
            "24px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "☯",
            enemy.x,
            enemy.y +
            11
        );

        return;
    }

    /*
        Guardião do Inferno.
    */

    if (
        enemy.id ===
        "final_gate_guardian"
    ) {
        ctx.fillStyle =
            flash;

        ctx.beginPath();

        ctx.moveTo(
            enemy.x,
            enemy.y -
            enemy.radius -
            7
        );

        ctx.lineTo(
            enemy.x +
            enemy.radius,
            enemy.y -
            2
        );

        ctx.lineTo(
            enemy.x +
            enemy.radius *
            0.72,
            enemy.y +
            enemy.radius
        );

        ctx.lineTo(
            enemy.x -
            enemy.radius *
            0.72,
            enemy.y +
            enemy.radius
        );

        ctx.lineTo(
            enemy.x -
            enemy.radius,
            enemy.y -
            2
        );

        ctx.closePath();

        ctx.fill();

        /*
            Chifres.
        */

        ctx.fillStyle =
            "#dfbf8a";

        ctx.beginPath();

        ctx.moveTo(
            enemy.x -
            22,
            enemy.y -
            30
        );

        ctx.lineTo(
            enemy.x -
            42,
            enemy.y -
            57
        );

        ctx.lineTo(
            enemy.x -
            12,
            enemy.y -
            37
        );

        ctx.closePath();

        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(
            enemy.x +
            22,
            enemy.y -
            30
        );

        ctx.lineTo(
            enemy.x +
            42,
            enemy.y -
            57
        );

        ctx.lineTo(
            enemy.x +
            12,
            enemy.y -
            37
        );

        ctx.closePath();

        ctx.fill();

        ctx.font =
            "27px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            enemy.icon,
            enemy.x,
            enemy.y +
            9
        );

        return;
    }

    /*
        Inimigos comuns.
    */

    ctx.fillStyle =
        flash;

    ctx.beginPath();

    if (
        enemy.type ===
        "progression"
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
        "progression"
            ? "#e0ae63"
            : "rgba(40,35,30,.65)";

    ctx.lineWidth =
        enemy.type ===
        "progression"
            ? 3
            : 1.5;

    ctx.stroke();

    ctx.font =
        enemy.type ===
        "progression"
            ? "26px Arial"
            : "20px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        enemy.icon,
        enemy.x,
        enemy.y +
        7
    );
}

/* =========================================================
   PORTAIS
========================================================= */

function drawPortals() {
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

        const unlocked =
            typeof portal.requirement ===
            "function"
                ? portal.requirement()
                : true;

        /*
            Escada.
        */

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

            continue;
        }

        /*
            Portal de volta.
        */

        if (
            portal.returnPortal
        ) {
            ctx.fillStyle =
                "rgba(218,184,108,.17)";

            ctx.fillRect(
                portal.x,
                portal.y,
                portal.w,
                portal.h
            );

            ctx.strokeStyle =
                "#d8bc7a";

            ctx.lineWidth =
                3;

            ctx.strokeRect(
                portal.x,
                portal.y,
                portal.w,
                portal.h
            );

            ctx.font =
                "28px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                "↩️",
                portal.x +
                portal.w /
                2,
                portal.y +
                portal.h /
                2
            );

            ctx.fillStyle =
                "#f1dba5";

            ctx.font =
                "bold 10px Georgia";

            ctx.fillText(
                "VOLTAR",
                portal.x +
                portal.w /
                2,
                portal.y -
                10
            );

            continue;
        }

        /*
            Portal normal.
        */

        const pulse =
            0.72 +
            Math.sin(
                state.time *
                3 +
                portal.x
            ) *
            0.15;

        ctx.fillStyle =
            unlocked
                ? `rgba(76,150,198,${
                    0.15 *
                    pulse
                })`
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
            unlocked
                ? 3
                : 2;

        ctx.strokeRect(
            portal.x,
            portal.y,
            portal.w,
            portal.h
        );

        if (
            unlocked
        ) {
            for (
                let i = 0;
                i <
                4;
                i++
            ) {
                const yy =
                    portal.y +
                    (
                        (
                            state.time *
                            42 +
                            i *
                            55
                        ) %
                        portal.h
                    );

                ctx.fillStyle =
                    "rgba(188,229,245,.48)";

                ctx.beginPath();

                ctx.arc(
                    portal.x +
                    portal.w /
                    2 +
                    Math.sin(
                        state.time *
                        2 +
                        i
                    ) *
                    16,
                    yy,
                    3,
                    0,
                    Math.PI *
                    2
                );

                ctx.fill();
            }
        }

        ctx.textAlign =
            "center";

        ctx.font =
            "bold 11px Georgia";

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
}

/* =========================================================
   DROPS
========================================================= */

function drawDrops() {
    for (
        const drop of
        state.world.drops
    ) {
        if (
            drop.collected
        ) {
            continue;
        }

        const item =
            ITEMS[
                drop.type
            ];

        if (
            !item
        ) {
            continue;
        }

        const bob =
            Math.sin(
                state.time *
                4 +
                drop.bobOffset
            ) *
            5;

        const glowRadius =
            drop.type ===
            "flautaMemoria"
                ? 34
                : 24;

        const gradient =
            ctx.createRadialGradient(
                drop.x,
                drop.y +
                bob,
                1,
                drop.x,
                drop.y +
                bob,
                glowRadius
            );

        gradient.addColorStop(
            0,
            drop.type ===
            "flautaMemoria"
                ? "rgba(255,240,146,.46)"
                : "rgba(255,207,101,.30)"
        );

        gradient.addColorStop(
            1,
            "rgba(255,220,120,0)"
        );

        ctx.fillStyle =
            gradient;

        ctx.beginPath();

        ctx.arc(
            drop.x,
            drop.y +
            bob,
            glowRadius,
            0,
            Math.PI *
            2
        );

        ctx.fill();

        ctx.font =
            drop.type ===
            "flautaMemoria"
                ? "29px Arial"
                : "23px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            item.icon,
            drop.x,
            drop.y +
            bob +
            7
        );

        /*
            Quantidade.
        */

        if (
            drop.amount >
            1
        ) {
            ctx.fillStyle =
                "#fff0ba";

            ctx.font =
                "bold 10px Arial";

            ctx.fillText(
                `x${drop.amount}`,
                drop.x +
                15,
                drop.y +
                bob +
                17
            );
        }

        /*
            Mostra E perto.
        */

        if (
            distance(
                drop,
                state.player
            ) <
            84
        ) {
            ctx.fillStyle =
                "rgba(15,17,20,.82)";

            ctx.fillRect(
                drop.x -
                30,
                drop.y -
                43 +
                bob,
                60,
                20
            );

            ctx.fillStyle =
                "#f3d889";

            ctx.font =
                "bold 10px Arial";

            ctx.fillText(
                "[E] PEGAR",
                drop.x,
                drop.y -
                29 +
                bob
            );
        }
    }
}

/* =========================================================
   EFEITOS
========================================================= */

function drawEffects() {
    for (
        const effect of
        state.world.effects
    ) {
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

        const progress =
            Number.isFinite(
                effect.maxLife
            )
                ? 1 -
                  alpha
                : 0;

        /*
            Flor ambiental antiga.
        */

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

            continue;
        }

        /*
            Número de dano.
        */

        if (
            effect.type ===
            "damageNumber"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.fillStyle =
                effect.color;

            ctx.font =
                "bold 17px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                effect.text,
                effect.x,
                effect.y -
                progress *
                34
            );

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Projétil básico do mago/fada.
        */

        if (
            effect.type ===
            "magicProjectile" ||
            effect.type ===
            "fairyProjectile"
        ) {
            const t =
                clamp(
                    progress *
                    1.65,
                    0,
                    1
                );

            const x =
                lerp(
                    effect.startX,
                    effect.tx,
                    t
                );

            const y =
                lerp(
                    effect.startY,
                    effect.ty,
                    t
                );

            /*
                Rastro.
            */

            ctx.strokeStyle =
                effect.color;

            ctx.globalAlpha =
                alpha *
                0.55;

            ctx.lineWidth =
                4;

            ctx.beginPath();

            ctx.moveTo(
                effect.startX,
                effect.startY
            );

            ctx.lineTo(
                x,
                y
            );

            ctx.stroke();

            /*
                Bola.
            */

            ctx.globalAlpha =
                alpha;

            const gradient =
                ctx.createRadialGradient(
                    x,
                    y,
                    1,
                    x,
                    y,
                    18
                );

            gradient.addColorStop(
                0,
                effect.secondary ||
                "#ffffff"
            );

            gradient.addColorStop(
                0.4,
                effect.color
            );

            gradient.addColorStop(
                1,
                "rgba(255,255,255,0)"
            );

            ctx.fillStyle =
                gradient;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                18,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Grande bola de memória.
        */

        if (
            effect.type ===
            "bigMemoryOrb"
        ) {
            const direction =
                normalizeVector(
                    effect.tx -
                    effect.x,
                    effect.ty -
                    effect.y
                );

            const travel =
                Math.min(
                    330,
                    progress *
                    420
                );

            const x =
                effect.x +
                direction.x *
                travel;

            const y =
                effect.y +
                direction.y *
                travel;

            ctx.globalAlpha =
                alpha;

            const gradient =
                ctx.createRadialGradient(
                    x,
                    y,
                    2,
                    x,
                    y,
                    35
                );

            gradient.addColorStop(
                0,
                "#fff6ce"
            );

            gradient.addColorStop(
                0.35,
                effect.secondary
            );

            gradient.addColorStop(
                0.75,
                effect.color
            );

            gradient.addColorStop(
                1,
                "rgba(230,150,50,0)"
            );

            ctx.fillStyle =
                gradient;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                35,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Golpe de espada.
        */

        if (
            effect.type ===
            "swordArc" ||
            effect.type ===
            "clawArc"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                effect.heavy
                    ? 10
                    : effect.type ===
                      "clawArc"
                    ? 5
                    : 7;

            const spread =
                effect.heavy
                    ? 1.7
                    : 1.25;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                effect.radius,
                effect.angle -
                spread /
                2,
                effect.angle +
                spread /
                2
            );

            ctx.stroke();

            if (
                effect.type ===
                "clawArc"
            ) {
                ctx.lineWidth =
                    2;

                for (
                    let i = -1;
                    i <=
                    1;
                    i++
                ) {
                    ctx.beginPath();

                    ctx.arc(
                        effect.x,
                        effect.y,
                        effect.radius +
                        i *
                        8,
                        effect.angle -
                        0.45,
                        effect.angle +
                        0.45
                    );

                    ctx.stroke();
                }
            }

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Pancada do Grumgar.
        */

        if (
            effect.type ===
            "heavySmash"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                6;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                effect.radius *
                (
                    0.5 +
                    progress *
                    0.6
                ),
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Anéis.
        */

        if (
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
                effect.type ===
                "shockRing"
                    ? 6
                    : 5;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                effect.radius *
                (
                    0.5 +
                    progress *
                    0.6
                ),
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Ataque de memória.
        */

        if (
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
                16 +
                progress *
                30,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.strokeStyle =
                "#fff3c8";

            ctx.lineWidth =
                2;

            ctx.beginPath();

            ctx.moveTo(
                effect.x,
                effect.y -
                40
            );

            ctx.lineTo(
                effect.x,
                effect.y +
                40
            );

            ctx.stroke();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Escudo do Theron.
        */

        if (
            effect.type ===
            "shieldAura"
        ) {
            ctx.globalAlpha =
                Math.min(
                    0.72,
                    alpha
                );

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                4;

            ctx.beginPath();

            ctx.arc(
                state.player.x,
                state.player.y,
                state.player.radius +
                16 +
                Math.sin(
                    state.time *
                    3
                ) *
                3,
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Rachadura.
        */

        if (
            effect.type ===
            "groundCrack"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                4;

            for (
                let i = 0;
                i <
                8;
                i++
            ) {
                const angle =
                    (
                        Math.PI *
                        2 *
                        i
                    ) /
                    8;

                ctx.beginPath();

                ctx.moveTo(
                    effect.x,
                    effect.y
                );

                ctx.lineTo(
                    effect.x +
                    Math.cos(
                        angle
                    ) *
                    effect.radius *
                    progress,

                    effect.y +
                    Math.sin(
                        angle
                    ) *
                    effect.radius *
                    progress
                );

                ctx.stroke();
            }

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Rugido.
        */

        if (
            effect.type ===
            "roarWave"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                6;

            for (
                let i = 0;
                i <
                3;
                i++
            ) {
                ctx.beginPath();

                ctx.arc(
                    effect.x,
                    effect.y,
                    effect.radius *
                    progress *
                    (
                        0.45 +
                        i *
                        0.27
                    ),
                    0,
                    Math.PI *
                    2
                );

                ctx.stroke();
            }

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Flecha feérica.
        */

        if (
            effect.type ===
            "fairyArrow"
        ) {
            const direction =
                normalizeVector(
                    effect.tx -
                    effect.x,
                    effect.ty -
                    effect.y
                );

            const length =
                Math.min(
                    420,
                    progress *
                    520
                );

            const x =
                effect.x +
                direction.x *
                length;

            const y =
                effect.y +
                direction.y *
                length;

            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                4;

            ctx.beginPath();

            ctx.moveTo(
                x -
                direction.x *
                32,
                y -
                direction.y *
                32
            );

            ctx.lineTo(
                x,
                y
            );

            ctx.stroke();

            ctx.fillStyle =
                "#fff0fa";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Cura.
        */

        if (
            effect.type ===
            "healingAura"
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
                    0.4 +
                    progress *
                    0.7
                ),
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.font =
                "24px Arial";

            ctx.textAlign =
                "center";

            ctx.fillText(
                "✦",
                effect.x,
                effect.y -
                30 -
                progress *
                30
            );

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Estrela feérica.
        */

        if (
            effect.type ===
            "fairyStar"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.fillStyle =
                effect.color;

            ctx.font =
                `${24 + progress * 18}px Arial`;

            ctx.textAlign =
                "center";

            ctx.fillText(
                "✦",
                effect.x,
                effect.y
            );

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Transformação do Zephyr.
        */

        if (
            effect.type ===
            "transformAura"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                effect.ultimate
                    ? 7
                    : 4;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                30 +
                progress *
                (
                    effect.ultimate
                        ? 130
                        : 80
                ),
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Dash do player.
        */

        if (
            effect.type ===
            "dashTrail"
        ) {
            ctx.globalAlpha =
                alpha *
                0.45;

            ctx.fillStyle =
                effect.color;

            ctx.beginPath();

            ctx.arc(
                state.player.x,
                state.player.y,
                30 +
                progress *
                35,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Dash do inimigo.
        */

        if (
            effect.type ===
            "enemyDashTrail"
        ) {
            if (
                !effect.enemy ||
                effect.enemy.dead
            ) {
                continue;
            }

            ctx.globalAlpha =
                alpha *
                0.45;

            ctx.fillStyle =
                effect.color;

            ctx.beginPath();

            ctx.arc(
                effect.enemy.x,
                effect.enemy.y,
                effect.enemy.radius *
                1.4,
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Aviso de dash.
        */

        if (
            effect.type ===
            "dashWarning"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                4;

            ctx.setLineDash([
                10,
                8
            ]);

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

            ctx.setLineDash([]);

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Pedra lançada.
        */

        if (
            effect.type ===
            "rockProjectile" ||
            effect.type ===
            "crystalProjectile"
        ) {
            const t =
                clamp(
                    progress,
                    0,
                    1
                );

            const height =
                Math.sin(
                    Math.PI *
                    t
                ) *
                100;

            const x =
                lerp(
                    effect.x,
                    effect.tx,
                    t
                );

            const y =
                lerp(
                    effect.y,
                    effect.ty,
                    t
                ) -
                height;

            ctx.globalAlpha =
                alpha;

            ctx.fillStyle =
                effect.type ===
                "rockProjectile"
                    ? "#7a7166"
                    : "#e85a7c";

            if (
                effect.type ===
                "rockProjectile"
            ) {
                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    10,
                    0,
                    Math.PI *
                    2
                );

                ctx.fill();
            }

            else {
                ctx.save();

                ctx.translate(
                    x,
                    y
                );

                ctx.rotate(
                    state.time *
                    7
                );

                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -13
                );

                ctx.lineTo(
                    8,
                    0
                );

                ctx.lineTo(
                    0,
                    13
                );

                ctx.lineTo(
                    -8,
                    0
                );

                ctx.closePath();

                ctx.fill();

                ctx.restore();
            }

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Conjuração inimiga.
        */

        if (
            effect.type ===
            "enemyCast"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                4;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                effect.radius *
                (
                    0.45 +
                    progress *
                    0.6
                ),
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Impacto de hazard.
        */

        if (
            effect.type ===
            "hazardImpact"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.fillStyle =
                effect.color;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                effect.radius *
                (
                    0.35 +
                    progress *
                    0.75
                ),
                0,
                Math.PI *
                2
            );

            ctx.fill();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Golpe inimigo.
        */

        if (
            effect.type ===
            "enemyHit"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                6;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                18 +
                progress *
                20,
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Fase do boss.
        */

        if (
            effect.type ===
            "bossPhase"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                7;

            for (
                let i = 0;
                i <
                3;
                i++
            ) {
                ctx.beginPath();

                ctx.arc(
                    effect.x,
                    effect.y,
                    effect.radius *
                    progress *
                    (
                        0.5 +
                        i *
                        0.25
                    ),
                    0,
                    Math.PI *
                    2
                );

                ctx.stroke();
            }

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Flash de dano do player.
        */

        if (
            effect.type ===
            "playerDamageFlash"
        ) {
            ctx.globalAlpha =
                alpha *
                0.7;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                5;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                25 +
                progress *
                18,
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Morte de inimigo.
        */

        if (
            effect.type ===
            "enemyDeath"
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
                progress,
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Level up.
        */

        if (
            effect.type ===
            "levelUp"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                6;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                effect.radius *
                progress,
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.font =
                "bold 18px Arial";

            ctx.fillStyle =
                effect.color;

            ctx.textAlign =
                "center";

            ctx.fillText(
                "LEVEL UP!",
                effect.x,
                effect.y -
                45 -
                progress *
                25
            );

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Recurso quebrando.
        */

        if (
            effect.type ===
            "resourceBreak"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                4;

            for (
                let i = 0;
                i <
                6;
                i++
            ) {
                const angle =
                    (
                        Math.PI *
                        2 *
                        i
                    ) /
                    6;

                ctx.beginPath();

                ctx.moveTo(
                    effect.x,
                    effect.y
                );

                ctx.lineTo(
                    effect.x +
                    Math.cos(
                        angle
                    ) *
                    progress *
                    45,

                    effect.y +
                    Math.sin(
                        angle
                    ) *
                    progress *
                    45
                );

                ctx.stroke();
            }

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Segredo.
        */

        if (
            effect.type ===
            "secretReveal"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.strokeStyle =
                effect.color;

            ctx.lineWidth =
                3;

            ctx.beginPath();

            ctx.arc(
                effect.x,
                effect.y,
                effect.radius *
                progress,
                0,
                Math.PI *
                2
            );

            ctx.stroke();

            ctx.globalAlpha =
                1;

            continue;
        }

        /*
            Madeira voando.
        */

        if (
            effect.type ===
            "woodChunk"
        ) {
            ctx.globalAlpha =
                alpha;

            ctx.fillStyle =
                effect.color;

            ctx.save();

            ctx.translate(
                effect.x,
                effect.y
            );

            ctx.rotate(
                progress *
                6
            );

            ctx.fillRect(
                -5,
                -3,
                10,
                6
            );

            ctx.restore();

            ctx.globalAlpha =
                1;
        }
    }
}

/* =========================================================
   PLAYER
========================================================= */

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

    /*
        Sombra.
    */

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

    /*
        Aura da classe.
    */

    ctx.strokeStyle =
        player.color;

    ctx.globalAlpha =
        0.20 +
        (
            Math.sin(
                state.time *
                3
            ) +
            1
        ) *
        0.06;

    ctx.lineWidth =
        2;

    ctx.beginPath();

    ctx.arc(
        player.x,
        player.y,
        player.radius +
        7,
        0,
        Math.PI *
        2
    );

    ctx.stroke();

    ctx.globalAlpha =
        1;

    /*
        Corpo.
    */

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

    /*
        Cabeça.
    */

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

    /*
        Cabelo.
    */

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

    /*
        Símbolo da classe.
    */

    ctx.font =
        "15px Arial";

    ctx.textAlign =
        "center";

    const symbols = {
        kaelion:
            "✦",

        theron:
            "◆",

        grumgar:
            "✹",

        lirael:
            "✧",

        zephyr:
            "◈"
    };

    ctx.fillStyle =
        player.secondaryColor ||
        "#ffffff";

    ctx.fillText(
        symbols[
            player.characterId
        ] ||
        "✦",
        player.x,
        player.y +
        6
    );

    /*
        Nome.
    */

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

/* =========================================================
   TEXTOS DO MUNDO
========================================================= */

function drawWorldLabels() {
    ctx.textAlign =
        "center";

    if (
        state.area ===
        "village"
    ) {
        ctx.font =
            "bold 22px Georgia";

        ctx.fillStyle =
            "rgba(255,229,172,.78)";

        ctx.fillText(
            "PRAÇA DA VILA",
            1600,
            810
        );

        ctx.font =
            "14px Georgia";

        ctx.fillStyle =
            "rgba(255,255,255,.58)";

        ctx.fillText(
            "A Quietude ainda não alcançou este lugar por completo...",
            1600,
            835
        );
    }

    else if (
        state.area ===
        "sky"
    ) {
        ctx.font =
            "bold 21px Georgia";

        ctx.fillStyle =
            "rgba(255,245,210,.76)";

        ctx.fillText(
            "ALTAR DAS CINCO HORDAS",
            1710,
            1005
        );
    }

    else if (
        state.area ===
        "hell"
    ) {
        ctx.font =
            "bold 20px Georgia";

        ctx.fillStyle =
            "rgba(255,125,90,.64)";

        ctx.fillText(
            "DERROTE OS CINCO TIPOS DE CRIATURAS",
            1820,
            150
        );
    }

    else if (
        state.area ===
        "final"
    ) {
        ctx.font =
            "bold 24px Georgia";

        ctx.fillStyle =
            "rgba(210,180,230,.65)";

        ctx.fillText(
            "CÂMARA DA ÚLTIMA MEMÓRIA",
            1100,
            145
        );
    }
}

/* =========================================================
   PARTÍCULAS
========================================================= */

function drawParticles() {
    for (
        const particle of
        state.world.particles
    ) {
        ctx.globalAlpha =
            clamp(
                particle.life /
                (
                    particle.maxLife ||
                    0.85
                ),
                0,
                1
            );

        ctx.fillStyle =
            particle.color;

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size ||
            3,
            0,
            Math.PI *
            2
        );

        ctx.fill();
    }

    ctx.globalAlpha =
        1;
}

/* =========================================================
   TECLADO
========================================================= */

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

    /*
        Movimento.
    */

    if (
        movementKeys.includes(
            key
        )
    ) {
        if (
            screens.game
                .classList
                .contains(
                    "active"
                ) &&
            !isGameplayOverlayOpen()
        ) {
            event.preventDefault();

            state.keys.add(
                key
            );
        }

        return;
    }

    /*
        Interação.
    */

    if (
        key ===
        "e"
    ) {
        if (
            !screens.game
                .classList
                .contains(
                    "active"
                )
        ) {
            return;
        }

        event.preventDefault();

        state.keys.add(
            "e"
        );

        if (
            !event.repeat &&
            !isGameplayOverlayOpen()
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

    /*
        Enter no diálogo.
    */

    if (
        event.key ===
        "Enter" &&
        state.dialogue
    ) {
        event.preventDefault();

        advanceDialogue();

        return;
    }

    /*
        Casas.
    */

    if (
        key ===
        "z"
    ) {
        if (
            screens.game
                .classList
                .contains(
                    "active"
                ) &&
            !isGameplayOverlayOpen()
        ) {
            event.preventDefault();

            handleZ();
        }

        return;
    }

    /*
        Skills.
    */

    if (
        [
            "q",
            "r",
            "f"
        ].includes(
            key
        ) &&
        screens.game
            .classList
            .contains(
                "active"
            ) &&
        !isGameplayOverlayOpen()
    ) {
        event.preventDefault();

        useSkill(
            key
        );

        return;
    }

    /*
        Inventário.
    */

    if (
        key ===
        "i" &&
        screens.game
            .classList
            .contains(
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

    /*
        Mapa.
    */

    if (
        key ===
        "m" &&
        screens.game
            .classList
            .contains(
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

    /*
        Livro.
    */

    if (
        key ===
        "l" &&
        screens.game
            .classList
            .contains(
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

    /*
        Poção.
    */

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

    /*
        Elixir.
    */

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

    /*
        Comida.
    */

    if (
        key ===
        "3" &&
        state.player
    ) {
        event.preventDefault();

        if (
            state.player
                .inventory
                .carneCaca >
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

    /*
        Flauta.
    */

    if (
        key ===
        "4" &&
        state.player
    ) {
        event.preventDefault();

        if (
            state.player
                .inventory
                .flautaMemoria >
            0
        ) {
            useMemoryFlute();
        }

        else {
            showToast(
                "Você ainda não possui a Flauta da Memória."
            );
        }

        return;
    }

    /*
        Escape.
    */

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

        const panelIds = [
            "inventoryPanel",
            "mapPanel",
            "bookPanel",
            "shopPanel",
            "questPanel"
        ];

        const openPanel =
            panelIds.find(
                id =>
                    !must(
                        id
                    ).classList.contains(
                        "hidden"
                    )
            );

        if (
            openPanel
        ) {
            must(
                openPanel
            ).classList.add(
                "hidden"
            );

            return;
        }

        if (
            screens.game
                .classList
                .contains(
                    "active"
                )
        ) {
            returnToMenu();
        }
    }
}

/* =========================================================
   EVENTO DE CLIQUE
========================================================= */

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

/* =========================================================
   EVENTOS
========================================================= */

function bindEvents() {
    /*
        MENU.
    */

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

                        showToast(
                            "Não foi possível carregar o jogo."
                        );
                    }

                    requestAnimationFrame(
                        () => {
                            fade.classList.remove(
                                "active"
                            );
                        }
                    );
                },
                290
            );
        }
    );

    bindClick(
        "howToBtn",
        () => {
            fadeToScreen(
                "how"
            );
        }
    );

    bindClick(
        "creditsBtn",
        () => {
            fadeToScreen(
                "credits"
            );
        }
    );

    bindClick(
        "closeHowBtn",
        () => {
            fadeToScreen(
                "menu"
            );
        }
    );

    bindClick(
        "closeCreditsBtn",
        () => {
            fadeToScreen(
                "menu"
            );
        }
    );

    bindClick(
        "backMenuBtn",
        () => {
            fadeToScreen(
                "menu"
            );
        }
    );

    bindClick(
        "startGameBtn",
        startGame
    );

    /*
        HUD.
    */

    bindClick(
        "saveBtn",
        () => {
            saveGame(
                true
            );
        }
    );

    bindClick(
        "menuBtn",
        returnToMenu
    );

    bindClick(
        "inventoryBtn",
        () => {
            togglePanel(
                "inventoryPanel",
                updateInventory
            );
        }
    );

    bindClick(
        "mapBtn",
        () => {
            togglePanel(
                "mapPanel",
                drawLargeMap
            );
        }
    );

    bindClick(
        "bookBtn",
        () => {
            togglePanel(
                "bookPanel",
                renderBook
            );
        }
    );

    /*
        VIAGEM.
    */

    bindClick(
        "travelYes",
        confirmTravel
    );

    bindClick(
        "travelNo",
        cancelTravel
    );

    /*
        BATALHA.
    */

    bindClick(
        "battleAccept",
        acceptBattle
    );

    bindClick(
        "battleDecline",
        declineBattle
    );

    /*
        MORTE.
    */

    bindClick(
        "respawnBtn",
        respawnPlayer
    );

    /*
        MISSÃO.
    */

    bindClick(
        "questActionBtn",
        executeQuestAction
    );

    /*
        ENTER NO NOME.
    */

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

    /*
        BOTÕES DE FECHAR.
    */

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
                            button.dataset
                                .close;

                        const element =
                            $(
                                target
                            );

                        if (
                            element
                        ) {
                            element.classList.add(
                                "hidden"
                            );
                        }

                        if (
                            target ===
                            "shopPanel"
                        ) {
                            state.shopNPC =
                                null;
                        }

                        if (
                            target ===
                            "questPanel"
                        ) {
                            state.questNPC =
                                null;
                        }
                    }
                );
            }
        );

    /*
        TABS INVENTÁRIO.
    */

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
                                item => {
                                    item.classList.remove(
                                        "active"
                                    );
                                }
                            );

                        tab.classList.add(
                            "active"
                        );

                        state.inventoryCategory =
                            tab.dataset
                                .cat;

                        updateInventory();
                    }
                );
            }
        );

    /*
        TABS LOJA.
    */

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
                                item => {
                                    item.classList.remove(
                                        "active"
                                    );
                                }
                            );

                        tab.classList.add(
                            "active"
                        );

                        state.shopMode =
                            tab.dataset
                                .shop;

                        renderShop();
                    }
                );
            }
        );

    /*
        TECLADO.
    */

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

    /*
        PERDER FOCO.
    */

    window.addEventListener(
        "blur",
        () => {
            state.keys.clear();

            state.pointer.down =
                false;

            cancelHoldInteraction();
        }
    );

    /*
        MOUSE GLOBAL.
    */

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

    /*
        POSIÇÃO DO MOUSE.
    */

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

    /*
        ATAQUE.
    */

    canvas.addEventListener(
        "pointerdown",
        event => {
            if (
                event.button !==
                0
            ) {
                return;
            }

            if (
                state.houseMode ||
                isGameplayOverlayOpen() ||
                state.paused
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
        "pointerleave",
        () => {
            state.pointer.down =
                false;
        }
    );

    canvas.addEventListener(
        "contextmenu",
        event => {
            event.preventDefault();
        }
    );

    /*
        REDIMENSIONAMENTO.
    */

    window.addEventListener(
        "resize",
        () => {
            resizeCanvas();

            updateCamera();
        }
    );
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initialize() {
    createCharacterCards();

    resizeCanvas();

    bindEvents();

    updateContinueButton();

    showScreen(
        "menu"
    );
}

initialize();

})();
