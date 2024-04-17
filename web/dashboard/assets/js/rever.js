var IDFavorito;
var Docs = [];

function getFavoritos() {
    var storedArray = sessionStorage.getItem("IDDocumentos");
    console.log("Stored Array: " + storedArray);

    Docs = JSON.parse(storedArray);
    console.log("Documentos: " + Docs);
}

function listarFavoritos() {
    var container = document.querySelector('#tabelaFavoritos'); 

    
    container.innerHTML = '';

    if (Docs.length === 0) { 
        var item = document.createElement('div');
        item.className = 'text-center font-weight-bold'; 
        item.innerHTML = '<h5>Sem Favoritos Selecionados! <br> <br> <a href="consult_indexis.html">Pesquisar Documentos!</a></h5>';
        container.appendChild(item);
    } else {

        for (let i = 0; i < Docs.length; i++) {
            var IDFavorito = Docs[i];

            var url = 'http://localhost:5230/api/documento/' + IDFavorito;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); 
                })
                .then(data => {

                    let pdfUrl = '/indexis_v1/api/Base_Dados/pdfs/DocumentoId' + data.id + '.pdf';
                    var item = document.createElement('div');
                    item.className = 'mb-35 d-flex justify-content-between align-items-center';
                    item.innerHTML = `
                    <div class="w-p100 rounded10 justify-content-between align-items-center d-flex">
                        <div class="d-flex justify-content-between align-items-center">
                            <img src="../images/pdf.png" class="me-10 avatar" alt="">
                            <div>
                                <a href='#' onclick='loadPDF("${pdfUrl}")' class="m-0 fs-18 fw-600 hover-blue">DocumentoID${data.id}</a>
                            </div>
                        </div>
                        <div class="dropdown">
                            <a href="#"><i class="fa fa-download bg-light rounded p-5 me-5 text-dark" aria-hidden="true"></i></a>
                            <a data-bs-toggle="dropdown" href="#" aria-expanded="false" class=""><i class="ti-more-alt rotate-90"></i></a>
                            <div class="dropdown-menu dropdown-menu-end" style="">
                                <a class="dropdown-item" href="#" onclick='removeFavorito("${data.id}")'><i class="fas fa-check"></i>Revisto</a>
                            </div>
                        </div>
                    </div>
                `;


                    container.appendChild(item);


                })
                .catch(error => {
                    console.error('Error fetching data for ' + url, error);
                });
        }
    }
}

function loadPDF(pdfUrl) {
    console.log('Loading PDF:', pdfUrl);

    var iframe = document.getElementById('pdf-iframe');
    var pdfVisualizer = document.getElementById('pdf-visualizer');

    if (pdfUrl) {
        iframe.src = pdfUrl;
        pdfVisualizer.style.setProperty('display', 'block', 'important');
    } else {
        pdfVisualizer.style.setProperty('display', 'none', 'important');
    }
}


function removeFavorito(documentoId) {
    var documentoID = documentoId;
    var documentoIdInt = parseInt(documentoID);

    var indexToRemove = Docs.indexOf(documentoIdInt);

    if (indexToRemove !== -1) {
        Docs.splice(indexToRemove, 1);

        sessionStorage.setItem("IDDocumentos", JSON.stringify(Docs));

        loadPDF('');

        getFavoritos();

        listarFavoritos();
    } else {
        console.log(`DocumentoID ${documentoIdString} not found in the favoritos array.`);
    }
}



$(function () {
    getFavoritos();
    listarFavoritos();
});