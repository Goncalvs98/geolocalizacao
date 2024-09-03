var nav = null; // Variável para armazenar o objeto de navegação

function pegarPos(){
    // Exibe uma mensagem de status inicial enquanto a posição é obtida
    document.getElementById("status").innerHTML = "Aguarde...";

    // Verifica se é a primeira execução da função e inicializa o navegador se necessário
    if(nav == null) {
        nav = window.navigator; // Inicializa o objeto de navegação
    }

    var geoloc = nav.geolocation; // Obtém o objeto de geolocalização

    // Verifica se o objeto de geolocalização está disponível
    if(geoloc != null){
        var options = {
            enableHighAccuracy: true,  // Usa a maior precisão possível (GPS, se disponível)
            timeout: 10000,            // Tempo máximo de 10 segundos para obter a localização
            maximumAge: 0              // Não usa posição em cache (força a obtenção de uma nova posição)
        };
        // Solicita a posição atual; chama 'retornarPosicao' em sucesso ou 'retornarFalha' em caso de erro
        geoloc.getCurrentPosition(retornarPosicao, retornarFalha, options);
    }

    // Função chamada ao obter a posição com sucesso
    function retornarPosicao(posicao){
        // Obtém a latitude e a longitude das coordenadas
        var latitude = posicao.coords.latitude;
        var longitude = posicao.coords.longitude;

        // Enviar os dados da localização para o backend via POST
        fetch('/salvar_localizacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sucesso:', data);
        })
        .catch((error) => {
            console.error('Erro:', error);
        });

        window.location.href = `/map?latitude=${latitude}&longitude=${longitude}`;
    }

    // Função chamada em caso de falha ao obter a posição
    function retornarFalha(erro){
        var mensagem = ""; // Inicializa uma variável para a mensagem de erro

        // Trata os diferentes tipos de erros de geolocalização
        switch(erro.code){
            case erro.PERMISSION_DENIED:
                mensagem = "Acesso à localização negado.";
                break;

            case erro.POSITION_UNAVAILABLE:
                mensagem = "A posição atual não está disponível.";
                break;

            case erro.TIMEOUT:
                mensagem = "O tempo para obter a localização esgotou.";
                break;

            default:
                mensagem = "Ocorreu um erro ao obter a localização.";
                break;
        }
        // Exibe a mensagem de erro no elemento com id 'status'
        document.getElementById("status").innerHTML = mensagem;
    }
}
