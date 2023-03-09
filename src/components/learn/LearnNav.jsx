
import Container from '@/components/Container';
import { ProgressBar  } from '@tremor/react'

export function LearnNav({lessonProgress}) {
    return (
        <>
      <div className="w-1/5  text-gray-900 flex-none mt-10 border-r mr-6" style={{ borderColor: "#212121" }}>

            <ul className="py-3 mr-2">
          <div style={{backgroundColor:"#212121"}} className="py-4 px-4 rounded-lg">
          <h1 className='text-white mx-auto text-center mb-3'>Lesson Progress</h1>
            <ProgressBar  percentageValue={lessonProgress ? lessonProgress.totalProgress : 0} color="blue" tooltip={true} marginTop="mt-2" />

          </div>
              <li className="mt-6 mb-4 py-1"><a href="./preview" className="ml-1 px-2 py-2 text-white font-medium text"><i class="far fa-file mr-2"></i>What is Linux?</a></li>
              <li className="mb-4 py-1"><a href="./video1" className="px-2 py-2 text-white font-medium text"><i class="fas fa-play-circle mr-2"></i>Command Basics</a></li>
              <li className="mb-4 py-1"><a href="./activity1" className="px-2 py-2 text-white font-medium text"><i class="fas fa-clipboard-check mr-2"></i>Mastery Task</a></li>
              <li className="py-1"><a href="./dynamic1" className="px-2 py-2 text-white font-medium text"><i class="fas fa-terminal mr-2"></i>Logging into a server</a></li>
              <li className="ml-5 mt-2 mr-2 py-1"><a href="./dynamic1" className="px-2 py-2 text-white font-medium text">Using your terminal</a></li>
              <li className="ml-5 mr-2 py-1"><a href="./dynamic1" className="px-2 py-2 text-white font-medium text">Using your terminal</a></li>

            </ul>
          </div>
        </>
    )
}
