var IDDoc;
var Docs = [];

//Que funçao chamar dependendo do tipo de pesquisa
function procurarDocumento() {

    var documentoIds = ['input2', 'input3', 'input4', 'inputDateEnd', 'inputConservatoria'];//Inputs documento

    var livroIds = ['select2', 'select3', 'select4', 'input1', 'select5', 'inputDateStart'];//Inputs livro

    var shouldGetDocumento = documentoIds.some(id => {
        var value = document.getElementById(id).value;
        return value && value !== "Selecionar uma opção"; //avaliaçao da condiçao
    });

    var shouldGetLivro = livroIds.some(id => {
        var value = document.getElementById(id).value;
        return value && value !== "Selecionar uma opção";//avaliaçao da condiçao
    });

    if (shouldGetDocumento && shouldGetLivro) {

        getDoc_e_Livro();//chama a funçao getDoc_e_Livro se a condiçao for verdadeira

    } else {
        if (shouldGetDocumento) {
            getDocumento();//chama a funçao getDocumento se a condiçao for verdadeira
        }

        if (shouldGetLivro) {
            getLivro();//chama a funçao getLivro se a condiçao for verdadeira
        }
    }
}

//Para os selects do Documento
function alimentaSelects_documento() {
    console.log("alimentaSelects called");

    fetch('http://localhost:5230/api/documento')
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('First select doc conservatoria:', data[0]);

            const inputConservatoria = document.getElementById('inputConservatoria');
            const conservatorias = new Set();

            data.forEach(item => {
                if (item.entidadeEmissora) {
                    conservatorias.add(item.entidadeEmissora);
                }
            });

            let sortedConservatorias = Array.from(conservatorias).sort();

            inputConservatoria.innerHTML = "";

            if (!sortedConservatorias.includes("Selecionar uma opção")) {
                sortedConservatorias.unshift("Selecionar uma opção");
            }

            sortedConservatorias.forEach(conservatoria => inputConservatoria.options.add(new Option(conservatoria, conservatoria)));
        })
        .catch(error => console.error('Error:', error));
}

//Para os selects do Livro
function alimentaSelects_livro() {
    console.log("alimentaSelects called");

    fetch('http://localhost:5230/api/livro')
        .then(response => {
            console.log("Response received");
            return response.json();
        })
        .then(data => {
            console.log("First item in data", data[0]);

            const select2 = document.getElementById('select2');
            const select3 = document.getElementById('select3');
            const select4 = document.getElementById('select4');
            const select5 = document.getElementById('select5');
            const inputConservatoria = document.getElementById('inputConservatoria');

            console.log("Select elements", select2, select3, select4, select5);

            const letras = new Set();
            const numeros = new Set();
            const folhas = new Set();
            const versos = new Set();
            const conservatorias = new Set();

            console.log('Dados:', data);

            data.forEach(item => {
                letras.add(item.letra);
                numeros.add(item.numero);
                if (item.folha !== null) { // Verifica se a folha é nula ou nao! Existe pelo menos 1 valor nulo!
                    folhas.add(item.folha);
                }
                versos.add(item.verso ? 'Sim' : 'Não');
                conservatorias.add(item.conservatoria);
            });

            let sortedLetras = Array.from(letras).sort();
            let sortedNumeros = Array.from(numeros).sort((a, b) => a - b); //Para ordenar os valores numericos
            let sortedFolhas = Array.from(folhas).sort((a, b) => a - b); // Para ordenar os valores numericos
            let sortedVersos = Array.from(versos).sort();
            let sortedConservatorias = Array.from(conservatorias).sort();

            // Default opçao
            sortedLetras.unshift("Selecionar uma opção");
            sortedNumeros.unshift("Selecionar uma opção");
            sortedFolhas.unshift("Selecionar uma opção");
            sortedVersos.unshift("Selecionar uma opção");
            sortedConservatorias.unshift("Selecionar uma opção");

            sortedLetras.forEach(letra => select2.options.add(new Option(letra, letra)));
            sortedNumeros.forEach(numero => select3.options.add(new Option(numero, numero)));
            sortedFolhas.forEach(folha => select4.options.add(new Option(folha, folha)));
            sortedVersos.forEach(verso => select5.options.add(new Option(verso, verso)));
            sortedConservatorias.forEach(conservatoria => inputConservatoria.options.add(new Option(conservatoria, conservatoria)));
        })
        .catch(error => console.error('Error:', error));
}

