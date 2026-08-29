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
    /* ============================================================
       VEYRA: A QUIETUDE
       SCRIPT.JS — PARTE 2/5

       MUNDO / REGIÕES / GEOMETRIA / COLISÃO / PORTAS

       ESTA PARTE CONTÉM:
       - metadados das regiões
       - mapa-base preservado
       - Vila
       - Caminho 1
       - Caminho 2
       - interiores
       - dungeon do Vazio
       - geometria de casas
       - geometria única de portas
       - animação de portas
       - colisão sólida
       - árvores com tronco sólido
       - pedras
       - obstáculos
       - saídas
       - boss spawn anti-respawn
       - Guardião da Estrada
       - porta secreta
       - Chave Obscura
       - Essência Sombria
       - lanterna
       - minimapa
       - transição de ambiente
       - arena Vaelkor
       - prompts de saída
       - safe spawn
       - geração ambiental detalhada

       NÃO FECHA O IIFE.
       ============================================================ */


    /* ============================================================
       REGION META
       ============================================================ */

    const REGION_META = Object.freeze({

        village: Object.freeze({
            id: "village",
            name: "VILA DO CREPÚSCULO",
            path: 0,
            biome: "village",
            worldWidth: 3200,
            worldHeight: 2200
        }),

        road: Object.freeze({
            id: "road",
            name: "ESTRADA DO CREPÚSCULO",
            path: 1,
            biome: "road",
            worldWidth: 3300,
            worldHeight: 2200
        }),

        forest: Object.freeze({
            id: "forest",
            name: "FLORESTA VELADA",
            path: 1,
            biome: "forest",
            worldWidth: 3400,
            worldHeight: 2300
        }),

        grove: Object.freeze({
            id: "grove",
            name: "BOSQUE DAS MEMÓRIAS",
            path: 1,
            biome: "grove",
            worldWidth: 3500,
            worldHeight: 2350
        }),

        mountains: Object.freeze({
            id: "mountains",
            name: "MONTANHAS DO ESQUECIMENTO",
            path: 1,
            biome: "mountains",
            worldWidth: 3500,
            worldHeight: 2350
        }),

        ironRegion: Object.freeze({
            id: "ironRegion",
            name: "TERRAS DE FERRO",
            path: 1,
            biome: "iron",
            worldWidth: 3400,
            worldHeight: 2250
        }),

        rubyRegion: Object.freeze({
            id: "rubyRegion",
            name: "VALE DE RUBI",
            path: 1,
            biome: "ruby",
            worldWidth: 3500,
            worldHeight: 2300
        }),

        monarchMaze: Object.freeze({
            id: "monarchMaze",
            name: "LABIRINTO DO MONARCA",
            path: 1,
            biome: "maze",
            worldWidth: 3600,
            worldHeight: 2300
        }),

        gnomeGardens: Object.freeze({
            id: "gnomeGardens",
            name: "JARDINS DOS GNOMOS",
            path: 2,
            biome: "gnome",
            worldWidth: 3300,
            worldHeight: 2250
        }),

        fairyKingdom: Object.freeze({
            id: "fairyKingdom",
            name: "REINO FEÉRICO",
            path: 2,
            biome: "fairy",
            worldWidth: 3400,
            worldHeight: 2250
        }),

        celestialFrontier: Object.freeze({
            id: "celestialFrontier",
            name: "FRONTEIRA CELESTIAL",
            path: 2,
            biome: "fairySky",
            worldWidth: 3600,
            worldHeight: 2350
        }),

        celestialStair: Object.freeze({
            id: "celestialStair",
            name: "ESCADA CELESTIAL",
            path: 2,
            biome: "celestial",
            worldWidth: 3200,
            worldHeight: 2200
        }),

        skyOne: Object.freeze({
            id: "skyOne",
            name: "CÉU I",
            path: 2,
            biome: "sky",
            worldWidth: 3400,
            worldHeight: 2250
        }),

        skyTwo: Object.freeze({
            id: "skyTwo",
            name: "CÉU II",
            path: 2,
            biome: "sky",
            worldWidth: 3400,
            worldHeight: 2250
        }),

        skyThree: Object.freeze({
            id: "skyThree",
            name: "CÉU III",
            path: 2,
            biome: "sky",
            worldWidth: 3400,
            worldHeight: 2250,
            reserved: true
        }),

        voidDungeon: Object.freeze({
            id: "voidDungeon",
            name: "ÁREA SECRETA DO VAZIO",
            path: "secret",
            biome: "void",
            worldWidth: 2800,
            worldHeight: 1800,
            secret: true,
            minimapSignal: false
        })

    });


    /* ============================================================
       PREVIOUS REGION
       ============================================================ */

    const PREVIOUS_REGION = Object.freeze({

        road:
            "village",

        forest:
            "road",

        grove:
            "forest",

        mountains:
            "grove",

        ironRegion:
            "mountains",

        rubyRegion:
            "ironRegion",

        monarchMaze:
            "rubyRegion",


        gnomeGardens:
            "village",

        fairyKingdom:
            "gnomeGardens",

        celestialFrontier:
            "fairyKingdom",

        celestialStair:
            "celestialFrontier",

        skyOne:
            "celestialStair",

        skyTwo:
            "skyOne",

        skyThree:
            "skyTwo"

    });


    /* ============================================================
       ESTILO DOS BIOMAS
       ============================================================ */

    const BIOME_STYLE = Object.freeze({

        village: Object.freeze({
            ground: "#46533f",
            groundAlt: "#4e5c46",
            grass: "#66785b",
            grassDark: "#344331",
            dirt: "#796b52",
            dirtEdge: "#554a39",
            stone: "#77766f",
            shadow: "rgba(18,22,17,.25)",
            ambient: "#a6a77e"
        }),

        road: Object.freeze({
            ground: "#4d5444",
            groundAlt: "#555c49",
            grass: "#64705a",
            grassDark: "#374233",
            dirt: "#7c6e55",
            dirtEdge: "#544b3c",
            stone: "#77766e",
            shadow: "rgba(17,20,16,.28)",
            ambient: "#9d9b77"
        }),

        forest: Object.freeze({
            ground: "#263a2d",
            groundAlt: "#2d4333",
            grass: "#496847",
            grassDark: "#1a2e21",
            dirt: "#635944",
            dirtEdge: "#413a2d",
            stone: "#585c53",
            shadow: "rgba(8,15,10,.42)",
            ambient: "#617d5f"
        }),

        grove: Object.freeze({
            ground: "#304532",
            groundAlt: "#394e38",
            grass: "#5d7c55",
            grassDark: "#233820",
            dirt: "#6b6048",
            dirtEdge: "#473e2e",
            stone: "#65665a",
            shadow: "rgba(10,18,10,.38)",
            ambient: "#899b6c"
        }),

        mountains: Object.freeze({
            ground: "#5a5d59",
            groundAlt: "#626660",
            grass: "#5b6458",
            grassDark: "#3d4540",
            dirt: "#767268",
            dirtEdge: "#56534c",
            stone: "#80847f",
            shadow: "rgba(19,22,22,.34)",
            ambient: "#bcc0bd"
        }),

        iron: Object.freeze({
            ground: "#4c4b48",
            groundAlt: "#565450",
            grass: "#54584f",
            grassDark: "#373a36",
            dirt: "#655d53",
            dirtEdge: "#49423b",
            stone: "#74736f",
            shadow: "rgba(12,13,13,.38)",
            ambient: "#a2a19a"
        }),

        ruby: Object.freeze({
            ground: "#493d3d",
            groundAlt: "#514143",
            grass: "#4f5147",
            grassDark: "#30342e",
            dirt: "#765657",
            dirtEdge: "#4d3638",
            stone: "#6c6261",
            shadow: "rgba(21,10,12,.38)",
            ambient: "#b27679"
        }),

        maze: Object.freeze({
            ground: "#2b2b2e",
            groundAlt: "#313136",
            grass: "#40413d",
            grassDark: "#20211f",
            dirt: "#56504a",
            dirtEdge: "#383532",
            stone: "#5d5d61",
            shadow: "rgba(0,0,0,.48)",
            ambient: "#77757d"
        }),

        gnome: Object.freeze({
            ground: "#54704a",
            groundAlt: "#5f7a52",
            grass: "#79a166",
            grassDark: "#3f5b38",
            dirt: "#9a815b",
            dirtEdge: "#6c583f",
            stone: "#8c8974",
            shadow: "rgba(28,40,24,.24)",
            ambient: "#c2d090"
        }),

        fairy: Object.freeze({
            ground: "#4b684f",
            groundAlt: "#58775d",
            grass: "#78a66d",
            grassDark: "#3d6040",
            dirt: "#927c68",
            dirtEdge: "#6c5b4d",
            stone: "#7f8790",
            shadow: "rgba(24,22,42,.22)",
            ambient: "#d4a7e4"
        }),

        fairySky: Object.freeze({
            ground: "#657c6e",
            groundAlt: "#7b8f83",
            grass: "#88aa82",
            grassDark: "#536b53",
            dirt: "#a69279",
            dirtEdge: "#756551",
            stone: "#a3a5aa",
            shadow: "rgba(47,52,70,.22)",
            ambient: "#d7d7e9"
        }),

        celestial: Object.freeze({
            ground: "#a8adb1",
            groundAlt: "#b9bdc1",
            grass: "#a7b5a4",
            grassDark: "#7e8c7c",
            dirt: "#beb6a6",
            dirtEdge: "#918a7c",
            stone: "#d1d2d0",
            shadow: "rgba(62,70,86,.22)",
            ambient: "#f0e6c4"
        }),

        sky: Object.freeze({
            ground: "#aab3bc",
            groundAlt: "#bac4cd",
            grass: "#aebdaf",
            grassDark: "#82958b",
            dirt: "#c8c0ae",
            dirtEdge: "#958e80",
            stone: "#d7d9da",
            shadow: "rgba(50,63,90,.2)",
            ambient: "#ecf1f4"
        }),

        void: Object.freeze({
            ground: "#15131a",
            groundAlt: "#1b1821",
            grass: "#211c29",
            grassDark: "#0d0b11",
            dirt: "#29232f",
            dirtEdge: "#151119",
            stone: "#302b35",
            shadow: "rgba(0,0,0,.7)",
            ambient: "#6f5778"
        })

    });


    function getBiomeStyle(
        areaId =
            state.area
    ) {
        const meta =
            REGION_META[
                areaId
            ];

        return (
            BIOME_STYLE[
                meta?.biome
            ] ||
            BIOME_STYLE.village
        );
    }


    /* ============================================================
       PATH STYLE
       ============================================================ */

    const PATH_STYLE_CONFIG = Object.freeze({

        village: Object.freeze({
            base: "#796a50",
            edge: "#5a4c3a"
        }),

        road: Object.freeze({
            base: "#786a53",
            edge: "#554a39"
        }),

        forest: Object.freeze({
            base: "#625743",
            edge: "#3f382d"
        }),

        grove: Object.freeze({
            base: "#6b5d44",
            edge: "#473d2f"
        }),

        mountains: Object.freeze({
            base: "#79746b",
            edge: "#59554f"
        }),

        ironRegion: Object.freeze({
            base: "#655d53",
            edge: "#45403a"
        }),

        rubyRegion: Object.freeze({
            base: "#715457",
            edge: "#50383b"
        }),

        monarchMaze: Object.freeze({
            base: "#454348",
            edge: "#29282c"
        }),

        gnomeGardens: Object.freeze({
            base: "#9d855e",
            edge: "#695740"
        }),

        fairyKingdom: Object.freeze({
            base: "#967e68",
            edge: "#655546"
        }),

        celestialFrontier: Object.freeze({
            base: "#a89b87",
            edge: "#756b5f"
        }),

        celestialStair: Object.freeze({
            base: "#d2c9b6",
            edge: "#9e9788"
        }),

        skyOne: Object.freeze({
            base: "#d0c7b5",
            edge: "#9b9588"
        }),

        skyTwo: Object.freeze({
            base: "#d4cbb8",
            edge: "#9f988a"
        }),

        skyThree: Object.freeze({
            base: "#d6cebd",
            edge: "#a39c8d"
        }),

        voidDungeon: Object.freeze({
            base: "#27212c",
            edge: "#100d13"
        })

    });


    function getPathStyle(
        areaId =
            state.area
    ) {
        return (
            PATH_STYLE_CONFIG[
                areaId
            ] ||
            PATH_STYLE_CONFIG.village
        );
    }


    /* ============================================================
       HOUSE INTERIORS
       ============================================================ */

    const HOUSE_INTERIORS = Object.freeze({

        home: Object.freeze({
            id: "home",
            name: "SUA CASA",

            worldWidth: 1080,
            worldHeight: 730,

            room: Object.freeze({
                x: 130,
                y: 100,
                w: 820,
                h: 515
            }),

            playerSpawn: Object.freeze({
                x: 540,
                y: 515
            }),

            door: Object.freeze({
                x: 495,
                y: 560,
                w: 90,
                h: 55,
                side: "bottom"
            }),

            theme: "home"
        }),

        elianHome: Object.freeze({
            id: "elianHome",
            name: "CASA DE ELIAN",

            worldWidth: 1080,
            worldHeight: 720,

            room: Object.freeze({
                x: 140,
                y: 105,
                w: 800,
                h: 500
            }),

            playerSpawn: Object.freeze({
                x: 540,
                y: 505
            }),

            door: Object.freeze({
                x: 500,
                y: 550,
                w: 80,
                h: 50,
                side: "bottom"
            }),

            theme: "archiveHome"
        }),

        shop: Object.freeze({
            id: "shop",
            name: "LOJA DE DORAN",

            worldWidth: 1100,
            worldHeight: 730,

            room: Object.freeze({
                x: 100,
                y: 90,
                w: 900,
                h: 530
            }),

            playerSpawn: Object.freeze({
                x: 550,
                y: 535
            }),

            door: Object.freeze({
                x: 505,
                y: 565,
                w: 90,
                h: 50,
                side: "bottom"
            }),

            theme: "merchant"
        }),

        forge: Object.freeze({
            id: "forge",
            name: "FORJA DE BORIN",

            worldWidth: 1100,
            worldHeight: 740,

            room: Object.freeze({
                x: 95,
                y: 85,
                w: 910,
                h: 545
            }),

            playerSpawn: Object.freeze({
                x: 550,
                y: 545
            }),

            door: Object.freeze({
                x: 505,
                y: 575,
                w: 90,
                h: 50,
                side: "bottom"
            }),

            theme: "forge"
        }),

        woodshop: Object.freeze({
            id: "woodshop",
            name: "OFICINA DE BRAN",

            worldWidth: 1080,
            worldHeight: 720,

            room: Object.freeze({
                x: 115,
                y: 95,
                w: 850,
                h: 515
            }),

            playerSpawn: Object.freeze({
                x: 540,
                y: 525
            }),

            door: Object.freeze({
                x: 500,
                y: 560,
                w: 80,
                h: 48,
                side: "bottom"
            }),

            theme: "woodworker"
        })

    });


    /* ============================================================
       MAPA-BASE DA VILA

       PRESERVAMOS AS POSIÇÕES APROVADAS.
       ============================================================ */

    const VILLAGE_BUILDING_LAYOUT = Object.freeze([

        Object.freeze({
            id: "home",
            x: 365,
            y: 1510,
            w: 460,
            h: 330,
            doorSide: "bottom",
            houseId: "home",
            style: "playerHome"
        }),

        Object.freeze({
            id: "elianHome",
            x: 420,
            y: 370,
            w: 435,
            h: 310,
            doorSide: "bottom",
            houseId: "elianHome",
            style: "scholarHome"
        }),

        Object.freeze({
            id: "shop",
            x: 2365,
            y: 360,
            w: 470,
            h: 325,
            doorSide: "bottom",
            houseId: "shop",
            style: "merchant"
        }),

        Object.freeze({
            id: "forge",
            x: 2395,
            y: 1490,
            w: 470,
            h: 335,
            doorSide: "bottom",
            houseId: "forge",
            style: "forge"
        }),

        Object.freeze({
            id: "woodshop",
            x: 1000,
            y: 1585,
            w: 440,
            h: 300,
            doorSide: "bottom",
            houseId: "woodshop",
            style: "woodworker"
        })

    ]);


    const VILLAGE_NPC_LAYOUT = Object.freeze([

        Object.freeze({
            id: "elian",
            name: "ELIAN",
            x: 950,
            y: 900,
            type: "villager"
        }),

        Object.freeze({
            id: "mara",
            name: "MARA",
            x: 1840,
            y: 1360,
            type: "scholar"
        }),

        Object.freeze({
            id: "miguel",
            name: "MIGUEL",
            x: 2770,
            y: 790,
            type: "mysterious"
        })

    ]);


    /* ============================================================
       WORLD FACTORY
       ============================================================ */

    function createEmptyWorld(
        areaId
    ) {
        const meta =
            REGION_META[
                areaId
            ] ||
            REGION_META.village;

        return {

            id:
                areaId,

            name:
                meta.name,

            width:
                meta.worldWidth,

            height:
                meta.worldHeight,


            paths:
                [],

            buildings:
                [],

            doors:
                [],

            trees:
                [],

            rocks:
                [],

            grass:
                [],

            flowers:
                [],

            decorations:
                [],

            particles:
                [],


            obstacles:
                [],


            npcs:
                [],

            enemies:
                [],

            bosses:
                [],


            resources:
                [],


            exits:
                [],

            gates:
                [],


            secretDoors:
                [],


            zones:
                [],


            walls:
                [],


            ambient:
                [],


            spawnPoints:
                {},


            flags: {

                minimapSignal:
                    meta.minimapSignal !==
                    false,

                naturallyLit:
                    areaId !==
                    "voidDungeon"

            }

        };
    }


    /* ============================================================
       BUILDING HELPERS
       ============================================================ */

    function createBuilding(
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

            doorSide:
                config.doorSide ||
                "bottom",

            houseId:
                config.houseId ||
                null,

            style:
                config.style ||
                "house",

            solid:
                config.solid !==
                false,

            roofColor:
                config.roofColor ||
                null,

            wallColor:
                config.wallColor ||
                null,

            door:
                null

        };
    }


    function findBuilding(
        buildingId,
        world =
            state.world
    ) {
        if (!world) {
            return null;
        }

        return (
            world.buildings
                ?.find(
                    building =>
                        building.id ===
                        buildingId
                ) ||
            null
        );
    }


    /* ============================================================
       GEOMETRIA ÚNICA DE PORTA

       ESSA FUNÇÃO É A FONTE OFICIAL.

       DESENHO, INTERAÇÃO E HITBOX
       DEVEM VIR DAQUI.
       ============================================================ */

    function getBuildingDoorGeometry(
        building
    ) {
        if (!building) {
            return null;
        }

        const side =
            building.doorSide ||
            "bottom";


        /*
            Porta proporcional à fachada,
            mas limitada para não ficar enorme.
        */
        const doorWidth =
            clamp(
                building.w *
                0.18,
                66,
                92
            );

        const doorDepth =
            24;


        switch (
            side
        ) {
            case "top":
                return {
                    side,
                    x:
                        building.x +
                        building.w /
                        2 -
                        doorWidth /
                        2,
                    y:
                        building.y -
                        2,
                    w:
                        doorWidth,
                    h:
                        doorDepth,
                    centerX:
                        building.x +
                        building.w /
                        2,
                    centerY:
                        building.y +
                        doorDepth /
                        2 -
                        2
                };


            case "left":
                return {
                    side,
                    x:
                        building.x -
                        2,
                    y:
                        building.y +
                        building.h /
                        2 -
                        doorWidth /
                        2,
                    w:
                        doorDepth,
                    h:
                        doorWidth,
                    centerX:
                        building.x +
                        doorDepth /
                        2 -
                        2,
                    centerY:
                        building.y +
                        building.h /
                        2
                };


            case "right":
                return {
                    side,
                    x:
                        building.x +
                        building.w -
                        doorDepth +
                        2,
                    y:
                        building.y +
                        building.h /
                        2 -
                        doorWidth /
                        2,
                    w:
                        doorDepth,
                    h:
                        doorWidth,
                    centerX:
                        building.x +
                        building.w -
                        doorDepth /
                        2 +
                        2,
                    centerY:
                        building.y +
                        building.h /
                        2
                };


            case "bottom":
            default:
                return {
                    side,
                    x:
                        building.x +
                        building.w /
                        2 -
                        doorWidth /
                        2,
                    y:
                        building.y +
                        building.h -
                        doorDepth +
                        2,
                    w:
                        doorWidth,
                    h:
                        doorDepth,
                    centerX:
                        building.x +
                        building.w /
                        2,
                    centerY:
                        building.y +
                        building.h -
                        doorDepth /
                        2 +
                        2
                };
        }
    }


    function attachDoorToBuilding(
        building,
        world
    ) {
        const geometry =
            getBuildingDoorGeometry(
                building
            );

        if (!geometry) {
            return null;
        }

        const door =
            createDoorRuntime({

                id:
                    `door_${building.id}`,

                buildingId:
                    building.id,

                houseId:
                    building.houseId,

                x:
                    geometry.x,

                y:
                    geometry.y,

                w:
                    geometry.w,

                h:
                    geometry.h,

                side:
                    geometry.side,

                hinge:
                    geometry.side ===
                        "left"
                        ? "top"
                        : "left",

                autoOpen:
                    true

            });


        building.door =
            door;


        world.doors.push(
            door
        );


        return door;
    }


    /* ============================================================
       COLISÃO DE BUILDING

       Deixamos um "vão" na porta quando aberta.
       ============================================================ */

    function getBuildingSolidRects(
        building
    ) {
        const door =
            building.door;

        if (!door) {
            return [
                createSolidObstacle({
                    id:
                        `building_${building.id}`,
                    type:
                        "building",
                    sourceId:
                        building.id,
                    x:
                        building.x,
                    y:
                        building.y,
                    w:
                        building.w,
                    h:
                        building.h,
                    solid:
                        true,
                    blocksLight:
                        true
                })
            ];
        }


        const opening =
            clamp(
                door.openAmount,
                0,
                1
            );


        /*
            Porta fechada:
            construção inteira sólida.
        */
        if (
            opening <
            0.65
        ) {
            return [
                createSolidObstacle({
                    id:
                        `building_${building.id}`,
                    type:
                        "building",
                    sourceId:
                        building.id,
                    x:
                        building.x,
                    y:
                        building.y,
                    w:
                        building.w,
                    h:
                        building.h,
                    solid:
                        true,
                    blocksLight:
                        true
                })
            ];
        }


        const geometry =
            getBuildingDoorGeometry(
                building
            );


        const rects = [];


        if (
            geometry.side ===
                "bottom" ||
            geometry.side ===
                "top"
        ) {
            const leftWidth =
                geometry.x -
                building.x;

            const rightX =
                geometry.x +
                geometry.w;

            const rightWidth =
                building.x +
                building.w -
                rightX;


            if (
                leftWidth >
                0
            ) {
                rects.push(
                    createSolidObstacle({
                        id:
                            `building_${building.id}_left`,
                        type:
                            "building",
                        sourceId:
                            building.id,
                        x:
                            building.x,
                        y:
                            building.y,
                        w:
                            leftWidth,
                        h:
                            building.h,
                        solid:
                            true,
                        blocksLight:
                            true
                    })
                );
            }


            if (
                rightWidth >
                0
            ) {
                rects.push(
                    createSolidObstacle({
                        id:
                            `building_${building.id}_right`,
                        type:
                            "building",
                        sourceId:
                            building.id,
                        x:
                            rightX,
                        y:
                            building.y,
                        w:
                            rightWidth,
                        h:
                            building.h,
                        solid:
                            true,
                        blocksLight:
                            true
                    })
                );
            }


            const upperHeight =
                geometry.side ===
                    "bottom"
                    ? geometry.y -
                        building.y
                    : building.h -
                        geometry.h;


            if (
                upperHeight >
                0
            ) {
                rects.push(
                    createSolidObstacle({
                        id:
                            `building_${building.id}_core`,
                        type:
                            "building",
                        sourceId:
                            building.id,
                        x:
                            geometry.x,
                        y:
                            geometry.side ===
                                "bottom"
                                ? building.y
                                : geometry.y +
                                    geometry.h,
                        w:
                            geometry.w,
                        h:
                            upperHeight,
                        solid:
                            true,
                        blocksLight:
                            true
                    })
                );
            }

        } else {
            const topHeight =
                geometry.y -
                building.y;

            const bottomY =
                geometry.y +
                geometry.h;

            const bottomHeight =
                building.y +
                building.h -
                bottomY;


            if (
                topHeight >
                0
            ) {
                rects.push(
                    createSolidObstacle({
                        id:
                            `building_${building.id}_top`,
                        type:
                            "building",
                        sourceId:
                            building.id,
                        x:
                            building.x,
                        y:
                            building.y,
                        w:
                            building.w,
                        h:
                            topHeight,
                        solid:
                            true,
                        blocksLight:
                            true
                    })
                );
            }


            if (
                bottomHeight >
                0
            ) {
                rects.push(
                    createSolidObstacle({
                        id:
                            `building_${building.id}_bottom`,
                        type:
                            "building",
                        sourceId:
                            building.id,
                        x:
                            building.x,
                        y:
                            bottomY,
                        w:
                            building.w,
                        h:
                            bottomHeight,
                        solid:
                            true,
                        blocksLight:
                            true
                    })
                );
            }
        }


        return rects;
    }


    /* ============================================================
       UPDATE DAS PORTAS

       Não altera largura da porta.
       Apenas openAmount/angle.
       ============================================================ */

    function updateWorldDoors(
        dt
    ) {
        const world =
            state.world;

        const player =
            state.player;

        if (
            !world ||
            !player
        ) {
            return;
        }


        for (
            const door of
            world.doors ||
            []
        ) {
            const dist =
                distance(
                    player.x,
                    player.y,
                    door.centerX,
                    door.centerY
                );


            if (
                door.locked
            ) {
                door.targetOpen =
                    0;
            } else if (
                door.autoOpen &&
                dist <=
                    GAME_CONFIG
                        .doorOpenDistance
            ) {
                door.targetOpen =
                    1;
            } else if (
                dist >=
                    GAME_CONFIG
                        .doorCloseDistance
            ) {
                door.targetOpen =
                    0;
            }


            const direction =
                Math.sign(
                    door.targetOpen -
                    door.openAmount
                );


            if (
                direction !==
                0
            ) {
                door.openAmount +=
                    direction *
                    GAME_CONFIG
                        .doorAnimationSpeed *
                    dt;


                if (
                    direction >
                    0
                ) {
                    door.openAmount =
                        Math.min(
                            door.openAmount,
                            door.targetOpen
                        );
                } else {
                    door.openAmount =
                        Math.max(
                            door.openAmount,
                            door.targetOpen
                        );
                }
            }


            door.openAmount =
                clamp(
                    door.openAmount,
                    0,
                    1
                );


            door.angle =
                door.maxAngle *
                door.openAmount;


            door.opening =
                door.openAmount >
                    0 &&
                door.openAmount <
                    1;


            door.open =
                door.openAmount >=
                0.92;
        }


        rebuildDynamicWorldObstacles();
    }


    /* ============================================================
       ÁRVORE
       ============================================================ */

    function createTree(
        config
    ) {
        return {

            id:
                config.id ||
                `tree_${Math.random().toString(36).slice(2)}`,

            x:
                config.x,

            y:
                config.y,

            scale:
                finiteNumber(
                    config.scale,
                    1
                ),

            variant:
                config.variant ||
                "oak",

            harvested:
                false,

            respawnTimer:
                0,

            resourceAmount:
                config.resourceAmount ||
                1,

            blocksLight:
                config.blocksLight !==
                false,


            trunkCollisionWidth:
                finiteNumber(
                    config.trunkCollisionWidth,
                    30 *
                    finiteNumber(
                        config.scale,
                        1
                    )
                ),

            trunkCollisionHeight:
                finiteNumber(
                    config.trunkCollisionHeight,
                    34 *
                    finiteNumber(
                        config.scale,
                        1
                    )
                ),

            trunkCollisionOffsetY:
                finiteNumber(
                    config.trunkCollisionOffsetY,
                    4
                ),

            canopySeed:
                config.canopySeed ||
                Math.random() *
                10000

        };
    }


    function createRock(
        config
    ) {
        return {

            id:
                config.id ||
                `rock_${Math.random().toString(36).slice(2)}`,

            x:
                config.x,

            y:
                config.y,

            w:
                config.w ||
                42,

            h:
                config.h ||
                34,

            variant:
                config.variant ||
                "stone",

            solid:
                config.solid !==
                false,

            blocksLight:
                Boolean(
                    config.blocksLight
                )

        };
    }


    /* ============================================================
       GRAMA / FLORES
       ============================================================ */

    function createGrassPatch(
        config
    ) {
        return {

            x:
                config.x,

            y:
                config.y,

            scale:
                config.scale ||
                1,

            rotation:
                config.rotation ||
                0,

            variant:
                config.variant ||
                0
        };
    }


    function createFlowerPatch(
        config
    ) {
        return {

            x:
                config.x,

            y:
                config.y,

            scale:
                config.scale ||
                1,

            color:
                config.color ||
                "#d5c47b"
        };
    }


    /* ============================================================
       WORLD OBSTACLES
       ============================================================ */

    function rebuildDynamicWorldObstacles(
        world =
            state.world
    ) {
        if (!world) {
            return;
        }


        const obstacles = [];


        /*
            Casas.
        */
        for (
            const building of
            world.buildings ||
            []
        ) {
            if (
                building.solid ===
                false
            ) {
                continue;
            }

            obstacles.push(
                ...getBuildingSolidRects(
                    building
                )
            );
        }


        /*
            Árvores.
        */
        for (
            const tree of
            world.trees ||
            []
        ) {
            if (
                tree.harvested
            ) {
                continue;
            }

            obstacles.push(
                getTreeCollisionRect(
                    tree
                )
            );
        }


        /*
            Pedras.
        */
        for (
            const rock of
            world.rocks ||
            []
        ) {
            if (
                rock.solid ===
                false
            ) {
                continue;
            }

            obstacles.push(
                createSolidObstacle({

                    id:
                        `rock_collision_${rock.id}`,

                    type:
                        "rock",

                    sourceId:
                        rock.id,

                    x:
                        rock.x -
                        rock.w /
                        2,

                    y:
                        rock.y -
                        rock.h /
                        2,

                    w:
                        rock.w,

                    h:
                        rock.h,

                    solid:
                        true,

                    blocksLight:
                        rock.blocksLight

                })
            );
        }


        /*
            Paredes.
        */
        for (
            const wall of
            world.walls ||
            []
        ) {
            obstacles.push(
                createSolidObstacle({

                    id:
                        wall.id,

                    type:
                        "wall",

                    x:
                        wall.x,

                    y:
                        wall.y,

                    w:
                        wall.w,

                    h:
                        wall.h,

                    solid:
                        true,

                    blocksLight:
                        wall.blocksLight !==
                        false

                })
            );
        }


        /*
            Obstáculos fixos adicionais.
        */
        for (
            const obstacle of
            world.staticObstacles ||
            []
        ) {
            obstacles.push(
                obstacle
            );
        }


        world.obstacles =
            obstacles;
    }


    function isCircleBlocked(
        x,
        y,
        radius,
        world =
            state.world,
        ignoreSourceId =
            null
    ) {
        if (!world) {
            return false;
        }


        if (
            x -
                radius <
                0 ||
            y -
                radius <
                0 ||
            x +
                radius >
                world.width ||
            y +
                radius >
                world.height
        ) {
            return true;
        }


        for (
            const obstacle of
            world.obstacles ||
            []
        ) {
            if (
                !obstacle.solid
            ) {
                continue;
            }


            if (
                ignoreSourceId &&
                obstacle.sourceId ===
                    ignoreSourceId
            ) {
                continue;
            }


            if (
                circleRectCollision(
                    x,
                    y,
                    radius,
                    obstacle
                )
            ) {
                return true;
            }
        }


        return false;
    }


    function findSafePosition(
        x,
        y,
        radius =
            GAME_CONFIG
                .playerBaseRadius,
        world =
            state.world
    ) {
        if (!world) {
            return {
                x,
                y
            };
        }


        if (
            !isCircleBlocked(
                x,
                y,
                radius,
                world
            )
        ) {
            return {
                x,
                y
            };
        }


        const step =
            26;


        const maxRadius =
            420;


        for (
            let ring = step;
            ring <= maxRadius;
            ring += step
        ) {
            const samples =
                Math.max(
                    8,
                    Math.ceil(
                        ring /
                        16
                    )
                );


            for (
                let index = 0;
                index < samples;
                index += 1
            ) {
                const angle =
                    (
                        index /
                        samples
                    ) *
                    Math.PI *
                    2;


                const candidateX =
                    x +
                    Math.cos(
                        angle
                    ) *
                    ring;


                const candidateY =
                    y +
                    Math.sin(
                        angle
                    ) *
                    ring;


                if (
                    !isCircleBlocked(
                        candidateX,
                        candidateY,
                        radius,
                        world
                    )
                ) {
                    return {
                        x:
                            candidateX,

                        y:
                            candidateY
                    };
                }
            }
        }


        return {
            x:
                clamp(
                    x,
                    radius,
                    world.width -
                        radius
                ),

            y:
                clamp(
                    y,
                    radius,
                    world.height -
                        radius
                )
        };
    }


    /* ============================================================
       MOVIMENTO COM COLISÃO

       EIXOS SEPARADOS:
       reduz travamentos em cantos.
       ============================================================ */

    function moveCircleWithCollision(
        entity,
        dx,
        dy,
        radius =
            entity?.radius ||
            GAME_CONFIG
                .playerBaseRadius,
        world =
            state.world
    ) {
        if (
            !entity ||
            !world
        ) {
            return false;
        }


        let moved =
            false;


        const nextX =
            entity.x +
            dx;


        if (
            !isCircleBlocked(
                nextX,
                entity.y,
                radius,
                world
            )
        ) {
            entity.x =
                nextX;

            moved =
                true;
        }


        const nextY =
            entity.y +
            dy;


        if (
            !isCircleBlocked(
                entity.x,
                nextY,
                radius,
                world
            )
        ) {
            entity.y =
                nextY;

            moved =
                true;
        }


        return moved;
    }


    /* ============================================================
       PROTECTED ZONES

       Evita árvore/pedra em:
       - spawn
       - estrada
       - portas
       - NPC
       - boss
       ============================================================ */

    function isPointInsideProtectedZone(
        x,
        y,
        world
    ) {
        for (
            const zone of
            world.zones ||
            []
        ) {
            if (
                !zone.protected
            ) {
                continue;
            }

            if (
                pointInRect(
                    x,
                    y,
                    zone
                )
            ) {
                return true;
            }
        }


        for (
            const path of
            world.paths ||
            []
        ) {
            if (
                pointInRect(
                    x,
                    y,
                    {
                        x:
                            path.x -
                            28,
                        y:
                            path.y -
                            28,
                        w:
                            path.w +
                            56,
                        h:
                            path.h +
                            56
                    }
                )
            ) {
                return true;
            }
        }


        for (
            const building of
            world.buildings ||
            []
        ) {
            if (
                pointInRect(
                    x,
                    y,
                    {
                        x:
                            building.x -
                            45,
                        y:
                            building.y -
                            45,
                        w:
                            building.w +
                            90,
                        h:
                            building.h +
                            90
                    }
                )
            ) {
                return true;
            }
        }


        for (
            const npc of
            world.npcs ||
            []
        ) {
            if (
                distance(
                    x,
                    y,
                    npc.x,
                    npc.y
                ) <
                80
            ) {
                return true;
            }
        }


        return false;
    }


    /* ============================================================
       GERAÇÃO AMBIENTAL

       NÃO MUDA GEOMETRIA DO MAPA.

       Só adiciona:
       - árvores
       - pedras
       - grama
       - flores
       - detalhes
       ============================================================ */

    function populateNaturalEnvironment(
        world,
        options = {}
    ) {
        const randomFn =
            createSeededRandom(
                getWorldSeed(
                    world.id
                )
            );


        const treeCount =
            options.treeCount ??
            95;


        const rockCount =
            options.rockCount ??
            32;


        const grassCount =
            options.grassCount ??
            210;


        const flowerCount =
            options.flowerCount ??
            24;


        const treeVariants =
            options.treeVariants ||
            [
                "oak",
                "pine",
                "old"
            ];


        for (
            let index = 0;
            index < treeCount;
            index += 1
        ) {
            const x =
                90 +
                randomFn() *
                (
                    world.width -
                    180
                );

            const y =
                90 +
                randomFn() *
                (
                    world.height -
                    180
                );


            if (
                isPointInsideProtectedZone(
                    x,
                    y,
                    world
                )
            ) {
                continue;
            }


            const scale =
                0.83 +
                randomFn() *
                0.48;


            world.trees.push(
                createTree({

                    id:
                        `${world.id}_tree_${index}`,

                    x,

                    y,

                    scale,

                    variant:
                        treeVariants[
                            Math.floor(
                                randomFn() *
                                treeVariants.length
                            )
                        ],

                    canopySeed:
                        randomFn() *
                        9999

                })
            );
        }


        for (
            let index = 0;
            index < rockCount;
            index += 1
        ) {
            const x =
                80 +
                randomFn() *
                (
                    world.width -
                    160
                );

            const y =
                80 +
                randomFn() *
                (
                    world.height -
                    160
                );


            if (
                isPointInsideProtectedZone(
                    x,
                    y,
                    world
                )
            ) {
                continue;
            }


            world.rocks.push(
                createRock({

                    id:
                        `${world.id}_rock_${index}`,

                    x,

                    y,

                    w:
                        30 +
                        randomFn() *
                        38,

                    h:
                        24 +
                        randomFn() *
                        30,

                    variant:
                        Math.floor(
                            randomFn() *
                            4
                        )

                })
            );
        }


        for (
            let index = 0;
            index < grassCount;
            index += 1
        ) {
            world.grass.push(
                createGrassPatch({

                    x:
                        randomFn() *
                        world.width,

                    y:
                        randomFn() *
                        world.height,

                    scale:
                        0.6 +
                        randomFn() *
                        0.9,

                    rotation:
                        randomFn() *
                        Math.PI *
                        2,

                    variant:
                        Math.floor(
                            randomFn() *
                            4
                        )

                })
            );
        }


        for (
            let index = 0;
            index < flowerCount;
            index += 1
        ) {
            const x =
                randomFn() *
                world.width;

            const y =
                randomFn() *
                world.height;


            if (
                isPointInsideProtectedZone(
                    x,
                    y,
                    world
                )
            ) {
                continue;
            }


            world.flowers.push(
                createFlowerPatch({

                    x,

                    y,

                    scale:
                        0.7 +
                        randomFn() *
                        0.7,

                    color:
                        options.flowerColors
                            ?.[
                                Math.floor(
                                    randomFn() *
                                    options
                                        .flowerColors
                                        .length
                                )
                            ] ||
                        "#d4c17b"

                })
            );
        }


        rebuildDynamicWorldObstacles(
            world
        );
    }


    /* ============================================================
       SPAWN POINTS
       ============================================================ */

    function setSpawn(
        world,
        id,
        x,
        y,
        facing =
            "down"
    ) {
        world.spawnPoints[
            id
        ] = {
            x,
            y,
            facing
        };
    }


    function getRegionSpawn(
        areaId,
        spawnId =
            "default"
    ) {
        const world =
            state.world?.id ===
                areaId
                ? state.world
                : buildWorld(
                    areaId,
                    {
                        lightweight:
                            true
                    }
                );


        if (
            !world
        ) {
            return null;
        }


        return (
            world.spawnPoints[
                spawnId
            ] ||
            world.spawnPoints
                .default ||
            null
        );
    }


    /* ============================================================
       NPC
       ============================================================ */

    function createNPC(
        config
    ) {
        return {

            id:
                config.id,

            name:
                config.name ||
                config.id
                    .toUpperCase(),

            x:
                config.x,

            y:
                config.y,

            radius:
                config.radius ||
                19,

            type:
                config.type ||
                "villager",

            facing:
                config.facing ||
                "down",

            vendor:
                config.vendor ||
                null,

            dialogueId:
                config.dialogueId ||
                config.id,

            questId:
                config.questId ||
                null,

            animationTime:
                Math.random() *
                10

        };
    }


    /* ============================================================
       ENEMY
       ============================================================ */

    function createEnemy(
        speciesId,
        config = {}
    ) {
        const species =
            ENEMY_SPECIES[
                speciesId
            ];

        if (!species) {
            return null;
        }


        return {

            entityId:
                config.entityId ||
                `${speciesId}_${Math.random().toString(36).slice(2)}`,

            id:
                species.id,

            speciesId:
                species.id,

            name:
                species.name,

            spriteType:
                species.spriteType,

            x:
                config.x,

            y:
                config.y,

            spawnX:
                config.x,

            spawnY:
                config.y,

            radius:
                species.radius,

            hp:
                species.hp,

            maxHp:
                species.hp,

            damage:
                species.damage,

            defense:
                species.defense,

            speed:
                species.speed,

            xp:
                species.xp,

            ability:
                species.ability,

            abilityConfig:
                species.abilityConfig ||
                null,

            dead:
                false,

            aggro:
                false,

            attackCooldown:
                random(
                    0,
                    0.7
                ),

            abilityCooldown:
                random(
                    0,
                    1
                ),

            state:
                "idle",

            stateTimer:
                0,

            telegraph:
                null,

            velocityX:
                0,

            velocityY:
                0,

            animationTime:
                Math.random() *
                20,

            drops:
                config.drops ||
                null,

            questEnemyId:
                config.questEnemyId ||
                null

        };
    }


    /* ============================================================
       BOSS FACTORY

       NÃO CRIA BOSS JÁ DERROTADO.
       ============================================================ */

    function createBoss(
        bossId,
        config = {}
    ) {
        const definition =
            BOSS_REGISTRY[
                bossId
            ];

        if (!definition) {
            return null;
        }


        if (
            isBossDefeated(
                bossId
            )
        ) {
            return null;
        }


        return {

            entityId:
                config.entityId ||
                `boss_${bossId}`,

            id:
                bossId,

            name:
                definition.name,

            subtitle:
                definition.subtitle ||
                "",

            icon:
                definition.icon,

            x:
                config.x,

            y:
                config.y,

            spawnX:
                config.x,

            spawnY:
                config.y,

            radius:
                definition.radius,

            hp:
                definition.hp,

            maxHp:
                definition.hp,

            damage:
                definition.damage,

            defense:
                definition.defense,

            speed:
                definition.speed,

            progression:
                definition.progression,

            topBar:
                definition.topBar,

            centerLocked:
                Boolean(
                    definition.centerLocked
                ),

            state:
                definition.initialState,

            confirmed:
                !definition
                    .requiresConfirmation,

            aggro:
                false,

            dead:
                false,

            phase:
                1,

            phaseTransitionDone:
                false,

            attackCooldown:
                0,

            abilityCooldown:
                1,

            animationTime:
                0,

            hurtAnim:
                0,

            deathTimer:
                0,

            confirmationDeclinedUntil:
                0,

            arenaId:
                config.arenaId ||
                null

        };
    }


    function addBossIfAlive(
        world,
        bossId,
        config
    ) {
        const boss =
            createBoss(
                bossId,
                config
            );

        if (
            boss
        ) {
            world.bosses.push(
                boss
            );
        }

        return boss;
    }


    /* ============================================================
       EXIT
       ============================================================ */

    function addExit(
        world,
        config
    ) {
        const exit =
            createExitTrigger(
                config
            );

        world.exits.push(
            exit
        );

        return exit;
    }


    function getExitPrompt(
        exit
    ) {
        if (!exit) {
            return "";
        }

        if (
            !exit.unlocked
        ) {
            return (
                exit.lockedMessage ||
                "O caminho está bloqueado."
            );
        }

        return `${exit.interactionKey} • ${exit.label}`;
    }


    /* ============================================================
       VILA
       ============================================================ */

    function buildVillageWorld() {
        const world =
            createEmptyWorld(
                "village"
            );


        /*
            Estradas principais.

            Mantém estrutura aprovada:
            centro + 4 caminhos.
        */
        world.paths.push(

            {
                x: 1460,
                y: 0,
                w: 280,
                h: 2200
            },

            {
                x: 0,
                y: 980,
                w: 3200,
                h: 250
            },

            {
                x: 520,
                y: 1690,
                w: 1020,
                h: 150
            },

            {
                x: 2100,
                y: 500,
                w: 850,
                h: 150
            }

        );


        /*
            Casas preservadas.
        */
        for (
            const config of
            VILLAGE_BUILDING_LAYOUT
        ) {
            const building =
                createBuilding(
                    config
                );

            world.buildings.push(
                building
            );

            attachDoorToBuilding(
                building,
                world
            );
        }


        /*
            NPCs externos.
        */
        for (
            const config of
            VILLAGE_NPC_LAYOUT
        ) {
            world.npcs.push(
                createNPC(
                    config
                )
            );
        }


        /*
            Zona de centro.
        */
        world.zones.push({

            id:
                "village_center",

            x:
                1280,

            y:
                790,

            w:
                640,

            h:
                620,

            protected:
                true

        });


        /*
            Spawn oficial calculado pela casa.
        */
        const home =
            findBuilding(
                "home",
                world
            );

        const homeDoor =
            getBuildingDoorGeometry(
                home
            );


        const homeSpawn = {

            x:
                homeDoor.centerX,

            y:
                homeDoor.centerY +
                78,

            facing:
                "up"

        };


        setSpawn(
            world,
            "default",
            homeSpawn.x,
            homeSpawn.y,
            homeSpawn.facing
        );


        setSpawn(
            world,
            "home",
            homeSpawn.x,
            homeSpawn.y,
            homeSpawn.facing
        );


        setSpawn(
            world,
            "eastReturn",
            3000,
            1090,
            "left"
        );


        setSpawn(
            world,
            "northReturn",
            1600,
            150,
            "down"
        );


        /*
            Caminho 1 — leste.
        */
        addExit(
            world,
            {
                id:
                    "village_to_road",

                x:
                    3060,

                y:
                    970,

                w:
                    130,

                h:
                    280,

                destination:
                    "road",

                destinationSpawn:
                    "west",

                label:
                    "SEGUIR PELA ESTRADA",

                interactionKey:
                    "E"
            }
        );


        /*
            Caminho 2 — norte.
        */
        addExit(
            world,
            {
                id:
                    "village_to_gnome",

                x:
                    1460,

                y:
                    0,

                w:
                    280,

                h:
                    120,

                destination:
                    "gnomeGardens",

                destinationSpawn:
                    "south",

                label:
                    "ATRAVESSAR O PORTÃO NORTE",

                interactionKey:
                    "E"
            }
        );


        /*
            Portões visuais.
        */
        world.gates.push(

            {
                id:
                    "east_gate",

                x:
                    3040,

                y:
                    950,

                w:
                    100,

                h:
                    320,

                orientation:
                    "vertical",

                label:
                    "CAMINHO 1"
            },

            {
                id:
                    "north_gate",

                x:
                    1430,

                y:
                    40,

                w:
                    340,

                h:
                    90,

                orientation:
                    "horizontal",

                label:
                    "CAMINHO 2"
            }

        );


        /*
            Ambiente detalhado.
        */
        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    88,

                rockCount:
                    25,

                grassCount:
                    230,

                flowerCount:
                    30,

                treeVariants: [
                    "oak",
                    "old",
                    "birch"
                ],

                flowerColors: [
                    "#d5c474",
                    "#c9909c",
                    "#aaa9d2",
                    "#d0cdb2"
                ]
            }
        );


        /*
            Mantém acesso das portas.
        */
        rebuildDynamicWorldObstacles(
            world
        );


        return world;
    }


    /* ============================================================
       CAMINHO 1 — ESTRADA
       ============================================================ */

    function buildRoadWorld() {
        const world =
            createEmptyWorld(
                "road"
            );


        world.paths.push({

            x: 0,
            y: 1000,
            w: 3300,
            h: 280

        });


        world.zones.push({

            id:
                "road_guardian_zone",

            x:
                2450,

            y:
                760,

            w:
                600,

            h:
                740,

            protected:
                true

        });


        setSpawn(
            world,
            "default",
            180,
            1140,
            "right"
        );


        setSpawn(
            world,
            "west",
            180,
            1140,
            "right"
        );


        setSpawn(
            world,
            "east",
            3100,
            1140,
            "left"
        );


        /*
            Guardião da Estrada.

            Só existe se NÃO derrotado.
        */
        addBossIfAlive(
            world,
            "road_guardian",
            {
                x:
                    2700,

                y:
                    1140
            }
        );


        /*
            Bloqueio invisível de progressão
            enquanto boss não morreu.

            Parte 3 vai removê-lo dinamicamente.
        */
        if (
            !isBossDefeated(
                "road_guardian"
            )
        ) {
            world.staticObstacles = [
                createSolidObstacle({

                    id:
                        "road_guardian_passage_block",

                    type:
                        "bossBarrier",

                    x:
                        2880,

                    y:
                        930,

                    w:
                        55,

                    h:
                        420,

                    solid:
                        true,

                    blocksLight:
                        false

                })
            ];
        }


        addExit(
            world,
            {
                id:
                    "road_to_village",

                x:
                    0,

                y:
                    980,

                w:
                    120,

                h:
                    320,

                destination:
                    "village",

                destinationSpawn:
                    "eastReturn",

                label:
                    "VOLTAR PARA A VILA",

                interactionKey:
                    "E"
            }
        );


        addExit(
            world,
            {
                id:
                    "road_to_forest",

                x:
                    3180,

                y:
                    970,

                w:
                    120,

                h:
                    330,

                destination:
                    "forest",

                destinationSpawn:
                    "west",

                label:
                    "ENTRAR NA FLORESTA",

                interactionKey:
                    "E",

                unlocked:
                    isBossDefeated(
                        "road_guardian"
                    ),

                lockedMessage:
                    "O Guardião da Estrada ainda bloqueia a passagem."
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    80,

                rockCount:
                    29,

                grassCount:
                    200,

                flowerCount:
                    17,

                treeVariants: [
                    "oak",
                    "old"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       FLORESTA
       ============================================================ */

    function buildForestWorld() {
        const world =
            createEmptyWorld(
                "forest"
            );


        world.paths.push(

            {
                x: 0,
                y: 1020,
                w: 3400,
                h: 250
            },

            {
                x: 1350,
                y: 580,
                w: 270,
                h: 800
            }

        );


        setSpawn(
            world,
            "default",
            180,
            1140,
            "right"
        );


        setSpawn(
            world,
            "west",
            180,
            1140,
            "right"
        );


        setSpawn(
            world,
            "east",
            3200,
            1140,
            "left"
        );


        world.npcs.push(
            createNPC({
                id:
                    "nara",

                name:
                    "NARA",

                x:
                    1320,

                y:
                    930,

                type:
                    "forestGuide"
            })
        );


        for (
            let index = 0;
            index < 10;
            index += 1
        ) {
            world.enemies.push(
                createEnemy(
                    index %
                    2 ===
                        0
                        ? "wolf"
                        : "boar",
                    {
                        x:
                            520 +
                            index *
                            230,

                        y:
                            index %
                            2 ===
                                0
                                ? 760
                                : 1470
                    }
                )
            );
        }


        addBossIfAlive(
            world,
            "forest_warden",
            {
                x:
                    2900,

                y:
                    1140
            }
        );


        addExit(
            world,
            {
                id:
                    "forest_to_road",

                x:
                    0,

                y:
                    980,

                w:
                    120,

                h:
                    330,

                destination:
                    "road",

                destinationSpawn:
                    "east",

                label:
                    "VOLTAR PARA A ESTRADA"
            }
        );


        addExit(
            world,
            {
                id:
                    "forest_to_grove",

                x:
                    3280,

                y:
                    980,

                w:
                    120,

                h:
                    330,

                destination:
                    "grove",

                destinationSpawn:
                    "west",

                label:
                    "SEGUIR PARA O BOSQUE",

                unlocked:
                    isBossDefeated(
                        "forest_warden"
                    ),

                lockedMessage:
                    "O Vigia da Floresta impede sua passagem."
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    160,

                rockCount:
                    32,

                grassCount:
                    280,

                flowerCount:
                    18,

                treeVariants: [
                    "pine",
                    "oak",
                    "old"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       BOSQUE
       ============================================================ */

    function buildGroveWorld() {
        const world =
            createEmptyWorld(
                "grove"
            );


        world.paths.push(

            {
                x: 0,
                y: 1030,
                w: 3500,
                h: 240
            },

            {
                x: 1540,
                y: 580,
                w: 260,
                h: 1060
            }

        );


        setSpawn(
            world,
            "default",
            180,
            1150,
            "right"
        );


        setSpawn(
            world,
            "west",
            180,
            1150,
            "right"
        );


        setSpawn(
            world,
            "east",
            3310,
            1150,
            "left"
        );


        world.npcs.push(
            createNPC({
                id:
                    "lyra",

                name:
                    "LYRA",

                x:
                    1630,

                y:
                    820,

                type:
                    "groveKeeper"
            })
        );


        for (
            let index = 0;
            index < 11;
            index += 1
        ) {
            world.enemies.push(
                createEnemy(
                    index %
                    3 ===
                        0
                        ? "thornling"
                        : "wolf",
                    {
                        x:
                            500 +
                            index *
                            230,

                        y:
                            index %
                            2 ===
                                0
                                ? 720
                                : 1570
                    }
                )
            );
        }


        addBossIfAlive(
            world,
            "grove_heart",
            {
                x:
                    3000,

                y:
                    1150
            }
        );


        addExit(
            world,
            {
                id:
                    "grove_to_forest",

                x:
                    0,

                y:
                    1000,

                w:
                    120,

                h:
                    320,

                destination:
                    "forest",

                destinationSpawn:
                    "east",

                label:
                    "VOLTAR PARA A FLORESTA"
            }
        );


        addExit(
            world,
            {
                id:
                    "grove_to_mountains",

                x:
                    3380,

                y:
                    1000,

                w:
                    120,

                h:
                    320,

                destination:
                    "mountains",

                destinationSpawn:
                    "west",

                label:
                    "SEGUIR PARA AS MONTANHAS",

                unlocked:
                    isBossDefeated(
                        "grove_heart"
                    )
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    145,

                rockCount:
                    30,

                grassCount:
                    300,

                flowerCount:
                    45,

                treeVariants: [
                    "old",
                    "willow",
                    "oak"
                ],

                flowerColors: [
                    "#d6b6c8",
                    "#e0d39b",
                    "#b6b7df",
                    "#b3d5a9"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       MONTANHAS
       ============================================================ */

    function buildMountainsWorld() {
        const world =
            createEmptyWorld(
                "mountains"
            );


        world.paths.push({

            x: 0,
            y: 1030,
            w: 3500,
            h: 250

        });


        setSpawn(
            world,
            "default",
            180,
            1150,
            "right"
        );


        setSpawn(
            world,
            "west",
            180,
            1150,
            "right"
        );


        setSpawn(
            world,
            "east",
            3300,
            1150,
            "left"
        );


        world.npcs.push(
            createNPC({
                id:
                    "kael",

                name:
                    "KAEL",

                x:
                    1380,

                y:
                    900,

                type:
                    "mountainScout"
            })
        );


        for (
            let index = 0;
            index < 10;
            index += 1
        ) {
            world.enemies.push(
                createEnemy(
                    "stoneCrawler",
                    {
                        x:
                            520 +
                            index *
                            250,

                        y:
                            index %
                            2 ===
                                0
                                ? 760
                                : 1510
                    }
                )
            );
        }


        addBossIfAlive(
            world,
            "mountain_titan",
            {
                x:
                    2980,

                y:
                    1150
            }
        );


        addExit(
            world,
            {
                id:
                    "mountains_to_grove",

                x:
                    0,

                y:
                    1000,

                w:
                    120,

                h:
                    330,

                destination:
                    "grove",

                destinationSpawn:
                    "east",

                label:
                    "VOLTAR PARA O BOSQUE"
            }
        );


        addExit(
            world,
            {
                id:
                    "mountains_to_iron",

                x:
                    3380,

                y:
                    1000,

                w:
                    120,

                h:
                    330,

                destination:
                    "ironRegion",

                destinationSpawn:
                    "west",

                label:
                    "DESCER PARA AS TERRAS DE FERRO",

                unlocked:
                    isBossDefeated(
                        "mountain_titan"
                    )
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    48,

                rockCount:
                    110,

                grassCount:
                    130,

                flowerCount:
                    8,

                treeVariants: [
                    "pine"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       FERRO
       ============================================================ */

    function buildIronWorld() {
        const world =
            createEmptyWorld(
                "ironRegion"
            );


        world.paths.push({

            x: 0,
            y: 1000,
            w: 3400,
            h: 280

        });


        setSpawn(
            world,
            "default",
            180,
            1140,
            "right"
        );


        setSpawn(
            world,
            "west",
            180,
            1140,
            "right"
        );


        setSpawn(
            world,
            "east",
            3220,
            1140,
            "left"
        );


        for (
            let index = 0;
            index < 12;
            index += 1
        ) {
            world.enemies.push(
                createEnemy(
                    "mineCrawler",
                    {
                        x:
                            440 +
                            index *
                            235,

                        y:
                            index %
                            2 ===
                                0
                                ? 760
                                : 1490
                    }
                )
            );
        }


        addBossIfAlive(
            world,
            "iron_colossus",
            {
                x:
                    2920,

                y:
                    1140
            }
        );


        addExit(
            world,
            {
                id:
                    "iron_to_mountains",

                x:
                    0,

                y:
                    980,

                w:
                    120,

                h:
                    330,

                destination:
                    "mountains",

                destinationSpawn:
                    "east",

                label:
                    "VOLTAR PARA AS MONTANHAS"
            }
        );


        addExit(
            world,
            {
                id:
                    "iron_to_ruby",

                x:
                    3280,

                y:
                    980,

                w:
                    120,

                h:
                    330,

                destination:
                    "rubyRegion",

                destinationSpawn:
                    "west",

                label:
                    "SEGUIR PARA O VALE DE RUBI",

                unlocked:
                    isBossDefeated(
                        "iron_colossus"
                    )
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    32,

                rockCount:
                    100,

                grassCount:
                    105,

                flowerCount:
                    3,

                treeVariants: [
                    "dead"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       RUBI

       A PORTA SECRETA FICA ANTES DO LABIRINTO.
       ELA FICA NA PARTE DE CIMA DO MAPA.
       NÃO NA LATERAL.
       ============================================================ */

    function buildRubyWorld() {
        const world =
            createEmptyWorld(
                "rubyRegion"
            );


        world.paths.push(

            {
                x: 0,
                y: 1020,
                w: 3500,
                h: 250
            },

            /*
                Caminho discreto para a porta secreta.
            */
            {
                x: 2420,
                y: 340,
                w: 190,
                h: 820
            }

        );


        setSpawn(
            world,
            "default",
            180,
            1140,
            "right"
        );


        setSpawn(
            world,
            "west",
            180,
            1140,
            "right"
        );


        setSpawn(
            world,
            "east",
            3300,
            1140,
            "left"
        );


        setSpawn(
            world,
            "secretReturn",
            2520,
            620,
            "down"
        );


        for (
            let index = 0;
            index < 12;
            index += 1
        ) {
            world.enemies.push(
                createEnemy(
                    "rubyHound",
                    {
                        x:
                            480 +
                            index *
                            230,

                        y:
                            index %
                            2 ===
                                0
                                ? 760
                                : 1500
                    }
                )
            );
        }


        addBossIfAlive(
            world,
            "ruby_chimera",
            {
                x:
                    3000,

                y:
                    1140
            }
        );


        /*
            PORTA SECRETA DO VAZIO.
        */
        const quest =
            state.player
                ?.miguelQuest;


        world.secretDoors.push({

            id:
                "void_secret_door",

            x:
                2430,

            y:
                180,

            w:
                180,

            h:
                90,

            side:
                "top",

            destination:
                "voidDungeon",

            discovered:
                Boolean(
                    quest
                        ?.secretDoorDiscovered
                ),

            opened:
                Boolean(
                    quest
                        ?.secretDoorOpened
                ),

            locked:
                !quest
                    ?.secretDoorOpened,

            requiresItem:
                "chaveObscura",

            label:
                "PORTA SECRETA DO VAZIO"

        });


        addExit(
            world,
            {
                id:
                    "ruby_to_iron",

                x:
                    0,

                y:
                    980,

                w:
                    120,

                h:
                    330,

                destination:
                    "ironRegion",

                destinationSpawn:
                    "east",

                label:
                    "VOLTAR PARA AS TERRAS DE FERRO"
            }
        );


        addExit(
            world,
            {
                id:
                    "ruby_to_maze",

                x:
                    3380,

                y:
                    980,

                w:
                    120,

                h:
                    330,

                destination:
                    "monarchMaze",

                destinationSpawn:
                    "west",

                label:
                    "ENTRAR NO LABIRINTO",

                unlocked:
                    isBossDefeated(
                        "ruby_chimera"
                    )
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    42,

                rockCount:
                    82,

                grassCount:
                    105,

                flowerCount:
                    7,

                treeVariants: [
                    "dead",
                    "ruby"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       LABIRINTO
       ============================================================ */

    function buildMazeWorld() {
        const world =
            createEmptyWorld(
                "monarchMaze"
            );


        setSpawn(
            world,
            "default",
            160,
            1150,
            "right"
        );


        setSpawn(
            world,
            "west",
            160,
            1150,
            "right"
        );


        /*
            Corredores.
        */
        world.paths.push(

            {
                x: 0,
                y: 1050,
                w: 900,
                h: 210
            },

            {
                x: 760,
                y: 420,
                w: 200,
                h: 840
            },

            {
                x: 760,
                y: 390,
                w: 950,
                h: 200
            },

            {
                x: 1510,
                y: 390,
                w: 200,
                h: 1070
            },

            {
                x: 1510,
                y: 1260,
                w: 1040,
                h: 200
            },

            {
                x: 2350,
                y: 650,
                w: 200,
                h: 810
            },

            {
                x: 2350,
                y: 620,
                w: 980,
                h: 200
            }

        );


        /*
            Paredes principais do labirinto.
        */
        const wallData = [

            [700, 0, 90, 960],
            [700, 1310, 90, 990],

            [990, 0, 90, 350],
            [990, 620, 90, 1680],

            [1440, 0, 90, 350],
            [1440, 600, 90, 600],
            [1440, 1500, 90, 800],

            [1740, 0, 90, 1200],
            [1740, 1510, 90, 790],

            [2280, 0, 90, 580],
            [2280, 860, 90, 350],
            [2280, 1510, 90, 790],

            [2580, 0, 90, 570],
            [2580, 850, 90, 1450],

            [3260, 0, 100, 2300]

        ];


        wallData.forEach(
            (
                [
                    x,
                    y,
                    w,
                    h
                ],
                index
            ) => {
                world.walls.push({

                    id:
                        `maze_wall_${index}`,

                    x,
                    y,
                    w,
                    h,

                    blocksLight:
                        true

                });
            }
        );


        /*
            Inimigos do labirinto:
            também dão Essência Sombria
            APENAS depois que a missão foi aceita.
        */
        const mazeEnemySpawns = [

            [520, 1120, "spider"],
            [860, 760, "scorpion"],
            [1210, 470, "bat"],
            [1600, 840, "spider"],
            [1600, 1360, "goblin"],
            [2050, 1360, "scorpion"],
            [2450, 1050, "bat"],
            [2800, 730, "goblin"],
            [3070, 730, "spider"]

        ];


        mazeEnemySpawns.forEach(
            (
                [
                    x,
                    y,
                    species
                ],
                index
            ) => {
                world.enemies.push(
                    createEnemy(
                        species,
                        {
                            entityId:
                                `maze_enemy_${index}`,

                            x,
                            y,

                            drops: {
                                essenciaSombria:
                                    1
                            }
                        }
                    )
                );
            }
        );


        addBossIfAlive(
            world,
            "monarch",
            {
                x:
                    3200,

                y:
                    720
            }
        );


        addExit(
            world,
            {
                id:
                    "maze_to_ruby",

                x:
                    0,

                y:
                    1010,

                w:
                    110,

                h:
                    290,

                destination:
                    "rubyRegion",

                destinationSpawn:
                    "east",

                label:
                    "SAIR DO LABIRINTO"
            }
        );


        rebuildDynamicWorldObstacles(
            world
        );


        return world;
    }


    /* ============================================================
       CAMINHO 2 — JARDINS DOS GNOMOS
       ============================================================ */

    function buildGnomeGardensWorld() {
        const world =
            createEmptyWorld(
                "gnomeGardens"
            );


        world.paths.push(

            {
                x: 1500,
                y: 1780,
                w: 300,
                h: 470
            },

            {
                x: 1500,
                y: 700,
                w: 300,
                h: 1150
            },

            {
                x: 420,
                y: 820,
                w: 2460,
                h: 220
            }

        );


        setSpawn(
            world,
            "default",
            1650,
            2070,
            "up"
        );


        setSpawn(
            world,
            "south",
            1650,
            2070,
            "up"
        );


        setSpawn(
            world,
            "north",
            1650,
            250,
            "down"
        );


        /*
            Pequenas construções gnômicas.
        */
        const cottages = [

            {
                id: "gnome_house_1",
                x: 560,
                y: 520,
                w: 270,
                h: 210,
                style: "gnome"
            },

            {
                id: "gnome_house_2",
                x: 1040,
                y: 1240,
                w: 260,
                h: 205,
                style: "gnome"
            },

            {
                id: "gnome_house_3",
                x: 2240,
                y: 520,
                w: 280,
                h: 215,
                style: "gnome"
            }

        ];


        for (
            const cottage of
            cottages
        ) {
            const building =
                createBuilding({
                    ...cottage,
                    doorSide:
                        "bottom",
                    solid:
                        true
                });

            world.buildings.push(
                building
            );

            attachDoorToBuilding(
                building,
                world
            );
        }


        /*
            Inimigos leves.
        */
        for (
            let index = 0;
            index < 8;
            index += 1
        ) {
            world.enemies.push(
                createEnemy(
                    index %
                    2 ===
                        0
                        ? "goblin"
                        : "spider",
                    {
                        x:
                            500 +
                            index *
                            300,

                        y:
                            index %
                            2 ===
                                0
                                ? 1100
                                : 1500
                    }
                )
            );
        }


        addExit(
            world,
            {
                id:
                    "gnome_to_village",

                x:
                    1480,

                y:
                    2130,

                w:
                    340,

                h:
                    120,

                destination:
                    "village",

                destinationSpawn:
                    "northReturn",

                label:
                    "VOLTAR PARA A VILA"
            }
        );


        addExit(
            world,
            {
                id:
                    "gnome_to_fairy",

                x:
                    1480,

                y:
                    0,

                w:
                    340,

                h:
                    120,

                destination:
                    "fairyKingdom",

                destinationSpawn:
                    "south",

                label:
                    "ENTRAR NO REINO FEÉRICO"
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    95,

                rockCount:
                    18,

                grassCount:
                    320,

                flowerCount:
                    85,

                treeVariants: [
                    "round",
                    "birch",
                    "fruit"
                ],

                flowerColors: [
                    "#f3d88d",
                    "#dba2bd",
                    "#b5d3f0",
                    "#d7bcf0",
                    "#bee3a7"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       REINO FEÉRICO
       ============================================================ */

    function buildFairyKingdomWorld() {
        const world =
            createEmptyWorld(
                "fairyKingdom"
            );


        world.paths.push(

            {
                x: 1530,
                y: 1700,
                w: 300,
                h: 550
            },

            {
                x: 1530,
                y: 300,
                w: 300,
                h: 1500
            },

            {
                x: 720,
                y: 820,
                w: 1900,
                h: 230
            }

        );


        setSpawn(
            world,
            "default",
            1680,
            2060,
            "up"
        );


        setSpawn(
            world,
            "south",
            1680,
            2060,
            "up"
        );


        setSpawn(
            world,
            "north",
            1680,
            210,
            "down"
        );


        for (
            let index = 0;
            index < 9;
            index += 1
        ) {
            world.enemies.push(
                createEnemy(
                    index %
                    2 ===
                        0
                        ? "thornling"
                        : "bat",
                    {
                        x:
                            620 +
                            index *
                            270,

                        y:
                            index %
                            2 ===
                                0
                                ? 760
                                : 1390
                    }
                )
            );
        }


        /*
            boss de transição do reino bonito
            para a Fronteira Celestial.

            Usamos forest_warden visualmente
            diferente apenas como placeholder?
            NÃO.

            Não inventamos boss novo aqui sem
            necessidade. Deixamos um guardião
            de progressão usando path_guardian
            apenas na escada celestial depois.
        */


        addExit(
            world,
            {
                id:
                    "fairy_to_gnome",

                x:
                    1510,

                y:
                    2130,

                w:
                    340,

                h:
                    120,

                destination:
                    "gnomeGardens",

                destinationSpawn:
                    "north",

                label:
                    "VOLTAR PARA OS JARDINS"
            }
        );


        addExit(
            world,
            {
                id:
                    "fairy_to_frontier",

                x:
                    1510,

                y:
                    0,

                w:
                    340,

                h:
                    120,

                destination:
                    "celestialFrontier",

                destinationSpawn:
                    "south",

                label:
                    "SEGUIR PARA A FRONTEIRA CELESTIAL"
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    115,

                rockCount:
                    15,

                grassCount:
                    330,

                flowerCount:
                    105,

                treeVariants: [
                    "fairy",
                    "willow",
                    "glow"
                ],

                flowerColors: [
                    "#f7c6e2",
                    "#d0b8f5",
                    "#bcd7ff",
                    "#d4edb3"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       FRONTEIRA CELESTIAL

       METADE FADA / METADE CÉU.

       NÃO É TRANSIÇÃO DE TELA.
       É TRANSIÇÃO DO PRÓPRIO MAPA.
       ============================================================ */

    function buildCelestialFrontierWorld() {
        const world =
            createEmptyWorld(
                "celestialFrontier"
            );


        world.paths.push(

            {
                x: 1650,
                y: 1700,
                w: 300,
                h: 650
            },

            {
                x: 1650,
                y: 250,
                w: 300,
                h: 1550
            },

            {
                x: 600,
                y: 960,
                w: 2400,
                h: 240
            }

        );


        setSpawn(
            world,
            "default",
            1800,
            2150,
            "up"
        );


        setSpawn(
            world,
            "south",
            1800,
            2150,
            "up"
        );


        setSpawn(
            world,
            "north",
            1800,
            180,
            "down"
        );


        /*
            Zonas ambientais:
            0–50% = fada
            50–100% = céu.
        */
        world.zones.push(

            {
                id:
                    "fairy_half",

                x:
                    0,

                y:
                    1175,

                w:
                    3600,

                h:
                    1175,

                biomeOverride:
                    "fairy",

                protected:
                    false
            },

            {
                id:
                    "sky_half",

                x:
                    0,

                y:
                    0,

                w:
                    3600,

                h:
                    1175,

                biomeOverride:
                    "celestial",

                protected:
                    false
            },

            {
                id:
                    "environment_blend",

                x:
                    0,

                y:
                    1040,

                w:
                    3600,

                h:
                    270,

                biomeBlend:
                    true,

                protected:
                    false
            }

        );


        /*
            CHAVE OBSCURA:
            fica escondida ANTES da progressão
            celestial principal.

            Exige 15 Essências Sombrias.
        */
        const quest =
            state.player
                ?.miguelQuest;


        if (
            quest
                ?.missionAccepted &&
            !quest
                ?.keyCollected
        ) {
            world.resources.push({

                id:
                    "dark_key_resource",

                type:
                    "darkKey",

                x:
                    660,

                y:
                    1520,

                radius:
                    30,

                hidden:
                    true,

                requiresItem:
                    "essenciaSombria",

                requiresAmount:
                    VOID_MISSION_CONFIG
                        .shadowEssenceRequired,

                collected:
                    false

            });
        }


        /*
            Criaturas da fronteira.
        */
        for (
            let index = 0;
            index < 10;
            index += 1
        ) {
            world.enemies.push(
                createEnemy(
                    index <
                    5
                        ? (
                            index %
                            2 ===
                                0
                                ? "thornling"
                                : "bat"
                        )
                        : (
                            index %
                            2 ===
                                0
                                ? "wolf"
                                : "scorpion"
                        ),
                    {
                        x:
                            620 +
                            index *
                            280,

                        y:
                            index <
                            5
                                ? 1580
                                : 680
                    }
                )
            );
        }


        addExit(
            world,
            {
                id:
                    "frontier_to_fairy",

                x:
                    1630,

                y:
                    2230,

                w:
                    340,

                h:
                    120,

                destination:
                    "fairyKingdom",

                destinationSpawn:
                    "north",

                label:
                    "VOLTAR PARA O REINO FEÉRICO"
            }
        );


        addExit(
            world,
            {
                id:
                    "frontier_to_stair",

                x:
                    1630,

                y:
                    0,

                w:
                    340,

                h:
                    120,

                destination:
                    "celestialStair",

                destinationSpawn:
                    "south",

                label:
                    "ALCANÇAR A ESCADA CELESTIAL"
            }
        );


        /*
            Ambiente customizado manualmente.
        */
        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    95,

                rockCount:
                    22,

                grassCount:
                    250,

                flowerCount:
                    65,

                treeVariants: [
                    "fairy",
                    "glow"
                ],

                flowerColors: [
                    "#efc3e4",
                    "#cdb9f5",
                    "#d6e7ff"
                ]
            }
        );


        /*
            Menos árvores no topo celestial.
        */
        world.trees =
            world.trees.filter(
                tree =>
                    !(
                        tree.y <
                            970 &&
                        Math.random() <
                            0.67
                    )
            );


        rebuildDynamicWorldObstacles(
            world
        );


        return world;
    }


    /* ============================================================
       ESCADA CELESTIAL
       ============================================================ */

    function buildCelestialStairWorld() {
        const world =
            createEmptyWorld(
                "celestialStair"
            );


        world.paths.push({

            x: 1430,
            y: 0,
            w: 340,
            h: 2200

        });


        setSpawn(
            world,
            "default",
            1600,
            2050,
            "up"
        );


        setSpawn(
            world,
            "south",
            1600,
            2050,
            "up"
        );


        setSpawn(
            world,
            "north",
            1600,
            180,
            "down"
        );


        /*
            Guardião da Escada/Caminho.

            Esse é o boss que testa o Dash.
        */
        addBossIfAlive(
            world,
            "path_guardian",
            {
                x:
                    1600,

                y:
                    800
            }
        );


        addExit(
            world,
            {
                id:
                    "stair_to_frontier",

                x:
                    1430,

                y:
                    2080,

                w:
                    340,

                h:
                    120,

                destination:
                    "celestialFrontier",

                destinationSpawn:
                    "north",

                label:
                    "DESCER PARA A FRONTEIRA"
            }
        );


        addExit(
            world,
            {
                id:
                    "stair_to_sky1",

                x:
                    1430,

                y:
                    0,

                w:
                    340,

                h:
                    120,

                destination:
                    "skyOne",

                destinationSpawn:
                    "south",

                label:
                    "SUBIR AO CÉU I",

                unlocked:
                    isBossDefeated(
                        "path_guardian"
                    ),

                lockedMessage:
                    "O Guardião do Caminho ainda bloqueia a subida."
            }
        );


        world.decorations.push(
            {
                type:
                    "celestialStairs",

                x:
                    1430,

                y:
                    0,

                w:
                    340,

                h:
                    2200,

                steps:
                    34
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    12,

                rockCount:
                    28,

                grassCount:
                    70,

                flowerCount:
                    16,

                treeVariants: [
                    "pale"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       CÉU I
       ============================================================ */

    function buildSkyOneWorld() {
        const world =
            createEmptyWorld(
                "skyOne"
            );


        world.paths.push({

            x: 1450,
            y: 0,
            w: 500,
            h: 2250

        });


        setSpawn(
            world,
            "default",
            1700,
            2080,
            "up"
        );


        setSpawn(
            world,
            "south",
            1700,
            2080,
            "up"
        );


        setSpawn(
            world,
            "north",
            1700,
            180,
            "down"
        );


        /*
            Preparação para as 5 hordas.
            Parte 3 controla ativação.
        */
        world.zones.push(
            {
                id:
                    "sky_trial_zone",

                x:
                    900,

                y:
                    500,

                w:
                    1600,

                h:
                    1200,

                trial:
                    "skyHordes",

                protected:
                    true
            }
        );


        addExit(
            world,
            {
                id:
                    "sky1_to_stair",

                x:
                    1450,

                y:
                    2130,

                w:
                    500,

                h:
                    120,

                destination:
                    "celestialStair",

                destinationSpawn:
                    "north",

                label:
                    "DESCER A ESCADA CELESTIAL"
            }
        );


        addExit(
            world,
            {
                id:
                    "sky1_to_sky2",

                x:
                    1450,

                y:
                    0,

                w:
                    500,

                h:
                    120,

                destination:
                    "skyTwo",

                destinationSpawn:
                    "south",

                label:
                    "SEGUIR PARA O CÉU II",

                unlocked:
                    Boolean(
                        state.player
                            ?.skyTrial
                            ?.complete
                    )
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    8,

                rockCount:
                    18,

                grassCount:
                    55,

                flowerCount:
                    12,

                treeVariants: [
                    "cloudTree"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       CÉU II
       ============================================================ */

    function buildSkyTwoWorld() {
        const world =
            createEmptyWorld(
                "skyTwo"
            );


        world.paths.push({

            x: 1450,
            y: 0,
            w: 500,
            h: 2250

        });


        setSpawn(
            world,
            "default",
            1700,
            2080,
            "up"
        );


        setSpawn(
            world,
            "south",
            1700,
            2080,
            "up"
        );


        setSpawn(
            world,
            "north",
            1700,
            180,
            "down"
        );


        for (
            let index = 0;
            index < 10;
            index += 1
        ) {
            world.enemies.push(
                createEnemy(
                    index %
                    3 ===
                        0
                        ? "bat"
                        : "wolf",
                    {
                        x:
                            650 +
                            index *
                            220,

                        y:
                            index %
                            2 ===
                                0
                                ? 750
                                : 1450
                    }
                )
            );
        }


        addExit(
            world,
            {
                id:
                    "sky2_to_sky1",

                x:
                    1450,

                y:
                    2130,

                w:
                    500,

                h:
                    120,

                destination:
                    "skyOne",

                destinationSpawn:
                    "north",

                label:
                    "VOLTAR PARA O CÉU I"
            }
        );


        addExit(
            world,
            {
                id:
                    "sky2_to_sky3",

                x:
                    1450,

                y:
                    0,

                w:
                    500,

                h:
                    120,

                destination:
                    "skyThree",

                destinationSpawn:
                    "south",

                label:
                    "SEGUIR PARA O CÉU III"
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    7,

                rockCount:
                    20,

                grassCount:
                    50,

                flowerCount:
                    8,

                treeVariants: [
                    "cloudTree"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       CÉU III

       PREPARADO, MAS NÃO INVENTA HABILIDADE NOVA.
       ============================================================ */

    function buildSkyThreeWorld() {
        const world =
            createEmptyWorld(
                "skyThree"
            );


        world.paths.push({

            x: 1450,
            y: 0,
            w: 500,
            h: 2250

        });


        setSpawn(
            world,
            "default",
            1700,
            2080,
            "up"
        );


        setSpawn(
            world,
            "south",
            1700,
            2080,
            "up"
        );


        world.decorations.push({

            type:
                "reservedShrine",

            x:
                1700,

            y:
                740,

            radius:
                140,

            label:
                "ALGO AINDA DORME AQUI"

        });


        addExit(
            world,
            {
                id:
                    "sky3_to_sky2",

                x:
                    1450,

                y:
                    2130,

                w:
                    500,

                h:
                    120,

                destination:
                    "skyTwo",

                destinationSpawn:
                    "north",

                label:
                    "VOLTAR PARA O CÉU II"
            }
        );


        populateNaturalEnvironment(
            world,
            {
                treeCount:
                    5,

                rockCount:
                    12,

                grassCount:
                    40,

                flowerCount:
                    5,

                treeVariants: [
                    "cloudTree"
                ]
            }
        );


        return world;
    }


    /* ============================================================
       DUNGEON DO VAZIO

       FUNCIONA COMO INTERIOR/CASA,
       MAS É UMA ÁREA PRÓPRIA.

       NÃO É POSSÍVEL SAIR NORMALMENTE
       DEPOIS QUE VAELKOR COMEÇA.

       MINIMAPA:
       SEM SINAL.
       ============================================================ */

    function buildVoidDungeonWorld() {
        const world =
            createEmptyWorld(
                "voidDungeon"
            );


        world.flags.minimapSignal =
            false;


        world.flags.naturallyLit =
            false;


        /*
            Entrada.
        */
        setSpawn(
            world,
            "default",
            250,
            900,
            "right"
        );


        setSpawn(
            world,
            "entrance",
            250,
            900,
            "right"
        );


        /*
            Corredor estreito.
        */
        world.paths.push(

            {
                x: 120,
                y: 760,
                w: 1580,
                h: 280
            },

            /*
                entrada da arena.
            */
            {
                x: 1550,
                y: 690,
                w: 360,
                h: 420
            },

            /*
                arena circular representada
                por área ampla.
            */
            {
                x: 1700,
                y: 350,
                w: 920,
                h: 1100
            }

        );


        /*
            Paredes do corredor.
        */
        world.walls.push(

            {
                id:
                    "void_wall_top",

                x:
                    0,

                y:
                    0,

                w:
                    1700,

                h:
                    720,

                blocksLight:
                    true
            },

            {
                id:
                    "void_wall_bottom",

                x:
                    0,

                y:
                    1080,

                w:
                    1700,

                h:
                    720,

                blocksLight:
                    true
            },

            {
                id:
                    "void_arena_left_upper",

                x:
                    1640,

                y:
                    0,

                w:
                    1160,

                h:
                    270,

                blocksLight:
                    true
            },

            {
                id:
                    "void_arena_left_lower",

                x:
                    1640,

                y:
                    1530,

                w:
                    1160,

                h:
                    270,

                blocksLight:
                    true
            }

        );


        /*
            Zona escura do corredor.
        */
        world.zones.push(

            {
                id:
                    "void_dark_corridor",

                x:
                    0,

                y:
                    600,

                w:
                    1710,

                h:
                    600,

                dark:
                    true,

                requiresLantern:
                    true,

                protected:
                    false
            },

            /*
                Arena naturalmente visível.
            */
            {
                id:
                    "vaelkor_arena",

                x:
                    1700,

                y:
                    250,

                w:
                    1050,

                h:
                    1300,

                arena:
                    true,

                naturallyLit:
                    true,

                protected:
                    true
            }

        );


        /*
            Inimigos sombrios aprimorados.
        */
        const quest =
            state.player
                ?.miguelQuest;


        const defeatedIds =
            new Set(
                safeArray(
                    quest
                        ?.clearedDungeonEnemyIds
                )
            );


        const dungeonEnemyData = [

            ["void_enemy_1", 520, 870, "voidSpider"],
            ["void_enemy_2", 760, 930, "voidGoblin"],
            ["void_enemy_3", 1020, 850, "voidSpider"],
            ["void_enemy_4", 1260, 950, "voidStalker"],
            ["void_enemy_5", 1480, 870, "voidGoblin"]

        ];


        for (
            const [
                entityId,
                x,
                y,
                species
            ] of
            dungeonEnemyData
        ) {
            if (
                defeatedIds.has(
                    entityId
                )
            ) {
                continue;
            }

            world.enemies.push(
                createEnemy(
                    species,
                    {
                        entityId,
                        questEnemyId:
                            entityId,
                        x,
                        y
                    }
                )
            );
        }


        /*
            Vaelkor:
            só existe se ainda não morreu.
        */
        if (
            !quest
                ?.vaelkorDefeated &&
            !isBossDefeated(
                "vaelkor"
            )
        ) {
            addBossIfAlive(
                world,
                "vaelkor",
                {
                    x:
                        2250,

                    y:
                        900,

                    arenaId:
                        "vaelkor_arena"
                }
            );
        }


        /*
            Fragmento depois da morte.
        */
        if (
            quest
                ?.vaelkorDefeated &&
            !quest
                ?.fragmentCollected
        ) {
            world.resources.push({

                id:
                    "void_fragment",

                type:
                    "voidFragment",

                x:
                    2250,

                y:
                    900,

                radius:
                    34,

                collectible:
                    true,

                minigame:
                    true

            });
        }


        /*
            Saída só fica liberada se:
            - Vaelkor não foi ativado ainda
              OU
            - Vaelkor morreu.

            Depois da cutscene de boss,
            porta fecha.
        */
        addExit(
            world,
            {
                id:
                    "void_exit",

                x:
                    0,

                y:
                    760,

                w:
                    120,

                h:
                    280,

                destination:
                    "rubyRegion",

                destinationSpawn:
                    "secretReturn",

                label:
                    "SAIR DA ÁREA SECRETA",

                unlocked:
                    !quest
                        ?.vaelkorActivated ||
                    Boolean(
                        quest
                            ?.vaelkorDefeated
                    ),

                lockedMessage:
                    "As portas da arena estão seladas."
            }
        );


        world.decorations.push(

            {
                type:
                    "voidSymbol",

                x:
                    600,

                y:
                    900,

                radius:
                    42
            },

            {
                type:
                    "voidSymbol",

                x:
                    1160,

                y:
                    900,

                radius:
                    34
            },

            {
                type:
                    "voidPillar",

                x:
                    1880,

                y:
                    510,

                h:
                    130
            },

            {
                type:
                    "voidPillar",

                x:
                    2620,

                y:
                    510,

                h:
                    130
            },

            {
                type:
                    "voidPillar",

                x:
                    1880,

                y:
                    1290,

                h:
                    130
            },

            {
                type:
                    "voidPillar",

                x:
                    2620,

                y:
                    1290,

                h:
                    130
            }

        );


        rebuildDynamicWorldObstacles(
            world
        );


        return world;
    }


    /* ============================================================
       INTERIORES
       ============================================================ */

    function createHouseWorld(
        houseId
    ) {
        const config =
            HOUSE_INTERIORS[
                houseId
            ];

        if (!config) {
            return null;
        }


        const world = {

            id:
                `interior_${houseId}`,

            name:
                config.name,

            width:
                config.worldWidth,

            height:
                config.worldHeight,

            interior:
                true,

            interiorId:
                houseId,

            theme:
                config.theme,


            paths:
                [],

            buildings:
                [],

            doors:
                [],

            trees:
                [],

            rocks:
                [],

            grass:
                [],

            flowers:
                [],

            decorations:
                [],

            particles:
                [],


            obstacles:
                [],

            staticObstacles:
                [],


            npcs:
                [],

            enemies:
                [],

            bosses:
                [],

            resources:
                [],

            exits:
                [],

            gates:
                [],

            secretDoors:
                [],

            zones:
                [],

            walls:
                [],

            spawnPoints:
                {},

            room:
                {
                    ...config.room
                },

            flags: {
                minimapSignal:
                    false,

                naturallyLit:
                    true
            }

        };


        setSpawn(
            world,
            "default",
            config.playerSpawn.x,
            config.playerSpawn.y,
            "up"
        );


        /*
            Paredes da sala.

            Criadas deixando espaço na porta.
        */
        const room =
            config.room;

        const door =
            config.door;


        const thickness =
            28;


        world.walls.push(

            {
                id:
                    `${houseId}_wall_top`,
                x:
                    room.x,
                y:
                    room.y,
                w:
                    room.w,
                h:
                    thickness,
                blocksLight:
                    true
            },

            {
                id:
                    `${houseId}_wall_left`,
                x:
                    room.x,
                y:
                    room.y,
                w:
                    thickness,
                h:
                    room.h,
                blocksLight:
                    true
            },

            {
                id:
                    `${houseId}_wall_right`,
                x:
                    room.x +
                    room.w -
                    thickness,
                y:
                    room.y,
                w:
                    thickness,
                h:
                    room.h,
                blocksLight:
                    true
            }

        );


        /*
            Parede inferior dividida pela porta.
        */
        const leftBottomWidth =
            door.x -
            room.x;


        const rightStart =
            door.x +
            door.w;


        const rightBottomWidth =
            room.x +
            room.w -
            rightStart;


        world.walls.push(

            {
                id:
                    `${houseId}_wall_bottom_left`,
                x:
                    room.x,
                y:
                    room.y +
                    room.h -
                    thickness,
                w:
                    leftBottomWidth,
                h:
                    thickness,
                blocksLight:
                    true
            },

            {
                id:
                    `${houseId}_wall_bottom_right`,
                x:
                    rightStart,
                y:
                    room.y +
                    room.h -
                    thickness,
                w:
                    rightBottomWidth,
                h:
                    thickness,
                blocksLight:
                    true
            }

        );


        world.exits.push({

            id:
                `${houseId}_exit`,

            x:
                door.x,

            y:
                door.y,

            w:
                door.w,

            h:
                door.h,

            destination:
                "outside",

            label:
                "SAIR",

            interactionKey:
                "Z",

            requiresInteraction:
                true,

            unlocked:
                true

        });


        /*
            Decoração única de cada interior.
        */
        populateInteriorDecorations(
            world,
            houseId
        );


        rebuildDynamicWorldObstacles(
            world
        );


        return world;
    }


    function populateInteriorDecorations(
        world,
        houseId
    ) {
        switch (
            houseId
        ) {
            case "home":
                world.decorations.push(
                    {
                        type:
                            "bed",
                        x:
                            250,
                        y:
                            220
                    },
                    {
                        type:
                            "chest",
                        x:
                            820,
                        y:
                            210
                    },
                    {
                        type:
                            "rug",
                        x:
                            540,
                        y:
                            360,
                        w:
                            260,
                        h:
                            150
                    },
                    {
                        type:
                            "table",
                        x:
                            710,
                        y:
                            400
                    }
                );
                break;


            case "elianHome":
                world.decorations.push(
                    {
                        type:
                            "bookshelf",
                        x:
                            240,
                        y:
                            190
                    },
                    {
                        type:
                            "bookshelf",
                        x:
                            840,
                        y:
                            190
                    },
                    {
                        type:
                            "archiveTable",
                        x:
                            540,
                        y:
                            350
                    },
                    {
                        type:
                            "papers",
                        x:
                            600,
                        y:
                            335
                    }
                );
                break;


            case "shop":
                world.decorations.push(
                    {
                        type:
                            "counter",
                        x:
                            550,
                        y:
                            290,
                        w:
                            430
                    },
                    {
                        type:
                            "shelves",
                        x:
                            250,
                        y:
                            190
                    },
                    {
                        type:
                            "crates",
                        x:
                            870,
                        y:
                            450
                    }
                );

                world.npcs.push(
                    createNPC({
                        id:
                            "doran",
                        name:
                            "DORAN",
                        x:
                            550,
                        y:
                            220,
                        type:
                            "merchant",
                        vendor:
                            "doran"
                    })
                );

                break;


            case "forge":
                world.decorations.push(
                    {
                        type:
                            "forgeFire",
                        x:
                            270,
                        y:
                            250
                    },
                    {
                        type:
                            "anvil",
                        x:
                            610,
                        y:
                            340
                    },
                    {
                        type:
                            "weaponRack",
                        x:
                            880,
                        y:
                            220
                    },
                    {
                        type:
                            "coalPile",
                        x:
                            830,
                        y:
                            470
                    }
                );

                world.npcs.push(
                    createNPC({
                        id:
                            "borin",
                        name:
                            "BORIN",
                        x:
                            570,
                        y:
                            250,
                        type:
                            "blacksmith",
                        vendor:
                            "borin"
                    })
                );

                break;


            case "woodshop":
                world.decorations.push(
                    {
                        type:
                            "workbench",
                        x:
                            540,
                        y:
                            320
                    },
                    {
                        type:
                            "woodStack",
                        x:
                            250,
                        y:
                            250
                    },
                    {
                        type:
                            "toolsWall",
                        x:
                            800,
                        y:
                            180
                    }
                );

                world.npcs.push(
                    createNPC({
                        id:
                            "bran",
                        name:
                            "BRAN",
                        x:
                            545,
                        y:
                            245,
                        type:
                            "woodworker",
                        questId:
                            "wood"
                    })
                );

                break;
        }
    }


    /* ============================================================
       BUILD WORLD
       ============================================================ */

    function buildWorld(
        areaId,
        options = {}
    ) {
        switch (
            areaId
        ) {
            case "village":
                return buildVillageWorld();

            case "road":
                return buildRoadWorld();

            case "forest":
                return buildForestWorld();

            case "grove":
                return buildGroveWorld();

            case "mountains":
                return buildMountainsWorld();

            case "ironRegion":
                return buildIronWorld();

            case "rubyRegion":
                return buildRubyWorld();

            case "monarchMaze":
                return buildMazeWorld();

            case "gnomeGardens":
                return buildGnomeGardensWorld();

            case "fairyKingdom":
                return buildFairyKingdomWorld();

            case "celestialFrontier":
                return buildCelestialFrontierWorld();

            case "celestialStair":
                return buildCelestialStairWorld();

            case "skyOne":
                return buildSkyOneWorld();

            case "skyTwo":
                return buildSkyTwoWorld();

            case "skyThree":
                return buildSkyThreeWorld();

            case "voidDungeon":
                return buildVoidDungeonWorld();

            default:
                console.warn(
                    `VEYRA — região desconhecida: ${areaId}`
                );

                return buildVillageWorld();
        }
    }


    /* ============================================================
       LOAD WORLD
       ============================================================ */

    function loadWorld(
        areaId,
        spawnId =
            "default"
    ) {
        const world =
            buildWorld(
                areaId
            );


        if (!world) {
            return false;
        }


        state.area =
            areaId;


        state.world =
            world;


        state.houseMode =
            false;


        state.currentHouse =
            null;


        const player =
            state.player;


        if (player) {
            const spawn =
                world.spawnPoints[
                    spawnId
                ] ||
                world.spawnPoints
                    .default;


            if (spawn) {
                const safe =
                    findSafePosition(
                        spawn.x,
                        spawn.y,
                        player.radius,
                        world
                    );


                player.x =
                    safe.x;


                player.y =
                    safe.y;


                player.facing =
                    spawn.facing ||
                    "down";
            }


            if (
                !player.unlockedAreas
                    .includes(
                        areaId
                    )
            ) {
                player.unlockedAreas.push(
                    areaId
                );
            }


            if (
                areaId !==
                    "voidDungeon" &&
                !player
                    .discoveredMapLocations
                    .includes(
                        areaId
                    )
            ) {
                player
                    .discoveredMapLocations
                    .push(
                        areaId
                    );
            }
        }


        rebuildDynamicWorldObstacles(
            world
        );


        return true;
    }


    /* ============================================================
       HOME SPAWN CORRIGIDO

       AGORA getPlayerHomeSpawn() CONSEGUE USAR
       A GEOMETRIA REAL DA CASA.
       ============================================================ */

    function getVillageHomeSpawnFromLayout() {
        const temporary =
            buildVillageWorld();


        const home =
            findBuilding(
                "home",
                temporary
            );


        const door =
            getBuildingDoorGeometry(
                home
            );


        if (!door) {
            return {
                ...PLAYER_HOME_SPAWN
            };
        }


        return {
            x:
                door.centerX,

            y:
                door.centerY +
                78,

            facing:
                "up"
        };
    }


    /* ============================================================
       SECRET DOOR
       ============================================================ */

    function getVoidSecretDoor(
        world =
            state.world
    ) {
        return (
            world
                ?.secretDoors
                ?.find(
                    door =>
                        door.id ===
                        "void_secret_door"
                ) ||
            null
        );
    }


    function canOpenVoidSecretDoor() {
        const player =
            state.player;

        if (!player) {
            return {
                ok: false,
                reason:
                    "Jogador ausente."
            };
        }


        const quest =
            player.miguelQuest;


        if (
            quest.secretDoorOpened
        ) {
            return {
                ok: true,
                alreadyOpen:
                    true
            };
        }


        if (
            !quest.missionAccepted
        ) {
            return {
                ok: false,
                reason:
                    "Uma força estranha mantém esta passagem selada."
            };
        }


        if (
            !quest.keyCollected ||
            getRealItemCount(
                "chaveObscura"
            ) <=
                0
        ) {
            return {
                ok: false,
                reason:
                    "Uma força estranha mantém esta passagem selada."
            };
        }


        return {
            ok: true,
            alreadyOpen:
                false
        };
    }


    function openVoidSecretDoor() {
        const validation =
            canOpenVoidSecretDoor();


        if (
            !validation.ok
        ) {
            return false;
        }


        const player =
            state.player;


        const quest =
            player.miguelQuest;


        if (
            validation.alreadyOpen
        ) {
            return true;
        }


        if (
            !removeItem(
                "chaveObscura",
                1
            )
        ) {
            return false;
        }


        quest.keyConsumed =
            true;


        quest.secretDoorOpened =
            true;


        quest.secretDoorDiscovered =
            true;


        updateMiguelQuestObjective(
            MIGUEL_QUEST_STAGE
                .EXPLORE_DUNGEON,
            "Explore a Área Secreta do Vazio."
        );


        const door =
            getVoidSecretDoor();


        if (door) {
            door.opened =
                true;

            door.locked =
                false;
        }


        return true;
    }


    /* ============================================================
       CHAVE OBSCURA
       ============================================================ */

    function canCollectDarkKey() {
        const player =
            state.player;


        if (!player) {
            return {
                ok: false,
                reason:
                    "Jogador ausente."
            };
        }


        const quest =
            player.miguelQuest;


        if (
            quest.keyCollected
        ) {
            return {
                ok: false,
                reason:
                    "A Chave Obscura já foi obtida."
            };
        }


        if (
            !quest.missionAccepted
        ) {
            return {
                ok: false,
                reason:
                    "A energia desta chave não reage a você."
            };
        }


        const current =
            getItemCount(
                "essenciaSombria"
            );


        const required =
            VOID_MISSION_CONFIG
                .shadowEssenceRequired;


        if (
            current <
            required
        ) {
            return {
                ok: false,

                reason:
                    `A chave reage às Essências Sombrias. ${current}/${required}.`,

                current,

                required
            };
        }


        return {
            ok: true
        };
    }


    function collectDarkKey() {
        const validation =
            canCollectDarkKey();


        if (
            !validation.ok
        ) {
            return false;
        }


        if (
            !removeItem(
                "essenciaSombria",
                VOID_MISSION_CONFIG
                    .shadowEssenceRequired
            )
        ) {
            return false;
        }


        if (
            !addItem(
                "chaveObscura",
                1,
                {
                    silent:
                        true
                }
            )
        ) {
            return false;
        }


        const quest =
            state.player
                .miguelQuest;


        quest.keyLocationDiscovered =
            true;


        quest.keyCollected =
            true;


        updateMiguelQuestObjective(
            MIGUEL_QUEST_STAGE
                .RETURN_PATH_ONE,
            "Procure uma passagem trancada no Caminho 1."
        );


        state.player
            .discoveredMapLocations =
            uniqueArray([
                ...state.player
                    .discoveredMapLocations,
                "darkKeyLocation"
            ]);


        return true;
    }


    /* ============================================================
       MINIMAPA SIGNAL
       ============================================================ */

    function isMinimapSignalAvailable() {
        if (
            state.area ===
                "voidDungeon"
        ) {
            return false;
        }


        if (
            state.world
                ?.flags
                ?.minimapSignal ===
                false
        ) {
            return false;
        }


        return true;
    }


    /* ============================================================
       GLOBAL MAP MARKERS
       ============================================================ */

    function getGlobalMapLocations() {
        const player =
            state.player;


        if (!player) {
            return [];
        }


        const ordered = [

            "village",

            "road",

            "forest",

            "grove",

            "mountains",

            "ironRegion",

            "rubyRegion",

            "monarchMaze",

            "gnomeGardens",

            "fairyKingdom",

            "celestialFrontier",

            "celestialStair",

            "skyOne",

            "skyTwo",

            "skyThree"

        ];


        const discovered =
            new Set(
                safeArray(
                    player
                        .discoveredMapLocations
                )
            );


        const locations =
            ordered
                .filter(
                    id =>
                        discovered.has(
                            id
                        ) ||
                        id ===
                            "village"
                )
                .map(
                    id => ({

                        id,

                        name:
                            REGION_META[
                                id
                            ]?.name ||
                            id

                    })
                );


        if (
            player.miguelQuest
                .vaelkorDefeated &&
            discovered.has(
                "voidDungeon"
            )
        ) {
            locations.push({

                id:
                    "voidDungeon",

                name:
                    "ÁREA SECRETA DO VAZIO",

                secret:
                    true

            });
        }


        return locations;
    }


    function getWorldMapMarkers(
        world,
        player
    ) {
        if (
            !world ||
            !player
        ) {
            return [];
        }


        const markers = [];


        for (
            const npc of
            world.npcs ||
            []
        ) {
            markers.push({

                type:
                    "npc",

                id:
                    npc.id,

                x:
                    npc.x,

                y:
                    npc.y

            });
        }


        if (
            world.id ===
                "rubyRegion" &&
            player.miguelQuest
                .vaelkorDefeated
        ) {
            const secret =
                getVoidSecretDoor(
                    world
                );

            if (secret) {
                markers.push({

                    type:
                        "secret",

                    id:
                        secret.id,

                    x:
                        secret.x +
                        secret.w /
                        2,

                    y:
                        secret.y +
                        secret.h /
                        2

                });
            }
        }


        if (
            world.id ===
                "celestialFrontier" &&
            player.miguelQuest
                .keyCollected
        ) {
            markers.push({

                type:
                    "secret",

                id:
                    "dark_key_found",

                x:
                    660,

                y:
                    1520

            });
        }


        return markers;
    }


    /* ============================================================
       REGION BIOME AT POSITION

       USADO NA TRANSIÇÃO FADA -> CÉU.
       ============================================================ */

    function getBiomeAtPosition(
        x,
        y,
        areaId =
            state.area
    ) {
        if (
            areaId !==
            "celestialFrontier"
        ) {
            return getBiomeStyle(
                areaId
            );
        }


        /*
            Blend contínuo vertical.
        */
        const transitionStart =
            950;


        const transitionEnd =
            1370;


        if (
            y <=
            transitionStart
        ) {
            return BIOME_STYLE.celestial;
        }


        if (
            y >=
            transitionEnd
        ) {
            return BIOME_STYLE.fairy;
        }


        const t =
            clamp(
                (
                    y -
                    transitionStart
                ) /
                (
                    transitionEnd -
                    transitionStart
                ),
                0,
                1
            );


        return {

            blended:
                true,

            from:
                BIOME_STYLE.celestial,

            to:
                BIOME_STYLE.fairy,

            t

        };
    }


    /* ============================================================
       DUNGEON LIGHT STATE
       ============================================================ */

    function isPlayerInsideVoidArena() {
        if (
            state.area !==
                "voidDungeon" ||
            !state.player
        ) {
            return false;
        }


        const zone =
            state.world
                ?.zones
                ?.find(
                    entry =>
                        entry.id ===
                        "vaelkor_arena"
                );


        if (!zone) {
            return false;
        }


        return pointInRect(
            state.player.x,
            state.player.y,
            zone
        );
    }


    function shouldUseLanternDarkness() {
        if (
            state.area !==
                "voidDungeon"
        ) {
            return false;
        }


        /*
            Arena é iluminada naturalmente.
        */
        if (
            isPlayerInsideVoidArena()
        ) {
            return false;
        }


        return true;
    }


    /* ============================================================
       BOSS BARRIER REPAIR

       Quando Guardião morre, remove bloqueio.
       ============================================================ */

    function repairWorldBossBarriers() {
        const world =
            state.world;

        if (!world) {
            return;
        }


        if (
            world.id ===
                "road" &&
            isBossDefeated(
                "road_guardian"
            )
        ) {
            world.staticObstacles =
                safeArray(
                    world.staticObstacles
                )
                    .filter(
                        obstacle =>
                            obstacle.id !==
                            "road_guardian_passage_block"
                    );


            const exit =
                world.exits.find(
                    entry =>
                        entry.id ===
                        "road_to_forest"
                );


            if (exit) {
                exit.unlocked =
                    true;
            }


            rebuildDynamicWorldObstacles(
                world
            );
        }


        /*
            Outras saídas de boss.
        */
        const unlockMap = {

            forest:
                [
                    "forest_warden",
                    "forest_to_grove"
                ],

            grove:
                [
                    "grove_heart",
                    "grove_to_mountains"
                ],

            mountains:
                [
                    "mountain_titan",
                    "mountains_to_iron"
                ],

            ironRegion:
                [
                    "iron_colossus",
                    "iron_to_ruby"
                ],

            rubyRegion:
                [
                    "ruby_chimera",
                    "ruby_to_maze"
                ],

            celestialStair:
                [
                    "path_guardian",
                    "stair_to_sky1"
                ]

        };


        const entry =
            unlockMap[
                world.id
            ];


        if (entry) {
            const [
                bossId,
                exitId
            ] =
                entry;


            if (
                isBossDefeated(
                    bossId
                )
            ) {
                const exit =
                    world.exits.find(
                        item =>
                            item.id ===
                            exitId
                    );


                if (exit) {
                    exit.unlocked =
                        true;
                }
            }
        }
    }


    /* ============================================================
       SPAWN REPAIR

       Impede save colocar player dentro
       de árvore/casa/parede.
       ============================================================ */

    function repairPlayerWorldPosition() {
        const player =
            state.player;

        const world =
            state.world;


        if (
            !player ||
            !world
        ) {
            return false;
        }


        if (
            !isCircleBlocked(
                player.x,
                player.y,
                player.radius,
                world
            )
        ) {
            return true;
        }


        const safe =
            findSafePosition(
                player.x,
                player.y,
                player.radius,
                world
            );


        player.x =
            safe.x;


        player.y =
            safe.y;


        return true;
    }


    /* ============================================================
       VOID DUNGEON LOAD REPAIR
       ============================================================ */

    function repairVoidDungeonRuntimeAfterLoad() {
        if (
            state.area !==
                "voidDungeon" ||
            !state.player
        ) {
            return;
        }


        const quest =
            state.player
                .miguelQuest;


        /*
            Se Vaelkor já morreu e fragmento ainda
            não foi coletado, garante o recurso.
        */
        if (
            quest.vaelkorDefeated &&
            !quest.fragmentCollected
        ) {
            const exists =
                state.world
                    ?.resources
                    ?.some(
                        resource =>
                            resource.id ===
                            "void_fragment"
                    );


            if (!exists) {
                state.world.resources.push({

                    id:
                        "void_fragment",

                    type:
                        "voidFragment",

                    x:
                        2250,

                    y:
                        900,

                    radius:
                        34,

                    collectible:
                        true,

                    minigame:
                        true

                });
            }
        }


        /*
            Boss não pode reaparecer depois da morte.
        */
        if (
            quest.vaelkorDefeated
        ) {
            state.world.bosses =
                safeArray(
                    state.world.bosses
                )
                    .filter(
                        boss =>
                            boss.id !==
                            "vaelkor"
                    );
        }
    }


    /* ============================================================
       SANITIZE VAELKOR
       ============================================================ */

    function sanitizeVaelkorState() {
        const player =
            state.player;

        if (
            !player ||
            !player.miguelQuest
        ) {
            return;
        }


        const quest =
            player.miguelQuest;


        if (
            quest.vaelkorDefeated ||
            player.abilities
                .dashV2
        ) {
            quest.vaelkorDefeated =
                true;


            if (
                state.world
                    ?.bosses
            ) {
                state.world.bosses =
                    state.world.bosses
                        .filter(
                            boss =>
                                boss.id !==
                                "vaelkor"
                        );
            }
        }
    }


    /* ============================================================
       UPDATE WORLD GEOMETRY
       ============================================================ */

    function updateWorldGeometry(
        dt
    ) {
        updateWorldDoors(
            dt
        );


        repairWorldBossBarriers();


        repairPlayerWorldPosition();
    }


    /* ============================================================
       VALIDAÇÃO PARTE 2
       ============================================================ */

    function validatePart2Data() {
        const errors = [];


        const village =
            buildVillageWorld();


        const home =
            findBuilding(
                "home",
                village
            );


        if (!home) {
            errors.push(
                "Casa do jogador não encontrada."
            );
        }


        const homeDoor =
            getBuildingDoorGeometry(
                home
            );


        if (!homeDoor) {
            errors.push(
                "Porta da casa do jogador sem geometria."
            );
        }


        if (
            village.spawnPoints
                .default
                ?.x ===
                1600 &&
            village.spawnPoints
                .default
                ?.y ===
                1100
        ) {
            errors.push(
                "Spawn ainda está no centro da Vila."
            );
        }


        if (
            village.trees.length ===
                0
        ) {
            errors.push(
                "Vila sem árvores."
            );
        }


        if (
            village.obstacles.length ===
                0
        ) {
            errors.push(
                "Colisão da Vila não foi construída."
            );
        }


        const road =
            buildRoadWorld();


        const guardian =
            road.bosses.find(
                boss =>
                    boss.id ===
                    "road_guardian"
            );


        if (
            !isBossDefeated(
                "road_guardian"
            ) &&
            guardian &&
            guardian.state !==
                BOSS_STATE.NEUTRAL
        ) {
            errors.push(
                "Guardião da Estrada não iniciou neutro."
            );
        }


        const ruby =
            buildRubyWorld();


        const secret =
            ruby.secretDoors.find(
                door =>
                    door.id ===
                    "void_secret_door"
            );


        if (!secret) {
            errors.push(
                "Porta Secreta do Vazio não foi criada."
            );
        }


        if (
            secret &&
            secret.y >
                ruby.height *
                0.4
        ) {
            errors.push(
                "Porta secreta deveria estar em cima/baixo, não lateral."
            );
        }


        const frontier =
            buildCelestialFrontierWorld();


        if (
            !frontier.zones.some(
                zone =>
                    zone.id ===
                    "environment_blend"
            )
        ) {
            errors.push(
                "Fronteira Celestial sem transição ambiental."
            );
        }


        const dungeon =
            buildVoidDungeonWorld();


        if (
            dungeon.flags
                .minimapSignal !==
            false
        ) {
            errors.push(
                "Dungeon do Vazio deve ficar SEM SINAL."
            );
        }


        if (
            !dungeon.zones.some(
                zone =>
                    zone.id ===
                    "void_dark_corridor"
            )
        ) {
            errors.push(
                "Corredor escuro da dungeon ausente."
            );
        }


        if (
            !dungeon.zones.some(
                zone =>
                    zone.id ===
                    "vaelkor_arena"
            )
        ) {
            errors.push(
                "Arena de Vaelkor ausente."
            );
        }


        if (
            errors.length >
            0
        ) {
            console.error(
                "VEYRA V31 — ERROS NA PARTE 2:",
                errors
            );

            return {
                ok: false,
                errors
            };
        }


        console.log(
            "VEYRA V31 — Parte 2 validada."
        );


        return {
            ok: true,
            errors: []
        };
    }


    /* ============================================================
       FIM DA PARTE 2/5

       PARTE 3 VAI CONTER:

       - movimentação do player
       - colisão aplicada no gameplay
       - ataque básico
       - corpo a corpo
       - projéteis
       - Q / R / F
       - Dash V1
       - Dash V2
       - perfect projectile phase do Dash V2
       - inimigos
       - IA
       - lobo com charge contínuo
       - javali
       - habilidades
       - boss state machine
       - Guardião SEM perseguir antes do aceite
       - batalha depois de ACEITAR
       - morte permanente do boss no save
       - desbloqueio da saída
       - coleta segurando E
       - madeira
       - recursos
       - Essência Sombria no labirinto
       - Chave Obscura
       - interação de porta
       - entrada/saída de casa
       - interação das saídas
       - prompt próximo de portão
       - diálogo/typewriter
       - quests
       - loja
       - venda
       - armaduras
       - céu com 5 hordas
       - Vaelkor completo
       - cutscene de entrada
       - fase 1 / fase 2
       - Rajada do Vazio
       - Feixe do Vazio
       - Invocação Sombria
       - morte cinematográfica
       - Fragmento
       - minigame de 3 estágios
       - retorno para Miguel
       - Dash V2
       - morte/respawn na frente da casa

       NÃO COLOQUE })(); AQUI.
       ============================================================ */
    /* ============================================================
       VEYRA: A QUIETUDE
       SCRIPT.JS — PARTE 3/5

       GAMEPLAY / COMBATE / INTERAÇÃO / QUESTS / VAELKOR

       IMPORTANTE:
       ESTA PARTE NÃO FECHA O IIFE.
       ============================================================ */


    /* ============================================================
       GAMEPLAY RUNTIME
       ============================================================ */

    const gameplayRuntime = {

        interactionTarget:
            null,

        interactionPrompt:
            null,


        nearbyDoor:
            null,

        nearbyExit:
            null,

        nearbyResource:
            null,

        nearbyNPC:
            null,

        nearbySecretDoor:
            null,


        lastAttackAt:
            -999,


        worldTransitionLock:
            false,


        vaelkor: {

            arenaEntered:
                false,

            entranceLocked:
                false,

            spawnCutsceneStarted:
                false,

            spawnCutsceneCompleted:
                false,

            phaseTransitionStarted:
                false,

            phaseTransitionCompleted:
                false,

            endingStarted:
                false,

            endingCompleted:
                false,

            attackPatternIndex:
                0

        },


        skyTrial: {

            spawning:
                false,

            waveDelay:
                0

        }

    };


    /* ============================================================
       DIREÇÃO / MOVIMENTO
       ============================================================ */

    function getMovementInputVector() {

        let x = 0;
        let y = 0;


        if (
            state.keys.has(
                "KeyA"
            ) ||
            state.keys.has(
                "ArrowLeft"
            )
        ) {
            x -= 1;
        }


        if (
            state.keys.has(
                "KeyD"
            ) ||
            state.keys.has(
                "ArrowRight"
            )
        ) {
            x += 1;
        }


        if (
            state.keys.has(
                "KeyW"
            ) ||
            state.keys.has(
                "ArrowUp"
            )
        ) {
            y -= 1;
        }


        if (
            state.keys.has(
                "KeyS"
            ) ||
            state.keys.has(
                "ArrowDown"
            )
        ) {
            y += 1;
        }


        if (
            x === 0 &&
            y === 0
        ) {
            return {
                x: 0,
                y: 0
            };
        }


        return normalize(
            x,
            y
        );
    }


    function updatePlayerFacingFromVector(
        vector
    ) {

        const player =
            state.player;


        if (
            !player ||
            !vector
        ) {
            return;
        }


        if (
            Math.abs(
                vector.x
            ) >
            Math.abs(
                vector.y
            )
        ) {

            player.facing =
                vector.x >
                    0
                    ? "right"
                    : "left";

        } else if (
            vector.y !==
            0
        ) {

            player.facing =
                vector.y >
                    0
                    ? "down"
                    : "up";

        }

    }


    function getFacingVector(
        facing
    ) {

        switch (
            facing
        ) {

            case "up":
                return {
                    x: 0,
                    y: -1
                };


            case "down":
                return {
                    x: 0,
                    y: 1
                };


            case "left":
                return {
                    x: -1,
                    y: 0
                };


            case "right":
            default:
                return {
                    x: 1,
                    y: 0
                };

        }

    }


    function isPlayerControlBlocked() {

        if (
            !state.running ||
            !state.player ||
            state.player.dead
        ) {
            return true;
        }


        if (
            state.activePanel ||
            state.dialogue ||
            state.travel ||
            state.battle ||
            state.cutscene ||
            state.fragmentMinigame
                ?.active ||
            state.deathState
        ) {
            return true;
        }


        return false;
    }


    function updatePlayerMovement(
        dt
    ) {

        const player =
            state.player;


        if (
            !player ||
            isPlayerControlBlocked()
        ) {
            return;
        }


        if (
            player.dashRuntime
                ?.active
        ) {
            return;
        }


        const vector =
            getMovementInputVector();


        if (
            vector.x ===
                0 &&
            vector.y ===
                0
        ) {

            player.visual.idleTime +=
                dt;

            return;
        }


        updatePlayerFacingFromVector(
            vector
        );


        let speed =
            player.speed;


        if (
            player.movementSlowTimer >
            0
        ) {

            speed *=
                player
                    .movementSlowMultiplier;

        }


        const dx =
            vector.x *
            speed *
            dt;


        const dy =
            vector.y *
            speed *
            dt;


        const moved =
            moveCircleWithCollision(
                player,
                dx,
                dy,
                player.radius,
                state.world
            );


        if (
            moved
        ) {

            player.visual.walkTime +=
                dt;

            player.visual.idleTime =
                0;

        }

    }


    /* ============================================================
       COOLDOWNS
       ============================================================ */

    function updatePlayerCooldowns(
        dt
    ) {

        const player =
            state.player;


        if (!player) {
            return;
        }


        player.attackCooldown =
            Math.max(
                0,
                player.attackCooldown -
                    dt
            );


        player.universalDashCooldown =
            Math.max(
                0,
                player.universalDashCooldown -
                    dt
            );


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
                Math.max(
                    0,
                    finiteNumber(
                        player
                            .skillCooldowns[
                                key
                            ],
                        0
                    ) -
                    dt
                );

        }


        player.hurtAnim =
            Math.max(
                0,
                player.hurtAnim -
                    dt
            );


        player.invincible =
            Math.max(
                0,
                player.invincible -
                    dt
            );


        if (
            player.movementSlowTimer >
            0
        ) {

            player.movementSlowTimer =
                Math.max(
                    0,
                    player.movementSlowTimer -
                        dt
                );


            if (
                player.movementSlowTimer <=
                0
            ) {

                player.movementSlowMultiplier =
                    1;

            }

        }


        if (
            player.poisonEffect
        ) {

            player.poisonEffect.timer -=
                dt;


            player.poisonEffect.tickTimer -=
                dt;


            if (
                player.poisonEffect.tickTimer <=
                0
            ) {

                player.poisonEffect.tickTimer =
                    0.7;


                applyDamageToPlayer(
                    player.poisonEffect.damage,
                    {
                        type:
                            "poison"
                    }
                );

            }


            if (
                player.poisonEffect.timer <=
                0
            ) {

                player.poisonEffect =
                    null;

            }

        }

    }


    /* ============================================================
       POTION BUFFS
       ============================================================ */

    function updatePotionBuffs(
        dt
    ) {

        const player =
            state.player;


        if (!player) {
            return;
        }


        let changed =
            false;


        for (
            const buff of
            player.activePotionBuffs
        ) {

            buff.timer -=
                dt;

        }


        const before =
            player.activePotionBuffs
                .length;


        player.activePotionBuffs =
            player.activePotionBuffs
                .filter(
                    buff =>
                        buff.timer >
                        0
                );


        if (
            player.activePotionBuffs
                .length !==
            before
        ) {

            changed =
                true;

        }


        if (
            changed
        ) {

            recalculatePlayerStats();

        }

    }


    /* ============================================================
       SURVIVAL
       ============================================================ */

    function updateSurvival(
        dt
    ) {

        const player =
            state.player;


        if (
            !player ||
            player.dead
        ) {
            return;
        }


        if (
            !state.dev
                ?.cheats
                ?.infiniteHunger
        ) {

            player.hunger =
                Math.max(
                    0,
                    player.hunger -
                        GAME_CONFIG
                            .hungerDrainPerSecond *
                        dt
                );

        }


        if (
            !state.dev
                ?.cheats
                ?.infiniteFatigue
        ) {

            player.fatigue =
                Math.max(
                    0,
                    player.fatigue -
                        GAME_CONFIG
                            .fatigueDrainPerSecond *
                        dt
                );

        }

    }


    /* ============================================================
       DAMAGE
       ============================================================ */

    function calculateDamageAfterDefense(
        rawDamage,
        defense
    ) {

        const safeDamage =
            Math.max(
                1,
                finiteNumber(
                    rawDamage,
                    1
                )
            );


        const safeDefense =
            Math.max(
                0,
                finiteNumber(
                    defense,
                    0
                )
            );


        const reduction =
            safeDefense /
            (
                safeDefense +
                80
            );


        return Math.max(
            1,
            Math.round(
                safeDamage *
                (
                    1 -
                    reduction
                )
            )
        );
    }


    function applyDamageToPlayer(
        rawDamage,
        source = {}
    ) {

        const player =
            state.player;


        if (
            !player ||
            player.dead
        ) {
            return false;
        }


        if (
            devShouldIgnorePlayerDamage()
        ) {

            return false;

        }


        /*
            Não existe invulnerabilidade
            geral no Dash.
        */
        if (
            player.invincible >
            0
        ) {

            return false;

        }


        if (
            source.boss &&
            !canBossDamagePlayer(
                source.boss
            )
        ) {

            return false;

        }


        /*
            DASH V2:
            atravessa PROJÉTIL apenas
            durante a janela perfeita.
        */
        if (
            source.projectile &&
            player.dashRuntime
                ?.active &&
            player.dashRuntime
                .version ===
                2 &&
            player.dashRuntime
                .phaseWindow >
                0
        ) {

            player.dashRuntime
                .perfectPhaseTriggered =
                true;


            pushNotification(
                "PASSAGEM DO VAZIO",
                "O projétil atravessou sua sombra.",
                "special",
                1.25
            );


            return false;

        }


        const damage =
            calculateDamageAfterDefense(
                rawDamage,
                player.defense
            );


        player.hp =
            Math.max(
                0,
                player.hp -
                    damage
            );


        player.hurtAnim =
            0.24;


        state.damageFlash =
            Math.max(
                state.damageFlash,
                0.18
            );


        state.screenShake =
            Math.max(
                state.screenShake,
                0.16
            );


        state.screenShakePower =
            Math.max(
                state.screenShakePower,
                Math.min(
                    12,
                    damage *
                    0.25
                )
            );


        if (
            player.hp <=
            0
        ) {

            killPlayer(
                source
            );

        }


        return damage;
    }


    function applyDamageToEnemy(
        enemy,
        rawDamage,
        source = {}
    ) {

        if (
            !enemy ||
            enemy.dead
        ) {
            return false;
        }


        if (
            BOSS_REGISTRY[
                enemy.id
            ] &&
            !canPlayerDamageBoss(
                enemy
            )
        ) {

            return false;

        }


        const modified =
            devModifyOutgoingDamage(
                rawDamage
            );


        const damage =
            calculateDamageAfterDefense(
                modified,
                enemy.defense
            );


        enemy.hp =
            Math.max(
                0,
                enemy.hp -
                    damage
            );


        enemy.hurtAnim =
            0.2;


        createBloodBurst(
            enemy.x,
            enemy.y,
            enemy.id ===
                "vaelkor"
                ? "void"
                : "blood"
        );


        if (
            enemy.hp <=
            0
        ) {

            killEnemy(
                enemy,
                source
            );

        }


        return damage;
    }


    /* ============================================================
       BLOOD / HIT FEEDBACK
       ============================================================ */

    function createBloodBurst(
        x,
        y,
        type =
            "blood"
    ) {

        const count =
            type ===
                "void"
                ? 7
                : 5;


        for (
            let index = 0;
            index < count;
            index += 1
        ) {

            state.bloodMarks.push({

                x:
                    x +
                    random(
                        -18,
                        18
                    ),

                y:
                    y +
                    random(
                        -18,
                        18
                    ),

                size:
                    random(
                        2.5,
                        7
                    ),

                alpha:
                    random(
                        0.35,
                        0.75
                    ),

                timer:
                    random(
                        2.5,
                        5.5
                    ),

                type

            });

        }


        while (
            state.bloodMarks.length >
            MAX_BLOOD_MARKS
        ) {

            state.bloodMarks.shift();

        }

    }


    function updateBloodMarks(
        dt
    ) {

        for (
            const mark of
            state.bloodMarks
        ) {

            mark.timer -=
                dt;


            mark.alpha =
                Math.min(
                    mark.alpha,
                    mark.timer /
                    1.5
                );

        }


        state.bloodMarks =
            state.bloodMarks
                .filter(
                    mark =>
                        mark.timer >
                        0
                );

    }


    /* ============================================================
       PROJECTILES
       ============================================================ */

    function ensureProjectileArray() {

        if (
            !state.world
        ) {
            return [];
        }


        if (
            !Array.isArray(
                state.world.projectiles
            )
        ) {

            state.world.projectiles =
                [];

        }


        return state.world
            .projectiles;
    }


    function createProjectile(
        config
    ) {

        const projectiles =
            ensureProjectileArray();


        const direction =
            normalize(
                config.dx,
                config.dy
            );


        const projectile = {

            id:
                config.id ||
                `projectile_${Math.random().toString(36).slice(2)}`,

            owner:
                config.owner ||
                "enemy",

            source:
                config.source ||
                null,

            x:
                config.x,

            y:
                config.y,

            vx:
                direction.x *
                config.speed,

            vy:
                direction.y *
                config.speed,

            radius:
                config.radius ||
                8,

            damage:
                config.damage ||
                1,

            color:
                config.color ||
                "#ffffff",

            life:
                config.life ||
                2.5,

            maxLife:
                config.life ||
                2.5,

            pierce:
                Boolean(
                    config.pierce
                ),

            type:
                config.type ||
                "normal",

            dead:
                false

        };


        projectiles.push(
            projectile
        );


        return projectile;
    }


    function projectileHitsSolid(
        projectile
    ) {

        const world =
            state.world;


        if (!world) {
            return false;
        }


        for (
            const obstacle of
            world.obstacles ||
            []
        ) {

            if (
                !obstacle.solid
            ) {
                continue;
            }


            if (
                circleRectCollision(
                    projectile.x,
                    projectile.y,
                    projectile.radius,
                    obstacle
                )
            ) {

                return true;

            }

        }


        return false;
    }


    function updateProjectiles(
        dt
    ) {

        const world =
            state.world;


        if (!world) {
            return;
        }


        const projectiles =
            ensureProjectileArray();


        for (
            const projectile of
            projectiles
        ) {

            if (
                projectile.dead
            ) {
                continue;
            }


            projectile.life -=
                dt;


            if (
                projectile.life <=
                0
            ) {

                projectile.dead =
                    true;

                continue;

            }


            projectile.x +=
                projectile.vx *
                dt;


            projectile.y +=
                projectile.vy *
                dt;


            if (
                projectile.x <
                    -50 ||
                projectile.y <
                    -50 ||
                projectile.x >
                    world.width +
                    50 ||
                projectile.y >
                    world.height +
                    50
            ) {

                projectile.dead =
                    true;

                continue;

            }


            if (
                projectileHitsSolid(
                    projectile
                )
            ) {

                projectile.dead =
                    true;

                continue;

            }


            if (
                projectile.owner ===
                    "player"
            ) {

                for (
                    const enemy of
                    getAllCombatEnemies()
                ) {

                    if (
                        enemy.dead
                    ) {
                        continue;
                    }


                    if (
                        circleCircleCollision(
                            projectile.x,
                            projectile.y,
                            projectile.radius,
                            enemy.x,
                            enemy.y,
                            enemy.radius
                        )
                    ) {

                        const result =
                            applyDamageToEnemy(
                                enemy,
                                projectile.damage,
                                {
                                    projectile,
                                    player:
                                        state.player
                                }
                            );


                        if (
                            result !==
                                false &&
                            !projectile.pierce
                        ) {

                            projectile.dead =
                                true;

                        }


                        break;

                    }

                }

            } else {

                const player =
                    state.player;


                if (
                    player &&
                    !player.dead &&
                    circleCircleCollision(
                        projectile.x,
                        projectile.y,
                        projectile.radius,
                        player.x,
                        player.y,
                        player.radius
                    )
                ) {

                    const result =
                        applyDamageToPlayer(
                            projectile.damage,
                            {
                                projectile:
                                    true,

                                projectileObject:
                                    projectile,

                                boss:
                                    projectile.source &&
                                    BOSS_REGISTRY[
                                        projectile
                                            .source
                                            .id
                                    ]
                                        ? projectile.source
                                        : null
                            }
                        );


                    /*
                        Mesmo quando perfeito Dash V2
                        anulou dano, projétil atravessado
                        deixa de acertar novamente.
                    */
                    if (
                        result !==
                            false ||
                        player.dashRuntime
                            ?.perfectPhaseTriggered
                    ) {

                        projectile.dead =
                            true;

                    }

                }

            }

        }


        world.projectiles =
            projectiles.filter(
                projectile =>
                    !projectile.dead
            );

    }


    /* ============================================================
       COMBAT TARGETS
       ============================================================ */

    function getAllCombatEnemies() {

        if (
            !state.world
        ) {
            return [];
        }


        return [

            ...safeArray(
                state.world.enemies
            ),

            ...safeArray(
                state.world.bosses
            )

        ];

    }


    /* ============================================================
       MOUSE AIM
       ============================================================ */

    function getPlayerAimVector() {

        const player =
            state.player;


        if (!player) {
            return {
                x: 1,
                y: 0
            };
        }


        const dx =
            finiteNumber(
                state.pointer
                    .worldX,
                player.x +
                    1
            ) -
            player.x;


        const dy =
            finiteNumber(
                state.pointer
                    .worldY,
                player.y
            ) -
            player.y;


        const normalized =
            normalize(
                dx,
                dy
            );


        if (
            normalized.x ===
                0 &&
            normalized.y ===
                0
        ) {

            return getFacingVector(
                player.facing
            );

        }


        return normalized;
    }


    /* ============================================================
       BASIC ATTACK

       1 POINTERDOWN = 1 ATAQUE.
       NÃO EXISTE ATAQUE AUTOMÁTICO SEGURANDO MOUSE.
       ============================================================ */

    function handleGameplayAttackInput() {

        const player =
            state.player;


        if (
            !player ||
            isPlayerControlBlocked() ||
            player.attackCooldown >
                0
        ) {

            return false;

        }


        const character =
            currentCharacter();


        const attack =
            character.basicAttack;


        const aim =
            getPlayerAimVector();


        updatePlayerFacingFromVector(
            aim
        );


        player.visual.attackTime =
            0.22;


        switch (
            attack.type
        ) {

            case "projectile":

                createProjectile({

                    owner:
                        "player",

                    source:
                        player,

                    x:
                        player.x +
                        aim.x *
                        24,

                    y:
                        player.y +
                        aim.y *
                        24,

                    dx:
                        aim.x,

                    dy:
                        aim.y,

                    speed:
                        attack.speed,

                    radius:
                        attack.radius,

                    damage:
                        player.damage,

                    color:
                        attack.color,

                    life:
                        attack.range /
                        attack.speed

                });

                player.attackCooldown =
                    character.id ===
                        "lirael"
                        ? 0.31
                        : 0.42;

                break;


            case "splash":

                performSplashAttack(
                    player,
                    aim,
                    attack
                );

                player.attackCooldown =
                    0.72;

                break;


            case "riftArc":

                performMeleeArcAttack(
                    player,
                    aim,
                    attack.range,
                    attack.arc,
                    player.damage
                );

                player.attackCooldown =
                    0.42;

                break;


            case "meleeArc":
            default:

                performMeleeArcAttack(
                    player,
                    aim,
                    attack.range,
                    attack.arc,
                    player.damage
                );

                player.attackCooldown =
                    0.47;

                break;

        }


        return true;
    }


    function performMeleeArcAttack(
        player,
        aim,
        range,
        arc,
        damage
    ) {

        const attackAngle =
            Math.atan2(
                aim.y,
                aim.x
            );


        for (
            const enemy of
            getAllCombatEnemies()
        ) {

            if (
                enemy.dead
            ) {
                continue;
            }


            const dist =
                distance(
                    player.x,
                    player.y,
                    enemy.x,
                    enemy.y
                );


            if (
                dist >
                range +
                enemy.radius
            ) {
                continue;
            }


            const enemyAngle =
                angleBetween(
                    player.x,
                    player.y,
                    enemy.x,
                    enemy.y
                );


            let difference =
                Math.atan2(
                    Math.sin(
                        enemyAngle -
                        attackAngle
                    ),
                    Math.cos(
                        enemyAngle -
                        attackAngle
                    )
                );


            difference =
                Math.abs(
                    difference
                );


            if (
                difference <=
                arc /
                2
            ) {

                applyDamageToEnemy(
                    enemy,
                    damage,
                    {
                        melee:
                            true,
                        player
                    }
                );

            }

        }

    }


    function performSplashAttack(
        player,
        aim,
        attack
    ) {

        const centerX =
            player.x +
            aim.x *
            attack.range *
            0.7;


        const centerY =
            player.y +
            aim.y *
            attack.range *
            0.7;


        for (
            const enemy of
            getAllCombatEnemies()
        ) {

            if (
                enemy.dead
            ) {
                continue;
            }


            if (
                distance(
                    centerX,
                    centerY,
                    enemy.x,
                    enemy.y
                ) <=
                attack.radius +
                enemy.radius
            ) {

                applyDamageToEnemy(
                    enemy,
                    player.damage *
                        1.08,
                    {
                        splash:
                            true,
                        player
                    }
                );

            }

        }


        state.screenShake =
            Math.max(
                state.screenShake,
                0.12
            );


        state.screenShakePower =
            Math.max(
                state.screenShakePower,
                5
            );

    }


    /* ============================================================
       SKILLS
       ============================================================ */

    function getSkill(
        key
    ) {

        const player =
            state.player;


        if (!player) {
            return null;
        }


        return (
            CLASS_SKILLS[
                player.characterId
            ]?.[
                key
            ] ||
            null
        );
    }


    function canPaySkillCost(
        skill
    ) {

        const player =
            state.player;


        if (
            !player ||
            !skill
        ) {
            return false;
        }


        if (
            skill.magicCost &&
            !state.dev
                ?.cheats
                ?.infiniteMagic &&
            player.magic <
                skill.magicCost
        ) {
            return false;
        }


        if (
            skill.energyCost &&
            !state.dev
                ?.cheats
                ?.infiniteEnergy &&
            player.energy <
                skill.energyCost
        ) {
            return false;
        }


        return true;
    }


    function paySkillCost(
        skill
    ) {

        const player =
            state.player;


        if (
            skill.magicCost &&
            !state.dev
                ?.cheats
                ?.infiniteMagic
        ) {

            player.magic =
                Math.max(
                    0,
                    player.magic -
                        skill.magicCost
                );

        }


        if (
            skill.energyCost &&
            !state.dev
                ?.cheats
                ?.infiniteEnergy
        ) {

            player.energy =
                Math.max(
                    0,
                    player.energy -
                        skill.energyCost
                );

        }

    }


    function handleGameplaySkillInput(
        key
    ) {

        const player =
            state.player;


        if (
            !player ||
            isPlayerControlBlocked()
        ) {
            return false;
        }


        const skill =
            getSkill(
                key
            );


        if (!skill) {
            return false;
        }


        if (
            player.skillCooldowns[
                key
            ] >
            0
        ) {

            return false;

        }


        if (
            !canPaySkillCost(
                skill
            )
        ) {

            pushNotification(
                "RECURSO INSUFICIENTE",
                "Você não possui energia ou magia suficiente.",
                "warning",
                1.5
            );


            return false;

        }


        const success =
            executeClassSkill(
                key,
                skill
            );


        if (!success) {
            return false;
        }


        paySkillCost(
            skill
        );


        player.skillCooldowns[
            key
        ] =
            skill.cooldown;


        return true;
    }


    function executeClassSkill(
        key,
        skill
    ) {

        const player =
            state.player;


        const aim =
            getPlayerAimVector();


        const characterId =
            player.characterId;


        if (
            characterId ===
            "kaelion"
        ) {

            if (
                key ===
                "q"
            ) {

                createProjectile({

                    owner:
                        "player",

                    source:
                        player,

                    x:
                        player.x,

                    y:
                        player.y,

                    dx:
                        aim.x,

                    dy:
                        aim.y,

                    speed:
                        720,

                    radius:
                        11,

                    damage:
                        player.damage *
                        1.45,

                    color:
                        "#ff9a4d",

                    life:
                        0.75,

                    pierce:
                        true

                });


                return true;

            }


            if (
                key ===
                "r"
            ) {

                damageEnemiesInRadius(
                    player.x,
                    player.y,
                    125,
                    player.damage *
                        1.25
                );


                return true;

            }


            if (
                key ===
                "f"
            ) {

                damageEnemiesInRadius(
                    player.x,
                    player.y,
                    190,
                    player.damage *
                        2
                );


                state.screenShake =
                    0.25;

                state.screenShakePower =
                    9;


                return true;

            }

        }


        if (
            characterId ===
            "theron"
        ) {

            if (
                key ===
                "q"
            ) {

                performMeleeArcAttack(
                    player,
                    aim,
                    92,
                    1.15,
                    player.damage *
                        1.7
                );


                return true;

            }


            if (
                key ===
                "r"
            ) {

                player.classBuffs.push({

                    type:
                        "ironStance",

                    timer:
                        3.5,

                    defenseBonus:
                        18

                });


                return true;

            }


            if (
                key ===
                "f"
            ) {

                performForwardSkillMovement(
                    player,
                    aim,
                    150
                );


                performMeleeArcAttack(
                    player,
                    aim,
                    88,
                    1.4,
                    player.damage *
                        1.8
                );


                return true;

            }

        }


        if (
            characterId ===
            "grumgar"
        ) {

            if (
                key ===
                "q"
            ) {

                damageEnemiesInRadius(
                    player.x +
                        aim.x *
                        50,
                    player.y +
                        aim.y *
                        50,
                    72,
                    player.damage *
                        1.65
                );


                return true;

            }


            if (
                key ===
                "r"
            ) {

                for (
                    const enemy of
                    getAllCombatEnemies()
                ) {

                    if (
                        distance(
                            player.x,
                            player.y,
                            enemy.x,
                            enemy.y
                        ) <=
                        145
                    ) {

                        const away =
                            normalize(
                                enemy.x -
                                    player.x,
                                enemy.y -
                                    player.y
                            );


                        moveEntityIgnoringSoftCollision(
                            enemy,
                            away.x *
                                55,
                            away.y *
                                55
                        );

                    }

                }


                return true;

            }


            if (
                key ===
                "f"
            ) {

                damageEnemiesInRadius(
                    player.x,
                    player.y,
                    180,
                    player.damage *
                        2.15
                );


                return true;

            }

        }


        if (
            characterId ===
            "lirael"
        ) {

            if (
                key ===
                "q"
            ) {

                player.hp =
                    clamp(
                        player.hp +
                        player.maxHp *
                        0.18,
                        0,
                        player.maxHp
                    );


                return true;

            }


            if (
                key ===
                "r"
            ) {

                for (
                    let index = -1;
                    index <= 1;
                    index += 1
                ) {

                    const angle =
                        Math.atan2(
                            aim.y,
                            aim.x
                        ) +
                        index *
                        0.13;


                    createProjectile({

                        owner:
                            "player",

                        source:
                            player,

                        x:
                            player.x,

                        y:
                            player.y,

                        dx:
                            Math.cos(
                                angle
                            ),

                        dy:
                            Math.sin(
                                angle
                            ),

                        speed:
                            700,

                        radius:
                            7,

                        damage:
                            player.damage *
                            0.9,

                        color:
                            "#f2a6db",

                        life:
                            0.7

                    });

                }


                return true;

            }


            if (
                key ===
                "f"
            ) {

                const targets =
                    getAllCombatEnemies()
                        .filter(
                            enemy =>
                                !enemy.dead &&
                                distance(
                                    player.x,
                                    player.y,
                                    enemy.x,
                                    enemy.y
                                ) <=
                                260
                        );


                for (
                    const enemy of
                    targets
                ) {

                    applyDamageToEnemy(
                        enemy,
                        player.damage *
                            1.55,
                        {
                            spell:
                                true
                        }
                    );

                }


                return true;

            }

        }


        if (
            characterId ===
            "zephyr"
        ) {

            if (
                key ===
                "q"
            ) {

                performMeleeArcAttack(
                    player,
                    aim,
                    110,
                    1.05,
                    player.damage *
                        1.55
                );


                return true;

            }


            if (
                key ===
                "r"
            ) {

                player.classBuffs.push({

                    type:
                        "adaptiveForm",

                    timer:
                        5,

                    speedMultiplier:
                        1.12,

                    damageMultiplier:
                        1.12

                });


                return true;

            }


            if (
                key ===
                "f"
            ) {

                performForwardSkillMovement(
                    player,
                    aim,
                    120
                );


                return true;

            }

        }


        return false;
    }


    function damageEnemiesInRadius(
        x,
        y,
        radius,
        damage
    ) {

        for (
            const enemy of
            getAllCombatEnemies()
        ) {

            if (
                enemy.dead
            ) {
                continue;
            }


            if (
                distance(
                    x,
                    y,
                    enemy.x,
                    enemy.y
                ) <=
                radius +
                enemy.radius
            ) {

                applyDamageToEnemy(
                    enemy,
                    damage,
                    {
                        area:
                            true
                    }
                );

            }

        }

    }


    function performForwardSkillMovement(
        entity,
        direction,
        distanceAmount
    ) {

        const steps =
            8;


        const stepDistance =
            distanceAmount /
            steps;


        for (
            let index = 0;
            index < steps;
            index += 1
        ) {

            const moved =
                moveCircleWithCollision(
                    entity,
                    direction.x *
                        stepDistance,
                    direction.y *
                        stepDistance,
                    entity.radius,
                    state.world
                );


            if (!moved) {
                break;
            }

        }

    }


    function moveEntityIgnoringSoftCollision(
        entity,
        dx,
        dy
    ) {

        if (
            !entity
        ) {
            return;
        }


        const next =
            findSafePosition(
                entity.x +
                    dx,
                entity.y +
                    dy,
                entity.radius,
                state.world
            );


        entity.x =
            next.x;


        entity.y =
            next.y;

    }


    /* ============================================================
       CLASS BUFFS
       ============================================================ */

    function updateClassBuffs(
        dt
    ) {

        const player =
            state.player;


        if (!player) {
            return;
        }


        for (
            const buff of
            player.classBuffs
        ) {

            buff.timer -=
                dt;

        }


        player.classBuffs =
            player.classBuffs
                .filter(
                    buff =>
                        buff.timer >
                        0
                );

    }


    function getPlayerCombatDefense() {

        const player =
            state.player;


        if (!player) {
            return 0;
        }


        let defense =
            player.defense;


        for (
            const buff of
            player.classBuffs
        ) {

            if (
                buff.defenseBonus
            ) {

                defense +=
                    buff.defenseBonus;

            }

        }


        return defense;
    }


    /* ============================================================
       DASH
       ============================================================ */

    function canUseDash() {

        const player =
            state.player;


        if (
            !player ||
            isPlayerControlBlocked()
        ) {
            return false;
        }


        const config =
            getDashConfig(
                player
            );


        if (!config) {
            return false;
        }


        if (
            player.universalDashCooldown >
            0
        ) {
            return false;
        }


        if (
            !state.dev
                ?.cheats
                ?.infiniteEnergy &&
            player.energy <
                config.energyCost
        ) {

            return false;

        }


        return true;
    }


    function handleGameplayDashInput() {

        if (
            !canUseDash()
        ) {

            return false;

        }


        const player =
            state.player;


        const config =
            getDashConfig(
                player
            );


        let direction =
            getMovementInputVector();


        if (
            direction.x ===
                0 &&
            direction.y ===
                0
        ) {

            direction =
                getFacingVector(
                    player.facing
                );

        }


        if (
            !state.dev
                ?.cheats
                ?.infiniteEnergy
        ) {

            player.energy =
                Math.max(
                    0,
                    player.energy -
                        config.energyCost
                );

        }


        player.universalDashCooldown =
            config.cooldown;


        player.dashRuntime = {

            active:
                true,

            version:
                getDashVersion(
                    player
                ),

            direction,

            elapsed:
                0,

            duration:
                config.duration,

            remainingDistance:
                config.distance,

            speed:
                config.speed,

            phaseWindow:
                config.projectilePhaseWindow,

            perfectPhaseTriggered:
                false,

            trailTimer:
                0

        };


        updatePlayerFacingFromVector(
            direction
        );


        return true;
    }


    function updatePlayerDash(
        dt
    ) {

        const player =
            state.player;


        const dash =
            player
                ?.dashRuntime;


        if (
            !player ||
            !dash?.active
        ) {

            return;

        }


        dash.elapsed +=
            dt;


        if (
            dash.phaseWindow >
            0
        ) {

            dash.phaseWindow =
                Math.max(
                    0,
                    dash.phaseWindow -
                        dt
                );

        }


        const intended =
            Math.min(
                dash.remainingDistance,
                dash.speed *
                    dt
            );


        const dx =
            dash.direction.x *
            intended;


        const dy =
            dash.direction.y *
            intended;


        const beforeX =
            player.x;


        const beforeY =
            player.y;


        moveCircleWithCollision(
            player,
            dx,
            dy,
            player.radius,
            state.world
        );


        const actual =
            distance(
                beforeX,
                beforeY,
                player.x,
                player.y
            );


        dash.remainingDistance =
            Math.max(
                0,
                dash.remainingDistance -
                    actual
            );


        dash.trailTimer -=
            dt;


        if (
            dash.trailTimer <=
            0
        ) {

            dash.trailTimer =
                0.026;


            if (
                !Array.isArray(
                    state.world
                        ?.dashTrails
                )
            ) {

                state.world.dashTrails =
                    [];

            }


            state.world.dashTrails.push({

                x:
                    player.x,

                y:
                    player.y,

                version:
                    dash.version,

                timer:
                    dash.version ===
                        2
                        ? 0.45
                        : 0.25,

                maxTimer:
                    dash.version ===
                        2
                        ? 0.45
                        : 0.25

            });

        }


        if (
            dash.elapsed >=
                dash.duration ||
            dash.remainingDistance <=
                1 ||
            actual <
                intended *
                0.08
        ) {

            dash.active =
                false;


            player.dashRuntime =
                null;

        }

    }


    function updateDashTrails(
        dt
    ) {

        if (
            !state.world
        ) {
            return;
        }


        if (
            !Array.isArray(
                state.world.dashTrails
            )
        ) {
            return;
        }


        for (
            const trail of
            state.world.dashTrails
        ) {

            trail.timer -=
                dt;

        }


        state.world.dashTrails =
            state.world.dashTrails
                .filter(
                    trail =>
                        trail.timer >
                        0
                );

    }


    /* ============================================================
       ENEMY IA
       ============================================================ */

    function updateEnemies(
        dt
    ) {

        const player =
            state.player;


        const world =
            state.world;


        if (
            !player ||
            !world ||
            player.dead
        ) {
            return;
        }


        for (
            const enemy of
            world.enemies ||
            []
        ) {

            if (
                enemy.dead
            ) {
                continue;
            }


            enemy.animationTime +=
                dt;


            enemy.attackCooldown =
                Math.max(
                    0,
                    enemy.attackCooldown -
                        dt
                );


            enemy.abilityCooldown =
                Math.max(
                    0,
                    enemy.abilityCooldown -
                        dt
                );


            enemy.stateTimer =
                Math.max(
                    0,
                    enemy.stateTimer -
                        dt
                );


            const dist =
                distance(
                    enemy.x,
                    enemy.y,
                    player.x,
                    player.y
                );


            if (
                !enemy.aggro &&
                dist <=
                    GAME_CONFIG
                        .enemyActivationDistance
            ) {

                enemy.aggro =
                    true;

            }


            if (
                enemy.aggro &&
                dist >
                    GAME_CONFIG
                        .enemyForgetDistance
            ) {

                enemy.aggro =
                    false;

                enemy.state =
                    "idle";

            }


            if (
                !enemy.aggro
            ) {

                updateEnemyIdle(
                    enemy,
                    dt
                );

                continue;

            }


            updateEnemyAbility(
                enemy,
                dt
            );

        }

    }


    function updateEnemyIdle(
        enemy,
        dt
    ) {

        if (
            enemy.state !==
                "idle"
        ) {

            enemy.state =
                "idle";

        }


        if (
            distance(
                enemy.x,
                enemy.y,
                enemy.spawnX,
                enemy.spawnY
            ) >
            90
        ) {

            const direction =
                normalize(
                    enemy.spawnX -
                        enemy.x,
                    enemy.spawnY -
                        enemy.y
                );


            moveCircleWithCollision(
                enemy,
                direction.x *
                    enemy.speed *
                    0.35 *
                    dt,
                direction.y *
                    enemy.speed *
                    0.35 *
                    dt,
                enemy.radius,
                state.world
            );

        }

    }


    function updateEnemyAbility(
        enemy,
        dt
    ) {

        switch (
            enemy.ability
        ) {

            case "wolfCharge":
                updateWolfCharge(
                    enemy,
                    dt
                );
                break;


            case "heavyCharge":
                updateBoarCharge(
                    enemy,
                    dt
                );
                break;


            case "rootShot":
                updateRangedEnemy(
                    enemy,
                    dt,
                    {
                        range:
                            310,
                        projectileSpeed:
                            250,
                        damageMultiplier:
                            0.9,
                        color:
                            "#6d9a63",
                        type:
                            "root"
                    }
                );
                break;


            case "groundSlam":
                updateGroundSlamEnemy(
                    enemy,
                    dt
                );
                break;


            case "oreBurst":
                updateOreBurstEnemy(
                    enemy,
                    dt
                );
                break;


            case "burningCharge":
                updateBurningChargeEnemy(
                    enemy,
                    dt
                );
                break;


            case "webSlow":
            case "voidWeb":
                updateWebEnemy(
                    enemy,
                    dt
                );
                break;


            case "poison":
                updatePoisonEnemy(
                    enemy,
                    dt
                );
                break;


            case "dive":
                updateDiveEnemy(
                    enemy,
                    dt
                );
                break;


            case "shadowStrike":
                updateShadowStrikeEnemy(
                    enemy,
                    dt
                );
                break;


            case "voidBlink":
                updateVoidBlinkEnemy(
                    enemy,
                    dt
                );
                break;


            case "quickStrike":
            default:
                updateBasicMeleeEnemy(
                    enemy,
                    dt
                );
                break;

        }

    }


    /* ============================================================
       LOBO — CHARGE CONTÍNUO

       NÃO TELEPORTA.
       TELEGRAPH -> MOVIMENTO CONTÍNUO.
       ~2 segundos de cooldown.
       ============================================================ */

    function updateWolfCharge(
        enemy,
        dt
    ) {

        const player =
            state.player;


        const config =
            enemy.abilityConfig ||
            ENEMY_SPECIES
                .wolf
                .abilityConfig;


        if (
            enemy.state ===
                "chargeWindup"
        ) {

            if (
                enemy.stateTimer <=
                0
            ) {

                enemy.state =
                    "charging";


                enemy.stateTimer =
                    config.duration;

            }


            return;

        }


        if (
            enemy.state ===
                "charging"
        ) {

            const dx =
                enemy.velocityX *
                dt;


            const dy =
                enemy.velocityY *
                dt;


            const moved =
                moveCircleWithCollision(
                    enemy,
                    dx,
                    dy,
                    enemy.radius,
                    state.world
                );


            if (
                circleCircleCollision(
                    enemy.x,
                    enemy.y,
                    enemy.radius,
                    player.x,
                    player.y,
                    player.radius
                )
            ) {

                applyDamageToPlayer(
                    enemy.damage *
                        1.35,
                    {
                        enemy
                    }
                );


                enemy.stateTimer =
                    0;

            }


            if (
                !moved ||
                enemy.stateTimer <=
                    0
            ) {

                enemy.state =
                    "chase";

                enemy.abilityCooldown =
                    config.cooldown;

            }


            return;

        }


        const dist =
            distance(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            );


        if (
            enemy.abilityCooldown <=
                0 &&
            dist >=
                110 &&
            dist <=
                360
        ) {

            const direction =
                normalize(
                    player.x -
                        enemy.x,
                    player.y -
                        enemy.y
                );


            enemy.velocityX =
                direction.x *
                config.speed;


            enemy.velocityY =
                direction.y *
                config.speed;


            enemy.state =
                "chargeWindup";


            enemy.stateTimer =
                config.telegraph;


            enemy.telegraph = {

                type:
                    "charge",

                x:
                    player.x,

                y:
                    player.y,

                timer:
                    config.telegraph

            };


            return;

        }


        updateBasicMeleeEnemy(
            enemy,
            dt
        );

    }


    /* ============================================================
       JAVALI
       ============================================================ */

    function updateBoarCharge(
        enemy,
        dt
    ) {

        const player =
            state.player;


        const config =
            enemy.abilityConfig ||
            ENEMY_SPECIES
                .boar
                .abilityConfig;


        if (
            enemy.state ===
                "heavyWindup"
        ) {

            if (
                enemy.stateTimer <=
                0
            ) {

                enemy.state =
                    "heavyCharging";

                enemy.stateTimer =
                    config.duration;

            }


            return;

        }


        if (
            enemy.state ===
                "heavyCharging"
        ) {

            const moved =
                moveCircleWithCollision(
                    enemy,
                    enemy.velocityX *
                        dt,
                    enemy.velocityY *
                        dt,
                    enemy.radius,
                    state.world
                );


            if (
                circleCircleCollision(
                    enemy.x,
                    enemy.y,
                    enemy.radius,
                    player.x,
                    player.y,
                    player.radius
                )
            ) {

                applyDamageToPlayer(
                    enemy.damage *
                        1.6,
                    {
                        enemy
                    }
                );


                enemy.stateTimer =
                    0;

            }


            if (
                !moved ||
                enemy.stateTimer <=
                    0
            ) {

                enemy.state =
                    "chase";

                enemy.abilityCooldown =
                    config.cooldown;

            }


            return;

        }


        const dist =
            distance(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            );


        if (
            enemy.abilityCooldown <=
                0 &&
            dist >=
                120 &&
            dist <=
                330
        ) {

            const direction =
                normalize(
                    player.x -
                        enemy.x,
                    player.y -
                        enemy.y
                );


            enemy.velocityX =
                direction.x *
                config.speed;


            enemy.velocityY =
                direction.y *
                config.speed;


            enemy.state =
                "heavyWindup";


            enemy.stateTimer =
                config.telegraph;


            return;

        }


        updateBasicMeleeEnemy(
            enemy,
            dt
        );

    }


    /* ============================================================
       BASIC MELEE ENEMY

       ATAQUE É BASEADO EM DISTÂNCIA/COOLDOWN,
       NÃO EM MOVIMENTO DO PLAYER.
       ============================================================ */

    function updateBasicMeleeEnemy(
        enemy,
        dt
    ) {

        const player =
            state.player;


        const dist =
            distance(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            );


        const attackRange =
            enemy.radius +
            player.radius +
            15;


        if (
            dist <=
            attackRange
        ) {

            if (
                enemy.attackCooldown <=
                0
            ) {

                applyDamageToPlayer(
                    enemy.damage,
                    {
                        enemy
                    }
                );


                enemy.attackCooldown =
                    1.05;

            }


            return;

        }


        const direction =
            normalize(
                player.x -
                    enemy.x,
                player.y -
                    enemy.y
            );


        moveCircleWithCollision(
            enemy,
            direction.x *
                enemy.speed *
                dt,
            direction.y *
                enemy.speed *
                dt,
            enemy.radius,
            state.world
        );

    }


    function updateRangedEnemy(
        enemy,
        dt,
        config
    ) {

        const player =
            state.player;


        const dist =
            distance(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            );


        if (
            dist >
            config.range *
            0.75
        ) {

            const direction =
                normalize(
                    player.x -
                        enemy.x,
                    player.y -
                        enemy.y
                );


            moveCircleWithCollision(
                enemy,
                direction.x *
                    enemy.speed *
                    0.7 *
                    dt,
                direction.y *
                    enemy.speed *
                    0.7 *
                    dt,
                enemy.radius,
                state.world
            );

        }


        if (
            dist <=
                config.range &&
            enemy.attackCooldown <=
                0
        ) {

            const direction =
                normalize(
                    player.x -
                        enemy.x,
                    player.y -
                        enemy.y
                );


            createProjectile({

                owner:
                    "enemy",

                source:
                    enemy,

                x:
                    enemy.x,

                y:
                    enemy.y,

                dx:
                    direction.x,

                dy:
                    direction.y,

                speed:
                    config.projectileSpeed,

                radius:
                    7,

                damage:
                    enemy.damage *
                    config.damageMultiplier,

                color:
                    config.color,

                type:
                    config.type,

                life:
                    2.2

            });


            enemy.attackCooldown =
                1.75;

        }

    }


    function updateGroundSlamEnemy(
        enemy,
        dt
    ) {

        const player =
            state.player;


        const dist =
            distance(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            );


        if (
            dist <=
                85 &&
            enemy.abilityCooldown <=
                0
        ) {

            applyDamageToPlayer(
                enemy.damage *
                    1.25,
                {
                    enemy
                }
            );


            enemy.abilityCooldown =
                2.6;


            state.screenShake =
                0.18;

            state.screenShakePower =
                7;


            return;

        }


        updateBasicMeleeEnemy(
            enemy,
            dt
        );

    }


    function updateOreBurstEnemy(
        enemy,
        dt
    ) {

        const player =
            state.player;


        const dist =
            distance(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            );


        if (
            enemy.abilityCooldown <=
                0 &&
            dist <=
                250
        ) {

            for (
                let index = 0;
                index < 6;
                index += 1
            ) {

                const angle =
                    (
                        index /
                        6
                    ) *
                    Math.PI *
                    2;


                createProjectile({

                    owner:
                        "enemy",

                    source:
                        enemy,

                    x:
                        enemy.x,

                    y:
                        enemy.y,

                    dx:
                        Math.cos(
                            angle
                        ),

                    dy:
                        Math.sin(
                            angle
                        ),

                    speed:
                        190,

                    radius:
                        6,

                    damage:
                        enemy.damage *
                        0.75,

                    color:
                        "#887c69",

                    life:
                        1.6

                });

            }


            enemy.abilityCooldown =
                2.8;


            return;

        }


        updateBasicMeleeEnemy(
            enemy,
            dt
        );

    }


    function updateBurningChargeEnemy(
        enemy,
        dt
    ) {

        /*
            Reutiliza comportamento de charge,
            com configuração própria runtime.
        */

        const old =
            enemy.abilityConfig;


        if (!old) {

            enemy.abilityConfig = {
                cooldown: 2.4,
                telegraph: 0.5,
                speed: 420,
                duration: 0.5
            };

        }


        updateWolfCharge(
            enemy,
            dt
        );

    }


    function updateWebEnemy(
        enemy,
        dt
    ) {

        const player =
            state.player;


        const dist =
            distance(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            );


        if (
            enemy.abilityCooldown <=
                0 &&
            dist <=
                280
        ) {

            const direction =
                normalize(
                    player.x -
                        enemy.x,
                    player.y -
                        enemy.y
                );


            createProjectile({

                owner:
                    "enemy",

                source:
                    enemy,

                x:
                    enemy.x,

                y:
                    enemy.y,

                dx:
                    direction.x,

                dy:
                    direction.y,

                speed:
                    220,

                radius:
                    8,

                damage:
                    enemy.damage *
                    0.55,

                color:
                    enemy.ability ===
                        "voidWeb"
                        ? "#6e527c"
                        : "#d6d6cf",

                type:
                    "web",

                life:
                    2.2

            });


            enemy.abilityCooldown =
                2.1;


            return;

        }


        updateBasicMeleeEnemy(
            enemy,
            dt
        );

    }


    function updatePoisonEnemy(
        enemy,
        dt
    ) {

        const player =
            state.player;


        const dist =
            distance(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            );


        if (
            dist <=
                enemy.radius +
                player.radius +
                13 &&
            enemy.attackCooldown <=
                0
        ) {

            applyDamageToPlayer(
                enemy.damage,
                {
                    enemy
                }
            );


            player.poisonEffect = {

                timer:
                    4,

                tickTimer:
                    0.7,

                damage:
                    3

            };


            enemy.attackCooldown =
                1.5;


            return;

        }


        updateBasicMeleeEnemy(
            enemy,
            dt
        );

    }


    function updateDiveEnemy(
        enemy,
        dt
    ) {

        enemy.speed =
            ENEMY_SPECIES
                .bat
                .speed *
            (
                enemy.state ===
                    "dive"
                    ? 1.45
                    : 1
            );


        updateBasicMeleeEnemy(
            enemy,
            dt
        );

    }


    function updateShadowStrikeEnemy(
        enemy,
        dt
    ) {

        const player =
            state.player;


        const dist =
            distance(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            );


        if (
            dist <=
                110 &&
            enemy.abilityCooldown <=
                0
        ) {

            applyDamageToPlayer(
                enemy.damage *
                    1.45,
                {
                    enemy
                }
            );


            enemy.abilityCooldown =
                2.2;


            return;

        }


        updateBasicMeleeEnemy(
            enemy,
            dt
        );

    }


    function updateVoidBlinkEnemy(
        enemy,
        dt
    ) {

        const player =
            state.player;


        const dist =
            distance(
                enemy.x,
                enemy.y,
                player.x,
                player.y
            );


        if (
            dist >
                180 &&
            dist <
                420 &&
            enemy.abilityCooldown <=
                0
        ) {

            const direction =
                normalize(
                    player.x -
                        enemy.x,
                    player.y -
                        enemy.y
                );


            const target =
                findSafePosition(
                    player.x -
                        direction.x *
                        95,
                    player.y -
                        direction.y *
                        95,
                    enemy.radius,
                    state.world
                );


            /*
                Esse inimigo pode "piscar",
                mas o LOBO nunca usa isso.
            */
            enemy.x =
                target.x;

            enemy.y =
                target.y;


            enemy.abilityCooldown =
                3;


            return;

        }


        updateBasicMeleeEnemy(
            enemy,
            dt
        );

    }


    /* ============================================================
       WEB EFFECT ON HIT

       Percorremos projéteis mortos
       via aplicação direta no jogador.
       ============================================================ */

    function applyProjectileSecondaryEffect(
        projectile
    ) {

        const player =
            state.player;


        if (
            !player ||
            !projectile
        ) {
            return;
        }


        if (
            projectile.type ===
                "web"
        ) {

            player.movementSlowTimer =
                2.2;


            player.movementSlowMultiplier =
                0.62;

        }


        if (
            projectile.type ===
                "root"
        ) {

            player.movementSlowTimer =
                1.45;


            player.movementSlowMultiplier =
                0.48;

        }

    }


    /* ============================================================
       ENEMY DEATH
       ============================================================ */

    function killEnemy(
        enemy,
        source = {}
    ) {

        if (
            !enemy ||
            enemy.dead
        ) {
            return false;
        }


        enemy.dead =
            true;


        enemy.hp =
            0;


        /*
            BOSS
        */
        if (
            BOSS_REGISTRY[
                enemy.id
            ]
        ) {

            return killBoss(
                enemy
            );

        }


        grantXP(
            enemy.xp ||
            0
        );


        /*
            Dungeon registra inimigos mortos.
        */
        if (
            state.area ===
                "voidDungeon" &&
            enemy.questEnemyId
        ) {

            const quest =
                state.player
                    ?.miguelQuest;


            if (quest) {

                quest.clearedDungeonEnemyIds =
                    uniqueArray([
                        ...safeArray(
                            quest
                                .clearedDungeonEnemyIds
                        ),
                        enemy.questEnemyId
                    ]);

            }

        }


        /*
            Essência Sombria:
            apenas após aceitar missão.
        */
        if (
            enemy.drops
                ?.essenciaSombria &&
            state.player
                ?.miguelQuest
                ?.missionAccepted &&
            !state.player
                ?.miguelQuest
                ?.keyCollected
        ) {

            addItem(
                "essenciaSombria",
                enemy.drops
                    .essenciaSombria,
                {
                    silent:
                        true
                }
            );


            const current =
                getRealItemCount(
                    "essenciaSombria"
                );


            const required =
                VOID_MISSION_CONFIG
                    .shadowEssenceRequired;


            pushNotification(
                "ESSÊNCIA SOMBRIA",
                `${current}/${required}`,
                "special",
                1.3
            );


            if (
                current >=
                    required &&
                state.player
                    .miguelQuest
                    .stage ===
                    MIGUEL_QUEST_STAGE
                        .FIND_DARK_KEY
            ) {

                updateMiguelQuestObjective(
                    MIGUEL_QUEST_STAGE
                        .KEY_FOUND_NEEDS_ESSENCE,
                    `Você possui ${required} Essências Sombrias. Encontre a Chave Obscura no Caminho 2.`
                );

            }

        }


        return true;
    }


    /* ============================================================
       BOSS DEATH
       ============================================================ */

    function killBoss(
        boss
    ) {

        if (
            !boss ||
            boss.dead
        ) {
            return false;
        }


        boss.hp =
            0;


        boss.dead =
            true;


        boss.aggro =
            false;


        boss.state =
            BOSS_STATE.DYING;


        if (
            boss.id ===
                "vaelkor"
        ) {

            beginVaelkorDeathSequence(
                boss
            );


            return true;

        }


        boss.state =
            BOSS_STATE.DEFEATED;


        registerBossDefeated(
            boss.id
        );


        state.bossBarTarget =
            null;


        /*
            XP de boss.
        */
        grantXP(
            Math.max(
                100,
                Math.round(
                    boss.maxHp *
                    0.16
                )
            )
        );


        /*
            Guardião da Estrada:
            remove barreira imediatamente.
        */
        repairWorldBossBarriers();


        /*
            Path Guardian:
            Flauta da Memória.
        */
        if (
            boss.id ===
                "path_guardian" &&
            getRealItemCount(
                "flautaMemoria"
            ) <=
                0
        ) {

            addItem(
                "flautaMemoria",
                1,
                {
                    silent:
                        true
                }
            );


            pushNotification(
                "ITEM OBTIDO",
                "FLAUTA DA MEMÓRIA",
                "special",
                3
            );

        }


        /*
            Monarca:
            libera fluxo do Dash V1
            de acordo com sistema principal.
        */
        if (
            boss.id ===
                "monarch"
        ) {

            state.player.monarchDefeated =
                true;


            pushNotification(
                "O MONARCA CAIU",
                "O altar agora pode responder à sua oferenda.",
                "special",
                3
            );

        }


        return true;
    }


    /* ============================================================
       BOSSES — UPDATE
       ============================================================ */

    function updateBosses(
        dt
    ) {

        const world =
            state.world;


        const player =
            state.player;


        if (
            !world ||
            !player ||
            player.dead
        ) {
            return;
        }


        for (
            const boss of
            world.bosses ||
            []
        ) {

            if (
                boss.dead
            ) {
                continue;
            }


            boss.animationTime +=
                dt;


            boss.attackCooldown =
                Math.max(
                    0,
                    boss.attackCooldown -
                        dt
                );


            boss.abilityCooldown =
                Math.max(
                    0,
                    boss.abilityCooldown -
                        dt
                );


            boss.hurtAnim =
                Math.max(
                    0,
                    finiteNumber(
                        boss.hurtAnim,
                        0
                    ) -
                    dt
                );


            /*
                VAELKOR tem IA própria.
            */
            if (
                boss.id ===
                    "vaelkor"
            ) {

                updateVaelkor(
                    boss,
                    dt
                );


                continue;

            }


            /*
                GARANTIA:
                boss neutro não persegue.
            */
            if (
                !canBossBecomeAggressive(
                    boss
                )
            ) {

                boss.aggro =
                    false;


                if (
                    boss.state !==
                        BOSS_STATE.NEUTRAL
                ) {

                    boss.state =
                        BOSS_STATE.NEUTRAL;

                }


                continue;

            }


            if (
                boss.state ===
                    BOSS_STATE.CONFIRMED
            ) {

                activateBossCombat(
                    boss
                );

            }


            if (
                boss.state !==
                    BOSS_STATE.COMBAT
            ) {

                continue;

            }


            state.bossBarTarget =
                boss;


            updateStandardBossAI(
                boss,
                dt
            );

        }

    }


    function updateStandardBossAI(
        boss,
        dt
    ) {

        const player =
            state.player;


        const dist =
            distance(
                boss.x,
                boss.y,
                player.x,
                player.y
            );


        const attackRange =
            boss.radius +
            player.radius +
            25;


        if (
            dist <=
                attackRange
        ) {

            if (
                boss.attackCooldown <=
                    0
            ) {

                applyDamageToPlayer(
                    boss.damage,
                    {
                        boss
                    }
                );


                boss.attackCooldown =
                    1.1;

            }


            return;

        }


        const direction =
            normalize(
                player.x -
                    boss.x,
                player.y -
                    boss.y
            );


        moveCircleWithCollision(
            boss,
            direction.x *
                boss.speed *
                dt,
            direction.y *
                boss.speed *
                dt,
            boss.radius,
            state.world
        );

    }


    /* ============================================================
       CONFIRMAÇÃO DE BOSS
       ============================================================ */

    function getNearbyUnconfirmedBoss() {

        const player =
            state.player;


        if (
            !player ||
            !state.world
        ) {
            return null;
        }


        for (
            const boss of
            state.world.bosses ||
            []
        ) {

            if (
                boss.dead ||
                boss.confirmed
            ) {
                continue;
            }


            const definition =
                BOSS_REGISTRY[
                    boss.id
                ];


            if (
                !definition
                    ?.requiresConfirmation
            ) {
                continue;
            }


            if (
                distance(
                    player.x,
                    player.y,
                    boss.x,
                    boss.y
                ) <=
                GAME_CONFIG
                    .bossConfirmationDistance
            ) {

                return boss;

            }

        }


        return null;
    }


    /* ============================================================
       INTERACTION SCAN
       ============================================================ */

    function updateInteractionTargets() {

        const player =
            state.player;


        const world =
            state.world;


        gameplayRuntime.interactionTarget =
            null;


        gameplayRuntime.interactionPrompt =
            null;


        gameplayRuntime.nearbyDoor =
            null;


        gameplayRuntime.nearbyExit =
            null;


        gameplayRuntime.nearbyResource =
            null;


        gameplayRuntime.nearbyNPC =
            null;


        gameplayRuntime.nearbySecretDoor =
            null;


        if (
            !player ||
            !world
        ) {
            return;
        }


        /*
            NPC
        */
        let bestNPC =
            null;


        let bestNPCDistance =
            Infinity;


        for (
            const npc of
            world.npcs ||
            []
        ) {

            const dist =
                distance(
                    player.x,
                    player.y,
                    npc.x,
                    npc.y
                );


            if (
                dist <=
                    GAME_CONFIG
                        .npcInteractionDistance &&
                dist <
                    bestNPCDistance
            ) {

                bestNPC =
                    npc;


                bestNPCDistance =
                    dist;

            }

        }


        if (
            bestNPC
        ) {

            gameplayRuntime.nearbyNPC =
                bestNPC;


            gameplayRuntime.interactionTarget = {
                type:
                    "npc",
                entity:
                    bestNPC
            };


            gameplayRuntime.interactionPrompt = {
                key:
                    "E",
                text:
                    `Conversar com ${bestNPC.name}`
            };


            return;

        }


        /*
            SECRET DOOR
        */
        for (
            const secretDoor of
            world.secretDoors ||
            []
        ) {

            const centerX =
                secretDoor.x +
                secretDoor.w /
                2;


            const centerY =
                secretDoor.y +
                secretDoor.h /
                2;


            const dist =
                distance(
                    player.x,
                    player.y,
                    centerX,
                    centerY
                );


            if (
                dist <=
                115
            ) {

                gameplayRuntime.nearbySecretDoor =
                    secretDoor;


                gameplayRuntime.interactionTarget = {
                    type:
                        "secretDoor",
                    entity:
                        secretDoor
                };


                gameplayRuntime.interactionPrompt = {
                    key:
                        "E",

                    text:
                        secretDoor.opened
                            ? "Entrar na Área Secreta"
                            : getRealItemCount(
                                "chaveObscura"
                            ) >
                                0
                                ? "USAR CHAVE OBSCURA"
                                : "Examinar passagem"
                };


                return;

            }

        }


        /*
            DOOR
        */
        for (
            const door of
            world.doors ||
            []
        ) {

            const dist =
                distance(
                    player.x,
                    player.y,
                    door.centerX,
                    door.centerY
                );


            if (
                dist <=
                    GAME_CONFIG
                        .doorEnterDistance
            ) {

                gameplayRuntime.nearbyDoor =
                    door;


                gameplayRuntime.interactionTarget = {
                    type:
                        "door",
                    entity:
                        door
                };


                gameplayRuntime.interactionPrompt = {
                    key:
                        "Z",
                    text:
                        "Entrar"
                };


                return;

            }

        }


        /*
            RESOURCES
        */
        for (
            const resource of
            world.resources ||
            []
        ) {

            if (
                resource.collected
            ) {
                continue;
            }


            const dist =
                distance(
                    player.x,
                    player.y,
                    resource.x,
                    resource.y
                );


            if (
                dist <=
                95
            ) {

                gameplayRuntime.nearbyResource =
                    resource;


                gameplayRuntime.interactionTarget = {
                    type:
                        "resource",
                    entity:
                        resource
                };


                gameplayRuntime.interactionPrompt = {
                    key:
                        "E",

                    text:
                        getResourcePrompt(
                            resource
                        )
                };


                return;

            }

        }


        /*
            TREE HARVEST
        */
        for (
            const tree of
            world.trees ||
            []
        ) {

            if (
                tree.harvested
            ) {
                continue;
            }


            const dist =
                distance(
                    player.x,
                    player.y,
                    tree.x,
                    tree.y +
                        16
                );


            if (
                dist <=
                72
            ) {

                gameplayRuntime.interactionTarget = {
                    type:
                        "tree",
                    entity:
                        tree
                };


                gameplayRuntime.interactionPrompt = {
                    key:
                        "SEGURE E",
                    text:
                        "Coletar madeira"
                };


                return;

            }

        }


        /*
            EXIT
        */
        for (
            const exit of
            world.exits ||
            []
        ) {

            const expanded = {
                x:
                    exit.x -
                    20,
                y:
                    exit.y -
                    20,
                w:
                    exit.w +
                    40,
                h:
                    exit.h +
                    40
            };


            if (
                circleRectCollision(
                    player.x,
                    player.y,
                    player.radius,
                    expanded
                )
            ) {

                gameplayRuntime.nearbyExit =
                    exit;


                gameplayRuntime.interactionTarget = {
                    type:
                        "exit",
                    entity:
                        exit
                };


                gameplayRuntime.interactionPrompt = {
                    key:
                        exit.interactionKey ||
                        "E",

                    text:
                        exit.unlocked
                            ? exit.label
                            : exit.lockedMessage ||
                                "Caminho bloqueado"
                };


                return;

            }

        }

    }


    function getInteractionPrompt() {

        return gameplayRuntime
            .interactionPrompt;

    }


    function getResourcePrompt(
        resource
    ) {

        if (
            resource.type ===
                "darkKey"
        ) {

            const current =
                getItemCount(
                    "essenciaSombria"
                );


            return `Chave Obscura • ${current}/${VOID_MISSION_CONFIG.shadowEssenceRequired} Essências`;

        }


        if (
            resource.type ===
                "voidFragment"
        ) {

            return "Obter Fragmento do Vazio";

        }


        return "Coletar";
    }


    /* ============================================================
       PRIMARY INTERACTION E
       ============================================================ */

    function handlePrimaryInteractionPress() {

        /*
            Diálogo tem prioridade.
        */
        if (
            state.dialogue
        ) {

            advanceDialogue();

            return true;

        }


        /*
            Fragment minigame.
        */
        if (
            state.fragmentMinigame
                ?.active
        ) {

            attemptFragmentMinigame();

            return true;

        }


        /*
            Travel confirm handled by buttons.
        */
        if (
            state.travel ||
            state.battle ||
            state.activePanel
        ) {

            return false;

        }


        updateInteractionTargets();


        const target =
            gameplayRuntime
                .interactionTarget;


        if (!target) {

            return false;

        }


        switch (
            target.type
        ) {

            case "npc":

                interactWithNPC(
                    target.entity
                );

                return true;


            case "secretDoor":

                interactWithSecretDoor(
                    target.entity
                );

                return true;


            case "resource":

                interactWithResource(
                    target.entity
                );

                return true;


            case "tree":

                beginHoldInteraction(
                    "tree",
                    target.entity,
                    GAME_CONFIG
                        .treeHarvestSeconds
                );

                return true;


            case "exit":

                interactWithExit(
                    target.entity
                );

                return true;

        }


        return false;
    }


    /* ============================================================
       HOLD E
       ============================================================ */

    function beginHoldInteraction(
        type,
        target,
        duration
    ) {

        if (
            !target
        ) {
            return false;
        }


        state.holdAction = {

            type,

            target,

            elapsed:
                0,

            duration,

            completed:
                false

        };


        return true;
    }


    function handlePrimaryHoldInteractionEnd() {

        if (
            state.holdAction &&
            !state.holdAction
                .completed
        ) {

            state.holdAction =
                null;

        }

    }


    function updateHoldInteraction(
        dt
    ) {

        const action =
            state.holdAction;


        if (!action) {
            return;
        }


        /*
            E precisa continuar pressionado.
        */
        if (
            !state.keys.has(
                "KeyE"
            )
        ) {

            state.holdAction =
                null;

            return;

        }


        const target =
            action.target;


        if (!target) {

            state.holdAction =
                null;

            return;

        }


        const player =
            state.player;


        const targetX =
            target.x;


        const targetY =
            target.y +
            (
                action.type ===
                    "tree"
                    ? 16
                    : 0
            );


        if (
            distance(
                player.x,
                player.y,
                targetX,
                targetY
            ) >
            88
        ) {

            state.holdAction =
                null;

            return;

        }


        action.elapsed +=
            dt;


        if (
            action.elapsed <
            action.duration
        ) {

            return;

        }


        action.completed =
            true;


        if (
            action.type ===
                "tree"
        ) {

            harvestTree(
                target
            );

        }


        state.holdAction =
            null;
    }


    function getHoldActionProgress() {

        if (
            !state.holdAction
        ) {
            return null;
        }


        return clamp(
            state.holdAction
                .elapsed /
            state.holdAction
                .duration,
            0,
            1
        );
    }


    function harvestTree(
        tree
    ) {

        if (
            !tree ||
            tree.harvested
        ) {
            return false;
        }


        const player =
            state.player;


        /*
            Regra antiga:
            cortar madeira consome magia.
        */
        const magicCost =
            3;


        if (
            !state.dev
                ?.cheats
                ?.infiniteMagic &&
            player.magic <
                magicCost
        ) {

            pushNotification(
                "MAGIA INSUFICIENTE",
                "Você está exausto demais para extrair madeira.",
                "warning",
                1.5
            );


            return false;

        }


        if (
            !state.dev
                ?.cheats
                ?.infiniteMagic
        ) {

            player.magic -=
                magicCost;

        }


        const amount =
            tree.resourceAmount ||
            1;


        if (
            !addItem(
                "madeira",
                amount
            )
        ) {
            return false;
        }


        tree.harvested =
            true;


        tree.respawnTimer =
            random(
                65,
                110
            );


        rebuildDynamicWorldObstacles();


        pushNotification(
            "MADEIRA",
            `+${amount}`,
            "item",
            1.2
        );


        return true;
    }


    function updateTreeRespawns(
        dt
    ) {

        const world =
            state.world;


        if (!world) {
            return;
        }


        let changed =
            false;


        for (
            const tree of
            world.trees ||
            []
        ) {

            if (
                !tree.harvested
            ) {
                continue;
            }


            tree.respawnTimer -=
                dt;


            if (
                tree.respawnTimer <=
                0
            ) {

                tree.harvested =
                    false;


                changed =
                    true;

            }

        }


        if (
            changed
        ) {

            rebuildDynamicWorldObstacles();

        }

    }


    /* ============================================================
       DOOR Z
       ============================================================ */

    function handleDoorInteraction() {

        if (
            state.dialogue ||
            state.activePanel ||
            state.cutscene ||
            state.battle ||
            state.fragmentMinigame
                ?.active
        ) {

            return false;

        }


        /*
            Interior -> sair.
        */
        if (
            state.houseMode
        ) {

            return exitCurrentHouse();

        }


        updateInteractionTargets();


        const door =
            gameplayRuntime
                .nearbyDoor;


        if (
            !door ||
            !door.houseId
        ) {

            return false;

        }


        if (
            door.locked
        ) {

            return false;

        }


        /*
            Precisa estar praticamente aberta.
        */
        if (
            door.openAmount <
                0.7
        ) {

            door.targetOpen =
                1;


            return false;

        }


        return enterHouse(
            door.houseId,
            door.buildingId
        );
    }


    function enterHouse(
        houseId,
        buildingId
    ) {

        const interior =
            createHouseWorld(
                houseId
            );


        if (!interior) {
            return false;
        }


        const player =
            state.player;


        state.houseReturn = {

            area:
                state.area,

            buildingId,

            houseId

        };


        state.houseMode =
            true;


        state.currentHouse =
            houseId;


        state.world =
            interior;


        const spawn =
            interior
                .spawnPoints
                .default;


        player.x =
            spawn.x;


        player.y =
            spawn.y;


        player.facing =
            spawn.facing ||
            "up";


        state.camera.x =
            player.x;


        state.camera.y =
            player.y;


        return true;
    }


    function exitCurrentHouse() {

        const returnData =
            state.houseReturn;


        if (!returnData) {
            return false;
        }


        const area =
            returnData.area ||
            "village";


        const outside =
            buildWorld(
                area
            );


        if (!outside) {
            return false;
        }


        state.area =
            area;


        state.world =
            outside;


        state.houseMode =
            false;


        state.currentHouse =
            null;


        const building =
            findBuilding(
                returnData
                    .buildingId,
                outside
            );


        const door =
            getBuildingDoorGeometry(
                building
            );


        const player =
            state.player;


        if (
            door
        ) {

            const offset =
                72;


            if (
                door.side ===
                    "bottom"
            ) {

                player.x =
                    door.centerX;

                player.y =
                    door.centerY +
                    offset;

                player.facing =
                    "down";

            } else if (
                door.side ===
                    "top"
            ) {

                player.x =
                    door.centerX;

                player.y =
                    door.centerY -
                    offset;

                player.facing =
                    "up";

            } else if (
                door.side ===
                    "left"
            ) {

                player.x =
                    door.centerX -
                    offset;

                player.y =
                    door.centerY;

                player.facing =
                    "left";

            } else {

                player.x =
                    door.centerX +
                    offset;

                player.y =
                    door.centerY;

                player.facing =
                    "right";

            }

        }


        repairPlayerWorldPosition();


        state.houseReturn =
            null;


        return true;
    }


    /* ============================================================
       EXIT INTERACTION
       ============================================================ */

    function interactWithExit(
        exit
    ) {

        if (!exit) {
            return false;
        }


        /*
            Dungeon Vaelkor:
            se ativado e vivo, NÃO sai.
        */
        if (
            state.area ===
                "voidDungeon" &&
            exit.id ===
                "void_exit" &&
            state.player
                .miguelQuest
                .vaelkorActivated &&
            !state.player
                .miguelQuest
                .vaelkorDefeated
        ) {

            pushNotification(
                "A PASSAGEM ESTÁ SELADA",
                "Só a morte ou a vitória poderá tirá-lo daqui.",
                "warning",
                2.5
            );


            return false;

        }


        if (
            !exit.unlocked
        ) {

            pushNotification(
                "CAMINHO BLOQUEADO",
                exit.lockedMessage ||
                    "Você ainda não pode avançar.",
                "warning",
                2
            );


            return false;

        }


        if (
            gameplayRuntime
                .worldTransitionLock
        ) {

            return false;

        }


        gameplayRuntime
            .worldTransitionLock =
            true;


        loadWorld(
            exit.destination,
            exit.destinationSpawn ||
                "default"
        );


        state.camera.x =
            state.player.x;


        state.camera.y =
            state.player.y;


        setTimeout(
            () => {

                gameplayRuntime
                    .worldTransitionLock =
                    false;

            },
            120
        );


        return true;
    }


    /* ============================================================
       SECRET DOOR
       ============================================================ */

    function interactWithSecretDoor(
        door
    ) {

        if (!door) {
            return false;
        }


        const quest =
            state.player
                .miguelQuest;


        quest.secretDoorDiscovered =
            true;


        if (
            door.opened ||
            quest.secretDoorOpened
        ) {

            quest.dungeonDiscovered =
                true;


            state.player
                .discoveredMapLocations =
                uniqueArray([
                    ...state.player
                        .discoveredMapLocations,
                    "voidDungeon"
                ]);


            updateMiguelQuestObjective(
                MIGUEL_QUEST_STAGE
                    .EXPLORE_DUNGEON,
                "Explore a Área Secreta do Vazio."
            );


            loadWorld(
                "voidDungeon",
                "entrance"
            );


            return true;

        }


        const validation =
            canOpenVoidSecretDoor();


        if (
            !validation.ok
        ) {

            pushNotification(
                "PASSAGEM SELADA",
                validation.reason,
                "warning",
                2
            );


            return false;

        }


        /*
            Pequena animação lógica.
            Parte 4 desenha partículas/tremer.
        */
        state.cutscene = {

            id:
                "openVoidDoor",

            timer:
                0,

            duration:
                2.1,

            skippable:
                false,

            data: {
                door
            },

            onComplete:
                () => {

                    openVoidSecretDoor();


                    door.opened =
                        true;


                    door.locked =
                        false;


                    pushNotification(
                        "A PORTA DO VAZIO FOI ABERTA",
                        "",
                        "special",
                        2.5
                    );

                }

        };


        return true;
    }


    /* ============================================================
       RESOURCE INTERACTION
       ============================================================ */

    function interactWithResource(
        resource
    ) {

        if (!resource) {
            return false;
        }


        if (
            resource.type ===
                "darkKey"
        ) {

            const validation =
                canCollectDarkKey();


            if (
                !validation.ok
            ) {

                pushNotification(
                    "CHAVE OBSCURA",
                    validation.reason,
                    "warning",
                    2.5
                );


                return false;

            }


            if (
                collectDarkKey()
            ) {

                resource.collected =
                    true;


                state.itemPresentation = {

                    title:
                        "ITEM OBTIDO",

                    item:
                        "CHAVE OBSCURA",

                    text:
                        "Uma chave estranha envolvida por uma energia desconhecida. Miguel mencionou algo que permanecia trancado no Caminho 1.",

                    timer:
                        4.8

                };


                return true;

            }


            return false;

        }


        if (
            resource.type ===
                "voidFragment"
        ) {

            return beginVoidFragmentMinigame(
                resource
            );

        }


        return false;
    }


    /* ============================================================
       NPC INTERACTION
       ============================================================ */

    function interactWithNPC(
        npc
    ) {

        if (!npc) {
            return false;
        }


        if (
            npc.id ===
                "miguel"
        ) {

            return interactWithMiguel(
                npc
            );

        }


        if (
            npc.id ===
                "bran"
        ) {

            return interactWithBran(
                npc
            );

        }


        if (
            npc.id ===
                "borin"
        ) {

            return interactWithBorin(
                npc
            );

        }


        if (
            npc.vendor
        ) {

            startDialogue(
                npc.name,
                NPC_DIALOGUES[
                    npc.id
                ] ||
                [
                    "Tenho algumas coisas que podem lhe interessar."
                ],
                {
                    onComplete:
                        () => {

                            openShop(
                                npc.vendor
                            );

                        }
                }
            );


            return true;

        }


        const lines =
            NPC_DIALOGUES[
                npc.dialogueId ||
                npc.id
            ];


        if (
            lines
        ) {

            startDialogue(
                npc.name,
                lines
            );


            return true;

        }


        return false;
    }


    /* ============================================================
       MIGUEL
       ============================================================ */

    function interactWithMiguel(
        npc
    ) {

        const player =
            state.player;


        const quest =
            player.miguelQuest;


        quest.miguelFound =
            true;


        /*
            SEM DASH V1:
            sem missão e sem marcador.
        */
        if (
            getDashVersion(
                player
            ) ===
            0
        ) {

            quest.missionAvailable =
                false;


            quest.trackerVisible =
                false;


            startDialogue(
                "MIGUEL",
                NPC_DIALOGUES
                    .miguel
                    .beforeDash
            );


            return true;

        }


        /*
            Fragmento -> evolução.
        */
        if (
            quest.fragmentCollected &&
            !quest.fragmentDelivered
        ) {

            startDialogue(
                "MIGUEL",
                NPC_DIALOGUES
                    .miguel
                    .fragmentReturn,
                {
                    onComplete:
                        beginMiguelDashV2Sequence
                }
            );


            return true;

        }


        /*
            Missão concluída.
        */
        if (
            quest.completed ||
            player.abilities
                .dashV2
        ) {

            startDialogue(
                "MIGUEL",
                getMiguelDialogueForCurrentState()
            );


            return true;

        }


        /*
            Primeiro diálogo após Dash V1:
            oferece missão.
        */
        if (
            !quest.missionAccepted
        ) {

            quest.dashV1SeenByMiguel =
                true;


            quest.missionAvailable =
                true;


            startDialogue(
                "MIGUEL",
                NPC_DIALOGUES
                    .miguel
                    .offerQuest,
                {
                    choices: [

                        {
                            id:
                                "acceptMiguelQuest",

                            label:
                                "ACEITAR MISSÃO",

                            action:
                                () => {

                                    acceptMiguelQuest();


                                    pushNotification(
                                        "A PROVAÇÃO DO VAZIO",
                                        "Encontre a Chave Obscura no Caminho 2.",
                                        "quest",
                                        3
                                    );

                                }
                        },

                        {
                            id:
                                "declineMiguelQuest",

                            label:
                                "AGORA NÃO",

                            action:
                                () => {}
                        }

                    ]
                }
            );


            return true;

        }


        startDialogue(
            "MIGUEL",
            getMiguelDialogueForCurrentState()
        );


        return true;
    }


    /* ============================================================
       BRAN
       ============================================================ */

    function interactWithBran(
        npc
    ) {

        const quest =
            state.player
                .quest
                .wood;


        if (
            quest.state ===
                QUEST_STATE
                    .NOT_STARTED
        ) {

            startDialogue(
                "BRAN",
                NPC_DIALOGUES
                    .bran,
                {
                    onComplete:
                        () => {

                            startBasicQuest(
                                "wood"
                            );


                            pushNotification(
                                "MISSÃO",
                                "Colete 10 madeiras para Bran.",
                                "quest",
                                2.5
                            );

                        }
                }
            );


            return true;

        }


        if (
            quest.state ===
                QUEST_STATE
                    .ACTIVE
        ) {

            const progress =
                getQuestProgress(
                    "wood"
                );


            if (
                progress.current >=
                    progress.required
            ) {

                if (
                    completeBasicQuest(
                        "wood"
                    )
                ) {

                    startDialogue(
                        "BRAN",
                        [
                            "Isso vai ajudar bastante.",
                            `Aqui estão ${QUEST_CONFIG.wood.rewardCoins} moedas pelo trabalho.`
                        ]
                    );


                    return true;

                }

            }


            startDialogue(
                "BRAN",
                [
                    `Ainda preciso de madeira. ${progress.current}/${progress.required}.`
                ]
            );


            return true;

        }


        startDialogue(
            "BRAN",
            [
                "As casas estão mais firmes graças à sua ajuda."
            ]
        );


        return true;
    }


    /* ============================================================
       BORIN
       ============================================================ */

    function interactWithBorin(
        npc
    ) {

        const quest =
            state.player
                .quest
                .coal;


        if (
            quest.state ===
                QUEST_STATE
                    .NOT_STARTED
        ) {

            startDialogue(
                "BORIN",
                NPC_DIALOGUES
                    .borin,
                {
                    onComplete:
                        () => {

                            startBasicQuest(
                                "coal"
                            );


                            if (
                                npc.vendor
                            ) {

                                openShop(
                                    npc.vendor
                                );

                            }

                        }
                }
            );


            return true;

        }


        if (
            quest.state ===
                QUEST_STATE
                    .ACTIVE
        ) {

            const progress =
                getQuestProgress(
                    "coal"
                );


            if (
                progress.current >=
                    progress.required
            ) {

                completeBasicQuest(
                    "coal"
                );

            }

        }


        if (
            npc.vendor
        ) {

            openShop(
                npc.vendor
            );


            return true;

        }


        return false;
    }


    /* ============================================================
       DIALOGUE
       ============================================================ */

    function startDialogue(
        speaker,
        lines,
        options = {}
    ) {

        const safeLines =
            Array.isArray(
                lines
            )
                ? lines
                : [
                    String(
                        lines ||
                        ""
                    )
                ];


        state.dialogue = {

            speaker:
                speaker ||
                "",

            lines:
                safeLines,

            index:
                0,

            visibleText:
                "",

            typing:
                true,

            charIndex:
                0,

            charTimer:
                0,

            choices:
                options.choices ||
                null,

            onComplete:
                options.onComplete ||
                null,

            completed:
                false

        };


        return true;
    }


    function updateDialogueTyping(
        dt
    ) {

        const dialogue =
            state.dialogue;


        if (
            !dialogue ||
            !dialogue.typing
        ) {
            return;
        }


        const fullText =
            dialogue.lines[
                dialogue.index
            ] ||
            "";


        dialogue.charTimer +=
            dt *
            GAME_CONFIG
                .dialogueCharactersPerSecond;


        while (
            dialogue.charTimer >=
                1 &&
            dialogue.charIndex <
                fullText.length
        ) {

            dialogue.charIndex +=
                1;


            dialogue.charTimer -=
                1;

        }


        dialogue.visibleText =
            fullText.slice(
                0,
                dialogue.charIndex
            );


        if (
            dialogue.charIndex >=
            fullText.length
        ) {

            dialogue.visibleText =
                fullText;


            dialogue.typing =
                false;

        }

    }


    function completeCurrentDialogueLine() {

        const dialogue =
            state.dialogue;


        if (!dialogue) {
            return;
        }


        const fullText =
            dialogue.lines[
                dialogue.index
            ] ||
            "";


        dialogue.charIndex =
            fullText.length;


        dialogue.visibleText =
            fullText;


        dialogue.typing =
            false;

    }


    function advanceDialogue() {

        const dialogue =
            state.dialogue;


        if (!dialogue) {
            return false;
        }


        /*
            E enquanto escreve:
            completa frase.
        */
        if (
            dialogue.typing
        ) {

            completeCurrentDialogueLine();

            return true;

        }


        /*
            Ainda há fala.
        */
        if (
            dialogue.index <
            dialogue.lines.length -
                1
        ) {

            dialogue.index +=
                1;


            dialogue.charIndex =
                0;


            dialogue.visibleText =
                "";


            dialogue.charTimer =
                0;


            dialogue.typing =
                true;


            return true;

        }


        /*
            Se há escolhas, espera UI.
        */
        if (
            dialogue.choices &&
            dialogue.choices.length >
                0
        ) {

            return true;

        }


        finishDialogue();


        return true;
    }


    function chooseDialogueOption(
        choiceId
    ) {

        const dialogue =
            state.dialogue;


        if (
            !dialogue ||
            !dialogue.choices
        ) {
            return false;
        }


        const choice =
            dialogue.choices.find(
                item =>
                    item.id ===
                    choiceId
            );


        if (!choice) {
            return false;
        }


        if (
            typeof choice.action ===
                "function"
        ) {

            choice.action();

        }


        const callback =
            dialogue.onComplete;


        state.dialogue =
            null;


        if (
            typeof callback ===
                "function"
        ) {

            callback();

        }


        return true;
    }


    function finishDialogue() {

        const dialogue =
            state.dialogue;


        if (!dialogue) {
            return;
        }


        const callback =
            dialogue.onComplete;


        state.dialogue =
            null;


        if (
            typeof callback ===
                "function"
        ) {

            callback();

        }

    }


    /* ============================================================
       SHOP
       ============================================================ */

    const SHOP_CONFIG = Object.freeze({

        doran: Object.freeze({

            id:
                "doran",

            name:
                "LOJA DE DORAN"

        }),


        borin: Object.freeze({

            id:
                "borin",

            name:
                "FORJA DE BORIN"

        })

    });


    function openShop(
        vendorId
    ) {

        if (
            !SHOP_CONFIG[
                vendorId
            ]
        ) {
            return false;
        }


        state.shopNPC =
            vendorId;


        state.shopMode =
            "buy";


        state.activePanel =
            "shop";


        return true;
    }


    function closeShop() {

        state.shopNPC =
            null;


        state.activePanel =
            null;

    }


    function getShopItems(
        vendorId =
            state.shopNPC
    ) {

        const player =
            state.player;


        if (!player) {
            return [];
        }


        const items = [];


        if (
            vendorId ===
                "doran"
        ) {

            items.push(
                {
                    id:
                        "pao",
                    price:
                        15
                },
                {
                    id:
                        "pocao",
                    price:
                        55
                },
                {
                    id:
                        "elixir",
                    price:
                        65
                }
            );


            if (
                !player.lanternOwned
            ) {

                items.push({
                    id:
                        "lanterna",
                    price:
                        LANTERN_PRICE,
                    unique:
                        true
                });

            }


            if (
                !player.minimapOwned
            ) {

                items.push({
                    id:
                        "minimapa",
                    price:
                        MINIMAP_PRICE,
                    unique:
                        true
                });

            }


            const nextArmor =
                getNextArmorUpgradeId(
                    player
                );


            if (
                nextArmor &&
                ARMOR_DATA[
                    nextArmor
                ].tier <=
                4
            ) {

                items.push({
                    id:
                        nextArmor,
                    price:
                        ARMOR_DATA[
                            nextArmor
                        ].price,
                    type:
                        "armor"
                });

            }

        }


        if (
            vendorId ===
                "borin"
        ) {

            items.push(
                {
                    id:
                        "espadaFerro",
                    price:
                        210
                },
                {
                    id:
                        "pocaoForca",
                    price:
                        95
                },
                {
                    id:
                        "pocaoResistencia",
                    price:
                        95
                },
                {
                    id:
                        "pocaoVelocidade",
                    price:
                        110
                }
            );


            const nextArmor =
                getNextArmorUpgradeId(
                    player
                );


            if (
                nextArmor &&
                ARMOR_DATA[
                    nextArmor
                ].tier >=
                5
            ) {

                items.push({
                    id:
                        nextArmor,
                    price:
                        ARMOR_DATA[
                            nextArmor
                        ].price,
                    type:
                        "armor"
                });

            }

        }


        return items;
    }


    function canBuyShopItem(
        itemId,
        vendorId =
            state.shopNPC
    ) {

        const item =
            ITEMS[
                itemId
            ];


        const player =
            state.player;


        if (
            !item ||
            !player
        ) {

            return {
                ok: false,
                reason:
                    "Item inválido."
            };

        }


        const listing =
            getShopItems(
                vendorId
            )
                .find(
                    entry =>
                        entry.id ===
                        itemId
                );


        if (!listing) {

            return {
                ok: false,
                reason:
                    "Item indisponível."
            };

        }


        if (
            item.unique &&
            getRealItemCount(
                itemId
            ) >
                0
        ) {

            return {
                ok: false,
                reason:
                    "Você já possui este item."
            };

        }


        if (
            ARMOR_DATA[
                itemId
            ]
        ) {

            const armor =
                ARMOR_DATA[
                    itemId
                ];


            if (
                !isArmorNextUpgrade(
                    itemId
                )
            ) {

                return {
                    ok: false,
                    reason:
                        "Essa armadura não é sua próxima melhoria."
                };

            }


            if (
                armor.previousArmor &&
                !playerOwnsArmor(
                    armor.previousArmor
                )
            ) {

                return {
                    ok: false,
                    reason:
                        "Você precisa da armadura anterior."
                };

            }


            if (
                armor.material &&
                getItemCount(
                    armor.material
                ) <
                    armor.materialAmount
            ) {

                return {
                    ok: false,
                    reason:
                        `Faltam ${armor.materialAmount} ${ITEMS[armor.material]?.name || armor.material}.`
                };

            }


            if (
                !hasEnoughMoney(
                    armor.price
                )
            ) {

                return {
                    ok: false,
                    reason:
                        "Moedas insuficientes."
                };

            }


            return {
                ok: true,
                listing
            };

        }


        if (
            !hasEnoughMoney(
                listing.price
            )
        ) {

            return {
                ok: false,
                reason:
                    "Moedas insuficientes."
            };

        }


        return {
            ok: true,
            listing
        };
    }


    function buyShopItem(
        itemId
    ) {

        const validation =
            canBuyShopItem(
                itemId
            );


        if (
            !validation.ok
        ) {

            return false;

        }


        const item =
            ITEMS[
                itemId
            ];


        const armor =
            ARMOR_DATA[
                itemId
            ];


        /*
            ARMOR UPGRADE
        */
        if (
            armor
        ) {

            const player =
                state.player;


            const previous =
                armor.previousArmor;


            const wasEquipped =
                previous &&
                player.equipment
                    .armor ===
                    previous;


            if (
                armor.material &&
                !removeItem(
                    armor.material,
                    armor.materialAmount
                )
            ) {

                return false;

            }


            if (
                !spendMoney(
                    armor.price
                )
            ) {

                return false;

            }


            if (
                previous
            ) {

                delete player.inventory[
                    previous
                ];

            }


            player.inventory[
                armor.id
            ] =
                1;


            player.armorHighestTierEver =
                Math.max(
                    player.armorHighestTierEver,
                    armor.tier
                );


            if (
                wasEquipped ||
                !player.equipment
                    .armor
            ) {

                player.equipment.armor =
                    armor.id;

            }


            recalculatePlayerStats();


            return true;

        }


        const listing =
            validation.listing;


        if (
            !spendMoney(
                listing.price
            )
        ) {

            return false;

        }


        if (
            !addItem(
                itemId,
                1,
                {
                    silent:
                        true
                }
            )
        ) {

            /*
                devolve se não couber.
            */
            addMoney(
                listing.price
            );


            return false;

        }


        if (
            itemId ===
                "lanterna"
        ) {

            state.player.lanternOwned =
                true;

        }


        if (
            itemId ===
                "minimapa"
        ) {

            state.player.minimapOwned =
                true;

        }


        return true;
    }


    function getSellableInventoryEntries() {

        const player =
            state.player;


        if (!player) {
            return [];
        }


        return Object.entries(
            player.inventory
        )
            .filter(
                (
                    [
                        itemId,
                        amount
                    ]
                ) => {

                    const item =
                        ITEMS[
                            itemId
                        ];


                    if (
                        !item ||
                        amount <=
                            0
                    ) {
                        return false;
                    }


                    if (
                        item.progression ||
                        item.questItem ||
                        item.permanent ||
                        item.unique ||
                        !item.sellable
                    ) {

                        return false;

                    }


                    return true;

                }
            )
            .map(
                (
                    [
                        itemId,
                        amount
                    ]
                ) => {

                    const item =
                        ITEMS[
                            itemId
                        ];


                    return {

                        id:
                            itemId,

                        item,

                        amount,

                        sellPrice:
                            Math.max(
                                1,
                                Math.floor(
                                    item.value *
                                    0.55
                                )
                            )

                    };

                }
            );
    }


    function sellOneItem(
        itemId
    ) {

        const entry =
            getSellableInventoryEntries()
                .find(
                    item =>
                        item.id ===
                        itemId
                );


        if (!entry) {
            return false;
        }


        if (
            !removeItem(
                itemId,
                1
            )
        ) {
            return false;
        }


        addMoney(
            entry.sellPrice
        );


        return true;
    }


    function sellAllItem(
        itemId
    ) {

        const entry =
            getSellableInventoryEntries()
                .find(
                    item =>
                        item.id ===
                        itemId
                );


        if (!entry) {
            return false;
        }


        const quantity =
            entry.amount;


        if (
            quantity <=
            0
        ) {
            return false;
        }


        if (
            !removeItem(
                itemId,
                quantity
            )
        ) {
            return false;
        }


        addMoney(
            entry.sellPrice *
            quantity
        );


        return true;
    }


    /* ============================================================
       SKY TRIAL — 5 HORDAS
       ============================================================ */

    const SKY_TRIAL_WAVES = Object.freeze([

        Object.freeze([
            "bat",
            "bat",
            "wolf"
        ]),

        Object.freeze([
            "wolf",
            "wolf",
            "scorpion"
        ]),

        Object.freeze([
            "bat",
            "scorpion",
            "wolf",
            "wolf"
        ]),

        Object.freeze([
            "scorpion",
            "wolf",
            "bat",
            "wolf",
            "bat"
        ]),

        Object.freeze([
            "wolf",
            "wolf",
            "scorpion",
            "bat",
            "wolf",
            "scorpion"
        ])

    ]);


    function isPlayerInSkyTrialZone() {

        if (
            state.area !==
                "skyOne" ||
            !state.player
        ) {
            return false;
        }


        const zone =
            state.world
                ?.zones
                ?.find(
                    item =>
                        item.id ===
                        "sky_trial_zone"
                );


        if (!zone) {
            return false;
        }


        return pointInRect(
            state.player.x,
            state.player.y,
            zone
        );
    }


    function updateSkyTrial(
        dt
    ) {

        const player =
            state.player;


        if (
            !player ||
            state.area !==
                "skyOne"
        ) {
            return;
        }


        const trial =
            player.skyTrial;


        if (
            trial.complete
        ) {

            const exit =
                state.world.exits.find(
                    item =>
                        item.id ===
                        "sky1_to_sky2"
                );


            if (exit) {

                exit.unlocked =
                    true;

            }


            return;

        }


        if (
            !trial.started
        ) {

            if (
                !isPlayerInSkyTrialZone()
            ) {
                return;
            }


            trial.started =
                true;


            trial.wave =
                0;


            gameplayRuntime
                .skyTrial
                .waveDelay =
                0.8;


            pushNotification(
                "PROVA CELESTIAL",
                "Sobreviva às 5 hordas.",
                "quest",
                2.5
            );

        }


        const livingWaveEnemies =
            state.world.enemies.filter(
                enemy =>
                    !enemy.dead &&
                    enemy.skyTrialWave
            );


        if (
            livingWaveEnemies.length >
            0
        ) {

            return;

        }


        gameplayRuntime
            .skyTrial
            .waveDelay -=
            dt;


        if (
            gameplayRuntime
                .skyTrial
                .waveDelay >
            0
        ) {

            return;

        }


        if (
            trial.wave >=
            5
        ) {

            trial.complete =
                true;


            trial.activeWave =
                0;


            pushNotification(
                "PROVA CONCLUÍDA",
                "A passagem para o Céu II foi liberada.",
                "success",
                3
            );


            const exit =
                state.world.exits.find(
                    item =>
                        item.id ===
                        "sky1_to_sky2"
                );


            if (exit) {

                exit.unlocked =
                    true;

            }


            return;

        }


        spawnSkyTrialWave(
            trial.wave +
            1
        );


        trial.wave +=
            1;


        trial.activeWave =
            trial.wave;


        gameplayRuntime
            .skyTrial
            .waveDelay =
            1.2;

    }


    function spawnSkyTrialWave(
        waveNumber
    ) {

        const composition =
            SKY_TRIAL_WAVES[
                waveNumber -
                1
            ];


        if (!composition) {
            return;
        }


        const centerX =
            1700;


        const centerY =
            1050;


        composition.forEach(
            (
                species,
                index
            ) => {

                const angle =
                    (
                        index /
                        composition.length
                    ) *
                    Math.PI *
                    2;


                const enemy =
                    createEnemy(
                        species,
                        {
                            entityId:
                                `sky_wave_${waveNumber}_${index}`,

                            x:
                                centerX +
                                Math.cos(
                                    angle
                                ) *
                                420,

                            y:
                                centerY +
                                Math.sin(
                                    angle
                                ) *
                                330

                        }
                    );


                enemy.skyTrialWave =
                    waveNumber;


                enemy.aggro =
                    true;


                state.world.enemies.push(
                    enemy
                );

            }
        );


        pushNotification(
            `HORDA ${waveNumber}/5`,
            "",
            "warning",
            1.5
        );

    }


    /* ============================================================
       VAELKOR — ARENA ENTRY
       ============================================================ */

    function getVaelkorBoss() {

        return state.world
            ?.bosses
            ?.find(
                boss =>
                    boss.id ===
                    "vaelkor"
            ) ||
            null;
    }


    function updateVaelkorArenaTrigger() {

        if (
            state.area !==
                "voidDungeon" ||
            !state.player
        ) {

            return;

        }


        const quest =
            state.player
                .miguelQuest;


        if (
            quest.vaelkorDefeated
        ) {

            return;

        }


        if (
            !isPlayerInsideVoidArena()
        ) {

            return;

        }


        if (
            quest.vaelkorActivated
        ) {

            return;

        }


        beginVaelkorEntranceCutscene();

    }


    function beginVaelkorEntranceCutscene() {

        const quest =
            state.player
                .miguelQuest;


        if (
            quest.vaelkorActivated
        ) {
            return false;
        }


        quest.vaelkorActivated =
            true;


        quest.dungeonDiscovered =
            true;


        updateMiguelQuestObjective(
            MIGUEL_QUEST_STAGE
                .DEFEAT_VAELKOR,
            "Derrote Vaelkor, o Guardião do Vazio."
        );


        gameplayRuntime
            .vaelkor
            .spawnCutsceneStarted =
            true;


        gameplayRuntime
            .vaelkor
            .entranceLocked =
            true;


        /*
            Fecha saída.
        */
        const exit =
            state.world.exits.find(
                item =>
                    item.id ===
                    "void_exit"
            );


        if (exit) {

            exit.unlocked =
                false;

        }


        state.cutscene = {

            id:
                "vaelkorEntrance",

            timer:
                0,

            duration:
                5.9,

            skippable:
                false,

            stages: [

                {
                    at: 0,
                    id:
                        "doorsClose"
                },

                {
                    at: 1.1,
                    id:
                        "silence"
                },

                {
                    at: 2.0,
                    id:
                        "particlesBegin"
                },

                {
                    at: 3.1,
                    id:
                        "energyGather"
                },

                {
                    at: 4.35,
                    id:
                        "blackExplosion"
                },

                {
                    at: 5.15,
                    id:
                        "revealVaelkor"
                }

            ],

            completedStages:
                new Set(),

            onComplete:
                () => {

                    const boss =
                        getVaelkorBoss();


                    if (boss) {

                        boss.state =
                            BOSS_STATE.COMBAT;


                        boss.confirmed =
                            true;


                        boss.aggro =
                            true;


                        boss.attackCooldown =
                            1.25;


                        state.bossBarTarget =
                            boss;

                    }


                    gameplayRuntime
                        .vaelkor
                        .spawnCutsceneCompleted =
                        true;

                }

        };


        return true;
    }


    /* ============================================================
       VAELKOR
       ============================================================ */

    function updateVaelkor(
        boss,
        dt
    ) {

        if (
            boss.dead ||
            boss.state ===
                BOSS_STATE.DORMANT ||
            boss.state ===
                BOSS_STATE.DYING ||
            boss.state ===
                BOSS_STATE.DEFEATED
        ) {

            return;

        }


        /*
            Sempre central.
        */
        if (
            boss.centerLocked
        ) {

            boss.x =
                boss.spawnX;


            boss.y =
                boss.spawnY;

        }


        /*
            50% -> fase II.
        */
        if (
            boss.phase ===
                1 &&
            boss.hp <=
                boss.maxHp *
                0.5 &&
            !boss.phaseTransitionDone
        ) {

            beginVaelkorPhaseTransition(
                boss
            );


            return;

        }


        if (
            boss.state ===
                BOSS_STATE.PHASE_TRANSITION
        ) {

            return;

        }


        if (
            boss.state !==
                BOSS_STATE.COMBAT
        ) {

            return;

        }


        state.bossBarTarget =
            boss;


        boss.attackCooldown =
            Math.max(
                0,
                boss.attackCooldown -
                    dt
            );


        updateVaelkorActiveAttacks(
            boss,
            dt
        );


        if (
            boss.attackCooldown >
            0
        ) {

            return;

        }


        chooseVaelkorAttack(
            boss
        );

    }


    function beginVaelkorPhaseTransition(
        boss
    ) {

        if (
            gameplayRuntime
                .vaelkor
                .phaseTransitionStarted
        ) {

            return;

        }


        gameplayRuntime
            .vaelkor
            .phaseTransitionStarted =
            true;


        boss.state =
            BOSS_STATE
                .PHASE_TRANSITION;


        boss.phase =
            2;


        /*
            Limpa summons vivos por um instante.
        */
        for (
            const enemy of
            state.world.enemies
        ) {

            if (
                enemy.vaelkorSummon
            ) {

                enemy.dead =
                    true;

            }

        }


        state.cutscene = {

            id:
                "vaelkorPhaseTwo",

            timer:
                0,

            duration:
                4.4,

            skippable:
                false,

            dialogue: [

                "Você aprendeu a fugir...",

                "Agora mostre-me se consegue sobreviver."

            ],

            onComplete:
                () => {

                    boss.state =
                        BOSS_STATE.COMBAT;


                    boss.phaseTransitionDone =
                        true;


                    boss.attackCooldown =
                        0.85;


                    state.player
                        .miguelQuest
                        .vaelkorPhaseTwoSeen =
                        true;


                    gameplayRuntime
                        .vaelkor
                        .phaseTransitionCompleted =
                        true;

                }

        };

    }


    /* ============================================================
       VAELKOR ATTACK RUNTIME
       ============================================================ */

    function ensureVaelkorAttackArray() {

        if (
            !Array.isArray(
                state.world
                    ?.bossAttacks
            )
        ) {

            state.world.bossAttacks =
                [];

        }


        return state.world
            .bossAttacks;
    }


    function chooseVaelkorAttack(
        boss
    ) {

        const attacks =
            ensureVaelkorAttackArray();


        const phase =
            boss.phase;


        const index =
            gameplayRuntime
                .vaelkor
                .attackPatternIndex;


        gameplayRuntime
            .vaelkor
            .attackPatternIndex +=
            1;


        /*
            FASE 1:
            sem empilhar tudo.
        */
        if (
            phase ===
                1
        ) {

            const sequence = [
                "barrage",
                "beam",
                "summon",
                "barrage",
                "beam"
            ];


            const selected =
                sequence[
                    index %
                    sequence.length
                ];


            spawnVaelkorAttack(
                boss,
                selected
            );


            boss.attackCooldown =
                random(
                    2.2,
                    3
                );


            return;

        }


        /*
            FASE 2:
            combinações com janelas.
        */
        const phaseTwoPatterns = [

            [
                "summon",
                "barrage"
            ],

            [
                "summon",
                "beam"
            ],

            [
                "barrage",
                "beam"
            ],

            [
                "barrage"
            ],

            [
                "beam"
            ]

        ];


        const hpRatio =
            boss.hp /
            boss.maxHp;


        let pattern =
            phaseTwoPatterns[
                index %
                phaseTwoPatterns.length
            ];


        /*
            Últimos 20%:
            permite combinação tripla,
            mas não em toda rotação.
        */
        if (
            hpRatio <=
                0.2 &&
            index %
                4 ===
                0
        ) {

            pattern = [
                "summon",
                "barrage",
                "beam"
            ];

        }


        pattern.forEach(
            (
                type,
                patternIndex
            ) => {

                attacks.push({

                    type:
                        "delayedTrigger",

                    attackType:
                        type,

                    source:
                        boss,

                    timer:
                        patternIndex *
                        0.65,

                    dead:
                        false

                });

            }
        );


        boss.attackCooldown =
            random(
                1.55,
                2.2
            );

    }


    function spawnVaelkorAttack(
        boss,
        type
    ) {

        if (
            type ===
                "barrage"
        ) {

            createVaelkorBarrage(
                boss
            );


            return;

        }


        if (
            type ===
                "beam"
        ) {

            createVaelkorBeam(
                boss
            );


            return;

        }


        if (
            type ===
                "summon"
        ) {

            createVaelkorSummon(
                boss
            );

        }

    }


    /* ============================================================
       RAJADA DO VAZIO
       ============================================================ */

    function createVaelkorBarrage(
        boss
    ) {

        const config =
            BOSS_REGISTRY
                .vaelkor
                .attacks
                .voidBarrage;


        ensureVaelkorAttackArray()
            .push({

                type:
                    "barrageTelegraph",

                source:
                    boss,

                timer:
                    config.telegraph,

                maxTimer:
                    config.telegraph,

                fired:
                    false,

                dead:
                    false

            });

    }


    function fireVaelkorBarrage(
        attack
    ) {

        const boss =
            attack.source;


        const player =
            state.player;


        const config =
            BOSS_REGISTRY
                .vaelkor
                .attacks
                .voidBarrage;


        const orbCount =
            boss.phase ===
                1
                ? config.baseOrbCount
                : config.phaseTwoOrbCount;


        const baseAngle =
            angleBetween(
                boss.x,
                boss.y,
                player.x,
                player.y
            );


        /*
            Alguns miram no player,
            outros formam padrão.

            Sempre deixa lacunas.
        */
        for (
            let index = 0;
            index < orbCount;
            index += 1
        ) {

            let angle;


            if (
                index <
                3
            ) {

                angle =
                    baseAngle +
                    random(
                        -0.11,
                        0.11
                    );

            } else {

                const spread =
                    (
                        index -
                        3
                    ) /
                    Math.max(
                        1,
                        orbCount -
                            3
                    );


                angle =
                    baseAngle -
                    1.15 +
                    spread *
                    2.3;


                /*
                    cria pequenos espaços.
                */
                if (
                    index %
                    4 ===
                    0
                ) {

                    angle +=
                        0.22;

                }

            }


            createProjectile({

                owner:
                    "enemy",

                source:
                    boss,

                x:
                    boss.x,

                y:
                    boss.y,

                dx:
                    Math.cos(
                        angle
                    ),

                dy:
                    Math.sin(
                        angle
                    ),

                speed:
                    config.projectileSpeed +
                    random(
                        -15,
                        20
                    ),

                radius:
                    10,

                damage:
                    config.damage,

                color:
                    "#2a1e31",

                type:
                    "voidOrb",

                life:
                    4

            });

        }

    }


    /* ============================================================
       FEIXE DO VAZIO
       ============================================================ */

    function createVaelkorBeam(
        boss
    ) {

        const config =
            BOSS_REGISTRY
                .vaelkor
                .attacks
                .voidBeam;


        const player =
            state.player;


        const angle =
            angleBetween(
                boss.x,
                boss.y,
                player.x,
                player.y
            );


        ensureVaelkorAttackArray()
            .push({

                type:
                    "beam",

                source:
                    boss,

                angle,

                telegraph:
                    boss.phase ===
                        1
                        ? config.telegraph
                        : config.phaseTwoTelegraph,

                timer:
                    boss.phase ===
                        1
                        ? config.telegraph
                        : config.phaseTwoTelegraph,

                fireTimer:
                    config.duration,

                width:
                    config.width,

                length:
                    config.length,

                damage:
                    config.damage,

                firing:
                    false,

                hitPlayer:
                    false,

                dead:
                    false

            });

    }


    function distancePointToSegment(
        px,
        py,
        x1,
        y1,
        x2,
        y2
    ) {

        const lineX =
            x2 -
            x1;


        const lineY =
            y2 -
            y1;


        const lengthSquared =
            lineX *
                lineX +
            lineY *
                lineY;


        if (
            lengthSquared <=
            0.000001
        ) {

            return distance(
                px,
                py,
                x1,
                y1
            );

        }


        const t =
            clamp(
                (
                    (
                        px -
                        x1
                    ) *
                    lineX +
                    (
                        py -
                        y1
                    ) *
                    lineY
                ) /
                lengthSquared,
                0,
                1
            );


        const nearestX =
            x1 +
            t *
            lineX;


        const nearestY =
            y1 +
            t *
            lineY;


        return distance(
            px,
            py,
            nearestX,
            nearestY
        );
    }


    /* ============================================================
       INVOCAÇÃO SOMBRIA
       ============================================================ */

    function createVaelkorSummon(
        boss
    ) {

        const config =
            BOSS_REGISTRY
                .vaelkor
                .attacks
                .shadowSummon;


        const count =
            boss.phase ===
                1
                ? config.phaseOneCount
                : config.phaseTwoCount;


        for (
            let index = 0;
            index < count;
            index += 1
        ) {

            const angle =
                (
                    index /
                    count
                ) *
                Math.PI *
                2 +
                random(
                    -0.3,
                    0.3
                );


            const radius =
                random(
                    260,
                    360
                );


            const x =
                boss.x +
                Math.cos(
                    angle
                ) *
                radius;


            const y =
                boss.y +
                Math.sin(
                    angle
                ) *
                radius;


            const safe =
                findSafePosition(
                    x,
                    y,
                    20,
                    state.world
                );


            const species =
                index %
                    2 ===
                    0
                    ? "voidSpider"
                    : "voidGoblin";


            const enemy =
                createEnemy(
                    species,
                    {
                        x:
                            safe.x,

                        y:
                            safe.y,

                        entityId:
                            `vaelkor_summon_${Date.now()}_${index}`
                    }
                );


            enemy.vaelkorSummon =
                true;


            enemy.aggro =
                true;


            state.world
                .enemies
                .push(
                    enemy
                );

        }

    }


    /* ============================================================
       UPDATE VAELKOR ATTACKS
       ============================================================ */

    function updateVaelkorActiveAttacks(
        boss,
        dt
    ) {

        const attacks =
            ensureVaelkorAttackArray();


        const player =
            state.player;


        for (
            const attack of
            attacks
        ) {

            if (
                attack.dead
            ) {
                continue;
            }


            if (
                attack.type ===
                    "delayedTrigger"
            ) {

                attack.timer -=
                    dt;


                if (
                    attack.timer <=
                    0
                ) {

                    spawnVaelkorAttack(
                        boss,
                        attack.attackType
                    );


                    attack.dead =
                        true;

                }


                continue;

            }


            if (
                attack.type ===
                    "barrageTelegraph"
            ) {

                attack.timer -=
                    dt;


                if (
                    attack.timer <=
                        0 &&
                    !attack.fired
                ) {

                    attack.fired =
                        true;


                    fireVaelkorBarrage(
                        attack
                    );


                    attack.dead =
                        true;

                }


                continue;

            }


            if (
                attack.type ===
                    "beam"
            ) {

                if (
                    !attack.firing
                ) {

                    attack.timer -=
                        dt;


                    if (
                        attack.timer <=
                        0
                    ) {

                        attack.firing =
                            true;

                    }


                    continue;

                }


                attack.fireTimer -=
                    dt;


                const endX =
                    boss.x +
                    Math.cos(
                        attack.angle
                    ) *
                    attack.length;


                const endY =
                    boss.y +
                    Math.sin(
                        attack.angle
                    ) *
                    attack.length;


                const playerDistance =
                    distancePointToSegment(
                        player.x,
                        player.y,
                        boss.x,
                        boss.y,
                        endX,
                        endY
                    );


                if (
                    !attack.hitPlayer &&
                    playerDistance <=
                        attack.width /
                        2 +
                        player.radius
                ) {

                    const result =
                        applyDamageToPlayer(
                            attack.damage,
                            {
                                boss,
                                beam:
                                    true
                            }
                        );


                    if (
                        result !==
                        false
                    ) {

                        attack.hitPlayer =
                            true;

                    }

                }


                if (
                    attack.fireTimer <=
                    0
                ) {

                    attack.dead =
                        true;

                }

            }

        }


        state.world.bossAttacks =
            attacks.filter(
                attack =>
                    !attack.dead
            );

    }


    /* ============================================================
       VAELKOR DEATH
       ============================================================ */

    function beginVaelkorDeathSequence(
        boss
    ) {

        if (
            gameplayRuntime
                .vaelkor
                .endingStarted
        ) {

            return;

        }


        gameplayRuntime
            .vaelkor
            .endingStarted =
            true;


        /*
            Limpa tudo.
        */
        state.world.projectiles =
            [];


        state.world.bossAttacks =
            [];


        for (
            const enemy of
            state.world.enemies
        ) {

            if (
                enemy.vaelkorSummon
            ) {

                enemy.dead =
                    true;

            }

        }


        boss.state =
            BOSS_STATE.DYING;


        boss.aggro =
            false;


        state.cutscene = {

            id:
                "vaelkorDeath",

            timer:
                0,

            duration:
                6.2,

            skippable:
                false,

            stages: [

                {
                    at: 0.3,
                    id:
                        "freeze"
                },

                {
                    at: 1.1,
                    id:
                        "cracks"
                },

                {
                    at: 2.2,
                    id:
                        "fragmentBody"
                },

                {
                    at: 3.2,
                    id:
                        "pullFragments"
                },

                {
                    at: 4.25,
                    id:
                        "implosion"
                },

                {
                    at: 5.05,
                    id:
                        "boom"
                },

                {
                    at: 5.7,
                    id:
                        "fragmentSpawn"
                }

            ],

            completedStages:
                new Set(),

            onComplete:
                () => {

                    finalizeVaelkorDeath(
                        boss
                    );

                }

        };

    }


    function finalizeVaelkorDeath(
        boss
    ) {

        const player =
            state.player;


        const quest =
            player.miguelQuest;


        quest.vaelkorDefeated =
            true;


        quest.vaelkorDeathCutscenePlayed =
            true;


        quest.fragmentSpawned =
            true;


        registerBossDefeated(
            "vaelkor"
        );


        boss.state =
            BOSS_STATE.DEFEATED;


        boss.dead =
            true;


        state.bossBarTarget =
            null;


        state.world.bosses =
            state.world.bosses.filter(
                item =>
                    item !==
                    boss
            );


        const alreadyExists =
            state.world.resources
                .some(
                    resource =>
                        resource.id ===
                        "void_fragment"
                );


        if (
            !alreadyExists
        ) {

            state.world.resources.push({

                id:
                    "void_fragment",

                type:
                    "voidFragment",

                x:
                    boss.spawnX,

                y:
                    boss.spawnY,

                radius:
                    34,

                collectible:
                    true,

                minigame:
                    true

            });

        }


        const exit =
            state.world.exits.find(
                item =>
                    item.id ===
                        "void_exit"
            );


        if (exit) {

            exit.unlocked =
                true;

        }


        updateMiguelQuestObjective(
            MIGUEL_QUEST_STAGE
                .COLLECT_FRAGMENT,
            "Obtenha o Fragmento do Vazio."
        );


        gameplayRuntime
            .vaelkor
            .endingCompleted =
            true;


        pushNotification(
            "VAELKOR FOI DERROTADO",
            "",
            "special",
            3
        );

    }


    /* ============================================================
       VOID FRAGMENT MINIGAME
       ============================================================ */

    function beginVoidFragmentMinigame(
        resource
    ) {

        const quest =
            state.player
                .miguelQuest;


        if (
            !quest.vaelkorDefeated ||
            quest.fragmentCollected
        ) {

            return false;

        }


        state.fragmentMinigame = {

            active:
                true,

            resource,

            round:
                0,

            pointer:
                0,

            direction:
                1,

            failed:
                false,

            successes:
                0,

            targetStart:
                random(
                    0.12,
                    0.58
                ),

            timer:
                0

        };


        return true;
    }


    function getCurrentFragmentRoundConfig() {

        const minigame =
            state.fragmentMinigame;


        if (
            !minigame
        ) {
            return null;
        }


        return (
            VOID_MISSION_CONFIG
                .fragmentMinigameRounds[
                    minigame.round
                ] ||
            null
        );
    }


    function updateFragmentMinigame(
        dt
    ) {

        const minigame =
            state.fragmentMinigame;


        if (
            !minigame?.active
        ) {
            return;
        }


        const config =
            getCurrentFragmentRoundConfig();


        if (!config) {
            return;
        }


        minigame.pointer +=
            minigame.direction *
            config.speed *
            dt;


        if (
            minigame.pointer >=
            1
        ) {

            minigame.pointer =
                1;


            minigame.direction =
                -1;

        }


        if (
            minigame.pointer <=
            0
        ) {

            minigame.pointer =
                0;


            minigame.direction =
                1;

        }

    }


    function attemptFragmentMinigame() {

        const minigame =
            state.fragmentMinigame;


        if (
            !minigame?.active
        ) {
            return false;
        }


        const config =
            getCurrentFragmentRoundConfig();


        if (!config) {
            return false;
        }


        const start =
            minigame.targetStart;


        const end =
            start +
            config.targetSize;


        const success =
            minigame.pointer >=
                start &&
            minigame.pointer <=
                end;


        /*
            Se errar em qualquer rodada:
            volta para rodada 1.
        */
        if (
            !success
        ) {

            minigame.round =
                0;


            minigame.successes =
                0;


            minigame.pointer =
                0;


            minigame.direction =
                1;


            minigame.targetStart =
                random(
                    0.12,
                    0.58
                );


            pushNotification(
                "A ENERGIA SE DESFEZ",
                "Tente novamente desde o início.",
                "warning",
                1.5
            );


            return false;

        }


        minigame.successes +=
            1;


        minigame.round +=
            1;


        if (
            minigame.round >=
            VOID_MISSION_CONFIG
                .fragmentMinigameRounds
                .length
        ) {

            completeVoidFragmentMinigame();


            return true;

        }


        minigame.pointer =
            0;


        minigame.direction =
            1;


        minigame.targetStart =
            random(
                0.12,
                0.68
            );


        pushNotification(
            `SINCRONIA ${minigame.round}/3`,
            "Continue.",
            "special",
            1.1
        );


        return true;
    }


    function completeVoidFragmentMinigame() {

        const minigame =
            state.fragmentMinigame;


        if (
            !minigame
        ) {
            return false;
        }


        const quest =
            state.player
                .miguelQuest;


        if (
            quest.fragmentCollected
        ) {

            state.fragmentMinigame =
                null;


            return false;

        }


        if (
            !addItem(
                "fragmentoVazio",
                1,
                {
                    silent:
                        true
                }
            )
        ) {

            return false;

        }


        quest.fragmentMiniGameCompleted =
            true;


        quest.fragmentCollected =
            true;


        if (
            minigame.resource
        ) {

            minigame.resource.collected =
                true;

        }


        state.fragmentMinigame =
            null;


        updateMiguelQuestObjective(
            MIGUEL_QUEST_STAGE
                .RETURN_TO_MIGUEL,
            "Retorne para Miguel."
        );


        state.itemPresentation = {

            title:
                "ITEM OBTIDO",

            item:
                "FRAGMENTO DO VAZIO",

            text:
                "Um fragmento que parece absorver a própria luz. Miguel talvez saiba o que fazer com isso.",

            timer:
                5

        };


        return true;
    }


    /* ============================================================
       MIGUEL -> DASH V2
       ============================================================ */

    function beginMiguelDashV2Sequence() {

        const quest =
            state.player
                ?.miguelQuest;


        if (
            !quest ||
            quest.fragmentDelivered ||
            state.player
                .abilities
                .dashV2
        ) {

            return false;

        }


        state.cutscene = {

            id:
                "miguelDashV2",

            timer:
                0,

            duration:
                4.6,

            skippable:
                false,

            stages: [

                {
                    at: 0.4,
                    id:
                        "fragmentLift"
                },

                {
                    at: 1.3,
                    id:
                        "voidOrbit"
                },

                {
                    at: 2.3,
                    id:
                        "screenDark"
                },

                {
                    at: 3.15,
                    id:
                        "voidBurst"
                },

                {
                    at: 3.75,
                    id:
                        "abilityReveal"
                }

            ],

            completedStages:
                new Set(),

            onComplete:
                () => {

                    removeItem(
                        "fragmentoVazio",
                        1
                    );


                    quest.fragmentDelivered =
                        true;


                    unlockDashV2();


                    state.itemPresentation = {

                        title:
                            "HABILIDADE EVOLUÍDA",

                        item:
                            "DASH V2 — DASH DO VAZIO",

                        text:
                            "Seu Dash agora rompe o próprio espaço.",

                        timer:
                            5

                    };

                }

        };


        return true;
    }


    /* ============================================================
       CUTSCENE UPDATE
       ============================================================ */

    function updateCutscene(
        dt
    ) {

        const cutscene =
            state.cutscene;


        if (!cutscene) {
            return;
        }


        cutscene.timer +=
            dt;


        if (
            Array.isArray(
                cutscene.stages
            )
        ) {

            if (
                !(cutscene.completedStages instanceof Set)
            ) {

                cutscene.completedStages =
                    new Set();

            }


            for (
                const stage of
                cutscene.stages
            ) {

                if (
                    cutscene.timer >=
                        stage.at &&
                    !cutscene.completedStages
                        .has(
                            stage.id
                        )
                ) {

                    cutscene.completedStages
                        .add(
                            stage.id
                        );


                    handleCutsceneStage(
                        cutscene,
                        stage
                    );

                }

            }

        }


        if (
            cutscene.timer >=
            cutscene.duration
        ) {

            const callback =
                cutscene.onComplete;


            state.cutscene =
                null;


            if (
                typeof callback ===
                    "function"
            ) {

                callback();

            }

        }

    }


    function handleCutsceneStage(
        cutscene,
        stage
    ) {

        switch (
            stage.id
        ) {

            case "blackExplosion":
            case "boom":
            case "voidBurst":

                state.screenShake =
                    0.35;


                state.screenShakePower =
                    13;

                break;


            case "fragmentSpawn":

                pushNotification(
                    "FRAGMENTO DO VAZIO",
                    "Algo restou no centro da arena.",
                    "special",
                    2.2
                );

                break;


            case "abilityReveal":

                pushNotification(
                    "HABILIDADE EVOLUÍDA",
                    "DASH V2 — DASH DO VAZIO",
                    "special",
                    3
                );

                break;

        }

    }


    function skipCurrentCutscene() {

        const cutscene =
            state.cutscene;


        if (
            !cutscene ||
            !cutscene.skippable
        ) {
            return false;
        }


        const callback =
            cutscene.onComplete;


        state.cutscene =
            null;


        if (
            typeof callback ===
                "function"
        ) {

            callback();

        }


        return true;
    }


    /* ============================================================
       DEATH
       ============================================================ */

    function calculateDeathMaterialLoss() {

        const player =
            state.player;


        if (!player) {
            return [];
        }


        const losses = [];


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


            if (
                !item ||
                item.category !==
                    "materials" ||
                amount <=
                    0
            ) {
                continue;
            }


            const loss =
                Math.min(
                    GAME_CONFIG
                        .deathMaxMaterialLossPerType,

                    Math.floor(
                        amount *
                        GAME_CONFIG
                            .deathMaterialLossRatio
                    )
                );


            if (
                loss >
                0
            ) {

                losses.push({
                    itemId,
                    amount:
                        loss
                });

            }

        }


        return losses;
    }


    function killPlayer(
        source = {}
    ) {

        const player =
            state.player;


        if (
            !player ||
            player.dead
        ) {
            return;
        }


        player.dead =
            true;


        player.hp =
            0;


        const losses =
            calculateDeathMaterialLoss();


        for (
            const loss of
            losses
        ) {

            removeItem(
                loss.itemId,
                loss.amount
            );

        }


        /*
            Vaelkor:
            tentativa reinicia.
            Vitória permanente permanece.
        */
        if (
            state.area ===
                "voidDungeon" &&
            !player.miguelQuest
                .vaelkorDefeated
        ) {

            player.miguelQuest
                .vaelkorActivated =
                false;


            player.miguelQuest
                .vaelkorPhaseTwoSeen =
                false;


            gameplayRuntime.vaelkor = {

                arenaEntered:
                    false,

                entranceLocked:
                    false,

                spawnCutsceneStarted:
                    false,

                spawnCutsceneCompleted:
                    false,

                phaseTransitionStarted:
                    false,

                phaseTransitionCompleted:
                    false,

                endingStarted:
                    false,

                endingCompleted:
                    false,

                attackPatternIndex:
                    0

            };

        }


        state.deathState = {

            timer:
                0,

            losses,

            source

        };


        state.bossBarTarget =
            null;


        state.cutscene =
            null;


        state.dialogue =
            null;


        state.fragmentMinigame =
            null;


        state.holdAction =
            null;


        if (
            state.world
        ) {

            state.world.projectiles =
                [];


            state.world.bossAttacks =
                [];

        }

    }


    function updateDeathState(
        dt
    ) {

        if (
            !state.deathState
        ) {
            return;
        }


        state.deathState.timer +=
            dt;

    }


    function respawnPlayerAtHome() {

        const player =
            state.player;


        if (!player) {
            return false;
        }


        /*
            Rebuild da Vila.
        */
        const world =
            buildVillageWorld();


        state.area =
            "village";


        state.world =
            world;


        state.houseMode =
            false;


        state.currentHouse =
            null;


        state.houseReturn =
            null;


        const spawn =
            world.spawnPoints
                .home ||
            world.spawnPoints
                .default ||
            getVillageHomeSpawnFromLayout();


        const safe =
            findSafePosition(
                spawn.x,
                spawn.y,
                player.radius,
                world
            );


        player.x =
            safe.x;


        player.y =
            safe.y;


        player.facing =
            spawn.facing ||
            "up";


        player.dead =
            false;


        player.hp =
            player.maxHp;


        player.magic =
            Math.max(
                player.maxMagic *
                0.65,
                1
            );


        player.energy =
            Math.max(
                player.maxEnergy *
                0.7,
                1
            );


        player.dashRuntime =
            null;


        player.universalDashCooldown =
            0;


        player.resting = {

            active:
                true,

            timer:
                0,

            duration:
                1.2

        };


        state.deathState =
            null;


        state.camera.x =
            player.x;


        state.camera.y =
            player.y;


        state.camera.targetX =
            player.x;


        state.camera.targetY =
            player.y;


        return true;
    }


    function updateResting(
        dt
    ) {

        const resting =
            state.player
                ?.resting;


        if (
            !resting?.active
        ) {
            return;
        }


        resting.timer +=
            dt;


        if (
            resting.timer >=
            resting.duration
        ) {

            resting.active =
                false;

        }

    }


    /* ============================================================
       RESOURCES / DARKNESS
       ============================================================ */

    function updateVoidDarknessBarrier() {

        if (
            state.area !==
                "voidDungeon" ||
            !state.player
        ) {
            return;
        }


        const player =
            state.player;


        /*
            Sem lanterna:
            não deixa avançar muito no corredor.
        */
        if (
            !player.lanternOwned &&
            player.x >
                610 &&
            !isPlayerInsideVoidArena()
        ) {

            player.x =
                600;


            if (
                state.time -
                    state.darknessWarningAt >
                2
            ) {

                state.darknessWarningAt =
                    state.time;


                pushNotification(
                    "ESTÁ MUITO ESCURO",
                    "Está muito escuro, não podes continuar.",
                    "warning",
                    2
                );

            }

        }

    }


    /* ============================================================
       CAMERA
       ============================================================ */

    function updateCamera(
        dt
    ) {

        const player =
            state.player;


        if (!player) {
            return;
        }


        state.camera.targetX =
            player.x;


        state.camera.targetY =
            player.y;


        const smoothing =
            1 -
            Math.pow(
                0.001,
                dt
            );


        state.camera.x =
            lerp(
                state.camera.x,
                state.camera.targetX,
                smoothing
            );


        state.camera.y =
            lerp(
                state.camera.y,
                state.camera.targetY,
                smoothing
            );

    }


    /* ============================================================
       NOTIFICATIONS UPDATE
       ============================================================ */

    function updateNotifications(
        dt
    ) {

        for (
            const notification of
            state.notifications
        ) {

            notification.timer -=
                dt;

        }


        state.notifications =
            state.notifications
                .filter(
                    notification =>
                        notification.timer >
                        0
                );


        if (
            state.itemPresentation
        ) {

            state.itemPresentation.timer -=
                dt;


            if (
                state.itemPresentation.timer <=
                0
            ) {

                state.itemPresentation =
                    null;

            }

        }

    }


    /* ============================================================
       SHAKE / FLASH
       ============================================================ */

    function updateScreenEffects(
        dt
    ) {

        state.screenShake =
            Math.max(
                0,
                state.screenShake -
                    dt
            );


        if (
            state.screenShake <=
                0
        ) {

            state.screenShakePower =
                0;

        }


        state.damageFlash =
            Math.max(
                0,
                state.damageFlash -
                    dt
            );

    }


    /* ============================================================
       INTERACTION PROMPT FOR EXIT

       Parte 4 desenha isso.
       ============================================================ */

    function getCurrentInteractionHint() {

        const prompt =
            getInteractionPrompt();


        if (!prompt) {
            return null;
        }


        return {

            key:
                prompt.key,

            text:
                prompt.text

        };
    }


    /* ============================================================
       BOSS TOP BAR
       ============================================================ */

    function shouldBossUseTopBar(
        boss
    ) {

        if (
            !boss ||
            boss.dead
        ) {
            return false;
        }


        const definition =
            BOSS_REGISTRY[
                boss.id
            ];


        if (
            !definition ||
            !definition.topBar
        ) {

            return false;

        }


        /*
            Boss neutro não mostra barra
            antes de aceitar.
        */
        if (
            definition
                .requiresConfirmation &&
            !boss.confirmed
        ) {

            return false;

        }


        if (
            boss.id ===
                "vaelkor" &&
            boss.state ===
                BOSS_STATE.DORMANT
        ) {

            return false;

        }


        return true;
    }


    /* ============================================================
       FIX DA CONFIRMAÇÃO DE BOSS

       Part 5 usa esta função.
       ============================================================ */

    function acceptBossBattleById(
        bossEntityId
    ) {

        const boss =
            state.world
                ?.bosses
                ?.find(
                    entry =>
                        (
                            entry.entityId ||
                            entry.id
                        ) ===
                        bossEntityId ||
                        entry.id ===
                            bossEntityId
                );


        if (!boss) {
            return false;
        }


        return confirmBossBattle(
            boss
        );
    }


    /* ============================================================
       UPDATE PRESENTATION SYSTEMS

       Parte 5 chama essa função
       mesmo quando diálogo pausa mundo.
       ============================================================ */

    function updatePresentationSystems(
        dt
    ) {

        state.time +=
            dt;


        updateDialogueTyping(
            dt
        );


        updateCutscene(
            dt
        );


        updateFragmentMinigame(
            dt
        );


        updateNotifications(
            dt
        );


        updateScreenEffects(
            dt
        );


        updateBloodMarks(
            dt
        );


        updateDashTrails(
            dt
        );


        updateCamera(
            dt
        );

    }


    /* ============================================================
       UPDATE GAMEPLAY SYSTEMS

       Função oficial chamada pela Parte 5.
       ============================================================ */

    function updateGameplaySystems(
        dt
    ) {

        const player =
            state.player;


        if (
            !player ||
            !state.world
        ) {
            return;
        }


        maintainDevInfiniteResources();


        updatePlayerCooldowns(
            dt
        );


        updatePotionBuffs(
            dt
        );


        updateClassBuffs(
            dt
        );


        updateResting(
            dt
        );


        /*
            Cutscene:
            não mover mundo normal.
        */
        if (
            !state.cutscene &&
            !state.fragmentMinigame
                ?.active &&
            !state.deathState
        ) {

            updatePlayerDash(
                dt
            );


            updatePlayerMovement(
                dt
            );


            updateSurvival(
                dt
            );


            updateEnemies(
                dt
            );


            updateBosses(
                dt
            );


            updateProjectiles(
                dt
            );


            updateSkyTrial(
                dt
            );


            updateWorldGeometry(
                dt
            );


            updateTreeRespawns(
                dt
            );


            updateInteractionTargets();


            updateVaelkorArenaTrigger();


            updateVoidDarknessBarrier();

        }


        /*
            Mesmo em cutscene,
            estes precisam existir.
        */
        if (
            state.cutscene
        ) {

            updateWorldGeometry(
                dt
            );

        }


        if (
            state.deathState
        ) {

            updateDeathState(
                dt
            );

        }


        /*
            SECONDARY EFFECTS:
            verifica projéteis que tocam player
            imediatamente antes da limpeza
            pelo sistema normal.

            Mantemos como camada adicional.
        */
        if (
            state.world
                ?.projectiles &&
            player &&
            !player.dead
        ) {

            for (
                const projectile of
                state.world
                    .projectiles
            ) {

                if (
                    projectile.owner !==
                        "enemy" ||
                    projectile.dead
                ) {
                    continue;
                }


                if (
                    (
                        projectile.type ===
                            "web" ||
                        projectile.type ===
                            "root"
                    ) &&
                    circleCircleCollision(
                        projectile.x,
                        projectile.y,
                        projectile.radius,
                        player.x,
                        player.y,
                        player.radius
                    )
                ) {

                    applyProjectileSecondaryEffect(
                        projectile
                    );

                }

            }

        }


        /*
            Permanência boss.
        */
        repairWorldBossBarriers();


        sanitizeVaelkorState();

    }


    /* ============================================================
       QUEST TRACKER
       ============================================================ */

    function getActiveQuestTracker() {

        const player =
            state.player;


        if (!player) {
            return null;
        }


        const miguel =
            player.miguelQuest;


        if (
            miguel
                ?.missionAccepted &&
            !miguel
                ?.completed &&
            miguel
                ?.trackerVisible
        ) {

            return {

                title:
                    "A PROVAÇÃO DO VAZIO",

                objective:
                    miguel.trackerObjective ||
                    getMiguelQuestObjective(
                        miguel
                    )

            };

        }


        if (
            player.quest
                .wood
                .state ===
                QUEST_STATE.ACTIVE
        ) {

            const progress =
                getQuestProgress(
                    "wood"
                );


            return {

                title:
                    QUEST_CONFIG
                        .wood
                        .title,

                objective:
                    `Colete madeira: ${progress.current}/${progress.required}`

            };

        }


        if (
            player.quest
                .coal
                .state ===
                QUEST_STATE.ACTIVE
        ) {

            const progress =
                getQuestProgress(
                    "coal"
                );


            return {

                title:
                    QUEST_CONFIG
                        .coal
                        .title,

                objective:
                    `Colete carvão: ${progress.current}/${progress.required}`

            };

        }


        return null;
    }


    /* ============================================================
       STATUS UI DATA

       LÓGICA:
       +3 POR LEVEL.
       ============================================================ */

    function getStatusUIData() {

        const player =
            state.player;


        if (!player) {
            return null;
        }


        return {

            points:
                player.statPoints,

            stats:
                Object.values(
                    STAT_CONFIG
                )
                    .map(
                        config => ({

                            id:
                                config.id,

                            icon:
                                config.icon,

                            label:
                                config.label,

                            value:
                                player.stats[
                                    config.id
                                ],

                            cap:
                                config.cap,

                            description:
                                config.description,

                            canIncrease:
                                player.statPoints >
                                    0 &&
                                player.stats[
                                    config.id
                                ] <
                                    config.cap

                        })
                    )

        };

    }


    function buildStatusHTML() {

        const data =
            getStatusUIData();


        if (!data) {
            return "";
        }


        const cards =
            data.stats.map(
                stat => {

                    const percentage =
                        (
                            stat.value /
                            stat.cap
                        ) *
                        100;


                    return `
                        <div
                            class="status-stat-card"
                            data-status-card="${stat.id}"
                        >

                            <div class="status-stat-header">

                                <div class="status-stat-title">

                                    <span class="status-stat-icon">
                                        ${stat.icon}
                                    </span>

                                    <div>
                                        <strong>
                                            ${stat.label}
                                        </strong>

                                        <small>
                                            ${stat.description}
                                        </small>
                                    </div>

                                </div>

                                <div class="status-stat-value">
                                    ${stat.value}
                                    <span>/ ${stat.cap}</span>
                                </div>

                            </div>

                            <div class="status-stat-progress">

                                <div
                                    class="status-stat-progress-fill"
                                    style="width:${percentage}%"
                                ></div>

                            </div>

                            <button
                                type="button"
                                data-status-add="${stat.id}"
                                ${stat.canIncrease ? "" : "disabled"}
                            >
                                + ADICIONAR PONTO
                            </button>

                        </div>
                    `;

                }
            )
            .join("");


        return `
            <div class="status-redesign">

                <div class="status-points-hero">

                    <span>
                        PONTOS DISPONÍVEIS
                    </span>

                    <strong>
                        ${data.points}
                    </strong>

                    <small>
                        Cada nível concede exatamente +3 pontos.
                    </small>

                </div>

                <div class="status-stat-grid">
                    ${cards}
                </div>

                <div class="status-rule-box">

                    <strong>
                        ATRIBUTOS MANUAIS
                    </strong>

                    <p>
                        Vida e Velocidade não recebem pontos.
                        Aumentar de nível sozinho não aumenta seus atributos.
                    </p>

                </div>

            </div>
        `;
    }


    /* ============================================================
       BOSS BOOK DATA

       Card maior e descrição somente derrotado.
       Parte 5/4 usa isso.
       ============================================================ */

    function getBossBookEntries() {

        const player =
            state.player;


        if (!player) {
            return [];
        }


        return Object.values(
            BOSS_REGISTRY
        )
            .map(
                boss => {

                    const discovered =
                        isBossDiscovered(
                            boss.id,
                            player
                        );


                    const defeated =
                        isBossDefeated(
                            boss.id,
                            player
                        );


                    return {

                        id:
                            boss.id,

                        name:
                            discovered
                                ? boss.name
                                : "DESCONHECIDO",

                        icon:
                            discovered
                                ? boss.icon
                                : "?",

                        discovered,

                        defeated,

                        subtitle:
                            discovered
                                ? boss.subtitle ||
                                    ""
                                : "",

                        description:
                            defeated
                                ? boss.description ||
                                    ""
                                : ""

                    };

                }
            );

    }


    /* ============================================================
       MAP DISCOVERY
       ============================================================ */

    function markMapLocationDiscovered(
        id
    ) {

        const player =
            state.player;


        if (!player) {
            return;
        }


        player.discoveredMapLocations =
            uniqueArray([
                ...player
                    .discoveredMapLocations,
                id
            ]);

    }


    /* ============================================================
       MIGUEL QUEST REPAIR
       ============================================================ */

    function repairMiguelQuestRuntime() {

        const player =
            state.player;


        if (!player) {
            return;
        }


        const quest =
            player.miguelQuest;


        if (
            player.abilities
                .dashV2
        ) {

            quest.completed =
                true;


            quest.stage =
                MIGUEL_QUEST_STAGE.COMPLETE;


            quest.trackerVisible =
                false;


            quest.fragmentDelivered =
                true;


            return;

        }


        if (
            player.abilities
                .dashV1 &&
            !quest.completed
        ) {

            quest.missionAvailable =
                true;

        }


        if (
            quest.fragmentCollected &&
            !quest.fragmentDelivered
        ) {

            quest.stage =
                MIGUEL_QUEST_STAGE
                    .RETURN_TO_MIGUEL;


            quest.trackerVisible =
                true;

        }


        if (
            quest.vaelkorDefeated &&
            !quest.fragmentCollected
        ) {

            quest.stage =
                MIGUEL_QUEST_STAGE
                    .COLLECT_FRAGMENT;


            quest.trackerVisible =
                true;

        }


        if (
            quest.secretDoorOpened &&
            !quest.vaelkorDefeated
        ) {

            quest.dungeonDiscovered =
                true;

        }

    }


    /* ============================================================
       ARMOR SAVE REPAIR
       ============================================================ */

    function enforceArmorProgressionIntegrity() {

        const player =
            state.player;


        if (!player) {
            return;
        }


        const highest =
            getHighestOwnedArmorTier(
                player
            );


        player.armorHighestTierEver =
            Math.max(
                player
                    .armorHighestTierEver,
                highest
            );


        /*
            Remove armaduras inferiores duplicadas
            se houver evolução superior.
        */
        if (
            highest >
            1
        ) {

            for (
                const armorId of
                ARMOR_PROGRESSION
            ) {

                const armor =
                    ARMOR_DATA[
                        armorId
                    ];


                if (
                    armor.tier <
                        highest &&
                    getRealItemCount(
                        armorId
                    ) >
                        0
                ) {

                    delete player.inventory[
                        armorId
                    ];

                }

            }

        }

    }


    /* ============================================================
       GAMEPLAY REPAIR TICK
       ============================================================ */

    function runGameplayIntegrityRepair() {

        repairMiguelQuestRuntime();


        enforceArmorProgressionIntegrity();


        repairWorldBossBarriers();


        sanitizeVaelkorState();


        /*
            Bosses derrotados jamais reaparecem
            no runtime atual.
        */
        if (
            state.world
                ?.bosses
        ) {

            state.world.bosses =
                state.world.bosses
                    .filter(
                        boss =>
                            !isBossDefeated(
                                boss.id
                            )
                    );

        }

    }


    /* ============================================================
       VALIDAÇÃO PARTE 3
       ============================================================ */

    function validatePart3Data() {

        const errors = [];


        if (
            typeof moveCircleWithCollision !==
                "function"
        ) {

            errors.push(
                "Movimento com colisão ausente."
            );

        }


        if (
            typeof handleGameplayAttackInput !==
                "function"
        ) {

            errors.push(
                "Ataque básico ausente."
            );

        }


        if (
            typeof handleGameplayDashInput !==
                "function"
        ) {

            errors.push(
                "Dash não implementado."
            );

        }


        if (
            DASH_CONFIG
                .v1
                .invulnerability !==
                0
        ) {

            errors.push(
                "Dash V1 não pode dar invulnerabilidade."
            );

        }


        if (
            DASH_CONFIG
                .v2
                .projectilePhaseWindow <=
                0
        ) {

            errors.push(
                "Dash V2 precisa da janela de passagem de projétil."
            );

        }


        if (
            typeof updateWolfCharge !==
                "function"
        ) {

            errors.push(
                "Charge do lobo ausente."
            );

        }


        if (
            ENEMY_SPECIES
                .wolf
                .abilityConfig
                .cooldown !==
                2
        ) {

            errors.push(
                "Cooldown do lobo precisa ser aproximadamente 2s."
            );

        }


        if (
            typeof interactWithExit !==
                "function"
        ) {

            errors.push(
                "Interação de saída ausente."
            );

        }


        if (
            typeof handleDoorInteraction !==
                "function"
        ) {

            errors.push(
                "Sistema Z para portas ausente."
            );

        }


        if (
            typeof updateHoldInteraction !==
                "function"
        ) {

            errors.push(
                "Coleta segurando E ausente."
            );

        }


        if (
            typeof beginVaelkorEntranceCutscene !==
                "function"
        ) {

            errors.push(
                "Cutscene inicial de Vaelkor ausente."
            );

        }


        if (
            typeof beginVaelkorDeathSequence !==
                "function"
        ) {

            errors.push(
                "Morte cinematográfica de Vaelkor ausente."
            );

        }


        if (
            VOID_MISSION_CONFIG
                .fragmentMinigameRounds
                .length !==
                3
        ) {

            errors.push(
                "Minigame do Fragmento deve ter 3 etapas."
            );

        }


        if (
            STATUS_POINTS_PER_LEVEL !==
                3
        ) {

            errors.push(
                "Status deve conceder exatamente +3 por nível."
            );

        }


        /*
            Guardião.
        */
        const fakeGuardian = {

            id:
                "road_guardian",

            state:
                BOSS_STATE.NEUTRAL,

            confirmed:
                false,

            dead:
                false

        };


        if (
            canBossBecomeAggressive(
                fakeGuardian
            )
        ) {

            errors.push(
                "Guardião ainda pode ficar agressivo antes do ACEITAR."
            );

        }


        if (
            canBossDamagePlayer(
                fakeGuardian
            )
        ) {

            errors.push(
                "Guardião ainda pode causar dano antes do ACEITAR."
            );

        }


        if (
            errors.length >
            0
        ) {

            console.error(
                "VEYRA V31 — ERROS NA PARTE 3:",
                errors
            );


            return {
                ok: false,
                errors
            };

        }


        console.log(
            "VEYRA V31 — Parte 3 validada."
        );


        return {
            ok: true,
            errors: []
        };

    }


    /* ============================================================
       FIM DA PARTE 3/5

       PARTE 4 VAI SER PRINCIPALMENTE VISUAL / RENDER:

       - PRESERVAR tela inicial
       - PRESERVAR tela de diálogo
       - PRESERVAR confirmação do Guardião
       - PRESERVAR design da mochila
       - PRESERVAR design geral do Livro

       E CORRIGIR:

       - Kaelion com corpo próprio
       - Theron com corpo próprio
       - Grumgar com corpo próprio
       - Lirael com corpo próprio
       - Zephyr com corpo próprio

       - não desenhar todos como mago
       - animações diferentes

       - personagem com detalhes
       - inimigos mais bonitos
       - bosses mais modelados

       - árvores bem mais bonitas
       - copa detalhada
       - tronco detalhado
       - sombra
       - grama
       - estrada
       - terreno
       - pedras

       SEM MUDAR O MAPA BASE.

       - porta com dobradiça visual real
       - openAmount -> rotação
       - sem "[ ] -> []"

       - prompt de próxima região
       - prompt Z
       - prompt E

       - lantern darkness OFFSCREEN
       - paredes bloqueando luz
       - dungeon escura
       - arena clara

       - Vaelkor inteiro
       - rajadas
       - laser
       - portais
       - fase 2
       - explosões
       - fragmentação

       - minigame visual do fragmento

       - Dash V1 branco
       - Dash V2 preto/roxo

       - Livro com cards maiores
       - descrição liberada após derrota

       - tela de STATUS redesenhada
       - tela de MORTE redesenhada

       A PARTE 4 AINDA NÃO FECHA O IIFE.

       NÃO COLOQUE })(); AQUI.
       ============================================================ */
