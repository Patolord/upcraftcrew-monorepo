import { Logo, LogoSmall } from "./logo";

const tableOfContents = [
  { page: "03", title: "QUEM SOMOS" },
  { page: "04", title: "OBJETIVOS" },
  { page: "05", title: "ESCOPO DO PROJETO" },
  { page: "06", title: "EXTRAS E COMERCIAL" },
];

export function IndexPage() {
  return (
    <div
      className="w-[794px] h-[1123px] relative flex flex-col"
      style={{ backgroundColor: "#3C3C3C" }}
    >
      {/* Header with logo */}
      <div className="pt-8 px-12 flex justify-end">
        <div className="flex items-center gap-2">
          <svg
            width={40}
            height={40}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M32 8L52 24L32 40L12 24L32 8Z" fill="#F2994A" />
            <path d="M32 24L52 40L32 56L12 40L32 24Z" fill="#E07A2F" />
          </svg>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-sm text-white">UPCRAFT</span>
            <span className="font-bold text-sm" style={{ color: "#F2994A" }}>
              CREW
            </span>
          </div>
        </div>
        <div
          className="absolute top-20 right-12 w-16 h-[1px]"
          style={{ backgroundColor: "#F2994A" }}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-end pb-32">
        <div className="w-full px-16">
          <div className="flex items-end gap-8">
            {/* Left side - logo and title */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-4 mb-4">
                <svg
                  width={48}
                  height={48}
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M32 8L52 24L32 40L12 24L32 8Z" fill="#F2994A" />
                  <path d="M32 24L52 40L32 56L12 40L32 24Z" fill="#E07A2F" />
                </svg>
              </div>
              <div className="relative">
                <div
                  className="absolute -left-4 top-0 w-[200px] h-[1px]"
                  style={{ backgroundColor: "#969696" }}
                />
                <h2 className="text-4xl font-bold text-white mt-2">índice</h2>
              </div>
            </div>

            {/* Right side - table of contents */}
            <div className="flex-1 ml-8">
              <div className="border" style={{ borderColor: "#969696" }}>
                {tableOfContents.map((item, index) => (
                  <div
                    key={item.page}
                    className="flex items-center border-b last:border-b-0"
                    style={{ borderColor: "#969696" }}
                  >
                    <div
                      className="w-20 py-4 text-center text-2xl font-bold text-white border-r"
                      style={{ borderColor: "#969696" }}
                    >
                      {item.page}
                    </div>
                    <div className="flex-1 px-6 py-4">
                      <span className="text-white uppercase tracking-wide">{item.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
