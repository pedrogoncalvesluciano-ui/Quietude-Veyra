(() => {
    "use strict";

    /*
     * VEYRA — A QUIETUDE
     * VERSÃO 12.0
     *
     * Estrutura:
     * 1. Dados
     * 2. Estado
     * 3. Utilidades
     * 4. Personagem
     * 5. Mundo
     * 6. Colisão
     * 7. Movimento
     * 8. IA
     * 9. Combate
     * 10. Coleta
     * 11. NPCs / quests
     * 12. Inventário / equipamentos
     * 13. Loja
     * 14. Mapa / Livro
     * 15. Casas
     * 16. Progressão / áreas
     * 17. Salvamento
     * 18. Render
     * 19. Eventos
     */

    const SAVE_KEY = "veyra_save_v12";

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const miniCanvas = document.getElementById("miniCanvas");
    const miniCtx = miniCanvas.getContext("2d");

    const mapCanvas = document.getElementById("worldMapCanvas");
    const mapCtx = mapCanvas.getContext("2d");

    const $ = (id) => document.getElementById(id);


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
                "Grande poder mágico, menor resistência física.",
            color: "#e49345",
            bg: "rgba(228,147,69,.16)",
            glow: "rgba(228,147,69,.25)",
            hp: 85,
            magic: 140,
            energy: 110,
            speed: 180,
            damage: 24,
            defense: 5,
            skill: "Raio de Memória",
            skillCost: 18
        },

        {
            id: "theron",
            name: "THERON",
            className: "Cavaleiro",
            icon: "🛡️",
            role: "Espada • Defesa",
            description:
                "Resistente, forte e preparado para o combate corpo a corpo.",
            color: "#b8bec8",
            bg: "rgba(184,190,200,.13)",
            glow: "rgba(184,190,200,.2)",
            hp: 145,
            magic: 70,
            energy: 120,
            speed: 145,
            damage: 30,
            defense: 20,
            skill: "Golpe do Guardião",
            skillCost: 12
        },

        {
            id: "grumgar",
            name: "GRUMGAR",
            className: "Troll",
            icon: "👹",
            role: "Força • Vida",
            description:
                "Muita vida e dano físico, porém com baixa velocidade.",
            color: "#718f51",
            bg: "rgba(113,143,81,.15)",
            glow: "rgba(113,143,81,.22)",
            hp: 180,
            magic: 55,
            energy: 90,
            speed: 110,
            damage: 38,
            defense: 18,
            skill: "Esmagamento",
            skillCost: 10
        },

        {
            id: "lirael",
            name: "LIRAEL",
            className: "Fada",
            icon: "🧚",
            role: "Velocidade • Cura",
            description:
                "Rápida, mágica e capaz de restaurar a própria vida.",
            color: "#dd8bcf",
            bg: "rgba(221,139,207,.15)",
            glow: "rgba(221,139,207,.22)",
            hp: 95,
            magic: 130,
            energy: 130,
            speed: 210,
            damage: 19,
            defense: 7,
            skill: "Luz Vital",
            skillCost: 20
        },

        {
            id: "zephyr",
            name: "ZEPHYR",
            className: "Transmorfo",
            icon: "🦊",
            role: "Adaptação • Equilíbrio",
            description:
                "Equilibrado e capaz de adaptar o próprio estilo.",
            color: "#cb9058",
            bg: "rgba(203,144,88,.15)",
            glow: "rgba(203,144,88,.22)",
            hp: 115,
            magic: 105,
            energy: 110,
            speed: 170,
            damage: 25,
            defense: 13,
            skill: "Forma Adaptativa",
            skillCost: 16
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
            value: 32
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
            category: "materials",
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
            mana: 50
        },

        espadaFerro: {
            name: "Espada de Ferro",
            icon: "⚔️",
            category: "weapons",
            weight: 4,
            value: 140,
            damage: 12
        },

        espadaRuina: {
            name: "Espada da Ruína",
            icon: "🗡️",
            category: "weapons",
            weight: 5,
            value: 300,
            damage: 25
        },

        armaduraCouro: {
            name: "Armadura de Couro",
            icon: "🥋",
            category: "armor",
            weight: 5,
            value: 110,
            defense: 8
        },

        armaduraCeu: {
            name: "Armadura Celestial",
            icon: "🪽",
            category: "armor",
            weight: 6,
            value: 400,
            defense: 20
        },

        machado: {
            name: "Machado de Coleta",
            icon: "🪓",
            category: "tools",
            weight: 3,
            value: 50
        },

        mapa: {
            name: "Mapa de Veyra",
            icon: "🗺️",
            category: "map",
            weight: 1,
            value: 350
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
            visual: "village",
            next: "forest"
        },

        forest: {
            name: "FLORESTA",
            width: 3400,
            height: 2400,
            visual: "forest",
            next: "grove"
        },

        grove: {
            name: "BOSQUE",
            width: 3200,
            height: 2300,
            visual: "forest",
            next: "mountains"
        },

        mountains: {
            name: "MONTANHAS",
            width: 3500,
            height: 2300,
            visual: "mountains",
            next: "ironCave"
        },

        ironCave: {
            name: "CAVERNA DE FERRO",
            width: 2900,
            height: 1900,
            visual: "cave",
            next: "rubyCave"
        },

        rubyCave: {
            name: "CAVERNA DE RUBI",
            width: 3100,
            height: 2100,
            visual: "ruby",
            next: "shadowCave"
        },

        shadowCave: {
            name: "CAVERNA SOMBRIA",
            width: 3000,
            height: 2000,
            visual: "shadow",
            next: "fairy"
        },

        fairy: {
            name: "REINO DAS FADAS",
            width: 3200,
            height: 2200,
            visual: "fairy",
            next: "sky"
        },

        sky: {
            name: "CÉU",
            width: 3400,
            height: 2200,
            visual: "sky",
            next: "hell"
        },

        hell: {
            name: "INFERNO",
            width: 3600,
            height: 2400,
            visual: "hell",
            next: "final"
        },

        final: {
            name: "CÂMARA FINAL",
            width: 2200,
            height: 1500,
            visual: "final",
            next: null
        }
    };


    /* =====================================================
       ESTADO CENTRAL
    ====================================================== */

    const state = {
        player: null,

        area: "village",

        running: false,

        paused: false,

        time: 0,

        lastTime: 0,

        keys: new Set(),

        camera: {
            x: 0,
            y: 0
        },

        world: {
            width: 3200,
            height: 2200,

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
        },

        houseMode: false,

        currentHouse: null,

        dialogue: null,

        travel: null,

        battle: null,

        currentQuestNPC: null,

        shopNPC: null,

        shopMode: "buy",

        inventoryCategory: "all",

        portalCooldown: 0,

        toastTimer: null,

        audio: null
    };


    /* =====================================================
       UTILIDADES
    ====================================================== */

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }


    function random(min, max) {
        return min + Math.random() * (max - min);
    }


    function randomInt(min, max) {
        return Math.floor(random(min, max + 1));
    }


    function dist(a, b) {
        return Math.hypot(
            a.x - b.x,
            a.y - b.y
        );
    }


    function uid(prefix) {
        return (
            prefix +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 8) +
            Date.now()
                .toString(36)
                .slice(-5)
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
        Object.values(
            {
                menu: $("menuScreen"),
                how: $("howScreen"),
                credits: $("creditsScreen"),
                character: $("characterScreen"),
                game: $("gameScreen")
            }
        ).forEach(screen => {
            screen.classList.remove("active");
        });

        const target = {
            menu: $("menuScreen"),
            how: $("howScreen"),
            credits: $("creditsScreen"),
            character: $("characterScreen"),
            game: $("gameScreen")
        }[name];

        if (target) {
            target.classList.add("active");
        }
    }


    function showToast(message) {
        const toast = $("saveMessage");

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(state.toastTimer);

        state.toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    }


    function beep(type = "click") {
        try {
            if (!state.audio) {
                state.audio =
                    new (
                        window.AudioContext ||
                        window.webkitAudioContext
                    )();
            }

            const osc =
                state.audio.createOscillator();

            const gain =
                state.audio.createGain();

            const sounds = {
                click: [420, 0.05],
                hit: [130, 0.08],
                magic: [620, 0.12],
                collect: [760, 0.07],
                level: [920, 0.16]
            };

            const [frequency, duration] =
                sounds[type] || sounds.click;

            osc.frequency.value =
                frequency;

            osc.type =
                type === "hit"
                    ? "sawtooth"
                    : "sine";

            gain.gain.setValueAtTime(
                0.035,
                state.audio.currentTime
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                state.audio.currentTime +
                    duration
            );

            osc.connect(gain);
            gain.connect(state.audio.destination);

            osc.start();
            osc.stop(
                state.audio.currentTime +
                    duration
            );
        } catch (_) {
            /* Áudio é opcional. */
        }
    }


    /* =====================================================
       CANVAS
    ====================================================== */

    function resizeCanvas() {
        const dpr =
            window.devicePixelRatio ||
            1;

        canvas.width =
            Math.floor(
                window.innerWidth *
                    dpr
            );

        canvas.height =
            Math.floor(
                window.innerHeight *
                    dpr
            );

        canvas.style.width =
            window.innerWidth + "px";

        canvas.style.height =
            window.innerHeight + "px";

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    /* =====================================================
       CARTÕES DE PERSONAGEM
    ====================================================== */

    function createCharacterCards() {
        const container =
            $("characterCards");

        container.innerHTML = "";

        CHARACTERS.forEach(
            (character, index) => {

                const card =
                    document.createElement(
                        "button"
                    );

                card.type = "button";

                card.className =
                    "character-card" +
                    (index === 0
                        ? " selected"
                        : "");

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
                        •
                        ${character.role}
                    </p>

                    <p>
                        ${character.description}
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
                        <b>
                            ${character.skill}
                        </b>
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
                                other =>
                                    other.classList.remove(
                                        "selected"
                                    )
                            );

                        card.classList.add(
                            "selected"
                        );

                        beep();
                    }
                );

                container.appendChild(card);
            }
        );
    }


    /* =====================================================
       NOVO PLAYER
    ====================================================== */

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

            x: 480,

            y: 610,

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

            maxHunger: 100,

            fatigue: 100,

            maxFatigue: 100,

            memory: 0,

            memoryMax: 100,

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

                espadaRuina: 0,

                armaduraCouro: 0,

                armaduraCeu: 0,

                machado: 1,

                mapa: 0
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
                    reward: 100
                },

                coal: {
                    state: "none",
                    need: 8,
                    reward: 140
                }
            },

            discoveredBosses: [],

            defeatedBosses: [],

            unlockedAreas: [
                "village"
            ],

            collected: {},

            treesCut: 0,

            enemiesDefeated: 0,

            hellTypesDefeated: {},

            checkpoint: {
                area: "village",
                x: 480,
                y: 610
            },

            flags: {},

            mapOwned: false,

            finalChoice: null,

            finalDefeated: false,

            effects: [],

            dead: false
        };
    }


    /* =====================================================
       RESETAR MUNDO
    ====================================================== */

    function resetWorld() {
        const region =
            REGIONS[state.area];

        state.world = {

            width:
                region.width,

            height:
                region.height,

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
       HELPERS DO MUNDO
    ====================================================== */

    function addObstacle(
        x,
        y,
        width,
        height,
        type,
        extra = {}
    ) {

        state.world.obstacles.push({

            x,

            y,

            w: width,

            h: height,

            type,

            ...extra
        });
    }


    function addBuilding(
        x,
        y,
        width,
        height,
        name,
        roof,
        color,
        id
    ) {

        const building = {

            id:
                id ||
                uid("building"),

            x,

            y,

            w:
                width,

            h:
                height,

            name,

            roof,

            color,

            interior: {

                x: 220,

                y: 180,

                w:
                    Math.max(
                        240,
                        width - 80
                    ),

                h:
                    Math.max(
                        150,
                        height - 100
                    )
            }
        };

        state.world.buildings.push(
            building
        );

        addObstacle(
            x,
            y,
            width,
            height,
            "building",
            {
                buildingId:
                    building.id
            }
        );
    }


    function addTree(
        x,
        y,
        id
    ) {

        const tree = {

            id:
                id ||
                uid("tree"),

            x,

            y,

            alive: true,

            respawn: 0,

            amount:
                randomInt(2, 5)
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
                treeId:
                    tree.id
            }
        );
    }


    function addResource(
        x,
        y,
        type,
        id
    ) {

        state.world.resources.push({

            id:
                id ||
                uid(type),

            x,

            y,

            resource:
                type,

            alive: true,

            respawn: 0,

            amount:
                randomInt(1, 3)
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

            id:
                uid("npc"),

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


    function addEnemy(data) {

        state.world.enemies.push({

            ...data,

            state: "idle",

            aggressive: false,

            accepted: false,

            attackTimer: 0,

            hitFlash: 0,

            dead: false,

            phase: 1
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

            id:
                uid("portal"),

            x,

            y,

            w,

            h,

            target,

            requirement,

            title
        });
    }


    /* =====================================================
       CONSTRUIR REGIÃO
    ====================================================== */

    function buildArea() {

        resetWorld();

        switch (state.area) {

            case "village":
                buildVillage();
                break;

            case "forest":
                buildForest();
                break;

            case "grove":
                buildGrove();
                break;

            case "mountains":
                buildMountains();
                break;

            case "ironCave":
                buildIronCave();
                break;

            case "rubyCave":
                buildRubyCave();
                break;

            case "shadowCave":
                buildShadowCave();
                break;

            case "fairy":
                buildFairy();
                break;

            case "sky":
                buildSky();
                break;

            case "hell":
                buildHell();
                break;

            case "final":
                buildFinal();
                break;
        }

        updateLocationUI();

        ensureCheckpoint();
    }


    /* =====================================================
       VILA
    ====================================================== */

    function buildVillage() {

        addBuilding(
            270,
            280,
            430,
            270,
            "CASA DO AVENTUREIRO",
            "#71483a",
            "#ad825d",
            "home"
        );

        addBuilding(
            830,
            260,
            350,
            260,
            "CASA DE ELIAN",
            "#654b3b",
            "#b38a61",
            "elianHome"
        );

        addBuilding(
            2070,
            300,
            500,
            300,
            "FORJA DO FERREIRO",
            "#464441",
            "#8a7e70",
            "forge"
        );

        addBuilding(
            2500,
            1260,
            430,
            300,
            "LOJA DE DORAN",
            "#704735",
            "#b2845a",
            "shop"
        );

        addBuilding(
            400,
            1560,
            450,
            300,
            "CARPINTARIA",
            "#735537",
            "#a57b4e",
            "woodshop"
        );


        addObstacle(
            1465,
            870,
            270,
            215,
            "fountain"
        );


        const rocks = [
            [970, 760],
            [1100, 720],
            [1210, 1800],
            [1850, 1630],
            [2200, 940],
            [2740, 860],
            [650, 1160],
            [2370, 1830]
        ];

        rocks.forEach(
            ([x, y]) =>
                addObstacle(
                    x - 30,
                    y - 23,
                    60,
                    46,
                    "rock"
                )
        );


        const trees = [
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
        ];

        trees.forEach(
            ([x, y], index) =>
                addTree(
                    x,
                    y,
                    `village_tree_${index}`
                )
        );


        addNPC(
            1030,
            610,
            "ELIAN",
            "Morador",
            "#d4b27c",
            [
                "A Quietude está chegando mais perto. Ontem ouvi o sino da praça tocar sozinho.",
                "Dizem que o primeiro esquecimento acontece com pequenas coisas: um nome, uma música, um caminho.",
                "Se você for até a floresta, não confie no silêncio. Às vezes o silêncio está ouvindo você.",
                "Há um Guardião perto da estrada leste. Ele parece estar esperando alguém."
            ],
            {
                questId: "wood"
            }
        );


        addNPC(
            1940,
            1055,
            "MARA",
            "Historiadora",
            "#b98bc4",
            [
                "Meu avô escreveu que a Quietude veio de um lugar onde o céu perdeu a cor.",
                "Alguns lugares não foram destruídos. Eles apenas deixaram de ser lembrados pelas pessoas.",
                "Eu sonhei com uma Caverna de Rubi. Cada cristal guardava uma memória diferente.",
                "Existe uma história sobre alguém que venceu a Quietude e acabou se tornando parte dela."
            ]
        );


        addNPC(
            2700,
            1125,
            "DORAN",
            "Comerciante",
            "#c58a54",
            [
                "Compro madeira, carvão, ferro, ouro e rubi. Materiais raros valem muito mais.",
                "Uma boa espada custa dinheiro. Uma boa armadura custa ainda mais.",
                "Tenho mapas de regiões que nem todo mundo consegue alcançar.",
                "Se for enfrentar bosses, volte aqui antes. Equipamento ruim transforma aventura em funeral."
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
                "Corte árvores, mas deixe a floresta se recuperar. Madeira é vida para esta vila.",
                "Algumas árvores mudaram depois que a Quietude chegou. Elas voltam a nascer longe do lugar onde caíram.",
                "Meu pai dizia que a madeira certa pode guardar uma memória por décadas.",
                "Preciso de dez madeiras para reforçar as casas do sul. Se trouxer, eu lhe recompenso."
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
                "Ferro é o começo. Depois vêm as ligas raras.",
                "Já ouvi falar de uma espada feita com metal encontrado no Inferno.",
                "Uma arma melhor pode ser a diferença entre fugir e sobreviver.",
                "Traga minério. Eu faço o resto."
            ],
            {
                forge: true,
                questId: "coal"
            }
        );


        addEnemy({
            id: "forest_guardian",
            x: 2860,
            y: 1080,
            name: "GUARDIÃO DA ESTRADA",
            icon: "👺",
            type: "progression",
            hp: 280,
            maxHp: 280,
            damage: 20,
            speed: 58,
            vision: 280,
            attackRange: 75,
            radius: 28,
            color: "#914f45",
            drop: "cristal",
            dropAmount: 2,
            gateTarget: "forest"
        });


        addEnemy({
            id: "village_resource_boss",
            x: 2350,
            y: 1720,
            name: "CERVO ANCESTRAL",
            icon: "🦌",
            type: "resourceBoss",
            hp: 500,
            maxHp: 500,
            damage: 18,
            speed: 65,
            vision: 260,
            attackRange: 70,
            radius: 30,
            color: "#798a61",
            drop: "ouro",
            dropAmount: 2,
            respawnTime: 60
        });


        addEnemy({
            id: "slime_village",
            x: 1250,
            y: 700,
            name: "LIMO DA QUIETUDE",
            icon: "🟢",
            type: "normal",
            hp: 55,
            maxHp: 55,
            damage: 8,
            speed: 55,
            vision: 210,
            attackRange: 55,
            radius: 18,
            color: "#5f8d5e",
            drop: "erva",
            dropAmount: 1
        });


        addEnemy({
            id: "wolf_village",
            x: 2200,
            y: 1450,
            name: "LOBO ESQUECIDO",
            icon: "🐺",
            type: "normal",
            hp: 80,
            maxHp: 80,
            damage: 12,
            speed: 90,
            vision: 280,
            attackRange: 65,
            radius: 21,
            color: "#5d626d",
            drop: "carvao",
            dropAmount: 1
        });


        addPortal(
            3090,
            1000,
            70,
            220,
            "forest",
            "guardianForest",
            "FLORESTA"
        );

        addPortal(
            1510,
            2060,
            180,
            70,
            "cave",
            "questWood",
            "CAVERNA"
        );
    }


    /* =====================================================
       FLORESTA
    ====================================================== */

    function buildForest() {

        for (
            let i = 0;
            i < 45;
            i++
        ) {

            addTree(
                randomInt(130, 3250),
                randomInt(140, 2250),
                `forest_tree_${i}`
            );
        }


        for (
            let i = 0;
            i < 10;
            i++
        ) {

            addEnemy({
                id: `forest_wolf_${i}`,
                x: randomInt(300, 3100),
                y: randomInt(250, 2100),
                name: "LOBO FLORESTAL",
                icon: "🐺",
                type: "normal",
                hp: 95,
                maxHp: 95,
                damage: 14,
                speed: 105,
                vision: 260,
                attackRange: 60,
                radius: 22,
                color: "#666a74",
                drop:
                    i % 2
                        ? "carvao"
                        : "erva",
                dropAmount: 1
            });
        }


        addEnemy({
            id: "forest_resource_boss",
            x: 2550,
            y: 1700,
            name: "ALCE ANCIÃO",
            icon: "🦌",
            type: "resourceBoss",
            hp: 520,
            maxHp: 520,
            damage: 22,
            speed: 55,
            vision: 310,
            attackRange: 75,
            radius: 32,
            color: "#788a5f",
            drop: "ouro",
            dropAmount: 2,
            respawnTime: 60
        });


        addNPC(
            720,
            850,
            "NARA",
            "Guardião da Floresta",
            "#7ea56b",
            [
                "As árvores aqui lembram quem passa entre elas.",
                "A Quietude chegou antes de nós. Algumas folhas caem sem vento.",
                "Há um bosque ao norte. As criaturas lá protegem algo antigo.",
                "Preserve suas memórias. É assim que a magia cresce."
            ]
        );


        addNPC(
            2100,
            1400,
            "ORIN",
            "Caçador",
            "#91765c",
            [
                "Eu nunca caço quem não me vê. Os monstros daqui também têm regras.",
                "Quando você entra no campo de visão de uma criatura, ela percebe você.",
                "Se atacar primeiro, espere que ela responda.",
                "Os caminhos para as montanhas estão bloqueados por criaturas mais fortes."
            ]
        );


        addPortal(
            3260,
            1000,
            70,
            220,
            "grove",
            "forestBoss",
            "BOSQUE"
        );
    }


    /* =====================================================
       BOSQUE
    ====================================================== */

    function buildGrove() {

        for (
            let i = 0;
            i < 55;
            i++
        ) {

            addTree(
                randomInt(120, 3050),
                randomInt(120, 2180),
                `grove_tree_${i}`
            );
        }


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            addEnemy({
                id: `grove_beast_${i}`,
                x: randomInt(300, 2900),
                y: randomInt(250, 2050),
                name: "FERA DO BOSQUE",
                icon: "🦌",
                type: "normal",
                hp: 120,
                maxHp: 120,
                damage: 16,
                speed: 92,
                vision: 250,
                attackRange: 60,
                radius: 23,
                color: "#60725d",
                drop: "ferro",
                dropAmount: 1
            });
        }


        addEnemy({
            id: "grove_guardian",
            x: 2750,
            y: 1100,
            name: "GUARDIÃO DO BOSQUE",
            icon: "🌳",
            type: "progression",
            hp: 380,
            maxHp: 380,
            damage: 25,
            speed: 65,
            vision: 300,
            attackRange: 80,
            radius: 30,
            color: "#4f7c4d",
            drop: "ouro",
            dropAmount: 2,
            gateTarget: "mountains"
        });


        addNPC(
            1450,
            780,
            "LYRA",
            "Druida",
            "#829f6f",
            [
                "Você chegou onde a floresta tenta lembrar do que era antes.",
                "O próximo caminho leva às montanhas, mas o Guardião não confia nos viajantes.",
                "A Quietude se alimenta de memórias abandonadas.",
                "Leve histórias com você. Elas são uma forma de resistência."
            ]
        );


        addPortal(
            3060,
            990,
            70,
            220,
            "mountains",
            "groveGuardian",
            "MONTANHAS"
        );
    }


    /* =====================================================
       MONTANHAS
    ====================================================== */

    function buildMountains() {

        for (
            let i = 0;
            i < 18;
            i++
        ) {

            addObstacle(
                randomInt(200, 3200),
                randomInt(160, 2100),
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
                id: `mountain_beast_${i}`,
                x: randomInt(400, 3000),
                y: randomInt(250, 2000),
                name: "BESTA DAS MONTANHAS",
                icon: "🐐",
                type: "normal",
                hp: 150,
                maxHp: 150,
                damage: 19,
                speed: 72,
                vision: 260,
                attackRange: 65,
                radius: 24,
                color: "#d0d3d1",
                drop: "ferro",
                dropAmount: 2
            });
        }


        addEnemy({
            id: "mountain_guardian",
            x: 2800,
            y: 1050,
            name: "SENTINELA DAS MONTANHAS",
            icon: "🗿",
            type: "progression",
            hp: 460,
            maxHp: 460,
            damage: 27,
            speed: 58,
            vision: 320,
            attackRange: 80,
            radius: 32,
            color: "#8d9191",
            drop: "ouro",
            dropAmount: 3,
            gateTarget: "ironCave"
        });


        addNPC(
            750,
            900,
            "KAEL",
            "Montanhista",
            "#d2d6d2",
            [
                "O frio preserva algumas memórias melhor que o calor.",
                "Abaixo da montanha existe uma Caverna de Ferro.",
                "Não subestime as criaturas que guardam minério.",
                "Depois das montanhas, a cor das cavernas muda."
            ]
        );


        addPortal(
            3150,
            980,
            70,
            220,
            "ironCave",
            "mountainGuardian",
            "CAVERNA DE FERRO"
        );
    }


    /* =====================================================
       CAVERNA DE FERRO
    ====================================================== */

    function buildIronCave() {

        for (
            let i = 0;
            i < 28;
            i++
        ) {

            addObstacle(
                randomInt(160, 2700),
                randomInt(180, 1700),
                65,
                48,
                "ironrock"
            );
        }


        for (
            let i = 0;
            i < 24;
            i++
        ) {

            addResource(
                randomInt(250, 2600),
                randomInt(220, 1650),
                "ferro"
            );
        }


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            addEnemy({
                id: `iron_beast_${i}`,
                x: randomInt(400, 2500),
                y: randomInt(250, 1650),
                name: "MINERADOR ESQUECIDO",
                icon: "⛏️",
                type: "normal",
                hp: 175,
                maxHp: 175,
                damage: 21,
                speed: 62,
                vision: 250,
                attackRange: 70,
                radius: 24,
                color: "#5e6568",
                drop: "ferro",
                dropAmount: 2
            });
        }


        addEnemy({
            id: "iron_guardian",
            x: 2450,
            y: 950,
            name: "GUARDIÃO DE FERRO",
            icon: "⚙️",
            type: "progression",
            hp: 560,
            maxHp: 560,
            damage: 30,
            speed: 55,
            vision: 320,
            attackRange: 85,
            radius: 32,
            color: "#6d7478",
            drop: "ouro",
            dropAmount: 3,
            gateTarget: "rubyCave"
        });


        addPortal(
            2750,
            820,
            80,
            240,
            "rubyCave",
            "ironGuardian",
            "CAVERNA DE RUBI"
        );
    }


    /* =====================================================
       CAVERNA DE RUBI
    ====================================================== */

    function buildRubyCave() {

        for (
            let i = 0;
            i < 25;
            i++
        ) {

            addObstacle(
                randomInt(180, 2850),
                randomInt(180, 1850),
                68,
                48,
                "rubyrock"
            );
        }


        for (
            let i = 0;
            i < 30;
            i++
        ) {

            addResource(
                randomInt(250, 2850),
                randomInt(180, 1900),
                "rubi"
            );
        }


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            addEnemy({
                id: `ruby_beast_${i}`,
                x: randomInt(400, 2600),
                y: randomInt(250, 1800),
                name: "CRIATURA RUBI",
                icon: "♦",
                type: "normal",
                hp: 210,
                maxHp: 210,
                damage: 25,
                speed: 70,
                vision: 260,
                attackRange: 70,
                radius: 25,
                color: "#9f4254",
                drop: "rubi",
                dropAmount: 1
            });
        }


        addEnemy({
            id: "ruby_guardian",
            x: 2500,
            y: 1000,
            name: "GUARDIÃO DE RUBI",
            icon: "🔴",
            type: "progression",
            hp: 700,
            maxHp: 700,
            damage: 34,
            speed: 60,
            vision: 340,
            attackRange: 90,
            radius: 34,
            color: "#a83e50",
            drop: "rubi",
            dropAmount: 3,
            gateTarget: "shadowCave"
        });


        addPortal(
            2780,
            850,
            80,
            240,
            "shadowCave",
            "rubyGuardian",
            "CAVERNA SOMBRIA"
        );
    }


    /* =====================================================
       CAVERNA SOMBRIA
    ====================================================== */

    function buildShadowCave() {

        for (
            let i = 0;
            i < 32;
            i++
        ) {

            addObstacle(
                randomInt(170, 2700),
                randomInt(160, 1800),
                70,
                50,
                "darkrock"
            );
        }


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            addEnemy({
                id: `shadow_beast_${i}`,
                x: randomInt(350, 2600),
                y: randomInt(250, 1750),
                name: "SOMBRA ESQUECIDA",
                icon: "👤",
                type: "normal",
                hp: 240,
                maxHp: 240,
                damage: 29,
                speed: 78,
                vision: 290,
                attackRange: 70,
                radius: 25,
                color: "#443d58",
                drop: "essencia",
                dropAmount: 1
            });
        }


        addEnemy({
            id: "shadow_guardian",
            x: 2500,
            y: 950,
            name: "GUARDIÃO SOMBRIO",
            icon: "🌑",
            type: "progression",
            hp: 820,
            maxHp: 820,
            damage: 38,
            speed: 64,
            vision: 350,
            attackRange: 90,
            radius: 35,
            color: "#44354e",
            drop: "essencia",
            dropAmount: 3,
            gateTarget: "fairy"
        });


        addPortal(
            2760,
            820,
            90,
            250,
            "fairy",
            "shadowGuardian",
            "REINO DAS FADAS"
        );
    }


    /* =====================================================
       REINO DAS FADAS
    ====================================================== */

    function buildFairy() {

        for (
            let i = 0;
            i < 30;
            i++
        ) {

            addResource(
                randomInt(170, 3000),
                randomInt(180, 2000),
                "cristal"
            );
        }


        for (
            let i = 0;
            i < 15;
            i++
        ) {

            state.world.effects.push({
                type: "flower",
                x: randomInt(150, 3050),
                y: randomInt(150, 2050),
                phase: random(0, 6)
            });
        }


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            addEnemy({
                id: `fairy_beast_${i}`,
                x: randomInt(450, 2700),
                y: randomInt(300, 1800),
                name: "ESPÍRITO FEÉRICO",
                icon: "🦋",
                type: "normal",
                hp: 260,
                maxHp: 260,
                damage: 31,
                speed: 92,
                vision: 290,
                attackRange: 70,
                radius: 23,
                color: "#b887be",
                drop: "cristal",
                dropAmount: 1
            });
        }


        addEnemy({
            id: "fairy_guardian",
            x: 2500,
            y: 1000,
            name: "GUARDIÃ DOS FIOS DE MEMÓRIA",
            icon: "🧚",
            type: "progression",
            hp: 980,
            maxHp: 980,
            damage: 42,
            speed: 70,
            vision: 360,
            attackRange: 90,
            radius: 36,
            color: "#cb8dd0",
            drop: "essencia",
            dropAmount: 3,
            gateTarget: "sky"
        });


        addNPC(
            1000,
            1000,
            "AELIA",
            "Habitante das Fadas",
            "#d49ad4",
            [
                "As flores daqui brilham quando alguém lembra de algo importante.",
                "A Quietude odeia memória compartilhada.",
                "O Céu guarda uma passagem que não pertence a este mundo.",
                "Não chegue ao céu pensando que a história terminou."
            ]
        );


        addPortal(
            3000,
            900,
            80,
            300,
            "sky",
            "fairyGuardian",
            "CÉU"
        );
    }


    /* =====================================================
       CÉU
    ====================================================== */

    function buildSky() {

        for (
            let i = 0;
            i < 22;
            i++
        ) {

            addResource(
                randomInt(180, 3200),
                randomInt(180, 1950),
                "cristal"
            );
        }


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            addEnemy({
                id: `sky_beast_${i}`,
                x: randomInt(500, 3000),
                y: randomInt(260, 1800),
                name: "SERAFIM CAÍDO",
                icon: "🪽",
                type: "normal",
                hp: 320,
                maxHp: 320,
                damage: 35,
                speed: 105,
                vision: 320,
                attackRange: 75,
                radius: 26,
                color: "#cbd8e1",
                drop: "cristal",
                dropAmount: 2
            });
        }


        addEnemy({
            id: "sky_guardian",
            x: 2850,
            y: 1100,
            name: "SERAFIM DA QUIETUDE",
            icon: "☀️",
            type: "progression",
            hp: 1150,
            maxHp: 1150,
            damage: 47,
            speed: 72,
            vision: 380,
            attackRange: 100,
            radius: 38,
            color: "#d4b17a",
            drop: "essencia",
            dropAmount: 4,
            gateTarget: "hell"
        });


        addNPC(
            1200,
            850,
            "AERIS",
            "Guardião Celeste",
            "#c7d4df",
            [
                "O céu também foi tocado.",
                "Algumas memórias chegam aqui antes de serem apagadas.",
                "O Inferno não é apenas um lugar. É onde a Quietude se torna consciente.",
                "Você ainda pode voltar. Mas, se continuar, não poderá fingir que não sabe."
            ]
        );


        addPortal(
            3220,
            980,
            80,
            260,
            "hell",
            "skyGuardian",
            "INFERNO"
        );
    }


    /* =====================================================
       INFERNO
    ====================================================== */

    function buildHell() {

        for (
            let i = 0;
            i < 25;
            i++
        ) {

            addObstacle(
                randomInt(170, 3400),
                randomInt(170, 2150),
                70,
                50,
                "basalt"
            );
        }


        const enemyTypes = [
            {
                name: "DEMÔNIO DE CINZA",
                icon: "🔥",
                color: "#8a4d3e",
                drop: "essencia"
            },

            {
                name: "CÃO DE LAVA",
                icon: "🐕",
                color: "#94482f",
                drop: "ouro"
            },

            {
                name: "ESPECTRO CARMESIM",
                icon: "👻",
                color: "#6f4057",
                drop: "essencia"
            },

            {
                name: "GÁRGULA QUEBRADA",
                icon: "🗿",
                color: "#695148",
                drop: "ouro"
            },

            {
                name: "PARASITA DO VAZIO",
                icon: "🕷️",
                color: "#4a354f",
                drop: "essencia"
            }
        ];


        enemyTypes.forEach(
            (info, index) => {

                for (
                    let i = 0;
                    i < 2;
                    i++
                ) {

                    addEnemy({
                        id: `hell_${index}_${i}`,

                        x:
                            randomInt(
                                400,
                                3000
                            ),

                        y:
                            randomInt(
                                250,
                                2100
                            ),

                        name:
                            info.name,

                        icon:
                            info.icon,

                        type:
                            "hell",

                        hellType:
                            index,

                        hp:
                            360 +
                            index * 40,

                        maxHp:
                            360 +
                            index * 40,

                        damage:
                            34 +
                            index * 3,

                        speed:
                            80 +
                            index * 5,

                        vision:
                            330,

                        attackRange:
                            75,

                        radius:
                            26,

                        color:
                            info.color,

                        drop:
                            info.drop,

                        dropAmount:
                            1
                    });

                }

            }
        );


        addEnemy({
            id: "hell_guardian",
            x: 3050,
            y: 1100,
            name: "SENHOR DA QUIETUDE",
            icon: "👿",
            type: "progression",
            hp: 1500,
            maxHp: 1500,
            damage: 55,
            speed: 76,
            vision: 420,
            attackRange: 105,
            radius: 40,
            color: "#a64139",
            drop: "essencia",
            dropAmount: 6,
            gateTarget: "final"
        });


        addPortal(
            3390,
            980,
            70,
            260,
            "final",
            "hellGuardian",
            "CÂMARA FINAL"
        );
    }


    /* =====================================================
       CÂMARA FINAL
    ====================================================== */

    function buildFinal() {

        addEnemy({
            id: "other_self",
            x: 1500,
            y: 700,
            name: "O OUTRO EU",
            icon: "☯",
            type: "final",
            hp: 2200,
            maxHp: 2200,
            damage: 62,
            speed: 88,
            vision: 600,
            attackRange: 110,
            radius: 42,
            color: "#c3b5a4",
            drop: "essencia",
            dropAmount: 10
        });
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
            dy * dy
        ) <
            radius * radius;
    }


    function canMoveTo(
        x,
        y,
        radius
    ) {

        if (state.houseMode) {

            const area = {
                x: 200,
                y: 160,
                w:
                    state.currentHouse
                        ?.interior?.w ||
                    250,
                h:
                    state.currentHouse
                        ?.interior?.h ||
                    150
            };

            return (
                x - radius >= area.x &&
                y - radius >= area.y &&
                x + radius <=
                    area.x + area.w &&
                y + radius <=
                    area.y + area.h
            );
        }


        if (
            x - radius < 70 ||
            y - radius < 70 ||
            x + radius >
                state.world.width - 70 ||
            y + radius >
                state.world.height - 70
        ) {

            return false;
        }


        for (
            const obstacle of
            state.world.obstacles
        ) {

            if (
                obstacle.disabled
            ) {

                continue;
            }


            if (
                obstacle.type ===
                    "tree" &&
                obstacle.treeId
            ) {

                const tree =
                    state.world.trees.find(
                        t =>
                            t.id ===
                            obstacle.treeId
                    );

                if (
                    !tree ||
                    !tree.alive
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


        if (!state.houseMode) {

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
        }


        return true;
    }


    /* =====================================================
       MOVIMENTO
    ====================================================== */

    function updateMovement(dt) {

        if (
            state.paused ||
            state.houseMode
        ) {

            return;
        }


        let dx = 0;
        let dy = 0;


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
            dx === 0 &&
            dy === 0
        ) {

            return;
        }


        const length =
            Math.hypot(dx, dy);

        dx /= length;
        dy /= length;


        const p =
            state.player;


        let speed =
            p.speed;


        if (
            p.hunger <= 20
        ) {

            speed *=
                0.72;
        }


        if (
            p.fatigue <= 20
        ) {

            speed *=
                0.72;
        }


        const step =
            speed * dt;


        const nextX =
            p.x +
            dx * step;


        if (
            canMoveTo(
                nextX,
                p.y,
                p.radius
            )
        ) {

            p.x =
                nextX;
        }


        const nextY =
            p.y +
            dy * step;


        if (
            canMoveTo(
                p.x,
                nextY,
                p.radius
            )
        ) {

            p.y =
                nextY;
        }
    }


    /* =====================================================
       SOBREVIVÊNCIA
    ====================================================== */

    function updateSurvival(dt) {

        if (
            state.houseMode
        ) {

            return;
        }


        const p =
            state.player;


        p.hunger =
            clamp(
                p.hunger -
                    0.35 * dt,
                0,
                p.maxHunger
            );


        p.fatigue =
            clamp(
                p.fatigue -
                    0.28 * dt,
                0,
                p.maxFatigue
            );


        p.energy =
            clamp(
                p.energy +
                    3.2 * dt,
                0,
                p.maxEnergy
            );


        p.maxMagic =
            currentCharacter().magic +
            Math.floor(
                p.memory / 5
            ) *
                3;


        p.magic =
            clamp(
                p.magic +
                    1.7 * dt,
                0,
                p.maxMagic
            );


        if (
            p.hunger <= 0 ||
            p.fatigue <= 0
        ) {

            p.hp =
                clamp(
                    p.hp -
                        0.25 * dt,
                    1,
                    p.maxHp
                );
        }
    }


    /* =====================================================
       IA DOS INIMIGOS
    ====================================================== */

    function updateEnemies(dt) {

        const player =
            state.player;


        for (
            const enemy of
            state.world.enemies
        ) {

            if (
                enemy.dead
            ) {

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


            const distanceToPlayer =
                dist(
                    enemy,
                    player
                );


            /*
             * BOSS FINAL:
             * não ataca até o jogador decidir.
             */

            if (
                enemy.type ===
                    "final" &&
                !player.finalChoice
            ) {

                if (
                    distanceToPlayer <
                    120
                ) {

                    openFinalChoice();
                }

                continue;
            }


            /*
             * BOSS DE PROGRESSÃO:
             * só ataca depois de aceitar a batalha.
             */

            if (
                enemy.type ===
                    "progression" &&
                !enemy.accepted
            ) {

                if (
                    distanceToPlayer <
                    enemy.radius +
                        60
                ) {

                    enemy.state =
                        "waiting";
                }

                continue;
            }


            /*
             * CAMPO DE VISÃO
             */

            if (
                !enemy.aggressive &&
                distanceToPlayer <=
                    enemy.vision
            ) {

                enemy.aggressive =
                    true;

                enemy.state =
                    "chasing";

                showToast(
                    `${enemy.name} percebeu você!`
                );

                beep("hit");
            }


            if (
                !enemy.aggressive
            ) {

                continue;
            }


            /*
             * Perde o jogador se sair
             * muito além do campo de visão.
             */

            if (
                distanceToPlayer >
                    enemy.vision * 1.9 &&
                enemy.type !==
                    "hell"
            ) {

                enemy.aggressive =
                    false;

                enemy.state =
                    "idle";

                continue;
            }


            /*
             * PERSEGUIÇÃO
             */

            if (
                distanceToPlayer >
                    enemy.attackRange
            ) {

                let dx =
                    player.x -
                    enemy.x;

                let dy =
                    player.y -
                    enemy.y;

                const length =
                    Math.hypot(
                        dx,
                        dy
                    ) || 1;

                dx /= length;
                dy /= length;


                const step =
                    enemy.speed *
                    dt;


                const nextX =
                    enemy.x +
                    dx * step;

                const nextY =
                    enemy.y +
                    dy * step;


                if (
                    !state.world.obstacles.some(
                        obstacle =>
                            !obstacle.disabled &&
                            circleRectCollision(
                                nextX,
                                enemy.y,
                                enemy.radius,
                                obstacle
                            )
                    )
                ) {

                    enemy.x =
                        nextX;
                }


                if (
                    !state.world.obstacles.some(
                        obstacle =>
                            !obstacle.disabled &&
                            circleRectCollision(
                                enemy.x,
                                nextY,
                                enemy.radius,
                                obstacle
                            )
                    )
                ) {

                    enemy.y =
                        nextY;
                }

            }

            /*
             * ATAQUE
             */

            else if (
                enemy.attackTimer <= 0
            ) {

                damagePlayer(
                    enemy.damage
                );

                enemy.attackTimer =
                    1.15;
            }


            /*
             * Mecânicas especiais do boss final.
             */

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


    /* =====================================================
       BOSS FINAL
    ====================================================== */

    function updateFinalBoss(
        enemy,
        dt
    ) {

        const percent =
            enemy.hp /
            enemy.maxHp;


        const phase =
            percent > 0.75
                ? 1
                : percent > 0.5
                    ? 2
                    : percent > 0.25
                        ? 3
                        : 4;


        if (
            phase !==
            enemy.phase
        ) {

            enemy.phase =
                phase;

            showToast(
                `O Outro Eu entrou na Fase ${phase}.`
            );

            beep("magic");
        }


        if (
            Math.random() <
            dt *
                (phase + 0.3) *
                0.22
        ) {

            if (
                phase >= 2
            ) {

                state.world.effects.push(
                    {
                        type: "orb",
                        x: enemy.x,
                        y: enemy.y,
                        life: 2
                    }
                );
            }


            if (
                phase >= 3
            ) {

                addObstacle(
                    enemy.x +
                        random(
                            -100,
                            100
                        ),
                    enemy.y +
                        random(
                            -100,
                            100
                        ),
                    40,
                    30,
                    "memoryrock"
                );
            }


            if (
                phase >= 4
            ) {

                damagePlayer(
                    8 * phase
                );
            }
        }
    }


    /* =====================================================
       DANO NO PLAYER
    ====================================================== */

    function damagePlayer(
        amount
    ) {

        const p =
            state.player;


        if (
            !p ||
            p.invincible >
                0
        ) {

            return;
        }


        const armorDefense =
            ITEMS[
                p.equipment.armor
            ]?.defense || 0;


        const finalDamage =
            Math.max(
                1,
                Math.round(
                    amount -
                        (
                            p.defense +
                            armorDefense
                        ) *
                            0.35
                )
            );


        p.hp =
            Math.max(
                0,
                p.hp -
                    finalDamage
            );


        p.invincible =
            0.65;


        showToast(
            `Você sofreu ${finalDamage} de dano.`
        );


        beep("hit");


        if (
            p.hp <= 0
        ) {

            playerDeath();
        }
    }


    /* =====================================================
       MORTE
    ====================================================== */

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

        $("deathPanel")
            .classList.remove(
                "hidden"
            );
    }


    function respawnPlayer() {

        const p =
            state.player;


        p.dead =
            false;


        state.area =
            p.checkpoint.area;


        buildArea();


        p.x =
            p.checkpoint.x;

        p.y =
            p.checkpoint.y;


        p.hp =
            Math.round(
                p.maxHp * 0.7
            );

        p.magic =
            Math.round(
                p.maxMagic * 0.7
            );

        p.energy =
            Math.round(
                p.maxEnergy * 0.7
            );

        p.money =
            Math.floor(
                p.money * 0.9
            );


        state.paused =
            false;


        $("deathPanel")
            .classList.add(
                "hidden"
            );


        showToast(
            "Você retornou ao último checkpoint."
        );
    }


    /* =====================================================
       ATAQUE
    ====================================================== */

    function performPlayerAttack() {

        const p =
            state.player;


        if (
            state.dialogue
        ) {

            advanceDialogue();

            return;
        }


        if (
            state.travel ||
            state.battle
        ) {

            return;
        }


        if (
            p.attackCooldown >
                0
        ) {

            return;
        }


        const c =
            currentCharacter();


        if (
            p.energy <
            c.skillCost
        ) {

            showToast(
                "Energia insuficiente."
            );

            return;
        }


        p.energy -=
            c.skillCost;


        p.hunger =
            Math.max(
                0,
                p.hunger - 1.5
            );


        p.fatigue =
            Math.max(
                0,
                p.fatigue - 2
            );


        p.attackCooldown =
            0.45;


        const target =
            findNearestEnemy(
                Math.max(
                    115,
                    c.id ===
                        "kaelion"
                        ? 280
                        : 150
                )
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

                return;
            }


            let damage =
                p.damage;


            if (
                c.id ===
                "theron"
            ) {

                damage += 10;
            }


            if (
                c.id ===
                "grumgar"
            ) {

                damage += 18;
            }


            if (
                c.id ===
                "kaelion"
            ) {

                damage += 6;
            }


            if (
                p.equipment.weapon
            ) {

                damage +=
                    ITEMS[
                        p.equipment.weapon
                    ]?.damage ||
                    0;
            }


            attackEnemy(
                target,
                damage
            );


            return;
        }


        /*
         * Se não existe inimigo,
         * a habilidade ainda faz algo.
         */

        useClassSkill();
    }


    function useClassSkill() {

        const p =
            state.player;

        const c =
            currentCharacter();


        if (
            c.id ===
            "lirael"
        ) {

            p.hp =
                clamp(
                    p.hp + 50,
                    0,
                    p.maxHp
                );

            showToast(
                "Lirael canalizou Luz Vital."
            );

        }

        else if (
            c.id ===
            "zephyr"
        ) {

            p.speed += 25;

            p.damage += 5;

            setTimeout(
                () => {

                    if (
                        state.player
                    ) {

                        p.speed -=
                            25;

                        p.damage -=
                            5;
                    }

                },
                8000
            );

            showToast(
                "Zephyr assumiu uma forma adaptativa."
            );

        }

        else {

            showToast(
                `${c.skill}!`
            );
        }


        spawnParticles(
            p.x,
            p.y,
            c.color,
            18
        );

        beep("magic");
    }


    /* =====================================================
       INIMIGO PRÓXIMO
    ====================================================== */

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
                dist(
                    enemy,
                    state.player
                );


            if (
                d <
                    range &&
                d <
                    bestDistance
            ) {

                best =
                    enemy;

                bestDistance =
                    d;
            }
        }


        return best;
    }


    /* =====================================================
       DANO NO INIMIGO
    ====================================================== */

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
            0.18;


        beep("hit");


        if (
            enemy.hp <=
                0
        ) {

            defeatEnemy(
                enemy
            );

        }

    }


    /* =====================================================
       MORTE DO INIMIGO
    ====================================================== */

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


        let xp =
            30;


        if (
            enemy.type ===
            "progression"
        ) {

            xp =
                180;
        }

        else if (
            enemy.type ===
            "resourceBoss"
        ) {

            xp =
                120;
        }

        else if (
            enemy.type ===
            "hell"
        ) {

            xp =
                55;
        }


        state.player.xp +=
            xp;


        state.player.money +=
            enemy.type ===
                "progression"
                ? 80
                : 12;


        state.player.enemiesDefeated++;


        if (
            enemy.drop
        ) {

            addItem(
                enemy.drop,
                enemy.dropAmount ||
                    1
            );


            state.world.drops.push(
                {
                    x: enemy.x,
                    y: enemy.y,
                    type: enemy.drop,
                    amount:
                        enemy.dropAmount ||
                        1,
                    life: 18
                }
            );
        }


        if (
            enemy.type ===
                "hell" &&
            enemy.hellType !==
                undefined
        ) {

            state.player.hellTypesDefeated[
                enemy.hellType
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
                enemy.gateTarget &&
                !state.player.unlockedAreas.includes(
                    enemy.gateTarget
                )
            ) {

                state.player.unlockedAreas.push(
                    enemy.gateTarget
                );


                showToast(
                    `Nova região desbloqueada: ${REGIONS[
                        enemy.gateTarget
                    ]?.name || enemy.gateTarget}`
                );
            }
        }


        if (
            enemy.type ===
            "final"
        ) {

            state.player.finalDefeated =
                true;

            endGame(
                "fight"
            );
        }


        checkLevelUp();

        saveGame(false);

        showToast(
            `${enemy.name} derrotado! +${xp} XP`
        );
    }


    /* =====================================================
       LEVEL UP
    ====================================================== */

    function checkLevelUp() {

        const p =
            state.player;


        while (
            p.xp >=
            p.xpToNext
        ) {

            p.xp -=
                p.xpToNext;


            p.level++;


            p.xpToNext =
                Math.floor(
                    p.xpToNext *
                    1.42
                );


            p.maxHp +=
                12;

            p.maxMagic +=
                8;

            p.maxEnergy +=
                8;

            p.hp =
                p.maxHp;

            p.magic =
                p.maxMagic;

            p.energy =
                p.maxEnergy;

            p.memory =
                Math.min(
                    p.memoryMax,
                    p.memory + 8
                );


            beep("level");

            showToast(
                `Nível ${p.level}!`
            );
        }
    }


    /* =====================================================
       RECURSOS / COLETA
    ====================================================== */

    function getNearestTree() {

        let best =
            null;

        let bestDistance =
            Infinity;


        for (
            const tree of
            state.world.trees
        ) {

            if (
                !tree.alive
            ) {

                continue;
            }


            const d =
                dist(
                    tree,
                    state.player
                );


            if (
                d <
                    75 &&
                d <
                    bestDistance
            ) {

                best =
                    tree;

                bestDistance =
                    d;
            }
        }


        return best;
    }


    function getNearestResource() {

        let best =
            null;

        let bestDistance =
            Infinity;


        for (
            const resource of
            state.world.resources
        ) {

            if (
                !resource.alive
            ) {

                continue;
            }


            const d =
                dist(
                    resource,
                    state.player
                );


            if (
                d <
                    75 &&
                d <
                    bestDistance
            ) {

                best =
                    resource;

                bestDistance =
                    d;
            }
        }


        return best;
    }


    function harvestTree(
        tree
    ) {

        if (
            !tree ||
            !tree.alive
        ) {

            return;
        }


        const cost =
            randomInt(3, 5);


        if (
            state.player.magic <
            cost
        ) {

            showToast(
                "Você precisa de magia para coletar madeira."
            );

            return;
        }


        state.player.magic -=
            cost;


        state.player.hunger =
            Math.max(
                0,
                state.player.hunger - 1
            );


        state.player.fatigue =
            Math.max(
                0,
                state.player.fatigue - 2
            );


        tree.alive =
            false;

        tree.respawn =
            random(
                12,
                24
            );


        const key =
            `tree:${state.area}`;


        const already =
            state.player.collected[
                key
            ] || 0;


        const xp =
            Math.max(
                3,
                8 -
                    Math.floor(
                        already / 3
                    )
            );


        state.player.collected[
            key
        ] =
            already + 1;


        addItem(
            "madeira",
            tree.amount
        );


        state.player.treesCut++;

        state.player.xp +=
            xp;


        spawnParticles(
            tree.x,
            tree.y,
            "#9b7345",
            10
        );


        beep("collect");


        showToast(
            `Madeira coletada: x${tree.amount}`
        );


        updateInventory();
    }


    function collectResource(
        resource
    ) {

        if (
            !resource ||
            !resource.alive
        ) {

            return;
        }


        const costs = {

            carvao: [6, 9],

            ferro: [12, 16],

            ouro: [22, 30],

            rubi: [35, 45],

            cristal: [15, 20]

        };


        const [minCost, maxCost] =
            costs[
                resource.resource
            ] || [6, 9];


        const cost =
            randomInt(
                minCost,
                maxCost
            );


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
                state.player.hunger - 1
            );


        state.player.fatigue =
            Math.max(
                0,
                state.player.fatigue - 2
            );


        resource.alive =
            false;

        resource.respawn =
            random(
                18,
                35
            );


        const key =
            `resource:${state.area}:${resource.resource}`;


        const seen =
            state.player.collected[
                key
            ] || 0;


        state.player.collected[
            key
        ] =
            seen + 1;


        const xp =
            Math.max(
                2,
                6 -
                    Math.min(
                        4,
                        Math.floor(
                            seen / 3
                        )
                    )
            );


        addItem(
            resource.resource,
            resource.amount
        );


        state.player.memory =
            Math.min(
                state.player.memoryMax,
                state.player.memory + 1
            );


        state.player.xp +=
            xp;


        beep("collect");


        showToast(
            `${ITEMS[
                resource.resource
            ]?.name || resource.resource} coletado: x${resource.amount}`
        );


        checkLevelUp();
    }


    function updateResources(dt) {

        for (
            const tree of
            state.world.trees
        ) {

            if (
                !tree.alive
            ) {

                tree.respawn -=
                    dt;


                if (
                    tree.respawn <=
                    0
                ) {

                    let tries =
                        0;


                    do {

                        tree.x =
                            randomInt(
                                120,
                                state.world.width -
                                    120
                            );

                        tree.y =
                            randomInt(
                                120,
                                state.world.height -
                                    120
                            );

                        tries++;

                    }
                    while (
                        tries < 50 &&
                        !canMoveTo(
                            tree.x,
                            tree.y,
                            38
                        )
                    );


                    tree.alive =
                        true;


                    const obstacle =
                        state.world.obstacles.find(
                            o =>
                                o.treeId ===
                                tree.id
                        );


                    if (
                        obstacle
                    ) {

                        obstacle.x =
                            tree.x - 30;

                        obstacle.y =
                            tree.y - 38;
                    }
                }
            }
        }


        for (
            const resource of
            state.world.resources
        ) {

            if (
                !resource.alive
            ) {

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
        }


        for (
            const enemy of
            state.world.enemies
        ) {

            if (
                enemy.type ===
                    "resourceBoss" &&
                enemy.dead
            ) {

                enemy.respawnTimer =
                    (
                        enemy.respawnTimer ||
                        enemy.respawnTime ||
                        60
                    ) -
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

                    enemy.state =
                        "idle";

                    enemy.respawnTimer =
                        0;

                    showToast(
                        `${enemy.name} retornou à região.`
                    );
                }
            }
        }
    }


    /* =====================================================
       INTERAÇÃO
    ====================================================== */

    function getInteraction() {

        const p =
            state.player;


        if (
            !p
        ) {

            return null;
        }


        if (
            state.houseMode
        ) {

            return {

                type:
                    "houseExit",

                object:
                    state.currentHouse
            };
        }


        let best =
            null;

        let bestDistance =
            Infinity;


        for (
            const npc of
            state.world.npcs
        ) {

            const d =
                dist(
                    npc,
                    p
                );


            if (
                d < 70 &&
                d < bestDistance
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


        for (
            const tree of
            state.world.trees
        ) {

            if (
                !tree.alive
            ) {

                continue;
            }


            const d =
                dist(
                    tree,
                    p
                );


            if (
                d < 72 &&
                d < bestDistance
            ) {

                best = {

                    type:
                        "tree",

                    object:
                        tree
                };


                bestDistance =
                    d;
            }
        }


        for (
            const resource of
            state.world.resources
        ) {

            if (
                !resource.alive
            ) {

                continue;
            }


            const d =
                dist(
                    resource,
                    p
                );


            if (
                d < 75 &&
                d < bestDistance
            ) {

                best = {

                    type:
                        "resource",

                    object:
                        resource
                };


                bestDistance =
                    d;
            }
        }


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
                dist(
                    enemy,
                    p
                );


            if (
                d < 105 &&
                d < bestDistance
            ) {

                best = {

                    type:
                        enemy.type ===
                        "progression"
                            ? "boss"
                            : "enemy",

                    object:
                        enemy
                };


                bestDistance =
                    d;
            }
        }


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
                Math.hypot(
                    p.x - door.x,
                    p.y - door.y
                );


            if (
                d < 88 &&
                d < bestDistance
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


        if (
            state.travel ||
            state.battle
        ) {

            return;
        }


        const interaction =
            getInteraction();


        if (
            interaction
        ) {

            switch (
                interaction.type
            ) {

                case "npc":

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


                case "tree":

                    harvestTree(
                        interaction.object
                    );

                    return;


                case "resource":

                    collectResource(
                        interaction.object
                    );

                    return;


                case "boss":

                    if (
                        !interaction.object
                            .accepted
                    ) {

                        openBattle(
                            interaction.object
                        );

                    }

                    else {

                        performPlayerAttack();
                    }

                    return;


                case "enemy":

                    performPlayerAttack();

                    return;


                case "house":

                case "houseExit":

                    /*
                     * Casa é Z, não E.
                     */
                    return;
            }
        }


        performPlayerAttack();
    }


    /* =====================================================
       NPC / DIÁLOGO
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


        $("dialogueBox")
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


        $("dialogueSpeaker")
            .textContent =
            dialogue.npc.name;


        $("dialogueText")
            .textContent =
            "";


        dialogue.timer =
            setInterval(
                () => {

                    dialogue.charIndex++;


                    $("dialogueText")
                        .textContent =
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
                15
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


            const line =
                dialogue.lines[
                    dialogue.index
                ];


            $("dialogueText")
                .textContent =
                line;


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


        $("dialogueBox")
            .classList.add(
                "hidden"
            );
    }


    /* =====================================================
       MISSÕES
    ====================================================== */

    function openQuest(npc) {

        state.currentQuestNPC =
            npc;


        const quest =
            state.player.quest[
                npc.questId
            ];


        const isWood =
            npc.questId ===
            "wood";


        $("questTitle")
            .textContent =
            isWood
                ? "Madeira para a Vila"
                : "Carvão para a Forja";


        $("questText")
            .textContent =
            isWood
                ? "Colete 10 madeiras para reforçar as casas do sul."
                : "Colete 8 carvões para ajudar o ferreiro.";


        const item =
            isWood
                ? "madeira"
                : "carvao";


        const current =
            state.player.inventory[
                item
            ] || 0;


        $("questStatus")
            .textContent =
            `Progresso: ${Math.min(
                current,
                quest.need
            )} / ${quest.need}`;


        const button =
            $("questAction");


        button.textContent =
            quest.state ===
            "none"

                ? "ACEITAR"

                : quest.state ===
                    "accepted"

                    ? "ENTREGAR"

                    : "CONCLUÍDA";


        button.disabled =
            quest.state ===
            "completed";


        $("questPanel")
            .classList.remove(
                "hidden"
            );
    }


    function executeQuest() {

        const npc =
            state.currentQuestNPC;


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
                "accepted" &&
            hasItem(
                item,
                quest.need
            )
        ) {

            removeItem(
                item,
                quest.need
            );


            quest.state =
                "completed";


            state.player.money +=
                quest.reward;


            state.player.xp +=
                quest.reward;


            checkLevelUp();


            showToast(
                "Missão concluída e recompensa recebida."
            );
        }


        openQuest(
            npc
        );
    }


    /* =====================================================
       HELPER ITEM
    ====================================================== */

    function hasItem(
        id,
        amount
    ) {

        return (
            state.player
                .inventory[id] ||
            0
        ) >= amount;
    }


    function removeItem(
        id,
        amount
    ) {

        if (
            !hasItem(
                id,
                amount
            )
        ) {

            return false;
        }


        state.player
            .inventory[id] -=
            amount;


        return true;
    }


    function addItem(
        id,
        amount
    ) {

        if (
            !ITEMS[id]
        ) {

            return;
        }


        if (
            state.player.inventory[
                id
            ] === undefined
        ) {

            state.player.inventory[
                id
            ] = 0;
        }


        state.player.inventory[
            id
        ] += amount;
    }


    /* =====================================================
       INVENTÁRIO
    ====================================================== */

    function openInventory() {

        updateInventory();

        $("inventoryPanel")
            .classList.remove(
                "hidden"
            );
    }


    function updateInventory() {

        const grid =
            $("inventoryGrid");


        grid.innerHTML = "";


        for (
            const [id, count] of
            Object.entries(
                state.player.inventory
            )
        ) {

            if (
                count <= 0
            ) {

                continue;
            }


            const item =
                ITEMS[id];


            if (
                !item
            ) {

                continue;
            }


            if (
                state.inventoryCategory !==
                    "all" &&
                item.category !==
                    state.inventoryCategory
            ) {

                continue;
            }


            const slot =
                document.createElement(
                    "div"
                );


            slot.className =
                "inventory-item owned";


            slot.innerHTML = `

                <div class="icon">
                    ${item.icon}
                </div>

                <span class="name">
                    ${item.name}
                </span>

                <span class="count">
                    x${count}
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


        if (
            grid.children.length ===
            0
        ) {

            grid.innerHTML = `
                <div
                    class="muted"
                    style="
                        grid-column:1/-1;
                        text-align:center;
                        padding:30px
                    "
                >
                    Nenhum item nesta categoria.
                </div>
            `;
        }


        let weight = 0;


        for (
            const [id, count] of
            Object.entries(
                state.player.inventory
            )
        ) {

            weight +=
                (
                    ITEMS[id]
                        ?.weight ||
                    0
                ) *
                count;
        }


        $("weightText")
            .textContent =
            `${weight}/100`;


        updateEquipment();
    }


    function useItem(
        id
    ) {

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
                removeItem(
                    id,
                    1
                )
            ) {

                state.player.hp =
                    clamp(
                        state.player.hp +
                            item.heal,
                        0,
                        state.player.maxHp
                    );

                showToast(
                    "Poção usada."
                );

                beep("collect");
            }
        }


        else if (
            item.mana
        ) {

            if (
                removeItem(
                    id,
                    1
                )
            ) {

                state.player.energy =
                    clamp(
                        state.player.energy +
                            item.mana,
                        0,
                        state.player.maxEnergy
                    );

                showToast(
                    "Elixir usado."
                );

                beep("collect");
            }
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


        else if (
            id ===
            "mapa"
        ) {

            state.player.mapOwned =
                true;

            showToast(
                "Mapa adquirido."
            );
        }


        updateInventory();

        updateHUD();
    }


    function updateEquipment() {

        const grid =
            $("equipmentGrid");


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

                <b>
                    ${weapon}
                </b>

                ${
                    state.player.equipment.weapon
                        ? `
                            <button
                                data-slot="weapon"
                            >
                                Desequipar
                            </button>
                        `
                        : ""
                }

            </div>


            <div class="equipment-slot">

                Armadura

                <b>
                    ${armor}
                </b>

                ${
                    state.player.equipment.armor
                        ? `
                            <button
                                data-slot="armor"
                            >
                                Desequipar
                            </button>
                        `
                        : ""
                }

            </div>


            <div class="equipment-slot">

                Ferramenta

                <b>
                    ${tool}
                </b>

            </div>
        `;


        grid
            .querySelectorAll(
                "button"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            state.player
                                .equipment[
                                    button.dataset.slot
                                ] = null;


                            updateInventory();
                        }
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


        $("shopTitle")
            .textContent =
            `LOJA DE ${npc.name}`;


        renderShop();


        $("shopPanel")
            .classList.remove(
                "hidden"
            );
    }


    function renderShop() {

        const grid =
            $("shopGrid");


        grid.innerHTML = "";


        if (
            state.shopMode ===
            "buy"
        ) {

            const goods = [
                "pocao",
                "elixir",
                "espadaFerro",
                "armaduraCouro",
                "mapa"
            ];


            goods.forEach(
                id => {

                    const item =
                        ITEMS[id];


                    const price =
                        id ===
                            "mapa"
                            ? 350
                            : item.value;


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
                                Item útil para sua jornada.
                            </small>

                        </div>

                        <div class="shop-price">
                            💰 ${price}
                        </div>

                        <button class="small-btn">
                            Comprar
                        </button>

                    `;


                    row
                        .querySelector(
                            "button"
                        )
                        .addEventListener(
                            "click",
                            () => {

                                if (
                                    id ===
                                        "mapa" &&
                                    state.player
                                        .mapOwned
                                ) {

                                    showToast(
                                        "Você já possui o mapa."
                                    );

                                    return;
                                }


                                if (
                                    state.player.money <
                                    price
                                ) {

                                    showToast(
                                        "Dinheiro insuficiente."
                                    );

                                    return;
                                }


                                state.player.money -=
                                    price;


                                if (
                                    id ===
                                    "mapa"
                                ) {

                                    state.player.mapOwned =
                                        true;

                                }

                                else {

                                    addItem(
                                        id,
                                        1
                                    );
                                }


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

        }

        else {

            for (
                const [id, count] of
                Object.entries(
                    state.player.inventory
                )
            ) {

                if (
                    count <= 0
                ) {

                    continue;
                }


                const item =
                    ITEMS[id];


                if (
                    !item
                ) {

                    continue;
                }


                const price =
                    Math.max(
                        1,
                        Math.floor(
                            item.value *
                            .7
                        )
                    );


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
                            Quantidade: ${count}
                        </small>

                    </div>

                    <div class="shop-price">
                        💰 ${price}
                    </div>

                    <button class="small-btn">
                        Vender
                    </button>

                `;


                row
                    .querySelector(
                        "button"
                    )
                    .addEventListener(
                        "click",
                        () => {

                            if (
                                removeItem(
                                    id,
                                    1
                                )
                            ) {

                                state.player.money +=
                                    price;


                                showToast(
                                    `${item.name} vendido.`
                                );


                                renderShop();

                                updateHUD();
                            }
                        }
                    );


                grid.appendChild(
                    row
                );
            }
        }
    }


    /* =====================================================
       MAPA
    ====================================================== */

    function openMap() {

        if (
            !state.player.mapOwned
        ) {

            showToast(
                "Você precisa comprar o mapa com Doran."
            );

            return;
        }


        drawMap();


        $("mapPanel")
            .classList.remove(
                "hidden"
            );
    }


    function drawMap() {

        const width = 900;
        const height = 560;


        mapCanvas.width =
            width;

        mapCanvas.height =
            height;


        mapCtx.fillStyle =
            "#1d291e";


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
            "#8a6b4f";


        for (
            const building of
            state.world.buildings
        ) {

            mapCtx.fillRect(
                building.x * sx,
                building.y * sy,
                building.w * sx,
                building.h * sy
            );
        }


        for (
            const enemy of
            state.world.enemies
        ) {

            if (
                enemy.dead
            ) {

                continue;
            }


            mapCtx.fillStyle =
                enemy.type ===
                    "progression"
                    ||
                    enemy.type ===
                        "final"
                    ? "#ff544a"
                    : "#db8663";


            mapCtx.beginPath();


            mapCtx.arc(
                enemy.x * sx,
                enemy.y * sy,
                enemy.type ===
                    "progression"
                    ||
                    enemy.type ===
                        "final"
                    ? 7
                    : 4,
                0,
                Math.PI * 2
            );


            mapCtx.fill();
        }


        mapCtx.fillStyle =
            "#e0c57b";


        for (
            const npc of
            state.world.npcs
        ) {

            mapCtx.fillRect(
                npc.x * sx - 3,
                npc.y * sy - 3,
                6,
                6
            );
        }


        mapCtx.fillStyle =
            "#5a9ed1";


        for (
            const portal of
            state.world.portals
        ) {

            mapCtx.fillRect(
                portal.x * sx,
                portal.y * sy,
                portal.w * sx,
                portal.h * sy
            );
        }


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


    /* =====================================================
       LIVRO
    ====================================================== */

    function openBook() {

        renderBook();


        $("bookPanel")
            .classList.remove(
                "hidden"
            );
    }


    function renderBook() {

        const grid =
            $("bossBook");


        grid.innerHTML = "";


        const bossIds = [

            "forest_guardian",

            "grove_guardian",

            "mountain_guardian",

            "iron_guardian",

            "ruby_guardian",

            "shadow_guardian",

            "fairy_guardian",

            "sky_guardian",

            "hell_guardian",

            "other_self"
        ];


        bossIds.forEach(
            id => {

                const known =
                    state.player
                        .discoveredBosses
                        .includes(
                            id
                        );


                const defeated =
                    state.player
                        .defeatedBosses
                        .includes(
                            id
                        );


                const enemy =
                    state.world.enemies.find(
                        e =>
                            e.id === id
                    );


                const entry =
                    document.createElement(
                        "div"
                    );


                entry.className =
                    "boss-entry" +
                    (
                        known ||
                        defeated
                            ? " known"
                            : ""
                    );


                if (
                    !known &&
                    !defeated
                ) {

                    entry.innerHTML = `

                        <div class="boss-symbol">
                            ?
                        </div>

                        <strong>
                            DESCONHECIDO
                        </strong>

                        <p>
                            Descubra este boss para
                            atualizar o Livro.
                        </p>

                    `;

                }

                else {

                    entry.innerHTML = `

                        <div class="boss-symbol">
                            ${enemy?.icon || "☠"}
                        </div>

                        <strong>
                            ${enemy?.name || id}
                        </strong>

                        <p>
                            ${
                                defeated
                                    ? "Derrotado."
                                    : "Ainda ativo."
                            }
                        </p>

                        <p>
                            “A memória guarda o que o
                            mundo tenta apagar.”
                        </p>

                    `;
                }


                grid.appendChild(
                    entry
                );
            }
        );
    }


    /* =====================================================
       CASAS
    ====================================================== */

    function enterHouse() {

        if (
            state.area !==
            "village" ||
            state.houseMode
        ) {

            return;
        }


        let closest =
            null;

        let best =
            100;


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
                Math.hypot(
                    state.player.x -
                        door.x,
                    state.player.y -
                        door.y
                );


            if (
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


        state.currentHouse =
            closest;


        state.houseMode =
            true;


        for (
            const obstacle of
            state.world.obstacles
        ) {

            if (
                obstacle.type ===
                "building"
            ) {

                obstacle.disabled =
                    true;
            }
        }


        state.player.x =
            320;


        state.player.y =
            280;


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


        const building =
            state.currentHouse;


        for (
            const obstacle of
            state.world.obstacles
        ) {

            if (
                obstacle.type ===
                "building"
            ) {

                obstacle.disabled =
                    false;
            }
        }


        state.houseMode =
            false;


        state.player.x =
            building.x +
            building.w /
                2;


        state.player.y =
            building.y +
            building.h +
            55;


        state.currentHouse =
            null;


        showToast(
            "Você saiu da casa."
        );
    }


    function handleZ() {

        if (
            state.dialogue
        ) {

            advanceDialogue();

            return;
        }


        if (
            state.houseMode
        ) {

            exitHouse();

            return;
        }


        enterHouse();
    }


    /* =====================================================
       BATALHA ESPECIAL
    ====================================================== */

    function openBattle(
        enemy
    ) {

        state.battle =
            enemy;


        $("battleIcon")
            .textContent =
            enemy.icon;


        $("battleTitle")
            .textContent =
            enemy.name;


        $("battleText")
            .textContent =
            `${enemy.name} bloqueia a progressão. Se aceitar, a criatura ficará agressiva e a batalha começará.`;


        $("battlePanel")
            .classList.remove(
                "hidden"
            );


        state.paused =
            true;
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


        state.battle = null;

        state.paused =
            false;


        $("battlePanel")
            .classList.add(
                "hidden"
            );


        showToast(
            "Batalha aceita!"
        );


        beep("magic");
    }


    function declineBattle() {

        state.battle =
            null;

        state.paused =
            false;


        $("battlePanel")
            .classList.add(
                "hidden"
            );
    }


    /* =====================================================
       PORTAIS
    ====================================================== */

    function requirementMet(
        requirement
    ) {

        const p =
            state.player;


        const requirements = {

            guardianForest:
                () =>
                    p.defeatedBosses.includes(
                        "forest_guardian"
                    ),

            forestBoss:
                () =>
                    p.defeatedBosses.includes(
                        "forest_guardian"
                    ),

            groveGuardian:
                () =>
                    p.defeatedBosses.includes(
                        "grove_guardian"
                    ),

            mountainGuardian:
                () =>
                    p.defeatedBosses.includes(
                        "mountain_guardian"
                    ),

            ironGuardian:
                () =>
                    p.defeatedBosses.includes(
                        "iron_guardian"
                    ),

            rubyGuardian:
                () =>
                    p.defeatedBosses.includes(
                        "ruby_guardian"
                    ),

            shadowGuardian:
                () =>
                    p.defeatedBosses.includes(
                        "shadow_guardian"
                    ),

            fairyGuardian:
                () =>
                    p.defeatedBosses.includes(
                        "fairy_guardian"
                    ),

            skyGuardian:
                () =>
                    p.defeatedBosses.includes(
                        "sky_guardian"
                    ),

            questWood:
                () =>
                    p.quest.wood.state ===
                    "completed" ||
                    p.defeatedBosses.includes(
                        "forest_guardian"
                    ),

            hellGuardian:
                () =>
                    p.defeatedBosses.includes(
                        "hell_guardian"
                    ) &&
                    Object.keys(
                        p.hellTypesDefeated
                    ).length >=
                        5
        };


        return (
            !requirement ||
            Boolean(
                requirements[
                    requirement
                ]?.()
            )
        );
    }


    function checkPortals() {

        if (
            state.houseMode ||
            state.paused ||
            state.portalCooldown >
                0
        ) {

            return;
        }


        for (
            const portal of
            state.world.portals
        ) {

            const inside =
                state.player.x >
                    portal.x &&
                state.player.x <
                    portal.x +
                    portal.w &&
                state.player.y >
                    portal.y &&
                state.player.y <
                    portal.y +
                    portal.h;


            if (
                !inside
            ) {

                continue;
            }


            if (
                !requirementMet(
                    portal.requirement
                )
            ) {

                showToast(
                    "Esse caminho ainda está bloqueado."
                );


                state.player.x =
                    Math.max(
                        90,
                        portal.x -
                            65
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


        $("travelTitle")
            .textContent =
            "DESEJA CONTINUAR?";


        $("travelText")
            .textContent =
            `O caminho leva para ${portal.title}. Deseja continuar?`;


        $("travelPanel")
            .classList.remove(
                "hidden"
            );
    }


    function cancelTravel() {

        state.travel =
            null;

        state.paused =
            false;

        state.portalCooldown =
            1.2;


        $("travelPanel")
            .classList.add(
                "hidden"
            );
    }


    function confirmTravel() {

        const portal =
            state.travel;


        if (
            !portal
        ) {

            return;
        }


        state.travel =
            null;


        $("travelPanel")
            .classList.add(
                "hidden"
            );


        transitionTo(
            portal.target
        );
    }


    function transitionTo(
        target
    ) {

        const transition =
            $("transitionScreen");


        transition
            .classList
            .remove(
                "hidden"
            );


        $("transitionMessage")
            .textContent =
            `Viajando para ${REGIONS[target].name}...`;


        state.paused =
            true;


        setTimeout(
            () => {

                state.area =
                    target;


                buildArea();


                state.player.x =
                    150;


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


                if (
                    !state.player.unlockedAreas.includes(
                        target
                    )
                ) {

                    state.player.unlockedAreas.push(
                        target
                    );
                }


                state.player.magic =
                    state.player.maxMagic;


                state.player.energy =
                    state.player.maxEnergy;


                state.paused =
                    false;


                transition
                    .classList
                    .add(
                        "hidden"
                    );


                showToast(
                    `Você chegou a ${REGIONS[target].name}.`
                );


                saveGame(
                    false
                );

            },
            650
        );
    }


    /* =====================================================
       CHECKPOINT
    ====================================================== */

    function ensureCheckpoint() {

        if (
            !state.player.checkpoint
        ) {

            state.player.checkpoint = {

                area:
                    state.area,

                x:
                    state.player.x,

                y:
                    state.player.y
            };
        }
    }


    /* =====================================================
       FINAL
    ====================================================== */

    function openFinalChoice() {

        if (
            state.player.finalChoice
        ) {

            return;
        }


        state.paused =
            true;


        $("finalPanel")
            .classList.remove(
                "hidden"
            );
    }


    function chooseFinal(
        choice
    ) {

        state.player.finalChoice =
            choice;


        $("finalPanel")
            .classList.add(
                "hidden"
            );


        state.paused =
            false;


        if (
            choice ===
            "join"
        ) {

            endGame(
                "join"
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


    function endGame(
        type
    ) {

        state.running =
            false;

        state.paused =
            true;


        $("transitionScreen")
            .classList.remove(
                "hidden"
            );


        $("transitionMessage")
            .textContent =
            type ===
                "join"
                ? "QUIETUDE ABSOLUTA"
                : "VEYRA FOI PRESERVADA";


        setTimeout(
            () => {

                $("transitionScreen")
                    .classList.add(
                        "hidden"
                    );


                showScreen(
                    "menu"
                );


                updateContinueButton();


                showToast(
                    type ===
                        "join"
                        ? "Você aceitou a Quietude."
                        : "Você derrotou o Outro Eu."
                );

            },
            2500
        );


        saveGame(
            false
        );
    }


    /* =====================================================
       RENDER — CHÃO
    ====================================================== */

    function drawGround() {

        const visual =
            REGIONS[
                state.area
            ].visual;


        const colors = {

            village:
                "#566d4c",

            forest:
                "#3e6141",

            mountains:
                "#90969a",

            cave:
                "#292e31",

            ruby:
                "#48252b",

            shadow:
                "#171c2d",

            fairy:
                "#54426b",

            sky:
                "#93b3c8",

            hell:
                "#48211f",

            final:
                "#191719"
        };


        ctx.fillStyle =
            colors[
                visual
            ] || "#566d4c";


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
            y += tile
        ) {

            for (
                let x = 70;
                x <
                state.world.width -
                    70;
                x += tile
            ) {

                ctx.fillStyle =
                    (
                        (
                            x / tile +
                            y / tile
                        ) %
                        2 ===
                            0
                    )
                        ? "rgba(255,255,255,.015)"
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
                "rgba(18,22,18,.22)";


            ctx.beginPath();


            ctx.moveTo(
                2200,
                650
            );


            ctx.bezierCurveTo(
                2700,
                500,
                3200,
                750,
                3050,
                1200
            );


            ctx.bezierCurveTo(
                3100,
                1500,
                2600,
                1540,
                2350,
                1270
            );


            ctx.bezierCurveTo(
                2140,
                1040,
                2140,
                780,
                2200,
                650
            );


            ctx.fill();


            ctx.fillStyle =
                "#a99d7d";


            ctx.font =
                "bold 15px Georgia";


            ctx.textAlign =
                "center";


            ctx.fillText(
                "TERRAS TOCADAS PELO VAZIO",
                2700,
                1030
            );
        }


        if (
            visual ===
            "hell"
        ) {

            ctx.fillStyle =
                "rgba(170,45,25,.18)";


            ctx.fillRect(
                0,
                0,
                state.world.width,
                state.world.height
            );
        }


        if (
            visual ===
            "shadow"
        ) {

            ctx.fillStyle =
                "rgba(20,20,55,.34)";


            ctx.fillRect(
                0,
                0,
                state.world.width,
                state.world.height
            );
        }
    }


    /* =====================================================
       RENDER — CAMINHOS
    ====================================================== */

    function drawPaths() {

        if (
            state.area !==
            "village"
        ) {

            return;
        }


        ctx.fillStyle =
            "#b89d6b";


        ctx.globalAlpha =
            0.72;


        ctx.fillRect(
            70,
            1080,
            state.world.width -
                140,
            115
        );


        ctx.fillRect(
            1545,
            70,
            110,
            state.world.height -
                140
        );


        ctx.fillRect(
            1690,
            1110,
            1030,
            72
        );


        ctx.fillRect(
            610,
            1110,
            95,
            600
        );


        ctx.globalAlpha =
            1;
    }


    /* =====================================================
       RENDER — GRAMA
    ====================================================== */

    function drawGrass() {

        if (
            state.area ===
                "cave" ||
            state.area ===
                "rubyCave"
        ) {

            return;
        }


        ctx.strokeStyle =
            "rgba(35,75,40,.45)";


        ctx.lineWidth = 2;


        for (
            let y = 100;
            y <
            state.world.height -
                100;
            y += 45
        ) {

            for (
                let x = 100;
                x <
                state.world.width -
                    100;
                x += 45
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


    /* =====================================================
       RENDER — CONSTRUÇÕES
    ====================================================== */

    function drawBuildings() {

        if (
            state.houseMode &&
            state.currentHouse
        ) {

            drawHouseInterior(
                state.currentHouse
            );

            return;
        }


        for (
            const building of
            state.world.buildings
        ) {

            ctx.fillStyle =
                "rgba(0,0,0,.28)";


            ctx.fillRect(
                building.x + 14,
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
                building.x - 25,
                building.y
            );


            ctx.lineTo(
                building.x +
                    building.w / 2,
                building.y - 100
            );


            ctx.lineTo(
                building.x +
                    building.w + 25,
                building.y
            );


            ctx.closePath();


            ctx.fill();


            ctx.fillStyle =
                "#4b3025";


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
                "#dbc67d";


            ctx.fillRect(
                building.x + 38,
                building.y + 60,
                50,
                42
            );


            ctx.fillRect(
                building.x +
                    building.w -
                    88,
                building.y + 60,
                50,
                42
            );


            ctx.fillStyle =
                "#171714";


            ctx.fillRect(
                building.x +
                    building.w / 2 -
                    85,

                building.y +
                    building.h +
                    10,

                170,
                25
            );


            ctx.fillStyle =
                "#efdfb8";


            ctx.font =
                "bold 12px Georgia";


            ctx.textAlign =
                "center";


            ctx.fillText(
                building.name,
                building.x +
                    building.w / 2,
                building.y +
                    building.h +
                    27
            );
        }
    }


    function drawHouseInterior(
        building
    ) {

        ctx.fillStyle =
            "#6f513d";


        ctx.fillRect(
            0,
            0,
            state.world.width,
            state.world.height
        );


        const room =
            building.interior;


        ctx.fillStyle =
            "#9b7955";


        ctx.fillRect(
            200,
            160,
            room.w,
            room.h
        );


        ctx.strokeStyle =
            "#d2b477";


        ctx.lineWidth =
            5;


        ctx.strokeRect(
            200,
            160,
            room.w,
            room.h
        );


        ctx.fillStyle =
            "#4b3025";


        ctx.fillRect(
            200 +
                room.w / 2 -
                25,

            160 +
                room.h -
                8,

            50,
            20
        );


        ctx.fillStyle =
            "#d9c47d";


        ctx.fillRect(
            250,
            220,
            55,
            45
        );


        ctx.fillRect(
            200 +
                room.w -
                95,

            220,

            55,
            45
        );


        ctx.fillStyle =
            "#433225";


        ctx.fillRect(
            390,
            310,
            180,
            90
        );


        ctx.fillStyle =
            "#c59d6c";


        ctx.fillRect(
            420,
            345,
            120,
            15
        );


        ctx.fillStyle =
            "#b98d65";


        ctx.fillRect(
            690,
            290,
            90,
            120
        );


        ctx.fillStyle =
            "#f1dfb7";


        ctx.font =
            "bold 18px Georgia";


        ctx.textAlign =
            "center";


        ctx.fillText(
            building.name,
            200 +
                room.w / 2,
            130
        );


        ctx.font =
            "11px Arial";


        ctx.fillText(
            "[Z] SAIR",
            200 +
                room.w / 2,
            160 +
                room.h +
                35
        );
    }


    /* =====================================================
       RENDER — ÁRVORES
    ====================================================== */

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
                    state.time * 1.7 +
                        tree.x
                ) * 1.8;


            ctx.fillStyle =
                "rgba(0,0,0,.2)";


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
                "#6a4a31";


            ctx.fillRect(
                tree.x - 9,
                tree.y,
                18,
                42
            );


            ctx.fillStyle =
                "#315d37";


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
                "#467b46";


            ctx.beginPath();


            ctx.arc(
                tree.x -
                    14 +
                    sway,
                tree.y - 27,
                24,
                0,
                Math.PI * 2
            );


            ctx.arc(
                tree.x +
                    14 +
                    sway,
                tree.y - 28,
                25,
                0,
                Math.PI * 2
            );


            ctx.fill();


            if (
                !state.houseMode &&
                dist(
                    tree,
                    state.player
                ) <
                    85
            ) {

                ctx.strokeStyle =
                    "#d5b968";


                ctx.lineWidth =
                    2;


                ctx.beginPath();


                ctx.arc(
                    tree.x,
                    tree.y - 12,
                    40,
                    0,
                    Math.PI * 2
                );


                ctx.stroke();
            }
        }
    }


    /* =====================================================
       RENDER — RECURSOS
    ====================================================== */

    function drawResources() {

        const icons = {

            ferro: "⛓️",

            rubi: "♦",

            cristal: "💎",

            ouro: "🪙",

            carvao: "⬛"

        };


        for (
            const resource of
            state.world.resources
        ) {

            if (
                !resource.alive
            ) {

                continue;
            }


            ctx.font =
                "20px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(
                icons[
                    resource.resource
                ] ||
                    "✦",

                resource.x,
                resource.y + 7
            );
        }
    }


    /* =====================================================
       RENDER — OBSTÁCULOS
    ====================================================== */

    function drawObstacles() {

        for (
            const obstacle of
            state.world.obstacles
        ) {

            if (
                obstacle.disabled ||
                obstacle.type ===
                    "building" ||
                obstacle.type ===
                    "tree"
            ) {

                continue;
            }


            if (
                obstacle.type ===
                "wall"
            ) {

                ctx.fillStyle =
                    "#414944";


                ctx.fillRect(
                    obstacle.x,
                    obstacle.y,
                    obstacle.w,
                    obstacle.h
                );
            }


            else if (
                obstacle.type.includes(
                    "rock"
                )
            ) {

                const colors = {

                    rock:
                        "#6f746f",

                    rubyrock:
                        "#6d3447",

                    snowrock:
                        "#b8c0c2",

                    basalt:
                        "#403334",

                    memoryrock:
                        "#5b4b70",

                    darkrock:
                        "#313448",

                    ironrock:
                        "#62686a"

                };


                ctx.fillStyle =
                    colors[
                        obstacle.type
                    ] ||
                    "#6f746f";


                ctx.beginPath();


                ctx.ellipse(
                    obstacle.x +
                        obstacle.w / 2,

                    obstacle.y +
                        obstacle.h / 2,

                    obstacle.w / 2,

                    obstacle.h / 2,

                    -0.12,

                    0,

                    Math.PI * 2
                );


                ctx.fill();
            }


            else if (
                obstacle.type ===
                "fountain"
            ) {

                ctx.fillStyle =
                    "#89877a";


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
                    "#5a9bb0";


                ctx.beginPath();


                ctx.ellipse(
                    obstacle.x +
                        obstacle.w / 2,

                    obstacle.y +
                        obstacle.h / 2,

                    obstacle.w / 2 -
                        23,

                    obstacle.h / 2 -
                        23,

                    0,

                    0,

                    Math.PI * 2
                );


                ctx.fill();
            }
        }
    }


    /* =====================================================
       RENDER — NPC
    ====================================================== */

    function drawNPCs() {

        for (
            const npc of
            state.world.npcs
        ) {

            ctx.fillStyle =
                "rgba(0,0,0,.25)";


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
                "#29262a";


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
                "#f0dfb6";


            ctx.fillText(
                npc.name,
                npc.x,
                npc.y - 31
            );


            ctx.font =
                "10px Arial";


            ctx.fillStyle =
                "#cbc2ae";


            ctx.fillText(
                npc.role,
                npc.x,
                npc.y + 37
            );
        }
    }


    /* =====================================================
       RENDER — INIMIGOS
    ====================================================== */

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


            if (
                enemy.aggressive
            ) {

                ctx.strokeStyle =
                    "rgba(220,65,55,.12)";


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
                "rgba(0,0,0,.25)";


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
                enemy.hitFlash >
                    0
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
                    ? "#f0b762"
                    : "#d0bd74";


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
                    ? "#ffc58b"
                    : "#f0dfbd";


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
                "#1e1d1a";


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
                "#ba524b";


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
    }


    /* =====================================================
       RENDER — PORTAIS
    ====================================================== */

    function drawPortals() {

        for (
            const portal of
            state.world.portals
        ) {

            const unlocked =
                requirementMet(
                    portal.requirement
                );


            ctx.fillStyle =
                unlocked
                    ? "rgba(85,155,205,.23)"
                    : "rgba(80,80,80,.18)";


            ctx.fillRect(
                portal.x,
                portal.y,
                portal.w,
                portal.h
            );


            ctx.strokeStyle =
                unlocked
                    ? "#8fc4dc"
                    : "#73746d";


            ctx.lineWidth =
                2;


            ctx.strokeRect(
                portal.x,
                portal.y,
                portal.w,
                portal.h
            );


            ctx.fillStyle =
                unlocked
                    ? "#e9d6a0"
                    : "#96958c";


            ctx.font =
                "bold 12px Georgia";


            ctx.textAlign =
                "center";


            ctx.fillText(
                unlocked
                    ? "CONTINUAR"
                    : "BLOQUEADO",

                portal.x +
                    portal.w / 2,

                portal.y - 10
            );
        }
    }


    /* =====================================================
       RENDER — DROPS
    ====================================================== */

    function drawDrops() {

        const icons = {

            madeira:
                "🪵",

            carvao:
                "⬛",

            ferro:
                "⛓️",

            ouro:
                "🪙",

            rubi:
                "♦",

            cristal:
                "💎",

            essencia:
                "✦",

            erva:
                "🌿"

        };


        for (
            const drop of
            state.world.drops
        ) {

            if (
                drop.life <=
                0
            ) {

                continue;
            }


            ctx.font =
                "20px Arial";


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
    }


    /* =====================================================
       RENDER — EFEITOS
    ====================================================== */

    function drawEffects() {

        for (
            const effect of
            state.world.effects
        ) {

            if (
                effect.type ===
                "flower"
            ) {

                const glow =
                    Math.sin(
                        state.time +
                        effect.phase
                    ) *
                    0.2 +
                    0.45;


                ctx.fillStyle =
                    `rgba(237,187,255,${glow})`;


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


            if (
                effect.type ===
                "orb"
            ) {

                ctx.fillStyle =
                    "#d9baf0";


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
    }


    /* =====================================================
       RENDER — PARTÍCULAS
    ====================================================== */

    function drawParticles() {

        for (
            const particle of
            state.world.particles
        ) {

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


        ctx.globalAlpha =
            1;
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
                    30,
                    100
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
                        0.35,
                        0.8
                    ),

                color
            });
        }
    }


    /* =====================================================
       RENDER — PLAYER
    ====================================================== */

    function drawPlayer() {

        const p =
            state.player;


        if (
            !p
        ) {

            return;
        }


        if (
            p.invincible >
                0 &&
            Math.floor(
                p.invincible *
                    12
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
            p.x,
            p.y + 19,
            21,
            8,
            0,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            p.color;


        ctx.beginPath();


        ctx.arc(
            p.x,
            p.y,
            p.radius,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            "#e5c3a2";


        ctx.beginPath();


        ctx.arc(
            p.x,
            p.y - 12,
            10,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            "#2c241f";


        ctx.beginPath();


        ctx.arc(
            p.x,
            p.y - 16,
            10,
            Math.PI,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            "#fff0c6";


        ctx.font =
            "bold 13px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(
            p.name,
            p.x,
            p.y - 39
        );
    }


    /* =====================================================
       RENDER — COMPLETO
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

            drawBuildings();

            drawPlayer();

            drawParticles();

        }

        else {

            drawGround();

            drawPaths();

            drawGrass();

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

            drawParticles();
        }


        ctx.restore();


        drawMinimap();
    }


    /* =====================================================
       MINIMAPA
    ====================================================== */

    function drawMinimap() {

        miniCtx.clearRect(
            0,
            0,
            190,
            135
        );


        miniCtx.fillStyle =
            "#1b251c";


        miniCtx.fillRect(
            0,
            0,
            190,
            135
        );


        const sx =
            190 /
            state.world.width;


        const sy =
            135 /
            state.world.height;


        miniCtx.fillStyle =
            "#7f6249";


        for (
            const building of
            state.world.buildings
        ) {

            miniCtx.fillRect(
                building.x * sx,
                building.y * sy,
                building.w * sx,
                building.h * sy
            );
        }


        miniCtx.fillStyle =
            "#649dc5";


        for (
            const portal of
            state.world.portals
        ) {

            miniCtx.fillRect(
                portal.x * sx,
                portal.y * sy,
                portal.w * sx,
                portal.h * sy
            );
        }


        for (
            const enemy of
            state.world.enemies
        ) {

            if (
                enemy.dead
            ) {

                continue;
            }


            miniCtx.fillStyle =
                enemy.type ===
                    "progression" ||
                enemy.type ===
                    "final"

                    ? "#ff544a"

                    : "#db8663";


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


        miniCtx.fillStyle =
            "#e0c379";


        for (
            const npc of
            state.world.npcs
        ) {

            miniCtx.fillRect(
                npc.x * sx - 2,
                npc.y * sy - 2,
                4,
                4
            );
        }


        miniCtx.fillStyle =
            "#fff";


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
       HUD
    ====================================================== */

    function updateHUD() {

        const p =
            state.player;


        if (
            !p
        ) {

            return;
        }


        $("hudAvatar")
            .textContent =
            p.icon;


        $("hudName")
            .textContent =
            p.name;


        $("hudClass")
            .textContent =
            p.className;


        setBar(
            "hpBar",
            p.hp,
            p.maxHp
        );


        setBar(
            "magicBar",
            p.magic,
            p.maxMagic
        );


        setBar(
            "energyBar",
            p.energy,
            p.maxEnergy
        );


        setBar(
            "hungerBar",
            p.hunger,
            p.maxHunger
        );


        setBar(
            "fatigueBar",
            p.fatigue,
            p.maxFatigue
        );


        $("hpText")
            .textContent =
            `${Math.ceil(
                p.hp
            )}/${p.maxHp}`;


        $("magicText")
            .textContent =
            `${Math.ceil(
                p.magic
            )}/${Math.ceil(
                p.maxMagic
            )}`;


        $("energyText")
            .textContent =
            `${Math.ceil(
                p.energy
            )}/${p.maxEnergy}`;


        $("hungerText")
            .textContent =
            `${Math.ceil(
                p.hunger
            )}/${p.maxHunger}`;


        $("fatigueText")
            .textContent =
            `${Math.ceil(
                p.fatigue
            )}/${p.maxFatigue}`;


        $("levelText")
            .textContent =
            p.level;


        $("xpText")
            .textContent =
            `${p.xp}/${p.xpToNext}`;


        $("moneyText")
            .textContent =
            p.money;


        updateInteractionPrompt();
    }


    function setBar(
        id,
        value,
        max
    ) {

        $(id)
            .style
            .width =
            `${clamp(
                (
                    value /
                    max
                ) *
                    100,
                0,
                100
            )}%`;
    }


    function updateLocationUI() {

        $("locationLabel")
            .textContent =
            REGIONS[
                state.area
            ].name;
    }


    function updateInteractionPrompt() {

        const hint =
            $("interactionHint");


        if (
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
                "house" ||
            interaction.type ===
                "houseExit"
        ) {

            $("interactionKey")
                .textContent =
                "Z";

            $("interactionText")
                .textContent =
                interaction.type ===
                    "houseExit"
                    ? "Sair"
                    : "Entrar";

            return;
        }


        $("interactionKey")
            .textContent =
            "E";


        const labels = {

            npc:
                interaction.object
                    .merchant
                    ? "Abrir loja"
                    : interaction.object
                        .questId
                        ? "Ver missão"
                        : "Conversar",

            tree:
                "Cortar árvore",

            resource:
                `Coletar ${
                    ITEMS[
                        interaction.object.resource
                    ]?.name ||
                    "recurso"
                }`,

            boss:
                "Aceitar batalha",

            enemy:
                "Atacar"
        };


        $("interactionText")
            .textContent =
            labels[
                interaction.type
            ] ||
            "Interagir";
    }


    /* =====================================================
       CÂMERA
    ====================================================== */

    function updateCamera() {

        const width =
            window.innerWidth;


        const height =
            window.innerHeight;


        state.camera.x =
            clamp(
                state.player.x -
                    width / 2,
                0,
                Math.max(
                    0,
                    state.world.width -
                        width
                )
            );


        state.camera.y =
            clamp(
                state.player.y -
                    height / 2,
                0,
                Math.max(
                    0,
                    state.world.height -
                        height
                )
            );
    }


    /* =====================================================
       PARTÍCULAS / EFEITOS
    ====================================================== */

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
                        45 *
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
                        "orb"
                    ) {

                        effect.y -=
                            15 *
                            dt;

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


        for (
            const drop of
            state.world.drops
        ) {

            drop.life -=
                dt;
        }


        state.world.drops =
            state.world.drops.filter(
                drop =>
                    drop.life >
                    0
            );
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


        const save = {

            version: 12,

            area:
                state.area,

            player:
                state.player,

            savedAt:
                new Date().toISOString()
        };


        try {

            localStorage.setItem(
                SAVE_KEY,
                JSON.stringify(save)
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
                "Falha ao salvar:",
                error
            );


            showToast(
                "Não foi possível salvar."
            );
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
                !save ||
                !save.player
            ) {

                return false;
            }


            const character =
                CHARACTERS.find(
                    c =>
                        c.id ===
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


            state.player.inventory =
                save.player.inventory ||
                {};


            state.player.quest =
                save.player.quest ||
                {
                    wood: {
                        state: "none",
                        need: 10,
                        reward: 100
                    },

                    coal: {
                        state: "none",
                        need: 8,
                        reward: 140
                    }
                };


            state.player.flags =
                save.player.flags ||
                {};


            state.player.collected =
                save.player.collected ||
                {};


            state.player.discoveredBosses =
                save.player.discoveredBosses ||
                [];


            state.player.defeatedBosses =
                save.player.defeatedBosses ||
                [];


            state.player.unlockedAreas =
                save.player.unlockedAreas ||
                ["village"];


            state.player.hellTypesDefeated =
                save.player.hellTypesDefeated ||
                {};


            state.player.mapOwned =
                Boolean(
                    save.player.mapOwned
                );


            state.player.memory =
                Number(
                    save.player.memory
                ) || 0;


            state.player.memoryMax =
                Number(
                    save.player.memoryMax
                ) || 100;


            state.player.radius =
                18;


            state.player.invincible =
                0;


            state.player.attackCooldown =
                0;


            state.player.dead =
                false;


            state.area =
                REGIONS[
                    save.area
                ]
                    ? save.area
                    : "village";


            buildArea();


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


            localStorage.removeItem(
                SAVE_KEY
            );


            return false;
        }
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


        $("continueBtn")
            .disabled =
            !available;


        $("continueHint")
            .textContent =
            available
                ? "Existe um jogo salvo neste navegador."
                : "Nenhum jogo salvo encontrado.";
    }


    /* =====================================================
       MENU
    ====================================================== */

    function returnToMenu() {

        saveGame(
            false
        );


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


        state.currentQuestNPC =
            null;


        state.shopNPC =
            null;
    }


    /* =====================================================
       UPDATE PRINCIPAL
    ====================================================== */

    function update(
        dt
    ) {

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


        if (
            state.player.attackCooldown >
                0
        ) {

            state.player.attackCooldown =
                Math.max(
                    0,
                    state.player
                        .attackCooldown -
                        dt
                );
        }


        state.player.invincible =
            Math.max(
                0,
                state.player.invincible -
                    dt
            );


        if (
            !state.paused
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


            updateResources(
                dt
            );


            checkPortals();
        }


        updateVisualEffects(
            dt
        );


        updateCamera();


        updateHUD();


        if (
            $("mapPanel")
                .classList.contains(
                    "hidden"
                ) ===
                false
        ) {

            drawMap();
        }
    }


    function updateMovement(
        dt
    ) {

        updatePlayerMovement(
            dt
        );
    }


    function updatePlayerMovement(
        dt
    ) {

        if (
            state.houseMode
        ) {

            const p =
                state.player;


            let dx = 0;
            let dy = 0;


            if (
                state.keys.has(
                    "w"
                )
            ) {

                dy--;
            }

            if (
                state.keys.has(
                    "s"
                )
            ) {

                dy++;
            }

            if (
                state.keys.has(
                    "a"
                )
            ) {

                dx--;
            }

            if (
                state.keys.has(
                    "d"
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
                );


            dx /= length;
            dy /= length;


            const step =
                120 *
                dt;


            const nx =
                p.x +
                dx * step;


            const ny =
                p.y +
                dy * step;


            if (
                canMoveTo(
                    nx,
                    p.y,
                    p.radius
                )
            ) {

                p.x =
                    nx;
            }


            if (
                canMoveTo(
                    p.x,
                    ny,
                    p.radius
                )
            ) {

                p.y =
                    ny;
            }


            return;
        }


        updatePlayerFromWorld(
            dt
        );
    }


    function updatePlayerFromWorld(
        dt
    ) {

        let dx = 0;
        let dy = 0;


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
            );


        dx /= length;
        dy /= length;


        const p =
            state.player;


        let speed =
            p.speed;


        if (
            p.hunger <
            20
        ) {

            speed *=
                0.72;
        }


        if (
            p.fatigue <
            20
        ) {

            speed *=
                0.72;
        }


        const step =
            speed *
            dt;


        const nx =
            p.x +
            dx *
            step;


        if (
            canMoveTo(
                nx,
                p.y,
                p.radius
            )
        ) {

            p.x =
                nx;
        }


        const ny =
            p.y +
            dy *
            step;


        if (
            canMoveTo(
                p.x,
                ny,
                p.radius
            )
        ) {

            p.y =
                ny;
        }
    }


    /* =====================================================
       GAME LOOP
    ====================================================== */

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


    /* =====================================================
       EVENTOS
    ====================================================== */

    function bindEvents() {

        $("newGameBtn")
            .addEventListener(
                "click",
                startNewGame
            );


        $("continueBtn")
            .addEventListener(
                "click",
                () => {

                    if (
                        !loadGame()
                    ) {

                        showToast(
                            "Não foi possível carregar o jogo."
                        );
                    }
                }
            );


        $("howToBtn")
            .addEventListener(
                "click",
                () =>
                    showScreen(
                        "how"
                    )
            );


        $("creditsBtn")
            .addEventListener(
                "click",
                () =>
                    showScreen(
                        "credits"
                    )
            );


        $("closeHowBtn")
            .addEventListener(
                "click",
                () =>
                    showScreen(
                        "menu"
                    )
            );


        $("closeCreditsBtn")
            .addEventListener(
                "click",
                () =>
                    showScreen(
                        "menu"
                    )
            );


        $("backMenuBtn")
            .addEventListener(
                "click",
                () =>
                    showScreen(
                        "menu"
                    )
            );


        $("startGameBtn")
            .addEventListener(
                "click",
                startGame
            );


        $("playerName")
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


        $("saveBtn")
            .addEventListener(
                "click",
                () =>
                    saveGame(
                        true
                    )
            );


        $("menuBtn")
            .addEventListener(
                "click",
                returnToMenu
            );


        $("inventoryBtn")
            .addEventListener(
                "click",
                openInventory
            );


        $("mapBtn")
            .addEventListener(
                "click",
                openMap
            );


        $("bookBtn")
            .addEventListener(
                "click",
                openBook
            );


        $("closeInventory")
            .addEventListener(
                "click",
                () =>
                    $("inventoryPanel")
                        .classList.add(
                            "hidden"
                        )
            );


        $("closeMap")
            .addEventListener(
                "click",
                () =>
                    $("mapPanel")
                        .classList.add(
                            "hidden"
                        )
            );


        $("travelYes")
            .addEventListener(
                "click",
                confirmTravel
            );


        $("travelNo")
            .addEventListener(
                "click",
                cancelTravel
            );


        $("battleAccept")
            .addEventListener(
                "click",
                acceptBattle
            );


        $("battleDecline")
            .addEventListener(
                "click",
                declineBattle
            );


        $("respawnBtn")
            .addEventListener(
                "click",
                respawnPlayer
            );


        $("questAction")
            .addEventListener(
                "click",
                executeQuest
            );


        $("joinFinalBtn")
            .addEventListener(
                "click",
                () =>
                    chooseFinal(
                        "join"
                    )
            );


        $("fightFinalBtn")
            .addEventListener(
                "click",
                () =>
                    chooseFinal(
                        "fight"
                    )
            );


        document
            .querySelectorAll(
                "[data-close]"
            )
            .forEach(
                button =>
                    button.addEventListener(
                        "click",
                        () =>
                            $(
                                button
                                    .dataset
                                    .close
                            )
                                .classList
                                .add(
                                    "hidden"
                                )
                    )
            );


        document
            .querySelectorAll(
                "#inventoryTabs .tab"
            )
            .forEach(
                tab =>
                    tab.addEventListener(
                        "click",
                        () => {

                            document
                                .querySelectorAll(
                                    "#inventoryTabs .tab"
                                )
                                .forEach(
                                    button =>
                                        button.classList.remove(
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
                    )
            );


        document
            .querySelectorAll(
                "#shopTabs .tab"
            )
            .forEach(
                tab =>
                    tab.addEventListener(
                        "click",
                        () => {

                            document
                                .querySelectorAll(
                                    "#shopTabs .tab"
                                )
                                .forEach(
                                    button =>
                                        button.classList.remove(
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
                    )
            );


        window.addEventListener(
            "resize",
            resizeCanvas
        );


        window.addEventListener(
            "blur",
            () =>
                state.keys.clear()
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
        }


        if (
            key ===
            "e" &&
            !event.repeat
        ) {

            event.preventDefault();

            playerAction();
        }


        if (
            key ===
            "z" &&
            !event.repeat
        ) {

            event.preventDefault();

            handleZ();
        }


        if (
            key ===
            "i" &&
            !event.repeat
        ) {

            event.preventDefault();

            if (
                $("inventoryPanel")
                    .classList
                    .contains(
                        "hidden"
                    )
            ) {

                openInventory();

            }

            else {

                $("inventoryPanel")
                    .classList.add(
                        "hidden"
                    );
            }
        }


        if (
            key ===
            "m" &&
            !event.repeat
        ) {

            event.preventDefault();

            if (
                $("mapPanel")
                    .classList
                    .contains(
                        "hidden"
                    )
            ) {

                openMap();

            }

            else {

                $("mapPanel")
                    .classList.add(
                        "hidden"
                    );
            }
        }


        if (
            key ===
            "l" &&
            !event.repeat
        ) {

            event.preventDefault();

            if (
                $("bookPanel")
                    .classList
                    .contains(
                        "hidden"
                    )
            ) {

                openBook();

            }

            else {

                $("bookPanel")
                    .classList.add(
                        "hidden"
                    );
            }
        }


        if (
            key ===
            "1" &&
            !event.repeat
        ) {

            event.preventDefault();

            if (
                removeItem(
                    "pocao",
                    1
                )
            ) {

                state.player.hp =
                    clamp(
                        state.player.hp +
                            45,
                        0,
                        state.player.maxHp
                    );


                showToast(
                    "Poção de cura usada."
                );
            }
        }


        if (
            key ===
            "2" &&
            !event.repeat
        ) {

            event.preventDefault();

            if (
                removeItem(
                    "elixir",
                    1
                )
            ) {

                state.player.energy =
                    clamp(
                        state.player.energy +
                            50,
                        0,
                        state.player.maxEnergy
                    );


                showToast(
                    "Elixir de energia usado."
                );
            }
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


            closeAllPanels();


            if (
                screensGameActive()
            ) {

                returnToMenu();
            }
        }
    }


    function screensGameActive() {

        return $("gameScreen")
            .classList
            .contains(
                "active"
            );
    }


    function startNewGame() {

        $("playerName")
            .value = "";


        $("nameError")
            .textContent = "";


        state.selectedCharacter =
            CHARACTERS[0];


        document
            .querySelectorAll(
                ".character-card"
            )
            .forEach(
                (card, index) =>
                    card.classList.toggle(
                        "selected",
                        index === 0
                    )
            );


        showScreen(
            "character"
        );


        setTimeout(
            () =>
                $("playerName")
                    .focus(),
            100
        );
    }


    function startGame() {

        const name =
            $("playerName")
                .value
                .trim();


        if (
            name.length <
            2
        ) {

            $("nameError")
                .textContent =
                "Digite pelo menos 2 caracteres.";


            $("playerName")
                .focus();


            return;
        }


        $("nameError")
            .textContent = "";


        createPlayer(
            name,
            state.selectedCharacter
        );


        state.area =
            "village";


        buildArea();


        state.player.x =
            480;


        state.player.y =
            610;


        state.player.checkpoint = {

            area:
                "village",

            x:
                480,

            y:
                610
        };


        updateHUD();


        showScreen(
            "game"
        );


        state.running =
            true;


        state.paused =
            true;


        state.lastTime =
            performance.now();


        $("transitionScreen")
            .classList
            .remove(
                "hidden"
            );


        $("transitionMessage")
            .textContent =
            "VEYRA...";


        setTimeout(
            () => {

                $("transitionScreen")
                    .classList
                    .add(
                        "hidden"
                    );


                state.paused =
                    false;


                showToast(
                    "Bem-vindo à Vila do Crepúsculo."
                );

            },
            700
        );


        requestAnimationFrame(
            gameLoop
        );
    }


    /* =====================================================
       START
    ====================================================== */

    createCharacterCards();

    resizeCanvas();

    bindEvents();

    updateContinueButton();

})();
