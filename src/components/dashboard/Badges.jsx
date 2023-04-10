export function Badges(props) {
  return (
    <>
      <h1 className="mt-5 text-4xl text-white">Badges</h1>
      {/* Fetch badges from API */}
      <div className="mt-4 grid grid-cols-5 gap-x-4 gap-y-4">
        {props.badges.map((data) => (
          <div
            style={{ backgroundColor: '#212121' }}
            className="align-center mx-auto w-full rounded-lg px-4 py-4  text-center"
          >
            <img
              src={`../badges/level1/${data.badge.badgeName.toLowerCase()}.png`}
              width="100"
              className="mx-auto mt-2 px-1"
            />

            <h1 class="mx-auto mt-2  text-center text-xl text-white">
              {data.badge.badgeName}
            </h1>
            <h1 class="text-lg text-white ">
              {new Date(data.createdAt).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })}
            </h1>
          </div>
        ))}
      </div>
    </>
  );
}
