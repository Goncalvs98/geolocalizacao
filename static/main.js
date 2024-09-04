let nav = null; // Variável para armazenar o objeto de navegação

function pegarPos(){
    // Verifica se é a primeira execução da função e inicializa o navegador se necessário
    if(nav == null) {
        nav = window.navigator; // Inicializa o objeto de navegação
    }

    let geoloc = nav.geolocation; // Obtém o objeto de geolocalização

    // Verifica se o objeto de geolocalização está disponível
    if(geoloc != null){
        const options = {
            enableHighAccuracy: true,  // Usa a maior precisão possível (GPS, se disponível)
            timeout: 10000,            // Tempo máximo de 10 segundos para obter a localização
            maximumAge: 300            // Usa posição em cache por 300 milissegundos
        };
        // Solicita a posição atual; chama 'retornarPosicao' em sucesso ou 'retornarFalha' em caso de erro
        geoloc.getCurrentPosition(retornarPosicao, retornarFalha, options);
    }

    // Função chamada ao obter a posição com sucesso
    function retornarPosicao(posicao){
        // Obtém a latitude e a longitude das coordenadas
        const latitude = posicao.coords.latitude;
        const longitude = posicao.coords.longitude;
        const endereco = document.getElementById("endereco");
        window.location.href = `/map?latitude=${latitude}&longitude=${longitude}&endereco=${endereco.value}`;
    }

    // Função chamada em caso de falha ao obter a posição
    function retornarFalha(erro){
        let mensagem = ""; // Inicializa uma variável para a mensagem de erro

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
        // Exibe a mensagem de erro no console
        console.log(mensagem);
    }
}
