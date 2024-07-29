import { Head, Html } from 'next/document';

export default function Document() {
  return (
    <Html
      style={{ backgroundColor: '#161716' }}
      className="h-full scroll-smooth bg-white antialiased [font-feature-settings:'ss01']"
      lang="en"
    >
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lexend:wght@400;500&family=Poppins&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
          integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
          crossorigin="anonymous"
        />
        <script defer data-domain="ctfguide.com" src="https://plausible.io/js/script.js"></script>
      </Head>
      <body className="flex h-full flex-col items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold">We'll be back soon!</h1>
          <p className="mt-4">Sorry for the inconvenience. We're performing some maintenance at the moment. We'll be back online shortly!</p>
        </div>
      </body>
    </Html>
  );
}
