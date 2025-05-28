import dynamic from 'next/dynamic';

// Dynamically import your LeafletMap component without SSR
const LeafletMap = dynamic(() => import('../Components/LeafletMap'), { ssr: false });

export default function MapPage() {
  return (
    <div>
      
      <LeafletMap />
    </div>
  );
}
