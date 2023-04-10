export function CreatorDashboard() {
  const dummyData = [
    {
      week: 1,
      views: 0,
      attempts: 0,
      successes: 0,
    },
    {
      week: 2,
      views: 456,
      attempts: 35,
      successes: 5,
    },
    {
      week: 3,
      views: 2348,
      attempts: 378,
      successes: 45,
    },
    {
      week: 4,
      views: 0,
      attempts: 0,
      successes: 0,
    },
  ];
  return (
    <>
      <div className="w-full" style={{ backgroundColor: '#212121' }}>
        <div className="mx-auto my-auto flex h-28 text-center">
          <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
            Creator Dashboard
          </h1>
        </div>
      </div>
    </>
  );
}
