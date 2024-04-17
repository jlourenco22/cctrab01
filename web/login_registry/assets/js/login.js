function login() {
    let dados = new FormData();
    dados.append("op", 1);

    $.ajax({
        url: "/login_registry/assets/controller/controllerLogin.php",
        method: "POST",
        data: dados,
        dataType: "html",
        cache: false,
        contentType: false,
        processData: false
    })
        .done(function (msg) {

            alerta("Bem-vindo", msg, "success");

            setTimeout(function () {
                window.location.href = "/dashboard/main/dashboard.html";
            }, 2500);
            session_start();
        })

        .fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
}



function alerta(titulo, msg, icon) {
    let imageUrl = "";

    if (icon === "success") {
        // Set the image URL for success (adjust the path as needed)
        imageUrl = "/login_registry/assets/img/indexgifff.gif";
    } else if (icon === "error") {
        // Set the image URL for error (adjust the path as needed)
        imageUrl = "/login_registry/LoginERegistos/assets/img/indexgifff.gif";
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


$(function () {

});