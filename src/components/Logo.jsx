export function Logo(props) {
  return (
    <div className="mx-auto my-auto flex">
      <img className="mx-auto w-12 text-center spin-on-hover" src="../../../../darkLogo.png" />
      <h1
        className="my-auto text-xl font-semibold text-white"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        CTFGuide Early Preview
      </h1>
    </div>
  );
}