//Get API para os Documentos
function getDocumento() {
    loadPDF('');  // Limpar o iframe quando se faz uma nova pesquisa

    var idDocumento = document.getElementById('input2').value;
    var referenciaDocumento = document.getElementById('input3').value;
    var idPasta = document.getElementById('input4').value;
    var inputDateEnd = document.getElementById('inputDateEnd').value;

    var url = 'http://localhost:5230/api/documento/search?';

    if (idDocumento) {
        url += 'ID=' + idDocumento + '&';
    }
    if (referenciaDocumento) {
        url += 'ReferenciaDocumento=' + referenciaDocumento + '&';
    }
    if (idPasta) {
        url += 'PastaId=' + idPasta + '&';
    }
    if (inputDateEnd) {
        url += 'ExpiraEm=' + inputDateEnd + '&';
    }

    url = url.endsWith('&') ? url.slice(0, -1) : url;

    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                $('.content').show();
                $('.box-body').show();
                $('#tblgetAPI').show();
                $('#tblgetAPI').empty();

                let tableHtml = "<table id='tblgetAPI' class='table text-center'>";
                tableHtml += "<thead>";
                tableHtml += "<tr>";

                tableHtml += "<th>ID do Documento</th>";
                tableHtml += "<th>Referência do Documento</th>";
                tableHtml += "<th>ID Pasta do Documento</th>";
                tableHtml += "<th>Conservatória</th>";
                tableHtml += "<th>Nome do Ficheiro</th>";
                tableHtml += "<th>PDF Disponivel</th>";

                tableHtml += "</tr>";
                tableHtml += "</thead>";
                tableHtml += "<tbody>";

                let fetchPromises = [];

                for (let i = 0; i < data.length; i++) {
                    let pdfUrl = '/indexis_v1/api/Base_Dados/pdfs/DocumentoId' + data[i].id + '.pdf';

                    let fetchPromise = fetch(pdfUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('PDF não disponivel!');
                            }
                            return response.url;
                        })
                        .then(pdfUrl => {
                            return "<tr onclick='loadPDF(\"" + pdfUrl + "\"), setID(" + data[i].id + ")'>" +  // Toda a linha é clicavel para abrir o PDF
                                "<td>" + data[i].id + "</td>" +
                                "<td>" + data[i].referenciaDocumento + "</td>" +
                                "<td>" + data[i].pastaId + "</td>" +
                                "<td>" + data[i].entidadeEmissora + "</td>" +
                                "<td><a href='" + pdfUrl + "' target='_blank'>" + data[i].nomeFicheiro + "</a></td>" +
                                "<td><i class='fas fa-check'></i></td>" +  // Quando o PDF esta disponivel
                                "</tr>";
                        })
                        .catch(error => {
                            return "<tr>" +
                                "<td>" + data[i].id + "</td>" +
                                "<td>" + data[i].referenciaDocumento + "</td>" +
                                "<td>" + data[i].pastaId + "</td>" +
                                "<td>" + data[i].entidadeEmissora + "</td>" +
                                "<td>" + data[i].nomeFicheiro + "</td>" +
                                "<td><i class='fas fa-times'></i></td>" +  // Quando o PDF nao esta disponivel
                                "</tr>";
                        });

                    fetchPromises.push(fetchPromise);
                }

                Promise.all(fetchPromises)
                    .then(rows => {
                        tableHtml += rows.join('') +
                            "</tbody>" +
                            "</table>";

                        if ($.fn.dataTable.isDataTable('#tblgetAPI')) {
                            $('#tblgetAPI').DataTable().destroy();
                        }

                        $('#tblgetAPI').html(tableHtml);

                        $('#tblgetAPI').DataTable();
                    });
            } else {
                if ($.fn.dataTable.isDataTable('#tblgetAPI')) {
                    var table = $('#tblgetAPI').DataTable();
                    table.clear().draw();
                }
                $('.content').show();
                $('.box-body').show();
                $('#tblgetAPI').show();
                $('#tblgetAPI').empty();

                $('#tblgetAPI').html("<p style='color: #888; font-size: 16px; text-align: center;' class='align-content-center'>Nenhum registo encontrado.</p>");

                alerta("Nenhum registo encontrado!", "Tente Novamente!", "error");
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Request failed: " + error.message);
        });
}

function setID(ID) {
    IDDoc = ID;
    console.log(IDDoc);
}

function setFavorito() {
    if (IDDoc) {

        Docs.push(IDDoc);
        console.log(Docs);

        sessionStorage.setItem("IDDocumentos", JSON.stringify(Docs));
        alerta("Documento adicionado aos favoritos!", "Sucesso!", "success");
    } else {
        console.error("O IDDoc não tem valor");
    }
}

