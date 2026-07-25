import Image from "next/image";
import { cldThumb } from "@/lib/cloudinary";

type Certificate = { id: string; title: string; imageUrl: string };

export default function CertificateGrid({ certificates }: { certificates: Certificate[] }) {
  if (certificates.length === 0) return null;
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">Certificates</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-panel">
            <div className="relative h-44 w-full bg-panel2">
              <Image src={cldThumb(c.imageUrl, 640)} alt={c.title} fill className="object-cover" />
            </div>
            <p className="p-4 font-medium text-white">{c.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
