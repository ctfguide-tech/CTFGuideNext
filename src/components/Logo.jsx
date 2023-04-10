export function Logo(props) {
  return (
    <div className="mx-auto my-auto flex">
      <img className="mx-auto w-12 text-center" src="../../darkLogo.png" />
      <h1
        className="my-auto text-xl font-semibold text-white"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        CTFGuide <span className="text-blue-600">Beta</span>
      </h1>
    </div>
  );
}
