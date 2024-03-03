export function YourChallenges(props) {
  return (
    <>
      <h1 className="mt-5 text-4xl text-white">Your Challenges</h1>
      {props.challenges.map((challenge) => (
        <div className="w-full rounded-lg bg-neutral-800 text-white">
          <h1 className="px-2 py-2 text-2xl">{challenge.id} </h1>
        </div>
      ))}
    </>
  );
}
