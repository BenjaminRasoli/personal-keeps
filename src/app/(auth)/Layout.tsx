import { SetBodyClass } from "../components/SetBodyClass";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SetBodyClass className="bg-gray-100" />
      <div>{children}</div>
    </>
  );
}