function loadPDF(pdfUrl) {
    var iframe = document.getElementById('pdf-iframe');
    var pdfVisualizer = document.getElementById('pdf-visualizer');
    if (pdfUrl) {
        iframe.src = pdfUrl;
        pdfVisualizer.style.display = 'block';
    } else {
        pdfVisualizer.style.display = 'none';
    }
}

//Get API para os Livros
function getLivro() {
    var letraLivro = document.getElementById('select2').value;
    var numeroLivro = document.getElementById('select3').value;
    var folhaLivro = document.getElementById('select4').value;
    var numeroAto = document.getElementById('input1').value;
    var verso = document.getElementById('select5').value;
    var inputDateStart = document.getElementById('inputDateStart').value;

    var url = 'http://localhost:5230/api/livro/search?';

    if (letraLivro && letraLivro !== "Selecionar uma opção") {
        url += 'Letra=' + letraLivro + '&';
    }
    if (numeroLivro && numeroLivro !== "Selecionar uma opção") {
        url += 'Numero=' + numeroLivro + '&';
    }
    if (folhaLivro && folhaLivro !== "Selecionar uma opção") {
        url += 'Folha=' + folhaLivro + '&';
    }
    if (numeroAto && numeroAto !== "Selecionar uma opção") {
        url += 'NumeroAto=' + numeroAto + '&';
    }
    if (verso && verso !== "Selecionar uma opção") {
        verso = verso === 'Sim' ? true : false;
        url += 'Verso=' + verso + '&';
    }
    if (inputDateStart) {
        url += 'CriadoEm=' + inputDateStart + '&';
    }


    url = url.endsWith('&') ? url.slice(0, -1) : url;
    console.log(url);

    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                $('.content').show();
                $('.box-body').show();
                $('#tblgetAPI').show();
                $('#tblgetAPI').empty();

                let tableHtml = "<table id='tblgetAPI' class='table'>";
                tableHtml += "<thead>";
                tableHtml += "<tr>";
                tableHtml += "<th class='text-center'>ID do Livro</th>";
                tableHtml += "<th class='text-center'>Letra do Livro</th>";
                tableHtml += "<th class='text-center'>Número do Livro</th>";
                tableHtml += "<th class='text-center'>Folha do Livro</th>";
                tableHtml += "<th class='text-center'>Verso</th>";
                tableHtml += "<th class='text-center'>ID do Documento</th>";
                tableHtml += "<th class='text-center'>Número do Ato</th>";
                tableHtml += "<th>PDF Disponivel</th>";
                tableHtml += "</tr>";
                tableHtml += "</thead>";
                tableHtml += "<tbody>";

                let fetchPromises = [];

                for (let i = 0; i < data.length; i++) {
                    let pdfUrl = '/indexis_v1/api/Base_Dados/pdfs/DocumentoId' + data[i].documentoID + '.pdf';

                    let fetchPromise = fetch(pdfUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('PDF não disponivel!');
                            }
                            return response.url;
                        })
                        .then(pdfUrl => {
                            return "<tr onclick='loadPDF(\"" + pdfUrl + "\")'>" +  // Toda a linha é clicavel para abrir o PDF
                                "<td>" + data[i].id + "</td>" +
                                "<td>" + data[i].letra + "</td>" +
                                "<td>" + data[i].numero + "</td>" +
                                "<td>" + (data[i].folha ? data[i].folha : '--') + "</td>" +
                                "<td>" + (data[i].verso ? "Sim" : "Não") + "</td>" +
                                "<td><a href='" + pdfUrl + "' target='_blank'>" + data[i].documentoID + "</a></td>" +
                                "<td>" + (data[i].numeroAto ? data[i].numeroAto : '--') + "</td>" +
                                "<td><i class='fas fa-check'></i></td>" +  // Quando o PDF esta disponivel
                                "</tr>";
                        })
                        .catch(error => {
                            return "<tr>" +
                                "<td>" + data[i].id + "</td>" +
                                "<td>" + data[i].letra + "</td>" +
                                "<td>" + data[i].numero + "</td>" +
                                "<td>" + (data[i].folha ? data[i].folha : '--') + "</td>" +
                                "<td>" + (data[i].verso ? "Sim" : "Não") + "</td>" +
                                "<td>" + data[i].documentoID + "</td>" +
                                "<td>" + (data[i].numeroAto ? data[i].numeroAto : '--') + "</td>" +
                                "<td><i class='fas fa-times'></i></td>" +  // Quando o PDF nao esta disponivel
                                "</tr>";
                        });

                    fetchPromises.push(fetchPromise);
                }

                Promise.all(fetchPromises)
                    .then(rows => {
                        tableHtml += rows.join('') +
                            "</tbody>" +
                            "</table>";

                        if ($.fn.dataTable.isDataTable('#tblgetAPI')) {
                            $('#tblgetAPI').DataTable().destroy();
                        }
                        $('#tblgetAPI').html(tableHtml);

                        $('#tblgetAPI').DataTable();
                    });


            } else {
                if ($.fn.dataTable.isDataTable('#tblgetAPI')) {
                    var table = $('#tblgetAPI').DataTable();
                    table.clear().draw();
                }
                $('.content').show();
                $('.box-body').show();
                $('#tblgetAPI').show();
                $('#tblgetAPI').empty();

                $('#tblgetAPI').html("<p style='color: #888; font-size: 16px; text-align: center;' class='align-content-center'>Nenhum registo encontrado.</p>");

                alerta("Nenhum registo encontrado!", "Tente Novamente!", "error");
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Request failed: " + error.message);
        });
}

