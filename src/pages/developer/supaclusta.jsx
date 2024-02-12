import Head from 'next/head';
import Link from 'next/link';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { useState, useEffect } from 'react';

export default function Forgot() {
    useEffect(() => {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Scatter Plot',
                    data: [
                        { x: 1, y: 3 },
                        { x: 2, y: 5 },
                        { x: 3, y: 8 },
                        { x: 4, y: 4 },
                        { x: 5, y: 7 },
                        { x: 6, y: 2 },
                        { x: 7, y: 6 },
                    ],
                    backgroundColor: '#3e95cd',
                    borderColor: '#3e95cd',
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                    }
                }
            }
        });
    }, [])
    

  return (
    
    <>
      <Head>
        <title>CTFGuide Supaclusta</title>
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>

      <div
        style={{ fontFamily: 'Poppins, sans-serif' }}
        className="px-20 py-10 mt-14 text-white"
      >

        
            <h1 className='text-4xl font-semibold'><i class="fas fa-project-diagram mr-4"></i>CTFGuide <span className='text-blue-500'>Supaclusta</span></h1>
            <p className='text-lg'>An internal service to visualize data because we're too lazy to learn Grafana.</p>
            
            <hr className='border-neutral-800 mt-4'></hr>

            <h1 className='text-xl mt-4'>Choose a service graph</h1>
            <select className='mt-2 py-2 pr-10 rounded-lg bg-neutral-800 border border-neutral-800 text-white'>
                <option value='' selected>Terminal Infrastructure</option>
                <option value=''>Site Traffic</option>
                <option value=''>AI Service Load</option>
                <option value=''>Terminal Infrastructure (pretty)</option>
            </select>

            <button className='ml-4 bg-blue-600 text-center mx-auto  px-2 py-1 rounded-full'>Render View</button>
            
            <h1 className='text-xl mt-4'>Output:</h1>

            <div className='mt-4 grid grid-cols-4 gap-x-8 border px-4 py-10 border-neutral-800'>
               <div>
               <h1 className='text-2xl text-center text-blue-500'>Avg AI response time</h1>
                <div className='border-white bg-neutral-800 text-center px-4 text-xl py-4 mx-auto mt-2'>
                    11.1 seconds <span className='text-green-500'>OK</span>
                </div>
               </div>


               <div>
               <h1 className='text-2xl text-center text-blue-500'>Longest Hang</h1>
                <div className='border-white bg-neutral-800 text-center px-4 text-xl py-4 mx-auto mt-2'>
                  40 seconds <span className='text-red-500'>WTF</span>
                </div>
               </div>

               <div>
               <h1 className='text-2xl text-center text-blue-500'>graph testing</h1>
                <div className='border-white bg-neutral-800 text-center px-4 text-xl py-4 mx-auto mt-2'>
                <canvas id='myChart'></canvas>

                </div>
               </div>
            </div>


            <div className='mt-40'>
                &copy; CTFGuide Corporation 2024
            </div>
      </div>
    </>
  );
}
