function animateValue(id, start, end, duration) {
    var range = end - start;
    var minTimer = 50;
    var stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    var startTime = new Date().getTime();
    var endTime = startTime + duration;
    var timer;

    function run() {
        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / duration, 0);
        var value = Math.round(end - (remaining * range));
        document.getElementById(id).innerHTML = value;
        if (value == end) {
            clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    run();
}


function getCount() {

    var url = 'http://localhost:5230/api/documento/search';

    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {

                var counter = {
                    id: 0,
                    referenciaDocumento: 0,
                    versao: 0,
                    nomeFicheiro: 0
                };

                for (let i = 0; i < data.length; i++) {
                    if (data[i].id) counter.id++;
                    if (data[i].id) counter.referenciaDocumento++; 
                    if (data[i].versao != 1) counter.versao++; //Versao original = 1, se for mudado significa que foi consultado -> Complementado pelo setVersao!
                    if (data[i].id) counter.nomeFicheiro++;
                }

                animateValue("count_doc_registados", 0, counter.id, 2500);
                animateValue("count_doc_consultados", 0,counter.referenciaDocumento, 2500);                
                animateValue("count_doc_alterados", 0, counter.versao, 4000);
                animateValue("count_doc_tempo_ganho", 0, (counter.nomeFicheiro * 10 / 60), 2500);

            } else {
                console.error('Erro:', data);
                alert("Request failed: " + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Request failed: " + error.message);
        });
}