"use client";

import { motion, type MotionProps } from "framer-motion";

const defaultVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

type Props = {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  amount?: number;
} & MotionProps;

export default function ScrollFadeIn({
  as: Component = "div",
  children,
  className,
  amount = 0.35,
  ...motionProps
}: Props) {
  return (
    <motion.div
      as={Component as never}
      className={className}
      variants={defaultVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1], ...(motionProps.transition || {}) }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
