import CardList from "./CardList";

/**
 * Hero section providing a summary dashboard.
 */
const Hero = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 mt-35 md:mt-40">
      <div className="flex flex-col gap-6 sm:gap-5">
        <h1 className="text-3xl md:text-5xl font-bold font-geist-sans leading-wide text-text">
          Welcome, Commander!
        </h1>
        <p className="text-sm md:text-base text-text/60 tracking-wide font-geist-sans">
          Track your tasks, build streaks, and stay productive.
        </p>
      </div>

      <CardList />
    </div>
  );
};

export default Hero;
