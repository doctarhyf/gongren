export default function ActionButton({
  title,
  icon,
  onClick,
  disabled = false,
}) {
  return (
    <button
      className="   hover:bg-sky-700 hover:text-white flex gap-2 justify-center items-center border border-slate-500 rounded-md px-2 my-1 h-fit"
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <img src={icon} className=" w-4 h-4  " />}
      {title && (
        <span className=" font-bold uppercase text-xs p-1  ">{title}</span>
      )}
    </button>
  );
}
