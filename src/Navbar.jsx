import { attIcon } from "./constants";

export default () => {
  const navlinkclassNamees =
    " pad-t-xs pad-b-xs pad-l-xs pad-r-xs mar-r-xxs  justify-center nav-link css-bold no-underline type-sm flex flex-items-center justify-center color-cobalt-600 link-text3";

  return (
    <div className="full-width-background custom-shadow z2 border border-cobalt-800">
      <div className="full-width-background flex pad-l-md pad-r-md flex-items-center justify-between ">
        <div className={navlinkclassNamees}>{attIcon}</div>
        <div className="text-base color-cobalt-600 css-bold">DTT</div>
      </div>
    </div>
  );
};
