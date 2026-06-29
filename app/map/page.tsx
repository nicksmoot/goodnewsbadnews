"use client";

import dynamic from "next/dynamic";

// Leaflet touches the DOM/window — load the map purely on the client.
const SignalMap = dynamic(() => import("@/components/SignalMap"), { ssr: false });

export default function MapPage() {
  return <SignalMap />;
}
