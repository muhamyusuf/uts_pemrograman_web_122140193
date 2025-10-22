import PropTypes from "prop-types";
import { XIcon } from "lucide-react";

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogImage,
  MorphingDialogContainer,
} from "@/components/core/morphing-dialog";
import { cn } from "@/lib/utils";

export function MorphingDialogBasicImage({
  src,
  alt,
  previewClassName = "w-fit rounded-[4px]",
  dialogClassName = "h-auto w-full max-w-[90vw] rounded-[16px] object-contain lg:h-[80vh]",
  contentClassName = "relative flex w-full flex-col gap-6 overflow-hidden rounded-[20px] bg-slate-950/80 p-6 shadow-2xl backdrop-blur-lg",
  children,
  onImageLoad,
  hidden = false,
}) {
  return (
    <MorphingDialog
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <MorphingDialogTrigger>
        <MorphingDialogImage
          src={src}
          alt={alt}
          className={previewClassName}
          onLoad={onImageLoad}
          style={hidden ? { display: "none" } : undefined}
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className={cn(contentClassName)}>
          <MorphingDialogImage
            src={src}
            alt={alt}
            className={dialogClassName}
          />
          {children}
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed right-6 top-6 h-fit w-fit rounded-full bg-white/80 p-1 shadow-lg backdrop-blur"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

MorphingDialogBasicImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  previewClassName: PropTypes.string,
  dialogClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  children: PropTypes.node,
  onImageLoad: PropTypes.func,
  hidden: PropTypes.bool,
};
