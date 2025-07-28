/* eslint-disable @typescript-eslint/no-explicit-any */
// context/TourContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  TourProvider as ReactourProvider,
  StepType,
  useTour,
} from "@reactour/tour";
import { useAuth } from "./AuthContext";

interface TourContextProps {
  startTour: (customSteps?: StepType[]) => void;
  completed: boolean;
}

const TourContext = createContext<TourContextProps | null>(null);

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [steps, setSteps] = useState<StepType[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("tourCompleted");
    if (done === "true") setCompleted(true);
  }, []);

  const defaultSteps: StepType[] = [
    {
      selector: ".login-signup",
      content: isLoggedIn
        ? "Connect wallet to Explore the app."
        : "Start here — register or login and connect your wallet to begin.",
    },
    {
      selector: ".mint-button",
      content:
        "InstaMint your first memory here — turn it into a digital collectible instantly.",
    },
    {
      selector: ".explore-collection",
      content:
        "Browse and explore collections created by you and others in the community.",
    },
  ];

  return (
    <ReactourProvider
      steps={steps.length ? steps : defaultSteps}
      styles={tourStyles}
    >
      <TourContextImpl
        setSteps={setSteps}
        setCompleted={setCompleted}
        completed={completed}
      >
        {children}
      </TourContextImpl>
    </ReactourProvider>
  );
};

const TourContextImpl = ({
  children,
  setSteps,
  setCompleted,
  completed,
}: {
  children: React.ReactNode;
  setSteps: React.Dispatch<React.SetStateAction<StepType[]>>;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  completed: boolean;
}) => {
  const { setIsOpen, currentStep, steps, isOpen } = useTour();

  const startTour = (customSteps?: StepType[]) => {
    if (customSteps) setSteps(customSteps);
    setIsOpen(true);
  };

  // watch when the last step finishes
  useEffect(() => {
    if (
      isOpen === false &&
      currentStep === (steps?.length || 0) - 1 &&
      !completed
    ) {
      localStorage.setItem("tourCompleted", "true");
      setCompleted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <TourContext.Provider value={{ startTour, completed }}>
      {children}
    </TourContext.Provider>
  );
};

export const useAppTour = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useAppTour must be used inside TourProvider");
  return ctx;
};

const tourStyles = {
  popover: (base: any) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
    maxWidth: "320px",
    fontFamily: "'Inter', sans-serif",
  }),
  maskArea: (base: any) => ({
    ...base,
    rx: 12, // rounded corners on highlight
  }),
  maskWrapper: (base: any) => ({
    ...base,
    color: "rgba(0, 0, 0, 0.6)",
  }),
  badge: (base: any) => ({
    ...base,
    backgroundColor: "#0bda49ff",
    color: "#fff",
    borderRadius: "50%",
  }),
  controls: (base: any) => ({
    ...base,
    marginTop: "12px",
    display: "flex",
    justifyContent: "space-between",
  }),
  close: (base: any) => ({
    ...base,
    display: "none",
  }),
  dot: (base: any, state?: { [key: string]: any }) => ({
    ...base,
    backgroundColor: state?.current ? "#0bda49ff" : "#d1d5db",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    margin: "0 4px",
    transition: "background-color 0.3s ease",
  }),
};
