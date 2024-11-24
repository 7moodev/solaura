'use client';

import dynamic from 'next/dynamic';
import ThemeSwitcher from './themeSwitcher';
import solauraLogo from '../assets/logos/solaura_logo.png'; // Import the image
import { useTheme } from 'next-themes';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Header = () => {
  const { theme } = useTheme();

  const headerBgColor =
  theme === 'dark' ? 'bg-[#03001C] text-gray-900' : 'bg-[#7071E8] text-gray-900';

  return (
    <div className={`z-10 w-full py-4 px-6 ${headerBgColor} transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={solauraLogo.src}
            alt="Solaura Logo"
            className="h-20 "
          />
        </div>
        <div className="flex pt-4 lg:pt-0 w-full items-end justify-center gap-4 dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
        <WalletMultiButtonDynamic />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Header;