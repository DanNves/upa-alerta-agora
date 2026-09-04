import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useStore } from "@/data/store";
import { getStatus, type UPA } from "@/data/upas";

function buildPin(upa: UPA) {
  const s = getStatus(upa.ocupacao_atual, upa.capacidade_max);
  return L.divIcon({
    className: "upa-pin",
    iconSize: [72, 62],
    iconAnchor: [36, 62],
    html: `
      <div class="upa-pin-inner">
        <div class="upa-pin-bubble" style="background:${s.cor}">
          <span style="font-size:11px;line-height:1.05;display:block">${upa.ocupacao_atual}/${upa.capacidade_max}</span>
          <span style="font-size:10px;line-height:1.05;display:block;opacity:.95">${s.pct}%</span>
        </div>
        <div class="upa-pin-tail" style="border-top-color:${s.cor}"></div>
      </div>
    `,
  });
}


function userIcon() {
  return L.divIcon({
    className: "upa-pin",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="position:relative;width:22px;height:22px">
      <div class="user-pulse" style="position:absolute;inset:0;border-radius:999px;background:#1D4ED8;opacity:0.25"></div>
      <div style="position:absolute;inset:0;border-radius:999px;background:#1D4ED8;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>
    </div>`,
  });
}

function Recenter({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (zoom != null) {
      map.flyTo(center, zoom, { duration: 0.8 });
    } else {
      map.setView(center);
    }
  }, [center, zoom, map]);
  return null;
}

export function UPAMap({
  onSelect,
  focusId,
  upas: upasProp,
}: {
  onSelect: (id: string) => void;
  focusId?: string | null;
  /** Lista já filtrada (opcional): os filtros também valem para os pins do mapa. */
  upas?: UPA[];
}) {
  const todas = useStore((s) => s.upas);
  const upas = upasProp ?? todas;
  const userLoc = useStore((s) => s.userLoc);

  const center = useMemo<[number, number]>(() => {
    if (focusId) {
      const u = todas.find((x) => x.id === focusId);
      if (u) return [u.latitude, u.longitude];
    }
    return [userLoc.lat, userLoc.lng];
  }, [focusId, todas, userLoc]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[userLoc.lat, userLoc.lng]}
        zoom={11}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
          maxZoom={16}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />

        <Recenter center={center} zoom={focusId ? 16 : undefined} />
        <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon()} />
        {upas.map((upa) => (
          <Marker
            key={`${upa.id}-${upa.ocupacao_atual}-${upa.capacidade_max}-${upa.aberta ? 1 : 0}`}
            position={[upa.latitude, upa.longitude]}
            icon={buildPin(upa)}
            eventHandlers={{ click: () => onSelect(upa.id) }}
          />
        ))}
      </MapContainer>
      <a
        href="https://www.esri.com/en-us/legal/terms/full-master-agreement"
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto absolute bottom-1.5 left-1.5 z-[1000] rounded bg-white/80 px-1.5 py-0.5 text-[10px] text-slate-600 shadow-sm backdrop-blur-sm hover:underline"
      >
        Tiles © Esri
      </a>

    </div>
  );
}
