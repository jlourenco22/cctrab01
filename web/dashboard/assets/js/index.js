function logout() {
    let dados = new FormData();
    dados.append("op", 2);

    $.ajax({
        url: "/indexis_v1/LoginERegistos/assets/controller/controllerLogin.php",
        method: "POST",
        data: dados,
        dataType: "html",
        cache: false,
        contentType: false,
        processData: false
    })

        .done(function (msg) {
            alerta("Sessão Encerrada", msg, "success");

            setTimeout(function () {
                window.location.href = "/indexis_v1/LoginERegistos/sign-in.html";
            }, 2000);

        })

        .fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });

}




function alerta(titulo, msg, icon) {
    let imageUrl = "";

    if (icon === "success") {
        // Set the image URL for success (adjust the path as needed)
        imageUrl = "/indexis_v1/LoginERegistos/assets/img/indexgifff.gif";
    } else if (icon === "error") {
        // Set the image URL for error (adjust the path as needed)
        imageUrl = "/indexis_v1/LoginERegistos/assets/img/indexgifff.gif";
    }
    Swal.fire({
        position: 'center',
        title: titulo,
        text: msg,
        // icon: icon,
        showConfirmButton: true,
        timer: 2500,
        timerProgressBar: true,
        imageUrl: imageUrl,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
    });
}


(function () {

    new PureCounter();

})()


