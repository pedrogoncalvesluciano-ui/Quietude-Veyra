(() => {
    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ====================================================== */

    const SAVE_KEY = "veyra_save_v2";

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const mapCanvas = document.getElementById("mapCanvas");
    const mapCtx = mapCanvas.getContext("2d");

    const screens = {
        menu: document.getElementById("menuScreen"),
        howToPlay: document.getElementById("howToPlayScreen"),
        credits: document.getElementById("creditsScreen"),
        character: document.getElementById("characterScreen"),
        game: document.getElementById("gameScreen")
    };


    /* =====================================================
       PERSONAGENS
    ====================================================== */

    const characters = [

        {
            id: "kaelion",
            name: "KAELION",
            className: "Mago",
            icon: "🧙",
            role: "Magia • Longo alcance",

            description:
                "Mestre das artes arcanas. Frágil no corpo,
                devastador à distância.",

            hp: 85,
            energy: 140,
            speed: 175,

            damage: 25,
            attackRange: 260,
            attackCost: 15,

            color: "#8d7ad8",
            skillIcon: "✦",
            skillName: "Raio Arcano"
        },

        {
            id: "theron",
            name: "THERON",
            className: "Cavaleiro",
            icon: "🛡️",
            role: "Espada • Defesa",

            description:
                "Guerreiro resistente que domina o combate
                corpo a corpo.",

            hp: 140,
            energy: 90,
            speed: 145,

            damage: 32,
            attackRange: 75,
            attackCost: 10,

            color: "#b8b8bd",
            skillIcon: "⚔️",
            skillName: "Golpe Poderoso"
        },

        {
            id: "grumgar",
            name: "GRUMGAR",
            className: "Troll",
            icon: "👹",
            role: "Força • Vida",

            description:
                "Uma criatura brutal com enorme resistência
                e força física.",

            hp: 180,
            energy: 75,
            speed: 110,

            damage: 42,
            attackRange: 80,
            attackCost: 8,

            color: "#6f9d65",
            skillIcon: "💥",
            skillName: "Esmagamento"
        },

        {
            id: "lirael",
            name: "LIRAEL",
            className: "Fada",
            icon: "🧚",
            role: "Velocidade • Cura",

            description:
                "Extremamente rápida. Sua magia permite
                atacar e recuperar energia.",

            hp: 95,
            energy: 130,
            speed: 210,

            damage: 20,
            attackRange: 220,
            attackCost: 12,

            color: "#d994d2",
            skillIcon: "✨",
            skillName: "Luz Feérica"
        },

        {
            id: "zephyr",
            name: "ZEPHYR",
            className: "Transmorfo",
            icon: "🦊",
            role: "Adaptação • Equilíbrio",

            description:
                "Equilibrado e capaz de adaptar seu estilo
                de combate.",

            hp: 115,
            energy: 110,
            speed: 170,

            damage: 28,
            attackRange: 150,
            attackCost: 11,

            color: "#d59a61",
            skillIcon: "🌀",
            skillName: "Forma Selvagem"
        }

    ];


    /* =====================================================
       ESTADO
    ====================================================== */

    const state = {

        selectedCharacter: characters[0],

        player: null,

        keys: new Set(),

        running: false,

        lastTime: 0,

        world: {
            width: 3200,
            height: 2200,

            obstacles: [],
            buildings: [],
            decorations: [],

            npcs: [],
            enemies: [],
            resources: [],
            exits: []
        },

        camera: {
            x: 0,
            y: 0
        },

        dialogue: {
            npc: null,
            lines: [],
            index: 0,
            active: false
        },

        currentEnemy: null,

        toastTimer: null,

        transition: false,

        attackCooldown: 0,

        currentArea: "Vila Principal",

        progress: {
            treesBroken: 0,
            enemiesDefeated: 0,
            discovered: []
        }
    };


    /* =====================================================
       INVENTÁRIO
    ====================================================== */

    const defaultInventory = {

        madeira: {
            name: "Madeira",
            icon: "🪵",
            count: 0
        },

        pedra: {
            name: "Pedra",
            icon: "🪨",
            count: 0
        },

        erva: {
            name: "Erva",
            icon: "🌿",
            count: 0
        },

        cristal: {
            name: "Cristal",
            icon: "💎",
            count: 0
        },

        fragmento: {
            name: "Fragmento do Vazio",
            icon: "🌑",
            count: 0
        }

    };


    /* =====================================================
       TELAS
    ====================================================== */

    function showScreen(name) {

        Object.values(screens).forEach(screen => {
            screen.classList.remove("active");
        });

        screens[name].classList.add("active");
    }


    /* =====================================================
       CARTÕES
    ====================================================== */

    function createCharacterCards() {

        const container =
            document.getElementById("characterCards");

        container.innerHTML = "";

        characters.forEach((character, index) => {

            const card =
                document.createElement("button");

            card.type = "button";

            card.className =
                "character-card" +
                (index === 0 ? " selected" : "");

            card.innerHTML = `

                <div class="char-art">
                    ${character.icon}
                </div>

                <h3>
                    ${character.name}
                </h3>

                <p class="role">
                    ${character.className}
                </p>

                <p>
                    ${character.role}
                </p>

                <p>
                    ${character.description}
                </p>

                <p>
                    ❤️ ${character.hp}
                    &nbsp; ⚡ ${character.energy}
                </p>

                <p>
                    ⚔️ Dano: ${character.damage}
                </p>

                <p>
                    ✦ ${character.skillName}
                </p>
            `;

            card.addEventListener(
                "click",
                () => {

                    state.selectedCharacter =
                        character;

                    document
                        .querySelectorAll(".character-card")
                        .forEach(c =>
                            c.classList.remove("selected")
                        );

                    card.classList.add("selected");
                }
            );

            container.appendChild(card);
        });
    }


    /* =====================================================
       CANVAS
    ====================================================== */

    function resizeCanvas() {

        const ratio =
            window.devicePixelRatio || 1;

        canvas.width =
            Math.floor(window.innerWidth * ratio);

        canvas.height =
            Math.floor(window.innerHeight * ratio);

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
       NOVO JOGO
    ====================================================== */

    function startNewGame() {

        document
            .getElementById("playerName")
            .value = "";

        document
            .getElementById("nameError")
            .textContent = "";

        state.selectedCharacter =
            characters[0];

        document
            .querySelectorAll(".character-card")
            .forEach((card, index) => {

                card.classList.toggle(
                    "selected",
                    index === 0
                );
            });

        showScreen("character");

        setTimeout(() => {

            document
                .getElementById("playerName")
                .focus();

        }, 100);
    }


    /* =====================================================
       CRIAR PLAYER
    ====================================================== */

    function createNewPlayer(name, character) {

        state.player = {

            name,

            characterId: character.id,

            className: character.className,

            icon: character.icon,

            x: 1600,

            y: 1250,

            radius: 19,

            hp: character.hp,

            maxHp: character.hp,

            energy: character.energy,

            maxEnergy: character.energy,

            speed: character.speed,

            damage: character.damage,

            attackRange: character.attackRange,

            attackCost: character.attackCost,

            level: 1,

            xp: 0,

            xpToNext: 100,

            money: 0,

            color: character.color,

            inventory:
                structuredClone(defaultInventory)
        };
    }


    /* =====================================================
       CONSTRUIR MUNDO
    ====================================================== */

    function buildWorld() {

        const world = state.world;

        world.obstacles = [];
        world.buildings = [];
        world.decorations = [];
        world.npcs = [];
        world.enemies = [];
        world.resources = [];
        world.exits = [];


        /* ================================
           LIMITES
        ================================= */

        world.obstacles.push(

            {
                x: 0,
                y: 0,
                w: world.width,
                h: 70,
                type: "wall"
            },

            {
                x: 0,
                y: world.height - 70,
                w: world.width,
                h: 70,
                type: "wall"
            },

            {
                x: 0,
                y: 0,
                w: 70,
                h: world.height,
                type: "wall"
            },

            {
                x: world.width - 70,
                y: 0,
                w: 70,
                h: world.height,
                type: "wall"
            }

        );


        /* ================================
           CASAS
        ================================= */

        const buildings = [

            {
                x: 280,
                y: 300,
                w: 420,
                h: 270,

                name: "CASA DO AVENTUREIRO",

                roof: "#744b39",

                color: "#a97752",

                interiorX: 490,
                interiorY: 455
            },

            {
                x: 850,
                y: 260,
                w: 330,
                h: 250,

                name: "CASA DE ELIAN",

                roof: "#69513e",

                color: "#967451",

                interiorX: 1015,
                interiorY: 415
            },

            {
                x: 2070,
                y: 300,
                w: 500,
                h: 300,

                name: "FORJA DE DORAN",

                roof: "#4e4540",

                color: "#756961",

                interiorX: 2320,
                interiorY: 455
            },

            {
                x: 2500,
                y: 1250,
                w: 420,
                h: 300,

                name: "LOJA DA VILA",

                roof: "#6b4938",

                color: "#a16f4e",

                interiorX: 2710,
                interiorY: 1400
            },

            {
                x: 400,
                y: 1550,
                w: 450,
                h: 300,

                name: "CARPINTARIA",

                roof: "#76593d",

                color: "#8e704e",

                interiorX: 625,
                interiorY: 1700
            }

        ];


        buildings.forEach(building => {

            world.buildings.push(building);

            /*
                A colisão agora cobre TODA a construção.
                Não existe aquela lateral invisível.
            */

            world.obstacles.push({

                x: building.x,
                y: building.y,
                w: building.w,
                h: building.h,

                type: "building",

                building
            });

        });


        /* ================================
           FONTE
        ================================= */

        world.obstacles.push({

            x: 1470,
            y: 880,
            w: 260,
            h: 210,

            type: "fountain"

        });


        /* ================================
           PEDRAS
        ================================= */

        const rocks = [

            [950, 760],
            [1100, 730],
            [1220, 1780],
            [1850, 1650],
            [2200, 940],
            [2750, 850],
            [650, 1150],
            [2380, 1830]

        ];

        rocks.forEach(([x, y]) => {

            world.obstacles.push({

                x: x - 32,
                y: y - 25,

                w: 64,
                h: 50,

                type: "rock"

            });

        });


        /* ================================
           ÁRVORES
        ================================= */

        const trees = [

            [180, 180],
            [390, 170],
            [650, 170],
            [940, 150],
            [1320, 170],
            [1750, 160],
            [2150, 160],
            [2600, 170],
            [2950, 180],

            [160, 700],
            [170, 1050],
            [200, 1450],
            [260, 1950],

            [1050, 2000],
            [1500, 1980],
            [1950, 2010],
            [2400, 2020],
            [2850, 1950],

            [3050, 1700],
            [3030, 1200],
            [3010, 650],

            [2850, 1050],
            [2150, 750],
            [1900, 750],
            [1150, 1000]

        ];

        trees.forEach(([x, y], index) => {

            world.resources.push({

                id: "tree_" + index,

                x,
                y,

                type: "tree",

                alive: true,

                respawnTimer: 0

            });

        });


        /* ================================
           NPCS
        ================================= */

        world.npcs.push(

            {
                x: 1030,
                y: 620,

                name: "ELIAN",
                role: "Morador",

                color: "#d4b27c",

                lines: [

                    "Você sente isso? A Quietude ficou mais próxima esta semana.",

                    "Antes, a floresta cantava durante a noite. Agora... ela apenas observa.",

                    "Há quem diga que a Quietude não destrói. Ela simplesmente faz as coisas esquecerem que existem.",

                    "Se continuar seguindo para o leste, encontrará sinais de algo muito antigo."

                ]

            },

            {
                x: 1940,
                y: 1060,

                name: "MARA",
                role: "Moradora",

                color: "#b98bc4",

                lines: [

                    "Eu vi uma sombra atravessando a praça ontem.",

                    "A Quietude não chegou de uma vez. Ela começou como pequenos silêncios.",

                    "Meu avô dizia que existiam lugares onde o céu tocava a terra.",

                    "Talvez esses lugares ainda existam."

                ]

            },

            {
                x: 2700,
                y: 1130,

                name: "DORAN",
                role: "Comerciante",

                color: "#c58a54",

                lines: [

                    "Se você pretende viajar, leve madeira. Nunca se sabe quando precisará acender uma fogueira.",

                    "Tenho ouvido histórias de criaturas aparecendo perto das antigas estradas.",

                    "A Quietude está alterando as criaturas. Algumas estão ficando agressivas.",

                    "Se encontrar um fragmento negro, não toque nele sem saber o que está fazendo."

                ]

            },

            {
                x: 1050,
                y: 1420,

                name: "BRAN",
                role: "Carpinteiro",

                color: "#8d7053",

                lines: [

                    "As árvores daqui são antigas. Não desperdice madeira.",

                    "Se cortar uma árvore, ela pode voltar a crescer depois de algum tempo.",

                    "Meu pai dizia que a floresta protege a vila de algo que vive além das montanhas.",

                    "Talvez a Quietude esteja tentando atravessar essa proteção."

                ]

            }

        );


        /* ================================
           INIMIGOS
        ================================= */

        world.enemies.push(

            {
                id: "slime_1",

                x: 1250,
                y: 700,

                name: "SLIME SOMBRIO",

                icon: "🟣",

                color: "#713e8e",

                hp: 55,
                maxHp: 55,

                damage: 8,

                speed: 70,

                vision: 240,

                attackRange: 55,

                aggressive: false,

                state: "idle",

                xp: 35,

                drop: "erva",

                dropAmount: 2
            },

            {
                id: "wolf_1",

                x: 1820,
                y: 780,

                name: "LOBO DO VAZIO",

                icon: "🐺",

                color: "#494957",

                hp: 80,
                maxHp: 80,

                damage: 12,

                speed: 95,

                vision: 300,

                attackRange: 65,

                aggressive: false,

                state: "idle",

                xp: 55,

                drop: "fragmento",

                dropAmount: 1
            },

            {
                id: "guardian",

                x: 2880,
                y: 1830,

                name: "GUARDIÃO DO LIMIAR",

                icon: "👺",

                color: "#a44738",

                hp: 180,
                maxHp: 180,

                damage: 20,

                speed: 65,

                vision: 320,

                attackRange: 80,

                aggressive: false,

                elite: true,

                requiresBattle: true,

                state: "idle",

                xp: 150,

                drop: "cristal",

                dropAmount: 1
            }

        );


        /* ================================
           SAÍDAS
        ================================= */

        world.exits.push(

            {
                x: 3120,
                y: 1020,
                w: 80,
                h: 150,

                name: "CAMINHO DO CÉU",

                destination: "Céu",

                requiresGuardian: true
            },

            {
                x: 1510,
                y: 2070,
                w: 180,
                h: 60,

                name: "CAMINHO DAS CAVERNAS",

                destination: "Caverna",

                requiresGuardian: false
            }

        );

    }


    /* =====================================================
       COLISÃO CÍRCULO / RETÂNGULO
    ====================================================== */

    function circleRectCollision(
        cx,
        cy,
        radius,
        rect
    ) {

        const closestX =
            Math.max(
                rect.x,
                Math.min(cx, rect.x + rect.w)
            );

        const closestY =
            Math.max(
                rect.y,
                Math.min(cy, rect.y + rect.h)
            );

        const dx = cx - closestX;
        const dy = cy - closestY;

        return (
            dx * dx + dy * dy
            <
            radius * radius
        );
    }


    /* =====================================================
       COLISÃO
    ====================================================== */

    function isBlocked(x, y, radius) {

        return state.world.obstacles.some(
            obstacle =>
                circleRectCollision(
                    x,
                    y,
                    radius,
                    obstacle
                )
        );
    }


    /* =====================================================
       DISTÂNCIA
    ====================================================== */

    function distance(a, b) {

        return Math.hypot(
            a.x - b.x,
            a.y - b.y
        );
    }


    /* =====================================================
       COMEÇAR JOGO
    ====================================================== */

    function beginGame() {

        const input =
            document.getElementById("playerName");

        const name =
            input.value.trim();

        if (name.length < 2) {

            document
                .getElementById("nameError")
                .textContent =
                "Digite um nome com pelo menos 2 caracteres.";

            input.focus();

            return;
        }

        createNewPlayer(
            name,
            state.selectedCharacter
        );

        buildWorld();

        state.currentArea =
            "Vila Principal";

        updateHUD();

        showScreen("game");

        state.running = true;

        state.lastTime =
            performance.now();

        requestAnimationFrame(gameLoop);
    }


    /* =====================================================
       ATUALIZAÇÃO
    ====================================================== */

    function update(dt) {

        if (!state.player) return;

        state.attackCooldown =
            Math.max(
                0,
                state.attackCooldown - dt
            );


        updatePlayerMovement(dt);

        updateEnemies(dt);

        updateResources(dt);

        checkNPCInteraction();

        checkExit();

        updateCamera();

        regenerateEnergy(dt);

        updateHUD();
    }


    /* =====================================================
       MOVIMENTO
    ====================================================== */

    function updatePlayerMovement(dt) {

        if (
            state.dialogue.active ||
            state.currentEnemy
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

        if (!dx && !dy) return;

        const length =
            Math.hypot(dx, dy);

        dx /= length;
        dy /= length;

        const step =
            state.player.speed * dt;


        /* Horizontal */

        const nextX =
            state.player.x +
            dx * step;

        if (
            !isBlocked(
                nextX,
                state.player.y,
                state.player.radius
            )
        ) {

            state.player.x =
                nextX;
        }


        /* Vertical */

        const nextY =
            state.player.y +
            dy * step;

        if (
            !isBlocked(
                state.player.x,
                nextY,
                state.player.radius
            )
        ) {

            state.player.y =
                nextY;
        }


        /* Segurança de limite */

        state.player.x =
            Math.max(
                80,
                Math.min(
                    state.world.width - 80,
                    state.player.x
                )
            );

        state.player.y =
            Math.max(
                80,
                Math.min(
                    state.world.height - 80,
                    state.player.y
                )
            );
    }


    /* =====================================================
       CÂMERA
    ====================================================== */

    function updateCamera() {

        const viewW =
            window.innerWidth;

        const viewH =
            window.innerHeight;

        state.camera.x =
            Math.max(
                0,
                Math.min(
                    state.player.x - viewW / 2,
                    state.world.width - viewW
                )
            );

        state.camera.y =
            Math.max(
                0,
                Math.min(
                    state.player.y - viewH / 2,
                    state.world.height - viewH
                )
            );
    }


    /* =====================================================
       ENERGIA
    ====================================================== */

    function regenerateEnergy(dt) {

        state.player.energy =
            Math.min(
                state.player.maxEnergy,
                state.player.energy +
                5 * dt
            );
    }


    /* =====================================================
       IA DOS INIMIGOS
    ====================================================== */

    function updateEnemies(dt) {

        state.world.enemies.forEach(enemy => {

            if (enemy.hp <= 0) return;

            const d =
                distance(
                    enemy,
                    state.player
                );


            /*
                Se o jogador entrar no raio de visão,
                o inimigo acorda.
            */

            if (
                d <= enemy.vision &&
                enemy.state === "idle"
            ) {

                enemy.state = "chasing";
                enemy.aggressive = true;

                showToast(
                    `${enemy.name} percebeu você!`
                );
            }


            if (
                !enemy.aggressive
            ) {
                return;
            }


            /* Perseguir */

            if (
                d > enemy.attackRange
            ) {

                const dx =
                    state.player.x -
                    enemy.x;

                const dy =
                    state.player.y -
                    enemy.y;

                const len =
                    Math.hypot(dx, dy);

                if (!len) return;

                const step =
                    enemy.speed * dt;

                const nx =
                    enemy.x +
                    dx / len * step;

                const ny =
                    enemy.y +
                    dy / len * step;

                if (
                    !isBlocked(
                        nx,
                        enemy.y,
                        16
                    )
                ) {
                    enemy.x = nx;
                }

                if (
                    !isBlocked(
                        enemy.x,
                        ny,
                        16
                    )
                ) {
                    enemy.y = ny;
                }

            } else {

                /*
                    Ataque automático do inimigo.
                */

                if (!enemy.attackTimer) {
                    enemy.attackTimer = 0;
                }

                enemy.attackTimer -= dt;

                if (
                    enemy.attackTimer <= 0
                ) {

                    state.player.hp =
                        Math.max(
                            0,
                            state.player.hp -
                            enemy.damage
                        );

                    enemy.attackTimer =
                        1.3;

                    showToast(
                        `${enemy.name} atacou você!`
                    );

                    if (
                        state.player.hp <= 0
                    ) {
                        playerDefeated();
                    }
                }
            }

        });
    }


    /* =====================================================
       RECURSOS
    ====================================================== */

    function updateResources(dt) {

        state.world.resources
            .forEach(resource => {

                if (
                    !resource.alive
                ) {

                    resource.respawnTimer -= dt;

                    if (
                        resource.respawnTimer <= 0
                    ) {

                        resource.alive = true;
                    }
                }

            });
    }


    /* =====================================================
       ATAQUE
    ====================================================== */

    function playerAttack() {

        if (!state.player) return;

        if (
            state.dialogue.active
        ) {

            advanceDialogue();

            return;
        }


        if (
            state.currentEnemy
        ) {

            performBattleAttack();

            return;
        }


        if (
            state.attackCooldown > 0
        ) {
            return;
        }


        if (
            state.player.energy <
            state.player.attackCost
        ) {

            showToast(
                "Energia insuficiente."
            );

            return;
        }


        state.player.energy -=
            state.player.attackCost;

        state.attackCooldown =
            .35;


        const target =
            findNearestEnemy(
                state.player.attackRange
            );


        if (target) {

            if (
                target.requiresBattle &&
                !target.inBattle
            ) {

                openBattlePrompt(target);

                return;
            }

            damageEnemy(target);

            return;
        }


        /*
            Se não houver inimigo próximo,
            verifica árvore.
        */

        const tree =
            findNearestTree(85);

        if (tree) {

            chopTree(tree);

            return;
        }


        showToast(
            `${getSkillName()}!`
        );
    }


    /* =====================================================
       NOME DA HABILIDADE
    ====================================================== */

    function getSkillName() {

        const character =
            characters.find(
                c =>
                    c.id ===
                    state.player.characterId
            );

        return character
            ? character.skillName
            : "Habilidade";
    }


    /* =====================================================
       INIMIGO PRÓXIMO
    ====================================================== */

    function findNearestEnemy(range) {

        let closest = null;

        let closestDistance =
            Infinity;

        state.world.enemies
            .forEach(enemy => {

                if (enemy.hp <= 0)
                    return;

                const d =
                    distance(
                        enemy,
                        state.player
                    );

                if (
                    d <= range &&
                    d < closestDistance
                ) {

                    closest = enemy;
                    closestDistance = d;
                }

            });

        return closest;
    }


    /* =====================================================
       ÁRVORE PRÓXIMA
    ====================================================== */

    function findNearestTree(range) {

        let closest = null;

        let best =
            Infinity;

        state.world.resources
            .forEach(tree => {

                if (
                    !tree.alive
                ) return;

                const d =
                    Math.hypot(
                        tree.x -
                        state.player.x,

                        tree.y -
                        state.player.y
                    );

                if (
                    d <= range &&
                    d < best
                ) {

                    closest = tree;
                    best = d;
                }

            });

        return closest;
    }


    /* =====================================================
       CORTAR ÁRVORE
    ====================================================== */

    function chopTree(tree) {

        tree.alive = false;

        tree.respawnTimer = 25;

        addItem(
            "madeira",
            2
        );

        state.progress.treesBroken++;

        showToast(
            "Você conseguiu 2 madeiras."
        );

        saveGame(false);
    }


    /* =====================================================
       DANO
    ====================================================== */

    function damageEnemy(enemy) {

        enemy.hp =
            Math.max(
                0,
                enemy.hp -
                state.player.damage
            );

        enemy.aggressive = true;
        enemy.state = "chasing";

        showToast(
            `Você causou ${state.player.damage} de dano.`
        );


        if (
            enemy.hp <= 0
        ) {

            defeatEnemy(enemy);
        }
    }


    /* =====================================================
       DERROTAR
    ====================================================== */

    function defeatEnemy(enemy) {

        state.progress.enemiesDefeated++;

        gainXP(enemy.xp);

        if (enemy.drop) {

            addItem(
                enemy.drop,
                enemy.dropAmount
            );
        }

        enemy.hp = 0;

        showToast(
            `${enemy.name} derrotado!`
        );


        /*
            Guardião derrotado libera o caminho.
        */

        if (
            enemy.id === "guardian"
        ) {

            showToast(
                "O caminho para o próximo mundo foi liberado!"
            );
        }

        saveGame(false);
    }


    /* =====================================================
       XP
    ====================================================== */

    function gainXP(amount) {

        state.player.xp += amount;

        while (
            state.player.xp >=
            state.player.xpToNext
        ) {

            state.player.xp -=
                state.player.xpToNext;

            state.player.level++;

            state.player.xpToNext =
                Math.floor(
                    state.player.xpToNext * 1.35
                );

            state.player.maxHp += 12;
            state.player.hp =
                state.player.maxHp;

            state.player.maxEnergy += 8;
            state.player.energy =
                state.player.maxEnergy;

            showToast(
                `NÍVEL ${state.player.level}!`
            );
        }
    }


    /* =====================================================
       BATALHA ESPECIAL
    ====================================================== */

    function openBattlePrompt(enemy) {

        state.currentEnemy =
            enemy;

        document
            .getElementById("battleEnemyIcon")
            .textContent =
            enemy.icon;

        document
            .getElementById("battleEnemyName")
            .textContent =
            enemy.name;

        document
            .getElementById("battleEnemyDescription")
            .textContent =
            "Uma criatura poderosa bloqueia o caminho.";

        document
            .getElementById("battlePrompt")
            .classList.add("active");
    }


    function closeBattlePrompt() {

        document
            .getElementById("battlePrompt")
            .classList.remove("active");
    }


    function acceptBattle() {

        if (!state.currentEnemy)
            return;

        state.currentEnemy.inBattle =
            true;

        state.currentEnemy.aggressive =
            true;

        closeBattlePrompt();

        showToast(
            "A batalha começou!"
        );
    }


    function declineBattle() {

        state.currentEnemy = null;

        closeBattlePrompt();

        showToast(
            "Você decidiu não lutar."
        );
    }


    function performBattleAttack() {

        if (
            !state.currentEnemy
        ) return;

        const enemy =
            state.currentEnemy;

        if (
            enemy.hp <= 0
        ) {

            state.currentEnemy = null;
            return;
        }

        if (
            state.player.energy <
            state.player.attackCost
        ) {

            showToast(
                "Energia insuficiente."
            );

            return;
        }

        state.player.energy -=
            state.player.attackCost;

        damageEnemy(enemy);

        if (
            enemy.hp <= 0
        ) {

            state.currentEnemy = null;
        }
    }


    /* =====================================================
       NPC
    ====================================================== */

    function checkNPCInteraction() {

        let nearest = null;

        let best =
            Infinity;

        state.world.npcs
            .forEach(npc => {

                const d =
                    distance(
                        npc,
                        state.player
                    );

                if (
                    d < 80 &&
                    d < best
                ) {

                    nearest = npc;
                    best = d;
                }

            });


        if (nearest) {

            showInteraction(
                `E — Conversar com ${nearest.name}`
            );

            state.nearestNPC =
                nearest;

        } else {

            state.nearestNPC =
                null;

            hideInteraction();
        }
    }


    function talkToNPC() {

        if (
            !state.nearestNPC
        ) return;

        const npc =
            state.nearestNPC;

        state.dialogue = {

            npc,

            lines: [
                ...npc.lines
            ],

            index: 0,

            active: true
        };

        showDialogue();
    }


    function showDialogue() {

        const dialogue =
            state.dialogue;

        const npc =
            dialogue.npc;

        document
            .getElementById("dialogueName")
            .textContent =
            npc.name;

        document
            .getElementById("dialogueText")
            .textContent =
            dialogue.lines[
                dialogue.index
            ];

        document
            .getElementById("dialogueBox")
            .classList.add("show");
    }


    function advanceDialogue() {

        if (
            !state.dialogue.active
        ) return;

        state.dialogue.index++;

        if (
            state.dialogue.index >=
            state.dialogue.lines.length
        ) {

            closeDialogue();

            return;
        }

        showDialogue();
    }


    function closeDialogue() {

        state.dialogue.active =
            false;

        document
            .getElementById("dialogueBox")
            .classList.remove("show");
    }


    /* =====================================================
       INTERAÇÃO
    ====================================================== */

    function showInteraction(text) {

        const element =
            document.getElementById(
                "interactionHint"
            );

        element.textContent = text;

        element.classList.add("show");
    }


    function hideInteraction() {

        document
            .getElementById(
                "interactionHint"
            )
            .classList.remove("show");
    }


    /* =====================================================
       ENTRAR NAS CASAS
    ====================================================== */

    function enterNearestBuilding() {

        let nearest = null;

        let best = 110;

        state.world.buildings
            .forEach(building => {

                const center = {

                    x:
                        building.x +
                        building.w / 2,

                    y:
                        building.y +
                        building.h / 2
                };

                const d =
                    distance(
                        center,
                        state.player
                    );

                if (
                    d < best
                ) {

                    nearest = building;
                    best = d;
                }
            });


        if (!nearest) {

            showToast(
                "Aproxime-se da entrada de uma construção."
            );

            return;
        }


        teleport(
            nearest.name,
            nearest.interiorX,
            nearest.interiorY
        );
    }


    /* =====================================================
       SAÍDAS
    ====================================================== */

    function checkExit() {

        state.world.exits
            .forEach(exit => {

                const inside =

                    state.player.x >
                    exit.x &&

                    state.player.x <
                    exit.x + exit.w &&

                    state.player.y >
                    exit.y &&

                    state.player.y <
                    exit.y + exit.h;


                if (!inside) return;


                if (
                    exit.requiresGuardian &&
                    !isGuardianDefeated()
                ) {

                    state.player.x -= 20;

                    showToast(
                        "O Guardião ainda bloqueia este caminho."
                    );

                    return;
                }


                if (
                    state.transition
                ) return;


                askToContinue(exit);
            });
    }


    function isGuardianDefeated() {

        const guardian =
            state.world.enemies.find(
                e =>
                    e.id ===
                    "guardian"
            );

        return (
            guardian &&
            guardian.hp <= 0
        );
    }


    function askToContinue(exit) {

        state.transition = true;

        const confirmed =
            window.confirm(
                `Você encontrou o caminho para ${exit.destination}.\n\nDeseja continuar?`
            );

        if (confirmed) {

            changeArea(
                exit.destination
            );

        } else {

            state.transition = false;
        }
    }


    /* =====================================================
       TROCAR ÁREA
    ====================================================== */

    function changeArea(area) {

        transition(
            `Viajando para ${area}...`,
            () => {

                state.currentArea =
                    area;

                /*
                    Por enquanto o novo ambiente
                    nasce como uma área nova.
                    Isso permite adicionar posteriormente
                    os mapas completos.
                */

                if (
                    area === "Céu"
                ) {

                    createSkyArea();

                } else if (
                    area === "Caverna"
                ) {

                    createCaveArea();

                } else {

                    buildWorld();
                }

                state.player.x =
                    1600;

                state.player.y =
                    1200;

                state.transition =
                    false;

                updateHUD();
            }
        );
    }


    /* =====================================================
       CÉU
    ====================================================== */

    function createSkyArea() {

        buildWorld();

        state.world.width = 3200;
        state.world.height = 2200;

        state.world.npcs.push({

            x: 1450,
            y: 950,

            name: "AERIS",
            role: "Guardião Celeste",

            color: "#b5c9df",

            lines: [

                "Você chegou ao lugar onde as nuvens escondem ruínas antigas.",

                "A Quietude também tocou o céu.",

                "Existe algo abaixo destas nuvens que não deveria existir."

            ]

        });
    }


    /* =====================================================
       CAVERNA
    ====================================================== */

    function createCaveArea() {

        buildWorld();

        state.world.width = 2600;
        state.world.height = 1800;

        state.world.npcs.push({

            x: 1300,
            y: 800,

            name: "NORA",

            role: "Exploradora",

            color: "#8b7770",

            lines: [

                "A caverna muda quando ninguém está olhando.",

                "Há cristais vermelhos mais abaixo.",

                "Se encontrar a Caverna de Rubi, não confie no que ouvir."

            ]

        });
    }


    /* =====================================================
       TELEPORTE
    ====================================================== */

    function teleport(
        text,
        x,
        y
    ) {

        transition(
            `Entrando em ${text}...`,
            () => {

                state.player.x = x;
                state.player.y = y;

                state.transition = false;
            }
        );
    }


    function transition(
        text,
        callback
    ) {

        const screen =
            document.getElementById(
                "transitionScreen"
            );

        document
            .getElementById(
                "transitionText"
            )
            .textContent = text;

        screen.classList.add("show");

        state.transition = true;

        setTimeout(() => {

            callback();

            setTimeout(() => {

                screen.classList.remove(
                    "show"
                );

            }, 400);

        }, 700);
    }


    /* =====================================================
       INVENTÁRIO
    ====================================================== */

    function addItem(
        id,
        amount
    ) {

        if (
            !state.player.inventory[id]
        ) {

            state.player.inventory[id] = {

                name: id,
                icon: "❔",
                count: 0

            };
        }

        state.player.inventory[id]
            .count += amount;

        updateInventory();
    }


    function updateInventory() {

        const grid =
            document.getElementById(
                "inventoryGrid"
            );

        grid.innerHTML = "";

        Object.values(
            state.player.inventory
        ).forEach(item => {

            const slot =
                document.createElement(
                    "div"
                );

            slot.className =
                "inventory-slot";

            slot.innerHTML = `

                <div class="inventory-slot-icon">
                    ${item.icon}
                </div>

                <div class="inventory-slot-name">
                    ${item.name}
                </div>

                <div class="inventory-slot-count">
                    x${item.count}
                </div>

            `;

            grid.appendChild(slot);
        });
    }


    function openInventory() {

        updateInventory();

        document
            .getElementById(
                "inventoryPanel"
            )
            .classList.add("active");
    }


    function closeInventory() {

        document
            .getElementById(
                "inventoryPanel"
            )
            .classList.remove("active");
    }


    /* =====================================================
       MAPA
    ====================================================== */

    function openMap() {

        drawMap();

        document
            .getElementById(
                "mapPanel"
            )
            .classList.add("active");
    }


    function closeMap() {

        document
            .getElementById(
                "mapPanel"
            )
            .classList.remove("active");
    }


    function drawMap() {

        const width =
            700;

        const height =
            450;

        mapCanvas.width =
            width;

        mapCanvas.height =
            height;

        mapCtx.clearRect(
            0,
            0,
            width,
            height
        );

        mapCtx.fillStyle =
            "#293325";

        mapCtx.fillRect(
            0,
            0,
            width,
            height
        );


        const scaleX =
            width /
            state.world.width;

        const scaleY =
            height /
            state.world.height;


        /* caminhos */

        mapCtx.fillStyle =
            "#827154";

        mapCtx.fillRect(
            0,
            220,
            width,
            25
        );

        mapCtx.fillRect(
            340,
            0,
            25,
            height
        );


        /* casas */

        state.world.buildings
            .forEach(building => {

                mapCtx.fillStyle =
                    "#875b43";

                mapCtx.fillRect(

                    building.x * scaleX,

                    building.y * scaleY,

                    building.w * scaleX,

                    building.h * scaleY
                );
            });


        /* inimigos */

        state.world.enemies
            .forEach(enemy => {

                if (
                    enemy.hp <= 0
                ) return;

                mapCtx.fillStyle =
                    "#b84a45";

                mapCtx.beginPath();

                mapCtx.arc(

                    enemy.x * scaleX,

                    enemy.y * scaleY,

                    6,

                    0,

                    Math.PI * 2
                );

                mapCtx.fill();
            });


        /* player */

        mapCtx.fillStyle =
            "#e4d06f";

        mapCtx.beginPath();

        mapCtx.arc(

            state.player.x * scaleX,

            state.player.y * scaleY,

            7,

            0,

            Math.PI * 2
        );

        mapCtx.fill();
    }


    /* =====================================================
       DESENHO
    ====================================================== */

    function draw() {

        const w =
            window.innerWidth;

        const h =
            window.innerHeight;

        ctx.clearRect(
            0,
            0,
            w,
            h
        );

        ctx.save();

        ctx.translate(
            -state.camera.x,
            -state.camera.y
        );

        drawGround();

        drawPaths();

        drawBuildings();

        drawGrass();

        drawTrees();

        drawObstacles();

        drawNPCs();

        drawEnemies();

        drawExits();

        drawPlayer();

        drawWorldLabels();

        ctx.restore();
    }


    /* =====================================================
       CHÃO
    ====================================================== */

    function drawGround() {

        ctx.fillStyle =
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
                        (x / tile +
                        y / tile) % 2 === 0
                    )

                    ? "rgba(255,255,255,.018)"

                    : "rgba(0,0,0,.018)";

                ctx.fillRect(
                    x,
                    y,
                    tile,
                    tile
                );
            }
        }


        /*
            Área dominada pelo vazio.
        */

        ctx.save();

        ctx.globalAlpha = .28;

        ctx.fillStyle =
            "#171521";

        ctx.beginPath();

        ctx.moveTo(2250, 650);

        ctx.bezierCurveTo(
            2700, 500,
            3100, 700,
            3050, 1100
        );

        ctx.bezierCurveTo(
            3100, 1450,
            2700, 1500,
            2450, 1280
        );

        ctx.bezierCurveTo(
            2200, 1050,
            2100, 800,
            2250, 650
        );

        ctx.fill();

        ctx.restore();


        /* marcas do vazio */

        ctx.strokeStyle =
            "rgba(50,40,75,.45)";

        ctx.lineWidth = 3;

        for (
            let i = 0;
            i < 20;
            i++
        ) {

            const x =
                2250 +
                ((i * 97) % 700);

            const y =
                650 +
                ((i * 73) % 700);

            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x + 30,
                y + 50
            );

            ctx.stroke();
        }
    }


    /* =====================================================
       CAMINHOS
    ====================================================== */

    function drawPaths() {

        ctx.fillStyle =
            "#b79a68";

        ctx.globalAlpha =
            .75;

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


    /* =====================================================
       GRAMA
    ====================================================== */

    function drawGrass() {

        ctx.strokeStyle =
            "rgba(35,75,40,.5)";

        ctx.lineWidth = 2;

        for (
            let y = 90;
            y < state.world.height - 90;
            y += 45
        ) {

            for (
                let x = 90;
                x < state.world.width - 90;
                x += 45
            ) {

                if (
                    (x * 7 + y * 3) % 13 < 5
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
       CASAS
    ====================================================== */

    function drawBuildings() {

        state.world.buildings
            .forEach(building => {

                /* sombra */

                ctx.fillStyle =
                    "rgba(0,0,0,.28)";

                ctx.fillRect(

                    building.x + 14,
                    building.y + 16,

                    building.w,
                    building.h
                );


                /* parede */

                ctx.fillStyle =
                    building.color;

                ctx.fillRect(

                    building.x,
                    building.y,

                    building.w,
                    building.h
                );


                /* detalhes */

                ctx.strokeStyle =
                    "rgba(30,20,15,.45)";

                ctx.lineWidth = 5;

                ctx.strokeRect(

                    building.x,
                    building.y,

                    building.w,
                    building.h
                );


                /* telhado */

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


                /* porta */

                ctx.fillStyle =
                    "#452c23";

                ctx.fillRect(

                    building.x +
                    building.w / 2 - 28,

                    building.y +
                    building.h - 75,

                    56,
                    75
                );


                /* janelas */

                ctx.fillStyle =
                    "#d9c47d";

                ctx.fillRect(

                    building.x + 35,
                    building.y + 65,

                    55,
                    48
                );

                ctx.fillRect(

                    building.x +
                    building.w - 90,

                    building.y + 65,

                    55,
                    48
                );


                /* placa */

                ctx.fillStyle =
                    "rgba(20,20,15,.82)";

                ctx.fillRect(

                    building.x +
                    building.w / 2 - 90,

                    building.y +
                    building.h + 14,

                    180,
                    28
                );

                ctx.fillStyle =
                    "#f0dfb4";

                ctx.font =
                    "bold 13px Georgia";

                ctx.textAlign =
                    "center";

                ctx.fillText(

                    building.name,

                    building.x +
                    building.w / 2,

                    building.y +
                    building.h + 34
                );

            });
    }


    /* =====================================================
       ÁRVORES
    ====================================================== */

    function drawTrees() {

        state.world.resources
            .forEach(tree => {

                if (
                    !tree.alive
                ) return;

                ctx.fillStyle =
                    "rgba(0,0,0,.22)";

                ctx.beginPath();

                ctx.ellipse(
                    tree.x,
                    tree.y + 30,
                    36,
                    12,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.fillStyle =
                    "#684b32";

                ctx.fillRect(

                    tree.x - 9,
                    tree.y,

                    18,
                    42
                );


                ctx.fillStyle =
                    "#315b36";

                ctx.beginPath();

                ctx.arc(
                    tree.x,
                    tree.y - 15,
                    34,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                ctx.fillStyle =
                    "#427545";

                ctx.beginPath();

                ctx.arc(
                    tree.x - 15,
                    tree.y - 28,
                    25,
                    0,
                    Math.PI * 2
                );

                ctx.arc(
                    tree.x + 15,
                    tree.y - 27,
                    25,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                /*
                    brilho indicando que pode ser cortada
                */

                const d =
                    Math.hypot(
                        tree.x -
                        state.player.x,

                        tree.y -
                        state.player.y
                    );

                if (
                    d < 85
                ) {

                    ctx.strokeStyle =
                        "#d7bd70";

                    ctx.lineWidth = 2;

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

            });
    }


    /* =====================================================
       OBSTÁCULOS
    ====================================================== */

    function drawObstacles() {

        state.world.obstacles
            .forEach(obstacle => {

                if (
                    obstacle.type === "building"
                ) return;


                if (
                    obstacle.type === "wall"
                ) {

                    ctx.fillStyle =
                        "#39423d";

                    ctx.fillRect(

                        obstacle.x,
                        obstacle.y,

                        obstacle.w,
                        obstacle.h
                    );

                    return;
                }


                if (
                    obstacle.type === "rock"
                ) {

                    ctx.fillStyle =
                        "#686d67";

                    ctx.beginPath();

                    ctx.ellipse(

                        obstacle.x +
                        obstacle.w / 2,

                        obstacle.y +
                        obstacle.h / 2,

                        obstacle.w / 2,

                        obstacle.h / 2,

                        -.15,

                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                    return;
                }


                if (
                    obstacle.type === "fountain"
                ) {

                    ctx.fillStyle =
                        "#858276";

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
                        "#5595a8";

                    ctx.beginPath();

                    ctx.ellipse(

                        obstacle.x +
                        obstacle.w / 2,

                        obstacle.y +
                        obstacle.h / 2,

                        obstacle.w / 2 - 22,

                        obstacle.h / 2 - 22,

                        0,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();
                }

            });
    }


    /* =====================================================
       NPCS
    ====================================================== */

    function drawNPCs() {

        state.world.npcs
            .forEach(npc => {

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
                    "#25242a";

                ctx.beginPath();

                ctx.arc(
                    npc.x,
                    npc.y - 9,
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
                    "#fff0c7";

                ctx.fillText(
                    npc.name,
                    npc.x,
                    npc.y - 31
                );


                ctx.font =
                    "10px Arial";

                ctx.fillStyle =
                    "#ccc5b5";

                ctx.fillText(
                    npc.role,
                    npc.x,
                    npc.y + 38
                );

            });
    }


    /* =====================================================
       INIMIGOS
    ====================================================== */

    function drawEnemies() {

        state.world.enemies
            .forEach(enemy => {

                if (
                    enemy.hp <= 0
                ) return;


                const d =
                    distance(
                        enemy,
                        state.player
                    );


                /*
                    Campo de visão
                */

                if (
                    enemy.aggressive
                ) {

                    ctx.strokeStyle =
                        "rgba(200,60,50,.14)";

                    ctx.lineWidth = 2;

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


                /* aura de elite */

                if (
                    enemy.elite
                ) {

                    ctx.strokeStyle =
                        "#cf5547";

                    ctx.lineWidth = 3;

                    ctx.beginPath();

                    ctx.arc(

                        enemy.x,
                        enemy.y,

                        32,

                        0,
                        Math.PI * 2
                    );

                    ctx.stroke();
                }


                /* sombra */

                ctx.fillStyle =
                    "rgba(0,0,0,.3)";

                ctx.beginPath();

                ctx.ellipse(

                    enemy.x,
                    enemy.y + 20,

                    21,
                    8,

                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


                /* corpo */

                ctx.fillStyle =
                    enemy.color;

                ctx.beginPath();

                ctx.arc(

                    enemy.x,
                    enemy.y,

                    23,

                    0,
                    Math.PI * 2
                );

                ctx.fill();


                /* ícone */

                ctx.font =
                    "22px Arial";

                ctx.textAlign =
                    "center";

                ctx.fillText(

                    enemy.icon,

                    enemy.x,
                    enemy.y + 8
                );


                /* nome */

                ctx.font =
                    "bold 12px Arial";

                ctx.fillStyle =
                    enemy.elite
                        ? "#ff927c"
                        : "#f1d8ac";

                ctx.fillText(

                    enemy.name,

                    enemy.x,
                    enemy.y - 35
                );


                /* barra HP */

                const barWidth =
                    55;

                const hpPercent =
                    enemy.hp /
                    enemy.maxHp;

                ctx.fillStyle =
                    "#1b1b19";

                ctx.fillRect(

                    enemy.x -
                    barWidth / 2,

                    enemy.y - 29,

                    barWidth,
                    5
                );

                ctx.fillStyle =
                    "#b84d49";

                ctx.fillRect(

                    enemy.x -
                    barWidth / 2,

                    enemy.y - 29,

                    barWidth *
                    hpPercent,

                    5
                );


                /*
                    Destaque se estiver no alcance.
                */

                if (
                    d <
                    state.player.attackRange
                ) {

                    ctx.strokeStyle =
                        "#e0bd68";

                    ctx.lineWidth = 2;

                    ctx.beginPath();

                    ctx.arc(

                        enemy.x,
                        enemy.y,

                        29,

                        0,
                        Math.PI * 2
                    );

                    ctx.stroke();
                }

            });
    }


    /* =====================================================
       SAÍDAS
    ====================================================== */

    function drawExits() {

        state.world.exits
            .forEach(exit => {

                ctx.fillStyle =
                    "rgba(110,150,190,.25)";

                ctx.fillRect(

                    exit.x,
                    exit.y,

                    exit.w,
                    exit.h
                );

                ctx.strokeStyle =
                    "#d1b96d";

                ctx.lineWidth = 2;

                ctx.strokeRect(

                    exit.x,
                    exit.y,

                    exit.w,
                    exit.h
                );

                ctx.fillStyle =
                    "#f1dfad";

                ctx.font =
                    "bold 13px Georgia";

                ctx.textAlign =
                    "center";

                ctx.fillText(

                    "CAMINHO",

                    exit.x +
                    exit.w / 2,

                    exit.y +
                    exit.h / 2
                );

            });
    }


    /* =====================================================
       PLAYER
    ====================================================== */

    function drawPlayer() {

        const player =
            state.player;

        if (!player) return;


        ctx.fillStyle =
            "rgba(0,0,0,.3)";

        ctx.beginPath();

        ctx.ellipse(

            player.x,
            player.y + 20,

            22,
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
            "#30251f";

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
            "#fff1c9";

        ctx.fillText(

            player.name,

            player.x,
            player.y - 40
        );
    }


    /* =====================================================
       TEXTOS DO MUNDO
    ====================================================== */

    function drawWorldLabels() {

        ctx.textAlign =
            "center";

        ctx.font =
            "bold 23px Georgia";

        ctx.fillStyle =
            "rgba(255,229,172,.8)";

        ctx.fillText(

            "PRAÇA DA VILA",

            1600,
            840
        );


        ctx.font =
            "14px Georgia";

        ctx.fillStyle =
            "rgba(255,255,255,.55)";

        ctx.fillText(

            "A Quietude ainda não alcançou este lugar...",

            1600,
            865
        );


        /*
            região do vazio
        */

        ctx.font =
            "bold 18px Georgia";

        ctx.fillStyle =
            "rgba(180,150,210,.55)";

        ctx.fillText(

            "TERRAS TOMADAS PELO VAZIO",

            2700,
            1050
        );
    }


    /* =====================================================
       HUD
    ====================================================== */

    function updateHUD() {

        const player =
            state.player;

        if (!player) return;


        document
            .getElementById("hudAvatar")
            .textContent =
            player.icon;

        document
            .getElementById("hudClass")
            .textContent =
            player.className;

        document
            .getElementById("hudName")
            .textContent =
            player.name;


        document
            .getElementById("hpBar")
            .style.width =
            `${(
                player.hp /
                player.maxHp
            ) * 100}%`;


        document
            .getElementById("energyBar")
            .style.width =
            `${(
                player.energy /
                player.maxEnergy
            ) * 100}%`;


        document
            .getElementById("hpText")
            .textContent =
            `${Math.ceil(player.hp)}/${player.maxHp}`;


        document
            .getElementById("energyText")
            .textContent =
            `${Math.ceil(player.energy)}/${player.maxEnergy}`;


        document
            .getElementById("levelText")
            .textContent =
            player.level;


        document
            .getElementById("xpText")
            .textContent =
            `${player.xp} / ${player.xpToNext}`;


        const character =
            characters.find(
                c =>
                    c.id ===
                    player.characterId
            );


        if (character) {

            document
                .getElementById("skillIcon")
                .textContent =
                character.skillIcon;

            document
                .getElementById("skillName")
                .textContent =
                character.skillName;

            document
                .getElementById("skillEnergyText")
                .textContent =
                player.attackCost;
        }
    }


    /* =====================================================
       MORTE
    ====================================================== */

    function playerDefeated() {

        state.player.hp =
            state.player.maxHp;

        state.player.x =
            1600;

        state.player.y =
            1250;

        state.world.enemies
            .forEach(enemy => {

                if (
                    enemy.hp > 0
                ) {

                    enemy.aggressive =
                        false;

                    enemy.state =
                        "idle";
                }

            });

        showToast(
            "Você foi derrotado e retornou à praça."
        );
    }


    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(message) {

        const toast =
            document.getElementById(
                "saveMessage"
            );

        toast.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(
            state.toastTimer
        );

        state.toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2200);
    }


    /* =====================================================
       SALVAR
    ====================================================== */

    function saveGame(showMessage = true) {

        if (!state.player)
            return;

        const save = {

            version: 2,

            player:
                state.player,

            progress:
                state.progress,

            area:
                state.currentArea,

            savedAt:
                new Date().toISOString()
        };


        try {

            localStorage.setItem(
                SAVE_KEY,
                JSON.stringify(save)
            );

            if (showMessage) {

                showToast(
                    "Jogo salvo com sucesso."
                );
            }

            updateContinueButton();

        } catch (error) {

            console.error(error);

            showToast(
                "Não foi possível salvar."
            );
        }
    }


    /* =====================================================
       CARREGAR
    ====================================================== */

    function loadGame() {

        try {

            const raw =
                localStorage.getItem(
                    SAVE_KEY
                );

            if (!raw)
                return false;

            const save =
                JSON.parse(raw);

            if (
                !save ||
                !save.player
            ) {

                return false;
            }


            const character =
                characters.find(
                    c =>
                        c.id ===
                        save.player.characterId
                );


            if (!character)
                return false;


            state.player = {

                ...save.player,

                inventory:
                    save.player.inventory ||
                    structuredClone(
                        defaultInventory
                    )
            };


            state.progress =
                save.progress ||
                {
                    treesBroken: 0,
                    enemiesDefeated: 0,
                    discovered: []
                };


            state.currentArea =
                save.area ||
                "Vila Principal";


            buildWorld();

            updateHUD();

            showScreen("game");

            state.running =
                true;

            state.lastTime =
                performance.now();

            requestAnimationFrame(
                gameLoop
            );

            return true;

        } catch (error) {

            console.error(error);

            localStorage.removeItem(
                SAVE_KEY
            );

            return false;
        }
    }


    /* =====================================================
       CONTINUE
    ====================================================== */

    function hasSave() {

        try {

            return Boolean(
                localStorage.getItem(
                    SAVE_KEY
                )
            );

        } catch {

            return false;
        }
    }


    function updateContinueButton() {

        const button =
            document.getElementById(
                "continueBtn"
            );

        const hint =
            document.getElementById(
                "continueHint"
            );

        const available =
            hasSave();

        button.disabled =
            !available;

        hint.textContent =
            available

                ? "Existe um jogo salvo neste navegador."

                : "Nenhum jogo salvo encontrado.";
    }


    /* =====================================================
       MENU
    ====================================================== */

    function returnToMenu() {

        saveGame(false);

        state.running =
            false;

        showScreen("menu");

        updateContinueButton();
    }


    /* =====================================================
       LOOP
    ====================================================== */

    function gameLoop(timestamp) {

        if (!state.running)
            return;

        const dt =
            Math.min(
                (timestamp -
                    state.lastTime) /
                    1000,

                .05
            );

        state.lastTime =
            timestamp;

        update(dt);

        draw();

        requestAnimationFrame(
            gameLoop
        );
    }


    /* =====================================================
       TECLADO
    ====================================================== */

    window.addEventListener(
        "keydown",
        event => {

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
                movementKeys.includes(key)
            ) {

                event.preventDefault();

                state.keys.add(key);
            }


            /* E = ataque / conversa */

            if (
                key === "e"
            ) {

                event.preventDefault();

                if (
                    state.dialogue.active
                ) {

                    advanceDialogue();

                } else if (
                    state.nearestNPC
                ) {

                    talkToNPC();

                } else {

                    playerAttack();
                }
            }


            /* Z = entrar */

            if (
                key === "z"
            ) {

                event.preventDefault();

                if (
                    !state.dialogue.active
                ) {

                    enterNearestBuilding();
                }
            }


            /* I = inventário */

            if (
                key === "i"
            ) {

                if (
                    state.player
                ) {

                    openInventory();
                }
            }


            /* M = mapa */

            if (
                key === "m"
            ) {

                if (
                    state.player
                ) {

                    openMap();
                }
            }


            /* ESC */

            if (
                event.key === "Escape"
            ) {

                if (
                    state.dialogue.active
                ) {

                    closeDialogue();

                    return;
                }

                closeInventory();

                closeMap();

                closeBattlePrompt();

                if (
                    screens.game.classList.contains(
                        "active"
                    )
                ) {

                    returnToMenu();
                }
            }

        }
    );


    /* =====================================================
       KEYUP
    ====================================================== */

    window.addEventListener(
        "keyup",
        event => {

            state.keys.delete(
                event.key.toLowerCase()
            );
        }
    );


    /* =====================================================
       BLUR
    ====================================================== */

    window.addEventListener(
        "blur",
        () => {

            state.keys.clear();
        }
    );


    /* =====================================================
       BOTÕES DO MENU
    ====================================================== */

    document
        .getElementById("newGameBtn")
        .addEventListener(
            "click",
            startNewGame
        );


    document
        .getElementById("continueBtn")
        .addEventListener(
            "click",
            () => {

                if (
                    !loadGame()
                ) {

                    showToast(
                        "O salvamento não pôde ser carregado."
                    );

                    updateContinueButton();
                }

            }
        );


    document
        .getElementById("howToPlayBtn")
        .addEventListener(
            "click",
            () => {

                screens.howToPlay
                    .classList.add(
                        "active"
                    );

            }
        );


    document
        .getElementById("creditsBtn")
        .addEventListener(
            "click",
            () => {

                screens.credits
                    .classList.add(
                        "active"
                    );

            }
        );


    document
        .getElementById("closeHowToPlay")
        .addEventListener(
            "click",
            () => {

                screens.howToPlay
                    .classList.remove(
                        "active"
                    );

            }
        );


    document
        .getElementById("closeCredits")
        .addEventListener(
            "click",
            () => {

                screens.credits
                    .classList.remove(
                        "active"
                    );

            }
        );


    /* =====================================================
       PERSONAGEM
    ====================================================== */

    document
        .getElementById("startGameBtn")
        .addEventListener(
            "click",
            beginGame
        );


    document
        .getElementById("backMenuBtn")
        .addEventListener(
            "click",
            () => {

                showScreen("menu");

                updateContinueButton();
            }
        );


    document
        .getElementById("playerName")
        .addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    beginGame();
                }
            }
        );


    /* =====================================================
       HUD
    ====================================================== */

    document
        .getElementById("inventoryBtn")
        .addEventListener(
            "click",
            openInventory
        );


    document
        .getElementById("closeInventory")
        .addEventListener(
            "click",
            closeInventory
        );


    document
        .getElementById("mapBtn")
        .addEventListener(
            "click",
            openMap
        );


    document
        .getElementById("closeMap")
        .addEventListener(
            "click",
            closeMap
        );


    document
        .getElementById("saveBtn")
        .addEventListener(
            "click",
            () =>
                saveGame(true)
        );


    document
        .getElementById("menuBtn")
        .addEventListener(
            "click",
            returnToMenu
        );


    /* =====================================================
       BATALHA
    ====================================================== */

    document
        .getElementById("acceptBattleBtn")
        .addEventListener(
            "click",
            acceptBattle
        );


    document
        .getElementById("declineBattleBtn")
        .addEventListener(
            "click",
            declineBattle
        );


    /* =====================================================
       REDIMENSIONAR
    ====================================================== */

    window.addEventListener(
        "resize",
        resizeCanvas
    );


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    createCharacterCards();

    resizeCanvas();

    updateContinueButton();

})();
