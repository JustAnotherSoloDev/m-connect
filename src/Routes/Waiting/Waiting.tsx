import { useUserStore } from "../../Store/user/user";

export const WaitingArea = () => {
  const user = useUserStore();
  return (
    <div>
      waiting for others to join
      <br />
      PLease share below Id with friends to join
      <br />
      {user.id}
    </div>
  );
};
