

const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

// ===================================================
// データ定義（メモリ上で管理）
// ===================================================

// 1. 日本の城データ (castles) - 7件
let castles = [
    { id: 1, name: "姫路城", pref: "兵庫県", height: "46m", access: "姫路駅から徒歩20分", area: "233ha" },
    { id: 2, name: "松本城", pref: "長野県", height: "29m", access: "松本駅から徒歩15分", area: "39ha" },
    { id: 3, name: "大阪城", pref: "大阪府", height: "58m", access: "大阪城公園駅からすぐ", area: "105ha" },
    { id: 4, name: "名古屋城", pref: "愛知県", height: "56m", access: "市役所駅から徒歩5分", area: "25ha" },
    { id: 5, name: "首里城", pref: "沖縄県", height: "16m", access: "首里駅から徒歩15分", area: "5ha" },
    { id: 6, name: "彦根城", pref: "滋賀県", height: "16m", access: "彦根駅から徒歩15分", area: "26ha" },
    { id: 7, name: "熊本城", pref: "熊本県", height: "30m", access: "熊本城・市役所前駅から徒歩5分", area: "98ha" }
];

// 2. SHISHAMO (バンド) データ (songs) - 7件
let songs = [
    { id: 1, name: "明日も", date: "2017/02/22", type: "アルバム『SHISHAMO 4』", duration: "6:09", impression: "元気が出る応援ソング。ドコモCM曲。" },
    { id: 2, name: "君と夏フェス", date: "2014/07/02", type: "シングル", duration: "3:45", impression: "夏フェスに行きたくなる定番曲。" },
    { id: 3, name: "恋する", date: "2013/11/13", type: "アルバム『SHISHAMO』", duration: "6:12", impression: "キャッチーなメロディが特徴的。" },
    { id: 4, name: "僕に彼女ができたんだ", date: "2013/11/13", type: "アルバム『SHISHAMO』", duration: "3:09", impression: "デビュー当時の代表曲。" },
    { id: 5, name: "ねぇ、", date: "2018/06/20", type: "アルバム『SHISHAMO 5』", duration: "3:40", impression: "カルピスウォーターCMソング。" },
    { id: 6, name: "ハッピーエンド", date: "2021/06/30", type: "アルバム『SHISHAMO 7』", duration: "4:24", impression: "切ない歌詞が心に響く。" },
    { id: 7, name: "狙うは君のど真ん中", date: "2021/06/30", type: "アルバム『SHISHAMO 7』", duration: "3:36", impression: "ポップで可愛いラブソング。" }
];

// 3. グミ図鑑データ (gummies) - 7件
let gummies = [
    { id: 1, name: "果汁グミ", texture: "スタンダード", price: "138円", flavors: "ぶどう, みかん, もも", maker: "明治" },
    { id: 2, name: "ハリボー ゴールドベア", texture: "硬め", price: "250円", flavors: "パイナップル, レモン, ラズベリー等", maker: "HARIBO" },
    { id: 3, name: "ピュレグミ", texture: "シャリシャリ", price: "140円", flavors: "レモン, グレープ, マスカット", maker: "カンロ" },
    { id: 4, name: "コロロ", texture: "プチッと弾ける", price: "140円", flavors: "グレープ, マスカット, ソーダ", maker: "UHA味覚糖" },
    { id: 5, name: "フェットチーネグミ", texture: "アルデンテ", price: "110円", flavors: "イタリアングレープ, ピーチ", maker: "ブルボン" },
    { id: 6, name: "忍者めし", texture: "ハード", price: "110円", flavors: "梅かつお, 巨峰, ラムネ", maker: "UHA味覚糖" },
    { id: 7, name: "タフグミ", texture: "超高弾力", price: "200円", flavors: "コーラ, エナジードリンク, ソーダ", maker: "カバヤ" }
];

// ===================================================
// ルーティング処理
// ===================================================

// ※トップページ (/) のルートは削除しました

// ---------------------------------------------------
// 1. 日本の城 (Castles) のCRUD
// ---------------------------------------------------

// 一覧表示
app.get("/castles", (req, res) => {
    res.render('castles_list', { data: castles });
});

// 新規登録フォーム表示
app.get("/castles/create", (req, res) => {
    res.render('castles_create');
});

// 新規登録処理 (POST)
app.post("/castles", (req, res) => {
    const newId = castles.length > 0 ? Math.max(...castles.map(c => c.id)) + 1 : 1;
    const newCastle = {
        id: newId,
        name: req.body.name,
        pref: req.body.pref,
        height: req.body.height,
        access: req.body.access,
        area: req.body.area
    };
    castles.push(newCastle);
    res.redirect('/castles');
});

