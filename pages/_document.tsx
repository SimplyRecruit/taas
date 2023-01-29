import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <title>taas app</title>
        <link href="/favicon.ico" rel="shortcut icon" />
        <link href="/logo192.png" rel="apple-touch-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
