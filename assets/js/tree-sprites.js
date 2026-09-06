(() => {
    "use strict";

    const BASE =
        "./assets/sprites/environment/trees";

    const FILES = Object.freeze({
        1: "tree_01.png",
        2: "tree_02.png",
        3: "tree_03.png",
        4: "tree_04.png"
    });

    const cache =
        new Map();


    function number(
        value,
        fallback = 0
    ) {
        const n =
            Number(value);

        return Number.isFinite(n)
            ? n
            : fallback;
    }


    function sheetIdOf(
        tree
    ) {
        return Math.max(
            1,
            Math.min(
                4,
                Math.trunc(
                    number(
                        tree?.spriteSheetId,
                        1
                    )
                )
            )
        );
    }


    /*
        Detecta automaticamente
        cada árvore existente dentro
        da imagem PNG.

        Ou seja:

        tree_01.png pode possuir
        várias árvores e o jogo
        consegue selecionar uma delas.
    */
    function detectRegions(
        image
    ) {
        const sourceW =
            Math.max(
                1,
                image.naturalWidth ||
                image.width ||
                1
            );

        const sourceH =
            Math.max(
                1,
                image.naturalHeight ||
                image.height ||
                1
            );


        /*
            Fazemos a análise em uma
            versão menor da imagem.

            Isso evita travar o jogo.
        */
        const scale =
            Math.min(
                1,
                420 /
                sourceW
            );

        const w =
            Math.max(
                1,
                Math.round(
                    sourceW *
                    scale
                )
            );

        const h =
            Math.max(
                1,
                Math.round(
                    sourceH *
                    scale
                )
            );


        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width =
            w;

        canvas.height =
            h;


        const ctx =
            canvas.getContext(
                "2d",
                {
                    willReadFrequently:
                        true
                }
            );


        if (
            !ctx
        ) {
            return [];
        }


        ctx.clearRect(
            0,
            0,
            w,
            h
        );

        ctx.drawImage(
            image,
            0,
            0,
            w,
            h
        );


        let pixels;

        try {

            pixels =
                ctx.getImageData(
                    0,
                    0,
                    w,
                    h
                ).data;

        } catch (
            error
        ) {

            console.warn(
                "VEYRA — falha ao analisar spritesheet de árvores:",
                error
            );

            return [];

        }


        const visited =
            new Uint8Array(
                w *
                h
            );

        const queue =
            new Int32Array(
                w *
                h
            );

        const regions =
            [];


        const alphaLimit =
            18;

        const minArea =
            Math.max(
                18,
                Math.floor(
                    w *
                    h *
                    0.00012
                )
            );


        /*
            Connected Components.

            Cada bloco de pixels
            conectado vira uma árvore.
        */
        for (
            let y = 0;
            y < h;
            y += 1
        ) {

            for (
                let x = 0;
                x < w;
                x += 1
            ) {

                const start =
                    y *
                    w +
                    x;


                if (
                    visited[
                        start
                    ]
                ) {
                    continue;
                }


                visited[
                    start
                ] =
                    1;


                if (
                    pixels[
                        start *
                        4 +
                        3
                    ] <=
                    alphaLimit
                ) {
                    continue;
                }


                let head =
                    0;

                let tail =
                    0;

                let area =
                    0;


                let minX =
                    x;

                let maxX =
                    x;

                let minY =
                    y;

                let maxY =
                    y;


                queue[
                    tail++
                ] =
                    start;


                while (
                    head <
                    tail
                ) {

                    const index =
                        queue[
                            head++
                        ];


                    const cx =
                        index %
                        w;

                    const cy =
                        Math.floor(
                            index /
                            w
                        );


                    area +=
                        1;


                    minX =
                        Math.min(
                            minX,
                            cx
                        );

                    maxX =
                        Math.max(
                            maxX,
                            cx
                        );

                    minY =
                        Math.min(
                            minY,
                            cy
                        );

                    maxY =
                        Math.max(
                            maxY,
                            cy
                        );


                    /*
                        8 vizinhos.

                        Isso mantém galhos
                        diagonais unidos.
                    */
                    for (
                        let oy = -1;
                        oy <= 1;
                        oy += 1
                    ) {

                        for (
                            let ox = -1;
                            ox <= 1;
                            ox += 1
                        ) {

                            if (
                                ox === 0 &&
                                oy === 0
                            ) {
                                continue;
                            }


                            const nx =
                                cx +
                                ox;

                            const ny =
                                cy +
                                oy;


                            if (
                                nx <
                                    0 ||
                                ny <
                                    0 ||
                                nx >=
                                    w ||
                                ny >=
                                    h
                            ) {
                                continue;
                            }


                            const next =
                                ny *
                                w +
                                nx;


                            if (
                                visited[
                                    next
                                ]
                            ) {
                                continue;
                            }


                            visited[
                                next
                            ] =
                                1;


                            if (
                                pixels[
                                    next *
                                    4 +
                                    3
                                ] <=
                                alphaLimit
                            ) {
                                continue;
                            }


                            queue[
                                tail++
                            ] =
                                next;

                        }

                    }

                }


                /*
                    Ignora pixel perdido,
                    ruído ou partícula.
                */
                if (
                    area <
                    minArea
                ) {
                    continue;
                }


                const inv =
                    1 /
                    scale;

                const pad =
                    3;


                const sx =
                    Math.max(
                        0,
                        Math.floor(
                            minX *
                            inv
                        ) -
                        pad
                    );

                const sy =
                    Math.max(
                        0,
                        Math.floor(
                            minY *
                            inv
                        ) -
                        pad
                    );


                const right =
                    Math.min(
                        sourceW,
                        Math.ceil(
                            (
                                maxX +
                                1
                            ) *
                            inv
                        ) +
                        pad
                    );

                const bottom =
                    Math.min(
                        sourceH,
                        Math.ceil(
                            (
                                maxY +
                                1
                            ) *
                            inv
                        ) +
                        pad
                    );


                const sw =
                    right -
                    sx;

                const sh =
                    bottom -
                    sy;


                if (
                    sw <
                        24 ||
                    sh <
                        24
                ) {
                    continue;
                }


                regions.push({
                    x:
                        sx,

                    y:
                        sy,

                    w:
                        sw,

                    h:
                        sh
                });

            }

        }


        /*
            Mantém uma ordem previsível.
        */
        regions.sort(
            (
                a,
                b
            ) => {

                const sameRow =
                    Math.abs(
                        a.y -
                        b.y
                    ) <
                    sourceH *
                    0.09;


                return sameRow
                    ? a.x -
                        b.x
                    : a.y -
                        b.y;

            }
        );


        return regions;
    }


    function getEntry(
        sheetId
    ) {

        const id =
            Math.max(
                1,
                Math.min(
                    4,
                    Math.trunc(
                        number(
                            sheetId,
                            1
                        )
                    )
                )
            );


        if (
            cache.has(
                id
            )
        ) {
            return cache.get(
                id
            );
        }


        const image =
            new Image();


        const entry = {
            id,
            image,

            loaded:
                false,

            failed:
                false,

            regions:
                []
        };


        cache.set(
            id,
            entry
        );


        image.onload =
            () => {

                entry.loaded =
                    true;

                entry.failed =
                    false;


                entry.regions =
                    detectRegions(
                        image
                    );


                /*
                    Fallback de segurança.
                */
                if (
                    !entry.regions.length
                ) {

                    entry.regions = [
                        {
                            x:
                                0,

                            y:
                                0,

                            w:
                                image.naturalWidth ||
                                image.width,

                            h:
                                image.naturalHeight ||
                                image.height
                        }
                    ];

                }

            };


        image.onerror =
            () => {

                entry.failed =
                    true;

                entry.loaded =
                    false;


                console.warn(
                    `VEYRA — não carregou ${FILES[id]}`
                );

            };


        image.src =
            `${BASE}/${FILES[id]}`;


        return entry;
    }


    function getRegion(
        tree
    ) {

        const entry =
            getEntry(
                sheetIdOf(
                    tree
                )
            );


        if (
            !entry.loaded ||
            !entry.regions.length
        ) {
            return null;
        }


        const seed =
            Math.abs(
                number(
                    tree?.spritePick,
                    number(
                        tree?.canopySeed,
                        0
                    ) *
                    0.0001
                )
            );


        const pick =
            seed %
            1;


        const index =
            Math.min(
                entry.regions.length -
                    1,

                Math.floor(
                    pick *
                    entry.regions.length
                )
            );


        return {
            entry,
            region:
                entry.regions[
                    index
                ]
        };
    }


    function classify(
        tree,
        region
    ) {

        const aspect =
            region.w /
            Math.max(
                1,
                region.h
            );


        /*
            Larga e baixa =
            árvore caída.
        */
        if (
            aspect >=
            1.48
        ) {
            return "fallen";
        }


        if (
            sheetIdOf(
                tree
            ) ===
            4
        ) {
            return "small";
        }


        return "upright";
    }


    function applyCollision(
        tree,
        kind
    ) {

        const before =
            `${tree.spriteKind}|${tree.trunkWidth}|${tree.trunkHeight}|${tree.depthY}`;


        const scale =
            Math.max(
                0.5,
                number(
                    tree.scale,
                    1
                )
            );


        const sheetId =
            sheetIdOf(
                tree
            );


        tree.spriteKind =
            kind;


        /*
            Árvore caída:
            hitbox horizontal
            somente no tronco.
        */
        if (
            kind ===
            "fallen"
        ) {

            tree.trunkWidth =
                (
                    sheetId ===
                        4
                        ? 96
                        : 150
                ) *
                scale;


            tree.trunkHeight =
                (
                    sheetId ===
                        4
                        ? 18
                        : 24
                ) *
                scale;

        }


        /*
            Árvores pequenas.
        */
        else if (
            sheetId ===
            4
        ) {

            tree.trunkWidth =
                18 *
                scale;

            tree.trunkHeight =
                18 *
                scale;

        }


        /*
            Árvore normal.
        */
        else {

            tree.trunkWidth =
                30 *
                scale;

            tree.trunkHeight =
                27 *
                scale;

        }


        tree.depthY =
            tree.y +
            tree.trunkHeight *
            0.45;


        const after =
            `${tree.spriteKind}|${tree.trunkWidth}|${tree.trunkHeight}|${tree.depthY}`;


        return (
            before !==
            after
        );
    }


    function getDrawSize(
        tree,
        region,
        kind
    ) {

        const scale =
            Math.max(
                0.5,
                number(
                    tree.scale,
                    1
                )
            );


        const aspect =
            region.w /
            Math.max(
                1,
                region.h
            );


        const sheetId =
            sheetIdOf(
                tree
            );


        /*
            Caídas ficam mais largas.
        */
        if (
            kind ===
            "fallen"
        ) {

            const width =
                (
                    sheetId ===
                        4
                        ? 130
                        : 225
                ) *
                scale;


            return {
                width,

                height:
                    width /
                    Math.max(
                        0.4,
                        aspect
                    )
            };

        }


        /*
            1–3 = grandes.
            4 = pequenas.
        */
        const height =
            (
                sheetId ===
                    4
                    ? 112
                    : 215
            ) *
            scale;


        return {
            width:
                height *
                aspect,

            height
        };
    }


    function draw(
        ctx,
        tree,
        screen,
        ambientTime = 0
    ) {

        const selected =
            getRegion(
                tree
            );


        if (
            !selected ||
            selected.entry.failed
        ) {

            return {
                drawn:
                    false,

                collisionChanged:
                    false
            };

        }


        const {
            entry,
            region
        } =
            selected;


        const kind =
            classify(
                tree,
                region
            );


        const collisionChanged =
            applyCollision(
                tree,
                kind
            );


        const size =
            getDrawSize(
                tree,
                region,
                kind
            );


        /*
            Movimento MUITO pequeno.

            Não rotacionamos o PNG,
            porque isso borraria pixel art.
        */
        const sway =
            kind ===
                "fallen"

                ? 0

                : Math.sin(
                    number(
                        ambientTime,
                        0
                    ) *
                    1.05 +
                    number(
                        tree.swayOffset,
                        0
                    )
                ) *
                (
                    sheetIdOf(
                        tree
                    ) ===
                        4
                        ? 0.8
                        : 1.6
                );


        ctx.save();


        /*
            Pixel art preservado.
        */
        ctx.imageSmoothingEnabled =
            false;


        ctx.drawImage(
            entry.image,

            region.x,
            region.y,
            region.w,
            region.h,

            screen.x -
                size.width /
                2 +
                sway,

            screen.y -
                size.height,

            size.width,
            size.height
        );


        ctx.restore();


        return {
            drawn:
                true,

            collisionChanged,

            kind,

            region
        };
    }


    function preload() {

        [
            1,
            2,
            3,
            4
        ].forEach(
            getEntry
        );

    }


    window.VEYRA_TREE_SPRITES =
        Object.freeze({
            draw,
            preload
        });


    preload();

})();
