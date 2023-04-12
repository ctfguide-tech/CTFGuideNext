export function Suggest() {
  return (
    <>
      <h1
        className="mt-6 mb-2 mt-2 text-xl tracking-tight text-white    "
        style={{ color: '#595959' }}
      >
        {' '}
        RECOMMENDATIONS
      </h1>

      <div className="mb-5 grid grid-cols-2 gap-x-4">
        <div
          style={{
            backgroundImage:
              "url('http://jasonlong.github.io/geo_pattern/examples/octogons.png')",
          }}
          className="flex cursor-pointer rounded-lg px-4 py-3 hover:shadow-md hover:shadow-blue-600/40"
        >
          <div className="">
            <h1 className=" text-xl text-white">Continue solving </h1>
            <h1 className="text-3xl font-semibold text-white">Hackabit</h1>
          </div>
        </div>
        <div
          style={{
            backgroundImage:
              "url('https://camo.githubusercontent.com/95d341ea62cba982026e6d468e90f0369fcf989cd89aa9a0f89fa7fa2ebd19b8/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f6f7665726c617070696e675f636972636c65732e706e67')",
          }}
          className="flex cursor-pointer rounded-lg px-4 py-3 hover:shadow-md hover:shadow-yellow-600/40"
        >
          <div className="">
            <h1 className=" text-xl text-white">Suggested for you </h1>
            <h1 className="text-3xl font-semibold text-white">Gobustme!</h1>
          </div>
        </div>
      </div>
    </>
  );
}
