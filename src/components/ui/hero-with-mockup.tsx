
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mockup } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";

interface HeroWithMockupProps {
  title: string;
  description: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
  mockupImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  className?: string;
}

export function HeroWithMockup({
  title,
  description,
  primaryCta = {
    text: "Get Started",
    href: "/get-started"
  },
  secondaryCta = {
    text: "GitHub",
    href: "https://github.com/your-repo",
    icon: <div className="mr-2 h-4 w-4" />
  },
  mockupImage,
  className
}: HeroWithMockupProps) {
  return (
    <section className={cn(
      "relative bg-background text-foreground",
      "py-12 px-4 md:py-24 lg:py-32",
      "overflow-hidden",
      className
    )}>
      <div className="relative mx-auto max-w-[1280px] flex flex-col gap-12 lg:gap-24">
        <div className="relative z-10 flex flex-col items-center gap-6 pt-8 md:pt-16 text-center lg:gap-12">
          {/* Heading */}
          <h1 className={cn(
            "inline-block animate-appear",
            "bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground",
            "bg-clip-text text-transparent",
            "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
            "leading-[1.1] sm:leading-[1.1]",
            "drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          )}>
            {title}
          </h1>

          {/* Description */}
          <p className={cn(
            "max-w-[550px] animate-appear opacity-0 [animation-delay:150ms]",
            "text-base sm:text-lg md:text-xl",
            "text-muted-foreground",
            "font-medium"
          )}>
            {description}
          </p>

          {/* CTAs */}
          <div className="relative z-10 flex flex-wrap justify-center gap-4 animate-appear opacity-0 [animation-delay:300ms]">
            <Button asChild size="lg" className={cn(
              "bg-gradient-to-b from-primary to-primary/90 dark:from-primary/90 dark:to-primary/80",
              "hover:from-primary/95 hover:to-primary/85 dark:hover:from-primary/80 dark:hover:to-primary/70",
              "text-primary-foreground shadow-lg",
              "transition-all duration-300 transform hover:scale-105"
            )}>
              <a href={primaryCta.href}>{primaryCta.text}</a>
            </Button>

            <Button asChild size="lg" variant="ghost" className={cn(
              "text-foreground/80 dark:text-foreground/70",
              "transition-all duration-300 transform hover:scale-105"
            )}>
              <a href={secondaryCta.href}>
                {secondaryCta.icon}
                {secondaryCta.text}
              </a>
            </Button>
          </div>

          {/* Mockup */}
          <div className="relative w-full pt-12 px-4 sm:px-6 lg:px-8">
            <Mockup className={cn(
              "animate-appear opacity-0 [animation-delay:700ms]",
              "shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]",
              "border-primary/10 dark:border-primary/5",
              "transform transition-all duration-500 hover:scale-[1.02]"
            )}>
              <img
                src={mockupImage.src}
                alt={mockupImage.alt}
                width={mockupImage.width}
                height={mockupImage.height}
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </Mockup>
          </div>
        </div>
      </div>

      {/* Enhanced Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Glow variant="above" className="animate-appear-zoom opacity-0 [animation-delay:1000ms]" />
        
        {/* Additional animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow [animation-delay:500ms]" />
        
        {/* Floating particles */}
        <div className="absolute top-1/3 left-1/6 w-2 h-2 bg-primary/20 rounded-full animate-bounce [animation-delay:2s]" />
        <div className="absolute top-2/3 right-1/6 w-1 h-1 bg-accent/30 rounded-full animate-bounce [animation-delay:3s]" />
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-primary/15 rounded-full animate-bounce [animation-delay:4s]" />
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
    </section>
  );
}
