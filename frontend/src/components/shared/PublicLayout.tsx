import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#080c18]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c18] via-[#0b1226]/90 to-[#1e144a]/90"></div>
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-gradient-to-br from-primary/30 via-secondary/25 to-transparent rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-tertiary/20 rounded-full blur-[160px]"></div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[450px] h-[800px] bg-primary/5 blur-[120px]"></div>
      </div>
      <div className="relative z-10 w-full min-h-screen">
        <Outlet />
      </div>
    </>
  );
}
