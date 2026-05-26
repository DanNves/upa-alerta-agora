import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useStore } from "@/data/store";
import { getStatus, type UPA } from "@/data/upas";

function buildPin(upa: UPA) {
  const s = getStatus(upa.ocupacao_atual, upa.capacidade_max);
  return L.divIcon({
    className: "upa-pin",
    iconSize: [60, 56],
    iconAnchor: [30, 56],
    html: `
      <div class="upa-pin-inner">
        <div class="upa-pin-bubble" style="background:${s.cor}">${s.pct}%</div>
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

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export function UPAMap({ onSelect, focusId }: { onSelect: (id: string) => void; focusId?: string | null }) {
  const upas = useStore((s) => s.upas);
  const userLoc = useStore((s) => s.userLoc);

  const center = useMemo<[number, number]>(() => {
    if (focusId) {
      const u = upas.find((x) => x.id === focusId);
      if (u) return [u.latitude, u.longitude];
    }
    return [userLoc.lat, userLoc.lng];
  }, [focusId, upas, userLoc]);

  return (
    <MapContainer
      center={[userLoc.lat, userLoc.lng]}
      zoom={12}
      className="h-full w-full"
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Recenter center={center} />
      <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon()} />
      {upas.map((upa) => (
        <Marker
          key={upa.id}
          position={[upa.latitude, upa.longitude]}
          icon={buildPin(upa)}
          eventHandlers={{ click: () => onSelect(upa.id) }}
        />
      ))}
    </MapContainer>
  );
}
