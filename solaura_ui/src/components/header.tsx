'use client'

import dynamic from "next/dynamic";
import ThemeSwitcher from "./themeSwitcher";
import solauraLogo from '../assets/logos/solaura_logo.png'; // Import the image

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Header = () => {
  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <div className="relative z-[-1] flex place-items-center ">
      <img
    className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
    src={solauraLogo.src}
    alt="Solaura Logo"
    width={200}
  />
      </div>
      <div className="flex pt-4 lg:pt-0 w-full items-end justify-center gap-4 dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
        <WalletMultiButtonDynamic />
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Header;
