"use client";

import { Container } from "./ui/container";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";

export function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      video.volume = 1;
      video.play();
    } else {
      video.pause();
    }
  }, []);

  return (
    <section className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px brand-line opacity-20" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-xs font-mono text-[#1a6d52] tracking-widest uppercase mb-4">
            SEE IT IN ACTION
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
            One minute.{" "}
            <span className="text-zinc-500">The full picture.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-[#1a6d52]/[0.08] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative rounded-2xl overflow-hidden border border-[#1e1e22] bg-[#0e0e12] brand-glow-sm">
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1e1e22]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e22]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e22]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e22]" />
                <span className="ml-2 text-[10px] text-zinc-600 font-mono">
                  regulance — product overview
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  {isPlaying && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a6d52] animate-pulse" />
                      <span className="text-[10px] text-[#1a6d52] font-mono">Playing</span>
                    </>
                  )}
                </div>
              </div>

              {/* Video area */}
              <div className="relative aspect-video bg-[#0a0a0c]">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  onClick={togglePlay}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  playsInline
                  controls={isPlaying}
                  preload="metadata"
                >
                  <source src="/pitch.mp4" type="video/mp4" />
                </video>

                {/* Play overlay — only when paused */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0c]/60">
                    <button
                      onClick={togglePlay}
                      className="flex flex-col items-center gap-4 cursor-pointer"
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-sm bg-white/5 transition-all duration-300 hover:scale-110 hover:border-[#1a6d52]/50 hover:bg-[#1a6d52]/10">
                        <Play className="h-7 w-7 text-white/80 ml-1" />
                      </div>
                      <p className="text-xs text-zinc-500 font-mono">
                        Click to play
                      </p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
