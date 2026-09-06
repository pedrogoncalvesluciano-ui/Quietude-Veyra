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

    const cache = new Map();

    function number(value, fallback = 0) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function sheetIdOf(tree) {
        return Math.max(
            1,
            Math.min(
                4,
                Math.trunc(number(tree?.spriteSheetId, 1))
            )
        );
    }

    function regionLooksUsable(region, sourceW, sourceH, sheetId) {
        const rw = region.w / Math.max(1, sourceW);
        const rh = region.h / Math.max(1, sourceH);
        const aspect = region.w / Math.max(1, region.h);

        if (sheetId === 4) {
            return (
                region.w >= 18 &&
                region.h >= 24 &&
                rw <= 0.55 &&
                rh <= 0.72
            );
        }

        /*
            Sheets 1/2/3:
            - aceita árvores grandes em pé;
            - aceita árvore caída larga;
            - rejeita tocos/fragmentos pequenos.
        */
        const upright =
            rh >= 0.20 &&
            rw >= 0.055 &&
            aspect < 1.70;

        const fallen =
            rw >= 0.16 &&
            rh >= 0.07 &&
            aspect >= 1.45;

        return upright || fallen;
    }

    function detectRegions(image, sheetId) {
        const sourceW = Math.max(
            1,
            image.naturalWidth || image.width || 1
        );

        const sourceH = Math.max(
            1,
            image.naturalHeight || image.height || 1
        );

                /*
            TREE_01 — RECORTE MANUAL.

            Remove:
            - toco gigante;
            - pedaços da árvore vizinha;
            - fragmentos flutuando.
        */
        if (
            sheetId === 1 &&
            Math.abs(
                sourceW / sourceH -
                1448 / 1086
            ) < 0.03
        ) {

            const sx =
                sourceW /
                1448;

            const sy =
                sourceH /
                1086;


            const region =
                (
                    x,
                    y,
                    w,
                    h
                ) => ({

                    x:
                        Math.round(
                            x * sx
                        ),

                    y:
                        Math.round(
                            y * sy
                        ),

                    w:
                        Math.round(
                            w * sx
                        ),

                    h:
                        Math.round(
                            h * sy
                        )

                });


            return [

                /*
                    3 árvores verdes.
                */
                region(
                    116,
                    188,
                    321,
                    346
                ),

                region(
                    493,
                    161,
                    430,
                    373
                ),

                region(
                    996,
                    207,
                    338,
                    327
                ),


                /*
                    2 árvores tipo salgueiro.
                */
                region(
                    35,
                    598,
                    294,
                    345
                ),

                region(
                    346,
                    581,
                    312,
                    360
                ),


                /*
                    Árvore seca.

                    A direita foi cortada
                    propositalmente antes
                    do toco vizinho.
                */
                region(
                    681,
                    621,
                    214,
                    323
                ),


                /*
                    Árvore caída.
                */
                region(
                    1124,
                    762,
                    307,
                    190
                )

            ];

        }

        const scale = Math.min(1, 520 / sourceW);
        const w = Math.max(1, Math.round(sourceW * scale));
        const h = Math.max(1, Math.round(sourceH * scale));

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d", {
            willReadFrequently: true
        });

        if (!ctx) {
            return [];
        }

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(image, 0, 0, w, h);

        let pixels;

        try {
            pixels = ctx.getImageData(0, 0, w, h).data;
        } catch (error) {
            console.warn(
                "VEYRA — falha ao analisar spritesheet de árvores:",
                error
            );
            return [];
        }

        const visited = new Uint8Array(w * h);
        const queue = new Int32Array(w * h);
        const regions = [];

        const alphaLimit = 18;
        const minArea = Math.max(
            24,
            Math.floor(w * h * 0.00016)
        );

        for (let y = 0; y < h; y += 1) {
            for (let x = 0; x < w; x += 1) {
                const start = y * w + x;

                if (visited[start]) {
                    continue;
                }

                visited[start] = 1;

                if (pixels[start * 4 + 3] <= alphaLimit) {
                    continue;
                }

                let head = 0;
                let tail = 0;
                let area = 0;

                let minX = x;
                let maxX = x;
                let minY = y;
                let maxY = y;

                queue[tail++] = start;

                while (head < tail) {
                    const index = queue[head++];
                    const cx = index % w;
                    const cy = Math.floor(index / w);

                    area += 1;
                    minX = Math.min(minX, cx);
                    maxX = Math.max(maxX, cx);
                    minY = Math.min(minY, cy);
                    maxY = Math.max(maxY, cy);

                    for (let oy = -1; oy <= 1; oy += 1) {
                        for (let ox = -1; ox <= 1; ox += 1) {
                            if (ox === 0 && oy === 0) {
                                continue;
                            }

                            const nx = cx + ox;
                            const ny = cy + oy;

                            if (
                                nx < 0 ||
                                ny < 0 ||
                                nx >= w ||
                                ny >= h
                            ) {
                                continue;
                            }

                            const next = ny * w + nx;

                            if (visited[next]) {
                                continue;
                            }

                            visited[next] = 1;

                            if (pixels[next * 4 + 3] <= alphaLimit) {
                                continue;
                            }

                            queue[tail++] = next;
                        }
                    }
                }

                if (area < minArea) {
                    continue;
                }

                const inv = 1 / scale;

                /*
                    Sem margem extra.
                    Isso evita puxar pedaço da árvore vizinha.
                */
                const sx = Math.max(0, Math.floor(minX * inv));
                const sy = Math.max(0, Math.floor(minY * inv));
                const right = Math.min(
                    sourceW,
                    Math.ceil((maxX + 1) * inv)
                );
                const bottom = Math.min(
                    sourceH,
                    Math.ceil((maxY + 1) * inv)
                );

                const region = {
                    x: sx,
                    y: sy,
                    w: right - sx,
                    h: bottom - sy
                };

                if (
                    region.w < 18 ||
                    region.h < 18 ||
                    !regionLooksUsable(
                        region,
                        sourceW,
                        sourceH,
                        sheetId
                    )
                ) {
                    continue;
                }

                regions.push(region);
            }
        }

        regions.sort((a, b) => {
            const sameRow =
                Math.abs(a.y - b.y) < sourceH * 0.09;

            return sameRow
                ? a.x - b.x
                : a.y - b.y;
        });

        return regions;
    }

    function getEntry(sheetId) {
        const id = Math.max(
            1,
            Math.min(4, Math.trunc(number(sheetId, 1)))
        );

        if (cache.has(id)) {
            return cache.get(id);
        }

        const image = new Image();
        const entry = {
            id,
            image,
            loaded: false,
            failed: false,
            regions: []
        };

        cache.set(id, entry);

        image.onload = () => {
            entry.loaded = true;
            entry.failed = false;
            entry.regions = detectRegions(image, id);

            if (!entry.regions.length) {
                console.warn(
                    `VEYRA — nenhuma árvore válida detectada em ${FILES[id]}`
                );
            }
        };

        image.onerror = () => {
            entry.failed = true;
            entry.loaded = false;

            console.warn(
                `VEYRA — não carregou ${FILES[id]}`
            );
        };

        image.src = `${BASE}/${FILES[id]}`;
        return entry;
    }

    function getRegion(tree) {
        const entry = getEntry(sheetIdOf(tree));

        if (
            !entry.loaded ||
            entry.failed ||
            !entry.regions.length
        ) {
            return null;
        }

        const seed = Math.abs(
            number(
                tree?.spritePick,
                number(tree?.canopySeed, 0) * 0.0001
            )
        );

        const pick = seed % 1;
        const index = Math.min(
            entry.regions.length - 1,
            Math.floor(pick * entry.regions.length)
        );

        return {
            entry,
            region: entry.regions[index]
        };
    }

    function classify(tree, region) {
        const aspect =
            region.w /
            Math.max(1, region.h);

        if (aspect >= 1.48) {
            return "fallen";
        }

        if (sheetIdOf(tree) === 4) {
            return "small";
        }

        return "upright";
    }

    function applyCollision(tree, kind) {
        const before =
            `${tree.spriteKind}|${tree.trunkWidth}|${tree.trunkHeight}|${tree.depthY}`;

        const scale = Math.max(
            0.5,
            number(tree.scale, 1)
        );

        const sheetId = sheetIdOf(tree);
        tree.spriteKind = kind;

        if (kind === "fallen") {
            tree.trunkWidth =
                (sheetId === 4 ? 82 : 142) * scale;

            tree.trunkHeight =
                (sheetId === 4 ? 16 : 22) * scale;
        } else if (sheetId === 4) {
            tree.trunkWidth = 18 * scale;
            tree.trunkHeight = 18 * scale;
        } else {
            tree.trunkWidth = 30 * scale;
            tree.trunkHeight = 27 * scale;
        }

        tree.depthY =
            tree.y +
            tree.trunkHeight * 0.45;

        const after =
            `${tree.spriteKind}|${tree.trunkWidth}|${tree.trunkHeight}|${tree.depthY}`;

        return before !== after;
    }

    function getDrawSize(tree, region, kind) {
        const scale = Math.max(
            0.5,
            number(tree.scale, 1)
        );

        const aspect =
            region.w /
            Math.max(1, region.h);

        const sheetId = sheetIdOf(tree);

        if (kind === "fallen") {
            const width =
                (sheetId === 4 ? 118 : 205) * scale;

            return {
                width,
                height:
                    width /
                    Math.max(0.4, aspect)
            };
        }

        const height =
            (sheetId === 4 ? 104 : 190) * scale;

        return {
            width: height * aspect,
            height
        };
    }

    function draw(ctx, tree, screen, ambientTime = 0) {
        const selected = getRegion(tree);

        if (!selected || selected.entry.failed) {
            return {
                drawn: false,
                collisionChanged: false
            };
        }

        const { entry, region } = selected;
        const kind = classify(tree, region);
        const collisionChanged = applyCollision(tree, kind);
        const size = getDrawSize(tree, region, kind);

        const sway =
            kind === "fallen"
                ? 0
                : Math.sin(
                    number(ambientTime, 0) * 1.05 +
                    number(tree.swayOffset, 0)
                ) *
                (sheetIdOf(tree) === 4 ? 0.8 : 1.4);

        ctx.save();
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
            entry.image,
            region.x,
            region.y,
            region.w,
            region.h,
            screen.x - size.width / 2 + sway,
            screen.y - size.height,
            size.width,
            size.height
        );

        ctx.restore();

        return {
            drawn: true,
            collisionChanged,
            kind,
            region
        };
    }

    function preload() {
        [1, 2, 3, 4].forEach(getEntry);
    }

    window.VEYRA_TREE_SPRITES = Object.freeze({
        draw,
        preload
    });

    preload();
})();
