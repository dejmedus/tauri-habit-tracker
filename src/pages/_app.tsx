import type { AppProps } from "next/app";

import "../App.css";
import "../style.css";
import "../modal.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
