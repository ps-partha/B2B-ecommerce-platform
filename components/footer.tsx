"use client";

import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-8 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="M8 11h8" />
              <path d="M12 15V7" />
            </svg>
            SecureTrade
          </Link>
          <div className="flex gap-4">
            <Link
              href="#"
              className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
            <Link
              href="#"
              className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Link>
            <Link
              href="#"
              className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Safety Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Newsletter</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-background" />
              <Button className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 SecureTrade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
