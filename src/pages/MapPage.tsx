import React from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";
import { stores, StoresProps } from "../common/utils/stores";
import { BsFillTelephoneFill } from "react-icons/bs";
import { ImLocation } from "react-icons/im";
import * as S from "./MapPage.styles";
const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const centerInitial = { lat: -14.235004, lng: -51.925282 };

const API_KEY = "AIzaSyAtW3GoGl8D39on7Z-JfJqUamIFJPleopw";

function MapPage() {
  const [center, setCenter] = React.useState(centerInitial);
  const [searchBox, setSearchBox] =
    React.useState<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  const onPlacesChanged = () => {
    const places = searchBox?.getPlaces();
    if (places && places.length > 0) {
      const location = places[0].geometry?.location;
      const lat = location?.lat();
      const lng = location?.lng();

      if (lat && lng) {
        setCenter({ lat, lng });
      }
    }
  };
  const onSBLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const [storeSelected, setSelectedStore] =
    React.useState<null | StoresProps>();

  const handleCard = (store: StoresProps) => {
    setSelectedStore(store);
  };

  const handleOnLoad = (map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    stores.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={6}
      onLoad={handleOnLoad}
      onClick={() => setSelectedStore(null)}
    >
      <StandaloneSearchBox onPlacesChanged={onPlacesChanged} onLoad={onSBLoad}>
        <input
          type="text"
          placeholder="Customized your placeholder"
          style={{
            boxSizing: "border-box",
            border: `1px solid transparent`,
            width: `270px`,
            height: `40px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            margin: "center",
            textOverflow: `ellipses`,
            position: "absolute",
            top: "40px",
            marginLeft: "50%",
          }}
        />
      </StandaloneSearchBox>
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={store.position}
          onClick={() => handleCard(store)}
          icon={{
            url: `/cvc.png`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
      ))}

      {storeSelected && (
        <InfoWindow
          position={{
            lat: storeSelected.position.lat,
            lng: storeSelected.position.lng,
          }}
          onCloseClick={() => {
            setSelectedStore(null);
          }}
        >
          <div>
            <h3>{storeSelected.name}</h3>
            <S.Info>
              <BsFillTelephoneFill />
              <p>{storeSelected.tel}</p>
            </S.Info>
            <S.Info>
              <ImLocation />
              <p>{storeSelected.address}</p>
            </S.Info>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <h1>Erro ao carregar mapa. Tente novamente</h1>
  );
}

export default React.memo(MapPage);
