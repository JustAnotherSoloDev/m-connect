import cssStyles from "./Mic.module.scss";
import iconStyles from "../globalIcon.module.scss";

export const Mic = ({ isDisabled = false }: { isDisabled?: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 46 46"
      className={`${cssStyles["mic-svg"]} ${iconStyles["icon-container"]}`}
    >
      <path
        d="M62.9 30.5v15.2c0 12-9.2 21.8-21 22.8v7.7h6.8c1.1 0 1.9.9 1.9 1.9 0 1.1-.9 1.9-1.9 1.9H31.3c-1.1 0-1.9-.9-1.9-1.9 0-1 .9-1.9 1.9-1.9h6.8v-7.7c-11.7-1-21-10.8-21-22.8V30.5c0-1.1.9-1.9 1.9-1.9 1.1 0 1.9.9 1.9 1.9v15.2c0 10.5 8.5 19 19 19s19-8.5 19-19V30.5c0-1.1.9-1.9 1.9-1.9 1 0 2.1.8 2.1 1.9z"
        transform="translate(1.69 .725) scale(.55688)"
        vectorEffect="non-scaling-stroke"
        className={cssStyles["lower-body"]}
      />
      <path
        d="M40 61c8.4 0 15.2-6.8 15.2-15.2V15.3C55.2 6.8 48.4 0 40 0c-8.4 0-15.2 6.8-15.2 15.2v30.5C24.8 54.1 31.6 61 40 61z"
        transform="translate(1.69 .725) scale(.55688)"
        className={cssStyles["upper-body"]}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M51.4 28.6V15.2c0-6.3-5.1-11.4-11.4-11.4-6.3 0-11.4 5.1-11.4 11.4v13.3l22.8.1z"
        transform="translate(1.69 .725) scale(.55688)"
        vectorEffect="non-scaling-stroke"
        className={cssStyles["dots-body"]}
      />
      <path
        d="M34.3 22.9c0 1.1-.9 1.9-1.9 1.9-1 0-1.9-.9-1.9-1.9 0-1 .9-1.9 1.9-1.9 1 0 1.9.8 1.9 1.9zm-1.9-5.8c1.1 0 1.9-.9 1.9-1.9 0-1-.9-1.9-1.9-1.9-1 0-1.9.9-1.9 1.9 0 1 .8 1.9 1.9 1.9zm3.8 0c-1.1 0-1.9.9-1.9 1.9 0 1 .9 1.9 1.9 1.9 1 0 1.9-.9 1.9-1.9 0-1-.9-1.9-1.9-1.9zm7.6-3.8c1.1 0 1.9-.9 1.9-1.9 0-1.1-.9-1.9-1.9-1.9-1 0-1.9.9-1.9 1.9 0 1 .9 1.9 1.9 1.9zM40 17.1c1.1 0 1.9-.9 1.9-1.9 0-1-.9-1.9-1.9-1.9-1 0-1.9.9-1.9 1.9 0 1 .8 1.9 1.9 1.9zm-3.8-7.6c-1.1 0-1.9.9-1.9 1.9 0 1 .9 1.9 1.9 1.9 1 0 1.9-.9 1.9-1.9 0-1-.9-1.9-1.9-1.9zM40 21c-1.1 0-1.9.9-1.9 1.9 0 1 .9 1.9 1.9 1.9 1 0 1.9-.9 1.9-1.9 0-1-.8-1.9-1.9-1.9zm7.6-7.7c-1.1 0-1.9.9-1.9 1.9 0 1 .9 1.9 1.9 1.9 1 0 1.9-.9 1.9-1.9 0-1-.8-1.9-1.9-1.9zm0 7.7c-1.1 0-1.9.9-1.9 1.9 0 1 .9 1.9 1.9 1.9 1 0 1.9-.9 1.9-1.9 0-1-.8-1.9-1.9-1.9zm-3.8-3.9c-1.1 0-1.9.9-1.9 1.9 0 1 .9 1.9 1.9 1.9 1 0 1.9-.9 1.9-1.9 0-1-.8-1.9-1.9-1.9z"
        transform="translate(1.69 .725) scale(.55688)"
        vectorEffect="non-scaling-stroke"
        className={cssStyles["dots"]}
      />
      <path
        strokeLinecap="round"
        d="m-12.498-12.585-6.74-6.787 38.476 38.744z"
        transform="matrix(.96166 0 0 .77432 24.187 22.552)"
        vectorEffect="non-scaling-stroke"
        className={`${cssStyles["cut"]} ${
          isDisabled ? cssStyles["disabled"] : cssStyles["enabled"]
        }`}
      />
    </svg>
  );
};
