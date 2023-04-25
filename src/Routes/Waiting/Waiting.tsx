import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../../Store/user/user";
import { getUserMediaStream } from "../../Connection/Connection";

export const WaitingArea = () => {
  const user = useUserStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [{ isMediaAvailable, stream }, setMedia] = useState<{
    isMediaAvailable: boolean;
    stream?: MediaStream;
  }>({
    isMediaAvailable: false,
  });
  useEffect(() => {
    if (isMediaAvailable && videoRef.current) {
      videoRef.current.srcObject = stream as any;
      videoRef.current.play();
    }
  }, [isMediaAvailable]);

  getUserMediaStream((stream) => {
    if (!isMediaAvailable) {
      setMedia({ isMediaAvailable: true, stream });
    }
  });
  return (
    <div className="flex justify-center align-center full-height flex-direction-column">
      <div>
        <video width={500}  height={300} muted ref={videoRef} />
      </div>
      <div>
        Waiting for others to join Please share below Id with friends to join
      </div>
      <div>{user.id}</div>
    </div>
  );
};
