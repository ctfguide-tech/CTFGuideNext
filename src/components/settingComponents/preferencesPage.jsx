import { getCookie } from '@/utils/request';

export default function Preferences(){

    function savePreferences() {
        document.getElementById('savePreferences').innerHTML = 'Saving...';
    
        var data = JSON.stringify({
          FRIEND_ACCEPT: document.getElementById('friend-notif').checked,
          CHALLENGE_VERIFY: document.getElementById('challenge-notif').checked,
        });
    
        var xhr = new XMLHttpRequest();
    
        xhr.addEventListener('readystatechange', function() {
          if (this.readyState === 4) {
            document.getElementById('savePreferences').innerHTML = 'Save';
          }
        });
    
        xhr.open('PUT', `${process.env.NEXT_PUBLIC_API_URL}/account/preferences`);
    
        xhr.setRequestHeader('Content-Type', 'application/json');
        let token = getCookie();
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.withCredentials = true;
    
        xhr.send(data);
      }
    
      
    return(
        <div className="flex-1 xl:overflow-y-auto">
                  <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                      Email Preferences
                    </h1>

                    <div className="mt-6 space-y-8 ">
                      <fieldset>
                        <legend className="sr-only">Notifications</legend>
                        <div className="space-y-5">
                          <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                              <input
                                id="friend-notif"
                                aria-describedby="comments-description"
                                name="comments"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                              />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                              <label
                                htmlFor="comments"
                                className="font-medium text-white"
                              >
                                Friend Requests
                              </label>
                              <p
                                id="comments-description"
                                className="text-neutral-400"
                              >
                                Get notified when someones accepts or sends you a
                                friend request.
                              </p>
                            </div>
                          </div>
                          <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                              <input
                                id="challenge-notif"
                                aria-describedby="candidates-description"
                                name="candidates"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                              />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                              <label
                                htmlFor="candidates"
                                className="font-medium text-white"
                              >
                                Creator Notifications
                              </label>
                              <p
                                id="candidates-description"
                                className="text-neutral-400"
                              >
                                Get notified when your challenges get verified.
                              </p>
                            </div>
                          </div>
                        </div>
                      </fieldset>

                      <div className="flex justify-end gap-x-3 pt-8">
                        <button
                          id="savePreferences"
                          onClick={savePreferences}
                          className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
    );
}