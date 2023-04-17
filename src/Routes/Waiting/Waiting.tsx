import { useUserStore } from "../../Store/user/user";

export const WaitingArea = () => {
  const user = useUserStore();
  return (
    <div className="flex">
      <div>
        Waiting for others to join
        <br />
        Please share below Id with friends to join
        <br />
        {user.id}
      </div>
    </div>
  );
};