function getDoc_e_Livro() {
    var idDocumento = document.getElementById('input2').value;
    var referenciaDocumento = document.getElementById('input3').value;
    var idPasta = document.getElementById('input4').value;
    var inputDateEnd = document.getElementById('inputDateEnd').value;
    var letraLivro = document.getElementById('select2').value;
    var numeroLivro = document.getElementById('select3').value;
    var folhaLivro = document.getElementById('select4').value;
    var numeroAto = document.getElementById('input1').value;
    var verso = document.getElementById('select5').value;
    var inputDateStart = document.getElementById('inputDateStart').value;
    var inputConservatoria = document.getElementById('inputConservatoria').value;

    var url = 'http://localhost:5230/api/combinedsearch?';

    //Documento
    if (idDocumento) {
        url += 'DocumentoId_doc=' + idDocumento + '&';
    }
    if (referenciaDocumento) {
        url += 'ReferenciaDocumento=' + referenciaDocumento + '&';
    }
    if (idPasta) {
        url += 'PastaId=' + idPasta + '&';
    }
    if (inputDateEnd) {
        url += 'ExpiraEm=' + inputDateEnd + '&';
    }
    if (inputConservatoria && inputConservatoria !== "Selecionar uma opção") {
        url += 'EntidadeEmissora=' + inputConservatoria + '&';
    }
    //Livro
    if (letraLivro && letraLivro !== "Selecionar uma opção") {
        url += 'Letra=' + letraLivro + '&';
    }
    if (numeroLivro && numeroLivro !== "Selecionar uma opção") {
        url += 'Numero=' + numeroLivro + '&';
    }
    if (folhaLivro && folhaLivro !== "Selecionar uma opção") {
        url += 'Folha=' + folhaLivro + '&';
    }
    if (numeroAto) {
        url += 'NumeroAto=' + numeroAto + '&';
    }
    if (verso && verso !== "Selecionar uma opção") {
        verso = verso === 'Sim' ? true : false;
        url += 'Verso=' + verso + '&';
    }
    if (inputDateStart) {
        url += 'CriadoEm=' + inputDateStart + '&';
    }

    url = url.endsWith('&') ? url.slice(0, -1) : url;

    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                $('.content').show();
                $('.box-body').show();
                $('#tblgetAPI').show();
                $('#tblgetAPI').empty();

                let tableHtml = "<table id='tblgetAPI' class='table'>";
                tableHtml += "<thead>";
                tableHtml += "<tr>";
                //Livro
                tableHtml += "<th class='text-center'>ID do Livro</th>";
                tableHtml += "<th class='text-center'>Letra do Livro</th>";
                tableHtml += "<th class='text-center'>Número do Livro</th>";
                tableHtml += "<th class='text-center'>Folha do Livro</th>";
                tableHtml += "<th class='text-center'>Verso</th>";
                tableHtml += "<th class='text-center'>Número do Ato</th>";
                //Documento
                tableHtml += "<th class='text-center'>ID do Documento</th>";
                tableHtml += "<th>Referência do Documento</th>";
                tableHtml += "<th>ID Pasta do Documento</th>";
                tableHtml += "<th>Conservatória</th>";
                tableHtml += "<th>Nome do Ficheiro</th>";
                //Geral
                tableHtml += "<th>PDF Disponivel</th>";
                tableHtml += "</tr>";
                tableHtml += "</thead>";
                tableHtml += "<tbody>";

                let combinedData = data.data.map(item => ({ livro: item.livro, documento: item.documento }));

                let fetchPromises = [];

                for (let i = 0; i < combinedData.length; i++) {
                    let pdfUrl = '/indexis_v1/api/Base_Dados/pdfs/DocumentoId' + combinedData[i].documento.id + '.pdf';

                    let fetchPromise = fetch(pdfUrl)

                        .then(response => {
                            if (!response.ok) {
                                throw new Error('PDF não disponivel!');
                            }
                            return response.url;
                        })
                        .then(pdfUrl => {
                            return "<tr onclick='loadPDF(\"" + pdfUrl + "\")'>" +  // Toda a linha é clicavel para abrir o PDF
                                "<td class='centered'>" + combinedData[i].livro.id + "</td>" +
                                "<td class='centered'>" + combinedData[i].livro.letra + "</td>" +
                                "<td class='centered'>" + combinedData[i].livro.numero + "</td>" +
                                "<td class='centered'>" + (combinedData[i].livro.folha ? combinedData[i].livro.folha : '--') + "</td>" +
                                "<td class='centered'>" + (combinedData[i].livro.verso ? "Sim" : "Não") + "</td>" +
                                "<td class='centered'>" + (combinedData[i].livro.numeroAto ? combinedData[i].livro.numeroAto : '--') + "</td>" +
                                "<td class='centered'>" + combinedData[i].documento.id + "</td>" +
                                "<td class='centered'>" + combinedData[i].documento.referenciaDocumento + "</td>" +
                                "<td class='centered'>" + combinedData[i].documento.pastaId + "</td>" +
                                "<td class='centered'>" + combinedData[i].documento.entidadeEmissora + "</td>" +
                                "<td class='centered'>" + combinedData[i].documento.nomeFicheiro + "</td>" +
                                "<td class='centered'><i class='fas fa-times fa-lg'></i></td>" + // Quando o PDF nao esta disponivel
                                "</tr>";
                        })
                        .catch(error => {
                            return "<tr>" +
                                "<td class='centered'>" + combinedData[i].livro.id + "</td>" +
                                "<td class='centered'>" + combinedData[i].livro.letra + "</td>" +
                                "<td class='centered'>" + combinedData[i].livro.numero + "</td>" +
                                "<td class='centered'>" + (combinedData[i].livro.folha ? combinedData[i].livro.folha : '--') + "</td>" +
                                "<td class='centered'>" + (combinedData[i].livro.verso ? "Sim" : "Não") + "</td>" +
                                "<td class='centered'>" + (combinedData[i].livro.numeroAto ? combinedData[i].livro.numeroAto : '--') + "</td>" +
                                "<td class='centered'>" + combinedData[i].documento.id + "</td>" +
                                "<td class='centered'>" + combinedData[i].documento.referenciaDocumento + "</td>" +
                                "<td class='centered'>" + combinedData[i].documento.pastaId + "</td>" +
                                "<td class='centered'>" + combinedData[i].documento.entidadeEmissora + "</td>" +
                                "<td class='centered'>" + combinedData[i].documento.nomeFicheiro + "</td>" +
                                "<td class='centered'><i class='fas fa-times fa-lg'></i></td>" + // Quando o PDF nao esta disponivel
                                "</tr>";
                        });

                    fetchPromises.push(fetchPromise);
                }

                Promise.all(fetchPromises)
                    .then(rows => {
                        tableHtml += rows.join('') +
                            "</tbody>" +
                            "</table>";

                        if ($.fn.dataTable.isDataTable('#tblgetAPI')) {
                            $('#tblgetAPI').DataTable().destroy();
                        }

                        $('#tblgetAPI').html(tableHtml);


                        setTimeout(function () {
                            $('#tblgetAPI').DataTable();
                        }, 0);
                    })
                    .catch(error => console.error('Error:', error));


            } else {
                if ($.fn.dataTable.isDataTable('#tblgetAPI')) {
                    var table = $('#tblgetAPI').DataTable();
                    table.clear().draw();
                }
                $('.content').show();
                $('.box-body').show();
                $('#tblgetAPI').show();
                $('#tblgetAPI').empty();

                $('#tblgetAPI').html("<p style='color: #888; font-size: 16px; text-align: center;' class='align-content-center'>Nenhum registo encontrado.</p>");

                alerta("Nenhum registo encontrado!", "Tente Novamente!", "error");
            }
        })
        .catch(error => console.error('Error:', error));
}