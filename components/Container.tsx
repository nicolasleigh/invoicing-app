import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

// https://www.totaltypescript.com/react-component-props-type-helper
type ContainerProps = ComponentProps<"div">;

export default function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div {...props} className={cn("max-w-5xl mx-auto px-5", className)}>
      {children}
    </div>
  );
}
