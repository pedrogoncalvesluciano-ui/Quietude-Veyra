(() => {
    "use strict";

    /* ============================================================
       VEYRA: A QUIETUDE
       SCRIPT.JS — PARTE 1/5

       REVISÃO DE ESTABILIDADE / PRESERVAÇÃO

       REGRA PRINCIPAL DESTA VERSÃO:

       PRESERVAR -> CORRIGIR -> TESTAR -> MELHORAR

       NÃO REDESENHAR SISTEMAS APROVADOS PARA
       CONSERTAR SISTEMAS QUE NÃO FORAM APROVADOS.

       PRESERVAR:
       - tela inicial;
       - diálogo;
       - confirmação de batalha;
       - mochila;
       - identidade geral do Livro.

       ESTA PARTE CONTÉM:
       - versão
       - configurações
       - estado global
       - helpers
       - personagens
       - identidade visual por personagem
       - progressão
       - +3 pontos por nível
       - status
       - itens
       - armaduras
       - inventário
       - dinheiro
       - quests
       - missão Miguel
       - Dash V1
       - Dash V2
       - Chave Obscura
       - Essência Sombria
       - Vaelkor
       - inimigos
       - bosses
       - comportamento neutro de bosses
       - registros permanentes
       - comandos privados
       - senha
       - cheats
       - fundação de save
       - fundação de colisão
       - fundação de portas
       - spawn correto na casa

       NÃO FECHA O IIFE.
       ============================================================ */


    /* ============================================================
       VERSÃO
       ============================================================ */

    const GAME_VERSION = 31;

    const GAME_VERSION_NAME =
        "VEYRA V31 — PRESERVAÇÃO E ESTABILIDADE";


    const SAVE_KEY =
        "veyra_save_v31";


    const LEGACY_SAVE_KEYS = Object.freeze([
        "veyra_save_v30",
        "veyra_save_v25",
        "veyra_save_v20_five_parts",
        "veyra_save_v20_upgrade",
        "veyra_save_v19_rebuild",
        "veyra_save_v19",
        "veyra_save_v18_rebuild",
        "veyra_save_v14_stable"
    ]);


    /* ============================================================
       CONSTANTES
       ============================================================ */

    const MAX_LEVEL = 100;

    const STAT_CAP = 30;

    /*
        DEFINIDO PELO JOGADOR:

        CADA LEVEL = EXATAMENTE +3 PONTOS.

        Level NÃO aumenta atributos sozinho.
    */
    const STATUS_POINTS_PER_LEVEL = 3;


    const LANTERN_PRICE = 350;

    const MINIMAP_PRICE = 180;


    const MAX_ACTIVE_POTION_BUFFS = 2;

    const MAX_BLOOD_MARKS = 20;


    const QUEST_STATE = Object.freeze({
        NOT_STARTED: "not_started",
        ACTIVE: "active",
        COMPLETE: "complete"
    });


    const BOSS_STATE = Object.freeze({
        DORMANT: "dormant",

        /*
            Boss existe, bloqueia passagem,
            mas NÃO ataca.
        */
        NEUTRAL: "neutral",

        /*
            Player apertou ACEITAR.
            Pequeno estado intermediário.
        */
        CONFIRMED: "confirmed",

        /*
            IA ofensiva permitida.
        */
        COMBAT: "combat",

        PHASE_TRANSITION: "phase_transition",

        DYING: "dying",

        DEFEATED: "defeated"
    });


    /* ============================================================
       GAME CONFIG
       ============================================================ */

    const GAME_CONFIG = Object.freeze({

        maxDeltaTime: 0.05,

        autosaveSeconds: 30,


        dialogueCharactersPerSecond: 42,


        interactionDistance: 92,

        npcInteractionDistance: 100,


        doorOpenDistance: 105,

        doorCloseDistance: 145,

        doorEnterDistance: 82,

        /*
            Velocidade de abertura em radianos
            aproximadamente convertida pelo
            renderer.
        */
        doorAnimationSpeed: 4.8,


        treeHarvestSeconds: 0.9,

        oreHarvestSeconds: 0.9,

        darkKeyHarvestSeconds: 1.35,


        enemyActivationDistance: 560,

        enemyForgetDistance: 760,


        bossConfirmationDistance: 205,


        deathMaterialLossRatio: 0.08,

        deathMaxMaterialLossPerType: 8,


        playerBaseRadius: 17,


        /*
            Não mudar o ritmo atual
            de fome/cansaço sem necessidade.
        */
        hungerDrainPerSecond: 0.035,

        fatigueDrainPerSecond: 0.028,


        /*
            Debug.
        */
        debugDamageValue: 99999

    });


    /* ============================================================
       VISUAL CONFIG
       ============================================================ */

    const VISUAL_CONFIG = Object.freeze({

        bossBar: Object.freeze({
            minWidth: 360,
            maxWidth: 720,
            height: 18,
            topDesktop: 34
        }),


        lantern: Object.freeze({

            /*
                Lanterna antiga:
                aproximadamente 4–5 jogadores
                de raio visual útil.
            */
            radius: 255,

            noLanternRadius: 72,

            rays: 180

        }),


        blood: Object.freeze({
            maxMarks: MAX_BLOOD_MARKS
        }),


        /*
            Seleção dos personagens.

            O HTML/CSS usará essas identidades
            para o hover luminoso.
        */
        characterSelection: Object.freeze({
            glowStrength: 0.34,
            glowRadius: 90
        })

    });


    /* ============================================================
       SPAWN OFICIAL

       NOVO JOGO NÃO NASCE NO CENTRO DA VILA.

       Parte 2 vai recalcular este ponto a partir da
       porta VISUAL da casa sempre que possível.

       Este valor é fallback seguro.
       ============================================================ */

    const PLAYER_HOME_SPAWN = Object.freeze({
        area: "village",

        /*
            Frente da casa.
        */
        x: 595,
        y: 1905,

        facing: "up"
    });


    /* ============================================================
       CONFIG DE MISSÃO DO VAZIO
       ============================================================ */

    const VOID_MISSION_CONFIG = Object.freeze({

        shadowEssenceRequired: 15,


        /*
            Depois de conseguir Dash V1.
        */
        requiredDashVersion: 1,


        darkKeyArea:
            "celestialFrontier",


        secretDoorArea:
            "rubyRegion",


        dungeonArea:
            "voidDungeon",


        fragmentMinigameRounds: Object.freeze([

            Object.freeze({
                targetSize: 0.26,
                speed: 1.45
            }),

            Object.freeze({
                targetSize: 0.18,
                speed: 1.8
            }),

            Object.freeze({
                targetSize: 0.115,
                speed: 2.15
            })

        ])

    });


    /* ============================================================
       DASH
       ============================================================ */

    const DASH_CONFIG = Object.freeze({

        v1: Object.freeze({

            id: "dashV1",

            name: "DASH V1",

            subtitle:
                "Passo do Vento",

            distance: 165,

            duration: 0.16,

            speed: 1030,

            cooldown: 3,

            energyCost: 18,

            color: "#eef6fa",

            trailColor:
                "rgba(239,247,250,0.5)",

            invulnerability: 0,

            projectilePhaseWindow: 0

        }),


        v2: Object.freeze({

            id: "dashV2",

            name: "DASH V2",

            subtitle:
                "Dash do Vazio",

            distance: 230,

            duration: 0.14,

            speed: 1640,

            cooldown: 3,

            energyCost: 22,

            color: "#16121c",

            accent: "#8e66a4",

            trailColor:
                "rgba(74,48,88,0.72)",

            /*
                Não é invulnerabilidade geral.

                Só permite atravessar projétil
                durante timing perfeito.
            */
            invulnerability: 0,

            projectilePhaseWindow: 0.09

        })

    });


    /* ============================================================
       HELPERS BÁSICOS
       ============================================================ */

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
        t
    ) {
        return (
            from +
            (
                to -
                from
            ) *
            t
        );
    }


    function finiteNumber(
        value,
        fallback = 0
    ) {
        const number =
            Number(
                value
            );

        return Number.isFinite(
            number
        )
            ? number
            : fallback;
    }


    function integer(
        value,
        fallback = 0
    ) {
        const number =
            finiteNumber(
                value,
                fallback
            );

        return Math.trunc(
            number
        );
    }


    function random(
        min,
        max
    ) {
        return (
            min +
            Math.random() *
            (
                max -
                min
            )
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


    function distanceSquared(
        x1,
        y1,
        x2,
        y2
    ) {
        const dx =
            x2 -
            x1;

        const dy =
            y2 -
            y1;

        return (
            dx * dx +
            dy * dy
        );
    }


    function distance(
        x1,
        y1,
        x2,
        y2
    ) {
        return Math.sqrt(
            distanceSquared(
                x1,
                y1,
                x2,
                y2
            )
        );
    }


    function normalize(
        x,
        y
    ) {
        const length =
            Math.sqrt(
                x * x +
                y * y
            );

        if (
            length <=
            0.000001
        ) {
            return {
                x: 0,
                y: 0
            };
        }

        return {
            x:
                x / length,

            y:
                y / length
        };
    }


    function angleBetween(
        x1,
        y1,
        x2,
        y2
    ) {
        return Math.atan2(
            y2 - y1,
            x2 - x1
        );
    }


    function safeArray(
        value
    ) {
        return Array.isArray(
            value
        )
            ? value
            : [];
    }


    function uniqueArray(
        value
    ) {
        return [
            ...new Set(
                safeArray(
                    value
                )
            )
        ];
    }


    function hashStringToSeed(
        value
    ) {
        let hash =
            2166136261;

        const string =
            String(
                value
            );

        for (
            let index = 0;
            index < string.length;
            index += 1
        ) {
            hash ^=
                string.charCodeAt(
                    index
                );

            hash =
                Math.imul(
                    hash,
                    16777619
                );
        }

        return hash >>> 0;
    }


    function deepCloneJSONSafe(
        value
    ) {
        if (
            value === undefined
        ) {
            return undefined;
        }

        try {
            return JSON.parse(
                JSON.stringify(
                    value
                )
            );
        } catch {
            return value;
        }
    }


    /* ============================================================
       GEOMETRIA / COLISÃO
       ============================================================ */

    function rectsOverlap(
        a,
        b
    ) {
        return (
            a.x <
                b.x +
                b.w &&
            a.x +
                a.w >
                b.x &&
            a.y <
                b.y +
                b.h &&
            a.y +
                a.h >
                b.y
        );
    }


    function pointInRect(
        x,
        y,
        rect
    ) {
        return (
            x >=
                rect.x &&
            x <=
                rect.x +
                rect.w &&
            y >=
                rect.y &&
            y <=
                rect.y +
                rect.h
        );
    }


    function circleRectCollision(
        circleX,
        circleY,
        radius,
        rect
    ) {
        const nearestX =
            clamp(
                circleX,
                rect.x,
                rect.x +
                    rect.w
            );

        const nearestY =
            clamp(
                circleY,
                rect.y,
                rect.y +
                    rect.h
            );

        const dx =
            circleX -
            nearestX;

        const dy =
            circleY -
            nearestY;

        return (
            dx * dx +
            dy * dy <=
            radius * radius
        );
    }


    function circleCircleCollision(
        x1,
        y1,
        r1,
        x2,
        y2,
        r2
    ) {
        const radius =
            r1 +
            r2;

        return (
            distanceSquared(
                x1,
                y1,
                x2,
                y2
            ) <=
            radius * radius
        );
    }


    /*
        Todo obstáculo sólido terá isso.

        Parte 2 vai adicionar árvores, pedras,
        casas e paredes por esta estrutura.
    */
    function createSolidObstacle(
        config
    ) {
        return {
            id:
                config.id ||
                `obstacle_${Math.random().toString(36).slice(2)}`,

            type:
                config.type ||
                "solid",

            x:
                finiteNumber(
                    config.x
                ),

            y:
                finiteNumber(
                    config.y
                ),

            w:
                Math.max(
                    1,
                    finiteNumber(
                        config.w,
                        20
                    )
                ),

            h:
                Math.max(
                    1,
                    finiteNumber(
                        config.h,
                        20
                    )
                ),

            solid:
                config.solid !==
                false,

            blocksLight:
                Boolean(
                    config.blocksLight
                ),

            /*
                Para a árvore:
                collisionShape="trunk"
                permite copa enorme sem bloquear
                espaço que visualmente deveria ser
                atravessável.
            */
            collisionShape:
                config.collisionShape ||
                "rect",

            sourceId:
                config.sourceId ||
                null
        };
    }


    /* ============================================================
       PORTAS — FUNDAÇÃO

       Agora a porta NÃO encolhe.

       Ela possui:
       - hinge;
       - angle;
       - openAmount;
       - targetOpen;
       - width real;
       - hitbox derivada da mesma geometria.

       Parte 2 cria as portas.
       Parte 4 desenha girando a folha.
       ============================================================ */

    function createDoorRuntime(
        config
    ) {
        const side =
            config.side ||
            "bottom";

        const width =
            Math.max(
                20,
                finiteNumber(
                    config.w,
                    72
                )
            );

        const height =
            Math.max(
                20,
                finiteNumber(
                    config.h,
                    26
                )
            );

        return {
            id:
                config.id,

            buildingId:
                config.buildingId ||
                null,

            houseId:
                config.houseId ||
                null,

            side,

            x:
                config.x,

            y:
                config.y,

            w:
                width,

            h:
                height,

            centerX:
                config.x +
                width / 2,

            centerY:
                config.y +
                height / 2,

            /*
                left / right define qual ponta
                funciona como dobradiça.
            */
            hinge:
                config.hinge ||
                "left",

            openAmount:
                0,

            targetOpen:
                0,

            angle:
                0,

            maxAngle:
                Math.PI *
                0.48,

            opening:
                false,

            open:
                false,

            autoOpen:
                config.autoOpen !==
                false,

            locked:
                Boolean(
                    config.locked
                )
        };
    }


    /* ============================================================
       PERSONAGENS

       IMPORTANTE:

       Antes todos terminavam visualmente parecidos
       porque o renderer usava um corpo humanoide
       genérico.

       Agora cada personagem possui um
       "visualProfile" completo.

       Parte 4 NÃO poderá ignorar este perfil.
       ============================================================ */

    const CHARACTERS = Object.freeze({

        kaelion: Object.freeze({

            id: "kaelion",

            name: "Kaelion",

            className: "Mago",

            icon: "🔥",

            color: "#dc7a36",

            selectionGlow:
                "#f29a4f",

            description:
                "Um conjurador ofensivo que transforma memória em fogo arcano.",

            hp: 92,

            magic: 145,

            energy: 95,

            damage: 26,

            defense: 8,

            speed: 150,


            basicAttack: Object.freeze({
                id: "fireBolt",
                name:
                    "Projétil Arcano",
                type:
                    "projectile",
                range: 300,
                speed: 520,
                radius: 8,
                color:
                    "#ed8a3f"
            }),


            visualProfile: Object.freeze({

                renderer:
                    "kaelion",

                bodyType:
                    "mage",

                silhouette:
                    "slender",

                bodyColor:
                    "#7e472c",

                clothColor:
                    "#553126",

                accentColor:
                    "#ed873f",

                skinColor:
                    "#c69473",

                hairColor:
                    "#34251f",

                capeColor:
                    "#4a2c27",

                robe:
                    true,

                armor:
                    false,

                wings:
                    false,

                horns:
                    false,

                weaponVisual:
                    "staff",

                idleAnimation:
                    "arcaneFloat",

                walkAnimation:
                    "robeWalk",

                attackAnimation:
                    "staffCast",

                particleIdentity:
                    "embers"

            })

        }),


        theron: Object.freeze({

            id: "theron",

            name: "Theron",

            className: "Cavaleiro",

            icon: "⚔️",

            color: "#9da2a4",

            selectionGlow:
                "#d2d7d9",

            description:
                "Um combatente equilibrado, resistente e especializado no combate corpo a corpo.",

            hp: 128,

            magic: 72,

            energy: 112,

            damage: 25,

            defense: 19,

            speed: 142,


            basicAttack: Object.freeze({
                id:
                    "swordSlash",
                name:
                    "Corte de Espada",
                type:
                    "meleeArc",
                range:
                    72,
                arc:
                    1.12,
                color:
                    "#d7dbdc"
            }),


            visualProfile: Object.freeze({

                renderer:
                    "theron",

                bodyType:
                    "knight",

                silhouette:
                    "armored",

                bodyColor:
                    "#6f7476",

                clothColor:
                    "#34393c",

                accentColor:
                    "#bbc2c5",

                skinColor:
                    "#c69a76",

                hairColor:
                    "#4b372c",

                capeColor:
                    "#4e5154",

                robe:
                    false,

                armor:
                    true,

                shoulderArmor:
                    true,

                helmet:
                    false,

                wings:
                    false,

                weaponVisual:
                    "longSword",

                shieldVisual:
                    "roundShield",

                idleAnimation:
                    "guardIdle",

                walkAnimation:
                    "armoredWalk",

                attackAnimation:
                    "swordSlash",

                particleIdentity:
                    "steelSpark"

            })

        }),


        grumgar: Object.freeze({

            id: "grumgar",

            name: "Grumgar",

            className: "Troll",

            icon: "🪨",

            color: "#738353",

            selectionGlow:
                "#9bab6a",

            description:
                "Um guerreiro brutal de grande resistência, capaz de esmagar grupos de inimigos.",

            hp: 155,

            magic: 60,

            energy: 120,

            damage: 30,

            defense: 15,

            speed: 126,


            basicAttack: Object.freeze({
                id:
                    "heavySmash",
                name:
                    "Esmagamento",
                type:
                    "splash",
                range:
                    70,
                radius:
                    55,
                color:
                    "#8c9a67"
            }),


            visualProfile: Object.freeze({

                renderer:
                    "grumgar",

                bodyType:
                    "troll",

                silhouette:
                    "massive",

                bodyColor:
                    "#6a784b",

                clothColor:
                    "#423c2f",

                accentColor:
                    "#8fa066",

                skinColor:
                    "#718054",

                hairColor:
                    "#373a2b",

                capeColor:
                    null,

                robe:
                    false,

                armor:
                    false,

                muscular:
                    true,

                tusks:
                    true,

                ears:
                    "pointed",

                wings:
                    false,

                weaponVisual:
                    "stoneFists",

                idleAnimation:
                    "heavyBreath",

                walkAnimation:
                    "heavyWalk",

                attackAnimation:
                    "groundPunch",

                particleIdentity:
                    "dust"

            })

        }),


        lirael: Object.freeze({

            id: "lirael",

            name: "Lirael",

            className: "Fada",

            icon: "✨",

            color: "#d777b4",

            selectionGlow:
                "#f1a4d4",

            description:
                "Uma viajante extremamente veloz que utiliza magia feérica e ataques de luz.",

            hp: 86,

            magic: 132,

            energy: 118,

            damage: 22,

            defense: 7,

            speed: 168,


            basicAttack: Object.freeze({
                id:
                    "fairyBolt",
                name:
                    "Luz Feérica",
                type:
                    "projectile",
                range:
                    320,
                speed:
                    610,
                radius:
                    7,
                color:
                    "#f0a4d2"
            }),


            visualProfile: Object.freeze({

                renderer:
                    "lirael",

                bodyType:
                    "fairy",

                silhouette:
                    "light",

                bodyColor:
                    "#b85e94",

                clothColor:
                    "#7d456b",

                accentColor:
                    "#f0a7d5",

                skinColor:
                    "#e2b9a2",

                hairColor:
                    "#e4cccf",

                capeColor:
                    null,

                robe:
                    false,

                armor:
                    false,

                wings:
                    true,

                wingColor:
                    "#f0cbe4",

                wingStyle:
                    "double",

                weaponVisual:
                    "magicHands",

                idleAnimation:
                    "fairyHover",

                walkAnimation:
                    "fairyGlide",

                attackAnimation:
                    "lightCast",

                particleIdentity:
                    "fairyDust"

            })

        }),


        zephyr: Object.freeze({

            id: "zephyr",

            name: "Zephyr",

            className: "Transmorfo",

            icon: "🌀",

            color: "#8166ab",

            selectionGlow:
                "#ad8bd1",

            description:
                "Um combatente adaptável que manipula fendas e altera seu estilo durante a batalha.",

            hp: 105,

            magic: 108,

            energy: 126,

            damage: 24,

            defense: 11,

            speed: 160,


            basicAttack: Object.freeze({
                id:
                    "riftSlash",
                name:
                    "Corte da Fenda",
                type:
                    "riftArc",
                range:
                    98,
                arc:
                    0.9,
                color:
                    "#a17bd0"
            }),


            visualProfile: Object.freeze({

                renderer:
                    "zephyr",

                bodyType:
                    "shifter",

                silhouette:
                    "agile",

                bodyColor:
                    "#5b467a",

                clothColor:
                    "#2c2636",

                accentColor:
                    "#a078cf",

                skinColor:
                    "#b99b91",

                hairColor:
                    "#322b39",

                capeColor:
                    "#362e45",

                robe:
                    false,

                armor:
                    false,

                wings:
                    false,

                asymmetrical:
                    true,

                voidMark:
                    true,

                weaponVisual:
                    "riftBlade",

                idleAnimation:
                    "riftIdle",

                walkAnimation:
                    "agileWalk",

                attackAnimation:
                    "riftSlash",

                particleIdentity:
                    "riftDust"

            })

        })

    });


    function getCharacterById(
        characterId
    ) {
        return (
            CHARACTERS[
                characterId
            ] ||
            null
        );
    }


    function currentCharacter() {
        return (
            getCharacterById(
                state.player
                    ?.characterId
            ) ||
            CHARACTERS.kaelion
        );
    }


    /* ============================================================
       BARRAS DA SELEÇÃO

       Baseadas em valores REAIS.
       ============================================================ */

    const CHARACTER_SELECTION_RANGE =
        Object.freeze({

            hp:
                Object.freeze({
                    min: 80,
                    max: 160
                }),

            magic:
                Object.freeze({
                    min: 55,
                    max: 150
                }),

            energy:
                Object.freeze({
                    min: 90,
                    max: 130
                }),

            damage:
                Object.freeze({
                    min: 20,
                    max: 32
                }),

            defense:
                Object.freeze({
                    min: 5,
                    max: 21
                }),

            speed:
                Object.freeze({
                    min: 120,
                    max: 170
                })

        });


    function getCharacterStatBarValue(
        character,
        stat
    ) {
        const range =
            CHARACTER_SELECTION_RANGE[
                stat
            ];

        if (!range) {
            return 0;
        }

        const value =
            finiteNumber(
                character[
                    stat
                ],
                range.min
            );

        return clamp(
            (
                (
                    value -
                    range.min
                ) /
                (
                    range.max -
                    range.min
                )
            ) *
            100,
            0,
            100
        );
    }


    /* ============================================================
       STATUS

       DISTRIBUÍVEIS:
       - Força/Magia
       - Energia
       - Fome
       - Cansaço

       NÃO DISTRIBUÍVEIS:
       - Vida
       - Velocidade
       ============================================================ */

    const STAT_CONFIG = Object.freeze({

        power: Object.freeze({

            id: "power",

            label:
                "Força / Magia",

            icon:
                "✦",

            cap:
                STAT_CAP,

            description:
                "+2% de dano e +4 de magia máxima por ponto."

        }),


        energy: Object.freeze({

            id:
                "energy",

            label:
                "Energia",

            icon:
                "⚡",

            cap:
                STAT_CAP,

            description:
                "+5 de energia máxima por ponto."

        }),


        hunger: Object.freeze({

            id:
                "hunger",

            label:
                "Fome",

            icon:
                "🍞",

            cap:
                STAT_CAP,

            description:
                "+3 de fome máxima por ponto."

        }),


        fatigue: Object.freeze({

            id:
                "fatigue",

            label:
                "Cansaço",

            icon:
                "☾",

            cap:
                STAT_CAP,

            description:
                "+3 de resistência ao cansaço por ponto."

        })

    });


    function getStatusPointsGrantedForLevel(
        level
    ) {
        if (
            level <= 1
        ) {
            return 0;
        }

        return (
            level - 1
        ) *
        STATUS_POINTS_PER_LEVEL;
    }


    /* ============================================================
       ARMADURAS
       ============================================================ */

    const ARMOR_PROGRESSION =
        Object.freeze([

            "armaduraFolha",

            "armaduraAlgodao",

            "armaduraMadeira",

            "armaduraCouro",

            "armaduraFerro",

            "armaduraOuro",

            "armaduraDiamante",

            "armaduraRubi"

        ]);


    const ARMOR_DATA =
        Object.freeze({

            armaduraFolha:
                Object.freeze({

                    id:
                        "armaduraFolha",

                    tier: 1,

                    name:
                        "Armadura de Folha",

                    icon:
                        "🍃",

                    hp: 25,

                    defense: 3,

                    price: 65,

                    previousArmor:
                        null,

                    progression:
                        true

                }),


            armaduraAlgodao:
                Object.freeze({

                    id:
                        "armaduraAlgodao",

                    tier: 2,

                    name:
                        "Armadura de Algodão",

                    icon:
                        "☁️",

                    hp: 50,

                    defense: 6,

                    price: 105,

                    previousArmor:
                        "armaduraFolha",

                    progression:
                        true

                }),


            armaduraMadeira:
                Object.freeze({

                    id:
                        "armaduraMadeira",

                    tier: 3,

                    name:
                        "Armadura de Madeira",

                    icon:
                        "🪵",

                    hp: 75,

                    defense: 10,

                    price: 165,

                    previousArmor:
                        "armaduraAlgodao",

                    progression:
                        true

                }),


            armaduraCouro:
                Object.freeze({

                    id:
                        "armaduraCouro",

                    tier: 4,

                    name:
                        "Armadura de Couro",

                    icon:
                        "🛡️",

                    hp: 100,

                    defense: 15,

                    price: 250,

                    previousArmor:
                        "armaduraMadeira",

                    progression:
                        true

                }),


            armaduraFerro:
                Object.freeze({

                    id:
                        "armaduraFerro",

                    tier: 5,

                    name:
                        "Armadura de Ferro",

                    icon:
                        "⛓️",

                    hp: 125,

                    defense: 22,

                    price: 340,

                    previousArmor:
                        "armaduraCouro",

                    material:
                        "ferro",

                    materialAmount:
                        36,

                    progression:
                        true

                }),


            armaduraOuro:
                Object.freeze({

                    id:
                        "armaduraOuro",

                    tier: 6,

                    name:
                        "Armadura de Ouro",

                    icon:
                        "🟨",

                    hp: 150,

                    defense: 30,

                    price: 620,

                    previousArmor:
                        "armaduraFerro",

                    material:
                        "ouro",

                    materialAmount:
                        42,

                    progression:
                        true

                }),


            armaduraDiamante:
                Object.freeze({

                    id:
                        "armaduraDiamante",

                    tier: 7,

                    name:
                        "Armadura de Diamante",

                    icon:
                        "💎",

                    hp: 175,

                    defense: 40,

                    price: 980,

                    previousArmor:
                        "armaduraOuro",

                    material:
                        "diamante",

                    materialAmount:
                        48,

                    progression:
                        true

                }),


            armaduraRubi:
                Object.freeze({

                    id:
                        "armaduraRubi",

                    tier: 8,

                    name:
                        "Armadura de Rubi",

                    icon:
                        "♦️",

                    hp: 200,

                    defense: 53,

                    price: 1450,

                    previousArmor:
                        "armaduraDiamante",

                    material:
                        "rubi",

                    materialAmount:
                        62,

                    progression:
                        true

                })

        });


    /* ============================================================
       ITENS
       ============================================================ */

    const ITEMS = {};


    function registerItem(
        item
    ) {
        if (
            !item ||
            !item.id
        ) {
            return;
        }

        ITEMS[
            item.id
        ] =
            Object.freeze({
                weight: 1,
                value: 1,
                sellable: false,
                stackable: true,
                ...item
            });
    }


    /* ============================================================
       MATERIAIS
       ============================================================ */

    registerItem({
        id: "madeira",
        name: "Madeira",
        icon: "🪵",
        category: "materials",
        weight: 1,
        value: 6,
        sellable: true
    });


    registerItem({
        id: "carvao",
        name: "Carvão",
        icon: "◼",
        category: "materials",
        weight: 0.8,
        value: 8,
        sellable: true
    });


    registerItem({
        id: "ferro",
        name: "Ferro",
        icon: "⬡",
        category: "materials",
        weight: 1,
        value: 11,
        sellable: true
    });


    registerItem({
        id: "ouro",
        name: "Ouro",
        icon: "◆",
        category: "materials",
        weight: 0.85,
        value: 17,
        sellable: true
    });


    registerItem({
        id: "diamante",
        name: "Diamante",
        icon: "💎",
        category: "materials",
        weight: 0.6,
        value: 31,
        sellable: true
    });


    registerItem({
        id: "rubi",
        name: "Rubi",
        icon: "♦",
        category: "materials",
        weight: 0.6,
        value: 36,
        sellable: true
    });


    /* ============================================================
       MISSÃO DO VAZIO
       ============================================================ */

    registerItem({
        id: "essenciaSombria",
        name: "Essência Sombria",
        icon: "◉",
        category: "quest",
        weight: 0.1,
        value: 0,
        sellable: false,
        questItem: true
    });


    registerItem({
        id: "chaveObscura",
        name: "Chave Obscura",
        icon: "🗝️",
        category: "quest",
        weight: 0,
        value: 0,
        sellable: false,
        unique: true,
        questItem: true
    });


    registerItem({
        id: "fragmentoVazio",
        name: "Fragmento do Vazio",
        icon: "◈",
        category: "quest",
        weight: 0,
        value: 0,
        sellable: false,
        unique: true,
        questItem: true
    });


    registerItem({
        id: "flautaMemoria",
        name: "Flauta da Memória",
        icon: "♫",
        category: "quest",
        weight: 0,
        value: 0,
        sellable: false,
        unique: true,
        questItem: true
    });


    /* ============================================================
       FERRAMENTAS PERMANENTES
       ============================================================ */

    registerItem({
        id: "lanterna",
        name: "Lanterna Antiga",
        icon: "🏮",
        category: "tools",
        weight: 0,
        value: LANTERN_PRICE,
        sellable: false,
        unique: true,
        permanent: true
    });


    registerItem({
        id: "minimapa",
        name: "Minimapa",
        icon: "🗺️",
        category: "tools",
        weight: 0,
        value: MINIMAP_PRICE,
        sellable: false,
        unique: true,
        permanent: true
    });


    /* ============================================================
       COMIDA / POÇÕES
       ============================================================ */

    registerItem({
        id: "pao",
        name: "Pão",
        icon: "🍞",
        category: "food",
        weight: 0.2,
        value: 12,
        sellable: true,
        effect: Object.freeze({
            hunger: 30
        })
    });


    registerItem({
        id: "pocao",
        name: "Poção de Vida",
        icon: "🧪",
        category: "potions",
        weight: 0.3,
        value: 45,
        sellable: true,
        effect: Object.freeze({
            hp: 45
        })
    });


    registerItem({
        id: "elixir",
        name: "Elixir de Magia",
        icon: "🔷",
        category: "potions",
        weight: 0.3,
        value: 55,
        sellable: true,
        effect: Object.freeze({
            magic: 55
        })
    });


    registerItem({
        id: "pocaoForca",
        name: "Poção de Força",
        icon: "🔴",
        category: "potions",
        weight: 0.3,
        value: 85,
        sellable: true,
        effect: Object.freeze({
            buff: "damage",
            multiplier: 1.2,
            duration: 45
        })
    });


    registerItem({
        id: "pocaoResistencia",
        name: "Poção de Resistência",
        icon: "🟤",
        category: "potions",
        weight: 0.3,
        value: 85,
        sellable: true,
        effect: Object.freeze({
            buff: "defense",
            multiplier: 1.2,
            duration: 45
        })
    });


    registerItem({
        id: "pocaoVelocidade",
        name: "Poção de Velocidade",
        icon: "🟢",
        category: "potions",
        weight: 0.3,
        value: 95,
        sellable: true,
        effect: Object.freeze({
            buff: "speed",
            multiplier: 1.16,
            duration: 35
        })
    });


    /* ============================================================
       ARMAS
       ============================================================ */

    registerItem({
        id: "espadaFerro",
        name: "Espada de Ferro",
        icon: "⚔️",
        category: "weapons",
        weight: 3,
        value: 180,
        sellable: true,
        damage: 9
    });


    /* ============================================================
       ARMADURAS COMO ITENS
       ============================================================ */

    for (
        const armor of
        Object.values(
            ARMOR_DATA
        )
    ) {
        registerItem({
            id: armor.id,
            name: armor.name,
            icon: armor.icon,
            category: "armor",
            weight: 0,
            value: armor.price,
            sellable: false,
            progression: true,
            unique: true,
            armorTier: armor.tier
        });
    }


    Object.freeze(
        ITEMS
    );


    /* ============================================================
       SKILLS
       ============================================================ */

    const CLASS_SKILLS =
        Object.freeze({

            kaelion:
                Object.freeze({

                    q:
                        Object.freeze({
                            id: "memoryRay",
                            name:
                                "Raio de Memória",
                            magicCost: 15,
                            cooldown: 2
                        }),

                    r:
                        Object.freeze({
                            id: "arcaneCircle",
                            name:
                                "Círculo Arcano",
                            magicCost: 24,
                            cooldown: 5
                        }),

                    f:
                        Object.freeze({
                            id: "memoryExplosion",
                            name:
                                "Explosão de Memória",
                            magicCost: 36,
                            cooldown: 8
                        })

                }),


            theron:
                Object.freeze({

                    q:
                        Object.freeze({
                            id: "guardianStrike",
                            name:
                                "Golpe do Guardião",
                            energyCost: 10,
                            cooldown: 3
                        }),

                    r:
                        Object.freeze({
                            id: "ironStance",
                            name:
                                "Postura de Ferro",
                            energyCost: 18,
                            cooldown: 6
                        }),

                    f:
                        Object.freeze({
                            id: "guardianCharge",
                            name:
                                "Investida do Guardião",
                            energyCost: 25,
                            cooldown: 8
                        })

                }),


            grumgar:
                Object.freeze({

                    q:
                        Object.freeze({
                            id: "crushingBlow",
                            name:
                                "Esmagamento",
                            energyCost: 13,
                            cooldown: 4
                        }),

                    r:
                        Object.freeze({
                            id: "stoneRoar",
                            name:
                                "Rugido de Pedra",
                            energyCost: 20,
                            cooldown: 6
                        }),

                    f:
                        Object.freeze({
                            id: "earthBreaker",
                            name:
                                "Ruptura do Solo",
                            energyCost: 30,
                            cooldown: 9
                        })

                }),


            lirael:
                Object.freeze({

                    q:
                        Object.freeze({
                            id: "vitalLight",
                            name:
                                "Luz Vital",
                            magicCost: 14,
                            cooldown: 4
                        }),

                    r:
                        Object.freeze({
                            id: "fairyBlast",
                            name:
                                "Rajada Feérica",
                            magicCost: 20,
                            cooldown: 4.5
                        }),

                    f:
                        Object.freeze({
                            id: "lightRain",
                            name:
                                "Chuva de Luz",
                            magicCost: 34,
                            cooldown: 8
                        })

                }),


            zephyr:
                Object.freeze({

                    q:
                        Object.freeze({
                            id: "adaptiveCut",
                            name:
                                "Corte Adaptativo",
                            magicCost: 11,
                            cooldown: 2.8
                        }),

                    r:
                        Object.freeze({
                            id: "adaptiveForm",
                            name:
                                "Forma Adaptativa",
                            magicCost: 12,
                            cooldown: 8
                        }),

                    f:
                        Object.freeze({
                            id: "riftStep",
                            name:
                                "Passo da Fenda",
                            energyCost: 20,
                            cooldown: 6
                        })

                })

        });


    /* ============================================================
       DIÁLOGOS
       ============================================================ */

    const NPC_DIALOGUES =
        Object.freeze({

            elian:
                Object.freeze([

                    "A Quietude parece estar chegando mais perto. Ontem eu esqueci o nome da rua onde cresci.",

                    "Meu pai dizia que a primeira coisa que some não é um lugar. É a lembrança de que ele existia.",

                    "A estrada leste está estranha. Um Guardião apareceu por lá e não deixa ninguém passar.",

                    "Se você descobrir alguma coisa fora da vila, volte. Precisamos de histórias novas para não esquecer as antigas."

                ]),


            mara:
                Object.freeze([

                    "Os registros mais antigos falam da Quietude como se ela já tivesse acontecido antes.",

                    "Cada pessoa descreve a Quietude de um jeito diferente. Isso é o que mais me assusta.",

                    "Alguns livros têm páginas inteiras em branco, mas a numeração continua como se algo estivesse faltando.",

                    "Quando você encontrar algo que não consegue explicar, tente lembrar de cada detalhe antes de voltar."

                ]),


            doran:
                Object.freeze([

                    "Compro materiais e vendo o que consigo trazer de fora.",

                    "Uma boa espada não resolve todos os problemas, mas resolve alguns deles bem rápido.",

                    "Guarde dinheiro para quando realmente precisar. As regiões além da vila não são gentis.",

                    "Se encontrar cristais ou minérios raros, eu pago bem."

                ]),


            bran:
                Object.freeze([

                    "Preciso reforçar algumas casas. A madeira anda apodrecendo mais rápido desde que a Quietude chegou.",

                    "As árvores daqui são estranhas. Algumas voltam a nascer longe do lugar onde caíram.",

                    "Se puder trazer dez madeiras, eu pago pelo trabalho.",

                    "Cortar madeira consome magia. Não se esgote por causa de uma árvore."

                ]),


            borin:
                Object.freeze([

                    "O fogo da forja ainda lembra como queimar. Por enquanto.",

                    "Carvão bom está ficando difícil de encontrar.",

                    "Se trouxer oito carvões, posso compensar seu esforço.",

                    "Equipamento é investimento. Sobreviver costuma sair mais barato que morrer."

                ]),


            nara:
                Object.freeze([

                    "A floresta percebe quem passa por ela.",

                    "Há árvores que se movem quando ninguém está olhando.",

                    "A Quietude não mata todas as coisas. Algumas continuam andando sem lembrar por quê.",

                    "O caminho adiante só se abre para quem prova que consegue sobreviver aqui."

                ]),


            lyra:
                Object.freeze([

                    "Este bosque guarda memórias nas raízes.",

                    "Quando uma árvore cai, às vezes outra nasce carregando lembranças que não são dela.",

                    "As montanhas ficam além deste lugar.",

                    "Não confunda silêncio com paz."

                ]),


            kael:
                Object.freeze([

                    "O vento daqui apaga pegadas em minutos.",

                    "Há uma passagem antiga na montanha.",

                    "Minérios abaixo da neve ainda reagem à magia.",

                    "Não fique parado por muito tempo. Algumas coisas confundem viajantes com pedras."

                ]),


            miguel:
                Object.freeze({

                    beforeDash:
                        Object.freeze([

                            "Você ainda não está preparado. Volte quando seus passos forem mais rápidos que seus olhos."

                        ]),


                    offerQuest:
                        Object.freeze([

                            "Então você finalmente aprendeu a romper o vento...",

                            "Mas existe uma técnica que poucos chegaram a conhecer.",

                            "Se realmente deseja encontrá-la, existe algo que preciso que recupere.",

                            "No Caminho 2 existe uma chave escondida.",

                            "Encontre-a. Quando estiver em suas mãos, procure aquilo que permaneceu trancado no Caminho 1."

                        ]),


                    afterAccept:
                        Object.freeze([

                            "A chave não estará esperando por você no meio da estrada.",

                            "Explore o Caminho 2.",

                            "Quando encontrá-la, você entenderá o que deve fazer."

                        ]),


                    keyFound:
                        Object.freeze([

                            "A chave reagiu à energia sombria, não foi?",

                            "Então você está no caminho certo.",

                            "Agora encontre aquilo que permaneceu trancado no Caminho 1."

                        ]),


                    dungeon:
                        Object.freeze([

                            "Se encontrou a passagem, então agora está por conta própria.",

                            "Há coisas que permaneceram seladas por um motivo."

                        ]),


                    fragmentReturn:
                        Object.freeze([

                            "Então era verdade...",

                            "O Fragmento do Vazio ainda existe.",

                            "E se conseguiu passar por Vaelkor...",

                            "Talvez realmente esteja preparado.",

                            "Seu Dash rompe o vento.",

                            "Com isto... ele poderá romper o próprio espaço.",

                            "Prepare-se."

                        ]),


                    completed:
                        Object.freeze([

                            "Você conseguiu atingir algo que muitos jamais alcançaram. Continue avançando para libertar seu povo desta maldição.",

                            "Vaelkor caiu, mas o Vazio não terminou de observar você. Continue avançando.",

                            "Agora seus passos atravessam o próprio espaço. Não desperdice aquilo que conquistou."

                        ])

                })

        });


    /* ============================================================
       QUESTS BÁSICAS
       ============================================================ */

    const QUEST_CONFIG =
        Object.freeze({

            wood:
                Object.freeze({

                    id:
                        "wood",

                    title:
                        "Madeira para Bran",

                    itemId:
                        "madeira",

                    amount:
                        10,

                    rewardCoins:
                        100

                }),


            coal:
                Object.freeze({

                    id:
                        "coal",

                    title:
                        "Carvão para Borin",

                    itemId:
                        "carvao",

                    amount:
                        8,

                    rewardCoins:
                        125

                })

        });


    /* ============================================================
       MISSÃO MIGUEL
       ============================================================ */

    const MIGUEL_QUEST_STAGE =
        Object.freeze({

            LOCKED:
                "locked",

            AVAILABLE:
                "available",

            FIND_DARK_KEY:
                "find_dark_key",

            KEY_FOUND_NEEDS_ESSENCE:
                "key_found_needs_essence",

            RETURN_PATH_ONE:
                "return_path_one",

            OPEN_SECRET_DOOR:
                "open_secret_door",

            EXPLORE_DUNGEON:
                "explore_dungeon",

            DEFEAT_VAELKOR:
                "defeat_vaelkor",

            COLLECT_FRAGMENT:
                "collect_fragment",

            RETURN_TO_MIGUEL:
                "return_to_miguel",

            COMPLETE:
                "complete"

        });


    function createMiguelQuestState() {
        return {

            miguelFound:
                false,

            dashV1SeenByMiguel:
                false,

            missionAvailable:
                false,

            missionAccepted:
                false,


            stage:
                MIGUEL_QUEST_STAGE
                    .LOCKED,


            keyLocationDiscovered:
                false,

            keyCollected:
                false,

            keyConsumed:
                false,


            secretDoorDiscovered:
                false,

            secretDoorOpened:
                false,


            dungeonDiscovered:
                false,


            clearedDungeonEnemyIds:
                [],


            vaelkorActivated:
                false,

            vaelkorPhaseTwoSeen:
                false,

            vaelkorDefeated:
                false,

            vaelkorDeathCutscenePlayed:
                false,


            fragmentSpawned:
                false,

            fragmentMiniGameCompleted:
                false,

            fragmentCollected:
                false,

            fragmentDelivered:
                false,


            completed:
                false,


            trackerVisible:
                false,

            trackerObjective:
                "",

            objectiveRevision:
                0

        };
    }


    /* ============================================================
       INIMIGOS
       ============================================================ */

    const ENEMY_SPECIES =
        Object.freeze({

            wolf:
                Object.freeze({

                    id: "wolf",

                    name:
                        "Lobo",

                    spriteType:
                        "wolf",

                    hp: 48,

                    damage: 11,

                    defense: 3,

                    speed: 128,

                    radius: 20,

                    xp: 15,

                    ability:
                        "wolfCharge",

                    abilityConfig:
                        Object.freeze({

                            cooldown: 2,

                            telegraph: 0.52,

                            speed: 390,

                            duration: 0.42

                        })

                }),


            boar:
                Object.freeze({

                    id: "boar",

                    name:
                        "Javali",

                    spriteType:
                        "boar",

                    hp: 72,

                    damage: 14,

                    defense: 5,

                    speed: 105,

                    radius: 23,

                    xp: 18,

                    ability:
                        "heavyCharge",

                    abilityConfig:
                        Object.freeze({

                            cooldown: 3,

                            telegraph: 0.7,

                            speed: 315,

                            duration: 0.5

                        })

                }),


            thornling:
                Object.freeze({

                    id:
                        "thornling",

                    name:
                        "Espinheiro",

                    spriteType:
                        "thornling",

                    hp: 58,

                    damage: 12,

                    defense: 4,

                    speed: 91,

                    radius: 21,

                    xp: 18,

                    ability:
                        "rootShot"

                }),


            stoneCrawler:
                Object.freeze({

                    id:
                        "stoneCrawler",

                    name:
                        "Rastejante de Pedra",

                    spriteType:
                        "crawler",

                    color:
                        "#74736c",

                    hp: 82,

                    damage: 16,

                    defense: 8,

                    speed: 84,

                    radius: 24,

                    xp: 23,

                    ability:
                        "groundSlam"

                }),


            mineCrawler:
                Object.freeze({

                    id:
                        "mineCrawler",

                    name:
                        "Rastejante da Mina",

                    spriteType:
                        "crawler",

                    color:
                        "#645d55",

                    hp: 95,

                    damage: 17,

                    defense: 9,

                    speed: 82,

                    radius: 25,

                    xp: 27,

                    ability:
                        "oreBurst"

                }),


            rubyHound:
                Object.freeze({

                    id:
                        "rubyHound",

                    name:
                        "Cão de Rubi",

                    spriteType:
                        "rubyHound",

                    hp: 112,

                    damage: 21,

                    defense: 11,

                    speed: 134,

                    radius: 22,

                    xp: 31,

                    ability:
                        "burningCharge"

                }),


            spider:
                Object.freeze({

                    id:
                        "spider",

                    name:
                        "Aranha",

                    spriteType:
                        "spider",

                    hp: 46,

                    damage: 10,

                    defense: 2,

                    speed: 122,

                    radius: 19,

                    xp: 15,

                    ability:
                        "webSlow"

                }),


            scorpion:
                Object.freeze({

                    id:
                        "scorpion",

                    name:
                        "Escorpião",

                    spriteType:
                        "scorpion",

                    hp: 61,

                    damage: 13,

                    defense: 5,

                    speed: 109,

                    radius: 20,

                    xp: 19,

                    ability:
                        "poison"

                }),


            bat:
                Object.freeze({

                    id:
                        "bat",

                    name:
                        "Morcego",

                    spriteType:
                        "bat",

                    hp: 38,

                    damage: 9,

                    defense: 1,

                    speed: 153,

                    radius: 17,

                    xp: 14,

                    ability:
                        "dive"

                }),


            goblin:
                Object.freeze({

                    id:
                        "goblin",

                    name:
                        "Goblin",

                    spriteType:
                        "goblin",

                    hp: 62,

                    damage: 13,

                    defense: 4,

                    speed: 116,

                    radius: 19,

                    xp: 19,

                    ability:
                        "quickStrike"

                }),


            voidSpider:
                Object.freeze({

                    id:
                        "voidSpider",

                    name:
                        "Aranha do Vazio",

                    spriteType:
                        "voidSpider",

                    hp: 92,

                    damage: 19,

                    defense: 7,

                    speed: 140,

                    radius: 20,

                    xp: 34,

                    ability:
                        "voidWeb"

                }),


            voidGoblin:
                Object.freeze({

                    id:
                        "voidGoblin",

                    name:
                        "Goblin Sombrio",

                    spriteType:
                        "voidGoblin",

                    hp: 105,

                    damage: 21,

                    defense: 8,

                    speed: 128,

                    radius: 20,

                    xp: 37,

                    ability:
                        "shadowStrike"

                }),


            voidStalker:
                Object.freeze({

                    id:
                        "voidStalker",

                    name:
                        "Perseguidor do Vazio",

                    spriteType:
                        "voidStalker",

                    hp: 125,

                    damage: 24,

                    defense: 9,

                    speed: 145,

                    radius: 21,

                    xp: 43,

                    ability:
                        "voidBlink"

                })

        });


    /* ============================================================
       BOSSES

       Descrições são usadas no Livro SOMENTE
       quando derrotados.
       ============================================================ */

    const BOSS_REGISTRY =
        Object.freeze({

            road_guardian:
                Object.freeze({

                    id:
                        "road_guardian",

                    name:
                        "GUARDIÃO DA ESTRADA",

                    subtitle:
                        "Sentinela do Primeiro Caminho",

                    icon:
                        "⚔",

                    progression:
                        true,

                    topBar:
                        true,

                    initialState:
                        BOSS_STATE.NEUTRAL,

                    /*
                        CRÍTICO:

                        Guardião NÃO pode ser agressivo
                        antes de ACEITAR.
                    */
                    requiresConfirmation:
                        true,

                    blocksPassageWhileNeutral:
                        true,

                    hp:
                        420,

                    damage:
                        18,

                    defense:
                        8,

                    speed:
                        102,

                    radius:
                        43,

                    color:
                        "#555b5e",

                    aura:
                        "#acb0ad",

                    description:
                        "Uma antiga sentinela que permaneceu na Estrada mesmo quando a própria razão de sua vigília começou a desaparecer."

                }),


            forest_warden:
                Object.freeze({

                    id:
                        "forest_warden",

                    name:
                        "VIGIA DA FLORESTA",

                    icon:
                        "🌲",

                    progression:
                        true,

                    topBar:
                        true,

                    initialState:
                        BOSS_STATE.NEUTRAL,

                    requiresConfirmation:
                        true,

                    hp:
                        590,

                    damage:
                        22,

                    defense:
                        10,

                    speed:
                        112,

                    radius:
                        46,

                    color:
                        "#3f6747",

                    aura:
                        "#78a26f",

                    description:
                        "Uma criatura moldada pela própria floresta, encarregada de impedir que viajantes avancem até as raízes mais antigas."

                }),


            grove_heart:
                Object.freeze({

                    id:
                        "grove_heart",

                    name:
                        "CORAÇÃO DO BOSQUE",

                    icon:
                        "🌿",

                    progression:
                        true,

                    topBar:
                        true,

                    initialState:
                        BOSS_STATE.NEUTRAL,

                    requiresConfirmation:
                        true,

                    hp:
                        760,

                    damage:
                        25,

                    defense:
                        13,

                    speed:
                        82,

                    radius:
                        52,

                    bodyStyle:
                        "groveHeart",

                    color:
                        "#536c43",

                    aura:
                        "#91a66e",

                    description:
                        "Uma manifestação viva das memórias enterradas nas raízes do Bosque."

                }),


            mountain_titan:
                Object.freeze({

                    id:
                        "mountain_titan",

                    name:
                        "TITÃ DA MONTANHA",

                    icon:
                        "⛰",

                    progression:
                        true,

                    topBar:
                        true,

                    initialState:
                        BOSS_STATE.NEUTRAL,

                    requiresConfirmation:
                        true,

                    hp:
                        940,

                    damage:
                        29,

                    defense:
                        17,

                    speed:
                        77,

                    radius:
                        57,

                    bodyStyle:
                        "titan",

                    color:
                        "#696d6b",

                    aura:
                        "#b3b8b5",

                    description:
                        "Um colosso de pedra cuja presença faz a própria montanha parecer despertar."

                }),


            iron_colossus:
                Object.freeze({

                    id:
                        "iron_colossus",

                    name:
                        "COLOSSO DE FERRO",

                    icon:
                        "⛓",

                    progression:
                        true,

                    topBar:
                        true,

                    initialState:
                        BOSS_STATE.NEUTRAL,

                    requiresConfirmation:
                        true,

                    hp:
                        1180,

                    damage:
                        34,

                    defense:
                        24,

                    speed:
                        72,

                    radius:
                        61,

                    bodyStyle:
                        "colossus",

                    color:
                        "#555a5c",

                    aura:
                        "#adb5b8",

                    description:
                        "Uma máquina antiga coberta por minério e ferrugem, ainda obedecendo a uma ordem que ninguém mais recorda."

                }),


            ruby_chimera:
                Object.freeze({

                    id:
                        "ruby_chimera",

                    name:
                        "QUIMERA DE RUBI",

                    icon:
                        "♦",

                    progression:
                        true,

                    topBar:
                        true,

                    initialState:
                        BOSS_STATE.NEUTRAL,

                    requiresConfirmation:
                        true,

                    hp:
                        1440,

                    damage:
                        39,

                    defense:
                        27,

                    speed:
                        118,

                    radius:
                        62,

                    bodyStyle:
                        "rubyChimera",

                    color:
                        "#873d4c",

                    aura:
                        "#d96c7e",

                    description:
                        "Uma aberração formada por carne, cristal e energia mineral instável."

                }),


            monarch:
                Object.freeze({

                    id:
                        "monarch",

                    name:
                        "O MONARCA",

                    icon:
                        "♛",

                    progression:
                        true,

                    topBar:
                        true,

                    initialState:
                        BOSS_STATE.NEUTRAL,

                    requiresConfirmation:
                        true,

                    hp:
                        1850,

                    damage:
                        44,

                    defense:
                        31,

                    speed:
                        123,

                    radius:
                        60,

                    color:
                        "#483d55",

                    aura:
                        "#ab89bd",

                    description:
                        "O soberano adormecido além do Labirinto. Sua presença reage às oferendas do altar e às memórias que deveriam permanecer enterradas."

                }),


            ancient_deer:
                Object.freeze({

                    id:
                        "ancient_deer",

                    name:
                        "CERVO ANCESTRAL",

                    icon:
                        "🦌",

                    progression:
                        false,

                    topBar:
                        false,

                    initialState:
                        BOSS_STATE.NEUTRAL,

                    requiresConfirmation:
                        false,

                    hp:
                        620,

                    damage:
                        22,

                    defense:
                        11,

                    speed:
                        150,

                    radius:
                        46,

                    bodyStyle:
                        "ancientDeer",

                    color:
                        "#6c6a52",

                    aura:
                        "#c5b785",

                    description:
                        "Uma criatura ancestral que percorre regiões esquecidas e guarda recursos raros."

                }),


            path_guardian:
                Object.freeze({

                    id:
                        "path_guardian",

                    name:
                        "GUARDIÃO DO CAMINHO",

                    icon:
                        "☁",

                    progression:
                        true,

                    topBar:
                        true,

                    initialState:
                        BOSS_STATE.NEUTRAL,

                    requiresConfirmation:
                        true,

                    hp:
                        2260,

                    damage:
                        51,

                    defense:
                        35,

                    speed:
                        155,

                    radius:
                        61,

                    color:
                        "#c3c5c2",

                    aura:
                        "#eedca9",

                    description:
                        "Uma entidade celestial que vigia o Caminho e põe à prova aqueles que aprenderam a dominar o Dash."

                }),


            hell_guardian:
                Object.freeze({

                    id:
                        "hell_guardian",

                    name:
                        "GUARDIÃO INFERNAL",

                    icon:
                        "♨",

                    progression:
                        true,

                    topBar:
                        true,

                    initialState:
                        BOSS_STATE.NEUTRAL,

                    requiresConfirmation:
                        true,

                    hp:
                        2650,

                    damage:
                        57,

                    defense:
                        39,

                    speed:
                        140,

                    radius:
                        65,

                    color:
                        "#71342f",

                    aura:
                        "#ce6350",

                    description:
                        "Uma presença hostil ligada às regiões além da passagem revelada pela Flauta da Memória."

                }),


            vaelkor:
                Object.freeze({

                    id:
                        "vaelkor",

                    name:
                        "VAELKOR",

                    subtitle:
                        "O GUARDIÃO DO VAZIO",

                    icon:
                        "◈",

                    progression:
                        false,

                    secret:
                        true,

                    topBar:
                        true,

                    /*
                        Vaelkor começa via cutscene.
                    */
                    initialState:
                        BOSS_STATE.DORMANT,

                    requiresConfirmation:
                        false,

                    centerLocked:
                        true,

                    hp:
                        3300,

                    damage:
                        54,

                    defense:
                        34,

                    speed:
                        0,

                    radius:
                        57,

                    color:
                        "#221b29",

                    aura:
                        "#875f9b",

                    description:
                        "Guardião de uma antiga provação selada no Vazio. Vaelkor não caça seus oponentes: ele transforma a própria arena em uma arma.",


                    transition:
                        Object.freeze({

                            dialogue:
                                Object.freeze([

                                    "Você aprendeu a fugir...",

                                    "Agora mostre-me se consegue sobreviver."

                                ])

                        }),


                    attacks:
                        Object.freeze({

                            voidBarrage:
                                Object.freeze({

                                    telegraph:
                                        0.72,

                                    baseOrbCount:
                                        9,

                                    phaseTwoOrbCount:
                                        13,

                                    projectileSpeed:
                                        245,

                                    damage:
                                        23

                                }),


                            voidBeam:
                                Object.freeze({

                                    telegraph:
                                        1.15,

                                    phaseTwoTelegraph:
                                        0.82,

                                    width:
                                        90,

                                    length:
                                        1350,

                                    duration:
                                        0.42,

                                    damage:
                                        47

                                }),


                            shadowSummon:
                                Object.freeze({

                                    telegraph:
                                        0.85,

                                    phaseOneCount:
                                        2,

                                    phaseTwoCount:
                                        3

                                })

                        })

                })

        });


    function getBossDefinition(
        bossId
    ) {
        return (
            BOSS_REGISTRY[
                bossId
            ] ||
            null
        );
    }


    /* ============================================================
       BOSS BOOK

       DESCRIÇÃO SÓ DEPOIS DA MORTE.
       ============================================================ */

    function isBossDefeated(
        bossId,
        player =
            state.player
    ) {
        if (!player) {
            return false;
        }

        return safeArray(
            player.defeatedBosses
        )
            .includes(
                bossId
            );
    }


    function isBossDiscovered(
        bossId,
        player =
            state.player
    ) {
        if (!player) {
            return false;
        }

        return (
            isBossDefeated(
                bossId,
                player
            ) ||
            safeArray(
                player.discoveredBosses
            )
                .includes(
                    bossId
                )
        );
    }


    function getBossBookDescription(
        bossId,
        player =
            state.player
    ) {
        const definition =
            getBossDefinition(
                bossId
            );

        if (!definition) {
            return "";
        }

        if (
            !isBossDefeated(
                bossId,
                player
            )
        ) {
            return "";
        }

        return (
            definition.description ||
            ""
        );
    }


    function registerBossDiscovered(
        bossId
    ) {
        const player =
            state.player;

        if (!player) {
            return;
        }

        player.discoveredBosses =
            uniqueArray([
                ...safeArray(
                    player.discoveredBosses
                ),
                bossId
            ]);
    }


    function registerBossDefeated(
        bossId
    ) {
        const player =
            state.player;

        if (!player) {
            return;
        }

        registerBossDiscovered(
            bossId
        );

        player.defeatedBosses =
            uniqueArray([
                ...safeArray(
                    player.defeatedBosses
                ),
                bossId
            ]);
    }


    /* ============================================================
       ESTADO DE BOSS

       CAMADA DUPLA DE SEGURANÇA:

       1. IA não ativa.
       2. dano não é autorizado.

       Isso evita o Guardião atacar antes
       do jogador aceitar.
       ============================================================ */

    function canBossBecomeAggressive(
        boss
    ) {
        if (
            !boss ||
            boss.dead
        ) {
            return false;
        }

        if (
            isBossDefeated(
                boss.id
            )
        ) {
            return false;
        }

        const definition =
            getBossDefinition(
                boss.id
            );

        if (!definition) {
            return true;
        }

        if (
            definition
                .requiresConfirmation
        ) {
            return Boolean(
                boss.confirmed
            );
        }

        return true;
    }


    function canBossDamagePlayer(
        boss
    ) {
        if (
            !canBossBecomeAggressive(
                boss
            )
        ) {
            return false;
        }

        return (
            boss.state ===
                BOSS_STATE.COMBAT ||
            boss.state ===
                BOSS_STATE.PHASE_TRANSITION
        );
    }


    function canPlayerDamageBoss(
        boss
    ) {
        if (
            !boss ||
            boss.dead ||
            isBossDefeated(
                boss.id
            )
        ) {
            return false;
        }

        const definition =
            getBossDefinition(
                boss.id
            );

        if (
            definition
                ?.requiresConfirmation &&
            !boss.confirmed
        ) {
            return false;
        }

        if (
            boss.state ===
                BOSS_STATE.NEUTRAL
        ) {
            return false;
        }

        if (
            boss.state ===
                BOSS_STATE.DORMANT
        ) {
            return false;
        }

        if (
            boss.state ===
                BOSS_STATE.DYING
        ) {
            return false;
        }

        return true;
    }


    function activateBossCombat(
        boss
    ) {
        if (!boss) {
            return false;
        }

        if (
            isBossDefeated(
                boss.id
            )
        ) {
            return false;
        }

        const definition =
            getBossDefinition(
                boss.id
            );

        if (
            definition
                ?.requiresConfirmation &&
            !boss.confirmed
        ) {
            return false;
        }

        boss.state =
            BOSS_STATE.COMBAT;

        boss.aggro =
            true;

        return true;
    }


    function confirmBossBattle(
        boss
    ) {
        if (
            !boss ||
            boss.dead ||
            isBossDefeated(
                boss.id
            )
        ) {
            return false;
        }

        boss.confirmed =
            true;

        boss.state =
            BOSS_STATE.CONFIRMED;

        return activateBossCombat(
            boss
        );
    }


    /* ============================================================
       STATE GLOBAL
       ============================================================ */

    const state = {

        running:
            false,

        paused:
            false,

        time:
            0,

        lastTime:
            0,


        area:
            "village",

        world:
            null,


        houseMode:
            false,

        currentHouse:
            null,

        houseReturn:
            null,


        selectedCharacter:
            null,


        player:
            null,


        camera: {

            x:
                PLAYER_HOME_SPAWN.x,

            y:
                PLAYER_HOME_SPAWN.y,

            targetX:
                PLAYER_HOME_SPAWN.x,

            targetY:
                PLAYER_HOME_SPAWN.y

        },


        pointer: {

            x: 0,
            y: 0,

            screenX: 0,
            screenY: 0,

            worldX: 0,
            worldY: 0,

            down:
                false

        },


        keys:
            new Set(),


        dialogue:
            null,


        travel:
            null,


        battle:
            null,


        activePanel:
            null,


        shopNPC:
            null,

        shopMode:
            "buy",


        holdAction:
            null,


        cutscene:
            null,

        cutsceneQueue:
            [],


        fragmentMinigame:
            null,


        deathState:
            null,


        bossBarTarget:
            null,


        notifications:
            [],


        itemPresentation:
            null,


        bloodMarks:
            [],


        screenShake:
            0,

        screenShakePower:
            0,


        damageFlash:
            0,


        darknessWarningAt:
            -999,


        dev:
            null

    };


    /* ============================================================
       PLAYER FACTORY
       ============================================================ */

    function createNewPlayer(
        name,
        characterId
    ) {
        const character =
            getCharacterById(
                characterId
            );

        if (!character) {
            throw new Error(
                `Personagem inválido: ${characterId}`
            );
        }

        const player = {

            name:
                String(
                    name ||
                    character.name
                )
                    .trim()
                    .slice(
                        0,
                        16
                    ),

            characterId:
                character.id,


            /*
                SPAWN CORRIGIDO.

                Não usar centro da vila.
            */
            x:
                PLAYER_HOME_SPAWN.x,

            y:
                PLAYER_HOME_SPAWN.y,

            facing:
                PLAYER_HOME_SPAWN.facing,


            radius:
                GAME_CONFIG
                    .playerBaseRadius,


            level:
                1,

            xp:
                0,

            xpToNext:
                100,


            /*
                Level 1 começa sem pontos extras.
                Cada novo level dá +3.
            */
            statPoints:
                0,


            stats: {

                power:
                    0,

                energy:
                    0,

                hunger:
                    0,

                fatigue:
                    0

            },


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


            hunger:
                100,

            maxHunger:
                100,


            fatigue:
                100,

            maxFatigue:
                100,


            damage:
                character.damage,

            defense:
                character.defense,

            speed:
                character.speed,


            money:
                60,


            inventory: {},


            inventoryWeightLimit:
                100,


            equipment: {

                weapon:
                    null,

                armor:
                    null

            },


            armorHighestTierEver:
                0,


            purchasedUniqueItems:
                [],


            defeatedBosses:
                [],

            discoveredBosses:
                [],


            unlockedAreas: [
                "village"
            ],


            discoveredMapLocations: [
                "village"
            ],


            abilities: {

                dashV1:
                    false,

                dashV2:
                    false

            },


            universalDashCooldown:
                0,

            dashRuntime:
                null,


            skillCooldowns: {

                q:
                    0,

                r:
                    0,

                f:
                    0

            },


            activePotionBuffs:
                [],

            classBuffs:
                [],


            attackCooldown:
                0,


            hurtAnim:
                0,

            invincible:
                0,


            movementSlowTimer:
                0,

            movementSlowMultiplier:
                1,


            poisonEffect:
                null,


            dead:
                false,


            resting: {

                active:
                    false,

                timer:
                    0,

                duration:
                    0

            },


            minimapOwned:
                false,

            lanternOwned:
                false,


            gateUnlocks: {

                north:
                    false

            },


            gateDialogueIndex: {

                north:
                    0

            },


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


            monarchDefeated:
                false,


            quest: {

                wood: {

                    state:
                        QUEST_STATE
                            .NOT_STARTED,

                    rewarded:
                        false

                },

                coal: {

                    state:
                        QUEST_STATE
                            .NOT_STARTED,

                    rewarded:
                        false

                }

            },


            miguelQuest:
                createMiguelQuestState(),


            /*
                Visual do personagem é ligado
                ao perfil, não ao Kaelion.
            */
            visual: {

                profileId:
                    character.id,

                walkTime:
                    0,

                attackTime:
                    0,

                idleTime:
                    0

            }

        };


        recalculatePlayerStats(
            player,
            {
                fillResources: true
            }
        );


        return player;
    }


    /* ============================================================
       RECALCULAR PLAYER

       LEVEL NÃO AUMENTA ATRIBUTOS.
       ============================================================ */

    function recalculatePlayerStats(
        player =
            state.player,
        options = {}
    ) {
        if (!player) {
            return;
        }

        const character =
            getCharacterById(
                player.characterId
            );

        if (!character) {
            return;
        }

        const previousMaxHp =
            Math.max(
                1,
                finiteNumber(
                    player.maxHp,
                    character.hp
                )
            );

        const previousHp =
            finiteNumber(
                player.hp,
                previousMaxHp
            );

        const hpRatio =
            clamp(
                previousHp /
                previousMaxHp,
                0,
                1
            );


        const power =
            clamp(
                integer(
                    player.stats
                        ?.power,
                    0
                ),
                0,
                STAT_CAP
            );

        const energy =
            clamp(
                integer(
                    player.stats
                        ?.energy,
                    0
                ),
                0,
                STAT_CAP
            );

        const hunger =
            clamp(
                integer(
                    player.stats
                        ?.hunger,
                    0
                ),
                0,
                STAT_CAP
            );

        const fatigue =
            clamp(
                integer(
                    player.stats
                        ?.fatigue,
                    0
                ),
                0,
                STAT_CAP
            );


        const armorId =
            player.equipment
                ?.armor;

        const armor =
            armorId
                ? ARMOR_DATA[
                    armorId
                ]
                : null;


        const weaponId =
            player.equipment
                ?.weapon;

        const weapon =
            weaponId
                ? ITEMS[
                    weaponId
                ]
                : null;


        /*
            HP só depende:
            - personagem
            - armadura

            NUNCA level/status.
        */
        player.maxHp =
            character.hp +
            (
                armor?.hp ||
                0
            );


        player.maxMagic =
            character.magic +
            power *
            4;


        player.maxEnergy =
            character.energy +
            energy *
            5;


        player.maxHunger =
            100 +
            hunger *
            3;


        player.maxFatigue =
            100 +
            fatigue *
            3;


        const weaponDamage =
            finiteNumber(
                weapon?.damage,
                0
            );


        player.damage =
            (
                character.damage +
                weaponDamage
            ) *
            (
                1 +
                power *
                0.02
            );


        let defenseMultiplier =
            1;


        let speedMultiplier =
            1;


        for (
            const buff of
            safeArray(
                player.activePotionBuffs
            )
        ) {
            if (
                buff.type ===
                "defense"
            ) {
                defenseMultiplier *=
                    finiteNumber(
                        buff.multiplier,
                        1
                    );
            }

            if (
                buff.type ===
                "speed"
            ) {
                speedMultiplier *=
                    finiteNumber(
                        buff.multiplier,
                        1
                    );
            }
        }


        player.defense =
            (
                character.defense +
                (
                    armor?.defense ||
                    0
                )
            ) *
            defenseMultiplier;


        /*
            Velocidade não recebe status.
        */
        player.speed =
            character.speed *
            speedMultiplier;


        if (
            options.fillResources
        ) {
            player.hp =
                player.maxHp;

            player.magic =
                player.maxMagic;

            player.energy =
                player.maxEnergy;

            player.hunger =
                player.maxHunger;

            player.fatigue =
                player.maxFatigue;

            return;
        }


        /*
            Evita exploit de heal trocando armadura.

            Preservamos proporção de HP.
        */
        player.hp =
            clamp(
                player.maxHp *
                hpRatio,
                0,
                player.maxHp
            );


        player.magic =
            clamp(
                player.magic,
                0,
                player.maxMagic
            );


        player.energy =
            clamp(
                player.energy,
                0,
                player.maxEnergy
            );


        player.hunger =
            clamp(
                player.hunger,
                0,
                player.maxHunger
            );


        player.fatigue =
            clamp(
                player.fatigue,
                0,
                player.maxFatigue
            );
    }


    /* ============================================================
       LEVEL UP

       EXATAMENTE +3.
       ============================================================ */

    function getXpRequiredForLevel(
        level
    ) {
        return Math.floor(
            100 +
            Math.pow(
                Math.max(
                    0,
                    level - 1
                ),
                1.24
            ) *
            44
        );
    }


    function grantXP(
        amount
    ) {
        const player =
            state.player;

        if (
            !player ||
            player.level >=
                MAX_LEVEL
        ) {
            return false;
        }

        player.xp +=
            Math.max(
                0,
                finiteNumber(
                    amount,
                    0
                )
            );


        let leveledUp =
            false;


        while (
            player.level <
                MAX_LEVEL &&
            player.xp >=
                player.xpToNext
        ) {
            player.xp -=
                player.xpToNext;

            player.level +=
                1;

            /*
                REGRA DEFINITIVA:
                +3 por level.
            */
            player.statPoints +=
                STATUS_POINTS_PER_LEVEL;

            player.xpToNext =
                getXpRequiredForLevel(
                    player.level
                );

            leveledUp =
                true;
        }


        if (
            player.level >=
            MAX_LEVEL
        ) {
            player.level =
                MAX_LEVEL;

            player.xp =
                0;

            player.xpToNext =
                0;
        }


        if (
            leveledUp &&
            typeof pushNotification ===
                "function"
        ) {
            pushNotification(
                "NÍVEL AUMENTADO",
                `+${STATUS_POINTS_PER_LEVEL} pontos de status disponíveis.`,
                "success",
                4
            );
        }


        /*
            NÃO chamar fórmula que dê bônus
            automático baseado no nível.
        */
        recalculatePlayerStats();


        return leveledUp;
    }


    /* ============================================================
       INVENTÁRIO
       ============================================================ */

    function getRealItemCount(
        itemId,
        player =
            state.player
    ) {
        if (!player) {
            return 0;
        }

        return Math.max(
            0,
            integer(
                player.inventory
                    ?.[itemId],
                0
            )
        );
    }


    function getItemCount(
        itemId,
        player =
            state.player
    ) {
        if (!player) {
            return 0;
        }

        if (
            state.dev
                ?.unlocked &&
            state.dev
                .cheats
                .infiniteMaterials &&
            ITEMS[
                itemId
            ]?.category ===
                "materials"
        ) {
            return 999999;
        }

        return getRealItemCount(
            itemId,
            player
        );
    }


    function getInventoryWeight(
        player =
            state.player
    ) {
        if (!player) {
            return 0;
        }

        let total =
            0;

        for (
            const [
                itemId,
                amount
            ] of
            Object.entries(
                player.inventory
            )
        ) {
            const item =
                ITEMS[
                    itemId
                ];

            if (!item) {
                continue;
            }

            total +=
                finiteNumber(
                    item.weight,
                    0
                ) *
                Math.max(
                    0,
                    finiteNumber(
                        amount,
                        0
                    )
                );
        }

        return total;
    }


    function canCarryItem(
        itemId,
        amount = 1,
        player =
            state.player
    ) {
        if (!player) {
            return false;
        }

        const item =
            ITEMS[
                itemId
            ];

        if (!item) {
            return false;
        }

        if (
            item.unique &&
            getRealItemCount(
                itemId,
                player
            ) >
                0
        ) {
            return false;
        }

        const addedWeight =
            finiteNumber(
                item.weight,
                0
            ) *
            Math.max(
                0,
                finiteNumber(
                    amount,
                    0
                )
            );

        return (
            getInventoryWeight(
                player
            ) +
            addedWeight <=
            player.inventoryWeightLimit +
            0.001
        );
    }


    function addItem(
        itemId,
        amount = 1,
        options = {}
    ) {
        const player =
            state.player;

        const item =
            ITEMS[
                itemId
            ];

        if (
            !player ||
            !item
        ) {
            return false;
        }

        const safeAmount =
            Math.max(
                1,
                integer(
                    amount,
                    1
                )
            );


        if (
            item.unique &&
            getRealItemCount(
                itemId
            ) >
                0
        ) {
            return false;
        }


        if (
            !canCarryItem(
                itemId,
                safeAmount
            )
        ) {
            if (
                !options.silent &&
                typeof showToast ===
                    "function"
            ) {
                showToast(
                    "Inventário cheio.",
                    "warning"
                );
            }

            return false;
        }


        player.inventory[
            itemId
        ] =
            getRealItemCount(
                itemId
            ) +
            safeAmount;


        if (
            item.unique
        ) {
            player.inventory[
                itemId
            ] =
                1;
        }


        return true;
    }


    function removeItem(
        itemId,
        amount = 1
    ) {
        const player =
            state.player;

        if (!player) {
            return false;
        }

        const safeAmount =
            Math.max(
                1,
                integer(
                    amount,
                    1
                )
            );


        /*
            Cheat de materiais:
            sistema se comporta como se gastasse,
            mas não remove.
        */
        if (
            state.dev
                ?.unlocked &&
            state.dev
                .cheats
                .infiniteMaterials &&
            ITEMS[
                itemId
            ]?.category ===
                "materials"
        ) {
            return true;
        }


        const current =
            getRealItemCount(
                itemId
            );

        if (
            current <
            safeAmount
        ) {
            return false;
        }


        const remaining =
            current -
            safeAmount;


        if (
            remaining <=
            0
        ) {
            delete player.inventory[
                itemId
            ];
        } else {
            player.inventory[
                itemId
            ] =
                remaining;
        }


        return true;
    }


    /* ============================================================
       MONEY
       ============================================================ */

    function hasEnoughMoney(
        amount
    ) {
        if (
            state.dev
                ?.unlocked &&
            state.dev
                .cheats
                .infiniteMoney
        ) {
            return true;
        }

        return (
            finiteNumber(
                state.player
                    ?.money,
                0
            ) >=
            Math.max(
                0,
                amount
            )
        );
    }


    function spendMoney(
        amount
    ) {
        const player =
            state.player;

        if (!player) {
            return false;
        }

        const safeAmount =
            Math.max(
                0,
                integer(
                    amount,
                    0
                )
            );

        if (
            state.dev
                ?.unlocked &&
            state.dev
                .cheats
                .infiniteMoney
        ) {
            return true;
        }

        if (
            player.money <
            safeAmount
        ) {
            return false;
        }

        player.money -=
            safeAmount;

        return true;
    }


    function addMoney(
        amount
    ) {
        const player =
            state.player;

        if (!player) {
            return false;
        }

        player.money =
            Math.max(
                0,
                integer(
                    player.money,
                    0
                ) +
                Math.max(
                    0,
                    integer(
                        amount,
                        0
                    )
                )
            );

        return true;
    }


    function getMoneyDisplay() {
        if (
            state.dev
                ?.unlocked &&
            state.dev
                .cheats
                .infiniteMoney
        ) {
            return "∞";
        }

        return String(
            Math.max(
                0,
                integer(
                    state.player
                        ?.money,
                    0
                )
            )
        );
    }


    /* ============================================================
       ARMADURAS
       ============================================================ */

    function playerOwnsArmor(
        armorId,
        player =
            state.player
    ) {
        if (
            !armorId ||
            !player
        ) {
            return false;
        }

        return (
            getRealItemCount(
                armorId,
                player
            ) >
                0 ||
            player.equipment
                ?.armor ===
                armorId
        );
    }


    function getHighestOwnedArmorTier(
        player =
            state.player
    ) {
        if (!player) {
            return 0;
        }

        let highest =
            Math.max(
                0,
                integer(
                    player
                        .armorHighestTierEver,
                    0
                )
            );

        for (
            const armorId of
            ARMOR_PROGRESSION
        ) {
            const armor =
                ARMOR_DATA[
                    armorId
                ];

            if (
                playerOwnsArmor(
                    armorId,
                    player
                )
            ) {
                highest =
                    Math.max(
                        highest,
                        armor.tier
                    );
            }
        }

        return highest;
    }


    function getNextArmorUpgradeId(
        player =
            state.player
    ) {
        if (!player) {
            return null;
        }

        const highest =
            getHighestOwnedArmorTier(
                player
            );

        const nextTier =
            highest +
            1;

        const armor =
            Object.values(
                ARMOR_DATA
            )
                .find(
                    entry =>
                        entry.tier ===
                        nextTier
                );

        return (
            armor?.id ||
            null
        );
    }


    function isArmorNextUpgrade(
        armorId,
        player =
            state.player
    ) {
        return (
            getNextArmorUpgradeId(
                player
            ) ===
            armorId
        );
    }


    function equipArmor(
        armorId
    ) {
        const player =
            state.player;

        if (
            !player ||
            !ARMOR_DATA[
                armorId
            ] ||
            !playerOwnsArmor(
                armorId
            )
        ) {
            return false;
        }

        player.equipment.armor =
            armorId;

        recalculatePlayerStats();

        return true;
    }


    function equipWeapon(
        weaponId
    ) {
        const player =
            state.player;

        const item =
            ITEMS[
                weaponId
            ];

        if (
            !player ||
            !item ||
            item.category !==
                "weapons" ||
            getRealItemCount(
                weaponId
            ) <=
                0
        ) {
            return false;
        }

        player.equipment.weapon =
            weaponId;

        recalculatePlayerStats();

        return true;
    }


    /* ============================================================
       DASH
       ============================================================ */

    function getDashVersion(
        player =
            state.player
    ) {
        if (!player) {
            return 0;
        }

        if (
            player.abilities
                ?.dashV2
        ) {
            return 2;
        }

        if (
            player.abilities
                ?.dashV1
        ) {
            return 1;
        }

        return 0;
    }


    function getDashConfig(
        player =
            state.player
    ) {
        const version =
            getDashVersion(
                player
            );

        if (
            version ===
            2
        ) {
            return DASH_CONFIG.v2;
        }

        if (
            version ===
            1
        ) {
            return DASH_CONFIG.v1;
        }

        return null;
    }


    function unlockDashV1() {
        const player =
            state.player;

        if (!player) {
            return false;
        }

        if (
            player.abilities
                .dashV2
        ) {
            return false;
        }

        player.abilities.dashV1 =
            true;

        player.miguelQuest
            .missionAvailable =
            true;

        if (
            player.miguelQuest
                .stage ===
                MIGUEL_QUEST_STAGE
                    .LOCKED
        ) {
            player.miguelQuest
                .stage =
                MIGUEL_QUEST_STAGE
                    .AVAILABLE;
        }

        return true;
    }


    function unlockDashV2() {
        const player =
            state.player;

        if (!player) {
            return false;
        }

        if (
            player.abilities
                .dashV2
        ) {
            return false;
        }

        /*
            SUBSTITUI V1.
        */
        player.abilities.dashV1 =
            false;

        player.abilities.dashV2 =
            true;

        player.miguelQuest.completed =
            true;

        player.miguelQuest
            .fragmentDelivered =
            true;

        player.miguelQuest
            .trackerVisible =
            false;

        player.miguelQuest.stage =
            MIGUEL_QUEST_STAGE
                .COMPLETE;

        return true;
    }


    /* ============================================================
       MISSÃO MIGUEL
       ============================================================ */

    function canOfferMiguelQuest(
        player =
            state.player
    ) {
        if (!player) {
            return false;
        }

        const quest =
            player.miguelQuest;

        if (
            quest.completed ||
            quest.missionAccepted
        ) {
            return false;
        }

        return (
            getDashVersion(
                player
            ) >=
            1
        );
    }


    function acceptMiguelQuest() {
        const player =
            state.player;

        if (
            !player ||
            !canOfferMiguelQuest(
                player
            )
        ) {
            return false;
        }

        const quest =
            player.miguelQuest;

        quest.missionAvailable =
            true;

        quest.missionAccepted =
            true;

        quest.stage =
            MIGUEL_QUEST_STAGE
                .FIND_DARK_KEY;

        quest.trackerVisible =
            true;

        quest.trackerObjective =
            "Encontre a chave escondida no Caminho 2.";

        quest.objectiveRevision +=
            1;

        return true;
    }


    function getMiguelQuestObjective(
        quest =
            state.player
                ?.miguelQuest
    ) {
        if (!quest) {
            return "";
        }

        switch (
            quest.stage
        ) {
            case MIGUEL_QUEST_STAGE
                .FIND_DARK_KEY:
                return "Encontre a chave escondida no Caminho 2.";


            case MIGUEL_QUEST_STAGE
                .KEY_FOUND_NEEDS_ESSENCE:
                return `Colete ${VOID_MISSION_CONFIG.shadowEssenceRequired} Essências Sombrias.`;


            case MIGUEL_QUEST_STAGE
                .RETURN_PATH_ONE:
            case MIGUEL_QUEST_STAGE
                .OPEN_SECRET_DOOR:
                return "Procure uma passagem trancada no Caminho 1.";


            case MIGUEL_QUEST_STAGE
                .EXPLORE_DUNGEON:
                return "Explore a Área Secreta do Vazio.";


            case MIGUEL_QUEST_STAGE
                .DEFEAT_VAELKOR:
                return "Derrote Vaelkor, o Guardião do Vazio.";


            case MIGUEL_QUEST_STAGE
                .COLLECT_FRAGMENT:
                return "Obtenha o Fragmento do Vazio.";


            case MIGUEL_QUEST_STAGE
                .RETURN_TO_MIGUEL:
                return "Retorne para Miguel.";


            case MIGUEL_QUEST_STAGE
                .COMPLETE:
                return "Missão concluída.";


            default:
                return "";
        }
    }


    function updateMiguelQuestObjective(
        stage,
        text
    ) {
        const quest =
            state.player
                ?.miguelQuest;

        if (!quest) {
            return;
        }

        quest.stage =
            stage;

        quest.trackerObjective =
            text ||
            getMiguelQuestObjective(
                quest
            );

        quest.objectiveRevision +=
            1;
    }


    function getMiguelDialogueForCurrentState() {
        const player =
            state.player;

        if (!player) {
            return [];
        }

        const quest =
            player.miguelQuest;


        if (
            quest.completed ||
            player.abilities.dashV2
        ) {
            const lines =
                NPC_DIALOGUES
                    .miguel
                    .completed;

            const seed =
                hashStringToSeed(
                    `${player.name}_${player.level}`
                );

            return [
                lines[
                    seed %
                    lines.length
                ]
            ];
        }


        if (
            quest.fragmentCollected &&
            !quest.fragmentDelivered
        ) {
            return NPC_DIALOGUES
                .miguel
                .fragmentReturn;
        }


        if (
            !getDashVersion(
                player
            )
        ) {
            return NPC_DIALOGUES
                .miguel
                .beforeDash;
        }


        if (
            !quest.missionAccepted
        ) {
            return NPC_DIALOGUES
                .miguel
                .offerQuest;
        }


        if (
            quest.keyCollected &&
            !quest.secretDoorOpened
        ) {
            return NPC_DIALOGUES
                .miguel
                .keyFound;
        }


        if (
            quest.dungeonDiscovered &&
            !quest.vaelkorDefeated
        ) {
            return NPC_DIALOGUES
                .miguel
                .dungeon;
        }


        return NPC_DIALOGUES
            .miguel
            .afterAccept;
    }


    /* ============================================================
       NOTIFICAÇÕES
       ============================================================ */

    function pushNotification(
        title,
        text = "",
        type = "info",
        duration = 3
    ) {
        state.notifications.push({

            id:
                `notification_${Date.now()}_${Math.random()}`,

            title:
                String(
                    title ||
                    ""
                ),

            text:
                String(
                    text ||
                    ""
                ),

            type,

            timer:
                Math.max(
                    0.2,
                    duration
                ),

            maxTimer:
                Math.max(
                    0.2,
                    duration
                )

        });

        if (
            state.notifications.length >
            8
        ) {
            state.notifications.splice(
                0,
                state.notifications.length -
                8
            );
        }
    }


    /* ============================================================
       DEV / COMANDOS DE TESTE

       REFEITO PARA NÃO DEPENDER DO LOOP DO JOGO.

       X + Y deve funcionar inclusive no menu,
       desde que o foco NÃO esteja num input.
       ============================================================ */

    const DEV_STORAGE = Object.freeze({

        passwordHash:
            "veyra_dev_password_hash_v2",

        remember:
            "veyra_dev_remember_v2",

        unlocked:
            "veyra_dev_unlocked_v2",

        privacy:
            "veyra_dev_privacy_v2"

    });


    function createDevRuntime() {
        return {

            panel:
                null,

            passwordInput:
                null,

            statusElement:
                null,


            setupMode:
                false,


            unlocked:
                false,


            sessionUnlocked:
                false,


            rememberAccess:
                false,


            privacy:
                true,


            heldKeys:
                new Set(),


            comboLatch: {

                xy:
                    false,

                x1:
                    false,

                x2:
                    false,

                x3:
                    false,

                x4:
                    false,

                x5:
                    false,

                x6:
                    false,

                x7:
                    false,

                x8:
                    false,

                x9:
                    false,

                x0:
                    false

            },


            cheats: {

                infiniteHp:
                    false,

                highDamage:
                    false,

                infiniteMagic:
                    false,

                infiniteEnergy:
                    false,

                infiniteHunger:
                    false,

                infiniteFatigue:
                    false,

                infiniteMoney:
                    false,

                infiniteMaterials:
                    false

            }

        };
    }


    state.dev =
        createDevRuntime();


    /* ============================================================
       HASH DE SENHA

       Versão determinística:
       se SHA-256 existir usa SHA.
       Caso contrário usa FNV.

       Prefixamos o algoritmo no hash para
       evitar o bug de criar com SHA e tentar
       validar com fallback depois.
       ============================================================ */

    async function hashDevPassword(
        password
    ) {
        const normalized =
            String(
                password ||
                ""
            );

        if (
            window.crypto
                ?.subtle &&
            typeof TextEncoder !==
                "undefined"
        ) {
            try {
                const bytes =
                    new TextEncoder()
                        .encode(
                            normalized
                        );

                const buffer =
                    await crypto
                        .subtle
                        .digest(
                            "SHA-256",
                            bytes
                        );

                const array =
                    Array.from(
                        new Uint8Array(
                            buffer
                        )
                    );

                const hex =
                    array
                        .map(
                            value =>
                                value
                                    .toString(
                                        16
                                    )
                                    .padStart(
                                        2,
                                        "0"
                                    )
                        )
                        .join("");

                return `sha256:${hex}`;
            } catch {
                /* fallback */
            }
        }


        let hash =
            2166136261;

        for (
            let index = 0;
            index < normalized.length;
            index += 1
        ) {
            hash ^=
                normalized.charCodeAt(
                    index
                );

            hash =
                Math.imul(
                    hash,
                    16777619
                );
        }

        return (
            "fnv1a:" +
            (
                hash >>>
                0
            )
                .toString(
                    16
                )
        );
    }


    function getStoredDevPasswordHash() {
        try {
            return localStorage.getItem(
                DEV_STORAGE
                    .passwordHash
            );
        } catch {
            return null;
        }
    }


    function hasDevPassword() {
        return Boolean(
            getStoredDevPasswordHash()
        );
    }


    async function verifyDevPassword(
        password
    ) {
        const stored =
            getStoredDevPasswordHash();

        if (!stored) {
            return false;
        }

        const calculated =
            await hashDevPassword(
                password
            );

        return (
            calculated ===
            stored
        );
    }


    /* ============================================================
       PREFERÊNCIAS DEV
       ============================================================ */

    function loadDevPreferences() {
        try {
            state.dev.rememberAccess =
                localStorage.getItem(
                    DEV_STORAGE
                        .remember
                ) ===
                "true";

            state.dev.privacy =
                localStorage.getItem(
                    DEV_STORAGE
                        .privacy
                ) !==
                "false";


            const rememberedUnlock =
                localStorage.getItem(
                    DEV_STORAGE
                        .unlocked
                ) ===
                "true";


            state.dev.unlocked =
                Boolean(
                    rememberedUnlock &&
                    state.dev
                        .rememberAccess &&
                    hasDevPassword()
                );

        } catch {
            state.dev.rememberAccess =
                false;

            state.dev.privacy =
                true;
        }


        try {
            state.dev.sessionUnlocked =
                sessionStorage.getItem(
                    DEV_STORAGE
                        .unlocked
                ) ===
                "true";

            if (
                state.dev
                    .sessionUnlocked
            ) {
                state.dev.unlocked =
                    true;
            }
        } catch {
            /* nada */
        }
    }


    function saveDevPreferences() {
        try {
            localStorage.setItem(
                DEV_STORAGE
                    .remember,
                String(
                    state.dev
                        .rememberAccess
                )
            );

            localStorage.setItem(
                DEV_STORAGE
                    .privacy,
                String(
                    state.dev
                        .privacy
                )
            );

            if (
                state.dev
                    .rememberAccess &&
                state.dev
                    .unlocked
            ) {
                localStorage.setItem(
                    DEV_STORAGE
                        .unlocked,
                    "true"
                );
            } else {
                localStorage.removeItem(
                    DEV_STORAGE
                        .unlocked
                );
            }
        } catch {
            /* nada */
        }


        try {
            if (
                state.dev
                    .unlocked
            ) {
                sessionStorage.setItem(
                    DEV_STORAGE
                        .unlocked,
                    "true"
                );
            } else {
                sessionStorage.removeItem(
                    DEV_STORAGE
                        .unlocked
                );
            }
        } catch {
            /* nada */
        }
    }


    loadDevPreferences();


    /* ============================================================
       PAINEL DEV
       ============================================================ */

    function createDevCommandPanel() {
        if (
            state.dev.panel &&
            document.body.contains(
                state.dev.panel
            )
        ) {
            return state.dev.panel;
        }


        const panel =
            document.createElement(
                "div"
            );


        panel.id =
            "devCommandPanel";


        panel.className =
            "dev-command-panel";


        panel.style.display =
            "none";


        panel.innerHTML = `
            <div class="dev-command-shell">

                <div
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        gap:10px;
                        margin-bottom:12px;
                    "
                >
                    <strong
                        style="
                            letter-spacing:.16em;
                            font-size:12px;
                        "
                    >
                        COMANDOS:
                    </strong>

                    <button
                        type="button"
                        data-dev-close
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                <div data-dev-auth>

                    <p
                        data-dev-description
                        style="
                            opacity:.68;
                            line-height:1.45;
                            margin:0 0 8px;
                            font-size:12px;
                        "
                    ></p>

                    <input
                        data-dev-password
                        type="password"
                        autocomplete="off"
                        placeholder="Senha"
                    >

                    <div
                        style="
                            display:flex;
                            flex-wrap:wrap;
                            align-items:center;
                            gap:8px;
                            margin-top:7px;
                        "
                    >
                        <button
                            type="button"
                            data-dev-submit
                        >
                            ENTRAR
                        </button>

                        <label
                            style="
                                display:flex;
                                gap:5px;
                                align-items:center;
                                font-size:11px;
                            "
                        >
                            <input
                                type="checkbox"
                                data-dev-remember
                            >

                            Lembrar acesso
                        </label>

                        <label
                            style="
                                display:flex;
                                gap:5px;
                                align-items:center;
                                font-size:11px;
                            "
                        >
                            <input
                                type="checkbox"
                                data-dev-privacy
                            >

                            Privacidade
                        </label>
                    </div>

                </div>


                <div
                    data-dev-controls
                    style="
                        display:none;
                    "
                >

                    <div
                        data-dev-status
                        style="
                            margin-bottom:9px;
                            font-size:11px;
                            opacity:.75;
                        "
                    ></div>

                    <div
                        style="
                            display:grid;
                            grid-template-columns:1fr 1fr;
                            gap:5px;
                            font-size:11px;
                        "
                    >
                        <div>X + 1 • Vida</div>
                        <div>X + 2 • Dano</div>
                        <div>X + 3 • Magia</div>
                        <div>X + 4 • Energia</div>
                        <div>X + 5 • Fome</div>
                        <div>X + 6 • Cansaço</div>
                        <div>X + 7 • Dinheiro</div>
                        <div>X + 8 • Materiais</div>
                        <div>X + 9 • Ativar tudo</div>
                        <div>X + 0 • Desativar tudo</div>
                    </div>

                    <button
                        type="button"
                        data-dev-forget
                        style="
                            margin-top:11px;
                        "
                    >
                        ESQUECER ACESSO
                    </button>

                </div>

            </div>
        `;


        document.body.appendChild(
            panel
        );


        state.dev.panel =
            panel;


        state.dev.passwordInput =
            panel.querySelector(
                "[data-dev-password]"
            );


        state.dev.statusElement =
            panel.querySelector(
                "[data-dev-status]"
            );


        const remember =
            panel.querySelector(
                "[data-dev-remember]"
            );


        const privacy =
            panel.querySelector(
                "[data-dev-privacy]"
            );


        remember.checked =
            state.dev
                .rememberAccess;


        privacy.checked =
            state.dev
                .privacy;


        remember.addEventListener(
            "change",
            () => {
                state.dev.rememberAccess =
                    remember.checked;

                saveDevPreferences();
            }
        );


        privacy.addEventListener(
            "change",
            () => {
                state.dev.privacy =
                    privacy.checked;

                saveDevPreferences();
            }
        );


        panel
            .querySelector(
                "[data-dev-close]"
            )
            .addEventListener(
                "click",
                () => {
                    closeDevCommandPanel();
                }
            );


        panel
            .querySelector(
                "[data-dev-submit]"
            )
            .addEventListener(
                "click",
                () => {
                    submitDevPassword();
                }
            );


        state.dev
            .passwordInput
            .addEventListener(
                "keydown",
                event => {
                    if (
                        event.key ===
                        "Enter"
                    ) {
                        event.preventDefault();

                        submitDevPassword();
                    }
                }
            );


        panel
            .querySelector(
                "[data-dev-forget]"
            )
            .addEventListener(
                "click",
                () => {
                    forgetDevAccess();
                }
            );


        refreshDevPanel();


        return panel;
    }


    function refreshDevPanel() {
        const panel =
            state.dev.panel;

        if (!panel) {
            return;
        }


        const auth =
            panel.querySelector(
                "[data-dev-auth]"
            );

        const controls =
            panel.querySelector(
                "[data-dev-controls]"
            );

        const description =
            panel.querySelector(
                "[data-dev-description]"
            );

        const submit =
            panel.querySelector(
                "[data-dev-submit]"
            );


        const passwordExists =
            hasDevPassword();


        if (
            state.dev.unlocked
        ) {
            auth.style.display =
                "none";

            controls.style.display =
                "";

            refreshDevStatusText();

            return;
        }


        auth.style.display =
            "";

        controls.style.display =
            "none";


        if (
            passwordExists
        ) {
            state.dev.setupMode =
                false;

            description.textContent =
                "Digite a senha dos comandos.";

            submit.textContent =
                "ENTRAR";
        } else {
            state.dev.setupMode =
                true;

            description.textContent =
                "Primeiro acesso: crie uma senha para proteger os comandos.";

            submit.textContent =
                "CRIAR SENHA";
        }
    }


    async function submitDevPassword() {
        const input =
            state.dev
                .passwordInput;

        if (!input) {
            return false;
        }

        const password =
            String(
                input.value ||
                ""
            );


        if (
            password.length <
            4
        ) {
            input.value =
                "";

            input.placeholder =
                "Use pelo menos 4 caracteres";

            return false;
        }


        if (
            !hasDevPassword()
        ) {
            const hash =
                await hashDevPassword(
                    password
                );

            try {
                localStorage.setItem(
                    DEV_STORAGE
                        .passwordHash,
                    hash
                );
            } catch {
                return false;
            }

            state.dev.unlocked =
                true;

            state.dev.sessionUnlocked =
                true;

            input.value =
                "";

            saveDevPreferences();

            refreshDevPanel();

            if (
                state.dev.privacy
            ) {
                closeDevCommandPanel();
            }

            return true;
        }


        const valid =
            await verifyDevPassword(
                password
            );

        input.value =
            "";


        if (!valid) {
            input.placeholder =
                "Senha incorreta";

            return false;
        }


        state.dev.unlocked =
            true;

        state.dev.sessionUnlocked =
            true;

        saveDevPreferences();

        refreshDevPanel();


        if (
            state.dev.privacy
        ) {
            closeDevCommandPanel();
        }


        return true;
    }


    function forgetDevAccess() {
        state.dev.unlocked =
            false;

        state.dev.sessionUnlocked =
            false;

        state.dev.rememberAccess =
            false;


        for (
            const key of
            Object.keys(
                state.dev.cheats
            )
        ) {
            state.dev.cheats[
                key
            ] =
                false;
        }


        try {
            localStorage.removeItem(
                DEV_STORAGE
                    .passwordHash
            );

            localStorage.removeItem(
                DEV_STORAGE
                    .remember
            );

            localStorage.removeItem(
                DEV_STORAGE
                    .unlocked
            );
        } catch {
            /* nada */
        }


        try {
            sessionStorage.removeItem(
                DEV_STORAGE
                    .unlocked
            );
        } catch {
            /* nada */
        }


        refreshDevPanel();
    }


    function openDevCommandPanel() {
        const panel =
            createDevCommandPanel();

        if (!panel) {
            return;
        }

        panel.style.display =
            "block";

        refreshDevPanel();

        if (
            !state.dev.unlocked
        ) {
            setTimeout(
                () => {
                    state.dev
                        .passwordInput
                        ?.focus();
                },
                0
            );
        }
    }


    function closeDevCommandPanel() {
        if (
            state.dev.panel
        ) {
            state.dev
                .panel
                .style
                .display =
                "none";
        }
    }


    function toggleDevCommandPanel() {
        const panel =
            createDevCommandPanel();

        if (
            panel.style.display ===
            "none"
        ) {
            openDevCommandPanel();
        } else {
            closeDevCommandPanel();
        }
    }


    /* ============================================================
       CHEATS
       ============================================================ */

    function setDevCheat(
        cheat,
        enabled
    ) {
        if (
            !state.dev.unlocked ||
            !Object.prototype
                .hasOwnProperty
                .call(
                    state.dev.cheats,
                    cheat
                )
        ) {
            return false;
        }

        state.dev.cheats[
            cheat
        ] =
            Boolean(
                enabled
            );

        refreshDevStatusText();

        return true;
    }


    function toggleDevCheat(
        cheat
    ) {
        if (
            !state.dev.unlocked
        ) {
            return false;
        }

        return setDevCheat(
            cheat,
            !state.dev
                .cheats[
                    cheat
                ]
        );
    }


    function enableAllDevCheats() {
        if (
            !state.dev.unlocked
        ) {
            return false;
        }

        for (
            const key of
            Object.keys(
                state.dev.cheats
            )
        ) {
            state.dev.cheats[
                key
            ] =
                true;
        }

        refreshDevStatusText();

        return true;
    }


    function disableAllDevCheats() {
        for (
            const key of
            Object.keys(
                state.dev.cheats
            )
        ) {
            state.dev.cheats[
                key
            ] =
                false;
        }

        refreshDevStatusText();

        return true;
    }


    function refreshDevStatusText() {
        const element =
            state.dev
                .statusElement;

        if (!element) {
            return;
        }

        const enabled =
            Object.entries(
                state.dev.cheats
            )
                .filter(
                    (
                        [
                            ,
                            active
                        ]
                    ) =>
                        active
                )
                .map(
                    (
                        [
                            key
                        ]
                    ) =>
                        key
                );

        if (
            state.dev.privacy
        ) {
            element.textContent =
                enabled.length >
                    0
                    ? `${enabled.length} comando(s) ativo(s).`
                    : "Nenhum comando ativo.";

            return;
        }

        element.textContent =
            enabled.length >
                0
                ? `ATIVOS: ${enabled.join(", ")}`
                : "Nenhum comando ativo.";
    }


    function maintainDevInfiniteResources() {
        const player =
            state.player;

        if (
            !player ||
            !state.dev.unlocked
        ) {
            return;
        }


        if (
            state.dev.cheats
                .infiniteHp
        ) {
            player.hp =
                player.maxHp;
        }


        if (
            state.dev.cheats
                .infiniteMagic
        ) {
            player.magic =
                player.maxMagic;
        }


        if (
            state.dev.cheats
                .infiniteEnergy
        ) {
            player.energy =
                player.maxEnergy;
        }


        if (
            state.dev.cheats
                .infiniteHunger
        ) {
            player.hunger =
                player.maxHunger;
        }


        if (
            state.dev.cheats
                .infiniteFatigue
        ) {
            player.fatigue =
                player.maxFatigue;
        }
    }


    function devModifyOutgoingDamage(
        damage
    ) {
        if (
            state.dev.unlocked &&
            state.dev.cheats
                .highDamage
        ) {
            return Math.max(
                GAME_CONFIG
                    .debugDamageValue,
                damage
            );
        }

        return damage;
    }


    function devShouldIgnorePlayerDamage() {
        return Boolean(
            state.dev.unlocked &&
            state.dev.cheats
                .infiniteHp
        );
    }


    /* ============================================================
       X + Y E X + N

       Funciona por event.code e também key
       para reduzir problemas com layout de teclado.
       ============================================================ */

    function normalizeDevKey(
        event
    ) {
        if (
            event.code ===
            "KeyX"
        ) {
            return "X";
        }

        if (
            event.code ===
            "KeyY"
        ) {
            return "Y";
        }

        if (
            /^Digit[0-9]$/.test(
                event.code
            )
        ) {
            return event.code
                .replace(
                    "Digit",
                    ""
                );
        }

        if (
            /^Numpad[0-9]$/.test(
                event.code
            )
        ) {
            return event.code
                .replace(
                    "Numpad",
                    ""
                );
        }

        return String(
            event.key ||
            ""
        )
            .toUpperCase();
    }


    function handleDevShortcutKeyDown(
        event
    ) {
        const target =
            event.target;

        const tag =
            String(
                target?.tagName ||
                ""
            )
                .toLowerCase();


        /*
            Não disparar cheat digitando senha/nome.
        */
        if (
            tag ===
                "input" ||
            tag ===
                "textarea" ||
            target?.isContentEditable
        ) {
            return false;
        }


        const key =
            normalizeDevKey(
                event
            );


        state.dev.heldKeys.add(
            key
        );


        const held =
            state.dev.heldKeys;


        /*
            X + Y
        */
        if (
            held.has(
                "X"
            ) &&
            held.has(
                "Y"
            )
        ) {
            if (
                !state.dev
                    .comboLatch
                    .xy
            ) {
                state.dev
                    .comboLatch
                    .xy =
                    true;

                toggleDevCommandPanel();
            }

            return true;
        }


        /*
            Outros só após autenticação.
        */
        if (
            !state.dev.unlocked ||
            !held.has(
                "X"
            )
        ) {
            return false;
        }


        const map = {

            "1":
                "infiniteHp",

            "2":
                "highDamage",

            "3":
                "infiniteMagic",

            "4":
                "infiniteEnergy",

            "5":
                "infiniteHunger",

            "6":
                "infiniteFatigue",

            "7":
                "infiniteMoney",

            "8":
                "infiniteMaterials"

        };


        if (
            map[
                key
            ]
        ) {
            const latchKey =
                `x${key}`;

            if (
                !state.dev
                    .comboLatch[
                        latchKey
                    ]
            ) {
                state.dev
                    .comboLatch[
                        latchKey
                    ] =
                    true;

                toggleDevCheat(
                    map[
                        key
                    ]
                );
            }

            return true;
        }


        if (
            key ===
            "9"
        ) {
            if (
                !state.dev
                    .comboLatch
                    .x9
            ) {
                state.dev
                    .comboLatch
                    .x9 =
                    true;

                enableAllDevCheats();
            }

            return true;
        }


        if (
            key ===
            "0"
        ) {
            if (
                !state.dev
                    .comboLatch
                    .x0
            ) {
                state.dev
                    .comboLatch
                    .x0 =
                    true;

                disableAllDevCheats();
            }

            return true;
        }


        return false;
    }


    function handleDevShortcutKeyUp(
        event
    ) {
        const key =
            normalizeDevKey(
                event
            );

        state.dev.heldKeys.delete(
            key
        );


        if (
            key ===
                "X" ||
            key ===
                "Y"
        ) {
            state.dev
                .comboLatch
                .xy =
                false;
        }


        if (
            /^[0-9]$/.test(
                key
            )
        ) {
            state.dev
                .comboLatch[
                    `x${key}`
                ] =
                false;
        }
    }


    function clearDevHeldKeys() {
        state.dev
            .heldKeys
            .clear();

        for (
            const key of
            Object.keys(
                state.dev
                    .comboLatch
            )
        ) {
            state.dev
                .comboLatch[
                    key
                ] =
                false;
        }
    }


    /* ============================================================
       VISUAL PROFILE DO PLAYER

       Parte 4 chamará isto.
       ============================================================ */

    function getPlayerVisualProfile(
        player =
            state.player
    ) {
        const character =
            getCharacterById(
                player
                    ?.characterId
            );

        if (!character) {
            return null;
        }

        return character
            .visualProfile;
    }


    /* ============================================================
       PLAYER HOME SPAWN

       Parte 2 sobrescreverá dinamicamente com
       geometria da porta quando o mapa existir.
       ============================================================ */

    function getPlayerHomeSpawn() {
        if (
            state.world &&
            state.area ===
                "village" &&
            typeof findBuilding ===
                "function" &&
            typeof getBuildingDoorGeometry ===
                "function"
        ) {
            const home =
                findBuilding(
                    "home",
                    state.world
                );

            if (home) {
                const door =
                    getBuildingDoorGeometry(
                        home
                    );

                if (door) {
                    const offset =
                        72;

                    switch (
                        door.side
                    ) {
                        case "top":
                            return {
                                x:
                                    door.centerX,

                                y:
                                    door.centerY -
                                    offset,

                                facing:
                                    "down"
                            };


                        case "left":
                            return {
                                x:
                                    door.centerX -
                                    offset,

                                y:
                                    door.centerY,

                                facing:
                                    "right"
                            };


                        case "right":
                            return {
                                x:
                                    door.centerX +
                                    offset,

                                y:
                                    door.centerY,

                                facing:
                                    "left"
                            };


                        case "bottom":
                        default:
                            return {
                                x:
                                    door.centerX,

                                y:
                                    door.centerY +
                                    offset,

                                facing:
                                    "up"
                            };
                    }
                }
            }
        }

        return {
            ...PLAYER_HOME_SPAWN
        };
    }


    function placePlayerAtHomeSpawn(
        player =
            state.player
    ) {
        if (!player) {
            return false;
        }

        const spawn =
            getPlayerHomeSpawn();

        player.x =
            spawn.x;

        player.y =
            spawn.y;

        player.facing =
            spawn.facing;

        return true;
    }


    /* ============================================================
       ÁRVORES — COLISÃO

       Parte 2 registra árvore com:
       - visual grande;
       - tronco sólido menor.
       ============================================================ */

    function getTreeCollisionRect(
        tree
    ) {
        const trunkWidth =
            finiteNumber(
                tree.trunkCollisionWidth,
                28
            );

        const trunkHeight =
            finiteNumber(
                tree.trunkCollisionHeight,
                30
            );

        return createSolidObstacle({

            id:
                `tree_collision_${tree.id}`,

            type:
                "tree",

            sourceId:
                tree.id,

            x:
                tree.x -
                trunkWidth /
                2,

            y:
                tree.y +
                finiteNumber(
                    tree.trunkCollisionOffsetY,
                    4
                ),

            w:
                trunkWidth,

            h:
                trunkHeight,

            collisionShape:
                "trunk",

            solid:
                true,

            blocksLight:
                Boolean(
                    tree.blocksLight
                )

        });
    }


    /* ============================================================
       SAÍDAS / PORTÕES

       Parte 2 cria.
       Parte 3 interage.
       Parte 4 mostra prompt.
       ============================================================ */

    function createExitTrigger(
        config
    ) {
        return {

            id:
                config.id,

            x:
                config.x,

            y:
                config.y,

            w:
                config.w,

            h:
                config.h,


            destination:
                config.destination,

            destinationSpawn:
                config.destinationSpawn ||
                "default",


            interactionKey:
                config.interactionKey ||
                "E",


            label:
                config.label ||
                "AVANÇAR",


            requiresInteraction:
                config.requiresInteraction !==
                false,


            unlocked:
                config.unlocked !==
                false,


            requirement:
                config.requirement ||
                null

        };
    }


    /* ============================================================
       BASIC QUEST
       ============================================================ */

    function startBasicQuest(
        questId
    ) {
        const player =
            state.player;

        const config =
            QUEST_CONFIG[
                questId
            ];

        const quest =
            player
                ?.quest
                ?.[questId];

        if (
            !player ||
            !config ||
            !quest
        ) {
            return false;
        }

        if (
            quest.state !==
                QUEST_STATE
                    .NOT_STARTED
        ) {
            return false;
        }

        quest.state =
            QUEST_STATE.ACTIVE;

        return true;
    }


    function getQuestProgress(
        questId
    ) {
        const config =
            QUEST_CONFIG[
                questId
            ];

        if (!config) {
            return {
                current: 0,
                required: 0
            };
        }

        return {
            current:
                Math.min(
                    config.amount,
                    getRealItemCount(
                        config.itemId
                    )
                ),

            required:
                config.amount
        };
    }


    function completeBasicQuest(
        questId
    ) {
        const player =
            state.player;

        const config =
            QUEST_CONFIG[
                questId
            ];

        const quest =
            player
                ?.quest
                ?.[questId];

        if (
            !player ||
            !config ||
            !quest ||
            quest.rewarded
        ) {
            return false;
        }

        if (
            getRealItemCount(
                config.itemId
            ) <
            config.amount
        ) {
            return false;
        }


        if (
            !removeItem(
                config.itemId,
                config.amount
            )
        ) {
            return false;
        }


        addMoney(
            config.rewardCoins
        );


        quest.state =
            QUEST_STATE.COMPLETE;

        quest.rewarded =
            true;


        return true;
    }


    /* ============================================================
       ITEM USE
       ============================================================ */

    function useInventoryItem(
        itemId
    ) {
        const player =
            state.player;

        const item =
            ITEMS[
                itemId
            ];

        if (
            !player ||
            !item ||
            getRealItemCount(
                itemId
            ) <=
                0
        ) {
            return false;
        }


        if (
            item.category ===
                "food"
        ) {
            if (
                item.effect
                    ?.hunger
            ) {
                player.hunger =
                    clamp(
                        player.hunger +
                        item.effect
                            .hunger,
                        0,
                        player.maxHunger
                    );
            }

            return removeItem(
                itemId,
                1
            );
        }


        if (
            item.category ===
                "potions"
        ) {
            if (
                item.effect
                    ?.hp
            ) {
                player.hp =
                    clamp(
                        player.hp +
                        item.effect.hp,
                        0,
                        player.maxHp
                    );

                return removeItem(
                    itemId,
                    1
                );
            }


            if (
                item.effect
                    ?.magic
            ) {
                player.magic =
                    clamp(
                        player.magic +
                        item.effect.magic,
                        0,
                        player.maxMagic
                    );

                return removeItem(
                    itemId,
                    1
                );
            }


            if (
                item.effect
                    ?.buff
            ) {
                if (
                    player
                        .activePotionBuffs
                        .length >=
                    MAX_ACTIVE_POTION_BUFFS
                ) {
                    return false;
                }

                player
                    .activePotionBuffs
                    .push({

                        type:
                            item.effect.buff,

                        multiplier:
                            item.effect.multiplier,

                        duration:
                            item.effect.duration,

                        timer:
                            item.effect.duration

                    });

                removeItem(
                    itemId,
                    1
                );

                recalculatePlayerStats();

                return true;
            }
        }


        return false;
    }


    /* ============================================================
       WORLD SEED
       ============================================================ */

    function getWorldSeed(
        areaId
    ) {
        const name =
            state.player
                ?.name ||
            "VEYRA";

        return hashStringToSeed(
            `${GAME_VERSION}_${name}_${areaId}`
        );
    }


    function createSeededRandom(
        seed
    ) {
        let value =
            seed >>>
            0;

        return function seededRandom() {
            value +=
                0x6D2B79F5;

            let t =
                value;

            t =
                Math.imul(
                    t ^
                    (
                        t >>>
                        15
                    ),
                    t |
                    1
                );

            t ^=
                t +
                Math.imul(
                    t ^
                    (
                        t >>>
                        7
                    ),
                    t |
                    61
                );

            return (
                (
                    t ^
                    (
                        t >>>
                        14
                    )
                ) >>>
                0
            ) /
            4294967296;
        };
    }


    /* ============================================================
       VALIDAÇÃO DA PARTE 1
       ============================================================ */

    function validatePart1Data() {
        const errors = [];


        if (
            STATUS_POINTS_PER_LEVEL !==
            3
        ) {
            errors.push(
                "Cada nível deve conceder exatamente 3 pontos."
            );
        }


        if (
            STAT_CAP !==
            30
        ) {
            errors.push(
                "STAT_CAP deve permanecer em 30."
            );
        }


        for (
            const id of
            [
                "kaelion",
                "theron",
                "grumgar",
                "lirael",
                "zephyr"
            ]
        ) {
            const character =
                CHARACTERS[
                    id
                ];

            if (!character) {
                errors.push(
                    `Personagem ausente: ${id}`
                );

                continue;
            }

            if (
                !character
                    .visualProfile
            ) {
                errors.push(
                    `Perfil visual ausente: ${id}`
                );
            }

            if (
                character
                    .visualProfile
                    .renderer !==
                id
            ) {
                errors.push(
                    `Renderer próprio desalinhado: ${id}`
                );
            }
        }


        if (
            PLAYER_HOME_SPAWN.x ===
                1600 &&
            PLAYER_HOME_SPAWN.y ===
                1100
        ) {
            errors.push(
                "Novo Jogo ainda aponta para o centro da Vila."
            );
        }


        if (
            !BOSS_REGISTRY
                .road_guardian
                .requiresConfirmation
        ) {
            errors.push(
                "Guardião da Estrada precisa de confirmação."
            );
        }


        if (
            BOSS_REGISTRY
                .road_guardian
                .initialState !==
            BOSS_STATE.NEUTRAL
        ) {
            errors.push(
                "Guardião deve começar neutro."
            );
        }


        if (
            VOID_MISSION_CONFIG
                .shadowEssenceRequired !==
            15
        ) {
            errors.push(
                "A missão deve exigir 15 Essências Sombrias."
            );
        }


        if (
            DASH_CONFIG
                .v1
                .cooldown !==
                3 ||
            DASH_CONFIG
                .v2
                .cooldown !==
                3
        ) {
            errors.push(
                "Dash V1/V2 devem manter cooldown aproximado de 3s."
            );
        }


        if (
            LANTERN_PRICE !==
            350
        ) {
            errors.push(
                "Lanterna Antiga deve custar 350."
            );
        }


        if (
            MINIMAP_PRICE !==
            180
        ) {
            errors.push(
                "Minimapa deve custar 180."
            );
        }


        if (
            QUEST_CONFIG
                .wood
                .rewardCoins <=
            0
        ) {
            errors.push(
                "Missão da madeira precisa recompensar moedas."
            );
        }


        if (
            typeof handleDevShortcutKeyDown !==
                "function"
        ) {
            errors.push(
                "Sistema X+Y não definido."
            );
        }


        if (
            typeof createSolidObstacle !==
                "function"
        ) {
            errors.push(
                "Fundação de colisão ausente."
            );
        }


        if (
            typeof createDoorRuntime !==
                "function"
        ) {
            errors.push(
                "Fundação da nova porta ausente."
            );
        }


        if (
            errors.length >
            0
        ) {
            console.error(
                "VEYRA V31 — ERROS NA PARTE 1:",
                errors
            );

            return {
                ok: false,
                errors
            };
        }


        console.log(
            "VEYRA V31 — Parte 1 validada."
        );


        return {
            ok: true,
            errors: []
        };
    }


    /* ============================================================
       FIM DA PARTE 1/5

       PARTE 2 VAI CONTER:

       - mapa preservado
       - Vila preservada
       - spawn real derivado da porta da casa
       - obstáculos sólidos
       - colisão de árvores
       - colisão de pedras
       - casas
       - porta com dobradiça
       - geometria única de porta
       - interiores diferentes
       - Floresta
       - Bosque
       - Montanhas
       - Ferro
       - Rubi
       - Labirinto
       - porta secreta antes do Labirinto
       - área superior/inferior, nunca lateral
       - Caminho 2
       - Jardins/Lar dos Gnomos
       - Reino Feérico
       - Fronteira Celestial
       - transição ambiental Fada -> Céu
       - chave obscura antes da passagem celestial
       - Céu 1
       - Céu 2
       - Céu 3 preparado
       - Escada Celestial
       - dungeon do Vazio
       - corredor escuro
       - lanterna
       - arena Vaelkor
       - saídas com prompts
       - criação de bosses respeitando defeatedBosses
       - Guardião derrotado não respawna
       - cenário mais detalhado SEM RECONSTRUIR O MAPA BASE

       NÃO COLOQUE })(); AQUI.
       ============================================================ */