// 詳細表示
app.get("/castles/:id", (req, res) => {
    const target = castles.find(c => c.id === parseInt(req.params.id));
    target ? res.render('castles_detail', { data: target }) : res.send("データが見つかりません");
});

// 編集フォーム表示
app.get("/castles/edit/:id", (req, res) => {
    const target = castles.find(c => c.id === parseInt(req.params.id));
    target ? res.render('castles_edit', { data: target }) : res.send("データが見つかりません");
});

// 更新処理 (POST)
app.post("/castles/update/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = castles.findIndex(c => c.id === id);
    if (index !== -1) {
        castles[index] = {
            id: id,
            name: req.body.name,
            pref: req.body.pref,
            height: req.body.height,
            access: req.body.access,
            area: req.body.area
        };
    }
    res.redirect('/castles');
});

// 削除処理
app.get("/castles/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    castles = castles.filter(c => c.id !== id);
    res.redirect('/castles');
});


// ---------------------------------------------------
// 2. SHISHAMO (Band) のCRUD
// ---------------------------------------------------

// 一覧表示
app.get("/shishamo", (req, res) => {
    res.render('shishamo_list', { data: songs });
});

// 新規登録フォーム表示
app.get("/shishamo/create", (req, res) => {
    res.render('shishamo_create');
});

// 新規登録処理 (POST)
app.post("/shishamo", (req, res) => {
    const newId = songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1;
    const newSong = {
        id: newId,
        name: req.body.name,
        date: req.body.date,
        type: req.body.type,
        duration: req.body.duration,
        impression: req.body.impression
    };
    songs.push(newSong);
    res.redirect('/shishamo');
});

// 詳細表示
app.get("/shishamo/:id", (req, res) => {
    const target = songs.find(s => s.id === parseInt(req.params.id));
    target ? res.render('shishamo_detail', { data: target }) : res.send("データが見つかりません");
});

// 編集フォーム表示
app.get("/shishamo/edit/:id", (req, res) => {
    const target = songs.find(s => s.id === parseInt(req.params.id));
    target ? res.render('shishamo_edit', { data: target }) : res.send("データが見つかりません");
});

// 更新処理 (POST)
app.post("/shishamo/update/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = songs.findIndex(s => s.id === id);
    if (index !== -1) {
        songs[index] = {
            id: id,
            name: req.body.name,
            date: req.body.date,
            type: req.body.type,
            duration: req.body.duration,
            impression: req.body.impression
        };
    }
    res.redirect('/shishamo');
});

// 削除処理
app.get("/shishamo/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    songs = songs.filter(s => s.id !== id);
    res.redirect('/shishamo');
});


// ---------------------------------------------------
// 3. グミ図鑑 (Gummy) のCRUD
// ---------------------------------------------------

// 一覧表示
app.get("/gummy", (req, res) => {
    res.render('gummy_list', { data: gummies });
});

// 新規登録フォーム表示
app.get("/gummy/create", (req, res) => {
    res.render('gummy_create');
});

// 新規登録処理 (POST)
app.post("/gummy", (req, res) => {
    const newId = gummies.length > 0 ? Math.max(...gummies.map(g => g.id)) + 1 : 1;
    const newGummy = {
        id: newId,
        name: req.body.name,
        texture: req.body.texture,
        price: req.body.price,
        flavors: req.body.flavors,
        maker: req.body.maker
    };
    gummies.push(newGummy);
    res.redirect('/gummy');
});

// 詳細表示
app.get("/gummy/:id", (req, res) => {
    const target = gummies.find(g => g.id === parseInt(req.params.id));
    target ? res.render('gummy_detail', { data: target }) : res.send("データが見つかりません");
});

// 編集フォーム表示
app.get("/gummy/edit/:id", (req, res) => {
    const target = gummies.find(g => g.id === parseInt(req.params.id));
    target ? res.render('gummy_edit', { data: target }) : res.send("データが見つかりません");
});

// 更新処理 (POST)
app.post("/gummy/update/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = gummies.findIndex(g => g.id === id);
    if (index !== -1) {
        gummies[index] = {
            id: id,
            name: req.body.name,
            texture: req.body.texture,
            price: req.body.price,
            flavors: req.body.flavors,
            maker: req.body.maker
        };
    }
    res.redirect('/gummy');
});

// 削除処理
app.get("/gummy/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    gummies = gummies.filter(g => g.id !== id);
    res.redirect('/gummy');
});


// ===================================================
// サーバー起動
// ===================================================
app.listen(8080, () => console.log("Example app listening on port 8080!"));