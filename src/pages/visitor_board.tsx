import { createEffect, onCleanup } from "solid-js";
import { visitorBoardApi } from "../services/all_api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Local styles for the visitor board to avoid scrollbars and perfectly center the map
const style = `
.visitor-board-center-outer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding-top: 7vh;
  padding-bottom: 5vh;
  box-sizing: border-box;
}
.visitor-board-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}
.visitor-board-map {
  width: 80vw;
  height: 60vh;
  min-width: 320px;
  max-width: 1400px;
  max-height: 70vh;
  aspect-ratio: 4/2.5;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #dedede;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  background: #fff;
  margin: 0 auto;
  display: block;
}
`;

export default function VisitorBoard() {
  let mapDiv: HTMLDivElement | undefined;
  let map: L.Map | null = null;
  let markers: L.Marker[] = [];

  createEffect(() => {
    let disposed = false;

    async function loadVisitorBoard() {
      try {
        const resp = await visitorBoardApi.getVisitorBoard();
        // Modify this depending on your actual data structure
        // If you have image URLs, e.g., [ [lat, lng], count, imgUrl ]
        const pairs: [number[], number, string?][] =
          resp?.data && Array.isArray(resp.data) ? resp.data : [];
        let initialLatLng: [number, number] =
          pairs.length > 0 ? [pairs[0][0][0], pairs[0][0][1]] : [51.505, -0.09];

        // Remove old map if present
        if (map && map.remove) {
          map.remove();
        }
        map = L.map(mapDiv!).setView(initialLatLng, 3);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Add all markers with a large 📍 emoji as the marker icon
        const emojiIcon = L.divIcon({
          className: "emoji-marker",
          html: "📍",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });

        markers = pairs.map((pair) => {
          const [[lat, lng], count] = pair;
          let popupHtml = `Visitations from here: <b>${count}</b>`;
          return L.marker([lat, lng], { icon: emojiIcon })
            .addTo(map!)
            .bindPopup(popupHtml);
        });

        if (markers.length > 0) {
          markers[0].openPopup();
        }
      } catch (e) {
        if (map && map.remove) map.remove();
        map = null;
        if (mapDiv)
          mapDiv.innerHTML = "<p>Could not load visitor board data.</p>";
      }
    }
    loadVisitorBoard();

    onCleanup(() => {
      disposed = true;
      if (map && map.remove) {
        map.remove();
      }
      markers = [];
    });
  });

  return (
    <>
      <style>{style}</style>
      <style>
        {`
        .emoji-marker {
          font-size: 2rem;
          line-height: 1.2;
          text-align: center;
          transform: translateY(-10%);
        }
        `}
      </style>
      <div class="visitor-board-center-outer">
        <div class="visitor-board-wrapper">
          <div ref={(el) => (mapDiv = el)} id="map" class="visitor-board-map" />
        </div>
      </div>
    </>
  );
}
