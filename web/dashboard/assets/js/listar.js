var currentId;
var currentId_Edita;
var currentId_Edita_livro;

function openDeleteModal(id) {
    currentId = id;
    var myModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    myModal.show();
}

//Abre o modal e preenche os campos com os dados do documento
function openEditaModal(ids) {
    var idArray = ids.split('-');
    currentId_Edita = idArray[0];
    currentId_Edita_livro = idArray[1];
    var myModal = new bootstrap.Modal(document.getElementById('editaModal'));

    fetch('http://localhost:5230/api/combinedsearch?DocumentoId_doc=' + idArray[0])
        .then(response => response.json())
        .then(data => {
            console.log(data);

            var item = data.data[0];

            // Formatar a data
            var date_1 = new Date(item.livro.criadoEm);
            var formattedDate_1 = date_1.getFullYear() + '-' + ('0' + (date_1.getMonth() + 1)).slice(-2) + '-' + ('0' + date_1.getDate()).slice(-2);

            var date_2 = new Date(item.livro.expiraEm);
            var formattedDate_2 = date_1.getFullYear() + '-' + ('0' + (date_2.getMonth() + 1)).slice(-2) + '-' + ('0' + date_2.getDate()).slice(-2);

            // Formatar boolean to Sim/Não
            var verso = item.livro.verso ? 'Sim' : 'Não';

            document.getElementById('select2').value = item.livro.letra;
            document.getElementById('select3').value = item.livro.numero;
            document.getElementById('select4').value = item.livro.folha;
            document.getElementById('input1').value = item.livro.numeroAto;
            document.getElementById('select5').value = verso;
            document.getElementById('input2').value = item.documento.id;
            document.getElementById('input3').value = item.documento.referenciaDocumento;
            document.getElementById('input4').value = item.documento.pastaId;
            document.getElementById('inputDateStart').value = formattedDate_1;
            document.getElementById('inputConservatoria').value = item.documento.entidadeEmissora;
            document.getElementById('inputDateEnd').value = formattedDate_2;
            myModal.show();

        })
        .catch(error => console.error('Error:', error));

}


function getDoc_e_Livro() {
    let nrListagem = document.getElementById('inputEntradas').value;

    var url = 'http://localhost:5230/api/combinedsearch';

    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                $('.content').show();
                $('.box-body').show();
                $('#tabelaListagem').show();
                $('#tabelaListagem').empty();

                let tableHtml = "<table id='tabelaListagem' class='table'>";
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
                //Geral/Botoes
                tableHtml += "<th>Eliminar</th>";
                tableHtml += "<th>Editar</th>";
                tableHtml += "<th>PDF Disponivel</th>";
                tableHtml += "</tr>";
                tableHtml += "</thead>";
                tableHtml += "<tbody>";

                let combinedData = data.data.map(item => ({ livro: item.livro, documento: item.documento }));
                let fetchPromises = [];

                for (let i = 0; i < combinedData.length; i++) {
                    if (i >= nrListagem) {
                        break;
                    }
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
                                "<td class='centered'><button class='delete-btn' data-doc-id='" + combinedData[i].documento.id + "' onclick=openDeleteModal('" + combinedData[i].documento.id + "')><i class='fas fa-trash fa-lg'></i></button></td>" +
                                "<td class='centered'><button class='delete-btn' data-doc-id='" + combinedData[i].documento.id + "' onclick=openEditaModal('" + combinedData[i].documento.id + "-" + combinedData[i].livro.id + "')><i class='fas fa-edit fa-lg'></i></button></td>" +
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
                                "<td class='centered'><button class='delete-btn' data-doc-id='" + combinedData[i].documento.id + "' onclick=openDeleteModal('" + combinedData[i].documento.id + "')><i class='fas fa-trash fa-lg'></i></button></td>" +
                                "<td class='centered'><button class='delete-btn' data-doc-id='" + combinedData[i].documento.id + "' onclick=openEditaModal('" + combinedData[i].documento.id + "-" + combinedData[i].livro.id + "')><i class='fas fa-edit fa-lg'></i></button></td>" +
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

                        $('#tabelaListagem').html(tableHtml);

                        if ($.fn.dataTable.isDataTable('#tabelaListagem')) {
                            $('#tabelaListagem').DataTable().destroy();
                        }
                        $('#tabelaListagem').DataTable();
                    })
                    .catch(error => console.error('Error:', error));


            } else {
                var table = $('#tabelaListagem').DataTable();
                table.clear().draw();
                $('.content').show();
                $('.box-body').show();
                $('#tabelaListagem').show();
                $('#tabelaListagem').empty();

                $('#tabelaListagem').html("<p style='color: #888; font-size: 16px; text-align: center;' class='align-content-center'>Nenhum registo encontrado.</p>");

                alerta("Nenhum registo encontrado!", "Tente Novamente!", "error");
            }
        })
        .catch(error => console.error('Error:', error));
}


