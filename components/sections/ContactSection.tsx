"use client";

import React, { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SiteSettings } from "@/lib/db/schema";

interface ContactSectionProps {
  settings?: SiteSettings | null;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "Editorial Commission",
    message: "",
  });
  const containerRef = useRef<HTMLElement>(null);

  const email = settings?.email || "gaurav@gauravd.studio";
  const phone = settings?.phone || "+33 (0) 1 42 68 55 00";
  const instagram = settings?.instagram || "https://instagram.com/gauravd.photo";

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = containerRef.current;
      if (!el) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        ".contact-line-reveal",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 1.1,
          ease: "power4.out",
        },
        0
      ).fromTo(
        ".contact-reveal",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
        },
        0.2
      );
    },
    { scope: containerRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="bg-canvas-dark text-canvas py-14 sm:py-20 px-6 sm:px-12 overflow-hidden border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="contact-reveal flex items-center space-x-3 text-xs tracking-ultra uppercase text-bronze mb-4">
          <span>•</span>
          <span>COMMISSIONS & INQUIRIES</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct Inquiries & Studio Locations */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="overflow-hidden">
                <h2 className="contact-line-reveal font-serif text-3xl sm:text-5xl font-light leading-[1.08]">
                  Have a story
                </h2>
              </div>
              <div className="overflow-hidden">
                <h2 className="contact-line-reveal font-serif text-3xl sm:text-5xl font-light italic text-canvas/90 leading-[1.08]">
                  worth framing?
                </h2>
              </div>
              <p className="contact-reveal text-canvas/70 text-sm sm:text-base font-light leading-relaxed">
                Available for editorial assignments, fine-art prints, and creative collaborations worldwide. Reach out directly or send a message below.
              </p>
            </div>

            <div className="contact-reveal space-y-6 border-t border-white/10 pt-6">
              <div>
                <p className="text-[10px] tracking-ultra text-bronze uppercase mb-1.5">EMAIL & PHONE</p>
                <a
                  href={`mailto:${email}`}
                  className="font-serif text-2xl sm:text-3xl text-canvas hover:text-bronze transition-colors"
                >
                  {email}
                </a>
                <p className="text-xs text-canvas/50 font-mono pt-1">{phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs tracking-widest uppercase text-canvas/60">
                <div>
                  <p className="text-white font-medium mb-1">PARIS</p>
                  <p>18 Rue Vivienne</p>
                  <p>75002 Paris, France</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">TOKYO</p>
                  <p>Minami-Aoyama</p>
                  <p>Minato-ku, Tokyo</p>
                </div>
              </div>

              <div className="pt-1 flex items-center space-x-6 text-xs tracking-widest uppercase">
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-bronze hover:text-white transition-colors"
                >
                  <span>INSTAGRAM</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://behance.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-canvas/70 hover:text-white transition-colors"
                >
                  <span>BEHANCE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Form */}
          <div className="contact-reveal lg:col-span-7 bg-white/[0.03] border border-white/10 p-6 sm:p-8">
            {formSubmitted ? (
              <div className="py-16 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-bronze mx-auto" />
                <h3 className="font-serif text-3xl font-light text-canvas">Message Sent</h3>
                <p className="text-sm text-canvas/70 max-w-md mx-auto">
                  Thank you, {formData.name}. Your message has been received and you will hear back within 24 hours.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 text-xs tracking-ultra uppercase text-bronze hover:underline"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <p className="text-xs tracking-ultra uppercase text-canvas/50 mb-1">
                  SEND A MESSAGE
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] tracking-widest uppercase text-canvas/60 mb-2">
                      NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 px-4 py-3 text-sm text-canvas placeholder:text-canvas/30 focus:border-bronze focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] tracking-widest uppercase text-canvas/60 mb-2">
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/15 px-4 py-3 text-sm text-canvas placeholder:text-canvas/30 focus:border-bronze focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-canvas/60 mb-2">
                    INQUIRY TYPE
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-canvas-dark border border-white/15 px-4 py-3 text-sm text-canvas focus:border-bronze focus:outline-none transition-colors"
                  >
                    <option value="Editorial Commission">Editorial Commission</option>
                    <option value="Fine Art Print">Fine Art Print Acquisition</option>
                    <option value="Commercial / Brand">Commercial Project</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-canvas/60 mb-2">
                    MESSAGE *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your project or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 px-4 py-3 text-sm text-canvas placeholder:text-canvas/30 focus:border-bronze focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full group inline-flex items-center justify-center space-x-2 py-3.5 bg-canvas text-ink text-xs font-medium tracking-ultra uppercase hover:bg-bronze hover:text-white transition-all duration-300"
                >
                  <span>SEND MESSAGE</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
