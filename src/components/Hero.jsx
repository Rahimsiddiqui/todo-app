import CardList from "./CardList";

/**
 * Hero section providing a summary dashboard.
 */
const Hero = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 mt-10 md:mt-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-bold font-mono tracking-tight text-text">
          Focus on what <br className="hidden md:block" /> matters.
        </h1>
        <p className="text-sm md:text-base text-text/60 font-mono">
          Track your tasks, build streaks, and stay productive.
        </p>
      </div>

      <CardList />
    </div>
  );
};

export default Hero;