function editarDocumento() {

    function documentId() {
        var url = 'http://localhost:5230/api/updateDoc_Livro/documento/' + currentId_Edita;

        var changes = [];

        //Chamar os campos do formulario

        var input2 = document.getElementById('input2');
        var input3 = document.getElementById('input3');
        var input4 = document.getElementById('input4');
        var inputConservatoria = document.getElementById('inputConservatoria');
        var inputDateEnd = document.getElementById('inputDateEnd');

        //Verificar se os campos estao preenchidos

        if (input2 && input2.value) {
            changes.push({ "op": "replace", "path": "/id", "value": input2.value });
        }
        if (input3 && input3.value) {
            changes.push({ "op": "replace", "path": "/referenciaDocumento", "value": input3.value });
        }
        if (input4 && input4.value) {
            changes.push({ "op": "replace", "path": "/pastaId", "value": input4.value });
        }
        if (inputConservatoria && inputConservatoria.value) {
            changes.push({ "op": "replace", "path": "/entidadeEmissora", "value": inputConservatoria.value });
        }
        if (inputDateEnd && inputDateEnd.value) {
            changes.push({ "op": "replace", "path": "/expiraEm", "value": inputDateEnd.value });
        }
        return { url, changes };
    }


    function livroId() {

        var url = 'http://localhost:5230/api/updateDoc_Livro/livro/' + currentId_Edita_livro;

        var changes = [];

        var select2 = document.getElementById('select2');
        var select3 = document.getElementById('select3');
        var select4 = document.getElementById('select4');
        var input1 = document.getElementById('input1');
        var select5 = document.getElementById('select5');
        var inputDateStart = document.getElementById('inputDateStart');

        if (inputDateStart && inputDateStart.value) {
            changes.push({ "op": "replace", "path": "/criadoEm", "value": inputDateStart.value });
        }
        if (select2 && select2.value) {
            changes.push({ "op": "replace", "path": "/letra", "value": select2.value });
        }
        if (select3 && select3.value) {
            changes.push({ "op": "replace", "path": "/numero", "value": select3.value });
        }
        if (select4 && select4.value) {
            changes.push({ "op": "replace", "path": "/folha", "value": select4.value });
        }
        if (input1 && input1.value) {
            changes.push({ "op": "replace", "path": "/numeroAto", "value": input1.value });
        }
        if (select5 && select5.value) {
            changes.push({ "op": "replace", "path": "/verso", "value": select5.value });
        }
        return { url, changes };
    }

    var documentData = documentId();
    var livroData = livroId();

    var patchDoc1 = JSON.stringify(documentData.changes);
    var patchDoc2 = JSON.stringify(livroData.changes);

    fetch(documentData.url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: patchDoc1,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating Documento');
            }
            alerta("Documento atualizado com sucesso!", "Sucesso!", "success");
            getDoc_e_Livro();
        })
        .catch(error => {
            console.error('Erro:', error);
            alerta("Erro ao atualizar documento! Tentando atualizar Livro...", "Tente Novamente!", "error");

            fetch(livroData.url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: patchDoc2,
            })
                .then(response => {
                    if (response.ok) {
                        alerta("Livro atualizado com sucesso!", "Sucesso!", "success");
                        getDoc_e_Livro();
                    } else {
                        throw new Error('Error updating Livro');
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alerta("Erro ao atualizar Livro!", "Tente Novamente!", "error");
                });
        });
}



function eliminarLivro() {
    var url = 'http://localhost:5230/api/deleteDoc_Livro/livro/' + currentId;
    fetch(url, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                alerta("Documento eliminado com sucesso!", "Sucesso!", "success");
                getDoc_e_Livro();
                var myModalEl = document.getElementById('deleteModal');
                var modal = bootstrap.Modal.getInstance(myModalEl);
                modal.hide();

            } else {
                console.error('Erro:', response.statusText);
                alerta("Erro ao eliminar documento!", "Tente Novamente!", "error");
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alerta("Erro ao eliminar documento!", "Tente Novamente!", "error");
        });
}

function eliminarDocumento() {
    var url = 'http://localhost:5230/api/deleteDoc_Livro/documento/' + currentId;

    fetch(url, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                alerta("Documento eliminado com sucesso!", "Sucesso!", "success");
                getDoc_e_Livro();
                var myModalEl = document.getElementById('deleteModal');
                var modal = bootstrap.Modal.getInstance(myModalEl);
                modal.hide();

            } else {
                console.error('Erro:', response.statusText);
                alerta("Erro ao eliminar documento!", "Tente Novamente!", "error");
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alerta("Erro ao eliminar documento!", "Tente Novamente!", "error");
        });
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



