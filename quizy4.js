// 解答クリック時の処理
// question_id：問題番号、1問目の場合は[1]を受け取る
// selection_id：回答番号、選択された選択肢の番号を受け取る
// valid_id：正解番号、正解の選択肢の番号を受け取る
function check(question_id, selection_id, valid_id) {

    // クリック無効化
    const answerlists = document.getElementsByName('answerlist_' + question_id);
    answerlists.forEach(answerlist => {
        answerlist.style.pointerEvents = 'none';
    });

    // 選択項目のスタイル設定処理
    // 選択された選択肢の背景色をオレンジ、正解の選択肢を水色に設定
    // 選択された選択肢が正解だった場合は水色で上書きする
    const selectiontext = document.getElementById('answerlist_' + question_id + '_' + selection_id);
    const validtext = document.getElementById('answerlist_' + question_id + '_' + valid_id);
    selectiontext.className = 'answer_invalid';
    validtext.className = 'answer_valid';

    // 正解・不正解の表示設定処理
    const answerbox = document.getElementById('answerbox_' + question_id);
    const answertext = document.getElementById('answertext_' + question_id);
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
function createquestion(question_id, selection_list, valid_id) {
    let contents = `<div class="quiz">`
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
    document.getElementById('main').insertAdjacentHTML('beforeend', contents);
}

// HTMLを生成して出力する
function createhtml() {
    // S3からJSONファイルを取得する
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://forposse.s3-ap-northeast-1.amazonaws.com/dr56gfrtyujhuiolkiokjnbvftyhgf.csv');

    // S3からJSONファイルの取得が完了したら実行する処理
    xhr.onload = () => {
        // 取得したJSONファイルから配列を生成する
        const responseJson = JSON.parse(xhr.response);
        const question_list = responseJson.map(item => item['question']);

        // 問題リスト分ループ処理する
        // 配列をランダムにソートして問題のHTML生成処理を呼ぶ
        question_list.forEach(function (question, index) {
            // 正しい回答を記憶
            answer = question[0];

            // 配列をランダムにソート（Fisher-Yates shuffle）
            for (let i = question.length - 1; i > 0; i--) {
                const r = Math.floor(Math.random() * (i + 1));
                const tmp = question[i];
                question[i] = question[r];
                question[r] = tmp;
            }

            // 問題リストと回答番号を設定して問題のHTML生成処理を呼び出す
            createquestion(index + 1, question, question.indexOf(answer) + 1);
        });
    }
    xhr.send();
}

// JSファイル読み込み時の処理
window.onload = createhtml();
