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
    latitude = request.args.get('latitude', type=float)
    longitude = request.args.get('longitude', type=float)

    # Verifica se as coordenadas foram passadas
    if latitude is None or longitude is None:
        # Se não houver coordenadas, use uma localização padrão (São Paulo, Brasil)
        location = "São Paulo, Brazil"
        geolocator = Nominatim(user_agent="geoapi")
        location = geolocator.geocode(location)
        latitude = location.latitude
        longitude = location.longitude

    # Criação do mapa centrado nas coordenadas obtidas
    mapa = folium.Map(location=[latitude, longitude], zoom_start=15)

    # Adicionar um marcador no mapa
    folium.Marker(
        [latitude, longitude],
        popup="Você está aqui!"
    ).add_to(mapa)

    # Renderizar o mapa em HTML
    mapa_html = mapa._repr_html_()

    return render_template('map.html', mapa_html=mapa_html)

if __name__ == '__main__':
    app.run(debug=True)
