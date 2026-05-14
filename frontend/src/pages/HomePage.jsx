import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-blush px-4 py-1 text-sm font-semibold text-[#8a5b47]">Wedding photo sharing made simple</span>
          <h1 className="text-4xl font-semibold text-[#5d4037] sm:text-5xl">WedSnap Ethiopia</h1>
          <p className="max-w-xl text-lg leading-8 text-[#563f35]">Create a wedding event, share a QR code, and let guests upload photos and videos instantly — no sign-in needed.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="rounded-full bg-[#8a5b47] px-6 py-3 text-white shadow-sm hover:bg-[#6f4535]">Get started</Link>
            <Link to="/event/123/upload" className="rounded-full border border-[#8a5b47] px-6 py-3 text-[#8a5b47] hover:bg-[#fff1ed]">Try upload flow</Link>
          </div>
        </div>
        <div className="rounded-[32px] bg-white/90 p-6 shadow-xl ring-1 ring-[#e8d4cd]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-[#fde7df] p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-[#8a5b47]">Event management</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#5b3f36]">Invite guests with a QR code</h2>
              <p className="mt-2 text-sm text-[#735049]">Guests scan and upload directly from their phones. Your gallery updates instantly.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-3xl bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-[#5b4236]">Mobile friendly</h3>
                <p className="mt-2 text-sm text-[#70534a]">Large buttons and fast uploads for low-bandwidth venues.</p>
              </article>
              <article className="rounded-3xl bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-[#5b4236]">Secure organizer access</h3>
                <p className="mt-2 text-sm text-[#70534a]">Protected dashboard for event hosts only.</p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
