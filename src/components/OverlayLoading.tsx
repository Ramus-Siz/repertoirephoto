 

import Image from 'next/image';

export default function OverlayLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-white/10 backdrop-blur-sm flex items-center justify-center">
      <div className="animate-pulse border border-[#008237] rounded-full text-[#008237] py-16 px-12">
        <Image
          src="/Advans_Congo_Logo.svg"
          alt="Chargement"
          width={100}
          height={80}
          className="rounded-full"
        />
      </div>
    </div>
  );
}
