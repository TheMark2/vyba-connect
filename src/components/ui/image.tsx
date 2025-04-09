
import React from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const Image = ({ className, src, alt, fallback = "/placeholder.svg", ...props }: ImageProps) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  
  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    setImgSrc(fallback);
  };

  return (
    <img
      className={cn("object-cover", className)}
      src={imgSrc}
      alt={alt || "Image"}
      onError={handleError}
      {...props}
    />
  );
};

export default Image;
