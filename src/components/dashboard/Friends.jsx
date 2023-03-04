
import Container from '@/components/Container';


export function Friends() {
    return (
        <>
            <Container className="mt-4 rounded-lg mx-auto max-w-6xl ">
                <div>
                    <div className="flex items-end">
                        <div className="pt-72 pl-64 pr-4 rounded-full">
                            <div className="w-16 h-16 bg-green-400 rounded-[100%]" />
                        </div>
                        <div className="w-80 h-80 ml-28 rounded-full" />
                        <div className="w-16 h-16 bg-green-400 rounded-[100%]" />
                        <div className="w-80 h-80 ml-32 rounded-full" />
                        <div className="w-16 h-16 bg-green-400 rounded-[100%]" />
                    </div>
                    <div className="flex items-center mt-6">
                        <div className="text-white text-4xl">longusername12</div>
                        <div className="ml-36 text-white text-4xl">longusername12</div>
                        <div className="ml-36 text-white text-4xl">longusername12</div>
                    </div>
                </div>


            </Container>
        </>
    )
}
