import LessonViewer from '@/components/learn/viewer/LessonViewer';
import { StandardNav } from '@/components/StandardNav';

export default function LessonPage({ lesson }) {
    return (

        <div>
                      <StandardNav/>

            <LessonViewer lessonData={lesson} />
        </div>
    );
}

// Get lesson data from API
export async function getServerSideProps({ params }) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${params.lessonId}`);
        const lesson = await response.json();
        
        return {
            props: {
                lesson
            }
        };
    } catch (error) {
        return {
            notFound: true
        };
    }
} 