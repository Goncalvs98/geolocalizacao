from flask import Flask, render_template, request, jsonify
import folium
from geopy.geocoders import Nominatim

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/salvar_localizacao', methods=['POST'])
def salvar_localizacao():
    data = request.get_json()
    latitude = data['latitude']
    longitude = data['longitude']

    # Aqui você pode fazer o que precisar com a latitude e longitude
    # Por exemplo, salvar em um banco de dados ou processar os dados
    print(f"Latitude: {latitude}, Longitude: {longitude}")

    # Retorna uma resposta ao cliente
    return jsonify({"status": "sucesso", "latitude": latitude, "longitude": longitude})


@app.route('/map')
def map():
    # Obtenha a latitude e longitude da URL
    latitude_atual = request.args.get('latitude', type=float)
    longitude_atual = request.args.get('longitude', type=float)
    endereco = request.args.get('endereco')

    geolocator = Nominatim(user_agent="geoapi")

    # Verifica se um endereço foi passado
    if endereco:
        location = geolocator.geocode(endereco)
        if location:
            latitude_destino = location.latitude
            longitude_destino = location.longitude
        else:
            latitude_destino = None
            longitude_destino = None
    else:
        latitude_destino = None
        longitude_destino = None

    # Criação do mapa centrado nas coordenadas obtidas
    mapa = folium.Map(location=[latitude_atual, longitude_atual], zoom_start=15)

    # Adicionar um marcador para a localização atual
    folium.Marker(
        [latitude_atual, longitude_atual],
        popup="Você está aqui!",
        icon=folium.Icon(color='blue')
    ).add_to(mapa)

    # Adicionar um marcador para o destino se o endereço for válido
    if latitude_destino and longitude_destino:
        folium.Marker(
            [latitude_destino, longitude_destino],
            popup=f"Destino: {endereco}",
            icon=folium.Icon(color='red')
        ).add_to(mapa)

        # Adicionar uma linha entre os dois pontos
        folium.PolyLine(
            locations=[(latitude_atual, longitude_atual), (latitude_destino, longitude_destino)],
            color="green",
            weight=5
        ).add_to(mapa)

    # Renderizar o mapa em HTML
    mapa_html = mapa._repr_html_()

    return render_template('map.html', mapa_html=mapa_html)

if __name__ == '__main__':
    app.run(debug=True)
