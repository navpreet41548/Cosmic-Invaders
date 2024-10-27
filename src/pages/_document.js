import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <title>Cosmic Invaders</title>
        <meta name="description" content="Cosmic Invaders is an action-packed arcade shooter game set within Telegram, where players must defend the galaxy from waves of alien invaders. Inspired by the classic arcade game Galaga, Cosmic Invaders offers a blend of nostalgia and modern gameplay mechanics, allowing players to earn rewards and enhance their gameplay through in-game purchases, daily rewards, and a robust referral system. As part of the Prolific Game Studio ecosystem, Cosmic Invaders provides a secure and thrilling environment for arcade shooter enthusiasts." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      <script  src="https://telegram.org/js/telegram-web-app.js" />
         {/* <script  src="https://sad.adsgram.ai/js/sad.min.js"></script> */}
{/* <script src="https://cdn.jsdelivr.net/gh/TONSolutions/telemetree-pixel@main/telemetree-pixel.js"></script> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
