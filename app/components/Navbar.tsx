'use client';

import Image from 'next/image';
import { orbitron, colors, shadows } from '../lib/theme';

export default function Navbar() {
  return (
    <nav 
      className="fixed w-full z-50 top-0 left-0 border-b backdrop-blur-md bg-white/70 dark:bg-background-dark/70"
      style={{ 
        borderColor: `${colors.green}33`,
        boxShadow: shadows.sm 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2 cursor-pointer group">
            <Image 
              src="/logo.svg" 
              alt="Logo" 
              width={40} 
              height={40}
              className="transition-transform duration-500 group-hover:rotate-180"
            />
            <span 
              className={`font-bold text-xl tracking-widest text-gray-900 dark:text-white transition-colors ${orbitron.className}`}
              style={{
                color: colors.green
              }}
            >
              NEXUS<span className="text-white dark:text-gray-400">.DEV</span>
            </span>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Skills', href: '#skills' },
              { name: 'Projects', href: '#projects' },
              { name: 'Certificates', href: '#certificates' },
              { name: 'Contact', href: '#contact' },
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`relative text-gray-700 dark:text-gray-300 font-medium text-sm uppercase tracking-wider transition-colors hover:text-white group ${orbitron.className}`}
                >
                  {link.name}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: colors.green }}
                  ></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white transition-colors"
            style={{
              borderColor: colors.cyan
            }}
          >
            <span className="material-icons">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
