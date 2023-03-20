import { Container } from '@/components/Container'

export function Developer() {
    return (
        <>
            <Container style={{ backgroundColor: "#161716" }} className="hidden text-2xl max-w-6xl rounded-lg">
                <h1 className='text-white'>Developer Menu</h1>
                <input placeholder='API Endpoint' className='mt-4 px-2'></input>
                <button></button>
            </Container>
        </>
    )
}
