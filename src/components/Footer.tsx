import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 container mx-auto px-4 py-12 border-t-1 border-gray-200 mt-2">
      <div className="mx-auto w-full py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            {/* Logo Section */}
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 bg-black rounded-full overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  G
                </div>
              </div>
              <span className="font-semibold text-xl">GoOut</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Categories
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link
                    href="/categories/adventure"
                    className="hover:underline"
                  >
                    Adventure
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/categories/culture" className="hover:underline">
                    Culture
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/categories/nature" className="hover:underline">
                    Nature
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="/categories/history" className="hover:underline">
                    History
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Follow us
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link
                    href="https://www.facebook.com/profile.php?id=100088926543723"
                    className="hover:underline"
                  >
                    Facebook
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://www.instagram.com/goout.lk/"
                    className="hover:underline"
                  >
                    Instagram
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://www.tiktok.com/@goout.lk"
                    className="hover:underline"
                  >
                    TikTok
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://www.youtube.com/@goout.lk"
                    className="hover:underline"
                  >
                    YouTube
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Legal
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            <a href="https://standord.com" className="hover:underline">
              Standord
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <Link
              href="https://www.facebook.com/profile.php?id=100088926543723"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <FaFacebook />
              <span className="sr-only">Facebook page</span>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <FaInstagram />
              <span className="sr-only">Instagram page</span>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <FaTiktok />
              <span className="sr-only">TikTok page</span>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <FaYoutube />
              <span className="sr-only">YouTube page</span>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <FaLinkedin />
              <span className="sr-only">LinkedIn page</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
