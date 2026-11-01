export function Logo(props) {
  return (
    <div className="mx-auto my-auto flex">
      <span className="spooky-logo relative mx-auto flex">
        <img className="mx-auto w-12 text-center spin-on-hover" src="../../../../darkLogo.png" />
        {/* Witch hat, shown only while the Halloween theme is on (html.spooky) */}
        <svg className="spooky-hat" viewBox="0 0 48 40" aria-hidden="true">
          <path d="M8 34c6-2 12-3 16-3s10 1 16 3c-5 3-11 4-16 4S13 37 8 34z" fill="#3b0764" stroke="#a855f7" strokeOpacity="0.5" />
          <path d="M15 32 25 4c1-2 3-2 4 0l-3 4 6 24c-6-1-11-1-17 0z" fill="#4c1d95" stroke="#a855f7" strokeOpacity="0.5" />
          <path d="M15.6 28.5c5.5-1 11-1 16 0l.8 3.3c-6-1-11.4-1-17.6 0z" fill="#f97316" />
        </svg>
      </span>
      <h1
        className="my-auto text-xl font-semibold text-white"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        CTFGuide
      </h1>
    </div>
  );
}
