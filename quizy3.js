// 問題リスト定義
// 配列の先頭が正しい回答として設定する
var question_list = new Array();
question_list.push(['たかなわ', 'こうわ', 'たかわ']);
question_list.push(['かめいど', 'かめと', 'かめど']);
question_list.push(['こうじまち', 'おかとまち', 'かゆまち']);

// 解答クリック時の処理
// question_id：問題番号、1問目の場合は[1]を受け取る
// selection_id：回答番号、選択された選択肢の番号を受け取る
// valid_id：正解番号、正解の選択肢の番号を受け取る
function check(question_id, selection_id, valid_id) {

    // クリック無効化
    var answerlists = document.getElementsByName('answerlist_' + question_id);
    answerlists.forEach(answerlist => {
        answerlist.style.pointerEvents = 'none';
    });

    // 選択項目のスタイル設定処理
    // 選択された選択肢の背景色をオレンジ、正解の選択肢を水色に設定
    // 選択された選択肢が正解だった場合は水色で上書きする
    var selectiontext = document.getElementById('answerlist_' + question_id + '_' + selection_id);
    var validtext = document.getElementById('answerlist_' + question_id + '_' + valid_id);
    selectiontext.className = 'answer_invalid';
    validtext.className = 'answer_valid';

    // 正解・不正解の表示設定処理
    var answerbox = document.getElementById('answerbox_' + question_id);
    var answertext = document.getElementById('answertext_' + question_id);
    if (selection_id == valid_id) {
        answertext.className = 'answerbox_valid';
        answertext.innerText = '正解！';
    } else {
        answertext.className = 'answerbox_invalid';
        answertext.innerText = '不正解！';
    }
    answerbox.style.display = 'block';
}

// 問題分のHTMLを生成して出力する
// question_id：問題番号、1問目の場合は[1]を受け取る
// selection_list：回答の選択肢配列を受け取る
// valid_id：正解番号、正解の選択肢の番号を受け取る。先頭の選択肢が正解の場合は1となる
function createquestion(question_id, selection_list, valid_id) { //createquestion関数の中のforEachの中で発火するので1問ごとに問題のHTMLを生成
    var contents = `<div class="quiz">`
        + `    <h1>${question_id}. この地名はなんて読む？</h1>`
        + `    <img src="img/${question_id}.png">`
        + `    <ul>`;

    // selection_listの配列分だけループ処理して選択肢を作成する
    selection_list.forEach(function (selection, index) {
        contents += `        <li id="answerlist_${question_id}_${(index + 1)}" name="answerlist_${question_id}" `
            + `class="answerlist" onclick="check(${question_id}, ${(index + 1)}, ${valid_id})">${selection}</li>`;
    });

    contents += `        <li id="answerbox_${question_id}" class="answerbox">`
        + `            <span id="answertext_${question_id}"></span><br>`
        + `            <span>正解は「${selection_list[valid_id - 1]}」です！</span>`
        + `        </li>`
        + `    </ul>`
        + `</div >`;
    document.getElementById('main').insertAdjacentHTML('beforeend', contents); //HTMLのmainというidがついた要素の閉じタグの前にcontentsを挿入
}

// HTMLを生成して出力する
function createhtml() { //ファイルを読み込んだときに発火
    // 問題リスト分ループ処理する
    // 配列をランダムにソートして問題のHTML生成処理を呼ぶ
    question_list.forEach(function (question, index) { //question_listの値の数だけループ(問題ごとに計3問分) question:選択肢が入った配列, index:0始まりの問題番号
        // 正しい回答を記憶
        answer = question[0]; //シャッフルする前に先頭の選択肢を正解として変数answerに保持

        // 配列をランダムにソート（Fisher-Yates shuffle）  ←問題を表示する前にあらかじめ元の選択肢配列をシャッフルしておく
        for (var i = question.length - 1; i > 0; i--) {
            var r = Math.floor(Math.random() * (i + 1)); //Math.floor()は小数点以下切り捨て, Math.ramdom()は0以上1未満のランダムな浮動小数点の擬似乱数を返します
            var tmp = question[i]; //入れ替え前のi番目選択肢を変数tmpに保持
            question[i] = question[r]; //78,79  i番目とj番目を入れ替える
            question[r] = tmp;
        }

        // 問題リストと回答番号を設定して問題のHTML生成処理を呼び出す
        createquestion(index + 1, question, question.indexOf(answer) + 1); //createquestion関数を発火  index+1: 1始まりの問題番号, question: 上に同じ, question.indexOf(answer)+1: 正解の選択肢を文字列で検索して何番目かを返してくれる。+1しているので1始まりになる。
    });
}

// JSファイル読み込み時の処理
window.onload = createhtml();
