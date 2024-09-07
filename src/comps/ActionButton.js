export default function ActionButton({
  title,
  icon,
  onClick,
  disabled = false,
}) {
  return (
    <button
      className=" hover:bg-sky-700 hover:text-white flex gap-2 justify-center items-center border rounded-md px-2 my-auto h-fit"
      onClick={onClick}
      disabled={disabled}
    >
      <img src={icon} className=" w-4 h-4  " />
      {title}
    </button>
  );
}