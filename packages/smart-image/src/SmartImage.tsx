import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

type StyleOptions = {
  wrapperStyles?: object
  imageStyles?: object
  stubImageStyles?: object
}

type Handlers = {
  onLoaded?: Function
  onRender?: Function
  onImageIntersect?: Function
  onLoadingReady?: Function
}

type SmartImageProps = {
  src: string,
  alt: string,
  lazy?: boolean
  options?: {
    styles: StyleOptions
  }
  handlers?: Handlers
}

const SmartImage: React.FC<SmartImageProps> = ({src, alt, lazy, options, handlers}) => {
  const [isReady, setReady] = useState(false);
  const onReady = useCallback(() => {
    setReady(true);
    if (handlers?.onLoadingReady) {
      handlers.onLoadingReady();
    }
  }, []);
  const [isLazy, setLaze] = useState(lazy);
  const wrapperRef: React.MutableRefObject<any> = useRef();
  const imageRef: React.MutableRefObject<any> = useRef();
  const sourcePath = useMemo(() => isLazy ? '' : src, [isLazy]);

  useEffect(() => {
    if (isLazy) {
      if (
        imageRef.current instanceof HTMLElement &&
        wrapperRef.current instanceof HTMLElement
      ) {
        const hasIntersectionObserver = Boolean(IntersectionObserver);
        if (hasIntersectionObserver) {

          const viewport$ = new IntersectionObserver((entries, $) => {
            entries.forEach(({ isIntersecting }) => {
              if (isIntersecting) {
                imageRef.current.src = src;
                $.disconnect();
                if (handlers?.onImageIntersect) handlers.onImageIntersect();
              }
            });
          });
          viewport$.observe(wrapperRef.current);
        } else {
          setLaze(false);
        }
      }
    }
  }, [
    imageRef,
    wrapperRef
  ]);

  return (
    <figure
      ref={wrapperRef}
      style={options?.styles?.wrapperStyles}
    >
      <img
        ref={imageRef}
        alt={alt} src={sourcePath}
        style={options?.styles?.imageStyles}
        onLoad={onReady}
      />
      <div style={options?.styles?.stubImageStyles} />
    </figure>
  );
};

export default React.memo(SmartImage);
