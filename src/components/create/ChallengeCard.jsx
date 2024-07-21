import { EyeIcon, PencilIcon } from '@heroicons/react/20/solid';

export function ChallengeCard({ challenge }) {
  return (
    <>
      <div className="mt-4 w-full  ">
        <div className="mx-auto flex border border-neutral-800 bg-neutral-900 px-6 py-2.5 ">
          <div className="my-auto mr-6 text-lg text-white">
            {challenge.title}
          </div>
          <div className="my-auto rounded-md border border-blue-700 bg-neutral-900 hover:bg-neutral-800">
            <div className="text-md my-auto mx-auto rounded-lg px-3 text-center text-white">
              {challenge.category[0]}
            </div>
          </div>
          <div className="my-auto ml-6 rounded-lg border border-blue-500 bg-neutral-900 px-3 text-center text-sm text-white hover:bg-neutral-800">
            {challenge.views} View(s)
          </div>
          <div className="my-auto ml-6 rounded-lg border border-blue-300 bg-neutral-900 px-3 text-center text-sm text-white hover:bg-neutral-800">
            {challenge.attempts} Attempt(s)
          </div>
          <div className="my-auto ml-6 rounded-lg border border-green-500 bg-neutral-900 px-3 text-center text-sm text-white hover:bg-neutral-800">
            {challenge.goodAtmps} Good Attempt(s)
          </div>
          <div className="ml-auto flex">
            {challenge.state == 'STANDARD_VERIFIED' && (
              <div className="mx-auto mx-auto flex rounded-lg bg-neutral-900 py-2.5 pl-5 pr-3 text-center text-center text-white">
                <a href={`/challenges/${challenge.id}`}>
                  <EyeIcon className="mr-2 h-5 text-white " />{' '}
                </a>
              </div>
            )}
            {challenge.state == 'STANDARD_PENDING' && (
              <a
                href={'../create/edit?id=' + challenge.id}
                className="mx-auto ml-4 mr-2 flex rounded-lg bg-neutral-900 px-2 py-2.5 text-center text-white"
              >
                <PencilIcon className="mr-2 h-5 text-white " />
              </a>
            )}
            {(challenge.state == 'STANDARD_UNVERIFIED' ||
              challenge.state == 'STANDARD_PENDING') && (
              <div className="mx-auto ml-4 mr-2 cursor-pointer hover:font-bold rounded-lg  px-2 py-2.5 text-center text-red-500">
              <i className="fas fa-trash-alt"></i> Delete
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}