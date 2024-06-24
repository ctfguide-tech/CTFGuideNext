import { getCookie } from '@/utils/request';
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import Sidebar from '@/components/settingComponents/sidebar';
import  request  from '@/utils/request';
import React, { useEffect, useState } from "react";



export default function Preferences(){
  const [friends, setFriendNotif] = useState(false);
  const [creator, setCreatorNotif] = useState(false);

  


  function loadPreferences() {
    // WARNING: For GET requests, body is set to null by browsers.

   

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
        console.log('PREFFF');
        try {
          if (JSON.parse(this.responseText)[0].value == true) {
            document.getElementById('friend-notif').checked = true;
          }

          if (JSON.parse(this.responseText)[1].value == true) {
            document.getElementById('challenge-notif').checked = true;
          }
        } catch (error) {
          // .alert(error)
        }
      }
    });

    xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account/preferences`);
    let token = getCookie();
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.withCredentials = true;
    xhr.send();
  }

  
  function handleCheckBox(e){
    const checkState = e.target.value;
    setFriendNotif(true)
    setCreatorNotif(true)
    
  }

  async function saveCheckBoxData() {
    setFriendNotif(document.getElementById('friend-notif').checked);
    setCreatorNotif(document.getElementById('challenge-notif').checked);
    
    var body =  {
      FRIEND_ACCEPT: document.getElementById('friend-notif').checked,
      CHALLENGE_VERIFY: document.getElementById('challenge-notif').checked,
      LESSON_COMPLETION: true,
    };
    const data = await request(
       `${process.env.NEXT_PUBLIC_API_URL}/account/preferences`,
        'PUT',
         body
    ).then((response) => {
      console.log(response)
      document.getElementById('savePreferences').innerHTML = 'Save';

    });
    if (!data) {
        console.log('Failed to save');
        console.log(document.getElementById('friend-notif').checked)
    }
     
    
    setFriendNotif(body.FRIEND_ACCEPT);
    setCreatorNotif(body.CREATOR_VERIFY);
}

    async function savePreferences() {
        document.getElementById('savePreferences').innerHTML = 'Saving...';
    
        var data = JSON.stringify({
          FRIEND_ACCEPT: document.getElementById('friend-notif').checked,
          CHALLENGE_VERIFY: document.getElementById('challenge-notif').checked,
        });
    
        var xhr = new XMLHttpRequest();

        loadPreferences();
        saveCheckBoxData();
    
        xhr.addEventListener('readystatechange', function() {
          if (this.readyState === 4) {
            document.getElementById('savePreferences').innerHTML = 'Save';
          }
        });    
       
        /*
        xhr.open('PUT', `${process.env.NEXT_PUBLIC_API_URL}/account/preferences`);
    
        xhr.setRequestHeader('Content-Type', 'application/json');
        let token = getCookie();
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.withCredentials = true;
    
        xhr.send(data);
        */
      }
    
      
    return(
        <>
        <Head>
          <title>User Settings</title>
          <meta
            name="description"
            content="Cybersecurity made easy for everyone"
          />
          <style>
            @import
            url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
          </style>
        </Head>
  
        <StandardNav />
  
        <div className="mx-auto flex max-w-6xl">
            <Sidebar/>
            
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
                                htmlFor="friend-notif"
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
                                htmlFor="challenge-notif"
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
           
        </div>
  
        <Footer />
      </>
    );
}