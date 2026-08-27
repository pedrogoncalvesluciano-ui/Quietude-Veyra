(() => {
    "use strict";

    const SAVE_KEY = "veyra_save_v1";

    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const screens = {
        menu: document.getElementById("menuScreen"),
        character: document.getElementById("characterScreen"),
        game: document.getElementById("gameScreen")
    };

    // =====================================================
    // PERSONAGENS
    // =====================================================

    const characters = [
        {
            id: "kaelion",
            name: "KAELION",
            className: "Mago",
            icon: "🧙",
            role: "Magia • Longo alcance",
            description: "Grande poder mágico, mas menor resistência física.",
            hp: 85,
            energy: 120,
            speed: 175,
            color: "#8d7ad8"
        },
        {
            id: "theron",
            name: "THERON",
            className: "Cavaleiro",
            icon: "🛡️",
            role: "Espada • Defesa",
            description: "Resistente e preparado para o combate corpo a corpo.",
            hp: 125,
            energy: 90,
            speed: 145,
            color: "#b8b8bd"
        },
        {
            id: "grumgar",
            name: "GRUMGAR",
            className: "Troll",
            icon: "👹",
            role: "Força • Vida",
            description: "Muita vida e dano físico, mas baixa velocidade.",
            hp: 150,
            energy: 80,
            speed: 110,
            color: "#6f9d65"
        },
        {
            id: "lirael",
            name: "LIRAEL",
            className: "Fada",
            icon: "🧚",
            role: "Velocidade • Cura",
            description: "Rápida, mágica e capaz de usar poderes de suporte.",
            hp: 90,
            energy: 115,
            speed: 205,
            color: "#d994d2"
        },
        {
            id: "zephyr",
            name: "ZEPHYR",
            className: "Transmorfo",
            icon: "🦊",
            role: "Adaptação • Equilíbrio",
            description: "Características equilibradas e grande capacidade de adaptação.",
            hp: 105,
            energy: 105,
            speed: 170,
            color: "#d59a61"
        }
    ];

    // =====================================================
    // ESTADO
    // =====================================================

    const state = {
        selectedCharacter: characters[0],
        player: null,
        keys: new Set(),
        lastTime: 0,
        running: false,

        world: {
            width: 3200,
            height: 2200,
            obstacles: [],
            decorations: [],
            buildings: [],
            npcs: []
        },

        camera: {
            x: 0,
            y: 0
        },

        saveToastTimer: null
    };

    // =====================================================
    // TELAS
    // =====================================================

    function showScreen(name) {
        Object.values(screens).forEach(screen => {
            screen.classList.remove("active");
        });

        screens[name].classList.add("active");
    }

    // =====================================================
    // PERSONAGENS
    // =====================================================

    function createCharacterCards() {
        const container = document.getElementById("characterCards");

        container.innerHTML = "";

        characters.forEach((character, index) => {
            const card = document.createElement("button");

            card.className =
                "character-card" +
                (index === 0 ? " selected" : "");

            card.type = "button";

            card.innerHTML = `
                <div class="char-art">
                    ${character.icon}
                </div>

                <h3>
                    ${character.name}
                </h3>

                <p class="role">
                    ${character.className} — ${character.role}
                </p>

                <p>
                    ${character.description}
                </p>

                <p>
                    HP: ${character.hp}
                    •
                    Energia: ${character.energy}
                </p>
            `;

            card.addEventListener("click", () => {
                state.selectedCharacter = character;

                document
                    .querySelectorAll(".character-card")
                    .forEach(cardElement => {
                        cardElement.classList.remove("selected");
                    });

                card.classList.add("selected");
            });

            container.appendChild(card);
        });
    }

    // =====================================================
    // CANVAS
    // =====================================================

    function resizeCanvas() {
        const ratio = window.devicePixelRatio || 1;

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

    // =====================================================
    // NOVO JOGO
    // =====================================================

    function startNewGame() {
        document.getElementById("playerName").value = "";

        document.getElementById("nameError").textContent = "";

        state.selectedCharacter = characters[0];

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

    // =====================================================
    // COMEÇAR
    // =====================================================

    function beginGame() {
        const input =
            document.getElementById("playerName");

        const name =
            input.value.trim();

        if (name.length < 2) {
            document.getElementById(
                "nameError"
            ).textContent =
                "Digite um nome com pelo menos 2 caracteres.";

            input.focus();

            return;
        }

        createNewPlayer(
            name,
            state.selectedCharacter
        );

        buildWorld();

        updateHUD();

        showScreen("game");

        state.running = true;

        state.lastTime = performance.now();

        requestAnimationFrame(gameLoop);
    }

    // =====================================================
    // JOGADOR
    // =====================================================

    function createNewPlayer(name, character) {
        state.player = {
            name,
            characterId: character.id,
            className: character.className,

            x: 1600,
            y: 1250,

            radius: 20,

            hp: character.hp,
            maxHp: character.hp,

            energy: character.energy,
            maxEnergy: character.energy,

            speed: character.speed,

            level: 1,
            xp: 0,
            xpToNext: 100,

            money: 0,

            color: character.color
        };
    }

    // =====================================================
    // MUNDO
    // =====================================================

    function buildWorld() {
        const world = state.world;

        world.obstacles = [];
        world.decorations = [];
        world.buildings = [];
        world.npcs = [];

        // Paredes

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

        // Construções

        const buildings = [
            {
                x: 280,
                y: 300,
                w: 420,
                h: 270,
                name: "CASA DO JOGADOR",
                roof: "#744b39"
            },
            {
                x: 850,
                y: 260,
                w: 330,
                h: 250,
                name: "CASA DE ELIAN",
                roof: "#69513e"
            },
            {
                x: 2070,
                y: 300,
                w: 500,
                h: 300,
                name: "FERREIRO",
                roof: "#4e4540"
            },
            {
                x: 2500,
                y: 1250,
                w: 420,
                h: 300,
                name: "LOJA",
                roof: "#6b4938"
            },
            {
                x: 400,
                y: 1550,
                w: 450,
                h: 300,
                name: "CARPINTEIRO",
                roof: "#76593d"
            }
        ];

        buildings.forEach(building => {
            world.buildings.push(building);

            world.obstacles.push({
                x: building.x,
                y: building.y,
                w: building.w,
                h: building.h,
                type: "building"
            });
        });

        // Fonte

        world.obstacles.push({
            x: 1470,
            y: 880,
            w: 260,
            h: 210,
            type: "fountain"
        });

        // Pedras

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

        // Árvores

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

        trees.forEach(([x, y]) => {
            world.obstacles.push({
                x: x - 28,
                y: y - 35,
                w: 56,
                h: 70,
                type: "tree"
            });

            world.decorations.push({
                x,
                y,
                type: "tree"
            });
        });

        // NPCs

        world.npcs.push(
            {
                x: 1030,
                y: 620,
                name: "ELIAN",
                role: "Morador",
                color: "#d4b27c"
            },
            {
                x: 1940,
                y: 1060,
                name: "MARA",
                role: "Moradora",
                color: "#b98bc4"
            },
            {
                x: 2700,
                y: 1130,
                name: "DORAN",
                role: "Comerciante",
                color: "#c58a54"
            },
            {
                x: 1050,
                y: 1420,
                name: "BRAN",
                role: "Carpinteiro",
                color: "#8d7053"
            }
        );
    }

    // =====================================================
    // COLISÃO
    // =====================================================

    function isBlocked(x, y, radius) {
        const playerBox = {
            x: x - radius,
            y: y - radius,
            w: radius * 2,
            h: radius * 2
        };

        return state.world.obstacles.some(obstacle => {
            const closestX = Math.max(
                obstacle.x,
                Math.min(
                    playerBox.x + playerBox.w,
                    obstacle.x + obstacle.w
                )
            );

            const closestY = Math.max(
                obstacle.y,
                Math.min(
                    playerBox.y + playerBox.h,
                    obstacle.y + obstacle.h
                )
            );

            const dx =
                x - closestX;

            const dy =
                y - closestY;

            return (
                dx * dx +
                dy * dy <
                radius * radius
            );
        });
    }

    // =====================================================
    // UPDATE
    // =====================================================

    function update(dt) {
        if (!state.player) return;

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

        if (dx !== 0 || dy !== 0) {
            const length =
                Math.hypot(dx, dy);

            dx /= length;
            dy /= length;

            const step =
                state.player.speed * dt;

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
                state.player.x = nextX;
            }

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
                state.player.y = nextY;
            }
        }

        state.player.energy =
            Math.min(
                state.player.maxEnergy,
                state.player.energy + 3 * dt
            );

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

        updateHUD();
    }

    // =====================================================
    // DESENHO
    // =====================================================

    function draw() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        ctx.clearRect(0, 0, w, h);

        ctx.save();

        ctx.translate(
            -state.camera.x,
            -state.camera.y
        );

        drawGround();
        drawPaths();
        drawBuildings();
        drawDecorations();
        drawObstacles();
        drawNPCs();
        drawPlayer();
        drawWorldLabels();

        ctx.restore();
    }

    function drawGround() {
        ctx.fillStyle = "#536b4b";

        ctx.fillRect(
            0,
            0,
            state.world.width,
            state.world.height
        );

        const tile = 64;

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
                    ((x / tile + y / tile) % 2 === 0)
                        ? "rgba(255,255,255,0.018)"
                        : "rgba(0,0,0,0.018)";

                ctx.fillRect(
                    x,
                    y,
                    tile,
                    tile
                );
            }
        }
    }

    function drawPaths() {
        ctx.fillStyle = "#b79a68";

        ctx.globalAlpha = 0.7;

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

        ctx.globalAlpha = 1;
    }

    function drawBuildings() {
        state.world.buildings.forEach(building => {
            ctx.fillStyle =
                "rgba(0,0,0,0.25)";

            ctx.fillRect(
                building.x + 12,
                building.y + 14,
                building.w,
                building.h
            );

            ctx.fillStyle = "#b98b61";

            ctx.fillRect(
                building.x,
                building.y,
                building.w,
                building.h
            );

            ctx.fillStyle = building.roof;

            ctx.beginPath();

            ctx.moveTo(
                building.x - 20,
                building.y
            );

            ctx.lineTo(
                building.x + building.w / 2,
                building.y - 100
            );

            ctx.lineTo(
                building.x + building.w + 20,
                building.y
            );

            ctx.closePath();

            ctx.fill();

            ctx.fillStyle = "#4a3026";

            ctx.fillRect(
                building.x +
                building.w / 2 - 25,
                building.y +
                building.h - 70,
                50,
                70
            );

            ctx.fillStyle = "#d9c47d";

            ctx.fillRect(
                building.x + 35,
                building.y + 65,
                50,
                45
            );

            ctx.fillRect(
                building.x +
                building.w - 85,
                building.y + 65,
                50,
                45
            );

            ctx.fillStyle =
                "rgba(20,20,20,0.8)";

            ctx.font =
                "bold 15px Georgia";

            ctx.textAlign = "center";

            ctx.fillText(
                building.name,
                building.x +
                building.w / 2,
                building.y +
                building.h +
                30
            );
        });
    }

    function drawDecorations() {
        for (
            let y = 90;
            y < state.world.height - 90;
            y += 90
        ) {
            for (
                let x = 90;
                x < state.world.width - 90;
                x += 90
            ) {
                if (
                    (x * 7 + y * 3) % 11 < 4
                ) {
                    ctx.strokeStyle =
                        "rgba(28,68,35,0.42)";

                    ctx.lineWidth = 2;

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

        state.world.decorations.forEach(decoration => {
            if (decoration.type !== "tree") return;

            ctx.fillStyle =
                "rgba(0,0,0,0.2)";

            ctx.beginPath();

            ctx.ellipse(
                decoration.x,
                decoration.y + 28,
                35,
                13,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = "#684b32";

            ctx.fillRect(
                decoration.x - 9,
                decoration.y,
                18,
                38
            );

            ctx.fillStyle = "#315b36";

            ctx.beginPath();

            ctx.arc(
                decoration.x,
                decoration.y - 14,
                33,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = "#3f7343";

            ctx.beginPath();

            ctx.arc(
                decoration.x - 12,
                decoration.y - 28,
                24,
                0,
                Math.PI * 2
            );

            ctx.arc(
                decoration.x + 14,
                decoration.y - 27,
                25,
                0,
                Math.PI * 2
            );

            ctx.fill();
        });
    }

    function drawObstacles() {
        state.world.obstacles.forEach(obstacle => {
            if (
                obstacle.type === "building" ||
                obstacle.type === "tree"
            ) {
                return;
            }

            if (obstacle.type === "wall") {
                ctx.fillStyle = "#3c4540";

                ctx.fillRect(
                    obstacle.x,
                    obstacle.y,
                    obstacle.w,
                    obstacle.h
                );

                return;
            }

            if (obstacle.type === "rock") {
                ctx.fillStyle = "#6d716b";

                ctx.beginPath();

                ctx.ellipse(
                    obstacle.x +
                    obstacle.w / 2,
                    obstacle.y +
                    obstacle.h / 2,
                    obstacle.w / 2,
                    obstacle.h / 2,
                    -0.15,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                return;
            }

            if (obstacle.type === "fountain") {
                ctx.fillStyle = "#8c8a7a";

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

                ctx.fillStyle = "#5d9eb1";

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

                ctx.fillStyle = "#c5c3b5";

                ctx.fillRect(
                    obstacle.x +
                    obstacle.w / 2 - 18,
                    obstacle.y + 35,
                    36,
                    75
                );
            }
        });
    }

    function drawNPCs() {
        state.world.npcs.forEach(npc => {
            ctx.fillStyle =
                "rgba(0,0,0,0.22)";

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

            ctx.fillStyle = npc.color;

            ctx.beginPath();

            ctx.arc(
                npc.x,
                npc.y,
                16,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = "#25242a";

            ctx.beginPath();

            ctx.arc(
                npc.x,
                npc.y - 7,
                8,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.textAlign = "center";

            ctx.font = "bold 12px Arial";

            ctx.fillStyle = "#f3ead4";

            ctx.fillText(
                npc.name,
                npc.x,
                npc.y - 28
            );

            ctx.font = "10px Arial";

            ctx.fillStyle = "#d0c9b8";

            ctx.fillText(
                npc.role,
                npc.x,
                npc.y + 36
            );
        });
    }

    function drawPlayer() {
        const player = state.player;

        if (!player) return;

        ctx.fillStyle =
            "rgba(0,0,0,0.3)";

        ctx.beginPath();

        ctx.ellipse(
            player.x,
            player.y + 19,
            21,
            8,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = player.color;

        ctx.beginPath();

        ctx.arc(
            player.x,
            player.y,
            player.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#e5c3a2";

        ctx.beginPath();

        ctx.arc(
            player.x,
            player.y - 12,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#30251f";

        ctx.beginPath();

        ctx.arc(
            player.x,
            player.y - 16,
            10,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#fff5cf";

        ctx.fillRect(
            player.x - 3,
            player.y + 12,
            6,
            5
        );

        ctx.textAlign = "center";

        ctx.font = "bold 13px Arial";

        ctx.fillStyle = "#fff1c9";

        ctx.fillText(
            player.name,
            player.x,
            player.y - 38
        );
    }

    function drawWorldLabels() {
        ctx.textAlign = "center";

        ctx.font =
            "bold 22px Georgia";

        ctx.fillStyle =
            "rgba(255,229,172,0.8)";

        ctx.fillText(
            "PRAÇA DA VILA",
            1600,
            840
        );

        ctx.font = "14px Georgia";

        ctx.fillStyle =
            "rgba(255,255,255,0.6)";

        ctx.fillText(
            "A Quietude ainda não alcançou este lugar...",
            1600,
            865
        );
    }

    // =====================================================
    // HUD
    // =====================================================

    function updateHUD() {
        const player = state.player;

        if (!player) return;

        document.getElementById(
            "hudClass"
        ).textContent =
            player.className;

        document.getElementById(
            "hudName"
        ).textContent =
            player.name;

        document.getElementById(
            "hpBar"
        ).style.width =
            `${(player.hp / player.maxHp) * 100}%`;

        document.getElementById(
            "energyBar"
        ).style.width =
            `${(player.energy / player.maxEnergy) * 100}%`;

        document.getElementById(
            "hpText"
        ).textContent =
            `${Math.ceil(player.hp)}/${player.maxHp}`;

        document.getElementById(
            "energyText"
        ).textContent =
            `${Math.ceil(player.energy)}/${player.maxEnergy}`;

        document.getElementById(
            "levelText"
        ).textContent =
            player.level;

        document.getElementById(
            "xpText"
        ).textContent =
            `${player.xp} / ${player.xpToNext}`;
    }

    // =====================================================
    // SALVAR
    // =====================================================

    function saveGame(showMessage = true) {
        if (!state.player) return;

        const save = {
            version: 1,
            player: {
                ...state.player
            },
            savedAt: new Date().toISOString()
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
            console.error(
                "Não foi possível salvar:",
                error
            );

            showToast(
                "Não foi possível salvar o jogo."
            );
        }
    }

    // =====================================================
    // CARREGAR
    // =====================================================

    function loadGame() {
        try {
            const raw =
                localStorage.getItem(SAVE_KEY);

            if (!raw) return false;

            const save =
                JSON.parse(raw);

            if (!save || !save.player) {
                return false;
            }

            const savedCharacter =
                characters.find(
                    character =>
                        character.id ===
                        save.player.characterId
                );

            if (!savedCharacter) {
                return false;
            }

            state.player = {
                ...save.player,

                maxHp:
                    Number(save.player.maxHp) ||
                    savedCharacter.hp,

                maxEnergy:
                    Number(save.player.maxEnergy) ||
                    savedCharacter.energy,

                radius: 20
            };

            buildWorld();

            updateHUD();

            showScreen("game");

            state.running = true;

            state.lastTime =
                performance.now();

            requestAnimationFrame(gameLoop);

            return true;

        } catch (error) {
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

    // =====================================================
    // SAVE
    // =====================================================

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

    // =====================================================
    // MENSAGEM
    // =====================================================

    function showToast(message) {
        const toast =
            document.getElementById(
                "saveMessage"
            );

        toast.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(
            state.saveToastTimer
        );

        state.saveToastTimer =
            setTimeout(() => {
                toast.classList.remove("show");
            }, 2200);
    }

    // =====================================================
    // MENU
    // =====================================================

    function returnToMenu() {
        if (state.player) {
            saveGame(false);
        }

        state.running = false;

        showScreen("menu");

        updateContinueButton();
    }

    // =====================================================
    // LOOP
    // =====================================================

    function gameLoop(timestamp) {
        if (!state.running) return;

        const dt =
            Math.min(
                (timestamp - state.lastTime) / 1000,
                0.05
            );

        state.lastTime =
            timestamp;

        update(dt);
        draw();

        requestAnimationFrame(
            gameLoop
        );
    }

    // =====================================================
    // BOTÕES
    // =====================================================

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
                if (!loadGame()) {
                    showToast(
                        "O salvamento não pôde ser carregado."
                    );

                    updateContinueButton();
                }
            }
        );

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
        .getElementById("saveBtn")
        .addEventListener(
            "click",
            () => {
                saveGame(true);
            }
        );

    document
        .getElementById("menuBtn")
        .addEventListener(
            "click",
            returnToMenu
        );

    // =====================================================
    // ENTER
    // =====================================================

    document
        .getElementById("playerName")
        .addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    beginGame();
                }
            }
        );

    // =====================================================
    // TECLADO
    // =====================================================

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

            if (
                event.key === "Escape" &&
                screens.game.classList.contains("active")
            ) {
                returnToMenu();
            }
        }
    );

    window.addEventListener(
        "keyup",
        event => {
            state.keys.delete(
                event.key.toLowerCase()
            );
        }
    );

    window.addEventListener(
        "blur",
        () => {
            state.keys.clear();
        }
    );

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    // =====================================================
    // INICIALIZAÇÃO
    // =====================================================

    createCharacterCards();

    resizeCanvas();

    updateContinueButton();

})();
