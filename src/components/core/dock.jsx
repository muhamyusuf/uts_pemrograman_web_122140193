import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;

// Konteks untuk Dock
const DockContext = createContext(undefined);

// Provider untuk DockContext
function DockProvider({ children, value }) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

DockProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({
    mouseX: PropTypes.object.isRequired,
    spring: PropTypes.object.isRequired,
    magnification: PropTypes.number.isRequired,
    distance: PropTypes.number.isRequired,
  }).isRequired,
};

// Hook kustom untuk mengakses nilai DockContext
function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error("useDock must be used within an DockProvider");
  }
  return context;
}

// Komponen utama Dock container
function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{
        height: height,
        scrollbarWidth: "none",
      }}
      className="mx-2 flex max-w-full items-end overflow-x-auto"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={cn(
          "mx-auto flex w-fit gap-4 rounded-2xl bg-gray-50 px-4 dark:bg-neutral-900",
          className
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

Dock.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  distance: PropTypes.number,
  panelHeight: PropTypes.number,
  magnification: PropTypes.number,
  spring: PropTypes.object,
};

// Komponen untuk setiap item di dalam Dock
function DockItem({ children, className, onClick }) {
  const ref = useRef(null);

  const { distance, magnification, mouseX, spring } = useDock();

  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const width = useSpring(widthTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      onClick={onClick}
    >
      {Children.map(children, (child) => {
        // Memastikan child adalah React element sebelum di-clone
        if (typeof child === "object" && child !== null && "props" in child) {
          return cloneElement(child, { width, isHovered });
        }
        return child;
      })}
    </motion.div>
  );
}

DockItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

// Komponen label yang muncul saat DockItem di-hover
function DockLabel({ children, className, ...rest }) {
  const { isHovered } = rest; // 'isHovered' di-passing oleh cloneElement dari DockItem
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Memastikan isHovered (MotionValue) ada sebelum berlangganan
    if (isHovered && typeof isHovered.on === "function") {
      const unsubscribe = isHovered.on("change", (latest) => {
        setIsVisible(latest === 1);
      });

      return () => unsubscribe();
    }
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white",
            className
          )}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

DockLabel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// Komponen ikon di dalam DockItem
function DockIcon({ children, className, ...rest }) {
  const { width } = rest; // 'width' di-passing oleh cloneElement dari DockItem

  // Hanya terapkan transform jika width (MotionValue) ada
  const widthTransform = width
    ? useTransform(width, (val) => val / 2)
    : undefined;

  return (
    <motion.div
      style={{ width: widthTransform }}
      className={cn("flex items-center justify-center", className)}
    >
      {children}
    </motion.div>
  );
}

DockIcon.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { Dock, DockIcon, DockItem, DockLabel };
