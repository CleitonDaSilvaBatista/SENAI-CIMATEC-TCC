let map;
let userMarker;
let userLocationAtual = null;
let trafficLayer;
const marcadoresNegocios = {};

function initMap() {
  const fallbackCenter = { lat: -12.9714, lng: -38.5014 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: fallbackCenter,
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  trafficLayer = new google.maps.TrafficLayer();

  const negocios = [
    {
      nome: "Barbearia II Irmãos",
      lat: -12.9720,
      lng: -38.5025,
      descricao: "Cortes modernos e atendimento premium."
    },
    {
      nome: "Sabor Caseiro Restaurante",
      lat: -12.9685,
      lng: -38.4975,
      descricao: "Comida caseira e pratos executivos."
    },
    {
      nome: "Studio Make & Beauty",
      lat: -12.9755,
      lng: -38.5050,
      descricao: "Maquiagem, cílios e beleza profissional."
    }
  ];

  negocios.forEach((negocio) => {
    const marker = new google.maps.Marker({
      position: { lat: negocio.lat, lng: negocio.lng },
      map,
      title: negocio.nome
    });

    const info = new google.maps.InfoWindow({
      content: `
        <div style="min-width:220px; padding:6px 4px;">
          <h3 style="margin:0 0 8px; font-size:16px; color:#198754;">${negocio.nome}</h3>
          <p style="margin:0; font-size:14px; color:#444;">${negocio.descricao}</p>
        </div>
      `
    });

    marker.addListener("click", () => {
      info.open(map, marker);
    });

    marcadoresNegocios[negocio.nome.trim().toLowerCase()] = {
      marker,
      info,
      position: { lat: negocio.lat, lng: negocio.lng }
    };
  });

  conectarCardsAoMapa();

  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      (position) => {
        userLocationAtual = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        if (!userMarker) {
          userMarker = new google.maps.Marker({
            position: userLocationAtual,
            map,
            title: "Você está aqui",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#2563eb",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3
            }
          });
        } else {
          userMarker.setPosition(userLocationAtual);
        }
      },
      (error) => {
        console.error("Erro no watchPosition:", error);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 60000,
        timeout: 20000
      }
    );
  }
}

function conectarCardsAoMapa() {
  const cards = document.querySelectorAll(".servico-micro-card");

  cards.forEach((card) => {
    const titulo = card.querySelector("h3");
    if (!titulo) return;

    const nomeNegocio = titulo.textContent.trim().toLowerCase();
    const negocioMapa = marcadoresNegocios[nomeNegocio];

    if (!negocioMapa) return;

    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      map.setCenter(negocioMapa.position);
      map.setZoom(16);

      negocioMapa.info.open(map, negocioMapa.marker);

      document.getElementById("map").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  });
}

function toggleTraffic() {
  if (!trafficLayer) return;

  if (trafficLayer.getMap()) {
    trafficLayer.setMap(null);
  } else {
    trafficLayer.setMap(map);
  }
}

function centralizarUsuario() {
  if (!("geolocation" in navigator)) {
    alert("Seu navegador não suporta geolocalização.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocationAtual = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      if (!userMarker) {
        userMarker = new google.maps.Marker({
          position: userLocationAtual,
          map,
          title: "Você está aqui",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#2563eb",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3
          }
        });
      } else {
        userMarker.setPosition(userLocationAtual);
      }

      map.setCenter(userLocationAtual);
      map.setZoom(15);
    },
    (error) => {
      console.error("Erro ao obter localização:", error);
      alert("Não foi possível carregar sua localização.");
    },
    {
      enableHighAccuracy: false,
      maximumAge: 60000,
      timeout: 20000
    }
  );
}

window.initMap = initMap;
window.toggleTraffic = toggleTraffic;
window.centralizarUsuario = centralizarUsuario;