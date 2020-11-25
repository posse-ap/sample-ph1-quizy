function check(question_no, selected_no, valid_no) {

    const answerlist = document.getElementsByName("answerlist_" + question_no);
    answerlist.forEach(answer => {
        answer.style.pointerEvents = "none";;
    });

    const selected = document.getElementById("answerlist_" + question_no + "_" + selected_no);
    selected.style.backgroundColor = "#fd6647";
    selected.style.color = "#ffffff";
    const valid = document.getElementById("answerlist_" + question_no + "_" + valid_no);
    valid.style.backgroundColor = "#08b3f0";
    valid.style.color = "#ffffff";

    const answertext = document.getElementById("answertext_" + question_no);
    if (selected_no == valid_no) {
        answertext.innerHTML = "正解！";
        answertext.className = "answerbox_valid";
    } else {
        answertext.innerHTML = "不正解！";
        answertext.className = "answerbox_invalid";
    }

    const answerbox = document.getElementById("answerbox_" + question_no);
    answerbox.style.display = "block";
}
