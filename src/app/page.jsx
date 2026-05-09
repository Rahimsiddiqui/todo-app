import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Todo from "@/components/Todo";
import CreateTaskModal from "@/components/CreateTaskModal";
import MobileMenuSheet from "@/components/MobileMenuSheet";
import CommandMenu from "@/components/CommandMenu";

/**
 * Root Landing Page layout. 
 * Orchestrates the primary view and global overlay components.
 */
const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Todo />
      
      {/* Global Overlays & Modals */}
      <CreateTaskModal />
      <MobileMenuSheet />
      <CommandMenu />
    </>
  );
};

export default LandingPage;
