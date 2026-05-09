import CardList from "./CardList";

const Hero = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-18 px-6">
      <div className="flex flex-col justify-start space-y-4 sm:space-y-3">
        <h1 className="font-bold text-3xl sm:text-[2.5rem] text-text leading-tight text-left font-geist-sans">
          Good Morning, Commander.
        </h1>
        <p className="text-text/60 text-sm sm:text-base font-medium leading-relaxed font-geist-sans">
          Your productivity pulse is optimal today.
        </p>
      </div>

      <CardList />
    </div>
  );
};

export default Hero;
