<?php

require_once 'connection.php';

class Edita
{


    function editaCliente($id)
    {
        global $conn;
        $msg = "";
        $row = "";

        $sql = "SELECT * FROM cliente WHERE NIFCLIENTE =" . $id;
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // output data of each row
            $row = $result->fetch_assoc();
        } else {
            $msg = "Error: " . $sql . "<br>" . $conn->error;
        }

        $conn->close();

        return json_encode(array(
            $row,
            "msg" => $msg
        ));
    }

    function guardaEditaCliente($id, $editnomeCliente, $editNIFCliente, $editemailCliente, $editmoradaCliente, $editcodigopostalCliente, $edittelemovelCliente, $editNISSCliente, $editultimonomeCliente, $editdescricaoCliente, $editdatanasciementoCliente, $fotocliente)
    {
        global $conn;
        $msg = "";
        $flag = true;
        $flag2 = true;
        $sql = "";
        $resp = "";
        $resp2 = "";

        // // Verifica se o update é valido!
        // $resp2 = $this->updateValido($id, $editnomeCliente, $editNIFCliente, $editemailCliente, $editpswCliente, $editmoradaCliente, $editcodigopostalCliente, $edittelemovelCliente, $editNISSCliente);
        // $resp2 = json_decode($resp2, TRUE);

        // if ($resp2['flag']) {

        // Check if NIFCLIENTE has changed
        $sql = "SELECT NIFCLIENTE FROM cliente WHERE NIFCLIENTE = $id";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            $destroySession = false;

            // Verifica se o NIF foi mudado para mandar sesion abaixo!
            if ($row["NIFCLIENTE"] != $editNIFCliente) {
                $destroySession = true;
            }

            $resp = $this->uploads($fotocliente, $id);
            $resp = json_decode($resp, TRUE);

            if ($resp['flag']) {
                $sql = "UPDATE cliente SET NIFCLIENTE = '" . $editNIFCliente . "', Nome = '" . $editnomeCliente . "', Email = '" . $editemailCliente . "', Morada = '" . $editmoradaCliente . "', Codigo_Postal = '" . $editcodigopostalCliente . "', Telemovel = '" . $edittelemovelCliente . "', NISS = '" . $editNISSCliente . "', DataNascimento = '" . $editdatanasciementoCliente . "', Ultimonome = '" . $editultimonomeCliente . "', Descricao = '" . $editdescricaoCliente . "', Foto_Cliente = '" . $resp['target'] . "' WHERE NIFCLIENTE =" . $id;
            } else {
                $sql = "UPDATE cliente SET NIFCLIENTE = '" . $editNIFCliente . "', Nome = '" . $editnomeCliente . "', Email = '" . $editemailCliente . "', Morada = '" . $editmoradaCliente . "', Codigo_Postal = '" . $editcodigopostalCliente . "', NISS = '" . $editNISSCliente . "', Telemovel = '" . $edittelemovelCliente . "', DataNascimento = '" . $editdatanasciementoCliente . "', Ultimonome = '" . $editultimonomeCliente . "', Descricao = '" . $editdescricaoCliente . "' WHERE NIFCLIENTE =" . $id;
            }

            if ($conn->query($sql) === TRUE) {
                $msg = "Dados Editados com Sucesso";
                $msg2 = "";

                if ($destroySession) {
                    // Bomba atomica
                    sleep(2); // atrasa a execução! CUIDADO! 
                    session_start();
                    session_destroy();
                    $flag2 = false;
                    $msg2 = "Vai ser redirecionado com Sucesso";
                }
            } else {
                $flag = false;
                $msg = "Error: " . $sql . "<br>" . $conn->error;
            }
        } else {
            $flag = false;
            $msg = "Error: " . $sql . "<br>" . $conn->error;
        }
        // } else {
        //     $flag = false;
        //     $msg = "Dados Duplicados!";
        //     // $msg = $resp2['msg'];
        // }

        $resp = json_encode(array(
            "flag" => $flag,
            "msg" => $msg,
            "flag2" => $flag2,
            "msg2" => $msg2
        ));

        $conn->close();

        return $resp;
    }
    function guardaEditaCliente_pw_edition($id, $editpswCliente)
    {
        global $conn;
        $msg = "";
        $flag = true;
        $flag2 = true;
        $sql = "";
        $resp = "";
        $resp2 = "";



        $sql = "UPDATE cliente SET  pw = '" . md5($editpswCliente) . "' WHERE NIFCLIENTE =" . $id;


        if ($conn->query($sql) === TRUE) {
            $msg = "Dados Editados com Sucesso";
            $msg2 = "";
        } else {
            $flag = false;
            $msg = "Error: " . $sql . "<br>" . $conn->error;
        }


        $resp = json_encode(array(
            "flag" => $flag,
            "msg" => $msg,
            "flag2" => $flag2,
            "msg2" => $msg2
        ));

        $conn->close();

        return $resp;
    }


    // function updateValido($id, $editnomeCliente, $editNIFCliente, $editemailCliente, $editpswCliente, $editmoradaCliente, $editcodigopostalCliente, $edittelemovelCliente, $editNISSCliente) {
    //     global $conn;
    //     $msg = "";
    //     $flag = true;

    //     $sql = "SELECT COUNT(*) as count FROM cliente WHERE NIFCLIENTE = '$editNIFCliente' AND NIFCLIENTE != $id";
    //     $result1 = $conn->query($sql);

    //     if ($result1->num_rows > 0) {
    //         // output data of each row
    //             $flag = false;
    //         }


    //     // Check other conditions and update $flag
    //     if ($flag) {
    //         $sql = "SELECT COUNT(*) as count FROM cliente WHERE NISS = '$editNISSCliente' AND NIFCLIENTE != $id";
    //         $result2 = $conn->query($sql);

    //         if ($result2->num_rows > 0) {
    //             // output data of each row
    //                 $flag = false;
    //             }
    //     }

    //     if ($flag) {
    //         $sql = "SELECT COUNT(*) as count FROM cliente WHERE Telemovel = '$edittelemovelCliente' AND NIFCLIENTE != $id";
    //         $result3 = $conn->query($sql);

    //         if ($result3->num_rows > 0) {
    //             // output data of each row
    //                 $flag = false;
    //             }
    //     }

    //     if ($flag) {
    //         $sql = "SELECT COUNT(*) as count FROM cliente WHERE Email = '$editemailCliente' AND NIFCLIENTE != $id";
    //         $result4 = $conn->query($sql);

    //         if ($result4->num_rows > 0) {
    //             // output data of each row
    //                 $flag = false;
    //             }
    //     }

    //     return json_encode(array("flag" => $flag));
    // }



    function uploads($fotocliente, $id)
    {
        $dir = "../fotos_cliente/foto" . $id . "/";
        $dir1 = "../assets/fotos_cliente/foto" . $id . "/";
        $flag = false;
        $targetBD = "";

        if (!is_dir($dir)) {
            if (!mkdir($dir, 0777, true)) {
                error_log("Erro não é possível criar o diretório");
            }
        }

        if (array_key_exists('imageUpload', $fotocliente)) {
            //tem de ser igual ao id no JS!! Importante!
            if (is_array($fotocliente)) {
                if (is_uploaded_file($fotocliente['imageUpload']['tmp_name'])) {
                    $fonte = $fotocliente['imageUpload']['tmp_name'];
                    $ficheiro = $fotocliente['imageUpload']['name'];
                    $end = explode(".", $ficheiro);
                    $extensao = end($end);

                    $newName = "foto" . date("YmdHis") . "." . $extensao;

                    $target = $dir . $newName;
                    $targetBD = $dir1 . $newName;

                    // Check for errors during file upload
                    if (move_uploaded_file($fonte, $target)) {
                        $flag = true;
                    } else {
                        // Log the error
                        error_log("Error moving uploaded file: " . error_get_last()['message']);
                    }
                }
            }
        }

        return json_encode(array(
            "flag" => $flag,
            "target" => $targetBD
        ));
    }
    function removeCliente($id)
    {
        global $conn;
        $msg = "";
        $flag = true;

        $sql = "DELETE FROM cliente WHERE NIFCLIENTE = " . $id;

        if ($conn->query($sql) === TRUE) {
            $msg = "Removido com Sucesso";
        } else {
            $flag = false;
            $msg = "Error: " . $sql . "<br>" . $conn->error;
        }

        $resp = json_encode(array(
            "flag" => $flag,
            "msg" => $msg
        ));

        $conn->close();

        return ($resp);
    }

    function listaServicos($id)
    {
        global $conn;
        $cards = array();

        $sql = "SELECT 
        h.IDHistoricoPedido,
        h.DataConclusao,
        h.NIFCliente,
        pro.Nome AS NomeProfissional,
        pro.Ultimonome AS UltimoNomeProfissional,
        h.IDConciliacaoDoServico,
        h.IDTipoEstado,
        tpro.Descricao AS DescricaoTipoEspecialidade,
        h.IDAvaliacao,
        h.IDServicoRealizado,
        h.IDPagamentoRealizado
        FROM 
            historicodepedidos h
        LEFT JOIN 
            pagamentorealizado pr ON h.IDPagamentoRealizado = pr.IDPagamentoRealizado
        LEFT JOIN 
            servicorealizado s ON pr.IDServicoRealizado = s.IDServicoRealizado
        LEFT JOIN 
            gestaopagamentos gp ON s.IDPagamento = gp.IDPagamento
        LEFT JOIN 
            pedidoaceite pa ON gp.IDpedidoaceite = pa.IDPedidoAceite
        LEFT JOIN 
            pedidodeservico ps ON pa.IDPedido = ps.IDPedido
        LEFT JOIN 
            conciliacaodeservico cs ON ps.IDConciliacaoDoServico = cs.IDConciliacaoDoServico
        LEFT JOIN 
            cliente cli ON cs.NIFCliente = cli.NIFCLIENTE
        LEFT JOIN 
            profissionaldesaude pro ON cs.NIFProfissionalDeSaude = pro.NIF
        LEFT JOIN 
            bolsadeofertasmedicas bol ON cs.ID_BoM = bol.IDBoM
        LEFT JOIN 
            tipoprofissionaldesaude tpro ON bol.Especialidade = tpro.IDtipoProfissionalDeSaude
        WHERE 
            h.NIFCliente = '$id'";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $cards[] = $row;
            }
        }

        $conn->close();

        return json_encode($cards);
    }
    function listaPagamentos($id)
    {
        global $conn;
        $cards = array();

        $sql = "SELECT DISTINCT 
        pr.*,
        tp.Descricao AS DescricaoPagamento,
        tpro.Descricao AS DescricaoTipoEspecialidade,
        pro.Nome AS NomeProfissional,
        pro.Ultimonome AS UltimoNomeProfissional,
        cli.Nome AS PrimeiroNomeCliente,
        cli.Ultimonome AS UltimoNomeCliente,
		cli.Morada AS MoradaCliente,
		cli.Codigo_Postal AS CodigoPostalCliente,
        cli.Telemovel AS TelemovelCliente,
		cli.Email AS EmailCliente,
        pr.Descricao AS SeervicoRealizado,
		pr.IDPagamentoRealizado AS id,
        gp.ValorPagamentoTotal AS ValoraPagar,
        bol.Preco_Servico AS PrecoHora,
        tpserv.Descricao AS DescricaoTipoServico,
        
        TIME_TO_SEC(s.Duracao_Servico) AS TempoServico


            FROM 
                historicodepedidos h
            LEFT JOIN 
                pagamentorealizado pr ON h.IDPagamentoRealizado = pr.IDPagamentoRealizado
            LEFT JOIN 
                servicorealizado s ON pr.IDServicoRealizado = s.IDServicoRealizado
            LEFT JOIN 
                gestaopagamentos gp ON s.IDPagamento = gp.IDPagamento
             JOIN 
                tipopagamento tp ON gp.IDtipopagamento = tp.IDtipopagamento
            LEFT JOIN 
                pedidoaceite pa ON gp.IDpedidoaceite = pa.IDPedidoAceite
            LEFT JOIN 
                artigosservico aservico ON pa.IDartigosservico = aservico.IDPedido  
            LEFT JOIN 
                pedidodeservico ps ON aservico.IDPedido = ps.IDPedido
            LEFT JOIN 
                conciliacaodeservico cs ON ps.IDConciliacaoDoServico = cs.IDConciliacaoDoServico
            LEFT JOIN 
                cliente cli ON cs.NIFCliente = cli.NIFCLIENTE
            LEFT JOIN 
                profissionaldesaude pro ON cs.NIFProfissionalDeSaude = pro.NIF
            LEFT JOIN 
                bolsadeofertasmedicas bol ON cs.ID_BoM = bol.IDBoM
            JOIN 
                tipoprofissionaldesaude tpro ON bol.Especialidade = tpro.IDtipoProfissionalDeSaude
            JOIN 
                tipo_servico tpserv ON bol.TipoServico = tpserv.IDTipo_Servico
            WHERE 
            h.NIFCliente = '$id'";

        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $cards[] = $row;
            }
        }

        $conn->close();

        return json_encode($cards);
    }
}
