import React from "react";
import cssStyles from "./button.module.scss";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button className={cssStyles["btn"]} {...props}>
      {children}
    </button>
  );
};

export const IconButton = ({ children, ...props }: ButtonProps) => {
  return (
    <button className={`${cssStyles["btn"]} ${cssStyles["btn-icon"]}`} {...props}>
      {children}
    </button>
  );
};
