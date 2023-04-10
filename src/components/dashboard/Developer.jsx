import { Container } from '@/components/Container';

export function Developer() {
  return (
    <>
      <Container
        style={{ backgroundColor: '#161716' }}
        className="hidden max-w-6xl rounded-lg text-2xl"
      >
        <h1 className="text-white">Developer Menu</h1>
        <input placeholder="API Endpoint" className="mt-4 px-2"></input>
        <button></button>
      </Container>
    </>
  );
}
