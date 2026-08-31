"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { CabinetHome } from "@/modules/home/schema/types";

const TEAL = "#08a6b5";
const NAVY = "#063b5c";

function createPinIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<svg width="30" height="42" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 3px rgba(6,59,92,0.35));">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}"/>
      <circle cx="12" cy="12" r="4.5" fill="#ffffff"/>
    </svg>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  });
}

const defaultIcon = createPinIcon(TEAL);
const selectedIcon = createPinIcon(NAVY);

type MapControllerProps = {
  points: CabinetHome[];
  selectedId: string | null;
  markerRefs: React.RefObject<Map<string, L.Marker>>;
};

function MapController({ points, selectedId, markerRefs }: MapControllerProps) {
  const map = useMap();
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (hasFittedRef.current || points.length === 0) return;
    const bounds = L.latLngBounds(
      points.map((point) => [
        point.latitude as number,
        point.longitude as number,
      ]) as L.LatLngTuple[]
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    hasFittedRef.current = true;
  }, [map, points]);

  useEffect(() => {
    if (!selectedId) return;
    const target = points.find((point) => point.id === selectedId);
    if (!target || target.latitude === null || target.longitude === null) {
      return;
    }
    map.flyTo([target.latitude, target.longitude], 16, { duration: 1.1 });
    markerRefs.current.get(selectedId)?.openPopup();
  }, [map, points, selectedId, markerRefs]);

  return null;
}

export default function CabinetsMap({
  points,
  selectedId,
}: {
  points: CabinetHome[];
  selectedId: string | null;
}) {
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[31.7917, -7.0926]}
        zoom={6}
        scrollWheelZoom
        className="h-full w-full"
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController
          points={points}
          selectedId={selectedId}
          markerRefs={markerRefs}
        />
        {points.map((cabinet) => (
          <Marker
            key={cabinet.id}
            position={[cabinet.latitude as number, cabinet.longitude as number]}
            icon={cabinet.id === selectedId ? selectedIcon : defaultIcon}
            ref={(instance) => {
              if (instance) {
                markerRefs.current.set(cabinet.id, instance);
              } else {
                markerRefs.current.delete(cabinet.id);
              }
            }}
          >
            <Popup>
              <div className="min-w-44 space-y-1">
                <p className="text-sm font-bold text-[#063b5c]">
                  {cabinet.nom}
                </p>
                <p className="text-xs font-medium text-[#067f8b]">
                  {cabinet.specialite}
                </p>
                {(cabinet.ville || cabinet.localisation) && (
                  <p className="text-xs text-slate-500">
                    {[cabinet.ville, cabinet.localisation]
                      .filter(Boolean)
                      .join(" — ")}
                  </p>
                )}
                <p className="text-xs text-slate-400">
                  GPS :{" "}
                  {Number(cabinet.latitude).toFixed(5)},{" "}
                  {Number(cabinet.longitude).toFixed(5)}
                </p>
                <Link
                  href={`/espace-patient/cabinets/${cabinet.id}`}
                  className="mt-1 block text-xs font-semibold text-[#08a6b5] hover:text-[#067f8b]"
                >
                  Voir les médecins →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {points.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-[300] flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-sm rounded-2xl border border-medos-line bg-white/95 px-6 py-8 text-center shadow-lg shadow-medos-navy/5 backdrop-blur-sm sm:px-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-medos-frost">
              <MapPin className="h-6 w-6 text-medos-teal" />
            </span>
            <h3 className="mt-4 text-base font-bold text-medos-navy">
              Aucun cabinet n&apos;est encore localisé
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-medos-slate">
              Les cabinets avec une position géographique apparaîtront sur la
              carte.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
