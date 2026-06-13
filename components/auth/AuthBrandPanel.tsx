import Image from "next/image";

export function AuthBrandPanel() {
  return (
    <section className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-primary p-12 lg:flex">
      <div
        aria-hidden
        className="aurora-blob-1 absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-gold/25 via-gold/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="aurora-blob-2 absolute -right-32 bottom-32 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-gold/20 via-gold/5 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="aurora-blob-3 absolute -bottom-24 left-1/3 h-[360px] w-[360px] rounded-full bg-gradient-to-br from-[#E8C96A]/15 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#040e3d] via-[#040e3d]/40 to-transparent"
      />

      <div className="absolute w-2 h-1/2 bg-white -rotate-[45deg] bottom-0 left-5" />
      <div className="absolute w-2 h-1/2 bg-white rotate-45 top-0 right-0" />

      <div className="relative z-10 flex max-w-md flex-col gap-y-8 items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Royal Ambassadors
        </h1>
        <Image
          src="/images/ra-logo.png"
          alt="RA logo"
          width={150}
          height={150}
          className="rounded-full object-cover"
        />

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Pentecost Baptist Association
        </h1>

        <div>
          <p className="mt-8 max-w-sm text-base italic leading-relaxed text-gold">
            We are Ambassadors for Christ
          </p>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-white/90">
            2 Corinthians 5:20
          </p>
        </div>

        <div className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>
    </section>
  );
}
