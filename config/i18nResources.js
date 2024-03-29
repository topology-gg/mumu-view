const resources = {
    en: {
        translation: {
            setting: "Setting",
            MuMu: "MuMu: Season 2",
            Subtitle: "An experiment by Topology",
            Connect: "Connect ",
            Connected: "You are: ",
            frame: "Frame",
            mech: "spirit",
            newMech: "new spirit",
            removeMech: "remove spirit",
            removeMechConfirm: "Are you sure you want to delete {{mech}}?",
            no: "No",
            newOperation: "new {{operation}}",
            removeOp: "remove op",
            confirmFormula: "Confirm Formula",
            placeFormula: "Click on a valid grid to place",
            run: "Run",
            pause: "Pause",
            stop: "Stop",
            incrementFrame: "+1 frame",
            decrementFrame: "-1 frame",
            "Mech programming": "Spirit programs",
            "Formula placement": "Formula placements",
            "Stir ": "Stir ",
            Shake: "Shake",
            Steam: "Steam",
            Smash: "Smash",
            "Submit to": "Submit to",
            submission: "Submit to StarkNet",
            load_save: "Load / Save",
            "demo-blank": "arena.Blank",
            demo: "arena.Demo",
            Save: "Save",
            Clear: "Clear all",
            "save to name": "save to name",
            Export: "Export as JSON",
            tutorial: {
                title: "How to play",
                thesisTheme: "Thesis & Theme",
                thesisLine1:
                    "Layer 1 blockchains assert identity by capital contribution - pay to mint. Layer 2 blockchains, with new affordance in compute capacity, would assert identity by skill verification - solve to mint.",
                thesisLine2:
                    "MuMu is a puzzle about visual & parallel assembly programming. Place & program Spirits on the canvas, and place the formulas, to transport & transmute substances from Faucet to Sink. Solutions are ranked by throughput and cost.",
                Overview: "Overview",
                overviewLine1:
                    "In the world of alchemy, substances can be transformed into one another via alchemic diagrams. Build diagrams by placing formulas and spirits, and orchestrating the spirits creatively.",
                instructions: "Laws of the Alchemic Diagram",

                explain_program: "A program is a sequence of instructions.",
                explain_mech: "Each Spirit has its own program.",
                explain_simulation: "During simulation, each Spirit runs its own program on repeat.",
                available_instructions: "Available instructions:",
                instruction_wasd: ": move up/left/down/right by one grid on the canvas.",
                instruction_z: ": pick up an object, if available.",
                instruction_x: ": drop the object in possession, if available.",
                instruction_g:
                    ": block program until pick up an object. This instruction becomes no-op if the spirit already possesses an object.",
                instruction_h:
                    ": block program until drop the object in possession.  This instruction becomes no-op if the mech is not possessing an object.",
                instruction_c:
                    ": carelessly drop the object in possession; if the underlying grid is already occupied, the object vanishes!",
                instruction_noop: ": no-op (no operation).",
                program_limit: "Program size shall not exceed 40 instructions.",
                formula_placement:
                    "On formula placement: operands and product must be contiguous grids i.e. for &(a,b)=c, a-b and b-c must both be neighbors. When the contiguity rule is violated, formula symbols are not rendered.",
                faucet_sink: 'Faucet is marked as "F" on the board, while Sink is marked as "S" on the board.',

                formulaList: "Formula List",
                goal: "Goal",
                goalAffordance: "With Faucet replenishing <1 /> at one unit per frame,",
                goalDeliver: "Build diagrams that produce & deliver <1 /> to Sink.",
                goalLine2: "Minimize the latency and cost of your solution.",
                goalLine3_1: "Register at ",
                goalLine3_2: " to show who you are on the leaderboard.",
                costTitle: "Cost",
                staticCostTitle: "Static Cost",
                staticCostLine1: "Spirit: 150 / entity",
                staticCostLine2: "Stir: 250 / formula",
                staticCostLine3: "Shake: 500 / formula",
                staticCostLine4: "Steam: 750 / formula",
                staticCostLine5: "Smash: 1000 / formula",
                staticCostLineRefactored: "<1 />: <2 /> / formula",
                dynamicCostTitle: "Dynamic Cost",
                dynamicCostLine1: " moving when carrying object: 10 / frame",
                dynamicCostLine2: " moving when not carrying object: 20 / frame",
                dynamicCostLine3: " pickup object: 25 / frame",
                dynamicCostLine4: " drop object: 25 / frame",
                dynamicCostLine5: " carelessly drop object: 10 / frame",
                dynamicCostLine6: " blocked: 3 / frame",
            },
            delivery: {
                accumulatedCost: "Accumulated cost",
                delivered: "Delivered",
            },
            summary: {
                title: "Summary of last run",
                totalPre: "Total deliveries of",
                totalPost: " unit(s)",
                inFrames: "in {{frames}} frames",
                averageLatencyPre: "Average latency per",
                averageLatencyPost: "unit delivery",
                averageDynamicCostPre: "Average dynamic cost per",
                averageDynamicCostPost: "unit delivery",
                delivery: "delivery",
                staticCost: "Static cost",
            },
            leaderboard: {
                title: "Top 20 Diagrams",
                rank: "Rank",
                account: "Who",
                delivered: `Delivered amount`,
                static_cost: "Static cost",
                latency: "Average latency per delivery",
                dynamic_cost: "Average dynamic cost per delivery",
                block_number: "Block number",
            },
        },
    },
    scn: {
        translation: {
            setting: "设定",
            MuMu: "挪挪: 第2季",
            Subtitle: "Topology 的一项实验",
            Connect: "连接 ",
            Connected: "你是: ",
            frame: "帧",
            mech: "布灵",
            newMech: "添加布灵",
            removeMech: "移除布灵",
            removeMechConfirm: "你确定你要删除 {{mech}}?",
            no: "不",
            newOperation: "添加配方 {{operation}}",
            removeOp: "移除配方",
            confirmFormula: "确认公式",
            placeFormula: "单击有效的网格以放置",
            formula: "配方",
            run: "启动",
            pause: "暂停",
            stop: "停止",
            incrementFrame: "+1帧",
            decrementFrame: "-1帧",
            "Mech programming": "指揮布灵",
            "Formula placement": "摆放配方",
            "Stir ": "搅搅",
            Shake: "摇摇",
            Steam: "蒸蒸",
            Smash: "砸砸",
            Evolve: "生生",
            Slow: "慢慢",
            Wilt: "枯枯",
            Bake: "烤烤",
            "Submit to": "提交至",
            submission: "提交至 StarkNet",
            "demo-blank": "空白",
            demo: "范例",
            Save: "暂存",
            Clear: "清除所有暂存",
            "save to name": "暂存名",
            tutorial: {
                title: "玩法",
                thesisTheme: "主题",
                thesisLine1:
                    "在一层网络链上，人们通过付费交易来获取身份。而二层网络链具备扩容的运算容量，人们可以通过验证技能来获取身份。",
                thesisLine2:
                    "「挪挪」是一款结合了组合型语言和并行处理的多维度优化谜题。在图纸上摆放布灵，通过编程预设布灵的行为，然后摆放配方，将水龙头 (Faucet) 产出的原料合成目标产品，最后运送至水槽 (Sink)。玩家提交的解决方案将以吞吐量和成本进行排名。",
                Overview: "简介",
                overviewLine1:
                    "在炼金术的世界，物质透过炼成阵可转换成其他物质。建造炼成阵吧：摆放配方与布灵，并巧妙安排布灵指令。",
                instructions: "炼成阵法则",

                explain_program: "程序是一段指令序列。",
                explain_mech: "每个布灵皆有其程序。",
                explain_simulation: "模拟时，每个布灵循环执行自己的程序。",
                available_instructions: "可用的指令：",
                instruction_wasd: ": 在图纸上往上/下/左/右移动一格。",
                instruction_z: ": 将物质捡起。",
                instruction_x: ": 将物质放下。",
                instruction_g: ": 阻塞程序直到能够捡起物质，并捡起物质。若布灵已携带物质，则此指令形同无操作。",
                instruction_h: ": 阻塞程序直到能够放下物质，并放下物质。若布灵未携带物质，则此指令形同无操作。",
                instruction_c: ": 将物质丢下；如果该位置已被物质占据，丢下的物质将直接消失！",
                instruction_noop: ": 无操作。",
                program_limit: "任意布灵的程序长度上限为 40 个指令。",
                formula_placement:
                    "配方摆法的连续性规则：输入和输出必须位于连续的网格。以 &(A, B) = C 为例，A 和 B 以及 B 和 C 都必须是邻居关系。违反连续性规则时，版面上不会渲染配方符号。",
                faucet_sink: '水龙头在图纸上以 "F" 标示；水槽则以 "S" 标示。',

                formulaList: "配方列表",
                goal: "目標",
                goalAffordance: "利用水龙头以每帧添加一单位 <1 /> 的特性，",
                goalDeliver: "设计炼成阵以制造 <1 /> 并运送到任意水槽。",
                goalLine2: "优化炼成阵的延迟和成本。",
                goalLine3_1: "在 ",
                goalLine3_2: "上绑定 Discord 保存记录获取排名。",
                costTitle: "成本",
                staticCostTitle: "静态成本",
                staticCostLine1: "布灵：150 / 只",
                staticCostLine2: "搅搅：250 / 配方",
                staticCostLine3: "摇摇：500 / 配方",
                staticCostLine4: "蒸蒸：750 / 配方",
                staticCostLine5: "砸砸：1000 / 配方",
                dynamicCostTitle: "动态成本",
                dynamicCostLine1: " 未携带物质时移动：10 / 帧 ",
                dynamicCostLine2: " 携带物质时移动：20 / 帧 ",
                dynamicCostLine3: " 捡起物质：25 / 帧 ",
                dynamicCostLine4: " 放下物质：25 / 帧 ",
                dynamicCostLine5: " 丟下物质: 10 / 帧 ",
                dynamicCostLine6: " 程序阻挡：3 / 帧 ",
            },
            delivery: {
                accumulatedCost: "累计成本",
                delivered: "运送",
            },
            summary: {
                title: "效能摘要",
                totalPre: "{{frames}} 帧内总运送",
                totalPost: "单位",
                inFrames: "",
                averageLatencyPre: "每单位",
                averageLatencyPost: "运送平均延迟",
                averageDynamicCostPre: "每单位",
                averageDynamicCostPost: "运送平均动态成本",
                delivery: "运送",
                staticCost: "静态成本",
            },
            leaderboard: {
                title: "天下前 20 炼成阵",
                rank: "排名",
                account: "谁",
                delivered: `总运送`,
                static_cost: "静态成本",
                latency: "运送平均延迟",
                dynamic_cost: "运送平均动态成本",
                block_number: "区块高度",
            },
        },
    },
    tcn: {
        translation: {
            setting: "設定",
            MuMu: "挪挪: 第2季",
            Subtitle: "Topology 的一項實驗",
            Connect: "連接 ",
            Connected: "你是: ",
            frame: "幀",
            mech: "布靈",
            newMech: "添加布靈",
            removeMech: "移除布靈",
            removeMechConfirm: "你確定你要刪除 {{mech}}?",
            no: "不",
            newOperation: "添加配方 {{operation}}",
            removeOp: "移除配方",
            confirmFormula: "確認公式",
            placeFormula: "單擊有效的網格以放置",
            formula: "配方",
            run: "啟動",
            pause: "暫停",
            stop: "停止",
            incrementFrame: "+1幀",
            decrementFrame: "-1幀",
            "Mech programming": "布靈編程",
            "Formula placement": "擺放配方",
            "Stir ": "攪攪",
            Shake: "搖搖",
            Steam: "蒸蒸",
            Smash: "砸砸",
            Evolve: "生生",
            Slow: "慢慢",
            Wilt: "枯枯",
            Bake: "烤烤",
            "Submit to": "提交至",
            submission: "提交至 StarkNet",
            "demo-blank": "空白",
            demo: "範例",
            Save: "暫存",
            Clear: "清除所有暫存",
            "save to name": "暫存名",
            tutorial: {
                title: "怎麼玩",
                thesisTheme: "主題",
                thesisLine1:
                    "在第1層區塊鏈上，人們透過貢獻資本來鑄造身份。第2層區塊鏈具備擴展的運算容量，人們可以通過驗證技能來鑄造身份。",
                thesisLine2:
                    "<挪挪>是一種結合組合語言和並行處理的多維度優化謎題。在板上擺放布靈們，透過編程描述他們的行為，然後擺放配方，將水龍頭 (Faucet) 產出的原料轉換成目標產物，投遞於水槽 (Sink)。玩家提交的解決方案將以吞吐量和成本進行排名。",
                Overview: "簡介",
                overviewLine1:
                    "在煉金術的世界，物質透過煉成陣可轉換成其他物質。建造煉成陣吧：擺放配方與布靈，並巧妙安排布靈指令。",
                instructions: "煉成陣法則",

                explain_program: "程序是一段指令序列。",
                explain_mech: "每隻布靈皆有其程序。",
                explain_simulation: "模擬時，每隻布靈循環執行自己的程序。",
                available_instructions: "可用的指令:",
                instruction_wasd: ": 在圖紙上往上/下/左/右移動一格。",
                instruction_z: ": 將物質撿起。",
                instruction_x: ": 將物質放下。",
                instruction_g: ": 阻塞程序直到能夠撿起物質，並撿起物質. 若布靈已攜帶物質，則此指令形同無操作。",
                instruction_h: ": 阻塞程序直到能夠放下物質，並放下物質. 若布靈未攜帶物質，則此指令形同無操作。",
                instruction_c: ": 將物質丟下；如果該位置已被物質佔據，丟下的物質將直接消失！",
                instruction_noop: ": 無操作。",
                program_limit: "任意布靈的程序長度上限為 40 個指令。",
                formula_placement:
                    "配方擺法的連續性規則：輸入和輸出必須位於連續的網格。以 &(A, B) = C 為例，A 和 B 以及 B 和 C 都必須是鄰居關係。違反連續性規則時，版面上不會渲染配方符號。",
                faucet_sink: '水龍頭在圖紙上以 "F" 標示；水槽則以 "S" 標示。',

                formulaList: "配方列表",
                goal: "目標",
                goalAffordance: "利用水龍頭以每幀添補一單位 <1 /> 的特性，",
                goalDeliver: "設計煉成陣以製造 <1 /> 並遞送至任一水槽。",
                goalLine2: "優化煉成陣的延遲和成本。",
                goalLine3_1: "在 ",
                goalLine3_2: "上綁定 Discord ID 以名留青史。",
                costTitle: "成本",
                staticCostTitle: "靜態成本",
                staticCostLine1: "布靈: 150 / 隻",
                staticCostLine2: "攪攪: 250 / 配方",
                staticCostLine3: "搖搖: 500 / 配方",
                staticCostLine4: "蒸蒸: 750 / 配方",
                staticCostLine5: "砸砸: 1000 / 配方",
                dynamicCostTitle: "動態成本",
                dynamicCostLine1: " 無攜帶物質時移動: 10 / 幀",
                dynamicCostLine2: " 有攜帶物質時移動: 20 / 幀",
                dynamicCostLine3: " 撿起物質: 25 / 幀",
                dynamicCostLine4: " 放下物質: 25 / 幀",
                dynamicCostLine5: " 丟下物質: 10 / 幀 ",
                dynamicCostLine6: " 程序阻塞: 3 / 幀",
            },
            delivery: {
                accumulatedCost: "累計成本",
                delivered: "遞送",
            },
            summary: {
                title: "效能摘要",
                totalPre: "{{frames}} 幀內總遞送",
                totalPost: "單位",
                inFrames: "",
                averageLatencyPre: "每單位",
                averageLatencyPost: "遞送平均延遲",
                averageDynamicCostPre: "每單位",
                averageDynamicCostPost: "遞送平均動態成本",
                delivery: "送貨",
                staticCost: "靜態成本",
            },
            leaderboard: {
                title: "天下前 20 炼成阵",
                rank: "排行",
                account: "誰",
                delivered: `總遞送`,
                static_cost: "靜態成本",
                latency: "平均遞送延遲",
                dynamic_cost: "平均遞送動態成本",
                block_number: "區塊高度",
            },
        },
    },
    fr: {
        translation: {
            MuMu: "BouBou",
            Subtitle: "Une experience realisée par Topology",
            frame: "Séquence",
            mech: "mech",
            newMech: "nouveau mech",
            removeMech: "supprimer mech",
            removeMechConfirm: "Etes-vous sûr que vous voulez supprimer {{mech}}?",
            no: "Non",
            newOperation: "nouvelle {{operation}}",
            removeOp: "supprimer op",
            confirmFormula: "Confirmer la formule",
            placeFormula: "Cliquez sur une grille valide pour placer",
            run: "Run",
            pause: "Pause",
            stop: "Stop",
            incrementFrame: "+1 séquence",
            decrementFrame: "-1 séquence",
            "Stir ": "Remuer   ",
            Shake: "Secouer  ",
            Steam: "Vaporiser",
            Smash: "Fracasser",
            tutorial: {
                title: "Comment jouer",
                thesisTheme: "Thèse et Thème",
                thesisLine1:
                    "Les blockchains layer 1 distribuent une identité par contribution financière ou pay to mint. Les blockchains layer 2, avec leur capacité de calcul supérieure, permettraient de revendiquer une identité à travers la vérification de compétence ou solve to mint.",
                thesisLine2:
                    "BouBou est un puzzle qui combine la programmation visuelle et parallèle. Il s'agit de programmer et placer des petits robots (\"mechs\") sur le damier et de placer les opérateurs qui exécutent des formules pour transporter et transmuter différents types d'atomes depuis le Faucet jusqu'à l'évier",
                instructions: "Instructions",
                instructionsLine1:
                    "Actuellement, il n’existe que les mécanismes (\"mech\") singletons, dont l'ensemble des instructions est [<1>W</1>,<3>A</3>,<5>S</5>,<5>D</5>] pour le déplacement, <7>Z</7> pour ramasser, <9>X</9> pour déposer, <11>G</11> pour attendre jusqu'à ce qu'un ramassage soit possible et <13>H</13> pour attendre jusqu'à ce qu'un dépôt soit possible,",
                instructionsLine2:
                    "Détails sur <1>G</1>: le mech restera bloqué sur cette instruction jusqu'à ce qu'un atome libre soit disponible à sa localisation sur le damier. Le mech ramasse alors l'atome dans la séquence actuelle et continuera l'exécution normale de ses instructions dans la séquence suivante. Si le mech est fermé quand il arrive à cette instruction (i.e. incapable de ramasser), l'instruction est passée.",
                instructionsLine3:
                    "Détails sur <1>G</1>: le mech restera bloqué sur cette instruction jusqu'à ce que sa localisation sur le damier soit libre. Le mech dépose alors l'atome dans la séquence actuelle et continuera l'exécution normale de ses instructions dans la séquence suivante. Si le mech est ouvert quand il arrive à cette instruction (i.e. incapable de déposer), l'instruction est passée.",
                instructionsLine4: "le symbole _ répresente une non-opération",
                instructionsLine5:
                    "Pendant la simulation, chaque mech parcourt son programme (séquence d'instructions) en boucle.",
                instructionsLine6:
                    "Détails sur le placement des opérateurs: les opérandes et produits doivent être continues i.e. pour a+b=c, a&b et b&c doivent être voisins. Quand la règle de continuité est violée, les opérateurs ne sont pas affichés.",
                instructionsLine7:
                    'Le Faucet et le Sink sont représentés respectivement par un "F" et un "S" sur le damier.',
                instructionsLine8: "Le Faucet peut produire <1 /> au rythme d'une unité par séquence.",
                formulaList: "Liste des Formules",
                goal: "Objectif",
                goalAffordance: "En utilisant le Faucet qui produit <1 /> au rythme d'une unité par séquence,",
                goalDeliver: "Produit et livre <1 /> au Sink.",
                goalLine2: "Minimise la latence et le coût de la solution.",
            },
            delivery: {
                accumulatedCost: "Coût accumulé",
                delivered: "Livré",
            },
            summary: {
                title: "Résumé de la dernière simulation",
                totalPre: "Nombre total de livraisons en",
                totalPost: " unité(s)",
                inFrames: "en {{frames}} séquences",
                averageLatencyPre: "Latence moyenne par",
                averageLatencyPost: "unité livrée",
                averageDynamicCostPre: "Coût dynamique moyen par",
                averageDynamicCostPost: "unité livrée",
                delivery: "Livré",
                staticCost: "Coût statique",
            },
        },
    },
    jp: {
        translation: {
            MuMu: "MuMu: シーズン 2",
            Subtitle: "topologyによる実験",
            Connect: "接続する ",
            Connected: "あなたのアドレス: ",
            frame: "フレーム",
            mech: "メカ",
            newMech: "メカを追加",
            removeMech: "メカを削除",
            removeMechConfirm: "消去してもよろしいですか {{mech}}?",
            no: "いいえ",
            newOperation: "{{operation}} を追加",
            removeOp: "演算子を削除",
            confirmFormula: "式を確認します",
            placeFormula: "配置する有効なグリッドをクリックします",
            run: "実行",
            pause: "一時停止",
            stop: "止める",
            incrementFrame: "+1 フレーム",
            decrementFrame: "-1 フレーム",
            "Mech programming": "メカをプログラミングして配置する",
            "Formula placement": "演算子を配置する",
            "Stir ": "混ぜる ",
            Shake: "振る",
            Steam: "蒸す",
            Smash: "砕く",
            "Submit to": "提出する",
            "demo-blank": "白紙",
            demo: "デモ",
            Save: "保存",
            Clear: "全削除する",
            "save to name": "名前をつけて保存",
            tutorial: {
                title: "遊び方",
                thesisTheme: "仮説とテーマ",
                thesisLine1:
                    "レイヤー1のブロックチェーンは、資本による貢献によってアイデンティティを主張します。レイヤー2のブロックチェーンは 計算能力という新たな余裕を持ち スキル検証によってアイデンティティを主張します。pay to mintからsolve to mintへ。",
                thesisLine2:
                    "MuMuは、ビジュアルと並列のアセンブリプログラミングをテーマとしたパズルです。小さなロボット(メカ)をボード上に配置し、プログラミングし、数式を実行するオペレーターを配置して、材料を蛇口からシンクまで運搬・変換します。解答は処理能力とコストでランク付けされます。",
                Overview: "概要",
                overviewLine1:
                    "錬金術の世界では、錬金術の合成レシピによって物質を変化させることができます。メカをプログラムし、数式とメカを創造的に配置して合成レシピを構築してください。",
                instructions: "錬金術の合成レシピのルール",

                explain_program: "プログラムは指示の連なりです。",
                explain_mech: "それぞれのメカは独自のプログラムを持っています。",
                explain_simulation: "シミュレーションの間、それどれのメカは自身のプログラムを繰り返し実行します。",
                available_instructions: "利用可能な指示：",
                instruction_wasd: ": キャンバス場で1マス上下左右に動きます",
                instruction_z: ": 可能であれば物体を拾います",
                instruction_x: ": 可能であれば持っている物体を落とします。",
                instruction_g:
                    ": 物体を拾うまでのブロックプログラムです。この指示はメカがすでにオブジェクトを所有している場合は、実行されません。",
                instruction_h:
                    ": 持っている物体を落とすまでのブロックプログラムです。この指示はメカが物体を持っていない場合は実行されません。",
                instruction_noop: ": 操作なし",
                program_limit: "プログラムは40以上の指示を持つことはできません。",
                formula_placement:
                    "数式の配置について：被演算子と積は連続したグリッドである必要があります。例えば &(a,b)=c の場合、a-b と b-c は共に隣接していなければなりません。このルールに違反した場合、数式記号は描画ません。",
                faucet_sink: "蛇口は盤面に「F」、シンクは盤面に「S」と記載されています。",

                formulaList: "数式リスト",
                goal: "ゲームの目的",
                goalAffordance: "蛇口は<1 /> を1フレームあたり1ユニット補充します。",
                goalDeliver: " <1 /> を生み出してシンクまで届ける合成レシピを構築してください。",
                goalLine2: "それにかかるフレーム数（レイテンシー）とコストを最小化してください。",
                goalLine3_1: "",
                goalLine3_2: "に登録するとリーダーボードにあなたの名前が表示されます。",
                costTitle: "コスト",
                staticCostTitle: "静的コスト",
                staticCostLine1: "メカ: 150 / 個",
                staticCostLine2: "混ぜる: 250 / 式",
                staticCostLine3: "振る: 500 / 式",
                staticCostLine4: "蒸す: 750 / 式",
                staticCostLine5: "砕く: 1000 / 式",
                dynamicCostTitle: "動的コスト",
                dynamicCostLine1: " に物体を動かすために動く時: 10 / フレーム",
                dynamicCostLine2: " に物体を動かすためではなく動く時: 20 / フレーム",
                dynamicCostLine3: " 物体を拾う: 25 / フレーム",
                dynamicCostLine4: " 物体を落とす: 25 / フレーム",
                dynamicCostLine6: " ブロックする: 3 / フレーム",
            },
            delivery: {
                accumulatedCost: "蓄積コスト",
                delivered: "運ばれたもの",
            },
            summary: {
                title: "前回の実行結果",
                totalPre: "",
                totalPost: " ユニット",
                inFrames: "ユニットの{{frames}} フレームあたりの総運送数",
                averageLatencyPre: "",
                averageLatencyPost: "ユニットを運ぶ平均フレーム数",
                averageDynamicCostPre: "",
                averageDynamicCostPost: "ユニットを運ぶ平均動的コスト",
                delivery: "運搬",
                staticCost: "静的コスト",
            },
            leaderboard: {
                title: "Top 20",
                rank: "ランキング",
                account: "名前",
                delivered: `運んだ数`,
                static_cost: "静的コスト",
                latency: "１運搬あたりの平均フレーム数",
                dynamic_cost: "１運搬あたりの平均動的コスト",
                block_number: "ブロック番号",
            },
        },
    },
};

export default resources;
